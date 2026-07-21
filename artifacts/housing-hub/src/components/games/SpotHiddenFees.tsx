import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlertTriangle, CheckCircle2, XCircle, BookOpen, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface LeaseItem {
  id: string;
  label: string;
  amount: number;
  period: 'mo' | 'one-time';
  isSuspicious: boolean;
  explanation: string;
}

const LEASE_ITEMS: LeaseItem[] = [
  { id: 'rent',        label: 'Monthly Rent',                         amount: 1295, period: 'mo',       isSuspicious: false, explanation: 'Standard — this is your agreed-upon monthly rent. Completely normal.' },
  { id: 'deposit',     label: 'Security Deposit',                     amount: 1295, period: 'one-time', isSuspicious: false, explanation: 'Normal — typically one month\'s rent, fully refundable when you leave in good condition.' },
  { id: 'water',       label: 'Water & Sewer',                        amount:   55, period: 'mo',       isSuspicious: false, explanation: 'Reasonable — utility pass-throughs from the landlord are common and legitimate.' },
  { id: 'pet-deposit', label: 'Pet Deposit (one-time)',                amount:  200, period: 'one-time', isSuspicious: false, explanation: 'Standard — a refundable deposit covering potential pet-related damage. Completely normal.' },
  { id: 'pet-rent',    label: 'Monthly Pet Rent',                     amount:   35, period: 'mo',       isSuspicious: false, explanation: 'Common — a small monthly pet fee in addition to the deposit is standard practice.' },
  { id: 'renters-ins', label: "Renter's Insurance (required)",         amount:   12, period: 'mo',       isSuspicious: false, explanation: 'Reasonable — many landlords require this. At $12/mo it\'s a fair rate and actually protects you too.' },
  { id: 'portal-fee',  label: 'Online Portal Convenience Fee',        amount:   25, period: 'mo',       isSuspicious: true,  explanation: '🚩 Red flag — you should never pay a fee just to pay your own rent. Ask for this to be removed or waived.' },
  { id: 'admin-fee',   label: 'Monthly Administrative Processing Fee', amount:  115, period: 'mo',       isSuspicious: true,  explanation: '🚩 Hidden charge — vague "administrative" fees with no clear service attached are a major red flag. Demand a written explanation.' },
  { id: 'pest',        label: 'Mandatory Pest Control Program',        amount:   65, period: 'mo',       isSuspicious: true,  explanation: '🚩 Inflated — landlords are generally responsible for pest control. A $65/mo mandatory program is unusually high; $10–15 is more typical.' },
  { id: 'trash',       label: 'Trash & Recycling Service',             amount:   42, period: 'mo',       isSuspicious: true,  explanation: '🚩 Possible double billing — Newport News trash collection is a city service. Confirm you\'re not already paying for this through your rent.' },
];

type Phase = 'idle' | 'playing' | 'result';

