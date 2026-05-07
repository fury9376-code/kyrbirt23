import { Navbar } from "@/components/navbar";
import { Drops } from "@/components/drops";
import { Footer } from "@/components/footer";

export default function DropsPage() {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navbar />
      <main>
        <div className="pt-20">
          <Drops />
        </div>
      </main>
      <Footer />
    </div>
  );
}
