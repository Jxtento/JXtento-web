import React from "react";
import Image from "next/image";

export const TerminalIcon = (props: React.SVGProps<SVGSVGElement> | any) => (
  <div className={props.className} style={{ position: "relative", width: "100%", height: "100%", ...props.style }}>
    <Image 
      src="/trading-terminal.png" 
      alt="Pump.fun Logo" 
      fill
      style={{ objectFit: 'contain' }}
    />
  </div>
);
