/**
 * A-ADS (Anonymous Ads) Crypto Display Unit
 * Unit ID: 2456332
 */

import React from 'react';

interface AAdsUnitProps {
  className?: string;
  widthPercent?: number;
}

export const AAdsUnit: React.FC<AAdsUnitProps> = ({ className = '', widthPercent = 70 }) => {
  return (
    <div className={`w-full max-w-4xl mx-auto my-6 px-2 ${className}`}>
      <div className="bg-[#0c0c0c] border border-[#262E26] rounded-xl p-3 relative overflow-hidden">
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2 px-2">
          <span>SPONSORED (A-ADS #2456332)</span>
          <span className="text-[#c5f300] bg-[#c5f300]/10 px-1.5 py-0.5 rounded border border-[#c5f300]/30 font-bold">
            CRYPTO ADS
          </span>
        </div>

        {/* BEGIN AADS AD UNIT 2456332 */}
        <div id="frame" style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 10 }}>
          <iframe
            data-aa="2456332"
            src="//acceptable.a-ads.com/2456332/?size=Adaptive"
            style={{
              border: 0,
              padding: 0,
              width: `${widthPercent}%`,
              minHeight: '90px',
              height: 'auto',
              overflow: 'hidden',
              display: 'block',
              margin: 'auto',
            }}
            title="A-ADS Display Unit 2456332"
          />
        </div>
        {/* END AADS AD UNIT 2456332 */}
      </div>
    </div>
  );
};
