'use client';

import { useRbcFeed } from '@/hooks/rbc/useRbcFeed';
import { TrenchRow } from '@/components/rbc/TrenchRow';
import { FeedFilter } from '@/components/rbc/FeedFilter';

export default function RbcFeedPage() {
  const { tokens, loading, error, filter, setFilter } = useRbcFeed();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
            Robinhood Chain Trenches
          </h1>
          <p className="text-white/50 text-sm">
            Live token launches and liquidity events across RBC DEXes
          </p>
        </div>
        <FeedFilter currentFilter={filter} onFilterChange={setFilter} />
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-xs font-medium text-white/40 uppercase tracking-wider">
          <div className="col-span-3">Token</div>
          <div className="col-span-2">Source</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-3">Dev / Funding</div>
          <div className="col-span-2 text-right">Hoodscan Score</div>
        </div>

        <div className="divide-y divide-white/5">
          {loading && tokens.length === 0 ? (
            <div className="p-12 text-center text-white/30 text-sm animate-pulse">
              Scanning RBC mempool...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500/80 text-sm">
              Error connecting to intelligence feed
            </div>
          ) : tokens.length === 0 ? (
            <div className="p-12 text-center text-white/30 text-sm">
              No tokens found matching filters
            </div>
          ) : (
            tokens.map((token) => (
              <TrenchRow key={token.address} token={token} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
