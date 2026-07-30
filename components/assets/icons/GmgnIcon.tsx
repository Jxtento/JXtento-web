import React from "react";
import Image from "next/image";

export const GmgnIcon = (props: React.SVGProps<SVGSVGElement> | any) => (
  <div className={props.className} style={{ position: "relative", width: "100%", height: "100%", ...props.style }}>
    {/* Please save the frog image you uploaded to 'jxtento-web/public/gmgn.png' */}
    <Image 
      src="/logo-gmgn.png" 
      alt="GMGN Logo" 
      fill
      style={{ objectFit: 'contain' }}
    />
  </div>
);
