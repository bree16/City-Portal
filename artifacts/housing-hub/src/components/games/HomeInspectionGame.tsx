import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, BookOpen, ArrowRight, RotateCcw, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface Choice { id: string; text: string; isGood: boolean; consequence: string; }
interface Scenario { id: number; situation: string; choices: Choice[]; lesson: string; }

const ALL_SCENARIOS: Scenario[] = [
  {
    id: 1,
    situation: "The seller's agent says their preferred inspector is available tomorrow and offers you a discounted rate.",
    choices: [
      { id: 'a', text: "Accept — it's convenient and saves money.",           isGood: false, consequence: "The seller's preferred inspector may have a conflict of interest. Inspectors who work regularly with sellers can miss — or overlook — issues that would lower the sale price." },
      { id: 'b', text: 'Hire your own independent licensed inspector.',        isGood: true,  consequence: 'Smart. An independent inspector works for you, not the seller. Virginia requires inspectors to be licensed — always verify credentials at dpor.virginia.gov before hiring.' },
      { id: 'c', text: 'Skip the inspection to strengthen your offer.',        isGood: false, consequence: 'Waiving an inspection transfers all risk to you. Hidden foundation issues, roof damage, or faulty wiring can cost tens of thousands of dollars after closing.' },
    ],
    lesson: "Always hire your own licensed inspector. It's one of the best $300–$500 you'll spend in the entire homebuying process.",
  },
  {
    id: 2,
    situation: 'Your inspector points to water stains along the attic rafters and says "looks old — probably nothing to worry about."',
    choices: [
      { id: 'a', text: "Trust the inspector's judgment and move forward.",    isGood: false, consequence: '"Looks old" is not an assessment. Old water stains can mean active seasonal leaks, hidden mold, or ventilation problems — any of which can cost $5,000–$40,000 to remedy.' },
      { id: 'b', text: 'Request a specialist roofing or mold inspection.',     isGood: true,  consequence: 'Correct. A general home inspector may not specialize in roofing systems or mold. Spending $150–$300 on a specialist can protect you from serious post-closing costs.' },
      { id: 'c', text: 'Ask the seller to credit $500 for any future issues.', isGood: false, consequence: "A $500 credit doesn't cover the actual risk. If there's active moisture damage or mold, remediation alone can easily exceed $15,000." },
    ],
    lesson: 'Water staining always warrants a specialist inspection. Never guess at the cost of moisture damage.',
  },
  {
    id: 3,
    situation: 'During your walkthrough you notice a diagonal hairline crack running from the corner of a basement window.',
    choices: [
      { id: 'a', text: "Assume it's normal settling — all old houses crack.",  isGood: false, consequence: 'Some cracks are harmless, but diagonal corner cracks can signal differential foundation settlement — one of the costliest defects possible, ranging from $10,000 to over $100,000 to repair.' },
      { id: 'b', text: "Request a licensed structural engineer's evaluation.", isGood: true,  consequence: "Exactly right. A structural engineer can distinguish cosmetic settling from a serious structural issue. An engineering report ($400–$700) can prevent a financially devastating purchase." },
      { id: 'c', text: 'Make an offer contingent on the seller patching it.',  isGood: false, consequence: 'Patching a crack hides the symptom without fixing the cause. If the foundation is actively moving, a cosmetic repair is worse than useless — it can conceal future damage.' },
    ],
    lesson: 'Diagonal cracks near corners are a red flag. Always get a structural engineer\'s opinion before proceeding.',
  },
  {
    id: 4,
    situation: 'The inspector finds the electrical panel is an older Federal Pacific Stab-Lok brand — and says "these are common in homes of this age."',
    choices: [
      { id: 'a', text: "Accept it — the inspector said it's common.",          isGood: false, consequence: "Federal Pacific Stab-Lok panels have a documented history of breaker failures and fire risk. Insurance companies often refuse to cover homes with them. 'Common' doesn't mean 'safe.'" },
      { id: 'b', text: 'Ask the seller to replace the panel before closing.',  isGood: true,  consequence: 'Smart negotiation. Panel replacement runs $1,500–$4,000 but eliminates a genuine fire hazard and ensures your homeowner\'s insurance will cover the property.' },
      { id: 'c', text: "Budget $200 for an electrician's checkup later.",      isGood: false, consequence: "A simple checkup won't fix the underlying design flaw. Federal Pacific panels have known defective breakers that may not trip when they should — causing house fires." },
    ],
    lesson: 'Certain electrical panel brands (Federal Pacific, Zinsco) are known fire hazards. Always request replacement before closing, not after.',
  },
  {
    id: 5,
    situation: "The hardwood floors are beautiful, but one room feels noticeably springy and 'bouncy' underfoot when you walk across it.",
    choices: [
      { id: 'a', text: "It's just an older home — character, not a defect.",   isGood: false, consequence: 'Bouncy flooring often means damaged, rotted, or improperly spaced floor joists underneath. Depending on extent, joist repair can run $1,500–$10,000+.' },
      { id: 'b', text: 'Flag it for the inspector to evaluate the subfloor.',   isGood: true,  consequence: 'Correct call. A springy floor warrants pulling up part of the subfloor or inspecting the crawl space below. Water damage or termite activity are common causes.' },
      { id: 'c', text: "Ask the seller to replace the hardwood in that room.",  isGood: false, consequence: "New hardwood over damaged joists won't fix the structural problem — it'll just hide it until the new floor begins to sag as well." },
    ],
    lesson: 'Soft or springy floors are always worth investigating. The problem is almost never the floor itself — it\'s what\'s underneath.',
  },
  {
    id: 6,
    situation: "The inspector finds the crawl space has 'some moisture present' and says this is common in Virginia's humid climate.",
    choices: [
      { id: 'a', text: "Accept it — Virginia humidity is a fact of life.",     isGood: false, consequence: "Unchecked crawl space moisture leads to mold growth, wood rot, and pest infestations. 'Common' doesn't mean it's being managed. Left unaddressed, remediation can cost $5,000–$30,000." },
      { id: 'b', text: 'Request a crawl space specialist or encapsulation quote.', isGood: true,  consequence: 'Good instinct. A crawl space specialist can assess whether passive venting, a vapor barrier, or full encapsulation is needed. Get a written quote and negotiate repair or credit before closing.' },
      { id: 'c', text: "Add a dehumidifier later — it's an easy fix.",         isGood: false, consequence: "A dehumidifier treats the symptom, not the source. If there's active water intrusion or grading issues, a dehumidifier will run constantly and never fully control the problem." },
    ],
    lesson: "Crawl space moisture is serious in Virginia's climate. Always quantify the problem with a specialist before accepting it as 'normal.'",
  },
  {
    id: 7,
    situation: "The home has a charming detached garage apartment. The listing says it's a 'bonus room,' but it has a full kitchen and private entrance.",
    choices: [
      { id: 'a', text: "Bonus space — great for guests or extra income.",       isGood: false, consequence: "Unpermitted accessory dwelling units (ADUs) can violate zoning codes, fail to meet code, and create liability. Newport News requires ADUs to be permitted and inspected." },
      { id: 'b', text: "Research permits and zoning before making an offer.",   isGood: true,  consequence: 'Exactly right. Pull the permit history from the city. If the unit was built without permits, you may need to retrofit it to code or remove the kitchen — a costly surprise.' },
      { id: 'c', text: "Ask the seller to add the space to the square footage.", isGood: false, consequence: "Adding unpermitted space to the listing square footage doesn't legalize it. The appraisal won't include it either — and the lender may flag it." },
    ],
    lesson: 'Any addition, garage conversion, or ADU should have a permit on file with the city. Pull the permit history before you fall in love with bonus space.',
  },
  {
    id: 8,
    situation: "The seller discloses 'no known defects.' During your walkthrough, you notice the HVAC was serviced six years ago and the filters are visibly clogged.",
    choices: [
      { id: 'a', text: "Seller disclosed no defects — you're covered legally.",  isGood: false, consequence: "'No known defects' only covers what the seller is aware of. An unmaintained HVAC can fail months after closing. Replacement runs $5,000–$12,000." },
      { id: 'b', text: "Request HVAC service records and a technician inspection.", isGood: true,  consequence: "Smart. An HVAC technician inspection ($75–$150) gives you a full system health report. If the system is near end of life, negotiate a credit or replacement in your offer." },
      { id: 'c', text: "Budget $500 for a tune-up and new filters after closing.", isGood: false, consequence: "A tune-up can't fix a failing compressor or cracked heat exchanger. Without knowing the system's condition, you're guessing on a potential $10K replacement." },
    ],
    lesson: "HVAC is one of the most expensive systems to replace. Always verify age, service history, and current condition — never assume 'no known defects' means functioning well.",
  },
  {
    id: 9,
    situation: "You notice the home's gutters are overflowing with debris and several downspouts are angled toward the foundation instead of away from it.",
    choices: [
      { id: 'a', text: "Gutters are easy to fix — not worth negotiating over.",  isGood: false, consequence: "Improperly directed water is the #1 cause of basement moisture and foundation damage in Virginia. What looks like a minor maintenance issue can mask $20,000+ in hidden water damage." },
      { id: 'b', text: "Flag it and inspect the basement and crawl space for water damage.", isGood: true,  consequence: "Correct. Misdirected downspouts are often a symptom of long-term water management problems. Inspect the foundation and crawl space carefully before concluding it's minor." },
      { id: 'c', text: "Ask the seller to clean the gutters before closing.",     isGood: false, consequence: "Clean gutters don't fix downspouts pointed at the foundation. The real question is whether water has already damaged the slab, basement walls, or crawl space." },
    ],
    lesson: "Drainage and grading issues are stealth problems. Water directed toward a foundation for years causes damage that isn't visible until it's very expensive.",
  },
];

