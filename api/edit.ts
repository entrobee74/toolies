/**
 * PIXELTEXT — /api/edit Serverless Endpoint
 * Vercel Serverless Function & Dev Middleware Handler
 *
 * Security Enforcements:
 * 1. Content-Type must be application/json (reject others with 415/400).
 * 2. Strict same-origin CORS: rejects cross-origin requests with 403, never uses '*'.
 * 3. GEMINI_API_KEY read ONLY from process.env, never hardcoded, never sent to client.
 * 4. Image magic bytes verification (PNG, JPEG, WEBP) server-side.
 * 5. Strict 5MB payload limit after base64 decode (returns 413).
 * 6. User instruction truncated to 500 chars with null bytes stripped.
 * 7. Rate limiter (Upstash) enforced BEFORE the Gemini call. Fails closed (503) on lookup errors.
 * 8. Never logs image data or user instructions to console.
 */

import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load .env.local if present in node environment
try {
  dotenv.config({ path: '.env.local' });
  dotenv.config();
} catch {
  // ignore in serverless environments where process.env is injected
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const DAILY_LIMIT = 10;

// In-memory fallback rate limiter for environments without Upstash credentials
const memoryRateLimit = new Map<string, { count: number; dateStr: string }>();

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  total: number;
}

/**
 * Enforces rate limit before AI call. Fails closed if any error occurs.
 */
async function checkRateLimit(clientIp: string): Promise<RateLimitResult> {
  const todayStr = new Date().toISOString().slice(0, 10);
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    const key = `ratelimit:pixeltext:${clientIp}:${todayStr}`;
    try {
      // INCR operation via Upstash REST API
      const res = await fetch(`${upstashUrl}/incr/${encodeURIComponent(key)}`, {
        headers: {
          Authorization: `Bearer ${upstashToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Upstash returned status ${res.status}`);
      }

      const data = (await res.json()) as { result?: number };
      const currentCount = typeof data.result === 'number' ? data.result : 1;

      // Set expiry of 24h on first hit
      if (currentCount === 1) {
        fetch(`${upstashUrl}/expire/${encodeURIComponent(key)}/86400`, {
          headers: { Authorization: `Bearer ${upstashToken}` },
        }).catch(() => {});
      }

      return {
        allowed: currentCount <= DAILY_LIMIT,
        remaining: Math.max(0, DAILY_LIMIT - currentCount),
        total: currentCount,
      };
    } catch (err) {
      // Fail closed: throw so handler returns 503
      throw new Error('Rate limit check failed');
    }
  }

  // Local fallback rate limiter
  try {
    const record = memoryRateLimit.get(clientIp);
    let count = 1;
    if (record && record.dateStr === todayStr) {
      count = record.count + 1;
      record.count = count;
    } else {
      memoryRateLimit.set(clientIp, { count: 1, dateStr: todayStr });
    }

    return {
      allowed: count <= DAILY_LIMIT,
      remaining: Math.max(0, DAILY_LIMIT - count),
      total: count,
    };
  } catch (err) {
    throw new Error('Local rate limit evaluation failed');
  }
}

/**
 * Validates file magic bytes
 */
function validateMagicBytes(buffer: Buffer): { valid: boolean; mimeType: string } {
  if (buffer.length < 12) {
    return { valid: false, mimeType: '' };
  }

  // PNG: 89 50 4E 47
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { valid: true, mimeType: 'image/png' };
  }

  // JPEG: FF D8 FF
  if (
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { valid: true, mimeType: 'image/jpeg' };
  }

  // WEBP: 52 49 46 46 .... 57 45 42 50 (RIFF....WEBP)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { valid: true, mimeType: 'image/webp' };
  }

  return { valid: false, mimeType: '' };
}

