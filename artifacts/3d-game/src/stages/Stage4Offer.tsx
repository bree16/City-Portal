import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { StageIntro } from '@/components/StageIntro';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSignature, ShieldAlert, BadgeDollarSign, ArrowRight } from 'lucide-react';

export function Stage4Offer() {
  const { selectedHome, setStage, addAchievement } = useGameStore();
  const [showIntro, setShowIntro] = useState(true);
  
  // Offer state
  const [offerPrice, setOfferPrice] = useState(selectedHome?.price || 0);
  const [hasInspection, setHasInspection] = useState(true);
  const [earnestMoney, setEarnestMoney] = useState(1000);
  
  // Result state
  const [offerResult, setOfferResult] = useState<'pending' | 'accepted' | 'counter' | 'rejected' | null>(null);
  const [counterPrice, setCounterPrice] = useState(0);

  if (!selectedHome) return null;

  const submitOffer = () => {
    // Simple logic:
    // Offer >= listing price: 80% accept, 20% counter
    // Offer < listing: 60% counter, 40% reject
    // No inspection: slightly higher accept rate
    
    setOfferResult('pending');
    
    setTimeout(() => {
      const ratio = offerPrice / selectedHome.price;
      const r = Math.random();
      
      let bonus = hasInspection ? 0 : 0.1;
      
      if (ratio >= 1.0) {
        if (r + bonus > 0.3) {
          setOfferResult('accepted');
          addAchievement('deal_maker');
        } else {
          setOfferResult('counter');
          setCounterPrice(selectedHome.price * 1.02); // Counter higher
        }
      } else {
        if (r + bonus > 0.5) {
          setOfferResult('counter');
          setCounterPrice(selectedHome.price); // Counter at listing
        } else {
          setOfferResult('rejected');
        }
      }
    }, 2000);
  };

  const acceptCounter = () => {
    setOfferPrice(counterPrice);
    setOfferResult('accepted');
  };

  const proceedToMortgage = () => {
    setStage(5);
  };

  return (
    <div className="flex flex-col h-full relative p-6 max-w-4xl mx-auto w-full">
      <AnimatePresence>
        {showIntro && (
          <StageIntro 
            stage={4} 
            title="Make an Offer" 
            description={`You've chosen ${selectedHome.name}. Now it's time to negotiate!`}
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Offer Details</h1>
        <p className="text-muted-foreground">Customize your offer for {selectedHome.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        {/* Left: Home Info */}
        <div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground font-medium">Listing Price</span>
              <span className="text-2xl font-bold text-primary">${selectedHome.price.toLocaleString()}</span>
            </div>
            
            <div className="h-32 rounded-xl mb-4 flex items-center justify-center text-4xl" style={{ backgroundColor: selectedHome.color }}>
              🏠
            </div>
            
            <h3 className="font-bold text-lg mb-1">{selectedHome.name}</h3>
            <p className="text-muted-foreground text-sm">{selectedHome.neighborhood}</p>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5">
            <h3 className="font-bold text-accent mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Inspection Contingency
            </h3>
            <p className="text-sm text-muted-foreground">
              An inspection protects you from buying a house with hidden problems. Waiving it makes your offer stronger to the seller, but adds huge risk for you.
            </p>
          </div>
        </div>

        {/* Right: Controls / Results */}
        <div>
          <AnimatePresence mode="wait">
            {!offerResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <label className="block text-sm font-bold text-foreground mb-3">Offer Price</label>
                  <div className="text-3xl font-bold text-primary mb-4 text-center">
                    ${offerPrice.toLocaleString()}
                  </div>
                  <input 
                    type="range" 
                    min={selectedHome.price * 0.9} 
                    max={selectedHome.price * 1.05} 
                    step={1000}
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>${(selectedHome.price * 0.9).toLocaleString()}</span>
                    <span>Listing</span>
                    <span>${(selectedHome.price * 1.05).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <label className="block text-sm font-bold text-foreground">Include Inspection?</label>
                      <p className="text-xs text-muted-foreground">Highly recommended</p>
                    </div>
                    <button 
                      onClick={() => setHasInspection(!hasInspection)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hasInspection ? 'bg-accent' : 'bg-muted'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasInspection ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="border-t pt-4">
                    <label className="block text-sm font-bold text-foreground mb-3">Earnest Money Deposit</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[1000, 2500, 5000].map(amount => (
                        <button
                          key={amount}
                          onClick={() => setEarnestMoney(amount)}
                          className={`py-2 px-1 text-sm font-medium rounded-lg border-2 transition-colors ${
                            earnestMoney === amount ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={submitOffer}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-lg flex items-center justify-center gap-2"
                >
                  <FileSignature className="w-5 h-5" /> Submit Offer
                </button>
              </motion.div>
            )}

            {offerResult === 'pending' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center bg-card rounded-2xl border border-border p-8">
                <div className="w-16 h-16 border-4 border-muted border-t-accent rounded-full animate-spin mb-4" />
                <h3 className="text-xl font-bold">Seller is reviewing...</h3>
                <p className="text-muted-foreground text-center mt-2">Nail-biting time.</p>
              </motion.div>
            )}

            {offerResult === 'accepted' && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-8 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-4xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">Offer Accepted!</h3>
                <p className="text-green-700 dark:text-green-500 mb-8">They agreed to ${offerPrice.toLocaleString()}!</p>
                <button onClick={proceedToMortgage} className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg flex items-center justify-center gap-2">
                  Proceed to Mortgage <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {offerResult === 'counter' && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col items-center justify-center bg-secondary/10 rounded-2xl border border-secondary/30 p-8 text-center">
                <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center text-secondary mb-4">
                  <BadgeDollarSign className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">Counter-Offer Received</h3>
                <p className="text-muted-foreground mb-6">The seller wants <strong>${counterPrice.toLocaleString()}</strong>.</p>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button onClick={() => setOfferResult(null)} className="py-3 border-2 border-border text-foreground font-bold rounded-xl hover:bg-muted">
                    Reject
                  </button>
                  <button onClick={acceptCounter} className="py-3 bg-secondary text-secondary-foreground font-bold rounded-xl shadow-md">
                    Accept Counter
                  </button>
                </div>
              </motion.div>
            )}

            {offerResult === 'rejected' && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-8 text-center">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center text-4xl mb-4">❌</div>
                <h3 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-2">Offer Rejected</h3>
                <p className="text-red-700 dark:text-red-500 mb-8">They went with another buyer.</p>
                <button onClick={() => setOfferResult(null)} className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg">
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
