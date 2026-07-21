import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, BookOpen, ArrowRight, RotateCcw, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface Choice { id: string; text: string; isGood: boolean; consequence: string; }
interface Scenario { id: number; situation: string; choices: Choice[]; lesson: string; }

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    situation: "The seller's agent says their preferred inspector is available tomorrow and offers you a discounted rate.",
    choices: [
      { id: 'a', text: 'Accept — it\'s convenient and saves money.',           isGood: false, consequence: 'The seller\'s preferred inspector may have a conflict of interest. Inspectors who work regularly with sellers can miss — or overlook — issues that would lower the sale price.' },
      { id: 'b', text: 'Hire your own independent licensed inspector.',         isGood: true,  consequence: 'Smart. An independent inspector works for you, not the seller. Virginia requires inspectors to be licensed — always verify credentials at dpor.virginia.gov before hiring.' },
      { id: 'c', text: 'Skip the inspection to strengthen your offer.',         isGood: false, consequence: 'Waiving an inspection transfers all risk to you. Hidden foundation issues, roof damage, or faulty wiring can cost tens of thousands of dollars after closing.' },
    ],
    lesson: 'Always hire your own licensed inspector. It\'s one of the best $300–$500 you\'ll spend in the entire homebuying process.',
  },
  {
    id: 2,
    situation: 'Your inspector points to water stains along the attic rafters and says "looks old — probably nothing to worry about."',
    choices: [
      { id: 'a', text: 'Trust the inspector\'s judgment and move forward.',     isGood: false, consequence: '"Looks old" is not an assessment. Old water stains can mean active seasonal leaks, hidden mold, or ventilation problems — any of which can cost $5,000–$40,000 to remedy.' },
      { id: 'b', text: 'Request a specialist roofing or mold inspection.',      isGood: true,  consequence: 'Correct. A general home inspector may not specialize in roofing systems or mold. Spending $150–$300 on a specialist can protect you from serious post-closing costs.' },
      { id: 'c', text: 'Ask the seller to credit $500 for any future issues.',  isGood: false, consequence: 'A $500 credit doesn\'t cover the actual risk. If there\'s active moisture damage or mold, remediation alone can easily exceed $15,000.' },
    ],
    lesson: 'Water staining always warrants a specialist inspection. Never guess at the cost of moisture damage.',
  },
  {
    id: 3,
    situation: 'During your walkthrough you notice a diagonal hairline crack running from the corner of a basement window.',
    choices: [
      { id: 'a', text: 'Assume it\'s normal settling — all old houses crack.',  isGood: false, consequence: 'Some cracks are harmless, but diagonal corner cracks can signal differential foundation settlement — one of the costliest defects possible, ranging from $10,000 to over $100,000 to repair.' },
      { id: 'b', text: 'Request a licensed structural engineer\'s evaluation.',  isGood: true,  consequence: 'Exactly right. A structural engineer can distinguish cosmetic settling from a serious structural issue. An engineering report ($400–$700) can prevent a financially devastating purchase.' },
      { id: 'c', text: 'Make an offer contingent on the seller patching it.',   isGood: false, consequence: 'Patching a crack hides the symptom without fixing the cause. If the foundation is actively moving, a cosmetic repair is worse than useless — it can conceal future damage.' },
    ],
    lesson: 'Diagonal cracks near corners are a red flag. Always get a structural engineer\'s opinion before proceeding.',
  },
];

type Phase = 'idle' | 'playing' | 'done';

