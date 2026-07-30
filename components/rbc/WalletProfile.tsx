interface Props {
  profile: any;
}

export function WalletProfile({ profile }: Props) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 shadow-2xl">
      <div className="mb-8">
        <h2 className="text-sm text-white/40 uppercase tracking-widest font-medium mb-1">Entity Address</h2>
        <div className="text-xl font-mono text-white/90 break-all">{profile.address}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="text-xs text-white/40 uppercase mb-1">Smart Money Score</div>
          <div className="text-2xl font-bold text-white/90">{profile.smartMoneyScore}/100</div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="text-xs text-white/40 uppercase mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-emerald-400">{profile.winRate.toFixed(1)}%</div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="text-xs text-white/40 uppercase mb-1">Realized PnL</div>
          <div className="text-2xl font-bold text-white/90">${profile.realizedPnl.toLocaleString()}</div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="text-xs text-white/40 uppercase mb-1">Early Entry Rate</div>
          <div className="text-2xl font-bold text-white/90">{profile.earlyEntryRate.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}
