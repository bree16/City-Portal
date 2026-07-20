import { motion } from 'framer-motion';
import { Gamepad2, Home, TrendingUp, Key, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const HIGHLIGHTS = [
  {
    icon: TrendingUp,
    title: 'Build Your Finances',
    desc: 'Pick a career, save money, and grow your credit score through everyday choices.',
  },
  {
    icon: Home,
    title: 'Tour & Negotiate',
    desc: 'Explore neighborhoods, tour homes, and negotiate an offer like a real buyer.',
  },
  {
    icon: Key,
    title: 'Close the Deal',
    desc: 'Work with a counselor and lender, sign the paperwork, and get your keys.',
  },
];

export default function SimulatorPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary text-white pt-28 pb-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
              <Gamepad2 className="w-4 h-4" />
              Path to Your First Home
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learn Homebuying by <span className="text-accent">Playing It</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Step into a virtual Newport News and experience the full journey to homeownership —
              from your first paycheck to closing day. Free to play, right in your browser.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Game embed */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 -mt-2 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-black aspect-video relative -mt-6"
        >
          <iframe
            src="/3d-game/"
            title="Path to Your First Home simulator"
            className="w-full h-full"
            allow="autoplay; fullscreen"
          />
        </motion.div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <p className="text-sm text-muted-foreground">
            Tip: click inside the game to start. Best experienced with sound on.
          </p>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href="/3d-game/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Open Full Screen
            </a>
          </Button>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-border p-6 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <h.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{h.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Ready to do it for real? Our free counselors will guide you every step of the way.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-accent hover:bg-accent/90 text-white">
              <Link href="/buy">Start Your Real Journey</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Talk to a Counselor</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
