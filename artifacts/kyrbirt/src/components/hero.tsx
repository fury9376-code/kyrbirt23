import { motion } from "framer-motion";
import { Link } from "wouter";
import { useDrops } from "@/hooks/use-drops";
import { useSiteSettings } from "@/hooks/use-site-settings";

const FF = "'FranklinGothic', 'Arial Narrow', sans-serif";

export function Hero() {
  const { days, hours, minutes, seconds, unlocked } = useDrops();
  const { settings } = useSiteSettings();

  return (
    <section
      id="inicio"
      className="relative h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div
        className="absolute inset-[24px] z-0 overflow-hidden"
        style={{
          backgroundImage: "url(https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777762907/fondo_web_usjvpe.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(100%) brightness(1.2)",
        }}
      />

      <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.07]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* DROP Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-20 md:top-24 left-0 right-0 z-20 flex justify-center px-4"
      >
        <Link
          href="/drops"
          className="flex items-center gap-4 md:gap-6 px-6 md:px-10 py-3 md:py-4 border border-white/40 bg-black/60 backdrop-blur-md hover:bg-white/10 transition-colors w-full max-w-sm md:max-w-lg"
        >
          <div className="flex flex-col leading-tight">
            <span
              className="text-white/50 text-[9px] md:text-[10px] tracking-[0.35em] uppercase"
              style={{ fontFamily: FF }}
            >
              PRÓXIMO
            </span>
            <span
              className="text-white text-base md:text-xl tracking-[0.2em] font-bold"
              style={{ fontFamily: FF }}
            >
              {settings.drop_name}
            </span>
          </div>

          <div className="flex-1 flex justify-center">
            <span
              className="text-white/70 text-sm md:text-base tracking-widest tabular-nums"
              style={{ fontFamily: FF }}
            >
              {unlocked
                ? "DISPONIBLE AHORA"
                : `${String(days).padStart(2, "0")}D  ${String(hours).padStart(2, "0")}H  ${String(minutes).padStart(2, "0")}M  ${String(seconds).padStart(2, "0")}S`}
            </span>
          </div>

          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/50 shrink-0">
            <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </motion.div>

      {/* Main content */}
      <div className="relative z-20 container px-4 mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <h1
            className="text-[clamp(2.2rem,11vw,10rem)] text-white leading-none mb-4 md:mb-6"
            style={{ fontFamily: "'Neutro', 'Bebas Neue', 'Impact', sans-serif", letterSpacing: "0.03em" }}
          >
            KYRBIRT
          </h1>
          <p
            className="text-sm md:text-base text-white/60 max-w-xs md:max-w-xl mx-auto mb-8 md:mb-10 tracking-[0.2em] uppercase"
            style={{ fontFamily: FF }}
          >
            Argentine Street Culture. Exclusive Drops. No Restocks.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href="#tienda"
            className="group relative inline-flex items-center justify-center px-8 md:px-12 py-3 md:py-4 bg-white text-black text-sm md:text-base tracking-widest overflow-hidden transition-transform active:scale-95"
            style={{ fontFamily: FF }}
            data-testid="link-hero-cta"
          >
            <span className="relative z-10">EXPLORAR TIENDA</span>
            <div className="absolute inset-0 h-full w-full bg-black/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-px h-10 md:h-14 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}
