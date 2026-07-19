import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { HomeScene3D } from '@/components/HomeScene3D';
import { furnitureItems, FurnitureItem } from '@/data/furniture';
import { ShoppingBag, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ROOMS = ["Living Room", "Bedroom", "Kitchen", "Office", "Outdoor"];

export function Stage7MoveIn() {
  const { cash, updateCash, furnitureOwned, addFurniture, addAchievement } = useGameStore();
  const [activeRoom, setActiveRoom] = useState(ROOMS[0]);

  const handleBuy = (item: FurnitureItem) => {
    if (cash >= item.price && !furnitureOwned.find(f => f.id === item.id)) {
      updateCash(-item.price);
      addFurniture(item);
      
      if (furnitureOwned.length + 1 >= 10) {
        addAchievement('dream_home');
      }
    }
  };

  const filteredFurniture = furnitureItems.filter(f => f.room === activeRoom);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* 3D Scene Header */}
      <div className="relative">
        <HomeScene3D />
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-border">
          <h2 className="font-bold text-primary">Your New Home</h2>
          <p className="text-xs text-muted-foreground">Make it yours!</p>
        </div>
      </div>

      {/* Decorator Interface */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* Left: Sidebar */}
        <div className="w-full md:w-64 bg-card border-r border-border p-4 flex flex-col">
          <div className="bg-primary text-primary-foreground p-4 rounded-xl mb-6 shadow-sm">
            <div className="text-sm opacity-80 font-medium mb-1">Available Funds</div>
            <div className="text-3xl font-bold text-secondary">${cash.toLocaleString()}</div>
          </div>

          <h3 className="font-bold text-muted-foreground uppercase text-xs tracking-wider mb-3 px-2">Rooms</h3>
          <div className="space-y-1 flex-1 overflow-y-auto">
            {ROOMS.map(room => (
              <button
                key={room}
                onClick={() => setActiveRoom(room)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeRoom === room 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {room}
              </button>
            ))}
          </div>

          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <h4 className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300 text-sm mb-2">
              <Info className="w-4 h-4" /> Financial Tip
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Don't spend it all! Homeowners should keep 3-6 months of expenses in an emergency fund for unexpected repairs.
            </p>
          </div>
        </div>

        {/* Right: Shop Grid */}
        <div className="flex-1 p-6 overflow-y-auto bg-muted/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">{activeRoom} Furniture</h2>
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <ShoppingBag className="w-5 h-5" />
              {furnitureOwned.filter(f => f.room === activeRoom).length} owned
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredFurniture.map(item => {
                const isOwned = furnitureOwned.some(f => f.id === item.id);
                const canAfford = cash >= item.price;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`bg-card rounded-2xl p-5 border-2 transition-all ${
                      isOwned ? 'border-accent bg-accent/5' : 'border-border hover:border-primary/30 shadow-sm'
                    }`}
                  >
                    <div className="text-5xl mb-4 text-center">{item.emoji}</div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                      <span className="text-xs font-bold px-2 py-1 bg-muted rounded-md">{item.style}</span>
                    </div>
                    <div className="text-xl font-bold text-primary mb-4">${item.price}</div>
                    
                    {isOwned ? (
                      <div className="w-full py-2 bg-accent/10 text-accent font-bold rounded-lg flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Owned
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford}
                        className={`w-full py-2 font-bold rounded-lg transition-colors ${
                          canAfford 
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Buy' : 'Not enough cash'}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
