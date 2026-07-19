import React from 'react';
import { Link } from 'wouter';
import { Home, Linkedin } from 'lucide-react';
import { SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-accent relative">
      <div className="absolute top-0 left-0 right-0 border-t border-white/10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1 - About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-accent rounded-lg text-white">
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
              <a href="#" className="text-accent hover:text-white transition-colors" aria-label="Facebook">
                <SiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-accent hover:text-white transition-colors" aria-label="Instagram">
                <SiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-accent hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-accent hover:text-white transition-colors" aria-label="YouTube">
                <SiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="tracking-widest text-xs uppercase text-white/50 mb-6 border-b border-white/10 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/buy" className="text-white/70 hover:text-accent transition-colors text-sm">Buy a Home</Link></li>
              <li><Link href="/rent" className="text-white/70 hover:text-accent transition-colors text-sm">Rent</Link></li>
              <li><Link href="/neighborhoods" className="text-white/70 hover:text-accent transition-colors text-sm">Neighborhoods</Link></li>
              <li><Link href="/resources" className="text-white/70 hover:text-accent transition-colors text-sm">Resources</Link></li>
              <li><Link href="/events" className="text-white/70 hover:text-accent transition-colors text-sm">Events</Link></li>
              <li><Link href="/success-stories" className="text-white/70 hover:text-accent transition-colors text-sm">Success Stories</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-accent transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3 - Housing Resources */}
          <div>
            <h3 className="tracking-widest text-xs uppercase text-white/50 mb-6 border-b border-white/10 pb-2 inline-block">Housing Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors text-sm">Virginia Housing</a></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors text-sm">NNRHA</a></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors text-sm">Homebuyer Education</a></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors text-sm">Housing Counseling</a></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors text-sm">Down Payment Assistance</a></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors text-sm">Emergency Housing</a></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors text-sm">Fair Housing</a></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors text-sm">United Way 211</a></li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
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
        </div>
      </div>

      <div className="bg-[#0A1F45] pt-6 pb-6 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <p>&copy; {new Date().getFullYear()} City of Newport News. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
