import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, School, TreePine, Coffee, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import hiltonImage from '@assets/generated_images/hilton_village.jpg';
import denbighImage from '@assets/generated_images/denbigh.jpg';
import oysterImage from '@assets/generated_images/oyster_point.jpg';
import southeastImage from '@assets/generated_images/southeast.jpg';
import neighborhoodsHero from '@assets/generated_images/neighborhoods_hero.jpg';

export default function NeighborhoodsPage() {
  const neighborhoods = [
    {
      id: "hilton",
      name: "Hilton Village",
      tagline: "Newport News' oldest planned community with charming historic architecture and tree-lined streets.",
      img: hiltonImage,
      stats: { price: "$285,000", rent: "$1,150", walk: "7.2", schools: "8.1", parks: "5", restaurants: "18" }
    },
    {
      id: "denbigh",
      name: "Denbigh",
      tagline: "A thriving suburban neighborhood with excellent schools, shopping, and family-friendly parks.",
      img: denbighImage,
      stats: { price: "$245,000", rent: "$1,050", walk: "6.8", schools: "8.6", parks: "8", restaurants: "32" }
    },
    {
      id: "oyster-point",
      name: "Oyster Point",
      tagline: "A modern mixed-use district with waterfront views, tech employers, and upscale dining.",
      img: oysterImage,
      stats: { price: "$315,000", rent: "$1,350", walk: "7.9", schools: "7.8", parks: "4", restaurants: "45" }
    },
    {
      id: "southeast",
      name: "Southeast Community",
      tagline: "An established neighborhood rich in history and culture with affordable housing options.",
      img: southeastImage,
      stats: { price: "$195,000", rent: "$875", walk: "6.1", schools: "7.2", parks: "6", restaurants: "14" }
    }
  ];

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
              Four Neighborhoods. One City.
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">Discover Newport News Neighborhoods</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Four distinct neighborhoods. One welcoming city. Explore the community that feels like home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Neighborhood Cards Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            {neighborhoods.map((hood, i) => (
              <motion.div
                key={hood.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-none shadow-lg overflow-hidden bg-white group flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img src={hood.img} alt={hood.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                    <h2 className="absolute bottom-4 left-6 text-3xl font-extrabold text-white">{hood.name}</h2>
                  </div>
                  
                  <CardContent className="p-6 sm:p-8 flex flex-col flex-1">
                    <p className="text-foreground/80 leading-relaxed text-lg mb-8 flex-1">
                      {hood.tagline}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Avg Price</p>
                        <p className="text-lg font-extrabold text-primary flex items-center gap-1"><DollarSign className="w-4 h-4 text-accent" />{hood.stats.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Avg Rent</p>
                        <p className="text-lg font-extrabold text-primary flex items-center gap-1"><DollarSign className="w-4 h-4 text-accent" />{hood.stats.rent}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Walkability</p>
                        <p className="text-lg font-extrabold text-primary flex items-center gap-1"><Navigation className="w-4 h-4 text-accent" />{hood.stats.walk}<span className="text-sm text-muted-foreground font-medium">/10</span></p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Schools</p>
                        <p className="text-lg font-extrabold text-primary flex items-center gap-1"><School className="w-4 h-4 text-accent" />{hood.stats.schools}<span className="text-sm text-muted-foreground font-medium">/10</span></p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Parks</p>
                        <p className="text-lg font-extrabold text-primary flex items-center gap-1"><TreePine className="w-4 h-4 text-accent" />{hood.stats.parks}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Restaurants</p>
                        <p className="text-lg font-extrabold text-primary flex items-center gap-1"><Coffee className="w-4 h-4 text-accent" />{hood.stats.restaurants}</p>
                      </div>
                    </div>

                    <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold text-base mt-auto">
                      View Neighborhood
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map & Comparison */}
      <section className="py-20 bg-white border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Map Placeholder */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Explore the Map</h2>
              <div className="w-full h-[400px] bg-accent/5 border border-accent/20 rounded-2xl flex flex-col items-center justify-center gap-4 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#0A8F7E_2px,_transparent_2px)] bg-[length:24px_24px] z-0"></div>
                <MapPin className="w-12 h-12 text-accent z-10" />
                <div className="text-center z-10 px-4">
                  <h3 className="font-bold text-primary text-xl mb-2">Interactive Neighborhood Map</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">A full interactive map is in development. For now, explore each neighborhood below.</p>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="bg-primary text-white p-4">
                <h2 className="text-lg font-bold">Neighborhood Comparison</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-primary font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Neighborhood</th>
                      <th className="px-6 py-4">Avg Home</th>
                      <th className="px-6 py-4">Avg Rent</th>
                      <th className="px-6 py-4 text-center">Walk</th>
                      <th className="px-6 py-4 text-center">Schools</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {neighborhoods.map((hood, i) => (
                      <tr key={hood.id} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                        <td className="px-6 py-4 font-bold text-primary">{hood.name}</td>
                        <td className="px-6 py-4 font-medium">{hood.stats.price}</td>
                        <td className="px-6 py-4 font-medium">{hood.stats.rent}</td>
                        <td className="px-6 py-4 text-center font-bold text-accent">{hood.stats.walk}</td>
                        <td className="px-6 py-4 text-center font-bold text-accent">{hood.stats.schools}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
