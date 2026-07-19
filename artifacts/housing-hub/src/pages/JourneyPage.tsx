import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Building2, Home, Landmark, Hammer, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function JourneyPage() {
  const journeyCards = [
    {
      icon: Building2, title: "I'm Renting",
      desc: "Find affordable rentals, understand your rights, and access rental assistance programs.",
      href: "/rent", color: "teal"
    },
    {
      icon: Home, title: "I Want to Buy My First Home",
      desc: "Explore homebuyer programs, down payment assistance, and get step-by-step guidance.",
      href: "/buy", color: "navy"
    },
    {
      icon: Landmark, title: "I Already Own a Home",
      desc: "Learn about repair programs, refinancing options, and resources to protect your investment.",
      href: "/resources", color: "teal"
    },
    {
      icon: Hammer, title: "I Need Home Repairs",
      desc: "Access repair assistance programs and connect with certified contractors in Newport News.",
      href: "/assistance", color: "navy"
    },
    {
      icon: AlertTriangle, title: "I Need Emergency Housing Help",
      desc: "Get immediate help with eviction prevention, homelessness resources, and crisis assistance.",
      href: "/assistance", color: "teal"
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
                  <div className="group bg-white rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer h-full flex flex-col border-l-4 border-l-accent" data-testid={`card-journey-${i}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <card.icon className="w-8 h-8 text-primary" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-3">{card.title}</h2>
                    <p className="text-muted-foreground leading-relaxed flex-1">{card.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {/* 5th card centered */}
          <div className="mt-6 flex justify-center">
            <motion.div className="w-full md:w-1/2"
              initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
              transition={{delay: 0.4, duration: 0.5}} viewport={{once:true}}>
              <Link href={journeyCards[4].href}>
                <div className="group bg-white rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col border-l-4 border-l-accent" data-testid="card-journey-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <AlertTriangle className="w-8 h-8 text-primary" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                  <h2 className="text-xl font-bold text-primary mb-3">{journeyCards[4].title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{journeyCards[4].desc}</p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="py-16 bg-accent/10 border-t border-accent/20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-primary mb-3">Not Sure Where to Start?</h2>
          <p className="text-muted-foreground mb-6">Take our 2-minute eligibility quiz to find programs that match your exact situation.</p>
          <Link href="/quiz">
            <button className="bg-accent text-white px-8 py-3 rounded-full font-semibold hover:bg-accent/90 transition-colors inline-flex items-center gap-2" data-testid="button-take-quiz">
              Take the Quiz <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
