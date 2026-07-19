import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (textSize === 'sm') {
      document.documentElement.style.fontSize = '14px';
    } else if (textSize === 'lg') {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  }, [textSize]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-start gap-4">
      {/* Toggle Button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-transform hover:scale-105"
          data-testid="button-accessibility-toggle"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
        </Button>
        {!isOpen && (
          <span className="hidden md:block bg-white text-primary px-3 py-1.5 rounded-full shadow-md text-sm font-semibold pointer-events-none">
            Accessibility
          </span>
        )}
      </div>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[280px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border"
            data-testid="panel-accessibility"
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                <span className="font-semibold text-sm">Accessibility Options</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-6">
              {/* Text Size */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Text Size</label>
                <div className="flex bg-muted/50 rounded-lg p-1 border border-border">
                  {(['sm', 'base', 'lg'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setTextSize(size)}
                      className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        textSize === size
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      data-testid={`btn-textsize-${size}`}
                    >
                      {size === 'sm' ? 'A-' : size === 'base' ? 'A' : 'A+'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Options */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground">Display</label>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">High Contrast Mode</span>
                  <Switch
                    checked={highContrast}
                    onCheckedChange={setHighContrast}
                    data-testid="switch-high-contrast"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Reduce Motion</span>
                  <Switch
                    checked={reduceMotion}
                    onCheckedChange={setReduceMotion}
                    data-testid="switch-reduce-motion"
                  />
                </div>
              </div>

              {/* Language */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Language</label>
                <Select value={language} onValueChange={setLanguage} data-testid="select-language">
                  <SelectTrigger className="w-full bg-muted/50">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
                {language !== 'en' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Translation services coming soon. Call (757) 933-2311 for language assistance.
                  </p>
                )}
              </div>
            </div>

            {/* Footer Link */}
            <div className="px-4 py-3 bg-muted/30 border-t border-border/50 text-center">
              <a href="#" className="text-xs text-accent hover:underline font-medium">
                Accessibility Statement
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
