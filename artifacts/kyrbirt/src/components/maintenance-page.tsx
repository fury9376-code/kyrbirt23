import { motion } from "framer-motion";

export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-lg"
      >
        <img
          src="https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/kyrbirt_logo_negro_mvptuz"
          alt="KYRBIRT"
          className="w-16 mx-auto mb-12 invert opacity-80"
        />

        <p className="text-[#FFFEF7]/30 tracking-[0.5em] text-xs uppercase mb-6">
          Sitio en mantenimiento
        </p>

        <h1
          className="text-[clamp(3rem,12vw,7rem)] text-[#FFFEF7] leading-none mb-8"
          style={{ fontFamily: "'Neutro', 'Bebas Neue', 'Impact', sans-serif" }}
        >
          VOLVEMOS
          <br />
          PRONTO
        </h1>

        <div className="w-12 h-px bg-[#FFFEF7]/20 mx-auto mb-8" />

        <p className="text-[#FFFEF7]/40 text-sm tracking-widest uppercase">
          Argentine Street Culture
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.6 }}
        className="absolute bottom-8 text-[#FFFEF7]/15 text-xs tracking-widest uppercase"
      >
        kyrbirt.com
      </motion.div>
    </div>
  );
}
