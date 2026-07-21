import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Home, MapPin, BedDouble, Bath, Zap, BookOpen, ArrowRight, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const ALL_LISTINGS = [
  {
    address: '412 Oyster Point Rd',
    neighborhood: 'Oyster Point',
    price: 219000,
    beds: 3,
    baths: 2,
    dom: 1,
    monthly: 1340,
    pros: ['Updated kitchen', 'Corner lot', 'Top-rated school district'],
    cons: ['Busy street', 'Small backyard'],
    offerOutcome: 'Sharp instinct! This home received 6 offers and sold $12,000 over asking. Your quick offer secured the deal.',
    passOutcome: 'This home sold before end of day — 6 competing offers, $12,000 over asking. In hot markets, hesitation costs.',
    lesson: 'In competitive markets, pre-approval isn\'t optional — it\'s your entry ticket. Know your budget before you fall in love with a listing.',
  },
  {
    address: '208 Denbigh Blvd',
    neighborhood: 'Denbigh',
    price: 187500,
    beds: 3,
    baths: 1.5,
    dom: 2,
    monthly: 1148,
    pros: ['New roof (2023)', 'Near transit', 'Quiet cul-de-sac'],
    cons: ['Original HVAC', 'Dated bathrooms'],
    offerOutcome: 'Great move! The seller accepted your offer and the home appraised cleanly. Affordable, move-in-ready homes don\'t wait.',
    passOutcome: 'The home was under contract by 5 PM. Affordable, move-in-ready homes in Denbigh rarely sit more than 48 hours.',
    lesson: 'Days on market is your signal. Under 3 days usually means high demand. Have your pre-approval letter ready so you can move without delay.',
  },
  {
    address: '819 Warwick Blvd',
    neighborhood: 'Hilton Village',
    price: 245000,
    beds: 4,
    baths: 2,
    dom: 0,
    monthly: 1501,
    pros: ['Historic designation', 'Large yard', 'Walkable neighborhood'],
    cons: ['Needs cosmetic updates', 'Main road traffic'],
    offerOutcome: 'Well played! Hilton Village homes are rare. Your offer was accepted — history, character, and a great neighborhood.',
    passOutcome: 'A backup offer arrived within 2 hours. Historic Hilton Village homes are some of the most sought-after in the city.',
    lesson: 'Some neighborhoods have very limited inventory. Research your target areas deeply so you\'re ready the moment something lists.',
  },
  {
    address: '543 W Mercury Blvd',
    neighborhood: 'Hampton Roads Corridor',
    price: 179000,
    beds: 2,
    baths: 1,
    dom: 1,
    monthly: 1097,
    pros: ['Walking distance to shops', 'Newly remodeled kitchen', 'Low HOA'],
    cons: ['Busy corridor road', 'No garage'],
    offerOutcome: 'Smart move! At $179K on Mercury, you locked in exceptional value. The seller had three more inquiries waiting by morning.',
    passOutcome: 'The listing was pulled from the market by 9 AM — the seller had a full-price cash offer waiting. Entry-level homes move fastest of all.',
    lesson: 'Entry-priced homes attract the most competition. If a home is priced $10–20K below neighborhood comps, assume multiple offers are coming.',
  },
  {
    address: '2201 Chesapeake Ave',
    neighborhood: 'Riverside',
    price: 289000,
    beds: 4,
    baths: 2.5,
    dom: 3,
    monthly: 1769,
    pros: ['Water views', 'Updated primary bath', 'Large rear deck'],
    cons: ['Flood zone — insurance required', 'Agent says roof is "near end of life"'],
    offerOutcome: 'Bold choice. The water views are stunning, but flood zone insurance can add $2,000–$5,000/year. Make sure that\'s in your budget.',
    passOutcome: 'The home went under contract the next afternoon — but the buyers discovered flood insurance costs after. A lesson in reading the fine print first.',
    lesson: 'Waterfront or flood-zone properties carry hidden annual costs. Always factor flood insurance into your monthly payment estimate before falling in love.',
  },
  {
    address: '114 Brandon Ave',
    neighborhood: 'Beechwood',
    price: 213000,
    beds: 3,
    baths: 2,
    dom: 0,
    monthly: 1304,
    pros: ['Corner lot', 'Finished basement', 'New HVAC (2024)'],
    cons: ['Listed just hours ago', 'No open house scheduled'],
    offerOutcome: 'Excellent instincts. A new HVAC and finished basement at $213K in Beechwood is solid value. The listing got 8 inquiries in the first 4 hours.',
    passOutcome: 'By the time you rescheduled a showing, the sellers had accepted an offer. "Listed today" homes require same-day action in Newport News.',
    lesson: 'Set up instant listing alerts for your target neighborhoods. The first 24 hours of a new listing are the highest-competition window.',
  },
  {
    address: '708 Main St',
    neighborhood: 'Downtown Newport News',
    price: 159500,
    beds: 2,
    baths: 1,
    dom: 4,
    monthly: 977,
    pros: ['Near waterfront park', 'Recently painted throughout', 'Priced below recent comps'],
    cons: ['Small lot', 'No off-street parking'],
    offerOutcome: 'Nice find. This one sat 4 days because of the parking situation — but you saw the value. The seller was eager and accepted quickly.',
    passOutcome: 'A first-time buyer scooped it up the next day. At $159K, it was priced to move. The 4 days on market was a parking concern — not a quality concern.',
    lesson: 'Slightly longer DOM can mean a motivated seller, not a problem home. Investigate why a home has sat before dismissing it.',
  },
  {
    address: '3300 Deep Creek Rd',
    neighborhood: 'Deep Creek',
    price: 234000,
    beds: 4,
    baths: 2,
    dom: 2,
    monthly: 1432,
    pros: ['Quiet street', 'Two-car garage', 'Recently updated flooring'],
    cons: ['School ratings average', 'No transit access'],
    offerOutcome: 'Solid decision. A 4-bed with a two-car garage for $234K is strong value. The sellers accepted within 24 hours — they wanted a quick, clean close.',
    passOutcome: 'The home sold over the weekend to a family relocating from out of state. They put in an offer sight-unseen after viewing the virtual tour.',
    lesson: 'Buyers increasingly offer sight-unseen on well-photographed listings. A strong listing with a virtual tour raises the urgency to decide.',
  },
];

