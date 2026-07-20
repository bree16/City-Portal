import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ChevronLeft, ChevronRight, ExternalLink, ArrowRight, Pause, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import newsCampMorrison from '@assets/stock_images/news_camp_morrison.jpg';
import newsChoice from '@assets/stock_images/news_choice_groundbreak.jpg';
import newsSailor from '@assets/stock_images/news_sailor_housing.jpg';
import eventConcert from '@assets/stock_images/why_events.jpg';
import eventFair from '@assets/stock_images/why_arts.jpg';
import eventClass from '@assets/stock_images/why_schools.jpg';

interface Slide {
  kind: 'News' | 'Event';
  image: string;
  title: string;
  meta: string;
  desc: string;
  href: string;
  external?: boolean;
  credit?: string;
}

const SLIDES: Slide[] = [
  {
    kind: 'News',
    image: newsChoice,
    title: "City breaks ground on final Neighborhood Choice Initiative phase",
    meta: "WTKR News 3",
    desc: "The last phase of the Choice Neighborhood transformation is underway in Southeast Newport News.",
    href: "https://www.wtkr.com/news/in-the-community/newport-news/newport-news-breaks-ground-on-final-neighborhood-choice-initiative-phase",
    external: true,
  },
  {
    kind: 'Event',
    image: eventFair,
    title: "Newport News Housing Fair",
    meta: "Sep 3, 2026 • Convention Center",
    desc: "Meet lenders, landlords, and housing counselors — a full day of resources and networking.",
    href: "/events",
  },
  {
    kind: 'News',
    image: newsSailor,
    title: "City seeks state support for sailor housing near the shipyard",
    meta: "WTKR News 3",
    desc: "A proposed project would bring hundreds of new homes for Navy sailors near Newport News Shipbuilding.",
    href: "https://www.wtkr.com/news/in-the-community/newport-news/newport-news-seeks-state-support-for-sailor-housing-project-near-shipbuilding-facility",
    external: true,
  },
  {
    kind: 'Event',
    image: eventConcert,
    title: "Port Warwick Summer Concert Series",
    meta: "Summer 2026 • Styron Square",
    desc: "Free live music in Styron Square — bring a chair and meet your neighbors.",
    href: "/events",
  },
  {
    kind: 'News',
    image: newsCampMorrison,
    title: "Camp Morrison redevelopment could bring new housing",
    meta: "The Virginian-Pilot",
    desc: "The WWI-era industrial park is being eyed for a major residential redevelopment.",
    href: "https://www.pilotonline.com/2026/07/16/newport-news-delays-camp-morrison-redevelopment/",
    external: true,
  },
  {
    kind: 'Event',
    image: eventClass,
    title: "First-Time Buyer Class",
    meta: "Sep 10, 2026 • Online (Zoom)",
    desc: "HUD-approved homebuyer education — required for most city assistance programs.",
    href: "/events",
  },
];

const INTERVAL_MS = 6000;

export function NewsEventsSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = SLIDES[index];

  return (
    <section className="py-24 bg-muted/40" aria-label="Newport News news and events">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Happening in Newport News</h2>
            <p className="text-muted-foreground text-lg">Real news and upcoming events from around the city.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prev} aria-label="Previous slide" className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-primary hover:bg-muted transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play slideshow" : "Pause slideshow"} className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-primary hover:bg-muted transition-colors">
              {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button onClick={next} aria-label="Next slide" className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-primary hover:bg-muted transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden shadow-lg bg-primary"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative aspect-[16/10] sm:aspect-[16/7]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
                  <Badge className={slide.kind === 'News' ? "bg-accent text-white border-none mb-3" : "bg-secondary text-primary border-none mb-3"}>
                    {slide.kind === 'News' ? 'In the News' : 'Upcoming Event'}
                  </Badge>
                  <h3 className="text-xl sm:text-3xl font-bold mb-2 max-w-3xl leading-tight">{slide.title}</h3>
                  <div className="text-white/70 text-sm font-semibold mb-2">{slide.meta}</div>
                  <p className="text-white/85 text-sm sm:text-base max-w-2xl mb-4 line-clamp-2">{slide.desc}</p>
                  {slide.external ? (
                    <a href={slide.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-secondary hover:text-white transition-colors">
                      Read the story <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link href={slide.href} className="inline-flex items-center gap-2 font-bold text-secondary hover:text-white transition-colors">
                      See event details <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* On-image arrows */}
          <button
            onClick={prev}
            aria-label="Previous picture"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/35 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            aria-label="Next picture"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/35 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="absolute top-5 right-5 flex gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
