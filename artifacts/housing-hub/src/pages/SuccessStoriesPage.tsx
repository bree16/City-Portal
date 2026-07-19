import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import storyFamily from '@assets/generated_images/story_family_1.jpg';
import storyVeteran from '@assets/generated_images/story_veteran.jpg';
import storySingleMom from '@assets/generated_images/story_single_mom.jpg';
import storySenior from '@assets/generated_images/story_senior_couple.jpg';

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start > end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [end, isInView]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function SuccessStoriesPage() {
  const stories = [
    {
      name: "Marcus T.",
      hood: "Denbigh",
      program: "First-Time Buyer Program",
      story: "I never thought I'd own a home at 26. The counselor helped me understand my options and the grant covered my down payment. I closed in March and it still feels unreal.",
      quote: "This program changed my life.",
      initials: "MT",
      color: "bg-blue-600",
      photo: storyVeteran
    },
    {
      name: "Jasmine R.",
      hood: "Southeast Community",
      program: "Emergency Rental Assistance",
      story: "When I lost my job, I was terrified of losing our apartment. The emergency assistance kept us housed while I got back on my feet. The staff treated us with dignity every step of the way.",
      quote: "They gave us hope when we needed it most.",
      initials: "JR",
      color: "bg-teal-600",
      photo: storySingleMom
    },
    {
      name: "Devon S.",
      hood: "Oyster Point",
      program: "Affordability Calculator",
      story: "I used the calculator thinking I wasn't ready. Turns out I was closer than I thought. Six months later I had a pre-approval letter. The tools on this site genuinely work.",
      quote: "It opened my eyes to what was possible.",
      initials: "DS",
      color: "bg-amber-600",
      photo: null
    },
    {
      name: "Alicia M.",
      hood: "Hilton Village",
      program: "Housing Counseling",
      story: "My credit was a mess and I didn't know where to start. Three sessions with my counselor and I had a real plan. Two years later my score went up 120 points and I bought my first home.",
      quote: "The guidance was priceless.",
      initials: "AM",
      color: "bg-purple-600",
      photo: null
    },
    {
      name: "James & Keisha W.",
      hood: "Denbigh",
      program: "Down Payment Assistance",
      story: "We had the income but not the savings. The DPA grant covered everything we needed at closing. Newport News makes homeownership feel possible for working families.",
      quote: "We couldn't have done it without the grant.",
      initials: "JW",
      color: "bg-indigo-600",
      photo: storyFamily
    },
    {
      name: "Tanya B.",
      hood: "Southeast Community",
      program: "Section 8 Voucher",
      story: "The voucher program gave my family stability we hadn't had in years. A safe, affordable place made everything else possible — school, work, health.",
      quote: "A safe home is the foundation for everything.",
      initials: "TB",
      color: "bg-rose-600",
      photo: storySenior
    }
  ];

  return (
    <div className="flex flex-col w-full pt-20 min-h-screen bg-muted/20">
      {/* Hero */}
      <section className="bg-primary text-white py-16 lg:py-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0B2146] to-primary z-0"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
            <Heart className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">Stories from Newport News</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Your neighbors found their path home in Newport News. Here are their stories.
          </p>
        </div>
      </section>

      {/* Stats Band */}
      <section className="bg-primary py-12 relative overflow-hidden border-t border-white/10">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 divide-x divide-white/10">
            {[
              { end: 2400, label: "Families Assisted", suffix: "+" },
              { end: 18, label: "Housing Aid", prefix: "$", suffix: "M" },
              { end: 340, label: "Affordable Units" },
              { end: 92, label: "Satisfaction", suffix: "%" },
              { end: 25, label: "Partners", suffix: "+" }
            ].map((stat, i) => (
              <div key={i} className="text-center px-2">
                <div className="text-3xl md:text-4xl font-extrabold text-secondary mb-2">
                  <AnimatedCounter end={stat.end} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-white/80 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((story, i) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-none shadow-md hover:shadow-xl transition-shadow bg-white overflow-hidden relative">
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-muted/50 rotate-180 pointer-events-none" />
                  <CardContent className="p-8 sm:p-10 flex flex-col h-full relative z-10">
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-md shrink-0 ring-2 ring-border">
                        {story.photo ? (
                          <img src={story.photo} alt={story.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-white text-xl font-bold ${story.color}`}>
                            {story.initials}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-primary">{story.name}</h3>
                        <p className="text-muted-foreground text-sm font-medium">{story.hood}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <Badge className="bg-secondary text-primary font-bold hover:bg-secondary/90 border-none shadow-sm">{story.program}</Badge>
                    </div>
                    
                    <p className="text-foreground/80 leading-relaxed text-lg mb-6 flex-1">
                      {story.story}
                    </p>
                    
                    <p className="text-primary font-semibold italic text-lg mt-auto">
                      "{story.quote}"
                    </p>
                    
                    <div className="flex gap-1 mt-6 text-secondary">
                      {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Share Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Share Your Story</h2>
          <p className="text-muted-foreground text-lg mb-10">
            Did our programs help you find or keep your home? We'd love to hear from you. Your story can inspire others in the community to take the first step.
          </p>
          
          <Card className="text-left border-border/50 shadow-lg bg-muted/10">
            <CardContent className="p-8">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Name</label>
                    <Input placeholder="Your full name" className="bg-white border-border focus-visible:ring-accent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Neighborhood</label>
                    <Input placeholder="e.g. Denbigh" className="bg-white border-border focus-visible:ring-accent" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Program Used (if any)</label>
                  <Input placeholder="e.g. First-Time Buyer Grant" className="bg-white border-border focus-visible:ring-accent" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Your Story</label>
                  <Textarea rows={5} placeholder="Tell us how we helped you..." className="bg-white border-border focus-visible:ring-accent resize-none" />
                </div>
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg">
                  Submit Your Story
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
