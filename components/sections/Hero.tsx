import { Button } from "@/components/ui/Button";
import { PlatformShowcase } from "./PlatformShowcase";
import { AddressBackground } from "@/components/ui/AddressBackground";

export function Hero() {
  return (
    <div className="relative w-full overflow-hidden">
      <AddressBackground />
      
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-[32px] pt-[80px] pb-[60px] md:pt-[120px] md:pb-[100px] grid grid-cols-1 md:grid-cols-[1fr_minmax(340px,460px)] gap-12 md:gap-[80px] items-center">
        <div className="flex flex-col justify-center">
        <span className="font-mono text-[11px] font-medium tracking-[.22em] uppercase text-[var(--muted)]" style={{ textShadow: '0 0 4px #fff, 0 0 12px #fff, 0 0 20px #fff, 0 0 30px #fff' }}>
          Solana trade intelligence
        </span>
        <h1 className="font-serif font-normal text-[clamp(48px,6.4vw,84px)] leading-[.98] tracking-[-.01em] my-[22px] mb-6" style={{ textShadow: '0 0 5px #fff, 0 0 15px #fff, 0 0 30px #fff, 0 0 50px #fff' }}>
          Read the <em className="italic text-[var(--accent)] not-italic">trench.</em>
        </h1>
        <p className="text-[18px] leading-[1.55] text-[#39352F] max-w-[44ch] mb-[32px]" style={{ textShadow: '0 0 2px #fff, 0 0 4px #fff, 0 0 8px #fff, 0 0 16px #fff, 0 0 32px #fff, 0 0 48px #fff, 0 0 64px #fff' }}>
          JXTENTO maps every wallet, funding trail, and bundle on Solana in realtime. Trace where the money came from before you enter. Pure intelligence, zero execution.
        </p>
        <div className="flex gap-[14px] flex-wrap mb-[40px]">
          <Button href="#" size="lg">Launch terminal</Button>
          <div className="bg-[rgba(251,250,247,0.95)] backdrop-blur-sm relative z-10">
            <Button href="#map" variant="ghost" size="lg">How it reads the chain</Button>
          </div>
        </div>
        <div className="grid grid-cols-3 border border-[var(--line)] bg-[rgba(251,250,247,0.95)] backdrop-blur-sm shadow-sm relative z-10">
          <div className="py-4 px-4 border-r border-[var(--line)]">
            <b className="block font-mono text-[19px] font-semibold tracking-[-.01em]">{"<400ms"}</b>
            <span className="font-mono text-[10px] tracking-[.14em] uppercase text-[var(--muted)]">Funding trace</span>
          </div>
          <div className="py-4 px-4 border-r border-[var(--line)]">
            <b className="block font-mono text-[19px] font-semibold tracking-[-.01em]">Genesis</b>
            <span className="font-mono text-[10px] tracking-[.14em] uppercase text-[var(--muted)]">Full chain index</span>
          </div>
          <div className="py-4 px-4">
            <b className="block font-mono text-[19px] font-semibold tracking-[-.01em]">0</b>
            <span className="font-mono text-[10px] tracking-[.14em] uppercase text-[var(--muted)]">Wallet connect</span>
          </div>
        </div>
      </div>

        <div className="relative aspect-[1/1.02] overflow-hidden w-full max-w-[460px] md:max-w-none mx-auto md:mx-0">
          <PlatformShowcase />
        </div>
      </header>
    </div>
  );
}
