import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, DollarSign, Key, FileText, BadgePercent } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function BuyPage() {
  return (
    <div className="flex flex-col w-full pt-20">
      {/* Hero */}
      <section className="bg-primary text-white py-20 lg:py-28 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 z-0"></div>
        <div className="container mx-auto relative z-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-4 block">Homeownership</span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Your Journey to Homeownership Starts Here</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Discover programs, grants, and expert guidance to help you navigate the process of buying a home in Newport News.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">The Buying Process</h2>
            <p className="text-muted-foreground text-lg">Four simple steps to get you from thinking about buying to holding the keys.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-12 left-24 right-24 h-0.5 bg-muted"></div>
            
            {[
              { step: 1, title: "Check Eligibility", desc: "Review your finances and see if you qualify for assistance programs.", icon: FileText },
              { step: 2, title: "Get Pre-Approved", desc: "Work with a lender to understand exactly how much you can borrow.", icon: DollarSign },
              { step: 3, title: "Find Your Home", desc: "Partner with a real estate agent to find a home that fits your needs.", icon: CheckCircle2 },
              { step: 4, title: "Close the Deal", desc: "Sign the paperwork, finalize the loan, and get your keys!", icon: Key }
            ].map((s, i) => (
              <motion.div 
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-muted border-8 border-white flex items-center justify-center shadow-sm mb-6 z-10 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <s.icon className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
                </div>
                <div className="absolute top-0 right-0 -mr-2 -mt-2 w-8 h-8 rounded-full bg-secondary text-primary font-bold flex items-center justify-center shadow-md z-20">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">Loan Programs & Grants</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">Financial products tailored for first-time buyers, veterans, and residents needing down payment assistance.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "FHA Loans", desc: "Government-backed loans allowing down payments as low as 3.5%. Ideal for first-time buyers with lower credit scores." },
              { title: "VA Loans", desc: "Zero down payment required for qualifying veterans, active-duty service members, and eligible surviving spouses." },
              { title: "First-Time Buyer Grant", desc: "Up to $15,000 in forgivable grants for Newport News residents purchasing their first home within city limits." },
              { title: "Down Payment Assistance", desc: "Deferred loans to cover closing costs and down payments for low-to-moderate income households." }
            ].map((prog, i) => (
              <Card key={i} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col h-full">
                  <BadgePercent className="w-8 h-8 text-accent mb-4" />
                  <h3 className="text-lg font-bold text-primary mb-3">{prog.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1 leading-relaxed">{prog.desc}</p>
                  <Button variant="link" className="px-0 text-accent font-semibold justify-start mt-4">Learn more →</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "What credit score do I need to buy a home?", a: "While conventional loans often require a score of 620 or higher, some FHA loans can be approved with a score as low as 580. Our housing counselors can help you review your credit and make a plan to improve it." },
              { q: "How much do I need for a down payment?", a: "You don't always need 20%. Many programs allow for 3% to 5% down, and some VA or USDA loans require 0% down. Our First-Time Buyer Grant can also help cover these costs." },
              { q: "Do I qualify as a first-time homebuyer?", a: "Generally, if you haven't owned a principal residence in the past three years, you are considered a first-time homebuyer for most assistance programs." },
              { q: "How long does the buying process take?", a: "From getting pre-approved to closing on a house, it typically takes 30 to 60 days, though finding the right home can take several months depending on the market." },
              { q: "Are there income limits for assistance programs?", a: "Yes, many city and state grants are based on Area Median Income (AMI). Limits vary based on household size. Contact us to verify your eligibility." }
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

      <section className="py-16 bg-accent text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-6">Talk to a Housing Counselor</h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">Get free, personalized advice from a certified professional who can help you map out your homebuying strategy.</p>
        <Button asChild size="lg" className="bg-white text-accent hover:bg-white/90 font-bold rounded-full h-14 px-8">
          <Link href="/contact">Schedule a Consultation</Link>
        </Button>
      </section>
    </div>
  );
}
