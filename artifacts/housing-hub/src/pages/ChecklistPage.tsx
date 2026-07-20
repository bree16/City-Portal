import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Printer, CheckCircle2, Circle, ExternalLink, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChecklistItem {
  id: string;
  text: string;
  link?: { label: string; href: string; external?: boolean };
}

interface ChecklistPhase {
  phase: string;
  timeframe: string;
  items: ChecklistItem[];
}

const PHASES: ChecklistPhase[] = [
  {
    phase: "Get Financially Ready",
    timeframe: "6–12 months before",
    items: [
      { id: "credit", text: "Pull your free credit report and fix any errors", link: { label: "AnnualCreditReport.com", href: "https://www.annualcreditreport.com/", external: true } },
      { id: "score", text: "Work your credit score toward 620+ (640+ opens more programs)" },
      { id: "budget", text: "Build a monthly budget and track your spending for 3 months" },
      { id: "savings", text: "Start saving — many Virginia programs need as little as 1% down" },
      { id: "debt", text: "Pay down credit cards to below 30% of their limits" },
    ],
  },
  {
    phase: "Learn & Get Counseling",
    timeframe: "3–6 months before",
    items: [
      { id: "education", text: "Complete a free homebuyer education course (required for most assistance programs)", link: { label: "Virginia Housing free course", href: "https://www.virginiahousing.com/homebuyers/homebuyer-education", external: true } },
      { id: "counselor", text: "Meet with a HUD-approved housing counselor — it's free", link: { label: "Find a counselor", href: "https://www.hud.gov/counseling", external: true } },
      { id: "programs", text: "Explore down payment assistance you may qualify for", link: { label: "Assistance programs", href: "/assistance" } },
      { id: "quiz", text: "Take our readiness quiz to see where you stand", link: { label: "Readiness quiz", href: "/quiz" } },
    ],
  },
  {
    phase: "Get Pre-Approved",
    timeframe: "2–3 months before",
    items: [
      { id: "documents", text: "Gather pay stubs, W-2s, tax returns, and bank statements" },
      { id: "lenders", text: "Compare at least 3 lenders — ask about Virginia Housing loans" },
      { id: "preapproval", text: "Get a pre-approval letter (not just pre-qualification)" },
      { id: "dpa", text: "Apply for down payment assistance grants before you shop", link: { label: "Virginia Housing DPA grant", href: "https://www.virginiahousing.com/homebuyers/down-payment-assistance-grant", external: true } },
    ],
  },
  {
    phase: "Shop for Your Home",
    timeframe: "1–3 months",
    items: [
      { id: "agent", text: "Choose a local buyer's agent who knows Newport News", link: { label: "Virginia Peninsula REALTORS", href: "https://vpar.realtor/", external: true } },
      { id: "hoods", text: "Compare neighborhoods on prices, schools, and commute", link: { label: "Neighborhood guide", href: "/neighborhoods" } },
      { id: "tour", text: "Tour homes and take notes — kitchens and roofs cost the most to fix" },
      { id: "offer", text: "Make an offer with your agent; negotiate repairs after inspection" },
    ],
  },
  {
    phase: "Close & Move In",
    timeframe: "30–45 days",
    items: [
      { id: "inspection", text: "Schedule a home inspection right after your offer is accepted" },
      { id: "insurance", text: "Shop for homeowner's insurance before closing" },
      { id: "walkthrough", text: "Do a final walk-through 24 hours before closing" },
      { id: "closing", text: "Bring your ID and certified funds to closing — then get your keys" },
      { id: "utilities", text: "Set up utilities with the city", link: { label: "City bill pay", href: "https://www.nnva.gov/1433/Pay-a-Bill", external: true } },
    ],
  },
];

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const total = PHASES.reduce((n, p) => n + p.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <section className="relative bg-primary text-white py-20 print:hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_70%_30%,_#D4A843_0%,_transparent_60%)] z-0 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="bg-white/10 text-white border-white/20 mb-6">Free Printable Guide</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">First-Time Buyer Checklist</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Every step from "thinking about it" to keys in hand — tuned for Newport News programs and resources.
            </p>
            <Button onClick={() => window.print()} className="bg-accent hover:bg-accent/90 text-white font-bold h-12 px-6 rounded-lg gap-2">
              <Printer className="w-4 h-4" /> Print This Checklist
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Progress */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20 print:hidden">
        <Card className="shadow-md border-border/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-primary">Your progress</span>
                <span className="text-muted-foreground">{done} of {total} done</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${(done / total) * 100}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phases */}
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <h1 className="hidden print:block text-3xl font-bold text-primary">First-Time Buyer Checklist — Newport News Housing Hub</h1>
        {PHASES.map((phase, pi) => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: pi * 0.05, duration: 0.4 }}
          >
            <Card className="border-l-4 border-l-accent border-border/50 shadow-sm print:shadow-none print:break-inside-avoid">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
                  <h2 className="text-2xl font-bold text-primary">
                    <span className="text-accent mr-2">{pi + 1}.</span>{phase.phase}
                  </h2>
                  <Badge variant="outline" className="bg-secondary/10 text-primary border-secondary/20">{phase.timeframe}</Badge>
                </div>
                <ul className="space-y-4">
                  {phase.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <button
                        onClick={() => toggle(item.id)}
                        aria-label={checked[item.id] ? "Mark as not done" : "Mark as done"}
                        aria-pressed={!!checked[item.id]}
                        className="mt-0.5 text-accent shrink-0 print:hidden"
                      >
                        {checked[item.id] ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 text-muted-foreground/50" />}
                      </button>
                      <span className="hidden print:inline-block mt-1 w-3.5 h-3.5 border border-foreground/60 rounded-sm shrink-0" />
                      <div className={checked[item.id] ? "text-muted-foreground line-through" : "text-foreground/90"}>
                        {item.text}
                        {item.link && (
                          item.link.external ? (
                            <a href={item.link.href} target="_blank" rel="noopener noreferrer" className="ml-2 text-accent font-semibold hover:underline inline-flex items-center gap-1 print:hidden">
                              {item.link.label} <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <Link href={item.link.href} className="ml-2 text-accent font-semibold hover:underline inline-flex items-center gap-1 print:hidden">
                              {item.link.label} <ArrowRight className="w-3 h-3" />
                            </Link>
                          )
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* CTA */}
        <Card className="bg-primary text-white border-none print:hidden">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Not sure where you are on this list?</h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              A free HUD-approved housing counselor can walk through it with you, or practice the whole journey in our simulator.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild className="bg-accent hover:bg-accent/90 text-white font-bold">
                <a href="https://www.hud.gov/counseling" target="_blank" rel="noopener noreferrer">Talk to a Counselor</a>
              </Button>
              <Button asChild variant="outline" className="border-white/30 bg-white text-primary hover:bg-white/90 font-bold">
                <Link href="/simulator">Try the Simulator</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
