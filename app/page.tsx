import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Trust } from "@/components/sections/Trust";
import { Token } from "@/components/sections/Token";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Trust />
        <Token />
      </main>
      <Footer />
    </>
  );
}
