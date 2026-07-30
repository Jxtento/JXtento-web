'use client';

import { Navbar } from '@/components/layout/Navbar';

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-24 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col justify-between items-start mb-8 gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Exit Guard Dashboard
          </h1>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 shadow-2xl min-h-[400px]">
          <div className="flex flex-col items-center justify-center h-full text-white/40 py-20">
            <span className="text-4xl mb-4">🟣</span>
            <p>Solana Guarded Positions</p>
            <p className="text-sm mt-2">Connect wallet to view</p>
          </div>
        </div>
      </div>
    </>
  );
}
