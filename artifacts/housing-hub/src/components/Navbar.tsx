import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Home, Menu, X, Phone, ArrowRight, ChevronDown,
  Building2, KeyRound, MapPin, Route, Sparkles, Gamepad2, Calendar,
  HeartHandshake, Mail, BookOpen, Trophy, ClipboardCheck, Landmark, Hammer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { AnimatedLogo } from '@/components/AnimatedLogo';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();
  const isHomepage = location === '/';

  // Close "More" dropdown on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMoreOpen(false);
  }, [location]);

  const moreLinks = [
    { label: 'Build', href: '/build', icon: Hammer, desc: 'Build from the ground up' },
    { label: 'Simulator', href: '/simulator', icon: Gamepad2, desc: 'Learn through play' },
    { label: 'Services', href: '/services', icon: HeartHandshake, desc: 'Resident services' },
    { label: 'Success Stories', href: '/success-stories', icon: Trophy, desc: 'Real neighbors, real results' },
    { label: 'First-Time Buyer Checklist', href: '/checklist', icon: ClipboardCheck, desc: 'Step-by-step guide' },
    { label: 'SHIP Housing Plan', href: '/ship', icon: Landmark, desc: "The city's roadmap" },
  ];

  // Core top-level links — high-frequency, decision-driving pages
  const navLinks = [
    { label: 'Buy', href: '/buy' },
    { label: 'Rent', href: '/rent' },
    { label: 'Neighborhoods', href: '/neighborhoods' },
    { label: 'Why Newport News', href: '/why-newport-news' },
    { label: 'Journey', href: '/journey' },
    { label: 'Events', href: '/events' },
    { label: 'Resources', href: '/resources' },
    { label: 'Contact', href: '/contact' },
  ];

  const mobileGroups = [
    {
      heading: 'Find a Home',
      links: [
        { label: 'Buy', href: '/buy', icon: Building2, desc: 'Listings & financing' },
        { label: 'Rent', href: '/rent', icon: KeyRound, desc: 'Affordable rentals' },
        { label: 'Neighborhoods', href: '/neighborhoods', icon: MapPin, desc: 'Find your fit' },
        { label: 'Why Newport News', href: '/why-newport-news', icon: Sparkles, desc: 'Life in the city' },
      ],
    },
    {
      heading: 'Plan & Learn',
      links: [
        { label: 'Buyer Checklist', href: '/checklist', icon: ClipboardCheck, desc: 'Step-by-step guide' },
        { label: 'Journey', href: '/journey', icon: Route, desc: 'Your housing path' },
        { label: 'Build', href: '/build', icon: Hammer, desc: 'Build from the ground up' },
        { label: 'Simulator', href: '/simulator', icon: Gamepad2, desc: 'Learn through play' },
        { label: 'SHIP Housing Plan', href: '/ship', icon: Landmark, desc: "The city's roadmap" },
      ],
    },
    {
      heading: 'Community & Help',
      links: [
        { label: 'Events', href: '/events', icon: Calendar, desc: 'Workshops & classes' },
        { label: 'Resources', href: '/resources', icon: BookOpen, desc: 'Programs & links' },
        { label: 'Services', href: '/services', icon: HeartHandshake, desc: 'Resident services' },
        { label: 'Success Stories', href: '/success-stories', icon: Trophy, desc: 'Real neighbors' },
        { label: 'Contact', href: '/contact', icon: Mail, desc: 'Get in touch' },
      ],
    },
  ];

  return (
    <>
      <ScrollProgress />
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
            <Link href="/" className="flex items-center gap-3 z-50 mr-4 lg:mr-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md" data-testid="link-home" aria-label="Newport News Housing Hub — go to homepage">
              <AnimatedLogo isLight={isScrolled || !isHomepage || isMobileMenuOpen} />
              <span className={`font-bold text-base whitespace-nowrap tracking-tight transition-colors border-l pl-3 ${
                isScrolled || !isHomepage || isMobileMenuOpen
                  ? 'border-primary/20 text-primary'
                  : 'border-white/30 text-white'
              }`}>
                Housing Hub
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-4 flex-1 justify-between min-w-0">
              <div className="flex gap-4 items-center min-w-0">
                {navLinks.map((link) => {
                  const isActive = location === link.href || (link.href === '/resources' && location === '/assistance');
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm whitespace-nowrap transition-colors relative py-1 ${
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

                {/* More dropdown */}
                <div className="relative" ref={moreRef}>
                  <button
                    onClick={() => setMoreOpen((o) => !o)}
                    className={`flex items-center gap-1 text-sm font-medium whitespace-nowrap transition-colors py-1 ${
                      isScrolled || !isHomepage
                        ? moreLinks.some(l => location === l.href) ? 'text-accent font-semibold' : 'text-foreground/80 hover:text-accent'
                        : moreLinks.some(l => location === l.href) ? 'text-white font-semibold' : 'text-white/90 hover:text-white'
                    }`}
                    aria-haspopup="true"
                    aria-expanded={moreOpen}
                  >
                    More
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {moreOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-border overflow-hidden z-50"
                      >
                        {moreLinks.map((link, i) => {
                          const isActive = location === link.href;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className={`group flex items-center gap-3 px-4 py-3 transition-colors ${
                                i > 0 ? 'border-t border-border/60' : ''
                              } ${isActive ? 'bg-accent/5' : 'hover:bg-muted/60'}`}
                            >
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isActive ? 'bg-accent text-white' : 'bg-primary/5 text-primary'
                              }`}>
                                <link.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className={`text-sm font-semibold leading-tight ${isActive ? 'text-accent' : 'text-foreground'}`}>
                                  {link.label}
                                </div>
                                <div className="text-xs text-muted-foreground">{link.desc}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full px-6 font-medium shadow-sm transition-transform hover:-translate-y-0.5 whitespace-nowrap text-sm">
                <Link href="/buy">Get Started</Link>
              </Button>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className={`xl:hidden p-2 z-50 rounded-md transition-colors ${
                isScrolled || !isHomepage || isMobileMenuOpen ? 'text-foreground' : 'text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
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
            id="mobile-nav"
            className="fixed inset-0 z-40 bg-gradient-to-b from-white via-white to-muted pt-24 px-5 flex flex-col xl:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6 pb-10 max-w-lg w-full mx-auto">
              {/* Home shortcut */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Link
                  href="/"
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 border transition-colors ${
                    location === '/' ? 'bg-primary text-white border-primary' : 'bg-white border-border hover:border-accent/40'
                  }`}
                >
                  <Home className={`w-5 h-5 ${location === '/' ? 'text-secondary' : 'text-accent'}`} />
                  <span className="font-bold">Home</span>
                </Link>
              </motion.div>

              {mobileGroups.map((group, gi) => (
                <motion.div
                  key={group.heading}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + gi * 0.08, duration: 0.3 }}
                >
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2.5 px-1">
                    {group.heading}
                  </div>
                  <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                    {group.links.map((link, li) => {
                      const isActive = location === link.href || (link.href === '/resources' && location === '/assistance');
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`group flex items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-muted ${
                            li > 0 ? 'border-t border-border/60' : ''
                          } ${isActive ? 'bg-accent/5' : 'hover:bg-muted/60'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-active:scale-90 ${
                            isActive ? 'bg-accent text-white' : 'bg-primary/5 text-primary'
                          }`}>
                            <link.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-semibold leading-tight ${isActive ? 'text-accent' : 'text-foreground'}`}>
                              {link.label}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">{link.desc}</div>
                          </div>
                          <ArrowRight className={`w-4 h-4 shrink-0 transition-all -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 ${
                            isActive ? 'text-accent opacity-100 translate-x-0' : 'text-muted-foreground'
                          }`} />
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + mobileGroups.length * 0.08, duration: 0.3 }}
                className="space-y-3"
              >
                <Button asChild className="bg-accent hover:bg-accent/90 text-white w-full text-center py-4 text-lg rounded-2xl h-auto font-bold shadow-lg">
                  <Link href="/buy">Get Started</Link>
                </Button>
                <a
                  href="tel:7579332311"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border border-border bg-white text-primary font-semibold hover:border-accent/40 transition-colors"
                >
                  <Phone className="w-4 h-4 text-accent" /> Talk to a person: (757) 933-2311
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
