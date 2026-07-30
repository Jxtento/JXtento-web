import { FEATURES_DATA } from "@/constants";

export function Features() {
  return (
    <section id="features" className="border-t border-[var(--line)]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="flex justify-between items-end gap-6 pt-[64px] pb-[40px] max-md:flex-col max-md:items-start max-md:gap-4">
          <h2 className="font-serif font-normal text-[clamp(30px,3.6vw,46px)] leading-[1.02] tracking-[-.01em] max-w-[16ch]">
            The bubble map is the moat.
          </h2>
          <p className="max-w-[38ch] text-[var(--muted)] text-[15px]">
            GMGN gives you a bundle ratio number. JXTENTO gives you the graph behind it, live: who funded whom, from which bridge, at which wallet age, and whether the deployer has done this before.
          </p>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 border-l border-[var(--line)] mb-[56px] md:mb-[80px]">
          {FEATURES_DATA.map((item) => (
            <div 
              key={item.id} 
              className="border-r border-t border-[var(--line)] p-[30px_26px_34px] min-h-[216px] flex flex-col transition-colors duration-200 hover:bg-[var(--paper-2)]"
            >
              <span className="font-mono text-[10.5px] tracking-[.16em] text-[var(--accent)] mt-0 mb-auto block">
                {item.tag}
              </span>
              <h3 className="font-serif font-normal text-[23px] leading-[1.1] my-[44px] mb-[10px] md:mt-[44px]">
                {item.title}
              </h3>
              <p className="text-[14px] leading-[1.5] text-[#4A463F]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
