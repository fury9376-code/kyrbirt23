import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Store } from "@/components/store";
import { Fam } from "@/components/fam";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main>
        <Hero />
        <Store />
        <Fam />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
