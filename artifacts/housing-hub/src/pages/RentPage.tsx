import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Info, Search, ShieldCheck, Home, AlertCircle, Maximize, ExternalLink, AlertTriangle } from 'lucide-react';
import { SpotHiddenFees } from '@/components/games/SpotHiddenFees';
import { RENTALS, ZILLOW_ALL_RENTALS, CITY_MARKET } from '@/data/market';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AnimatedSection, StaggerSection, StaggerItem } from '@/components/ui/AnimatedSection';

import rentHero from '@assets/generated_images/rent_hero.jpg';
import rent1 from '@assets/stock_images/rental_1.jpg';
import rent2 from '@assets/stock_images/rental_2.jpg';
import rent3 from '@assets/stock_images/rental_3_ext.jpg';
import rent4 from '@assets/stock_images/rental_4.jpg';
import rent5 from '@assets/stock_images/rental_5.webp';
import rent6 from '@assets/stock_images/rental_6.jpg';

export default function RentPage() {
  const [searchTerm, setSearchTerm] = useState('All');
  const [maxRent, setMaxRent] = useState('');
  const [minBeds, setMinBeds] = useState('any');

  const listingImages: Record<number, string> = { 1: rent1, 2: rent2, 3: rent3, 4: rent4, 5: rent5, 6: rent6 };
  const listings = RENTALS.map((r) => ({ ...r, img: listingImages[r.id] }));

  const maxRentNum = maxRent.trim() === '' ? Infinity : Number(maxRent);
  const minBedsNum = minBeds === 'any' ? 0 : Number(minBeds);

  const filteredListings = listings.filter(
    (l) =>
      (searchTerm === 'All' || l.hood === searchTerm) &&
      (Number.isNaN(maxRentNum) || l.minRent <= maxRentNum) &&
      l.maxBeds >= minBedsNum,
  );

  return (
    <div className="flex flex-col w-full pt-20 bg-muted/20 min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-16 lg:py-28 text-center px-4 relative overflow-hidden">
        <img src={rentHero} alt="Young professional in her new apartment" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-accent/50 z-10" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="container mx-auto max-w-4xl relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-sm font-medium mb-5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            Affordable Rentals in Newport News
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">Find Your Next Rental in Newport News</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            Find a place that feels like home. Newport News has affordable rentals, strong tenant protections, and neighbors who look out for each other.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-3 max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-xl">
            <Select value={searchTerm} onValueChange={setSearchTerm}>
              <SelectTrigger className="h-12 bg-white text-foreground border-none">
                <SelectValue placeholder="Neighborhood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Neighborhoods</SelectItem>
                <SelectItem value="Hilton Village">Hilton Village</SelectItem>
                <SelectItem value="Denbigh">Denbigh</SelectItem>
                <SelectItem value="Oyster Point">Oyster Point</SelectItem>
                <SelectItem value="Port Warwick">Port Warwick</SelectItem>
                <SelectItem value="Southeast">Southeast</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Max rent ($)"
              type="number"
              min={0}
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              className="h-12 bg-white text-foreground border-none"
            />
            <Select value={minBeds} onValueChange={setMinBeds}>
              <SelectTrigger className="h-12 bg-white text-foreground border-none">
                <SelectValue placeholder="Beds" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Beds</SelectItem>
                <SelectItem value="1">1+ Beds</SelectItem>
                <SelectItem value="2">2+ Beds</SelectItem>
                <SelectItem value="3">3+ Beds</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-12 px-8 bg-accent hover:bg-accent/90 text-white font-bold">
              <Search className="w-5 h-5 mr-2" /> Search
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <AnimatedSection variant="slideUp" className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary">Real Rental Communities in Newport News</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Citywide average rent is {CITY_MARKET.avgRent}/mo ({CITY_MARKET.updated}); the 2026 fair-market rent for a 2-bedroom is {CITY_MARKET.fmr2Br}. Starting rents below are advertised ranges — always confirm with the property.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 border-primary/20 text-primary hover:bg-primary hover:text-white">
              <a href={ZILLOW_ALL_RENTALS} target="_blank" rel="noopener noreferrer">
                Browse all on Zillow <ExternalLink className="w-4 h-4 ml-1.5" />
              </a>
            </Button>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 bg-white group flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img src={listing.img} alt={listing.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-secondary text-primary hover:bg-secondary font-bold shadow-sm">
                        {listing.hood}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-xl text-primary">{listing.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{listing.address}</p>
                    <div className="font-extrabold text-accent text-2xl mb-1">{listing.price}<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
                    <p className="text-xs text-muted-foreground mb-4">{listing.priceNote}</p>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg text-sm font-medium">
                        <BedDouble className="w-4 h-4 mb-1 text-primary" /> {listing.beds} Bed
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg text-sm font-medium">
                        <Bath className="w-4 h-4 mb-1 text-primary" /> {listing.baths} Bath
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg text-sm font-medium">
                        <Maximize className="w-4 h-4 mb-1 text-primary" /> {listing.sqft}
                      </div>
                    </div>

                    <Button asChild variant="outline" className="w-full mt-auto border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors">
                      <a href={listing.url} target="_blank" rel="noopener noreferrer">
                        View on Zillow <ExternalLink className="w-4 h-4 ml-1.5" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {filteredListings.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground bg-white rounded-2xl border border-border">
                No listings found matching your criteria. Try adjusting your filters.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 8 */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <AnimatedSection variant="popIn">
            <Home className="w-12 h-12 text-secondary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Housing Choice Voucher Program (Section 8)</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-10">
              The NNRHA administers vouchers that help low-income families afford private market rentals. The program pays a portion of your rent directly to the landlord, while you pay the remaining affordable portion.
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-6 text-left mb-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-sm"
            >
              <h3 className="font-bold text-secondary mb-2">Eligibility Basics</h3>
              <ul className="list-disc list-inside space-y-2 text-white/80 text-sm">
                <li>Income must be below 50% of the Area Median Income</li>
                <li>Must be a US citizen or eligible immigrant</li>
                <li>Background checks required for all adults</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-sm"
            >
              <h3 className="font-bold text-secondary mb-2">Current Status</h3>
              <p className="text-white/80 text-sm mb-4">The waitlist periodically opens for new applications. Check current status below.</p>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold">
                Waitlist Open — Apply Now
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Assistance */}
      <section className="py-20 bg-accent text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold">Emergency Rental Assistance</h2>
              </div>
              <p className="text-white/90 text-lg mb-8">
                For residents facing eviction or an inability to pay rent due to sudden financial hardship. Immediate help is available.
              </p>
              <StaggerSection className="space-y-4">
                {[
                  { name: "Virginia Rent Relief Program", note: "State-funded emergency rental assistance", url: "https://www.dhcd.virginia.gov/rrp" },
                  { name: "HUD Emergency Rental Assistance", note: "Federal housing support programs", url: "https://www.hud.gov/topics/rental_assistance" },
                  { name: "Newport News Human Services", note: "City-funded eviction prevention", url: "https://www.nnva.gov/339/Human-Services" }
                ].map((fund, i) => (
                  <StaggerItem key={i}>
                    <div className="bg-white p-4 rounded-xl flex items-center justify-between shadow-lg">
                      <div>
                        <h4 className="font-bold text-primary">{fund.name}</h4>
                        <p className="text-sm text-muted-foreground">{fund.note}</p>
                      </div>
                      <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white shrink-0">
                        <a href={fund.url} target="_blank" rel="noopener noreferrer">Apply Now</a>
                      </Button>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerSection>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full md:w-1/3 bg-white text-center p-8 rounded-2xl shadow-2xl"
            >
              <h3 className="text-xl font-bold text-primary mb-2">Facing Eviction?</h3>
              <p className="text-muted-foreground text-sm mb-6">Call our crisis hotline immediately.</p>
              <div className="text-3xl font-extrabold text-accent mb-6">(757) 933-2311</div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12">Call Now</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rights & Tips */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <AnimatedSection variant="slideUp">
                <h2 className="text-3xl font-bold text-primary mb-8">Know Your Rights as a Neighbor</h2>
              </AnimatedSection>
              <StaggerSection className="space-y-4">
                {[
                  { title: "Know Your Rights", desc: "Understanding the Virginia Residential Landlord and Tenant Act.", icon: ShieldCheck, url: "https://www.dhcd.virginia.gov/content/fair-housing" },
                  { title: "How to Handle Disputes", desc: "Free mediation and legal aid for landlord-tenant issues.", icon: Info, url: "https://www.virginialegalaid.org/" },
                  { title: "Eviction Prevention", desc: "Steps to take if you receive a pay-or-quit notice.", icon: AlertCircle, url: "https://www.evictionfreeva.com/" }
                ].map((card, i) => (
                  <StaggerItem key={i}>
                    <Card className="bg-white border-border/50 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="p-3 bg-primary/5 rounded-lg text-primary shrink-0">
                          <card.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground mb-1">{card.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{card.desc}</p>
                          <a href={card.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent hover:underline">Learn More →</a>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerSection>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-primary mb-8">Rental Search Tips</h2>
              <Accordion type="single" collapsible className="w-full bg-white p-6 rounded-2xl border border-border">
                {[
                  { q: "Start with your budget", a: "Aim to spend no more than 30% of your gross monthly income on rent and utilities combined." },
                  { q: "Understand the lease", a: "Always read the entire lease before signing. Ask questions about fees, notice periods, and maintenance responsibilities." },
                  { q: "Check utilities included", a: "A cheaper rent might actually cost more if no utilities are included. Verify what you're responsible for paying." },
                  { q: "Inspect before signing", a: "Walk through the exact unit you will be renting, not just a model, and document any existing damage." },
                  { q: "Know your rights before you sign", a: "Familiarize yourself with state tenant laws regarding security deposits and habitability." }
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`tip-${i}`} className="border-border">
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Counseling CTA */}
      <AnimatedSection variant="wipeUp" className="py-12 bg-white border-y border-border">
        <div className="container mx-auto px-4 max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6 bg-muted/50 p-8 rounded-2xl">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">Talk to a Rental Counselor</h2>
            <p className="text-muted-foreground">Free, confidential help navigating your rental search and understanding leases.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white h-12 px-8 rounded-lg font-bold shrink-0">
            Schedule a Session
          </Button>
        </div>
      </AnimatedSection>

      {/* Spot the Hidden Fees */}
      <section className="py-16 bg-white border-t border-border/40">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-sm font-semibold text-rose-600 mb-3">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Lease Review Challenge
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Can You Spot the Hidden Fees?</h2>
            <p className="text-muted-foreground">Before you sign any lease, know what you're actually paying for.</p>
          </div>
          <SpotHiddenFees />
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection variant="fadeIn" className="mb-8">
            <h3 className="text-xl font-bold text-muted-foreground">Our Community Partners</h3>
          </AnimatedSection>
          <StaggerSection className="flex flex-wrap justify-center gap-4">
            {[
              { name: "NNRHA", tag: "Housing Authority" },
              { name: "Virginia Housing", tag: "State Finance" },
              { name: "United Way", tag: "Social Services" },
              { name: "Habitat for Humanity", tag: "Affordable Builds" },
              { name: "Legal Aid Society", tag: "Tenant Defense" }
            ].map((p, i) => (
              <StaggerItem key={i}>
                <div className="bg-white border border-border px-6 py-4 rounded-xl shadow-sm min-w-[200px]">
                  <div className="font-bold text-primary">{p.name}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{p.tag}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerSection>
        </div>
      </section>
    </div>
  );
}
