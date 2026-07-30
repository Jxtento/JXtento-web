interface Props {
  profile: any;
}

export function FundingGraph({ profile }: Props) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 shadow-2xl h-full">
      <h3 className="text-sm text-white/40 uppercase tracking-widest font-medium mb-6">Funding Trace</h3>
      
      <div className="relative">
        {/* Terminus Node */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            🏦
          </div>
          <div>
            <div className="text-sm font-medium text-white/80">
              {profile.fundingTerminus === 'binance_hot' ? 'Binance' : 
               profile.fundingTerminus === 'arbitrum_bridge' ? 'Arbitrum Bridge' : 
               'Unknown Origin'}
            </div>
            <div className="text-xs text-white/40">Source CEX / Bridge</div>
          </div>
        </div>

        {/* Connection Line */}
        <div className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-white/20 to-transparent"></div>

        {/* Intermediate Hops (if any) */}
        {profile.fundingHops > 1 && (
          <div className="flex items-center gap-4 mb-6 pl-12 relative z-10">
            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">
              {profile.fundingHops - 1}
            </div>
            <div className="text-xs text-white/50">Intermediate Hops</div>
          </div>
        )}

        {/* Subject Wallet */}
        <div className="flex items-center gap-4 relative z-10 mt-6">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            🎯
          </div>
          <div>
            <div className="text-sm font-medium text-white/90">This Entity</div>
            <div className="text-xs font-mono text-white/40">
              {profile.address.slice(0,6)}...{profile.address.slice(-4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
