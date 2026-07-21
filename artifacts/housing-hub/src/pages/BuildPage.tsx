import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hammer, TreePine, Zap, Droplet, Wind, ShieldCheck, BookOpen,
  ArrowRight, CheckCircle2, XCircle, RotateCcw, ChevronRight,
  Landmark, FileCheck, Car, Wrench, Home, DollarSign, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedSection, StaggerSection, StaggerItem } from '@/components/ui/AnimatedSection';
import { Link } from 'wouter';

// ─── Builder Challenge ──────────────────────────────────────────────────────

interface BuildItem {
  id: string;
  label: string;
  cost: number;
  required: boolean;
  icon: React.ElementType;
  desc: string;
  missedNote: string;
}

const BUDGET = 400_000;

const BUILD_ITEMS: BuildItem[] = [
  { id: 'land',     label: 'Land Purchase',          cost: 72000, required: true,  icon: TreePine,   desc: 'The lot you will build on.',                        missedNote: 'You can\'t build without land. This is always the first purchase.' },
  { id: 'permits',  label: 'Permits & Inspections',  cost:  8500, required: true,  icon: FileCheck,  desc: 'City approvals and required inspections.',          missedNote: 'Building without permits is illegal and can void your insurance.' },
  { id: 'site',     label: 'Site Prep & Grading',    cost: 14500, required: true,  icon: Hammer,     desc: 'Clearing, grading, and drainage.',                  missedNote: 'Without proper grading, water pools around the foundation causing major damage.' },
  { id: 'found',    label: 'Foundation',             cost: 22000, required: true,  icon: Home,       desc: 'Slab, crawlspace, or basement foundation.',         missedNote: 'No foundation, no structure. Every home starts here.' },
  { id: 'framing',  label: 'Framing & Structure',   cost: 47000, required: true,  icon: Hammer,     desc: 'Walls, floors, and roof structure.',                missedNote: 'Framing is the skeleton of your home — nothing else can happen without it.' },
  { id: 'roof',     label: 'Roof System',            cost: 16000, required: true,  icon: Home,       desc: 'Roofing materials, underlayment, and flashing.',    missedNote: 'An exposed structure deteriorates within weeks of rain.' },
  { id: 'windows',  label: 'Windows & Doors',        cost: 13500, required: true,  icon: Home,       desc: 'Exterior windows, entry doors, and sealing.',       missedNote: 'Without weatherproofing, your interior work will be exposed to the elements.' },
  { id: 'plumbing', label: 'Plumbing',               cost: 12000, required: true,  icon: Droplet,    desc: 'Water lines, drains, and fixtures.',                missedNote: 'Plumbing must be roughed-in before walls are closed. Retrofitting costs 3x more.' },
  { id: 'electric', label: 'Electrical',             cost: 11000, required: true,  icon: Zap,        desc: 'Service panel, wiring, and outlets.',               missedNote: 'Electrical is required by code. A home without power cannot be occupied.' },
  { id: 'hvac',     label: 'HVAC System',            cost: 13500, required: true,  icon: Wind,       desc: 'Heating, ventilation, and air conditioning.',       missedNote: 'In Virginia\'s climate, HVAC is not optional. It also protects the structure from moisture.' },
  { id: 'water',    label: 'Water Connection / Well', cost:  8000, required: true,  icon: Droplet,    desc: 'City water hookup or well installation.',           missedNote: 'Without water service, a home cannot receive an occupancy certificate.' },
  { id: 'insul',    label: 'Insulation & Drywall',  cost: 10000, required: false, icon: Home,       desc: 'Interior walls, insulation, and finishing.',        missedNote: 'Without insulation, energy costs skyrocket and comfort suffers year-round.' },
  { id: 'floor',    label: 'Flooring',               cost:  9500, required: false, icon: Home,       desc: 'Subfloor, hardwood, tile, or carpet.',              missedNote: 'Bare concrete or plywood subfloor is uncomfortable and damages easily.' },
  { id: 'kitchen',  label: 'Kitchen & Bathrooms',   cost: 22000, required: false, icon: Wrench,     desc: 'Cabinets, fixtures, countertops, and tile.',        missedNote: 'A home without a functional kitchen or bathrooms cannot receive an occupancy permit.' },
  { id: 'driveway', label: 'Driveway',               cost:  6500, required: false, icon: Car,        desc: 'Paved or gravel driveway and walkway.',             missedNote: 'Without a driveway, vehicle access and mud management become a daily problem.' },
  { id: 'landscape',label: 'Landscaping',            cost:  5500, required: false, icon: TreePine,   desc: 'Sod, plants, and basic yard grading.',              missedNote: 'Bare soil erodes rapidly. Basic landscaping protects your grading work.' },
];

