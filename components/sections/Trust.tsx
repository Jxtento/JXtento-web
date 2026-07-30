import { TRUST_ITEMS } from "@/constants";

export function Trust() {
  return (
    <section id="trust" className="bg-[var(--ink)] text-[var(--paper)]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-[52px] sm:py-[70px]">
        <span className="font-mono text-[11px] font-medium tracking-[.22em] uppercase text-[#8A857C] block mb-[18px]">
          Read-only by design
        </span>
        <h2 className="font-serif font-normal text-[clamp(28px,3.4vw,42px)] leading-[1.06] mb-[46px] max-w-[22ch]">
          JXTENTO never touches your keys. It only <em className="italic text-[#FF6A55] not-italic">reads</em> the chain.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#232323] border border-[#232323]">
          {TRUST_ITEMS.map((item) => (
            <div key={item.id} className="bg-[var(--ink)] p-[26px_24px]">
              <div className="font-mono text-[12px] tracking-[.14em] text-[#FF6A55] mb-[12px]">
                {item.number}
              </div>
              <h4 className="font-mono text-[15px] font-semibold mb-[8px] tracking-[.02em]">
                {item.title}
              </h4>
              <p className="text-[13.5px] text-[#A8A29A] leading-[1.5]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
