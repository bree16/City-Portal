import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { StageIntro } from '@/components/StageIntro';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, Calculator, FileText, Building, Info } from 'lucide-react';

const TASKS = [
  { id: 'counselor', title: 'Meet Housing Counselor', icon: Info, desc: 'Learn about Debt-to-Income (DTI) ratio.' },
  { id: 'credit', title: 'Pull Credit Report', icon: FileText, desc: 'Check for errors. You need 650+.' },
  { id: 'afford', title: 'Calculate Affordability', icon: Calculator, desc: 'Find your monthly payment limit.' },
  { id: 'dpa', title: 'Explore DPA Programs', icon: Building, desc: 'Newport News HOME grants up to $14,500.' },
];

export function Stage2Preparing() {
  const { creditScore, savings, completedTasks, completeTask, setStage, addAchievement } = useGameStore();
  const [showIntro, setShowIntro] = useState(true);
  const [activeTask, setActiveTask] = useState<string | null>(null);

  const allTasksDone = TASKS.every(t => completedTasks.includes(t.id));
  const isReady = allTasksDone && creditScore >= 650 && savings >= 5000;

  const handleTaskClick = (id: string) => {
    setActiveTask(id);
    if (!completedTasks.includes(id)) {
      completeTask(id);
    }
  };

  const finishStage = () => {
    addAchievement('pre_approved');
    setStage(3);
  };

  return (
    <div className="flex flex-col h-full relative p-6 max-w-4xl mx-auto w-full">
      <AnimatePresence>
        {showIntro && (
          <StageIntro 
            stage={2} 
            title="Preparing to Buy" 
            description="Complete your homebuyer education checklist to get pre-approved for a mortgage."
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Pre-Approval Checklist</h1>
        <p className="text-muted-foreground">Complete these steps to show lenders you are ready.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        {/* Left: Checklist */}
        <div className="space-y-3">
          {TASKS.map((task) => {
            const isDone = completedTasks.includes(task.id);
            const Icon = task.icon;
            
            return (
              <button
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  isDone 
                    ? 'border-accent bg-accent/5' 
                    : activeTask === task.id
                      ? 'border-primary bg-card'
                      : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className={`${isDone ? 'text-accent' : 'text-muted-foreground'}`}>
                  {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold ${isDone ? 'text-primary' : 'text-foreground'}`}>{task.title}</h3>
                  <p className="text-sm text-muted-foreground">{task.desc}</p>
                </div>
                <div className={`p-2 rounded-full ${isDone ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Info Panel & Final Action */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTask === 'counselor' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-3">Debt-to-Income (DTI)</h3>
                <p className="text-muted-foreground text-sm mb-4">Lenders want to see that your monthly debt payments (including your new mortgage) take up no more than 43% of your monthly income.</p>
                <div className="bg-muted p-4 rounded-xl text-center font-mono font-bold text-lg">
                  Target DTI: &lt; 43%
                </div>
              </motion.div>
            )}
            
            {activeTask === 'dpa' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary/10 border border-secondary p-6 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-3">Down Payment Assistance</h3>
                <p className="text-primary/80 text-sm mb-4">The City of Newport News offers the HOME Program, providing up to $14,500 for first-time homebuyers to cover down payment and closing costs.</p>
                <div className="bg-secondary p-3 rounded-xl text-center font-bold text-primary">
                  You qualify!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-primary text-primary-foreground p-6 rounded-2xl mt-auto">
            <h3 className="font-bold mb-4 text-lg">Lender Requirements</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm">Checklist Complete</span>
                {allTasksDone ? <CheckCircle2 className="text-secondary w-5 h-5" /> : <Circle className="text-primary-foreground/30 w-5 h-5" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Credit Score 650+</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{creditScore}</span>
                  {creditScore >= 650 ? <CheckCircle2 className="text-secondary w-5 h-5" /> : <Circle className="text-primary-foreground/30 w-5 h-5" />}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Savings $5,000+</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">${savings.toLocaleString()}</span>
                  {savings >= 5000 ? <CheckCircle2 className="text-secondary w-5 h-5" /> : <Circle className="text-primary-foreground/30 w-5 h-5" />}
                </div>
              </div>
            </div>

            <button 
              onClick={finishStage}
              disabled={!isReady}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                isReady 
                  ? 'bg-secondary text-primary hover:bg-secondary/90 shadow-lg cursor-pointer' 
                  : 'bg-primary-foreground/10 text-primary-foreground/50 cursor-not-allowed'
              }`}
            >
              Get Pre-Approved <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