function BuilderChallenge() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<'building' | 'result'>('building');

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const spent     = BUILD_ITEMS.filter(i => selected.has(i.id)).reduce((s, i) => s + i.cost, 0);
  const remaining = BUDGET - spent;
  const over      = remaining < 0;

  const missingRequired = BUILD_ITEMS.filter(i => i.required && !selected.has(i.id));
  const missingOptional = BUILD_ITEMS.filter(i => !i.required && !selected.has(i.id));

  const reset = () => { setSelected(new Set()); setPhase('building'); };

  return (
    <div className="rounded-3xl border border-border/60 overflow-hidden shadow-lg bg-white">
      <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5" aria-hidden="true" /> Interactive Builder Challenge
            </h3>
            <p className="text-white/70 text-sm mt-0.5">Select what you need to build. Watch your budget.</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-extrabold tabular-nums ${over ? 'text-rose-400' : remaining < 30000 ? 'text-amber-300' : 'text-secondary'}`}
              aria-live="polite" aria-label={`Budget remaining: $${remaining.toLocaleString()}`}>
              ${Math.abs(remaining).toLocaleString()}
            </div>
            <div className="text-white/60 text-xs">{over ? 'OVER BUDGET' : 'remaining'}</div>
          </div>
        </div>
        {/* Budget bar */}
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden" role="progressbar"
          aria-valuenow={Math.min(spent, BUDGET)} aria-valuemin={0} aria-valuemax={BUDGET}>
          <motion.div
            className={`h-full rounded-full ${over ? 'bg-rose-400' : 'bg-secondary'}`}
            animate={{ width: `${Math.min((spent / BUDGET) * 100, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/50 mt-1">
          <span>${spent.toLocaleString()} spent</span>
          <span>Budget: ${BUDGET.toLocaleString()}</span>
        </div>
      </div>

      {phase === 'building' && (
        <>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="Select building components">
            {BUILD_ITEMS.map(item => {
              const isSelected = selected.has(item.id);
              return (
                <motion.button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  whileTap={{ scale: 0.97 }}
                  aria-pressed={isSelected}
                  aria-label={`${item.label}: $${item.cost.toLocaleString()}${item.required ? ' (essential)' : ''}`}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-start gap-3 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border/50 hover:border-primary/30 hover:bg-muted/20'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                    <item.icon className="w-4.5 h-4.5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{item.label}</span>
                      {item.required && <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">Essential</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.desc}</p>
                  </div>
                  <span className={`text-sm font-bold shrink-0 tabular-nums ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                    ${item.cost.toLocaleString()}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <div className="px-6 pb-6">
            <Button
              onClick={() => setPhase('result')}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold h-12"
            >
              Build My Home →
            </Button>
          </div>
        </>
      )}

      {phase === 'result' && (
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Cost',     value: `$${spent.toLocaleString()}`,             color: 'text-primary' },
              { label: 'Budget Left',    value: over ? 'Over budget' : `$${remaining.toLocaleString()}`, color: over ? 'text-rose-500' : 'text-emerald-600' },
              { label: 'Items Missed',   value: `${missingRequired.length + missingOptional.length}`,    color: missingRequired.length ? 'text-rose-500' : 'text-amber-500' },
            ].map(s => (
              <div key={s.label} className="bg-muted/30 rounded-2xl p-4 text-center">
                <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {missingRequired.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-bold text-rose-600 flex items-center gap-1.5 mb-2">
                <XCircle className="w-4 h-4" aria-hidden="true" /> Essential items you skipped:
              </p>
              <div className="space-y-2">
                {missingRequired.map(item => (
                  <div key={item.id} className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm">
                    <span className="font-semibold text-rose-700">{item.label}</span>
                    <p className="text-rose-600 text-xs mt-0.5">{item.missedNote}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {missingOptional.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-bold text-amber-600 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Items you may want to reconsider:
              </p>
              <div className="space-y-1.5">
                {missingOptional.map(item => (
                  <div key={item.id} className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-sm">
                    <span className="font-semibold text-amber-700">{item.label}</span>
                    <p className="text-amber-600 text-xs mt-0.5">{item.missedNote}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {missingRequired.length === 0 && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-5 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-emerald-800 text-sm">Solid build plan!</p>
                <p className="text-emerald-700 text-xs mt-0.5">You included all essential items. A real construction budget would also include contingency (10–15%) for unexpected costs.</p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> What You Learned
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              Building a home requires careful budgeting across dozens of cost categories. Always include a 10–15% contingency fund for unexpected costs, and never skip permits — they protect both your investment and your safety.
            </p>
          </div>

          <Button onClick={reset} variant="outline" className="w-full rounded-xl gap-2">
            <RotateCcw className="w-4 h-4" aria-hidden="true" /> Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Warranty Challenge ──────────────────────────────────────────────────────

interface WarrantyChoice { id: string; text: string; rating: 'best' | 'ok' | 'bad'; explanation: string; }
interface WarrantyScenario { id: number; situation: string; detail: string; choices: WarrantyChoice[]; lesson: string; }

const WARRANTY_SCENARIOS: WarrantyScenario[] = [
  {
    id: 1,
    situation: 'Three months after moving in, you discover a significant crack in the foundation.',
    detail: 'The crack was not visible during your final walkthrough.',
    choices: [
      { id: 'a', text: 'Contact the builder immediately in writing.',   rating: 'best', explanation: 'Correct first step. Document everything in writing — email or certified letter. Most new construction warranties cover structural defects for 10 years.' },
      { id: 'b', text: 'File a formal warranty claim with supporting photos.', rating: 'best', explanation: 'Also correct. A written warranty claim creates a paper trail. Take dated photographs, document when you first noticed it, and keep copies of all correspondence.' },
      { id: 'c', text: 'Hire a structural engineer to assess the damage first.', rating: 'ok',   explanation: 'Smart but do this in addition to notifying the builder — not instead of it. The engineer\'s report strengthens your warranty claim with independent documentation.' },
      { id: 'd', text: 'Ignore it and monitor it over a few months.',   rating: 'bad',  explanation: 'Never ignore foundation issues. Cracks grow. Delaying also risks voiding your warranty by failing to report in a timely manner.' },
    ],
    lesson: 'Structural defects are typically covered under a 10-year new construction warranty in Virginia. Always report in writing within a reasonable time after discovery.',
  },
  {
    id: 2,
    situation: 'Eight months in, you notice the roof is leaking around the chimney flashing.',
    detail: 'Your builder\'s warranty mentions a 2-year workmanship warranty.',
    choices: [
      { id: 'a', text: 'Call the builder, then follow up in writing.',   rating: 'best', explanation: 'Right approach. Roof workmanship is typically covered 1–2 years. The phone call starts the clock; the written follow-up creates the legal record.' },
      { id: 'b', text: 'Hire a roofer to fix it and send the builder the bill.', rating: 'bad',  explanation: 'Do not authorize repairs before contacting the builder — this can void your warranty. The builder must be given the opportunity to remedy the defect first.' },
      { id: 'c', text: 'Review your warranty documents for coverage terms.', rating: 'ok',   explanation: 'Good step, but also contact the builder immediately. Virginia law requires builders to respond to warranty claims within a reasonable timeframe.' },
      { id: 'd', text: 'Wait until the rainy season ends to assess fully.', rating: 'bad',  explanation: 'Active leaks cause compounding damage. Waiting can also be seen as failure to mitigate, which may reduce your warranty protection.' },
    ],
    lesson: 'Never authorize independent repairs before contacting your builder. Doing so can void your warranty. Always document and report promptly.',
  },
  {
    id: 3,
    situation: 'Your builder refuses to honor your warranty claim, saying the defect was "caused by normal wear."',
    detail: 'The home is 14 months old. Virginia\'s implied warranty law provides certain protections.',
    choices: [
      { id: 'a', text: 'Consult a Virginia construction attorney.',      rating: 'best', explanation: 'Correct. Virginia\'s Residential Property Disclosure Act and implied warranty laws provide protections beyond what a builder\'s warranty states. An attorney can advise on your specific rights.' },
      { id: 'b', text: 'File a complaint with the Virginia DPOR.',      rating: 'best', explanation: 'Also correct. The Virginia Department of Professional and Occupational Regulation licenses builders and can investigate complaints of warranty non-compliance.' },
      { id: 'c', text: 'Accept the builder\'s decision and pay for repairs.', rating: 'bad',  explanation: 'Don\'t give up without exploring your options. State law provides warranty protections that cannot be waived by contract, and you may have legal remedies.' },
      { id: 'd', text: 'Post negative reviews and move on.',             rating: 'bad',  explanation: 'While reviews are within your rights, they don\'t resolve your actual defect. Pursue legal remedies through DPOR or an attorney first.' },
    ],
    lesson: 'Virginia provides statutory warranty protections for new homes. If a builder refuses a valid claim, file with the VA DPOR (dpor.virginia.gov) and consult an attorney.',
  },
];

const ratingColor: Record<string, string> = {
  best: 'border-emerald-400 bg-emerald-50 text-emerald-900',
  ok:   'border-amber-400 bg-amber-50 text-amber-900',
  bad:  'border-rose-400 bg-rose-50 text-rose-900',
};
const ratingLabel: Record<string, string> = {
  best: '✓ Best choice',
  ok:   '~ Good idea, but…',
  bad:  '✗ Avoid this',
};

function WarrantyChallenge() {
  const [scenarioIdx, setScenarioIdx]   = useState(0);
  const [chosen, setChosen]             = useState<Record<number, string>>({});
  const [showResult, setShowResult]     = useState(false);
  const [done, setDone]                 = useState(false);

  const scenario = WARRANTY_SCENARIOS[scenarioIdx];
  const selectedId = chosen[scenario.id];
  const isLast = scenarioIdx === WARRANTY_SCENARIOS.length - 1;

  const handleChoice = (id: string) => {
    if (selectedId) return;
    setChosen(prev => ({ ...prev, [scenario.id]: id }));
    setShowResult(true);
  };

  const advance = () => {
    setShowResult(false);
    if (isLast) { setDone(true); return; }
    setScenarioIdx(i => i + 1);
  };

  const reset = () => { setScenarioIdx(0); setChosen({}); setShowResult(false); setDone(false); };

  if (done) {
    return (
      <div className="rounded-3xl border border-border/60 bg-white shadow-lg p-8 text-center">
        <ShieldCheck className="w-14 h-14 text-emerald-500 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-xl font-bold text-primary mb-2">Challenge Complete</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed max-w-lg mx-auto">
          Knowing your warranty rights is just as important as the warranty itself. Virginia law provides builder accountability — use it.
        </p>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-left max-w-lg mx-auto">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> Key Takeaways
          </p>
          <ul className="text-sm text-foreground space-y-2">
            {WARRANTY_SCENARIOS.map(s => (
              <li key={s.id} className="flex items-start gap-2">
                <span className="text-accent shrink-0 mt-0.5" aria-hidden="true">→</span>
                {s.lesson}
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={reset} variant="outline" className="rounded-xl gap-2 mx-auto">
          <RotateCcw className="w-4 h-4" aria-hidden="true" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-white shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" /> Builder Warranty Challenge
          </h3>
          <span className="text-white/60 text-sm" aria-label={`Scenario ${scenarioIdx + 1} of ${WARRANTY_SCENARIOS.length}`}>
            {scenarioIdx + 1} / {WARRANTY_SCENARIOS.length}
          </span>
        </div>
        <div className="flex gap-2" role="list" aria-label="Progress">
          {WARRANTY_SCENARIOS.map((s, i) => (
            <div key={s.id} role="listitem"
              className={`h-1.5 flex-1 rounded-full transition-all ${i < scenarioIdx ? 'bg-secondary' : i === scenarioIdx ? 'bg-white' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Post-Construction Scenario</p>
          <p className="font-semibold text-foreground leading-relaxed">{scenario.situation}</p>
          <p className="text-sm text-muted-foreground mt-1">{scenario.detail}</p>
        </div>

        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-widest">What do you do?</p>
        <div className="space-y-2.5" role="group" aria-label="Choose your response">
          {scenario.choices.map(choice => {
            const picked  = selectedId === choice.id;
            const locked  = !!selectedId;
            const revealed = locked && picked;
            return (
              <motion.button
                key={choice.id}
                onClick={() => handleChoice(choice.id)}
                disabled={locked}
                whileTap={locked ? undefined : { scale: 0.98 }}
                aria-pressed={picked}
                aria-label={choice.text + (revealed ? ` — ${ratingLabel[choice.rating]}` : '')}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                  revealed
                    ? ratingColor[choice.rating]
                    : locked
                    ? 'border-border/30 bg-muted/10 text-muted-foreground cursor-default opacity-50'
                    : 'border-border/60 hover:border-primary/40 hover:bg-muted/30 cursor-pointer'
                }`}
              >
                {choice.text}
                {revealed && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 space-y-1">
                    <p className="text-xs font-bold">{ratingLabel[choice.rating]}</p>
                    <p className="text-xs leading-relaxed font-normal">{choice.explanation}</p>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {showResult && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-foreground leading-relaxed">
            <span className="font-semibold">Key lesson: </span>{scenario.lesson}
          </motion.div>
        )}

        {showResult && (
          <Button onClick={advance}
            className="w-full mt-4 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold h-11 gap-2">
            {isLast ? 'See Summary' : 'Next Scenario'} <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

const BUILD_STEPS = [
  { icon: TreePine,   title: 'Buy Land',              body: 'Finding the right lot is your first decision. Consider zoning, utilities access, soil conditions, flood zones, and HOA restrictions before purchasing.' },
  { icon: FileCheck,  title: 'Permits & Planning',    body: 'Newport News requires building permits for new construction. Work with the City\'s Development Center at City Hall — they review plans, issue permits, and schedule inspections.' },
  { icon: Hammer,     title: 'Construction Loan',     body: 'Unlike a traditional mortgage, a construction loan funds the build in stages. Virginia Housing and local banks offer construction-to-permanent loans that convert to a mortgage at completion.' },
  { icon: Home,       title: 'Foundation & Framing',  body: 'After site preparation, your builder pours the foundation and erects the framing. Inspections occur at each phase — never skip or rush them.' },
  { icon: Zap,        title: 'Utilities & Systems',   body: 'HVAC, electrical, and plumbing are roughed in before walls close. Decide early about city water/sewer vs. a private well and septic system.' },
  { icon: ShieldCheck,title: 'Final Walkthrough',     body: 'Before closing, walk through every room with a professional inspector to create a punch list of items the builder must fix before you take ownership.' },
];

const RESOURCES = [
  { title: 'Newport News Development Center', desc: 'Building permits, zoning information, and construction inspections.', url: 'https://www.nnva.gov/2081/Development', label: 'Get Permits' },
  { title: 'Virginia Housing Construction Loans', desc: 'State-backed construction-to-permanent financing for qualified buyers.', url: 'https://www.virginiahousing.com/', label: 'Learn More' },
  { title: 'VA DPOR — Contractor Licensing', desc: 'Verify that your builder holds a current Virginia contractor\'s license.', url: 'https://www.dpor.virginia.gov/', label: 'Verify License' },
  { title: 'Newport News Zoning & Land Use', desc: 'Look up zoning classifications before purchasing land.', url: 'https://www.nnva.gov/2081/Development', label: 'Check Zoning' },
  { title: 'Virginia SCC — Business Resources', desc: 'Programs for workforce housing and community development financing.', url: 'https://www.scc.virginia.gov/', label: 'View Programs' },
  { title: 'HUD Home Builder Programs', desc: 'Federal resources for affordable housing construction and financing.', url: 'https://www.hud.gov/program_offices/housing/ramh/mhs/mhshome', label: 'HUD Programs' },
];

export default function BuildPage() {
  return (
    <div className="flex flex-col w-full pt-20 bg-muted/20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0B2146] via-primary to-teal-900 text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_60%_40%,white_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-sm font-medium mb-6 backdrop-blur-sm">
              <Hammer className="w-4 h-4 text-secondary" aria-hidden="true" />
              Alternative Path to Homeownership
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight leading-[1.1]">Build Your Own Home</h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Buying an existing home isn't the only path. Building from the ground up lets you design exactly what you want — but it takes careful planning, the right team, and a clear budget.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#steps" className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-full h-13 px-8 py-3 text-base shadow-xl transition-transform hover:scale-105 inline-flex items-center gap-2">
                See How It Works <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a href="#builder-challenge" className="border border-white/30 text-white hover:bg-white/10 rounded-full h-13 px-8 py-3 text-base font-semibold inline-flex items-center gap-2 transition-colors">
                Try the Budget Challenge
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border/40 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: '$280K–$420K', label: 'Avg. new build cost in Hampton Roads' },
              { val: '12–18 mo',   label: 'Typical construction timeline' },
              { val: '10 years',   label: 'Structural warranty protection (VA law)' },
              { val: '~15%',       label: 'Contingency budget recommended' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-extrabold text-primary">{s.val}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="steps" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <AnimatedSection variant="slideUp" className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">How Building a Home Works</h2>
            <div className="h-1 w-14 bg-accent rounded-full mt-2 mb-4 mx-auto" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">From raw land to move-in day — every major phase explained.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BUILD_STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
              >
                <Card className="h-full border-border/40 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl">
                  <CardContent className="p-6">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <step.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Step {i + 1}</div>
                    <h3 className="text-lg font-bold text-primary mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Builder Challenge */}
      <section id="builder-challenge" className="py-20 bg-white border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <AnimatedSection variant="slideUp" className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm font-semibold text-accent mb-4">
              <DollarSign className="w-4 h-4" aria-hidden="true" /> Interactive Budget Challenge
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Build Your Budget</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              You have $400,000. Select everything you think you need to build a home and see what happens.
            </p>
          </AnimatedSection>
          <BuilderChallenge />
        </div>
      </section>

      {/* Warranty Challenge */}
      <section className="py-20 bg-muted/20 border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <AnimatedSection variant="slideUp" className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-sm font-semibold text-teal-700 mb-4">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Interactive Scenario
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Builder Warranty Challenge</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Something goes wrong after move-in. Do you know your rights and the right next steps?
            </p>
          </AnimatedSection>
          <WarrantyChallenge />
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 bg-white border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <AnimatedSection variant="slideUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-3">Newport News & Virginia Resources</h2>
            <p className="text-muted-foreground text-lg">Official resources for permits, financing, and builder verification.</p>
          </AnimatedSection>
          <StaggerSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RESOURCES.map(r => (
              <StaggerItem key={r.title}>
                <Card className="h-full border-border/40 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 rounded-2xl bg-white">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Landmark className="w-4 h-4 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-primary text-sm mb-1">{r.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{r.desc}</p>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-accent hover:underline inline-flex items-center gap-1"
                    >
                      {r.label} <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">Ready to Break Ground?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">Talk to a housing counselor about construction financing, lot selection, and the Newport News permitting process.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-full h-14 px-10 text-base shadow-xl">
              <Link href="/contact">Schedule a Consultation</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full h-14 px-8 text-base font-semibold bg-transparent">
              <Link href="/buy">Explore Buying Instead <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
