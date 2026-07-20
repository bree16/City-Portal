import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, School, TreePine, Coffee, DollarSign, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NeighborhoodMap } from '@/components/NeighborhoodMap';
import { NEIGHBORHOODS, CITY_MARKET } from '@/data/market';

import hiltonImage from '@assets/generated_images/hilton_village.jpg';
import denbighImage from '@assets/generated_images/denbigh.jpg';
import oysterImage from '@assets/generated_images/oyster_point.jpg';
import southeastImage from '@assets/generated_images/southeast.jpg';
import portWarwickImage from '@assets/generated_images/port_warwick.jpg';
import kilnCreekImage from '@assets/generated_images/kiln_creek.jpg';
import neighborhoodsHero from '@assets/generated_images/neighborhoods_hero.jpg';

const HOOD_IMAGES: Record<string, string> = {
  hilton: hiltonImage,
  denbigh: denbighImage,
  'oyster-point': oysterImage,
  southeast: southeastImage,
  'port-warwick': portWarwickImage,
  'kiln-creek': kilnCreekImage,
};

export default function NeighborhoodsPage() {
  const scrollToHood = (id: string) => {
    document.getElementById(`hood-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="flex flex-col w-full pt-20 bg-muted/20">
      {/* Hero — photo background */}
      <section className="bg-primary text-white py-20 lg:py-32 text-center px-4 relative overflow-hidden">
        <img src={neighborhoodsHero} alt="Beautiful tree-lined street in Newport News" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/75 to-accent/40 z-10" />
        <div className="container mx-auto max-w-4xl relative z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-sm font-medium mb-5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Six Neighborhoods. One City.
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">Discover Newport News Neighborhoods</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              From historic Hilton Village to master-planned Kiln Creek — explore the community that feels like home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-white border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary">Explore the Map</h2>
              <p className="text-muted-foreground mt-1">Click a pin to see typical prices and jump to live Zillow listings.</p>
            </div>
            <p className="text-xs text-muted-foreground">Market data: {CITY_MARKET.updated} · Median sale price citywide {CITY_MARKET.medianSalePrice}</p>
          </div>
          <NeighborhoodMap onSelect={scrollToHood} />
        </div>
      </section>

      {/* Neighborhood Cards Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            {NEIGHBORHOODS.map((hood, i) => (
              <motion.div
                key={hood.id}
                id={`hood-${hood.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-none shadow-lg overflow-hidden bg-white group flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img src={HOOD_IMAGES[hood.id]} alt={hood.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                    <h2 className="absolute bottom-4 left-6 text-3xl font-extrabold text-white">{hood.name}</h2>
                  </div>

                  <CardContent className="p-6 sm:p-8 flex flex-col flex-1">
                    <p className="text-foreground/80 leading-relaxed text-lg mb-8 flex-1">
                      {hood.tagline}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Typical Home</p>
                        <p className="text-lg font-extrabold text-primary flex items-center gap-1"><DollarSign className="w-4 h-4 text-accent" />{hood.medianHome}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Typical Rent</p>
                        <p className="text-lg font-extrabold text-primary flex items-center gap-1"><DollarSign className="w-4 h-4 text-accent" />{hood.medianRent}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Walkability</p>
                        <p className="text-lg font-extrabold text-primary flex items-center gap-1"><Navigation className="w-4 h-4 text-accent" />{hood.walk}<span className="text-sm text-muted-foreground font-medium">/10</span></p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Schools</p>
                        <p className="text-lg font-extrabold text-primary flex items-center gap-1"><School className="w-4 h-4 text-accent" />{hood.schools}<span className="text-sm text-muted-foreground font-medium">/10</span></p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Parks</p>
                        <p className="text-lg font-extrabold text-primary flex items-center gap-1"><TreePine className="w-4 h-4 text-accent" />{hood.parks}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Restaurants</p>
                        <p className="text-lg font-extrabold text-primary flex items-center gap-1"><Coffee className="w-4 h-4 text-accent" />{hood.restaurants}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <Button asChild className="h-12 bg-accent hover:bg-accent/90 text-white font-bold text-base">
                        <a href={hood.zillowBuyUrl} target="_blank" rel="noopener noreferrer">
                          Homes for Sale <ExternalLink className="w-4 h-4 ml-1.5" />
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="h-12 border-primary/20 text-primary hover:bg-primary hover:text-white font-bold text-base">
                        <a href={hood.zillowRentUrl} target="_blank" rel="noopener noreferrer">
                          Rentals <ExternalLink className="w-4 h-4 ml-1.5" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-white border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="bg-primary text-white p-4 flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-bold">Neighborhood Comparison</h2>
              <span className="text-xs text-white/70">Estimates from {CITY_MARKET.updated} market reports — verify on Zillow</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-primary font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Neighborhood</th>
                    <th className="px-6 py-4">Typical Home</th>
                    <th className="px-6 py-4">Typical Rent</th>
                    <th className="px-6 py-4 text-center">Walk</th>
                    <th className="px-6 py-4 text-center">Schools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {NEIGHBORHOODS.map((hood, i) => (
                    <tr key={hood.id} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                      <td className="px-6 py-4 font-bold text-primary">{hood.name}</td>
                      <td className="px-6 py-4 font-medium">{hood.medianHome}</td>
                      <td className="px-6 py-4 font-medium">{hood.medianRent}</td>
                      <td className="px-6 py-4 text-center font-bold text-accent">{hood.walk}</td>
                      <td className="px-6 py-4 text-center font-bold text-accent">{hood.schools}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
