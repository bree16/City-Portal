import React from 'react';
import { motion } from 'framer-motion';
import { HandHeart, Home, Wrench, ShieldAlert, ArrowRight, FileCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { AnimatedSection, StaggerSection, StaggerItem } from '@/components/ui/AnimatedSection';
import assistanceHero from '@assets/generated_images/assistance_hero.jpg';

export default function AssistancePage() {
  const programs = [
    {
      icon: ShieldAlert,
      name: "Emergency Rental Assistance",
      audience: "Renters facing immediate eviction",
      desc: "Short-term financial assistance to help low-income families who have experienced an unexpected financial hardship avoid eviction.",
      color: "bg-red-50 text-red-600"
    },
    {
      icon: FileCheck,
      name: "Section 8 Housing Vouchers",
      audience: "Low-income families, elderly, disabled",
      desc: "Federal program assisting very low-income families to afford decent, safe, and sanitary housing in the private market.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: HandHeart,
      name: "Homeless Prevention",
      audience: "Individuals at risk of homelessness",
      desc: "Counseling, mediation, and financial aid designed to keep individuals and families safely housed.",
      color: "bg-amber-50 text-amber-600"
    },
    {
      icon: Home,
      name: "First-Time Homebuyer Help",
      audience: "Prospective buyers meeting income limits",
      desc: "Grants and deferred loans to assist with down payments and closing costs for purchasing a first home in the city.",
      color: "bg-teal-50 text-teal-600"
    },
    {
      icon: Wrench,
      name: "Home Repair Assistance",
      audience: "Low-income homeowners",
      desc: "Grants or low-interest loans to fix critical health and safety hazards, roof repairs, or accessibility modifications.",
      color: "bg-indigo-50 text-indigo-600"
    }
  ];

  return (
    <div className="flex flex-col w-full pt-20">
      {/* Hero */}
      <section className="relative text-white py-24 lg:py-36 text-center px-4 overflow-hidden">
        <img src={assistanceHero} alt="Housing counselor helping a family" className="absolute inset-0 w-full h-full object-cover z-0 living-photo" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/92 via-primary/80 to-accent/50 z-10" />
        <div className="container mx-auto max-w-4xl relative z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-sm font-medium mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Housing Assistance Programs
            </div>
            <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
              <HandHeart className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Newport News Has Your Back</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              No one faces a housing challenge alone here. From emergency help to long-term programs, our community has resources for every situation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variant="slideUp" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Programs Ready to Help</h2>
            <div className="h-1 w-14 bg-accent rounded-full mt-2 mb-4 mx-auto" />
            <p className="text-muted-foreground max-w-xl mx-auto">Every program below is available to Newport News residents — find the one that fits your situation.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog, i) => (
              <motion.div
                key={prog.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white group flex flex-col">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${prog.color}`}>
                      <prog.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">{prog.name}</h3>
                    <div className="text-xs font-bold text-accent uppercase tracking-wider mb-4 pb-4 border-b border-border/50">
                      For: {prog.audience}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                      {prog.desc}
                    </p>
                    <Button variant="outline" className="w-full justify-between group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                      How to Apply <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Need Help Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: programs.length * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Card className="h-full border-none bg-gradient-to-br from-accent to-accent/80 text-white flex flex-col justify-center shadow-md">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Not sure where to start?</h3>
                  <p className="text-white/90 mb-8">
                    Our housing specialists can help identify which programs you qualify for.
                  </p>
                  <Button asChild className="w-full bg-white text-accent hover:bg-white/90 font-bold rounded-lg h-12">
                    <Link href="/contact">Contact a Specialist</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <AnimatedSection variant="wipeRight" className="py-16 bg-primary text-white text-center px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Take the First Step?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Talk to a certified housing specialist — free, confidential, and available now.
          </p>
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-full h-14 px-10 text-lg shadow-xl">
            <Link href="/contact">Get Help Today</Link>
          </Button>
        </div>
      </AnimatedSection>
    </div>
  );
}
