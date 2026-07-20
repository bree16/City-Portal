import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Home, Landmark, Scale, Key, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import partnersHero from '@assets/generated_images/partners_hero.jpg';

export default function PartnersPage() {
  const featuredPartners = [
    {
      name: "Virginia Housing", icon: Building2, role: "Statewide Housing Finance",
      desc: "Virginia's housing finance agency providing affordable mortgage loans, down payment assistance, and homeownership education statewide."
    },
    {
      name: "NNRHA", icon: Home, role: "Public Housing & Vouchers",
      desc: "Local authority administering the Housing Choice Voucher Program, public housing, and community development initiatives in Newport News."
    },
    {
      name: "HUD", icon: Landmark, role: "Federal Partner",
      desc: "The U.S. Department of Housing and Urban Development provides funding, policy guidelines, and oversight for affordable housing programs nationally."
    },
    {
      name: "HOME of Virginia", icon: Scale, role: "Fair Housing",
      desc: "Nonprofit dedicated to eliminating housing discrimination and ensuring equal access for all Virginia residents through education and advocacy."
    },
    {
      name: "Virginia Peninsula REALTORS®", icon: Key, role: "Real Estate",
      desc: "Local association connecting buyers and sellers while advocating for housing affordability and homeownership access across the Peninsula."
    },
    {
      name: "United Way of Virginia Peninsula", icon: Heart, role: "Social Services",
      desc: "Connecting residents to social services, emergency assistance, and community resources through the 211 helpline and direct programs."
    }
  ];

  const communityOrgs = [
    { name: "Legal Aid Society of Eastern Virginia", desc: "Free civil legal services including eviction defense.", icon: Scale },
    { name: "Habitat for Humanity Peninsula", desc: "Building affordable homes and running the ReStore.", icon: HammerIcon }, // Using home for now, Hammer isn't imported, let's use Home
    { name: "Salvation Army Hampton Roads", desc: "Emergency shelter and utility assistance programs.", icon: Heart },
    { name: "Catholic Charities of Eastern Virginia", desc: "Financial coaching and emergency housing aid.", icon: Landmark },
    { name: "Foodbank of Southeastern Virginia", desc: "Nutrition assistance for families in need.", icon: Heart },
    { name: "LINK (Local Interagency Network)", desc: "Homelessness prevention and transitional support.", icon: Building2 }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      {/* Hero — photo background */}
      <section className="relative pt-32 pb-24 text-white text-center overflow-hidden">
        <img src={partnersHero} alt="Newport News community partners" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/45 z-10" />
        <div className="container mx-auto px-4 max-w-3xl relative z-20">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-sm font-medium mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Community Impact
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Community Partners</h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">Newport News is stronger because of its community. These organizations work alongside the city to make housing accessible, equitable, and welcoming for everyone.</p>
          </motion.div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPartners.map((partner, i) => (
              <motion.div key={partner.name} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay: i*0.1}} viewport={{once:true}}
                className="p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-lg transition-shadow bg-white flex flex-col h-full">
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                    <partner.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider rounded-md mb-2">{partner.role}</div>
                    <h2 className="text-2xl font-bold text-primary">{partner.name}</h2>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-8 flex-1">{partner.desc}</p>
                <div className="flex flex-wrap gap-3 mt-auto">
                  <Button variant="outline" className="border-border/50 text-foreground hover:bg-muted font-medium">Visit Website</Button>
                  <Button variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10 font-medium">Contact Partner</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Organizations */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">Community Organizations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We also collaborate with local nonprofits and agencies to provide wrap-around support.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityOrgs.map((org, i) => (
              <motion.div key={org.name} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} transition={{delay: i*0.05}} viewport={{once:true}}
                className="bg-white p-6 rounded-xl border border-border/40 shadow-sm hover:-translate-y-1 transition-transform group">
                <div className="flex items-center gap-3 mb-3">
                  <org.icon className="w-5 h-5 text-accent" />
                  <h3 className="font-bold text-primary leading-tight">{org.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{org.desc}</p>
                <button className="text-accent text-sm font-medium flex items-center gap-1 group-hover:underline">
                  Learn More <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-20 bg-accent text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl font-bold mb-6">Become a Partner</h2>
            <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
              Are you an organization that supports housing access in Newport News? Join our partner network and help us reach more residents.
            </p>
            <Button variant="outline" size="lg" className="border-white text-primary hover:bg-white/90 bg-white font-bold rounded-full px-8 h-14 shadow-lg">
              Partner With Us
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Inline fallback for Hammer icon which wasn't imported at top
function HammerIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}>
      <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/>
      <path d="M17.64 15 22 10.64"/>
      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56c0 .85-.33 1.65-.93 2.25l-1.25 1.25"/>
    </svg>
  );
}
