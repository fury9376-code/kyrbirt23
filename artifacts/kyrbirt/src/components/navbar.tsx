import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const GIF_LOGO = "/logo.gif";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location === '/';

  const navLinks = [
    { name: 'Inicio', href: isHome ? '#inicio' : '/' },
    { name: 'Tienda', href: isHome ? '#tienda' : '/#tienda' },
    { name: 'FAM', href: isHome ? '#fam' : '/#fam' },
    { name: 'Contacto', href: isHome ? '#contacto' : '/#contacto' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/90 backdrop-blur-md py-3 border-b border-border/50' : 'bg-transparent py-6'
        }`}
        data-testid="navbar"
      >
        <div className="container mx-auto px-6 md:px-12 relative flex items-center justify-between">
          {/* Logo: absolutely centered on mobile, static on desktop */}
          <Link
            href="/"
            className="z-50 block absolute left-1/2 -translate-x-1/2 md:static md:left-auto md:translate-x-0"
            data-testid="link-logo"
          >
            <img
              src={GIF_LOGO}
              alt="KYRBIRT Logo"
              style={{
                width: '140px',
                height: '22px',
                objectFit: 'fill',
                display: 'block',
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center ml-auto">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-widest uppercase hover:text-muted-foreground transition-colors"
                data-testid={`link-nav-${link.name.toLowerCase()}`}
              >
                {link.name}
              </a>
            ))}
            <Link
              href="/drops"
              className="text-sm font-medium tracking-widest uppercase hover:text-muted-foreground transition-colors"
              data-testid="link-nav-drops"
            >
              DROPS
            </Link>
          </div>

          {/* Mobile: invisible left placeholder + hamburger right */}
          <div className="w-6 h-6 md:hidden" aria-hidden="true" />
          <button
            className="z-50 text-foreground md:hidden ml-auto"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-8"
            data-testid="mobile-menu-overlay"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-display tracking-widest uppercase"
                data-testid={`link-mobile-nav-${link.name.toLowerCase()}`}
              >
                {link.name}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * navLinks.length + 0.2 }}
            >
              <Link
                href="/drops"
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-display tracking-widest uppercase text-primary border-b border-primary pb-1"
                data-testid="link-mobile-nav-drops"
              >
                DROPS
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
