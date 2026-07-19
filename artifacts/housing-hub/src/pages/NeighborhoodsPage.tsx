import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, School, TreePine, Coffee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import hiltonImage from '@assets/generated_images/hilton_village.jpg';
import denbighImage from '@assets/generated_images/denbigh.jpg';
import oysterImage from '@assets/generated_images/oyster_point.jpg';
import southeastImage from '@assets/generated_images/southeast.jpg';

export default function NeighborhoodsPage() {
  const neighborhoods = [
    {
      id: "hilton",
      name: "Hilton Village",
      tagline: "Historic charm and artisan spirit",
      img: hiltonImage,
      desc: "Built during WWI as a planned community for shipyard workers, Hilton Village offers historic, cottage-style homes, tree-lined streets, and a vibrant strip of local boutiques and cafes along Warwick Blvd.",
      stats: { price: "$320k", rent: "$1,300", walk: "Very Walkable", schools: "Highly Rated" },
      features: ["Historic District", "Local Shops", "James River Access"]
    },
    {
      id: "denbigh",
      name: "Denbigh",
      tagline: "Suburban space and family friendly",
      img: denbighImage,
      desc: "Located in the northern part of the city, Denbigh is known for larger lot sizes, extensive park systems including Newport News Park, and excellent family amenities. It's a quieter, suburban retreat.",
      stats: { price: "$285k", rent: "$1,200", walk: "Car Dependent", schools: "Good" },
      features: ["Newport News Park", "Spacious Lots", "Quiet Streets"]
    },
    {
      id: "oyster-point",
      name: "Oyster Point",
      tagline: "Modern living and bustling commerce",
      img: oysterImage,
      desc: "The city's business and entertainment hub. City Center at Oyster Point features modern townhomes, luxury apartments, fine dining, and events around the impressive 5-acre fountain.",
      stats: { price: "$350k", rent: "$1,600", walk: "Walkable", schools: "Good" },
      features: ["City Center", "Dining & Events", "Modern Builds"]
    },
    {
      id: "southeast",
      name: "Southeast Community",
      tagline: "Rich heritage and community focus",
      img: southeastImage,
      desc: "A community rich in African American history and cultural heritage. It features waterfront views, historic landmarks, and is currently the focus of significant city revitalization efforts and new affordable housing initiatives.",
      stats: { price: "$210k", rent: "$950", walk: "Somewhat Walkable", schools: "Improving" },
      features: ["Waterfront Parks", "Cultural Heritage", "Revitalization Zone"]
    }
  ];

  return (
    <div className="flex flex-col w-full pt-20">
      {/* Hero */}
      <section className="bg-primary text-white py-16 lg:py-24 text-center px-4 relative">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-20"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Discover Newport News Neighborhoods</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            From historic villages to modern city centers, find the community that fits your lifestyle and budget.
          </p>
        </div>
      </section>

      {/* Neighborhoods List */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-24">
          {neighborhoods.map((hood, i) => (
            <motion.div
              key={hood.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
            >
              {/* Image side */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                  <img src={hood.img} alt={hood.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                    {hood.features.map(f => (
                      <Badge key={f} className="bg-primary/80 hover:bg-primary text-white backdrop-blur-md border-none">{f}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content side */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-accent font-semibold mb-2">
                    <MapPin className="w-5 h-5" /> Newport News, VA
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">{hood.name}</h2>
                  <p className="text-xl text-muted-foreground italic">{hood.tagline}</p>
                </div>
                
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {hood.desc}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Avg Home Price</p>
                    <p className="text-xl font-bold text-primary">{hood.stats.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Avg Rent (2BR)</p>
                    <p className="text-xl font-bold text-primary">{hood.stats.rent}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">{hood.stats.walk}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">{hood.stats.schools}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="rounded-full px-6 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                    View Listings in {hood.name}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
