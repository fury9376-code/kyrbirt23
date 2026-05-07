import { Instagram, MessageCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function Footer() {
  const { settings } = useSiteSettings();

  const paymentMethods = settings.footer_payment_methods
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <footer className="bg-[#050505] text-[#FFFEF7] border-t border-border pt-20 pb-8" data-testid="footer">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Col 1: Brand */}
          <div>
            <img 
              src="https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/kyrbirt_logo_negro_mvptuz" 
              alt="KYRBIRT Logo" 
              className="h-8 invert mb-6"
            />
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              {settings.footer_description}
            </p>
          </div>

          {/* Col 2: Links */}
          <div>
            <h4 className="font-display tracking-widest text-xl mb-6">LINKS</h4>
            <ul className="space-y-3 font-medium uppercase tracking-wider text-sm">
              <li><a href="#inicio" className="text-muted-foreground hover:text-primary transition-colors">Inicio</a></li>
              <li><a href="#tienda" className="text-muted-foreground hover:text-primary transition-colors">Tienda</a></li>
              <li><a href="#fam" className="text-muted-foreground hover:text-primary transition-colors">FAM</a></li>
              <li><a href="#contacto" className="text-muted-foreground hover:text-primary transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div>
            <h4 className="font-display tracking-widest text-xl mb-6 text-primary">EXCLU$IVE SH!T</h4>
            <p className="text-sm text-muted-foreground mb-4">Suscribite para enterarte de nuevos drops y restocks antes que nadie.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="tu@email.com" 
                className="rounded-none bg-transparent border-border focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button type="submit" className="rounded-none font-display tracking-widest text-lg">
                UNIRME
              </Button>
            </form>
            
            <div className="flex gap-4 mt-8">
              <a href={settings.footer_instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href={settings.footer_whatsapp} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle size={24} />
                <span className="sr-only">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} KYRBIRT. Todos los derechos reservados.</p>
          
          <div className="flex gap-4 font-mono">
            {paymentMethods.map((method) => (
              <span key={method}>{method}</span>
            ))}
          </div>

          <p>{settings.footer_credits}</p>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/admin"
            className="text-[10px] text-muted-foreground/30 hover:text-muted-foreground transition-colors tracking-widest uppercase"
            data-testid="link-admin"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
