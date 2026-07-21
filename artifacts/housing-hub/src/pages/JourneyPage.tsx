import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Building2, Home, Landmark, Hammer, AlertTriangle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { HomeInspectionGame } from '@/components/games/HomeInspectionGame';
import journeyRenting from '@assets/generated_images/journey_renting.jpg';
import journeyBuying from '@assets/generated_images/journey_buying.jpg';
import journeyOwning from '@assets/generated_images/journey_owning.jpg';
import journeyRepairs from '@assets/generated_images/journey_repairs.jpg';
import journeyEmergency from '@assets/generated_images/journey_emergency.jpg';

export default function JourneyPage() {
  const journeyCards = [
    {
      icon: Building2, title: "I'm Renting",
      desc: "Find affordable rentals, understand your rights, and access rental assistance programs.",
      href: "/rent", color: "teal", img: journeyRenting,
      tag: "Rental Resources"
    },
    {
      icon: Home, title: "I Want to Buy My First Home",
      desc: "Explore homebuyer programs, down payment assistance, and get step-by-step guidance.",
      href: "/buy", color: "navy", img: journeyBuying,
      tag: "First-Time Buyer"
    },
    {
      icon: Landmark, title: "I Already Own a Home",
      desc: "Learn about repair programs, refinancing options, and resources to protect your investment.",
      href: "/resources", color: "teal", img: journeyOwning,
      tag: "Homeownership"
    },
    {
      icon: Hammer, title: "I Need Home Repairs",
      desc: "Access repair assistance programs and connect with certified contractors in Newport News.",
      href: "/assistance", color: "navy", img: journeyRepairs,
      tag: "Repair Programs"
    },
    {
      icon: AlertTriangle, title: "I Need Emergency Housing Help",
      desc: "Get immediate help with eviction prevention, homelessness resources, and crisis assistance.",
      href: "/assistance", color: "teal", img: journeyEmergency,
      tag: "Emergency Help"
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 pt-32 pb-24 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-secondary" />
              Personalized Guidance
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Where Are You on Your Housing Journey?</h1>
            <p className="text-xl text-white/80">Select where you are today and we'll guide you to the right resources.</p>
          </motion.div>
        </div>
      </section>

      {/* Journey Cards */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journeyCards.slice(0,4).map((card, i) => (
              <motion.div key={card.title}
                initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
                transition={{delay: i * 0.1, duration: 0.5}} viewport={{once:true}}>
                <Link href={card.href}>
                  <div className="group bg-white rounded-2xl shadow-sm border border-border/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 cursor-pointer overflow-hidden flex flex-col" data-testid={`card-journey-${i}`}>
                    {/* Photo header */}
                    <div className="relative h-52 overflow-hidden">
                      <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 living-photo-2" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/20 to-transparent" />
                      {/* Number badge */}
                      <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-extrabold text-white flex items-center justify-center">
                        0{i+1}
                      </div>
                      {/* Tag */}
                      <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-accent text-white text-xs font-semibold">
                        {card.tag}
                      </div>
                      {/* Icon floating at bottom */}
                      <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 inline-flex">
                        <card.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1 border-l-4 border-l-accent">
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="text-xl font-bold text-primary leading-snug flex-1 pr-4">{card.title}</h2>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-sm flex-1">{card.desc}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {/* 5th card — full width, horizontal layout */}
          <motion.div className="mt-6"
            initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
            transition={{delay: 0.4, duration: 0.5}} viewport={{once:true}}>
            <Link href={journeyCards[4].href}>
              <div className="group bg-white rounded-2xl shadow-sm border border-border/30 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 cursor-pointer overflow-hidden flex flex-col md:flex-row" data-testid="card-journey-4">
                {/* Photo left */}
                <div className="relative md:w-72 h-52 md:h-auto overflow-hidden shrink-0">
                  <img src={journeyCards[4].img} alt={journeyCards[4].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 living-photo-5" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-primary/75 via-primary/20 to-transparent" />
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-extrabold text-white flex items-center justify-center">05</div>
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                    {journeyCards[4].tag}
                  </div>
                </div>
                {/* Content right */}
                <div className="p-6 md:p-8 flex flex-col justify-center border-l-4 border-l-accent flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-red-50 inline-flex mb-4">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                  <h2 className="text-xl font-bold text-primary mb-3">{journeyCards[4].title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{journeyCards[4].desc}</p>
                  <div className="mt-4 text-sm font-semibold text-accent flex items-center gap-1 group-hover:underline">
                    Get Help Now <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Home Inspection Game */}
      <section className="py-16 bg-white border-t border-border/40">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-sm font-semibold text-teal-700 mb-3">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Interactive Scenario
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Home Inspection Decisions</h2>
            <p className="text-muted-foreground">Three real situations. What would you do? Every choice has real consequences.</p>
          </div>
          <HomeInspectionGame />
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="py-16 bg-accent/10 border-t border-accent/20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-primary mb-3">Not Sure Where to Start?</h2>
            <p className="text-muted-foreground mb-6">Answer 7 quick questions and we'll match you to the programs, counselors, and resources that fit your life.</p>
            <Link href="/quiz">
              <button className="bg-accent text-white px-8 py-3 rounded-full font-semibold hover:bg-accent/90 transition-colors inline-flex items-center gap-2" data-testid="button-take-quiz">
                Take the Quiz <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
