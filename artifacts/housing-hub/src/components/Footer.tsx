import React from 'react';
import { Link } from 'wouter';
import { Home, Linkedin } from 'lucide-react';
import { SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';
import { StaggerSection, StaggerItem } from '@/components/ui/AnimatedSection';

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-accent relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 border-t border-white/10" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12" speed="slow">

          {/* Column 1 - About */}
          <StaggerItem variant="fadeUp">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="p-1.5 bg-accent rounded-lg text-white transition-transform group-hover:scale-110">
                  <Home className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">
                  Housing Hub
                </span>
              </Link>
              <p className="text-white/70 text-sm mt-4 leading-relaxed pr-4">
                The City of Newport News Housing Hub connects residents with affordable housing, homeownership programs, and community resources.
              </p>
              <div className="flex items-center gap-4 pt-4">
                {[
                  { href: 'https://www.facebook.com/CityofNewportNews/', icon: SiFacebook, label: 'Facebook' },
                  { href: 'https://www.instagram.com/cityofnn/', icon: SiInstagram, label: 'Instagram' },
                  { href: 'https://www.linkedin.com/company/city-of-newport-news', icon: Linkedin, label: 'LinkedIn' },
                  { href: 'https://www.youtube.com/NewportNewsTV', icon: SiYoutube, label: 'YouTube' },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-accent hover:text-white hover:scale-125 transition-all duration-200"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </StaggerItem>

          {/* Column 2 - Quick Links */}
          <StaggerItem variant="fadeUp">
            <div>
              <h3 className="tracking-widest text-xs uppercase text-white/50 mb-6 border-b border-white/10 pb-2 inline-block">Quick Links</h3>
              <ul className="space-y-2.5">
                {[
                  { href: '/buy',             label: 'Buy a Home' },
                  { href: '/rent',            label: 'Rent' },
                  { href: '/neighborhoods',   label: 'Neighborhoods' },
                  { href: '/services',        label: 'Resident Services' },
                  { href: '/simulator',       label: 'Homebuying Simulator' },
                  { href: '/resources',       label: 'Resources' },
                  { href: '/events',          label: 'Events' },
                  { href: '/success-stories', label: 'Success Stories' },
                  { href: '/checklist',       label: 'First-Time Buyer Checklist' },
                  { href: '/ship',            label: 'SHIP Housing Plan' },
                  { href: '/contact',         label: 'Contact' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-white/70 hover:text-accent transition-colors text-sm relative inline-block group"
                    >
                      <span className="underline-draw">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>

          {/* Column 3 - Housing Resources */}
          <StaggerItem variant="fadeUp">
            <div>
              <h3 className="tracking-widest text-xs uppercase text-white/50 mb-6 border-b border-white/10 pb-2 inline-block">Housing Resources</h3>
              <ul className="space-y-2.5">
                {[
                  { href: 'https://www.virginiahousing.com',                                  label: 'Virginia Housing' },
                  { href: 'https://nnrha.com',                                                label: 'NNRHA' },
                  { href: 'https://www.virginiahousing.com/homebuyers/homebuyer-education',   label: 'Homebuyer Education' },
                  { href: 'https://www.hud.gov/i_want_to/talk_to_a_housing_counselor',       label: 'Housing Counseling' },
                  { href: 'https://www.hud.gov/program_offices/fair_housing_equal_opp',      label: 'Fair Housing' },
                  { href: 'https://www.211virginia.org',                                      label: 'United Way 211' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-accent transition-colors text-sm underline-draw"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>

          {/* Column 4 - Contact */}
          <StaggerItem variant="fadeUp">
            <div>
              <h3 className="tracking-widest text-xs uppercase text-white/50 mb-6 border-b border-white/10 pb-2 inline-block">Contact Us</h3>
              <ul className="space-y-3 text-white/70 text-sm">
                <li>2400 Washington Avenue</li>
                <li>Newport News, VA 23607</li>
                <li className="pt-2">
                  <a href="tel:7579332311" className="text-accent font-semibold hover:text-white transition-colors">(757) 933-2311</a>
                </li>
                <li>
                  <a href="mailto:housing@newportnewsva.gov" className="hover:text-accent transition-colors break-all">housing@newportnewsva.gov</a>
                </li>
                <li className="pt-2 text-xs opacity-80">Office Hours: Mon–Fri 8am–5pm</li>
              </ul>
            </div>
          </StaggerItem>

        </StaggerSection>
      </div>

      <div className="bg-[#0A1F45] pt-6 pb-6 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <p>&copy; {new Date().getFullYear()} City of Newport News. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="https://www.nnva.gov/393/Accessibility" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Accessibility</a>
              <a href="https://www.nnva.gov/379/Privacy-Policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
              <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