export function HomeInspectionGame() {
  const [phase, setPhase]           = useState<Phase>('idle');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [chosen, setChosen]         = useState<Record<number, string>>({});
  const [showConsequence, setShowConsequence] = useState(false);

  const scenario = SCENARIOS[scenarioIdx];
  const selectedId = chosen[scenario.id];
  const selectedChoice = scenario.choices.find(c => c.id === selectedId);
  const isLast = scenarioIdx === SCENARIOS.length - 1;

  const handleChoice = (id: string) => {
    if (selectedId) return; // locked
    setChosen(prev => ({ ...prev, [scenario.id]: id }));
    setShowConsequence(true);
  };

  const advance = () => {
    setShowConsequence(false);
    if (isLast) { setPhase('done'); return; }
    setScenarioIdx(i => i + 1);
  };

  const reset = () => {
    setPhase('idle');
    setScenarioIdx(0);
    setChosen({});
    setShowConsequence(false);
  };

  const goodAnswers = SCENARIOS.filter(s => {
    const pick = chosen[s.id];
    return s.choices.find(c => c.id === pick)?.isGood;
  }).length;

  return (
    <>
      {/* Teaser Card */}
      {phase === 'idle' && (
        <motion.div
          whileHover={{ y: -4, boxShadow: '0 20px 60px -12px rgba(10,37,64,0.18)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="rounded-2xl bg-gradient-to-br from-white to-teal-50/50 border border-teal-100 shadow-md overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-accent"
          onClick={() => setPhase('playing')}
          role="button"
          tabIndex={0}
          aria-label="Start Home Inspection Decisions — interactive scenario challenge"
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setPhase('playing')}
        >
          <div className="h-1 bg-gradient-to-r from-teal-500 to-secondary w-full" />
          <div className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6 text-teal-600" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Interactive Scenario</span>
              <h3 className="text-lg font-bold text-primary mt-0.5 mb-1">Home Inspection Decisions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Three real inspection situations. What would you do? Learn how each choice affects your investment.</p>
              <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-accent" aria-hidden="true">
                Start scenarios <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {(phase === 'playing' || phase === 'done') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inspection-title"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* ── Playing ── */}
              {phase === 'playing' && (
                <>
                  <div className="bg-primary px-6 pt-5 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Inspection Decision
                      </span>
                      <span className="text-white/60 text-sm" aria-label={`Scenario ${scenarioIdx + 1} of ${SCENARIOS.length}`}>
                        {scenarioIdx + 1} / {SCENARIOS.length}
                      </span>
                    </div>
                    {/* Progress dots */}
                    <div className="flex gap-2" role="list" aria-label="Scenario progress">
                      {SCENARIOS.map((s, i) => (
                        <div
                          key={s.id}
                          role="listitem"
                          aria-current={i === scenarioIdx ? 'step' : undefined}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i < scenarioIdx ? 'bg-secondary' : i === scenarioIdx ? 'bg-white' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5">
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Situation</p>
                      <h2 id="inspection-title" className="text-base font-semibold text-foreground leading-relaxed">{scenario.situation}</h2>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-widest">What do you do?</p>
                    <div className="space-y-2.5" role="group" aria-label="Choose your response">
                      {scenario.choices.map(choice => {
                        const picked = selectedId === choice.id;
                        const locked = !!selectedId;
                        return (
                          <motion.button
                            key={choice.id}
                            onClick={() => handleChoice(choice.id)}
                            disabled={locked}
                            whileTap={locked ? undefined : { scale: 0.98 }}
                            aria-pressed={picked}
                            aria-label={choice.text + (picked ? (choice.isGood ? ' — correct' : ' — not the best choice') : '')}
                            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                              !locked
                                ? 'border-border/60 hover:border-primary/40 hover:bg-muted/30 cursor-pointer'
                                : picked && choice.isGood
                                ? 'border-emerald-400 bg-emerald-50 text-emerald-800 cursor-default'
                                : picked && !choice.isGood
                                ? 'border-rose-400 bg-rose-50 text-rose-800 cursor-default'
                                : 'border-border/30 bg-muted/10 text-muted-foreground cursor-default opacity-60'
                            }`}
                          >
                            <span className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold
                                border-current">
                                {choice.id.toUpperCase()}
                              </span>
                              <span>{choice.text}</span>
                              {picked && (
                                choice.isGood
                                  ? <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto shrink-0 mt-0.5" aria-hidden="true" />
                                  : <XCircle     className="w-4 h-4 text-rose-500 ml-auto shrink-0 mt-0.5" aria-hidden="true" />
                              )}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Consequence */}
                    <AnimatePresence>
                      {showConsequence && selectedChoice && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-4 p-4 rounded-xl text-sm leading-relaxed ${selectedChoice.isGood ? 'bg-emerald-50 border border-emerald-100 text-emerald-900' : 'bg-rose-50 border border-rose-100 text-rose-900'}`}
                          role="alert"
                        >
                          {selectedChoice.consequence}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {showConsequence && (
                      <Button
                        onClick={advance}
                        className="w-full mt-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold h-11 gap-2"
                      >
                        {isLast ? 'See Results' : 'Next Scenario'} <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </>
              )}

              {/* ── Done ── */}
              {phase === 'done' && (
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${goodAnswers === SCENARIOS.length ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                    <ShieldCheck className={`w-8 h-8 ${goodAnswers === SCENARIOS.length ? 'text-emerald-600' : 'text-primary'}`} aria-hidden="true" />
                  </div>
                  <h2 id="inspection-title" className="text-xl font-bold text-primary mb-1">
                    {goodAnswers === SCENARIOS.length ? 'Excellent judgment!' : `${goodAnswers} of ${SCENARIOS.length} right`}
                  </h2>
                  <p className="text-muted-foreground mb-5 leading-relaxed">
                    {goodAnswers === SCENARIOS.length
                      ? 'You made the right call every time. A thorough inspection strategy can save you tens of thousands of dollars and months of stress.'
                      : 'Home inspections are one of the most important steps in the homebuying process. The right decisions here protect your investment for years.'}
                  </p>

                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-5 space-y-2">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> What You Learned
                    </p>
                    <ul className="text-sm text-foreground space-y-1.5">
                      {SCENARIOS.map(s => (
                        <li key={s.id} className="flex items-start gap-2">
                          <span className="text-accent mt-0.5 shrink-0" aria-hidden="true">→</span>
                          {s.lesson}
                        </li>
                      ))}
                    </ul>
                    <Link href="/journey" className="inline-flex items-center gap-1 mt-1 text-sm font-semibold text-accent hover:underline">
                      Explore the full homebuying journey <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>

                  <Button onClick={reset} variant="outline" className="w-full rounded-xl gap-2">
                    <RotateCcw className="w-4 h-4" aria-hidden="true" /> Play Again
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
