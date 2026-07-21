import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedSection, StaggerSection, StaggerItem } from '@/components/ui/AnimatedSection';

type FilterType = 'All' | 'Workshop' | 'Education' | 'Community';

interface HubEvent {
  id: string | number;
  title: string;
  dateStr: string;
  fullDate: string;
  isoDate?: string | null;
  time: string;
  location: string;
  type: string;
  desc: string;
  url: string;
  color?: string;
}

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const fallbackEvents: HubEvent[] = [
    {
      id: 1,
      title: "Beyond the Keys Homeowner Workshop",
      dateStr: "AUG 8",
      fullDate: "Aug 8, 2026",
      isoDate: "2026-08-08",
      time: "9:30 AM – 11:00 AM",
      location: "The Legacy of HOPE Foundation, Newport News",
      type: "Workshop",
      desc: "An in-person workshop on managing, maintaining, and making the most of your home — for new and seasoned homeowners alike.",
      color: "bg-primary",
      url: "https://stayhappening.com/e/beyond-the-keys-homeowner-workshop-E118SB1DR25PO"
    },
    {
      id: 2,
      title: "Empower Your Finances: Navigating the Road to Independence",
      dateStr: "AUG 15",
      fullDate: "Multiple dates",
      isoDate: "2026-08-15",
      time: "See Eventbrite for times",
      location: "Newport News, VA",
      type: "Education",
      desc: "A recurring Newport News event with the knowledge, tools, and strategies to take control of your financial future.",
      color: "bg-accent",
      url: "https://www.eventbrite.com/e/newport-news-virginia-empower-your-finances-tickets-1000827049647"
    },
    {
      id: 3,
      title: "Bank On Hampton Roads — Fall Financial Classes",
      dateStr: "SEP 1",
      fullDate: "Sep 2026 – Jan 2027",
      isoDate: "2026-09-01",
      time: "Virtual & in-person classes",
      location: "Hampton Roads (virtual options)",
      type: "Education",
      desc: "A free, five-month financial literacy program: save, invest, reduce debt, and improve your credit score. Pre-register now for the September cohort.",
      color: "bg-accent",
      url: "https://www.surveymonkey.com/r/LB3W28H"
    },
    {
      id: 4,
      title: "Home & Healthy Living Expo",
      dateStr: "SEP 24",
      fullDate: "Sep 24, 2026",
      isoDate: "2026-09-24",
      time: "10:00 AM – 2:00 PM",
      location: "Newport News, VA",
      type: "Community",
      desc: "A community expo connecting Hampton Roads residents with home, wellness, and lifestyle resources, guest speakers, and local professionals.",
      color: "bg-primary",
      url: "https://stayhappening.com/e/home-andamp-healthy-living-expo-E2ISYOJ6NRK"
    },
    {
      id: 5,
      title: "Virginia Housing Free Homebuyer Class",
      dateStr: "ONGOING",
      fullDate: "Year-round",
      time: "Multiple sessions monthly",
      location: "Online & regional locations",
      type: "Education",
      desc: "The free homebuyer education course accepted by most assistance programs. Pick a date that works for you on the official calendar.",
      color: "bg-accent",
      url: "https://www.virginiahousing.com/individuals-families/calendar"
    },
    {
      id: 6,
      title: "NNRHA Events, Waitlists & Free Training",
      dateStr: "ONGOING",
      fullDate: "Updated regularly",
      time: "Varies by program",
      location: "NNRHA, Newport News",
      type: "Community",
      desc: "The housing authority posts waitlist openings (like Lassiter Courts) and free training programs here — check often, openings fill fast.",
      color: "bg-primary",
      url: "https://nnrha.net/upcoming-events/"
    }
  ];

  const [events, setEvents] = useState<HubEvent[]>(fallbackEvents);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/events')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: { events: HubEvent[]; updatedAt: string }) => {
        if (cancelled || !Array.isArray(data.events) || data.events.length === 0) return;
        setEvents(data.events);
        setUpdatedAt(data.updatedAt);
      })
      .catch(() => { /* keep fallback list */ });
    return () => { cancelled = true; };
  }, []);

  const upcoming = events.filter((e) => {
    if (!e.isoDate) return true;
    return new Date(e.isoDate + 'T23:59:59').getTime() >= Date.now();
  });

  const filteredEvents = activeFilter === 'All'
    ? upcoming
    : upcoming.filter(e => e.type === activeFilter);

  // Type color map
  const typeColors: Record<string, { bg: string; text: string; badge: string }> = {
    Workshop: { bg: 'from-blue-600 to-blue-400', text: 'text-blue-700', badge: 'bg-blue-50 border-blue-200 text-blue-700' },
    Education: { bg: 'from-teal-600 to-teal-400', text: 'text-teal-700', badge: 'bg-teal-50 border-teal-200 text-teal-700' },
    Community: { bg: 'from-violet-600 to-violet-400', text: 'text-violet-700', badge: 'bg-violet-50 border-violet-200 text-violet-700' },
  };

  const featuredEvent = filteredEvents[0];
  const remainingEvents = filteredEvents.slice(1);

  return (
    <div className="flex flex-col w-full pt-20 min-h-screen bg-[#f5f7fc]">
      {/* ── Hero ── */}
      <section className="relative bg-[#060d1a] text-white py-24 lg:py-32 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[160px] opacity-30 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-accent rounded-full blur-[140px] opacity-20 pointer-events-none" />
        <div className="absolute top-[30%] right-[20%] w-[280px] h-[280px] bg-secondary rounded-full blur-[120px] opacity-15 pointer-events-none" />

        <div className="container mx-auto max-w-5xl px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-7 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Newport News Community Calendar
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.05]">
              Happening in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-[#00C2D4]">Newport News</span>
            </h1>
            <p className="text-xl text-white/65 max-w-2xl mx-auto leading-relaxed">
              Workshops on homebuying, financial literacy classes, and community events — all in one place.
            </p>
          </motion.div>

          {/* Quick filter tabs in hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center mt-10"
          >
            {(['All', 'Workshop', 'Education', 'Community'] as FilterType[]).map((type) => {
              const colors = typeColors[type] ?? {};
              return (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border ${
                    activeFilter === type
                      ? 'bg-white text-primary border-white shadow-lg scale-105'
                      : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20 hover:border-white/25'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 56" className="w-full" preserveAspectRatio="none" style={{ height: 56 }}>
            <path d="M0,56 C360,0 1080,0 1440,56 L1440,56 L0,56 Z" fill="#f5f7fc" />
          </svg>
        </div>
      </section>

      {/* ── Featured Event ── */}
      {featuredEvent && (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-accent inline-block" /> Featured Event
            </div>
            <motion.a
              href={featuredEvent.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`block group relative overflow-hidden rounded-3xl bg-gradient-to-br ${
                typeColors[featuredEvent.type]?.bg ?? 'from-primary to-primary/80'
              } text-white shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-40 pointer-events-none" />
              <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
                {/* Date block */}
                <div className="shrink-0 text-center bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 min-w-[100px]">
                  {featuredEvent.dateStr.includes(' ') ? (
                    <>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-80">{featuredEvent.dateStr.split(' ')[0]}</div>
                      <div className="text-5xl font-extrabold leading-none my-1">{featuredEvent.dateStr.split(' ')[1]}</div>
                    </>
                  ) : (
                    <div className="text-lg font-extrabold uppercase tracking-widest">{featuredEvent.dateStr}</div>
                  )}
                  <div className="text-xs opacity-70 mt-1">2026</div>
                </div>

                <div className="flex-1">
                  <Badge className="bg-white/20 text-white border-none mb-3 text-xs font-bold uppercase tracking-wider">{featuredEvent.type}</Badge>
                  <h2 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight">{featuredEvent.title}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-white/80 mb-4">
                    <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4" />{featuredEvent.fullDate} • {featuredEvent.time}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{featuredEvent.location}</span>
                  </div>
                  <p className="text-white/75 leading-relaxed max-w-2xl">{featuredEvent.desc}</p>
                </div>

                <div className="shrink-0">
                  <span className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-full shadow-lg group-hover:shadow-xl transition-shadow text-sm">
                    Register Now <CalendarIcon className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.a>
          </div>
        </section>
      )}

      {/* ── Event Cards Grid ── */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {remainingEvents.length > 0 && (
            <>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
                <span className="w-6 h-px bg-muted-foreground inline-block" /> All Events
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {remainingEvents.map((evt, i) => {
                  const colors = typeColors[evt.type] ?? typeColors['Community'];
                  return (
                    <motion.a
                      key={evt.id}
                      href={evt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.45, delay: i * 0.06 }}
                      className="group block bg-white rounded-2xl border border-border/60 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                    >
                      {/* Colored top stripe */}
                      <div className={`h-1.5 w-full bg-gradient-to-r ${colors.bg}`} />
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          {/* Date pill */}
                          <div className={`shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-br ${colors.bg} text-white text-center min-w-[56px]`}>
                            {evt.dateStr.includes(' ') ? (
                              <>
                                <div className="text-[9px] font-bold uppercase tracking-wider opacity-80">{evt.dateStr.split(' ')[0]}</div>
                                <div className="text-xl font-extrabold leading-tight">{evt.dateStr.split(' ')[1]}</div>
                              </>
                            ) : (
                              <div className="text-[9px] font-extrabold uppercase tracking-widest">{evt.dateStr}</div>
                            )}
                          </div>
                          <Badge variant="outline" className={`text-xs ${colors.badge} shrink-0`}>{evt.type}</Badge>
                        </div>
                        <h3 className="font-bold text-primary text-base leading-snug mb-3 group-hover:text-accent transition-colors">{evt.title}</h3>
                        <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5 text-accent shrink-0" />{evt.fullDate} · {evt.time}</div>
                          <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-accent shrink-0" />{evt.location}</div>
                        </div>
                        <p className="text-sm text-foreground/70 leading-relaxed flex-1 line-clamp-3 mb-4">{evt.desc}</p>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-accent group-hover:gap-2.5 transition-all mt-auto">
                          Register <CalendarIcon className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </>
          )}

          {filteredEvents.length === 0 && (
            <div className="text-center py-24 text-muted-foreground bg-white rounded-3xl border border-border">
              <CalendarIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <div className="font-bold text-lg">No events in this category right now.</div>
              <button onClick={() => setActiveFilter('All')} className="mt-4 text-sm text-accent font-semibold hover:underline">Show all events</button>
            </div>
          )}
        </div>
      </section>

      {/* Ongoing classes */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Ongoing Classes & Counseling</h2>
            <p className="text-muted-foreground mb-8">
              These real programs run year-round — no need to wait for an event date.
            </p>
            <StaggerSection className="grid md:grid-cols-2 gap-6">
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
                <StaggerItem key={c.title}>
                  <div className="border border-border rounded-xl p-6 flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <h3 className="font-bold text-lg text-primary mb-1">{c.title}</h3>
                    <div className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">{c.schedule}</div>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-5 flex-1">{c.desc}</p>
                    <Button asChild variant="outline" className="w-fit font-semibold">
                      <a href={c.href} target="_blank" rel="noopener noreferrer">{c.cta}</a>
                    </Button>
                  </div>
                </StaggerItem>
              ))}
            </StaggerSection>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
