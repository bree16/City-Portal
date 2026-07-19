import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { homes, HomeOption } from '@/data/homes';
import { StageIntro } from '@/components/StageIntro';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Bed, Bath, ArrowRight, Star } from 'lucide-react';

export function Stage3Hunting() {
  const { setStage, setSelectedHome, addAchievement } = useGameStore();
  const [showIntro, setShowIntro] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewedHomes, setViewedHomes] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleMakeOffer = (home: HomeOption) => {
    setSelectedHome(home);
    setStage(4);
  };

  const handleView = (id: number) => {
    if (!viewedHomes.includes(id)) {
      const newViewed = [...viewedHomes, id];
      setViewedHomes(newViewed);
      if (newViewed.length === homes.length) {
        addAchievement('smart_shopper');
      }
    }
  };

  return (
    <div className="flex flex-col h-full relative p-6">
      <AnimatePresence>
        {showIntro && (
          <StageIntro 
            stage={3} 
            title="House Hunting" 
            description="You're pre-approved! Explore Newport News neighborhoods and find the right home for your budget."
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Active Listings</h1>
          <p className="text-muted-foreground">Select a home to make an offer.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto pb-8">
        {homes.map((home, index) => (
          <motion.div 
            key={home.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => handleView(home.id)}
            className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            {/* Image Placeholder */}
            <div 
              className="h-48 relative flex items-center justify-center"
              style={{ backgroundColor: home.color }}
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <span className="text-6xl z-10 drop-shadow-lg">🏠</span>
              
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(home.id); }}
                className="absolute top-3 right-3 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors"
              >
                <Heart className={`w-5 h-5 ${favorites.includes(home.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <div className="mb-1 text-2xl font-bold text-primary">${home.price.toLocaleString()}</div>
              <h3 className="font-bold text-foreground mb-1 line-clamp-1">{home.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <MapPin className="w-3 h-3 mr-1" /> {home.neighborhood}
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-border mb-4 text-center">
                <div>
                  <div className="flex items-center justify-center text-muted-foreground mb-1"><Bed className="w-4 h-4 mr-1"/></div>
                  <div className="font-bold text-sm">{home.beds} Bed</div>
                </div>
                <div className="border-x border-border">
                  <div className="flex items-center justify-center text-muted-foreground mb-1"><Bath className="w-4 h-4 mr-1"/></div>
                  <div className="font-bold text-sm">{home.baths} Bath</div>
                </div>
                <div>
                  <div className="flex items-center justify-center text-muted-foreground mb-1"><span className="text-xs mr-1">sqft</span></div>
                  <div className="font-bold text-sm">{home.sqft}</div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Est. Payment</span>
                  <span className="font-bold text-accent">${home.monthlyPayment}/mo</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Schools</span>
                  <span className="flex items-center font-medium">
                    {home.schools} <Star className="w-3 h-3 ml-1 fill-secondary text-secondary" />
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Commute</span>
                  <span className="font-medium">{home.commute} mins</span>
                </div>
              </div>

              <button 
                onClick={() => handleMakeOffer(home)}
                className="mt-auto w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Make Offer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
