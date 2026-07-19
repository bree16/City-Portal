import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

const SUGGESTED_PROMPTS = [
  "Can I qualify for assistance?",
  "How do I buy my first home?",
  "What grants are available?",
  "How do I contact a counselor?"
];

const CANNED_RESPONSES: Record<string, string> = {
  "Can I qualify for assistance?": "To qualify for most programs, you'll need to meet income limits (typically 80% of area median income), be a Newport News resident, and have a stable income source. Visit our Assistance page or speak with a counselor for a personalized assessment.",
  "How do I buy my first home?": "Start by checking your affordability with our calculator, then connect with a free housing counselor. Complete a HUD-approved education course and explore down payment assistance programs. Visit our Buy page for the full roadmap.",
  "What grants are available?": "Newport News offers several programs including Virginia Housing grants, NNRHA down payment assistance, and federal HOME funds. Amounts vary by income and home price. Check our Resources page for full details.",
  "How do I contact a counselor?": "You can request a free counseling session through our Contact page. Counselors are available Monday–Friday 8am–5pm at (757) 933-2311 or by email at housing@newportnewsva.gov."
};

const DEFAULT_RESPONSE = "Great question! Please call us at (757) 933-2311 or visit our Contact page for personalized help.";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm your Newport News Housing Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate thinking delay
    setTimeout(() => {
      const botResponse = CANNED_RESPONSES[text] || DEFAULT_RESPONSE;
      const botMsg: Message = { id: Date.now() + 1, text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
          >
            <span className="hidden md:block bg-white text-primary px-3 py-1.5 rounded-full shadow-md text-sm font-semibold pointer-events-none">
              Housing Assistant
            </span>
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 transition-transform hover:scale-105"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[300px] h-[450px] md:w-[350px] md:h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border"
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm">AI Housing Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-accent text-white rounded-br-sm' 
                        : 'bg-white border border-border/50 text-foreground rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Prompts */}
            <div className="px-4 py-3 bg-white border-t border-border/50 flex flex-wrap gap-2 shrink-0 max-h-[80px] overflow-y-auto">
              {SUGGESTED_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-primary hover:bg-primary hover:text-white transition-colors border border-border"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-border flex items-center gap-2 shrink-0">
              <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend(inputValue)}
                placeholder="Type a message..."
                className="flex-1 border-none bg-muted/50 focus-visible:ring-accent"
              />
              <Button 
                onClick={() => handleSend(inputValue)}
                size="icon"
                className="bg-accent hover:bg-accent/90 text-white shrink-0 rounded-full w-10 h-10"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
