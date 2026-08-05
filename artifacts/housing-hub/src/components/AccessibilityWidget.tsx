import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Google Translate language codes
const GT_LANG: Record<string, string> = {
  es: 'es',
  ko: 'ko',
  vi: 'vi',
  zh: 'zh-CN',
};

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [language, setLanguage] = useState('en');

  // Text size
  useEffect(() => {
    const sizes = { sm: '14px', base: '16px', lg: '18px' };
    document.documentElement.style.fontSize = sizes[textSize];
  }, [textSize]);

  // High contrast — CSS targets #root only, so this widget (in #a11y-root) stays unaffected
  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  // Reduce motion — CSS handles CSS animations; custom event lets App.tsx update MotionConfig
  useEffect(() => {
    document.body.classList.toggle('reduce-motion', reduceMotion);
    window.dispatchEvent(
      new CustomEvent('a11y:reduceMotion', { detail: reduceMotion }),
    );
  }, [reduceMotion]);

  // Language — redirect through Google Translate (no API key required)
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (lang === 'en') {
      // If inside a translate.google.com frame, navigate the top frame back to plain URL
      if (window.top && window.top !== window) {
        try { window.top.location.href = window.location.href; } catch { /* cross-origin */ }
      }
      return;
    }
    const gtLang = GT_LANG[lang] ?? lang;
    window.location.href =
      `https://translate.google.com/translate?sl=en&tl=${gtLang}&u=${encodeURIComponent(window.location.href)}`;
  };

  // Render into #a11y-root (outside #root) so the high-contrast filter on #root
  // never covers or distorts the accessibility widget.
  const portalRoot = document.getElementById('a11y-root');
  if (!portalRoot) return null;

  return createPortal(
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col-reverse items-start gap-4">
      {/* Toggle button — always visible, even in high-contrast mode */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setIsOpen(o => !o)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-transform hover:scale-105"
          data-testid="button-accessibility-toggle"
          aria-label={isOpen ? 'Close accessibility options' : 'Open accessibility options'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
        </Button>
        {!isOpen && (
          <span className="hidden md:block bg-white text-primary px-3 py-1.5 rounded-full shadow-md text-sm font-semibold pointer-events-none select-none">
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
            transition={{ duration: 0.18 }}
            className="w-[280px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border"
            data-testid="panel-accessibility"
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                <span className="font-semibold text-sm">Accessibility Options</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Close accessibility panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-6">
              {/* Text Size */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Text Size</p>
                <div className="flex bg-muted/50 rounded-lg p-1 border border-border">
                  {(['sm', 'base', 'lg'] as const).map(size => (
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
                      {size === 'sm' ? 'A−' : size === 'base' ? 'A' : 'A+'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-foreground">Display</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">High Contrast</span>
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
                <p className="text-sm font-semibold text-foreground">Language</p>
                <Select value={language} onValueChange={handleLanguageChange} data-testid="select-language">
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
                <p className="text-xs text-muted-foreground">
                  Selecting a language opens the page via Google Translate.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-muted/30 border-t border-border/50 text-center">
              <a href="#main-content" className="text-xs text-accent hover:underline font-medium">
                Accessibility Statement
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    portalRoot,
  );
}
