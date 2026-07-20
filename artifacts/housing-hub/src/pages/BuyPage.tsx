import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, DollarSign, Key, FileText, BadgePercent, Home, Users, CreditCard, BookOpen, Landmark, ArrowRight, ExternalLink } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import buyHero from '@assets/generated_images/buy_hero.jpg';
import { NEIGHBORHOODS, CITY_MARKET, ZILLOW_ALL_HOMES } from '@/data/market';

export default function BuyPage() {
  return (
    <div className="flex flex-col w-full pt-20 bg-muted/20">
      {/* Hero — split layout with lifestyle photo */}
      <section className="bg-primary text-white relative overflow-hidden min-h-[520px] flex items-center">
        {/* Photo right half */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 z-0">
          <img src={buyHero} alt="Couple receiving keys to their first home" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/10 lg:via-primary/60 lg:to-transparent" />
        </div>
        {/* Dark base for left side */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B2146] via-primary to-primary/90 z-0 lg:w-3/5" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 lg:py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-sm font-medium mb-5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Homeownership Programs
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight leading-[1.1]">Buying Your First Home Starts Here</h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              From dream to keys — Newport News has programs, counselors, and neighbors ready to help you get there.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full h-14 px-10 text-base font-bold shadow-xl shadow-accent/20 transition-transform hover:scale-105">
                <a href="#roadmap">Start Your Journey</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full h-14 px-8 text-base font-semibold bg-transparent">
                <Link href="/quiz">Take the Quiz <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-8 text-white/60 text-sm">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-secondary" /> Free counseling</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-secondary" /> Up to $25K assistance</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-secondary" /> No cost to apply</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Homebuyer Roadmap */}
      <section id="roadmap" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Your Homebuyer Roadmap</h2>
            <p className="text-muted-foreground text-lg">Follow these five steps to make your dream of homeownership a reality.</p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-1 bg-secondary/30 -ml-0.5 rounded-full hidden sm:block"></div>

            <div className="space-y-12">
              {[
                { step: 1, title: "Check Affordability", desc: "Use our calculator to understand what you can afford." },
                { step: 2, title: "Meet with a Housing Counselor", desc: "Free counseling sessions are available to Newport News residents." },
                { step: 3, title: "Take Homebuyer Education", desc: "Complete a HUD-approved education course." },
                { step: 4, title: "Find Down Payment Assistance", desc: "Explore grants and assistance programs." },
                { step: 5, title: "Purchase Your Home", desc: "Work with your realtor and lender to close." }
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex flex-row items-start sm:items-center gap-5 sm:gap-8 ${i % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 w-full ${i % 2 === 0 ? 'sm:text-left' : 'sm:text-right'} text-left`}>
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">{s.title}</h3>
                    <p className="text-muted-foreground text-base sm:text-lg">{s.desc}</p>
                  </div>
                  <div className="order-first sm:order-none shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center relative z-10 shadow-lg border-4 border-white">
                    {s.step}
                  </div>
                  <div className="flex-1 hidden sm:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Programs Built for Newport News Buyers</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Explore financial products and educational resources tailored for residents.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Home, title: "First-Time Buyer Programs", desc: "Special loan products and grants for first-time buyers in Virginia.", href: "https://www.virginiahousing.com/homebuyers", external: true },
              { icon: DollarSign, title: "Down Payment Assistance", desc: "Get help covering your down payment and closing costs.", href: "/assistance", external: false },
              { icon: Users, title: "Housing Counseling", desc: "Free one-on-one sessions with a certified housing counselor.", href: "/contact", external: false },
              { icon: CreditCard, title: "Credit Preparation", desc: "Build your credit score to qualify for the best mortgage rates.", href: "/resources", external: false },
              { icon: BookOpen, title: "Financial Education", desc: "Workshops and online courses to strengthen your financial foundation.", href: "/events", external: false },
              { icon: Landmark, title: "Mortgage Resources", desc: "Compare loan products from local and national lenders.", href: "/resources", external: false }
            ].map((prog, i) => (
              <motion.div
                key={prog.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="bg-white border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl h-full flex flex-col group hover:-translate-y-1">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                      <prog.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">{prog.title}</h3>
                    <p className="text-muted-foreground flex-1 leading-relaxed mb-6">{prog.desc}</p>
                    <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                      {prog.external ? (
                        <a href={prog.href} target="_blank" rel="noopener noreferrer">Learn More</a>
                      ) : (
                        <Link href={prog.href}>Learn More</Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Snapshot */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">What Homes Cost Right Now</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Citywide, the median sale price is {CITY_MARKET.medianSalePrice} ({CITY_MARKET.updated}). Here's what a typical home costs by neighborhood — tap through to live Zillow listings.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {NEIGHBORHOODS.map((n) => (
              <a
                key={n.id}
                href={n.zillowBuyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-muted/30 hover:bg-primary rounded-2xl border border-border p-6 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-primary group-hover:text-white transition-colors">{n.name}</h3>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                </div>
                <p className="text-2xl font-extrabold text-accent group-hover:text-secondary transition-colors">{n.medianHome}</p>
                <p className="text-xs text-muted-foreground group-hover:text-white/70 transition-colors mt-1">typical home value · view listings on Zillow</p>
              </a>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="border-primary/20 text-primary hover:bg-primary hover:text-white font-bold">
              <a href={ZILLOW_ALL_HOMES} target="_blank" rel="noopener noreferrer">
                Browse All Newport News Homes on Zillow <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full bg-muted/10 p-6 rounded-2xl border border-border">
            {[
              { q: "Who qualifies for first-time buyer programs?", a: "Must not have owned a home in the past 3 years, meet income limits, and complete a homebuyer education course." },
              { q: "How much money do I need to buy a home?", a: "It varies. Some programs allow as little as 3% down. Down payment assistance can cover part or all of this." },
              { q: "Can I buy a home with bad credit?", a: "Some programs work with credit scores as low as 580. Our counselors can help you create a plan to improve your score." },
              { q: "What grants are available in Newport News?", a: "Programs include Virginia Housing grants, NNRHA assistance, and federal HOME funds distributed by the city." },
              { q: "How long does the process take?", a: "Typically 60–90 days from pre-approval to closing. Starting early with counseling can shorten this timeline." },
              { q: "Is there help for veterans?", a: "Yes. VA loans offer zero down payment. We also have veteran-specific counseling services." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-semibold text-lg text-primary hover:text-accent hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Talk to a Housing Counselor</h2>
          <p className="text-lg text-white/80 mb-10">Get free, personalized advice from a certified professional who can help you map out your homebuying strategy.</p>
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-full h-14 px-10 text-lg shadow-xl">
            <Link href="/contact">Schedule a Consultation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
