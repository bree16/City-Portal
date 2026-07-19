import React from 'react';
import { Link } from 'wouter';
import { Home, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-accent rounded-lg text-white">
                <Home className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Housing Hub
              </span>
            </Link>
            <p className="text-white/70 text-sm mt-4 leading-relaxed max-w-xs">
              Your digital front door to housing resources, programs, and support in the City of Newport News.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <a href="#" className="text-white/70 hover:text-secondary transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-secondary transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-secondary transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-secondary transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/buy" className="text-white/70 hover:text-secondary transition-colors text-sm">Buy a Home</Link>
              </li>
              <li>
                <Link href="/rent" className="text-white/70 hover:text-secondary transition-colors text-sm">Find Rentals</Link>
              </li>
              <li>
                <Link href="/neighborhoods" className="text-white/70 hover:text-secondary transition-colors text-sm">Explore Neighborhoods</Link>
              </li>
              <li>
                <Link href="/assistance" className="text-white/70 hover:text-secondary transition-colors text-sm">Housing Assistance</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-secondary transition-colors text-sm">First-Time Buyer Guide</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-secondary transition-colors text-sm">Affordability Calculator</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-secondary transition-colors text-sm">Tenant Rights</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-secondary transition-colors text-sm">Community Events</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Connect</h3>
            <ul className="space-y-3 text-white/70 text-sm">
              <li>City Hall, 2400 Washington Ave</li>
              <li>Newport News, VA 23607</li>
              <li className="pt-2">
                <a href="tel:7579268000" className="hover:text-secondary transition-colors">(757) 926-8000</a>
              </li>
              <li>
                <a href="mailto:housing@nnva.gov" className="hover:text-secondary transition-colors">housing@nnva.gov</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} City of Newport News. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
