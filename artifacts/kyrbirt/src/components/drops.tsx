import { motion, AnimatePresence } from "framer-motion";
import { useDrops } from "@/hooks/use-drops";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useSiteProducts } from "@/hooks/use-site-products";

const FF = "'FranklinGothic', 'Arial Narrow', sans-serif";

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[64px] h-[64px] md:w-32 md:h-32 bg-black/60 border border-white/20 backdrop-blur-sm flex items-center justify-center">
        <span
          className="text-2xl md:text-5xl text-white"
          style={{ fontFamily: FF }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 md:mt-3 text-[9px] md:text-xs tracking-[0.25em] text-white/60 uppercase" style={{ fontFamily: FF }}>
        {label}
      </span>
    </div>
  );
}

export function Drops() {
  const { unlocked, days, hours, minutes, seconds } = useDrops();
  const { settings } = useSiteSettings();
  const { products } = useSiteProducts();

  const mafiasTee = products.find((p) => p.id === "mafias-tee");

  const handleOpenMafias = () => {
    if (unlocked && mafiasTee) {
      window.dispatchEvent(new CustomEvent("open-mafias-tee", { detail: mafiasTee }));
    }
  };

  return (
    <section
      id="drops"
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden py-32 md:py-0"
      data-testid="drops-section"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url(${settings.drop_bg_image})`,
          filter: unlocked ? "blur(0px) grayscale(0%)" : "blur(12px) grayscale(60%)",
          transform: "scale(1.05)",
        }}
      />
      <div className="absolute inset-0 bg-black/70 z-10" />

      <div className="relative z-20 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-white/50 tracking-[0.4em] text-xs md:text-sm uppercase mb-4 md:mb-6"
            style={{ fontFamily: FF }}
          >
            Próximo drop
          </p>
          <h2
            className="text-6xl md:text-9xl text-white mb-4 md:mb-6 leading-none"
            style={{ fontFamily: FF, letterSpacing: "0.05em" }}
          >
            {settings.drop_name}
          </h2>
          <div className="w-12 h-px bg-white/30 mx-auto mb-10 md:mb-14" />
        </motion.div>

        <AnimatePresence mode="wait">
          {!unlocked ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-start justify-center gap-3 md:gap-8 mb-10 md:mb-12">
                <CountdownUnit value={days} label="Días" />
                <span className="text-white/40 text-3xl md:text-5xl mt-6 md:mt-10" style={{ fontFamily: FF }}>:</span>
                <CountdownUnit value={hours} label="Horas" />
                <span className="text-white/40 text-3xl md:text-5xl mt-6 md:mt-10" style={{ fontFamily: FF }}>:</span>
                <CountdownUnit value={minutes} label="Min" />
                <span className="text-white/40 text-3xl md:text-5xl mt-6 md:mt-10" style={{ fontFamily: FF }}>:</span>
                <CountdownUnit value={seconds} label="Seg" />
              </div>

              <p
                className="text-white/50 tracking-widest text-sm uppercase"
                style={{ fontFamily: FF }}
              >
                {settings.drop_subtitle}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-white/80 text-sm tracking-[0.4em] uppercase mb-6"
                style={{ fontFamily: FF }}
              >
                Drop disponible ahora
              </motion.div>

              <button
                onClick={handleOpenMafias}
                className="group relative px-10 md:px-14 py-4 md:py-5 bg-white text-black text-xl md:text-2xl tracking-widest overflow-hidden transition-transform active:scale-95"
                style={{ fontFamily: FF }}
                data-testid="button-drops-unlock"
              >
                <span className="relative z-10">VER MAFIAS TEE</span>
                <div className="absolute inset-0 bg-black/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </button>

              <p
                className="mt-6 text-white/40 text-xs tracking-widest uppercase"
                style={{ fontFamily: FF }}
              >
                Ir a Tienda para comprar
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
