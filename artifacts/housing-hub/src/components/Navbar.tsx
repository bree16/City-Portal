import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const isHomepage = location === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Buy', href: '/buy' },
    { label: 'Rent', href: '/rent' },
    { label: 'Neighborhoods', href: '/neighborhoods' },
    { label: 'Journey', href: '/journey' },
    { label: 'Why NN', href: '/why-newport-news' },
    { label: 'Resources', href: '/resources' },
    { label: 'Contact', href: '/contact' },
  ];

  const mobileLinks = [
    ...navLinks,
    { label: 'Events', href: '/events' },
    { label: 'Success Stories', href: '/success-stories' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHomepage || isMobileMenuOpen
            ? 'bg-white shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 z-50" data-testid="link-home">
              <div className={`p-2 rounded-lg ${isScrolled || !isHomepage || isMobileMenuOpen ? 'bg-primary/10 text-primary' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                <Home className="w-6 h-6" />
              </div>
              <span className={`font-bold text-xl tracking-tight transition-colors ${
                isScrolled || !isHomepage || isMobileMenuOpen ? 'text-primary' : 'text-white'
              }`}>
                Housing Hub
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <div className="flex gap-6">
                {navLinks.map((link) => {
                  const isActive = location === link.href || (link.href === '/resources' && location === '/assistance');
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm transition-colors relative py-1 ${
                        isScrolled || !isHomepage
                          ? isActive ? 'text-accent font-semibold' : 'text-foreground/80 hover:text-accent font-medium'
                          : isActive ? 'text-white font-semibold' : 'text-white/90 hover:text-white font-medium'
                      }`}
                      data-testid={`link-nav-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                      {isActive && (
                        <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${isScrolled || !isHomepage ? 'bg-accent' : 'bg-white'}`}></span>
                      )}
                    </Link>
                  );
                })}
              </div>
              <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full px-6 font-medium shadow-sm transition-transform hover:-translate-y-0.5">
                <Link href="/buy">Get Started</Link>
              </Button>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className={`md:hidden p-2 z-50 rounded-md transition-colors ${
                isScrolled || !isHomepage || isMobileMenuOpen ? 'text-foreground' : 'text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 flex flex-col md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-4 text-lg font-medium pb-8">
              <Link
                href="/"
                className={`py-3 border-b border-border flex items-center ${location === '/' ? 'text-accent font-semibold' : 'text-foreground'}`}
              >
                Home
              </Link>
              {mobileLinks.map((link) => {
                const isActive = location === link.href || (link.href === '/resources' && location === '/assistance');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-3 border-b border-border flex items-center ${isActive ? 'text-accent font-semibold' : 'text-foreground'}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Button asChild className="mt-6 bg-accent hover:bg-accent/90 text-white w-full rounded-full h-14 text-lg font-bold shadow-lg">
                <Link href="/buy">Get Started</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