export function SpotHiddenFees() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setFlagged(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const suspicious = LEASE_ITEMS.filter(i => i.isSuspicious);
  const correctlyFlagged = suspicious.filter(i => flagged.has(i.id)).length;
  const falseFlagged     = LEASE_ITEMS.filter(i => !i.isSuspicious && flagged.has(i.id)).length;
  const score = Math.max(0, correctlyFlagged - falseFlagged);
  const perfect = correctlyFlagged === suspicious.length && falseFlagged === 0;

  const reset = () => { setPhase('idle'); setFlagged(new Set()); };

  return (
    <>
      {/* Teaser Card */}
      {phase === 'idle' && (
        <motion.div
          whileHover={{ y: -4, boxShadow: '0 20px 60px -12px rgba(10,37,64,0.18)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="rounded-2xl bg-gradient-to-br from-white to-rose-50/50 border border-rose-100 shadow-md overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-accent"
          onClick={() => setPhase('playing')}
          role="button"
          tabIndex={0}
          aria-label="Start Spot the Hidden Fees — interactive lease review challenge"
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setPhase('playing')}
        >
          <div className="h-1 bg-gradient-to-r from-rose-500 to-accent w-full" />
          <div className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6 text-rose-500" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Lease Review Challenge</span>
              <h3 className="text-lg font-bold text-primary mt-0.5 mb-1">Spot the Hidden Fees</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">A landlord just emailed you a lease. Can you find the questionable charges before you sign?</p>
              <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-accent" aria-hidden="true">
                Review the lease <ArrowRight className="w-4 h-4" />
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
            aria-labelledby="hidden-fees-title"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="bg-primary px-6 pt-5 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-white/80" aria-hidden="true" />
                  <div>
                    <h2 id="hidden-fees-title" className="text-white font-bold">Lease Agreement — 104 Riverside Dr, Unit 2B</h2>
                    <p className="text-white/60 text-xs mt-0.5">Click any charge that seems questionable or inflated</p>
                  </div>
                </div>
              </div>

              {/* ── Playing ── */}
              {phase === 'playing' && (
                <>
                  <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2" role="list">
                    {LEASE_ITEMS.map(item => {
                      const isFlagged = flagged.has(item.id);
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => toggle(item.id)}
                          whileTap={{ scale: 0.98 }}
                          aria-pressed={isFlagged}
                          aria-label={`${item.label}: $${item.amount}/${item.period}. ${isFlagged ? 'Flagged as suspicious' : 'Not flagged'}`}
                          className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-150 ${
                            isFlagged
                              ? 'border-rose-400 bg-rose-50 shadow-sm'
                              : 'border-border/60 bg-muted/20 hover:border-primary/30 hover:bg-muted/40'
                          }`}
                          role="listitem"
                        >
                          <span className={`text-sm font-medium ${isFlagged ? 'text-rose-700' : 'text-foreground'}`}>
                            {item.label}
                          </span>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-sm font-bold tabular-nums ${isFlagged ? 'text-rose-600' : 'text-primary'}`}>
                              ${item.amount.toLocaleString()}<span className="font-normal text-xs text-muted-foreground">/{item.period}</span>
                            </span>
                            {isFlagged && <AlertTriangle className="w-4 h-4 text-rose-500" aria-hidden="true" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="px-6 py-4 border-t border-border/60 shrink-0">
                    <p className="text-xs text-muted-foreground mb-3 text-center">
                      {flagged.size === 0 ? 'Tap any charge that seems questionable.' : `${flagged.size} charge${flagged.size > 1 ? 's' : ''} flagged`}
                    </p>
                    <Button
                      onClick={() => setPhase('result')}
                      className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold h-12"
                    >
                      Review My Selections
                    </Button>
                  </div>
                </>
              )}

              {/* ── Result ── */}
              {phase === 'result' && (
                <>
                  <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2" role="list">
                    {LEASE_ITEMS.map(item => {
                      const wasFlagged = flagged.has(item.id);
                      const correct    = item.isSuspicious && wasFlagged;
                      const missed     = item.isSuspicious && !wasFlagged;
                      const falseAlarm = !item.isSuspicious && wasFlagged;

                      return (
                        <div
                          key={item.id}
                          className={`px-4 py-3 rounded-xl border-2 ${
                            correct    ? 'border-emerald-400 bg-emerald-50' :
                            missed     ? 'border-rose-400 bg-rose-50' :
                            falseAlarm ? 'border-amber-400 bg-amber-50' :
                                         'border-border/40 bg-muted/10'
                          }`}
                          role="listitem"
                          aria-label={`${item.label}: ${correct ? 'Correctly flagged' : missed ? 'You missed this red flag' : falseAlarm ? 'False alarm — this is normal' : 'Normal charge'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">{item.label}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm font-bold tabular-nums text-primary">
                                ${item.amount.toLocaleString()}<span className="font-normal text-xs text-muted-foreground">/{item.period}</span>
                              </span>
                              {correct    && <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />}
                              {missed     && <XCircle className="w-4 h-4 text-rose-500" aria-hidden="true" />}
                              {falseAlarm && <AlertTriangle className="w-4 h-4 text-amber-500" aria-hidden="true" />}
                            </div>
                          </div>
                          {(correct || missed || falseAlarm) && (
                            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.explanation}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-6 py-5 border-t border-border/60 shrink-0">
                    <div className={`rounded-2xl p-4 mb-4 ${perfect ? 'bg-emerald-50 border border-emerald-100' : 'bg-blue-50 border border-blue-100'}`}>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> What You Learned
                      </p>
                      {perfect ? (
                        <p className="text-sm text-foreground leading-relaxed">
                          Perfect score! You found all {suspicious.length} hidden fees. Always read every line of a lease before signing — and never be afraid to ask a landlord to justify or remove a charge.
                        </p>
                      ) : (
                        <p className="text-sm text-foreground leading-relaxed">
                          You caught {correctlyFlagged} of {suspicious.length} hidden fees. Before signing any lease, ask for a written explanation of every charge beyond base rent. Virginia tenant rights law protects you.
                        </p>
                      )}
                      <Link href="/rent" className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-accent hover:underline">
                        Learn your renter rights <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                    <Button onClick={reset} variant="outline" className="w-full rounded-xl gap-2">
                      <RotateCcw className="w-4 h-4" aria-hidden="true" /> Try Again
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
