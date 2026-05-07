import { motion } from "framer-motion";
import { Phone, Mail, Instagram, MapPin } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function Contact() {
  const { settings } = useSiteSettings();

  const phone = settings.contact_phone || "223 574 4381";
  const whatsapp = settings.contact_whatsapp || "2235744381";
  const instagram = settings.contact_instagram || "kyrbirt";
  const email = settings.contact_email || "kyrbirt.future@gmail.com";
  const address = settings.contact_address || "";
  const hours = settings.contact_hours || "";

  return (
    <section id="contacto" className="py-24 bg-background relative border-t border-border" data-testid="contact-section">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="w-12 h-1 bg-primary mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <h3 className="font-display text-3xl mb-6">CONTACTO</h3>
              <ul className="space-y-6">
                <li>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">WhatsApp / Teléfono</p>
                      <p className="text-lg tracking-wide group-hover:text-muted-foreground transition-colors">{phone}</p>
                    </div>
                  </a>
                </li>

                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                        <p className="text-lg tracking-wide group-hover:text-muted-foreground transition-colors break-all">{email}</p>
                      </div>
                    </a>
                  </li>
                )}

                <li>
                  <a href={`https://www.instagram.com/${instagram}/`} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Instagram size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Instagram</p>
                      <p className="text-lg tracking-wide group-hover:text-muted-foreground transition-colors">@{instagram}</p>
                    </div>
                  </a>
                </li>

                {address && (
                  <li className="flex items-center gap-4">
                    <div className="w-12 h-12 border border-border flex items-center justify-center text-muted-foreground">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Dirección</p>
                      <p className="text-lg tracking-wide">{address}</p>
                      {hours && <p className="text-sm text-muted-foreground mt-1">{hours}</p>}
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-display text-xl tracking-widest hover:opacity-90 transition-opacity w-full md:w-auto"
            >
              MENSAJE DIRECTO
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border aspect-square md:aspect-auto flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6 text-muted-foreground">
              <MapPin size={32} />
            </div>
            <h3 className="font-display text-2xl tracking-widest mb-2 text-muted-foreground">SHOWROOM</h3>
            <p className="text-muted-foreground">
              {address ? address : "Mapa próximamente disponible"}
            </p>
            {hours && <p className="text-muted-foreground text-sm mt-2">{hours}</p>}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
