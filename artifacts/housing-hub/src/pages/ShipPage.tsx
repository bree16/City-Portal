import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Building2, Home, HeartHandshake, ShieldCheck, ExternalLink, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedSection, StaggerSection, StaggerItem } from '@/components/ui/AnimatedSection';

const PILLARS = [
  {
    icon: FileText,
    title: "Policy & Regulatory Reform",
    what: "Updating zoning and city rules so it's easier and faster to build the homes Newport News needs.",
    forYou: "More home options coming to the market over time — including 'missing middle' homes like townhomes and duplexes.",
  },
  {
    icon: Building2,
    title: "Housing Production & Redevelopment",
    what: "Programs that support small and local developers and turn underused land into new housing.",
    forYou: "New construction means more choices and less competition for the homes already here.",
  },
  {
    icon: HeartHandshake,
    title: "Affordability & Access",
    what: "Expanding homeownership opportunities, down payment help, and housing for every income and stage of life.",
    forYou: "More assistance programs and starter homes within reach for first-time buyers and working families.",
  },
  {
    icon: ShieldCheck,
    title: "Preservation & Neighborhood Stability",
    what: "Stronger code enforcement, rental inspections, vacant property registries, and home rehabilitation support.",
    forYou: "Safer rentals, better-maintained blocks, and help fixing up the home you already own.",
  },
];

export default function ShipPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <section className="relative bg-primary text-white py-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_30%_30%,_#D4A843_0%,_transparent_60%)] z-0 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="bg-white/10 text-white border-white/20 mb-6">Adopted February 2026</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">What SHIP Means for You</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              The Strategic Housing Initiatives Plan is Newport News' roadmap for making housing more attainable —
              here's the plain-language version.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-border/50 shadow-sm mb-10">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">The short version</h2>
              <p className="text-foreground/85 leading-relaxed mb-4">
                The City's Comprehensive Housing Study found Newport News needs more homes, at more price points,
                in better condition. In response, a citywide working group — including Planning, Development, Codes,
                and the Newport News Redevelopment and Housing Authority — built the SHIP as a practical roadmap
                for turning policy ideas into action.
              </p>
              <p className="text-foreground/85 leading-relaxed">
                It covers affordable, workforce, market-rate, senior, and family housing — because a city where
                teachers, shipbuilders, nurses, and retirees can all find a home is a city where the whole economy thrives.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pillars */}
        <AnimatedSection variant="slideUp" className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-2">The four pillars</h2>
          <div className="h-1 w-14 bg-accent rounded-full mx-auto mt-2 mb-3" />
          <p className="text-muted-foreground">And what each one actually does for residents.</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="h-full border-l-4 border-l-accent border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-accent mb-4">
                    <p.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-primary mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{p.what}</p>
                  <div className="bg-secondary/10 rounded-lg p-4">
                    <span className="text-xs font-bold uppercase tracking-wide text-primary/70 block mb-1">For you</span>
                    <p className="text-sm text-foreground/85 leading-relaxed">{p.forYou}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* What you can do now */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-primary text-white border-none">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><Home className="w-6 h-6 text-accent" /> What you can do today</h2>
              <p className="text-white/80 mb-6">
                You don't have to wait for the plan to finish — these resources exist right now.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-accent hover:bg-accent/90 text-white font-bold">
                  <Link href="/checklist">Start the Buyer Checklist</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/30 bg-white text-primary hover:bg-white/90 font-bold">
                  <Link href="/assistance">Explore Assistance Programs</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/30 bg-white text-primary hover:bg-white/90 font-bold">
                  <a href="https://www.nnva.gov/3027/Housing-Resources" target="_blank" rel="noopener noreferrer" className="gap-1">
                    Official City Page <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
