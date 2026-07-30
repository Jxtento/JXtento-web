import { TOKEN_DETAILS } from "@/constants";
import { Button } from "@/components/ui/Button";

export function Token() {
  return (
    <section id="token" className="border-t border-[var(--line)]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-[52px] pb-[70px] sm:py-[70px] sm:pb-[90px]">
        <div className="flex justify-between items-end gap-[24px] pb-[36px] max-md:flex-col max-md:items-start max-md:gap-4">
          <h2 className="font-serif font-normal text-[clamp(30px,3.6vw,46px)] leading-[1.02] tracking-[-.01em] max-w-[16ch]">
            One token unlocks the terminal.
          </h2>
          <p className="max-w-[38ch] text-[var(--muted)] text-[15px]">
            Ask the Copilot in plain language: trace the dev of a ticker, list smart wallets that bought in the last hour, or check whether a CA is safe. Pro depth is gated by a hold.
          </p>
        </div>
        <div className="border border-[var(--ink)] grid grid-cols-1 md:grid-cols-[1.3fr_1fr]">
          <div className="p-[44px_40px] max-sm:p-[32px_24px]">
            <span className="font-mono text-[var(--accent)] text-[14px] tracking-[.1em] block mb-4">
              {TOKEN_DETAILS.kicker}
            </span>
            <h2 className="font-serif font-normal text-[clamp(30px,3.6vw,44px)] leading-[1.02] mb-[16px]">
              {TOKEN_DETAILS.title}
            </h2>
            <p className="text-[#4A463F] text-[15px] max-w-[40ch] mt-[14px] mb-[26px]">
              {TOKEN_DETAILS.description}
            </p>
            <Button href="#">View the launch</Button>
          </div>
          <div className="flex flex-col border-t md:border-t-0 md:border-l border-[var(--ink)]">
            {TOKEN_DETAILS.stats.map((stat, i) => (
              <div key={i} className="p-[20px_28px] border-b border-[var(--line)] last:border-b-0">
                <span className="font-mono text-[10.5px] tracking-[.14em] uppercase text-[var(--muted)] block mb-[5px]">
                  {stat.label}
                </span>
                <b className="font-mono text-[17px] font-semibold block">
                  {stat.value}
                </b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
