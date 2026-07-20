import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type FilterType = 'All' | 'Workshop' | 'Volunteer' | 'Education' | 'Community';

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const events = [
    {
      id: 1,
      title: "Homebuyer Workshop",
      dateStr: "AUG 5",
      fullDate: "Aug 5, 2026",
      time: "10:00 AM – 12:00 PM",
      location: "City Hall, Room 204",
      type: "Workshop",
      desc: "Step-by-step guide to buying your first home in Newport News. Learn about the process from credit prep to closing.",
      color: "bg-primary"
    },
    {
      id: 2,
      title: "Financial Literacy Seminar",
      dateStr: "AUG 12",
      fullDate: "Aug 12, 2026",
      time: "6:00 PM – 8:00 PM",
      location: "Online (Zoom)",
      type: "Education",
      desc: "Build the financial foundation to qualify for a mortgage. Focus on budgeting, credit scores, and saving.",
      color: "bg-accent"
    },
    {
      id: 3,
      title: "Neighborhood Cleanup: Hilton Village",
      dateStr: "AUG 19",
      fullDate: "Aug 19, 2026",
      time: "9:00 AM – 12:00 PM",
      location: "Hilton Village Park",
      type: "Volunteer",
      desc: "Join neighbors to clean and beautify our community green spaces. Supplies provided.",
      color: "bg-secondary"
    },
    {
      id: 4,
      title: "Newport News Housing Fair",
      dateStr: "SEP 3",
      fullDate: "Sep 3, 2026",
      time: "11:00 AM – 4:00 PM",
      location: "Convention Center",
      type: "Community",
      desc: "Meet lenders, landlords, housing counselors, and more. A full day of resources and networking.",
      color: "bg-primary"
    },
    {
      id: 5,
      title: "First-Time Buyer Class",
      dateStr: "SEP 10",
      fullDate: "Sep 10, 2026",
      time: "5:30 PM – 8:00 PM",
      location: "Online (Zoom)",
      type: "Education",
      desc: "HUD-approved homebuyer education course. Required for most city assistance programs.",
      color: "bg-accent"
    },
    {
      id: 6,
      title: "Fair Housing Workshop",
      dateStr: "SEP 17",
      fullDate: "Sep 17, 2026",
      time: "2:00 PM – 4:00 PM",
      location: "Main Library",
      type: "Workshop",
      desc: "Know your rights as a renter or homebuyer under the Fair Housing Act.",
      color: "bg-primary"
    },
    {
      id: 7,
      title: "Community Garden Volunteer Day",
      dateStr: "SEP 24",
      fullDate: "Sep 24, 2026",
      time: "8:00 AM – 11:00 AM",
      location: "Southeast Park",
      type: "Volunteer",
      desc: "Help maintain community green spaces and learn about urban gardening.",
      color: "bg-secondary"
    },
    {
      id: 8,
      title: "Rental Resources Info Session",
      dateStr: "OCT 1",
      fullDate: "Oct 1, 2026",
      time: "6:00 PM – 7:30 PM",
      location: "NNRHA Office",
      type: "Education",
      desc: "Learn about affordable rentals, vouchers, tenant rights, and emergency assistance.",
      color: "bg-accent"
    }
  ];

  const filteredEvents = activeFilter === 'All' 
    ? events 
    : events.filter(e => e.type === activeFilter);

  return (
    <div className="flex flex-col w-full pt-20 min-h-screen bg-muted/20">
      {/* Hero */}
      <section className="bg-primary text-white py-20 lg:py-28 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B2146] via-primary to-accent/50 z-0" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_70%_30%,_#D4A843_0%,_transparent_60%)] z-0 pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="container mx-auto max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-sm font-medium mb-6 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            Newport News Community
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Community Events & Workshops</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Connect, learn, and grow. Join us for workshops on homebuying, financial literacy, and community building.
          </p>
        </motion.div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column: Calendar Hint & Filters */}
            <div className="lg:col-span-1 space-y-8">
              {/* Filter Pills */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                <h3 className="font-bold text-primary mb-4">Filter by Type</h3>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Workshop', 'Volunteer', 'Education', 'Community'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveFilter(type as FilterType)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === type 
                          ? 'bg-primary text-white' 
                          : 'bg-muted text-foreground hover:bg-border/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Decorative Calendar */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hidden lg:block">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-primary">October 2026</h3>
                  <div className="flex gap-1">
                    <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground">&lt;</button>
                    <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground">&gt;</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
                  <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {/* Empty slots for Sep */}
                  <div className="p-2 text-muted-foreground/30">27</div>
                  <div className="p-2 text-muted-foreground/30">28</div>
                  <div className="p-2 text-muted-foreground/30">29</div>
                  <div className="p-2 text-muted-foreground/30">30</div>
                  {/* Days */}
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    const hasEvent = day === 1; // event on oct 1
                    return (
                      <div key={day} className="relative p-2 aspect-square flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer">
                        <span className={hasEvent ? 'font-bold text-primary' : 'text-foreground'}>{day}</span>
                        {hasEvent && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Events List */}
            <div className="lg:col-span-2 space-y-6">
              {filteredEvents.map((evt, i) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col sm:flex-row group">
                    <div className={`${evt.color} text-white p-6 flex flex-col items-center justify-center min-w-[120px] shrink-0 text-center`}>
                      <span className="text-sm font-bold uppercase tracking-wider mb-1 opacity-90">{evt.dateStr.split(' ')[0]}</span>
                      <span className="text-4xl font-extrabold">{evt.dateStr.split(' ')[1]}</span>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="mb-2">
                        <Badge variant="outline" className={`${
                          evt.type === 'Workshop' ? 'text-blue-600 border-blue-200 bg-blue-50' :
                          evt.type === 'Education' ? 'text-teal-600 border-teal-200 bg-teal-50' :
                          evt.type === 'Volunteer' ? 'text-amber-600 border-amber-200 bg-amber-50' :
                          'text-indigo-600 border-indigo-200 bg-indigo-50'
                        }`}>
                          {evt.type}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-3">{evt.title}</h3>
                      
                      <div className="space-y-2 text-sm text-muted-foreground font-medium mb-4 flex-1">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-accent" /> {evt.fullDate} • {evt.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" /> {evt.location}
                        </div>
                      </div>
                      
                      <p className="text-foreground/80 text-sm mb-6 leading-relaxed">
                        {evt.desc}
                      </p>
                      
                      <div className="mt-auto">
                        <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">
                          Register
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredEvents.length === 0 && (
                <div className="text-center py-20 text-muted-foreground bg-white rounded-2xl border border-border">
                  No events found for this category.
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Ongoing & recurring classes — real programs you can join any time */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Ongoing Classes & Counseling</h2>
            <p className="text-muted-foreground mb-8">
              These real programs run year-round — no need to wait for an event date.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Virginia Housing Free Homebuyer Course",
                  schedule: "Self-paced online, or live classes offered monthly",
                  desc: "The free education course required for Virginia Housing loans and most down payment assistance. Certificate on completion.",
                  href: "https://www.virginiahousing.com/homebuyers/homebuyer-education",
                  cta: "Enroll Free"
                },
                {
                  title: "HUD-Approved Housing Counseling",
                  schedule: "By appointment, year-round",
                  desc: "One-on-one help with budgeting, credit repair, buying, or avoiding foreclosure — free or low-cost with approved agencies serving Newport News.",
                  href: "https://www.hud.gov/counseling",
                  cta: "Find a Counselor"
                },
                {
                  title: "NNRHA Homeownership Programs",
                  schedule: "Office hours Mon–Fri • (757) 928-2620",
                  desc: "The Housing Authority's homeownership and family self-sufficiency programs for Newport News residents.",
                  href: "https://nnrha.net/",
                  cta: "Visit NNRHA"
                },
                {
                  title: "United Way 211 Referrals",
                  schedule: "24/7 — call or text 2-1-1",
                  desc: "Not sure where to start? A live specialist connects you to rent help, classes, and local housing services.",
                  href: "https://www.211virginia.org/",
                  cta: "Get Connected"
                },
              ].map((c) => (
                <div key={c.title} className="border border-border rounded-xl p-6 flex flex-col hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg text-primary mb-1">{c.title}</h3>
                  <div className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">{c.schedule}</div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-5 flex-1">{c.desc}</p>
                  <Button asChild variant="outline" className="w-fit font-semibold">
                    <a href={c.href} target="_blank" rel="noopener noreferrer">{c.cta}</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
