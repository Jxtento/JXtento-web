import { RbcToken } from '@/hooks/rbc/useRbcFeed';
import { HoodscanScore } from './HoodscanScore';

interface Props {
  token: RbcToken;
}

export function TrenchRow({ token }: Props) {
  const isBundled = token.bundleSeverity !== 'CLEAN';

  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group">
      {/* Token Info */}
      <div className="col-span-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 text-xs font-bold">
          {token.symbol?.[0] || '?'}
        </div>
        <div>
          <div className="font-medium text-white group-hover:text-blue-400 transition-colors cursor-pointer">
            {token.symbol || 'Unknown'}
          </div>
          <div className="text-xs text-white/40 font-mono mt-0.5 flex items-center gap-1">
            {token.address.slice(0, 6)}...{token.address.slice(-4)}
          </div>
        </div>
      </div>

      {/* Source */}
      <div className="col-span-2">
        <span className="px-2 py-1 text-[10px] font-medium bg-white/5 border border-white/10 rounded uppercase tracking-wider text-white/60">
          {token.source}
        </span>
      </div>

      {/* Time */}
      <div className="col-span-2 text-sm text-white/50">
        {new Date(token.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>

      {/* Flags / Funding */}
      <div className="col-span-3">
        {isBundled ? (
          <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium bg-red-400/10 px-2 py-1 rounded w-fit border border-red-400/20">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Bundled
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded w-fit border border-emerald-400/20">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Clean Funding
          </div>
        )}
      </div>

      {/* Score */}
      <div className="col-span-2 flex justify-end">
        <HoodscanScore score={token.score} />
      </div>
    </div>
  );
}
