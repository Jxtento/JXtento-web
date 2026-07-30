import React from "react";
import Image from "next/image";

export const AxiomIcon = (props: React.SVGProps<SVGSVGElement> | any) => (
  <div className={props.className} style={{ position: "relative", width: "100%", height: "100%", ...props.style }}>
    <Image 
      src="/logo-axiom.png" 
      alt="Axiom Logo" 
      fill
      style={{ objectFit: 'contain' }}
    />
  </div>
);
