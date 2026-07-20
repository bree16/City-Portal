import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ChatLink = {
  label: string;
  href: string;
};

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  links?: ChatLink[];
  suggestions?: string[];
};

const SUGGESTED_PROMPTS = [
  "Can I qualify for assistance?",
  "How do I buy my first home?",
  "What grants are available?",
  "How do I contact a counselor?"
];

const FALLBACK_RESPONSE = "I'm having trouble answering right now. Please call us at (757) 933-2311 or visit our Contact page to reach a housing counselor.";

export function ChatWidget() {
  const [, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm your Newport News Housing Assistant. Ask me anything about buying, renting, assistance programs, or city services. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom whenever messages change or typing state toggles.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now(), text, sender: 'user' };
    const nextMessages: Message[] = [...messages, userMsg];
    setMessages(nextMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages
            .filter(m => m.id !== 1)
            .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
        }),
      });
      const data = await res.json().catch(() => null);
      const reply = data?.reply || FALLBACK_RESPONSE;
      const links: ChatLink[] = Array.isArray(data?.links)
        ? data.links.filter((l: any) => l && typeof l.label === 'string' && typeof l.href === 'string')
        : [];
      const suggestions: string[] = Array.isArray(data?.suggestions)
        ? data.suggestions.filter((s: any) => typeof s === 'string')
        : [];
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, text: reply, sender: 'bot', links, suggestions },
      ]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: FALLBACK_RESPONSE, sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
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
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
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

                  {/* Link buttons (bot only) */}
                  {msg.sender === 'bot' && msg.links && msg.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-w-[90%]">
                      {msg.links.map((link, i) => (
                        <button
                          key={`${link.href}-${i}`}
                          onClick={() => navigate(link.href)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          {link.label}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Suggestion chips (bot only) */}
                  {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-w-[90%]">
                      {msg.suggestions.map((suggestion, i) => (
                        <button
                          key={`${suggestion}-${i}`}
                          onClick={() => handleSend(suggestion)}
                          className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-primary hover:bg-primary hover:text-white transition-colors border border-border"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border/50 rounded-2xl rounded-bl-sm shadow-sm p-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
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
                disabled={isTyping}
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
