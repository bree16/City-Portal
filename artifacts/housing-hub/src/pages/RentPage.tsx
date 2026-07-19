import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Info, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function RentPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const listings = [
    { id: 1, name: "Oyster Point Apartments", price: "$1,200", beds: 2, baths: 1, hood: "Oyster Point", type: "Affordable", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "Denbigh Village Townhomes", price: "$1,450", beds: 3, baths: 2, hood: "Denbigh", type: "Market Rate", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "Hilton Historical Lofts", price: "$950", beds: 1, baths: 1, hood: "Hilton Village", type: "Income Restricted", img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800" },
    { id: 4, name: "Southeast Community Flats", price: "$800", beds: 2, baths: 1, hood: "Southeast", type: "Subsidized", img: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&q=80&w=800" },
    { id: 5, name: "City Center Residences", price: "$1,600", beds: 2, baths: 2, hood: "Oyster Point", type: "Market Rate", img: "https://images.unsplash.com/photo-1502672260266-1c1c24240f57?auto=format&fit=crop&q=80&w=800" },
    { id: 6, name: "Warwick Boulevard Apartments", price: "$1,100", beds: 1, baths: 1, hood: "Denbigh", type: "Affordable", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800" },
  ];

  const filteredListings = listings.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.hood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full pt-20 bg-muted/30 min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-16 lg:py-24 text-center px-4 relative">
        <div className="container mx-auto max-w-4xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Find Your Next Home in Newport News</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
            Browse affordable rentals, subsidized housing, and market-rate apartments across the city.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto bg-white p-2 rounded-2xl sm:rounded-full shadow-xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search by neighborhood or complex name..." 
                className="pl-12 h-12 rounded-xl sm:rounded-full border-none focus-visible:ring-0 text-foreground bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="h-12 px-8 rounded-xl sm:rounded-full bg-accent hover:bg-accent/90 text-white font-bold">
              Search Rentals
            </Button>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-primary">Available Rentals ({filteredListings.length})</h2>
            <Button variant="outline" className="gap-2 rounded-full border-border bg-white text-foreground">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 bg-white group cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img src={listing.img} alt={listing.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-primary backdrop-blur-sm font-semibold shadow-sm">
                        {listing.type}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-primary line-clamp-1">{listing.name}</h3>
                      <span className="font-extrabold text-accent text-lg">{listing.price}<span className="text-sm text-muted-foreground font-normal">/mo</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                      <MapPin className="w-4 h-4" /> {listing.hood}
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                        <BedDouble className="w-4 h-4 text-muted-foreground" /> {listing.beds} Beds
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                        <Bath className="w-4 h-4 text-muted-foreground" /> {listing.baths} Baths
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {filteredListings.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                No listings found matching "{searchTerm}". Try another search.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tenant Resources */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-10 text-center">Tenant Rights & Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Eviction Prevention", desc: "Legal assistance and emergency funding if you are facing eviction." },
              { title: "Tenant Rights Guide", desc: "Understand your rights regarding maintenance, leases, and security deposits." },
              { title: "Housing Choice Vouchers", desc: "Learn about the Section 8 program and how to join the waitlist." }
            ].map((res, i) => (
              <Card key={i} className="bg-muted border-none shadow-none">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-primary mb-2">{res.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{res.desc}</p>
                  <Button variant="link" className="p-0 text-accent font-semibold h-auto">Read More →</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