/** Shuffle and pick N unique items */
function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const SCENARIOS_PER_ROUND = 3;

type Phase = 'idle' | 'playing' | 'done';

export function HomeInspectionGame() {
  const [phase, setPhase]           = useState<Phase>('idle');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [chosen, setChosen]         = useState<Record<number, string>>({});
  const [showConsequence, setShowConsequence] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  // Pick 3 random scenarios per session
  const scenarios = useMemo(
    () => pickN(ALL_SCENARIOS, SCENARIOS_PER_ROUND),
    [sessionKey], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const scenario = scenarios[scenarioIdx];
  const selectedId = chosen[scenario?.id ?? -1];
  const selectedChoice = scenario?.choices.find(c => c.id === selectedId);
  const isLast = scenarioIdx === scenarios.length - 1;

  const handleChoice = (id: string) => {
    if (selectedId) return;
    setChosen(prev => ({ ...prev, [scenario.id]: id }));
    setShowConsequence(true);
  };

  const advance = () => {
    setShowConsequence(false);
    if (isLast) { setPhase('done'); return; }
    setScenarioIdx(i => i + 1);
  };

  const reset = () => {
    setSessionKey(k => k + 1);
    setPhase('idle');
    setScenarioIdx(0);
    setChosen({});
    setShowConsequence(false);
  };

  const goodAnswers = scenarios.filter(s => {
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
              <p className="text-sm text-muted-foreground leading-relaxed">
                {SCENARIOS_PER_ROUND} real inspection situations — different every round.{' '}
                <span className="text-accent font-medium">{ALL_SCENARIOS.length} scenarios rotate so you always learn something new.</span>
              </p>
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
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* ── Playing ── */}
              {phase === 'playing' && scenario && (
                <>
                  <div className="bg-primary px-6 pt-5 pb-4 shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Inspection Decision
                      </span>
                      <span className="text-white/60 text-sm" aria-label={`Scenario ${scenarioIdx + 1} of ${scenarios.length}`}>
                        {scenarioIdx + 1} / {scenarios.length}
                      </span>
                    </div>
                    <div className="flex gap-2" role="list" aria-label="Scenario progress">
                      {scenarios.map((s, i) => (
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

                  <div className="p-6 overflow-y-auto flex-1">
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
                              <span className="w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold border-current">
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
                <div className="p-8 overflow-y-auto">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${goodAnswers === scenarios.length ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                    <ShieldCheck className={`w-8 h-8 ${goodAnswers === scenarios.length ? 'text-emerald-600' : 'text-primary'}`} aria-hidden="true" />
                  </div>
                  <h2 id="inspection-title" className="text-xl font-bold text-primary mb-1">
                    {goodAnswers === scenarios.length ? 'Excellent judgment!' : `${goodAnswers} of ${scenarios.length} right`}
                  </h2>
                  <p className="text-muted-foreground mb-5 leading-relaxed">
                    {goodAnswers === scenarios.length
                      ? 'You made the right call every time. A thorough inspection strategy can save you tens of thousands of dollars and months of stress.'
                      : 'Home inspections are one of the most important steps in the homebuying process. The right decisions here protect your investment for years.'}
                  </p>

                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-5 space-y-2">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> What You Learned
                    </p>
                    <ul className="text-sm text-foreground space-y-1.5">
                      {scenarios.map(s => (
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
                    <RotateCcw className="w-4 h-4" aria-hidden="true" /> Play Again — New Scenarios
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
