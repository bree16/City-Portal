import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { StageIntro } from '@/components/StageIntro';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2, ArrowRight, Landmark } from 'lucide-react';

const DOCS = [
  { id: 'paystubs', name: 'Recent Pay Stubs' },
  { id: 'bank', name: 'Bank Statements' },
  { id: 'tax', name: 'Tax Returns (W-2s)' },
  { id: 'id', name: 'Government ID' },
];

export function Stage5Mortgage() {
  const { selectedHome, creditScore, monthlyIncome, debt, setStage } = useGameStore();
  const [showIntro, setShowIntro] = useState(true);
  
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  if (!selectedHome) return null;

  const handleUpload = (id: string) => {
    if (!uploadedDocs.includes(id)) {
      setUploadedDocs([...uploadedDocs, id]);
    }
  };

  const submitApplication = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsApproved(true);
    }, 3000);
  };

  // Calculations
  const loanAmount = selectedHome.price * 0.95; // Assuming 5% down
  const interestRate = creditScore >= 680 ? 6.2 : 6.8;
  const closingCosts = selectedHome.price * 0.03;
  const dti = ((debt / 60) + selectedHome.monthlyPayment) / monthlyIncome * 100; // rough calc

  return (
    <div className="flex flex-col h-full relative p-6 max-w-4xl mx-auto w-full">
      <AnimatePresence>
        {showIntro && (
          <StageIntro 
            stage={5} 
            title="Mortgage Underwriting" 
            description="Time for paperwork! The lender needs to verify all your financial details before final approval."
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Loan Application</h1>
        <p className="text-muted-foreground">Upload your documents for the underwriter.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        {/* Left: Document Uploads */}
        <div className="space-y-4">
          {DOCS.map(doc => {
            const isDone = uploadedDocs.includes(doc.id);
            return (
              <button
                key={doc.id}
                onClick={() => handleUpload(doc.id)}
                disabled={isDone || isProcessing || isApproved}
                className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  isDone 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                    : 'border-dashed border-border bg-card hover:border-primary/50'
                }`}
              >
                <span className={`font-bold ${isDone ? 'text-green-700 dark:text-green-400' : 'text-foreground'}`}>
                  {doc.name}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <UploadCloud className="w-6 h-6 text-muted-foreground" />
                )}
              </button>
            );
          })}

          {!isApproved && (
            <button
              onClick={submitApplication}
              disabled={uploadedDocs.length < DOCS.length || isProcessing}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-8 transition-all ${
                uploadedDocs.length === DOCS.length && !isProcessing
                  ? 'bg-primary text-white shadow-lg hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Underwriter Reviewing...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          )}
        </div>

        {/* Right: Loan Details / Approval */}
        <div>
          <AnimatePresence mode="wait">
            {!isApproved ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Loan Estimate</h3>
                    <p className="text-sm text-muted-foreground">Based on your file</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Property Price</span>
                    <span className="font-medium">${selectedHome.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Credit Score</span>
                    <span className="font-medium">{creditScore}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Est. Interest Rate</span>
                    <span className="font-medium">{interestRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Closing Costs</span>
                    <span className="font-medium text-accent">~${closingCosts.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-primary text-primary-foreground p-8 rounded-2xl shadow-xl flex flex-col h-full">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-secondary-foreground mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-secondary">Clear to Close!</h2>
                  <p className="text-primary-foreground/80 mt-2">The lender has fully approved your mortgage.</p>
                </div>

                <div className="bg-black/20 rounded-xl p-5 mb-8 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-primary-foreground/70">Final Loan Amount</span>
                    <span className="font-bold">${loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-foreground/70">Interest Rate</span>
                    <span className="font-bold">{interestRate}% Fixed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-foreground/70">DTI Ratio</span>
                    <span className="font-bold text-green-400">{dti.toFixed(1)}%</span>
                  </div>
                </div>

                <button 
                  onClick={() => setStage(6)}
                  className="mt-auto w-full py-4 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/90 shadow-lg flex items-center justify-center gap-2"
                >
                  Go to Closing Day <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
