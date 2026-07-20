import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Users, Home, DollarSign, Hammer, Shield, RotateCcw } from 'lucide-react';

const steps = [
  { q: "What best describes your current situation?", opts: ["I'm currently renting","I own a home","Living with family or friends","Currently unhoused or at risk"] },
  { q: "Are you a first-time homebuyer?", opts: ["Yes, I've never owned a home","No, I've owned before","Not sure"] },
  { q: "What is your approximate annual household income?", opts: ["Under $30,000","$30,000 – $50,000","$50,000 – $80,000","Over $80,000"] },
  { q: "How many people are in your household?", opts: ["Just me (1)","2 people","3–4 people","5 or more"] },
  { q: "Are you a U.S. military veteran or active duty?", opts: ["Yes, I'm a veteran","Yes, active duty","No"] },
  { q: "Are you currently a Newport News resident?", opts: ["Yes","Planning to move there","No"] },
  { q: "What is your primary housing goal?", opts: ["Find affordable housing","Buy my first home","Get emergency help","Repair my home","Learn about my options"] },
];

export default function QuizPage() {
  const [step, setStep] = useState(0); // 0-6 = questions, 7 = results
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(''));
  const [direction, setDirection] = useState(1);

  const select = (opt: string) => {
    const next = [...answers]; next[step] = opt; setAnswers(next);
  };
  const next = () => { setDirection(1); if (step < 6) setStep(s => s+1); else setStep(7); };
  const back = () => { setDirection(-1); setStep(s => Math.max(0, s-1)); };
  const reset = () => { setStep(0); setAnswers(Array(7).fill('')); };

  const results: { icon: typeof Users; name: string; desc: string; url: string }[] = [];
  results.push({ icon: Users, name: "Free Housing Counseling", desc: "Every Newport News resident qualifies for a free session with a certified housing counselor.", url: "https://www.hud.gov/counseling" });
  if (answers[0]?.includes('renting') || answers[0]?.includes('unhoused')) {
    results.push({ icon: Home, name: "Section 8 Voucher Program", desc: "Housing Choice Vouchers help low-income families afford private market rentals.", url: "https://nnrha.net/" });
    results.push({ icon: Shield, name: "Emergency Rental Assistance", desc: "Immediate help for residents facing eviction or inability to pay rent due to hardship.", url: "https://www.dhcd.virginia.gov/homelessnesshousing-crisis-resources" });
  }
  if (answers[1] === "Yes, I've never owned a home") {
    results.push({ icon: Home, name: "First-Time Homebuyer Program", desc: "Special loan products and grants designed specifically for first-time buyers in Virginia.", url: "https://www.virginiahousing.com/homebuyers" });
    results.push({ icon: DollarSign, name: "Down Payment Assistance", desc: "Get help covering your down payment and closing costs through city and state programs.", url: "https://www.virginiahousing.com/homebuyers/down-payment-assistance-grant" });
  }
  if (answers[2] === "Under $30,000" || answers[2] === "$30,000 – $50,000") {
    results.push({ icon: DollarSign, name: "Virginia Housing Grants", desc: "State-funded grants for low-to-moderate income residents pursuing homeownership.", url: "https://www.virginiahousing.com/" });
    results.push({ icon: Users, name: "Community Action Programs", desc: "Local agencies providing wrap-around support including housing, utilities, and food assistance.", url: "https://www.hrcapinc.org/" });
  }
  if (answers[4]?.includes('veteran') || answers[4]?.includes('active')) {
    results.push({ icon: Shield, name: "VA Home Loan Program", desc: "Zero down payment loans for eligible veterans and active duty service members.", url: "https://www.va.gov/housing-assistance/home-loans/" });
    results.push({ icon: Shield, name: "Veteran Housing Assistance", desc: "Specialized programs for veterans including transitional housing and VA-backed counseling.", url: "https://www.va.gov/homeless/nationalcallcenter.asp" });
  }
  if (answers[6] === "Repair my home") {
    results.push({ icon: Hammer, name: "Home Repair Assistance", desc: "City programs to help low-income homeowners make critical home repairs.", url: "https://nnrha.net/" });
    results.push({ icon: Hammer, name: "Weatherization Program", desc: "Free energy efficiency improvements for income-qualifying homeowners via Hampton Roads Community Action.", url: "https://www.hrcapinc.org/" });
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  const progress = step >= 7 ? 100 : ((step) / 7) * 100;

  return (
    <div className="min-h-screen bg-muted pt-32 pb-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Program Eligibility Quiz</h1>
          <p className="text-muted-foreground">Answer 7 quick questions to find programs that match your situation.</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden">
          <div className="h-2 bg-muted">
            <motion.div className="h-full bg-accent" animate={{width: `${progress}%`}} transition={{duration:0.4}} />
          </div>
          {step < 7 && <div className="px-6 pt-4 text-sm text-muted-foreground font-medium">Step {step + 1} of 7</div>}

          <AnimatePresence mode="wait" custom={direction}>
            {step < 7 ? (
              <motion.div key={step} custom={direction} variants={variants}
                initial="enter" animate="center" exit="exit"
                transition={{duration:0.3}} className="p-6 md:p-10">
                <h2 className="text-xl md:text-2xl font-bold text-primary mb-8">{steps[step].q}</h2>
                <div className="space-y-3">
                  {steps[step].opts.map(opt => (
                    <button key={opt} onClick={() => select(opt)}
                      className={`w-full text-left p-4 min-h-[56px] rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${answers[step] === opt ? 'border-accent bg-accent/5 text-accent font-semibold' : 'border-border/50 bg-white hover:border-accent/40 hover:bg-muted text-foreground'}`}
                      data-testid={`quiz-option-${opt.replace(/\s+/g,'-').toLowerCase()}`}>
                      <span>{opt}</span>
                      {answers[step] === opt && <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={back} disabled={step === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/50 text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                    data-testid="button-quiz-back">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={next} disabled={!answers[step]}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-white font-semibold hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    data-testid="button-quiz-next">
                    {step === 6 ? 'See Results' : 'Next'} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
                <div className="bg-gradient-to-r from-accent to-accent/80 text-white p-6 md:p-8 flex items-center gap-4 border-b">
                  <div className="bg-white/20 p-3 rounded-full">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Great news!</h2>
                    <p className="text-white/90">Here are programs matched to your answers</p>
                  </div>
                </div>
                <div className="p-6 md:p-10">
                  <div className="space-y-4 mb-8">
                    {results.map((r, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-gradient-to-r from-accent/5 to-transparent rounded-xl border border-border/40 border-l-4 border-l-accent" data-testid={`result-card-${i}`}>
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0"><r.icon className="w-5 h-5 text-primary" /></div>
                        <div className="flex-1">
                          <div className="font-semibold text-primary mb-1">{r.name}</div>
                          <div className="text-sm text-muted-foreground">{r.desc}</div>
                        </div>
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-accent text-sm font-medium hover:underline shrink-0">Apply / Learn More</a>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/contact" className="flex-1">
                      <button className="w-full bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors" data-testid="button-talk-counselor">
                        Talk to a Counselor About These Results
                      </button>
                    </Link>
                    <button onClick={reset} className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border/50 text-muted-foreground hover:bg-muted transition-colors font-medium" data-testid="button-retake-quiz">
                      <RotateCcw className="w-4 h-4" /> Retake Quiz
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
