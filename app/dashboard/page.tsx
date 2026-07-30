'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { GuardedPositionRbc, GuardedPosition } from '@/components/rbc/GuardedPositionRbc';

// Mock data for display purposes
const MOCK_RBC_POSITIONS: GuardedPosition[] = [
  {
    id: '1',
    tokenName: 'Robinhood Token',
    tokenSymbol: 'RBC',
    mint: '0x123...abc',
    amount: '1000',
    pnlPercentage: 25.5,
    unrealizedPnl: '255.00',
    currentValue: '1255.00',
    entryPrice: '1.00',
    currentPrice: '1.255'
  }
];

export default function DashboardPage() {
  const [network, setNetwork] = useState<'SOLANA' | 'RBC'>('SOLANA');
  const [positions, setPositions] = useState<GuardedPosition[]>(MOCK_RBC_POSITIONS);

  const handleClose = (id: string) => {
    setPositions(prev => prev.filter(p => p.id !== id));
    console.log("Force closing position:", id);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-24 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Exit Guard Dashboard
          </h1>

          {/* Network Toggle */}
          <div className="flex items-center bg-[#111] border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setNetwork('SOLANA')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                network === 'SOLANA'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-sm'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Solana
            </button>
            <button
              onClick={() => setNetwork('RBC')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                network === 'RBC'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Robinhood Chain
            </button>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 shadow-2xl min-h-[400px]">
          {network === 'SOLANA' ? (
            <div className="flex flex-col items-center justify-center h-full text-white/40 py-20">
              <span className="text-4xl mb-4">🟣</span>
              <p>Solana Guarded Positions</p>
              <p className="text-sm mt-2">Connect wallet to view</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-white/80 mb-6">Active RBC Positions</h2>
              {positions.length > 0 ? (
                positions.map(pos => (
                  <GuardedPositionRbc key={pos.id} position={pos} onClose={handleClose} />
                ))
              ) : (
                <div className="text-center text-white/40 py-12">
                  No active guarded positions on RBC
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
