'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GuardedTab } from '@/components/terminal/GuardedTab';
import { CopilotTab } from '@/components/terminal/CopilotTab';
import { KolLiveFeed } from '@/components/terminal/KolLiveFeed';
import { NewsLiveFeed } from '@/components/terminal/NewsLiveFeed';
import { ActivityLog } from '@/components/terminal/ActivityLog';
import { LaunchRadarTab } from '@/components/terminal/LaunchRadarTab';
import { AxiomProTab } from '@/components/terminal/AxiomProTab';

export default function TerminalPage() {
  const [activeTab, setActiveTab] = useState<"radar" | "kol" | "news" | "axiom" | "activity" | "guarded" | "copilot">("kol");

  return (
    <div className="flex flex-col h-screen w-full bg-[var(--paper)] text-[var(--ink)]">
      {/* Main Terminal Container */}
      <div className="flex-1 flex justify-center h-full w-full">
        <main className="w-full h-full bg-axiom-bg flex flex-col overflow-hidden text-axiom-text">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-axiom-border bg-axiom-panel">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image src="/logo-jxtento.png" alt="JXtento Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className="font-bold leading-tight">JXtento Pro</h1>
                <p className="text-xs text-axiom-muted">Solana Intelligence</p>
              </div>
            </div>
            <Link 
              href="/" 
              className="px-3 py-1.5 text-xs font-semibold rounded bg-axiom-bg border border-axiom-border text-axiom-muted hover:text-axiom-text hover:border-axiom-text transition-colors flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Home
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 px-4 pt-4 border-b border-axiom-border overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button 
              onClick={() => setActiveTab("radar")}
              className={`whitespace-nowrap flex-shrink-0 text-sm font-bold pb-2 -mb-[1px] border-b-2 transition-colors ${activeTab === 'radar' ? 'text-axiom-text border-axiom-text' : 'text-axiom-muted border-transparent hover:text-axiom-text/80'}`}
            >
              Launch Radar
            </button>
            <button 
              onClick={() => setActiveTab("kol")}
              className={`whitespace-nowrap flex-shrink-0 text-sm font-bold pb-2 -mb-[1px] border-b-2 transition-colors ${activeTab === 'kol' ? 'text-axiom-text border-axiom-text' : 'text-axiom-muted border-transparent hover:text-axiom-text/80'}`}
            >
              KOL Live
            </button>
            <button 
              onClick={() => setActiveTab("news")}
              className={`whitespace-nowrap flex-shrink-0 text-sm font-bold pb-2 -mb-[1px] border-b-2 transition-colors ${activeTab === 'news' ? 'text-axiom-text border-axiom-text' : 'text-axiom-muted border-transparent hover:text-axiom-text/80'}`}
            >
              News
            </button>
            <button 
              onClick={() => setActiveTab("axiom")}
              className={`whitespace-nowrap flex-shrink-0 text-sm font-bold pb-2 -mb-[1px] border-b-2 transition-colors ${activeTab === 'axiom' ? 'text-axiom-text border-axiom-text' : 'text-axiom-muted border-transparent hover:text-axiom-text/80'}`}
            >
              Axiom Pro
            </button>
            <button 
              onClick={() => setActiveTab("activity")}
              className={`whitespace-nowrap flex-shrink-0 text-sm font-bold pb-2 -mb-[1px] border-b-2 transition-colors ${activeTab === 'activity' ? 'text-axiom-text border-axiom-text' : 'text-axiom-muted border-transparent hover:text-axiom-text/80'}`}
            >
              Activity
            </button>
            <button 
              onClick={() => setActiveTab("guarded")}
              className={`whitespace-nowrap flex-shrink-0 text-sm font-bold pb-2 -mb-[1px] border-b-2 transition-colors ${activeTab === 'guarded' ? 'text-axiom-text border-axiom-text' : 'text-axiom-muted border-transparent hover:text-axiom-text/80'}`}
            >
              Guarded
            </button>
            <button 
              onClick={() => setActiveTab("copilot")}
              className={`whitespace-nowrap flex-shrink-0 text-sm font-bold pb-2 -mb-[1px] border-b-2 transition-colors ${activeTab === 'copilot' ? 'text-axiom-text border-axiom-text' : 'text-axiom-muted border-transparent hover:text-axiom-text/80'}`}
            >
              Copilot ✨
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'guarded' ? (
              <GuardedTab />
            ) : activeTab === 'copilot' ? (
              <CopilotTab />
            ) : activeTab === 'kol' ? (
              <KolLiveFeed />
            ) : activeTab === 'news' ? (
              <NewsLiveFeed />
            ) : activeTab === 'activity' ? (
              <ActivityLog />
            ) : activeTab === 'radar' ? (
              <LaunchRadarTab />
            ) : activeTab === 'axiom' ? (
              <AxiomProTab />
            ) : (
              <div className="p-6 text-center mt-8 border border-axiom-border border-dashed rounded-lg">
                <span className="text-4xl mb-4 block">🚧</span>
                <h2 className="text-lg font-bold text-axiom-text mb-2">Work in Progress</h2>
                <p className="text-sm text-axiom-muted">
                  Porting {activeTab} components from extension...
                </p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