/** Fisher-Yates shuffle — returns a new shuffled array */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = 'idle' | 'playing' | 'result';
type Decision = 'offer' | 'pass' | 'timeout';

export function HotMarketChallenge() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = useState(10);
  const [decision, setDecision] = useState<Decision | null>(null);

  // Shuffle once per mount; re-shuffle on reset via key
  const [sessionKey, setSessionKey] = useState(0);
  const [roundIdx, setRoundIdx] = useState(0);

  const shuffled = useMemo(() => shuffle(ALL_LISTINGS), [sessionKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const listing = shuffled[roundIdx % shuffled.length];

  const handleDecision = useCallback((choice: Decision) => {
    setDecision(choice);
    setPhase('result');
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) { handleDecision('timeout'); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, handleDecision]);

  const reset = () => {
    const nextRound = roundIdx + 1;
    // Re-shuffle after a full cycle through the deck
    if (nextRound % shuffled.length === 0) setSessionKey(k => k + 1);
    setRoundIdx(nextRound);
    setPhase('idle');
    setTimeLeft(10);
    setDecision(null);
  };

  const outcome =
    decision === 'offer' ? listing.offerOutcome :
    decision === 'pass'  ? listing.passOutcome  :
    listing.passOutcome;

  const won = decision === 'offer';

  return (
    <>
      {/* Teaser Card */}
      {phase === 'idle' && (
        <motion.div
          whileHover={{ y: -4, boxShadow: '0 20px 60px -12px rgba(10,37,64,0.18)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="rounded-2xl bg-gradient-to-br from-white to-amber-50/60 border border-amber-100 shadow-md overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-accent"
          onClick={() => setPhase('playing')}
          role="button"
          tabIndex={0}
          aria-label="Start Hot Market Challenge — 30-second interactive exercise"
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setPhase('playing')}
        >
          <div className="h-1 bg-gradient-to-r from-accent to-amber-400 w-full" />
          <div className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">30-Second Challenge</span>
              <h3 className="text-lg font-bold text-primary mt-0.5 mb-1">Hot Market Challenge</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A home just listed. You have 10 seconds to decide — make an offer or keep looking?{' '}
                <span className="text-accent font-medium">{ALL_LISTINGS.length} unique listings rotate each round.</span>
              </p>
              <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-accent" aria-hidden="true">
                Start challenge <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {(phase === 'playing' || phase === 'result') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hot-market-title"
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
                        <Clock className="w-4 h-4" aria-hidden="true" /> Decide now
                      </span>
                      <span
                        className={`text-2xl font-extrabold tabular-nums ${timeLeft <= 3 ? 'text-rose-400 animate-pulse' : 'text-white'}`}
                        aria-live="polite"
                        aria-label={`${timeLeft} seconds remaining`}
                      >
                        {timeLeft}s
                      </span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden" role="progressbar" aria-valuenow={timeLeft} aria-valuemin={0} aria-valuemax={10}>
                      <motion.div
                        className="h-full bg-secondary rounded-full"
                        animate={{ scaleX: timeLeft / 10 }}
                        transition={{ duration: 0.9, ease: 'linear' }}
                        style={{ transformOrigin: 'left' }}
                      />
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Home className="w-5 h-5 text-primary" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h2 id="hot-market-title" className="font-bold text-primary text-lg leading-tight">{listing.address}</h2>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" aria-hidden="true" />{listing.neighborhood}, Newport News
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xl font-extrabold text-primary">${listing.price.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">~${listing.monthly.toLocaleString()}/mo</div>
                      </div>
                    </div>

                    <div className="flex gap-4 py-3 border-y border-border/60 text-sm font-medium">
                      <span className="flex items-center gap-1.5 text-foreground"><BedDouble className="w-4 h-4 text-primary" aria-hidden="true" />{listing.beds} bd</span>
                      <span className="flex items-center gap-1.5 text-foreground"><Bath className="w-4 h-4 text-primary" aria-hidden="true" />{listing.baths} ba</span>
                      <span className="ml-auto text-muted-foreground">Listed {listing.dom === 0 ? 'today' : `${listing.dom}d ago`}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="font-semibold text-emerald-700 mb-1.5">Pros</p>
                        <ul className="space-y-1 text-muted-foreground">
                          {listing.pros.map(p => (
                            <li key={p} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 mt-0.5 shrink-0" aria-hidden="true">✓</span>{p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-rose-600 mb-1.5">Cons</p>
                        <ul className="space-y-1 text-muted-foreground">
                          {listing.cons.map(c => (
                            <li key={c} className="flex items-start gap-1.5">
                              <span className="text-rose-400 mt-0.5 shrink-0" aria-hidden="true">✗</span>{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <Button
                        onClick={() => handleDecision('offer')}
                        className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 font-bold"
                      >
                        Make an Offer
                      </Button>
                      <Button
                        onClick={() => handleDecision('pass')}
                        variant="outline"
                        className="rounded-xl h-12 font-semibold border-2"
                      >
                        Keep Looking
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* ── Result ── */}
              {phase === 'result' && (
                <div className="p-8">
                  {won
                    ? <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" aria-hidden="true" />
                    : <XCircle className="w-12 h-12 text-rose-500 mb-4" aria-hidden="true" />
                  }
                  <h2 id="hot-market-title" className="text-xl font-bold text-primary mb-3">
                    {decision === 'timeout' ? "Time's up!" : won ? 'You moved fast!' : 'The market moved faster.'}
                  </h2>
                  <p className="text-foreground mb-5 leading-relaxed">{outcome}</p>

                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-6">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> What You Learned
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">{listing.lesson}</p>
                    <Link href="/buy" className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-accent hover:underline">
                      Learn about mortgage pre-approval <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>

                  <Button onClick={reset} variant="outline" className="w-full rounded-xl gap-2">
                    <RotateCcw className="w-4 h-4" aria-hidden="true" /> Try the Next Listing
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
