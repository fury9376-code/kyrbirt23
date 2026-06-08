import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const FAM_PHOTOS_FALLBACK = [
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763012/turrobaby_ppibbe.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763034/pppatuka_sgyabe.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763013/panchitolefleur_lzvqoe.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763011/neopistea_u1qr5p.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763005/ceroasterisco_jdk30z.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763004/bhaviboi_ht4rh1.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763004/salasfl4co_nkstmy.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763001/shako2b_ejtp9f.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777762998/luhrever_u8dj5c.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777839945/uzu.messineo_1_uax1pr.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763004/sstiffy_v8f6ir.png",
];

function useFamPhotos() {
  const { data } = useQuery<string[]>({
    queryKey: ["fam-photos"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) return FAM_PHOTOS_FALLBACK;
      const s = await res.json();
      try {
        const photos = JSON.parse(s.fam_photos || "[]");
        return Array.isArray(photos) && photos.length > 0 ? photos : FAM_PHOTOS_FALLBACK;
      } catch {
        return FAM_PHOTOS_FALLBACK;
      }
    },
    staleTime: 30_000,
  });
  return data ?? FAM_PHOTOS_FALLBACK;
}

export function Fam() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const photos = useFamPhotos();

  return (
    <section id="fam" className="py-24 bg-card min-h-screen relative" data-testid="fam-section">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-display tracking-widest mb-4">FAM</h2>
          <p className="text-muted-foreground uppercase tracking-widest text-sm mb-6">Real Recognize Real</p>
          <div className="w-12 h-1 bg-primary mx-auto" />
        </motion.div>

        {/* Mobile: 2-col grid */}
        <div className="grid grid-cols-2 md:hidden gap-3">
          {photos.map((photo, index) => (
            <motion.div
              key={photo + index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="relative group cursor-pointer overflow-hidden bg-card min-h-[160px]"
              onClick={() => setSelectedPhoto(photo)}
              data-testid={`img-fam-${index}`}
            >
              <img
                src={photo}
                alt={`FAM ${index + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent) parent.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-background/80 text-foreground p-2 rounded-full backdrop-blur-sm">
                  <Maximize2 size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: masonry columns */}
        <div className="hidden md:block columns-3 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo + index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.5 }}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden mb-4 bg-card"
              onClick={() => setSelectedPhoto(photo)}
              data-testid={`img-fam-desktop-${index}`}
            >
              <img
                src={photo}
                alt={`FAM ${index + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent) parent.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-background/80 text-foreground p-3 rounded-full backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
                  <Maximize2 size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 bg-card/50 hover:bg-card text-foreground rounded-full transition-colors z-10"
              onClick={() => setSelectedPhoto(null)}
              data-testid="button-close-lightbox"
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedPhoto}
              alt="FAM Expanded"
              className="max-w-full max-h-[90vh] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
