export interface GuardedPosition {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  mint: string;
  amount: string;
  pnlPercentage: number;
  unrealizedPnl: string;
  currentValue: string;
  entryPrice: string;
  currentPrice: string;
}

interface Props {
  position: GuardedPosition;
  onClose: (id: string) => void;
}

export function GuardedPositionRbc({ position, onClose }: Props) {
  const isPositive = position.pnlPercentage >= 0;

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-lg">
          🏦
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white">{position.tokenName}</h3>
            <span className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded">RBC</span>
          </div>
          <p className="text-xs text-white/40 font-mono mt-0.5">
            {position.amount} {position.tokenSymbol}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:items-end gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/50">Current Value:</span>
          <span className="font-mono text-white">${position.currentValue}</span>
        </div>
        <div className={`text-sm font-bold flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '↑' : '↓'}
          {Math.abs(position.pnlPercentage).toFixed(2)}% (${position.unrealizedPnl})
        </div>
      </div>

      <button
        onClick={() => onClose(position.id)}
        className="w-full sm:w-auto px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-sm font-semibold transition-colors"
      >
        Force Close
      </button>
    </div>
  );
}