export default async function handler(req: any, res: any) {
  // 1. Enforce CORS: Same-origin ONLY (no '*')
  const origin = req.headers['origin'] || req.headers['Origin'];
  const host = req.headers['host'] || req.headers['Host'];

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return res.status(403).json({ error: 'Cross-origin requests forbidden' });
      }
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    } catch {
      return res.status(403).json({ error: 'Invalid origin header' });
    }
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // 2. Reject non-JSON Content-Type
  const contentType = (req.headers['content-type'] || '').toLowerCase();
  if (!contentType.includes('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }

  // 3. Extract and sanitize client IP for Rate Limiting
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp =
    (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  // 4. RATE LIMIT CHECK — Enforced BEFORE Gemini call. Fails closed (503) on error.
  let rateLimitInfo: RateLimitResult;
  try {
    rateLimitInfo = await checkRateLimit(clientIp);
  } catch {
    // Fail closed: never allow edits if rate limit lookup fails
    return res.status(503).json({
      error: 'Rate limit service unavailable. Request failed closed for security.',
    });
  }

  if (!rateLimitInfo.allowed) {
    return res.status(429).json({
      error: 'Daily limit reached (10 edits/day). Try again tomorrow.',
      dailyLimit: DAILY_LIMIT,
      remaining: 0,
    });
  }

  // 5. Read GEMINI_API_KEY from environment ONLY
  const apiKey = process.env.GEMINI_API_KEY;
  if (
    !apiKey ||
    apiKey === 'PASTE_YOUR_KEY_HERE' ||
    apiKey.trim() === '' ||
    apiKey.startsWith('PASTE_')
  ) {
    return res.status(500).json({
      error: 'Server is missing the Gemini API key. Set GEMINI_API_KEY in your environment.',
    });
  }

  // 6. Parse and validate body
  const body = req.body || {};
  if (!body.image) {
    return res.status(400).json({ error: 'Missing image in request body' });
  }

  // 7. Sanitize Instruction: truncate to 500 chars, strip null bytes
  const rawInstruction = typeof body.instruction === 'string' ? body.instruction : '';
  const sanitizedInstruction = rawInstruction.replace(/\0/g, '').slice(0, 500).trim();

  if (!sanitizedInstruction) {
    return res.status(400).json({ error: 'Instruction cannot be empty' });
  }

  // 8. Base64 decode and payload size check (max 5MB after decode)
  let cleanBase64 = String(body.image);
  if (cleanBase64.startsWith('data:')) {
    const commaIndex = cleanBase64.indexOf(',');
    if (commaIndex !== -1) {
      cleanBase64 = cleanBase64.slice(commaIndex + 1);
    }
  }

  let imageBuffer: Buffer;
  try {
    imageBuffer = Buffer.from(cleanBase64, 'base64');
  } catch {
    return res.status(400).json({ error: 'Failed to decode base64 image data' });
  }

  if (imageBuffer.length > MAX_IMAGE_BYTES) {
    return res.status(413).json({
      error: `Image payload exceeds 5MB limit (${(imageBuffer.length / (1024 * 1024)).toFixed(1)}MB provided).`,
    });
  }

  // 9. Server-side Magic Bytes Validation
  const magicCheck = validateMagicBytes(imageBuffer);
  if (!magicCheck.valid) {
    return res.status(400).json({
      error:
        'Invalid image format. Only authentic PNG, JPEG, and WEBP images are supported. File header check failed.',
    });
  }

  // 10. Call Gemini with model: gemini-2.5-flash-image (Nano Banana)
  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt =
      'Edit the text in this image per the instruction. Match the original font, size, color, perspective and background exactly. Change nothing else.';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: magicCheck.mimeType,
              },
            },
            {
              text: `${systemPrompt} User instruction: ${sanitizedInstruction}`,
            },
          ],
        },
      ],
    });

    // Inspect candidates for output image
    const candidate = response.candidates?.[0];
    if (!candidate || !candidate.content?.parts) {
      return res.status(422).json({
        error: 'No image was generated. The request may have been flagged by safety policies.',
      });
    }

    // Search parts for inline image data
    let resultImageBase64: string | null = null;
    let resultMimeType = magicCheck.mimeType;

    for (const part of candidate.content.parts) {
      if (part.inlineData && part.inlineData.data) {
        resultImageBase64 = part.inlineData.data;
        if (part.inlineData.mimeType) {
          resultMimeType = part.inlineData.mimeType;
        }
        break;
      }
    }

    if (!resultImageBase64) {
      // Fallback: check if text response exists explaining why
      const textPart = candidate.content.parts.find((p) => p.text)?.text;
      return res.status(422).json({
        error: textPart || 'Image edit completed without returning binary image output.',
      });
    }

    // Return the edited image as base64 data URL
    const editedImageUrl = `data:${resultMimeType};base64,${resultImageBase64}`;

    return res.status(200).json({
      success: true,
      editedImage: editedImageUrl,
      mimeType: resultMimeType,
      remainingEdits: rateLimitInfo.remaining,
      dailyLimit: DAILY_LIMIT,
    });
  } catch (error: any) {
    // Security: NEVER log image data or user instructions
    const errorMessage = error?.message || 'Gemini image editing failed';
    if (
      errorMessage.includes('RESOURCE_EXHAUSTED') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('429')
    ) {
      return res.status(429).json({
        error:
          'Gemini API quota exceeded for image generation. Please check your Gemini API plan, billing tier, or wait a few moments before retrying.',
      });
    }
    return res.status(502).json({
      error: `AI processing failed: ${errorMessage}`,
    });
  }
}
