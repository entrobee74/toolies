/**
 * FREE TOOLS SUITE — Global Navigation & Tool Switcher
 * Allows users to switch seamlessly between PIXELTEXT and DEGENCALC
 * via header tabs or expandable sidebar drawer.
 */

import React, { useState } from 'react';
import { Type, Calculator, Menu, X, Sparkles, ExternalLink, Zap, Shield, ChevronRight } from 'lucide-react';

export type ActiveTool = 'pixeltext' | 'degencalc';

interface GlobalToolBarProps {
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
}

export const GlobalToolBar: React.FC<GlobalToolBarProps> = ({
  activeTool,
  onSelectTool,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tools = [
    {
      id: 'pixeltext' as ActiveTool,
      name: 'PixelText',
      tagline: 'AI Image Text Editor',
      description: 'Edit or replace any text inside images while matching fonts, lighting & style.',
      icon: Type,
      badge: 'NEW AI TOOL',
      badgeColor: 'bg-[#00DDCB]/10 text-[#00DDCB] border-[#00DDCB]/30',
      activeBorder: 'border-[#00DDCB] text-[#00DDCB]',
    },
    {
      id: 'degencalc' as ActiveTool,
      name: 'DegenCalc',
      tagline: 'Memecoin Profit & Fee Terminal',
      description: 'Live DexScreener lookup, price impact meter, break-even multiple, and 1080x1350 cards.',
      icon: Zap,
      badge: 'POPULAR',
      badgeColor: 'bg-[#c5f300]/10 text-[#c5f300] border-[#c5f300]/30',
      activeBorder: 'border-[#c5f300] text-[#c5f300]',
    },
  ];

  return (
    <>
      {/* Top Banner / Global Suite Bar */}
      <div className="bg-[#0e0e0e] border-b border-[#2A2A2A] px-3 sm:px-6 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Suite Logo & Switcher Tabs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
              title="Open Tools Sidebar"
            >
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline font-mono text-[11px] font-bold">ALL TOOLS</span>
            </button>

            <span className="text-gray-600 font-mono hidden sm:inline">|</span>

            {/* Quick switcher buttons */}
            <div className="flex items-center gap-1.5 font-space">
              {tools.map((t) => {
                const isActive = activeTool === t.id;
                const IconComponent = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => onSelectTool(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${
                      isActive
                        ? t.id === 'pixeltext'
                          ? 'bg-[#1A1A1A] text-[#00DDCB] border border-[#00DDCB]/50 teal-glow-sm'
                          : 'bg-[#181E18] text-[#c5f300] border border-[#c5f300]/50 lime-glow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{t.name}</span>
                    <span className="hidden md:inline text-[10px] text-gray-500 font-normal">
                      ({t.tagline})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: 100% Free & No Sign-up Guarantee */}
          <div className="flex items-center gap-3 text-[11px] font-inter text-gray-400">
            <span className="hidden lg:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00DDCB] animate-pulse" />
              <span>100% Free Browser Tools</span>
              <span>•</span>
              <span>No Accounts Required</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar Drawer Modal */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-[#121212] border-r border-[#2A2A2A] p-5 flex flex-col justify-between z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A] mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] border border-[#00DDCB]/40 flex items-center justify-center text-[#00DDCB]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-space font-bold text-sm text-white">FREE TOOLS SUITE</h3>
                    <p className="text-[10px] font-inter text-gray-400">Browser-based utilities</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tools List */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono uppercase text-gray-500 tracking-wider">
                  Available Web Tools
                </div>

                {tools.map((tool) => {
                  const isActive = activeTool === tool.id;
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        onSelectTool(tool.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                        isActive
                          ? tool.id === 'pixeltext'
                            ? 'bg-[#1A1A1A] border-[#00DDCB]/60 teal-glow-sm'
                            : 'bg-[#181E18] border-[#c5f300]/60 lime-glow-sm'
                          : 'bg-[#161616] border-[#2A2A2A] hover:bg-[#1E1E1E] hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                              tool.id === 'pixeltext'
                                ? 'bg-[#00DDCB]/10 text-[#00DDCB]'
                                : 'bg-[#c5f300]/10 text-[#c5f300]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-space font-bold text-sm text-white block">
                              {tool.name}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">
                              {tool.tagline}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${tool.badgeColor}`}
                        >
                          {tool.badge}
                        </span>
                      </div>

                      <p className="text-xs font-inter text-gray-400 mt-1 leading-relaxed">
                        {tool.description}
                      </p>

                      <div className="flex items-center justify-end text-[11px] font-space font-semibold text-gray-300 mt-1 gap-1">
                        <span>Launch Tool</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom info */}
            <div className="pt-4 border-t border-[#2A2A2A] text-[11px] font-inter text-gray-500">
              <p>All tools run client-side with zero data retention.</p>
              <p className="mt-1">Monetized by Google AdSense &amp; Coinzilla.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
