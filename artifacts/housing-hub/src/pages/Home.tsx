import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { CountUp } from '@/components/ui/CountUp';
import { TiltCard } from '@/components/ui/TiltCard';
import { AnimatedSection, StaggerSection, StaggerItem } from '@/components/ui/AnimatedSection';
import { 
  Home, Building2, Calculator, MapPin, 
  GraduationCap, HandHeart, ArrowRight, Star,
  MapPin as MapPinIcon, Users, DollarSign, Percent, Banknote, Search, Trash2, Gamepad2, TrendingUp, Brush, Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { NewsEventsSlideshow } from '@/components/NewsEventsSlideshow';
import heroIllustration from '@assets/generated_images/hero_illustration.png';
import hiltonImage from '@assets/stock_images/hood_hilton.jpg';
import denbighImage from '@assets/stock_images/hood_denbigh.jpg';
import oysterImage from '@assets/stock_images/hood_oyster_point.jpg';
import southeastImage from '@assets/stock_images/hood_southeast.jpg';
import lifestyleNewHomeowners from '@assets/generated_images/lifestyle_new_homeowners.jpg';
import lifestyleMilitaryFamily from '@assets/generated_images/lifestyle_military_family.jpg';
import lifestyleCommunityFestival from '@assets/generated_images/lifestyle_community_festival.jpg';
import lifestyleWaterfrontDog from '@assets/generated_images/lifestyle_waterfront_dog.jpg';
import lifestyleCoffeeShop from '@assets/generated_images/lifestyle_coffee_shop.jpg';

export default function HomePage() {
  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();
  
  const handleSearch = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('rent') || q.includes('rental')) setLocation('/rent');
    else if (q.includes('buy') || q.includes('first-time') || q.includes('homebuyer') || q.includes('grant') || q.includes('down payment')) setLocation('/buy');
    else if (q.includes('counselor') || q.includes('contact')) setLocation('/contact');
    else if (q.includes('emergency')) setLocation('/assistance');
    else if (q.includes('neighbor')) setLocation('/neighborhoods');
    else if (q.includes('repair') || q.includes('journey')) setLocation('/journey');
    else setLocation('/resources');
  };

  // Calculator States
  const [calcTab, setCalcTab] = useState("buy");
  const [income, setIncome] = useState([5500]);
  const [homePrice, setHomePrice] = useState([220000]);
  const [interestRate, setInterestRate] = useState([6.8]);
  const [downPayment, setDownPayment] = useState([10]);
  const [taxes, setTaxes] = useState([200]);
  const [insurance, setInsurance] = useState([100]);
  const [hoa, setHoa] = useState([0]);
  const [monthlyRent, setMonthlyRent] = useState([1500]);

  // Buy Math
  const dpAmount = homePrice[0] * (downPayment[0] / 100);
  const loanAmount = homePrice[0] - dpAmount;
  const rateMonth = (interestRate[0] / 100) / 12;
  const numPayments = 30 * 12;
  const monthlyPi = loanAmount > 0 && rateMonth > 0 
    ? (loanAmount * rateMonth * Math.pow(1 + rateMonth, numPayments)) / (Math.pow(1 + rateMonth, numPayments) - 1) 
    : 0;
  
  const totalMonthly = monthlyPi + taxes[0] + insurance[0] + hoa[0];
  const dti = (totalMonthly / income[0]) * 100;
  
  // DTI logic
  let dtiColor = "bg-green-100 text-green-800 border-green-200";
  let verdict = "You appear ready to buy";
  if (dti > 43) {
    dtiColor = "bg-red-100 text-red-800 border-red-200";
    verdict = "Consider rental options";
  } else if (dti > 36) {
    dtiColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
    verdict = "You may qualify with assistance";
  }

  // 5 Year Comparison Math
  const fiveYearRent = monthlyRent[0] * 60;
  const fiveYearBuyCosts = (taxes[0] + insurance[0] + (monthlyPi * 0.8)) * 60; // rough est of unrecoverable costs

  return (
    <div className="flex flex-col w-full">
      <ScrollProgress />
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0B2146] to-accent/80 z-0"></div>
        {/* Animated gradient shimmer layer */}
        <div className="absolute inset-0 z-0 opacity-30" style={{
          background: 'linear-gradient(120deg, #14B8A6 0%, #D4AF37 33%, #1E3A5F 66%, #14B8A6 100%)',
          backgroundSize: '300% 300%',
          animation: 'gradient-shift 8s ease infinite',
        }} />
        {/* Floating ambient orbs */}
        <div className="absolute top-12 right-16 w-[420px] h-[420px] bg-[#14B8A6] rounded-full blur-[140px] opacity-[0.18] pointer-events-none orb-1" />
        <div className="absolute bottom-16 left-8  w-[340px] h-[340px] bg-[#D4AF37] rounded-full blur-[120px] opacity-[0.14] pointer-events-none orb-2" />
        <div className="absolute top-1/2 right-[38%] w-[260px] h-[260px] bg-[#FF007F] rounded-full blur-[100px] opacity-[0.10] pointer-events-none" style={{ animation: 'orb-drift-2 22s ease-in-out infinite' }} />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                City of Newport News
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                {['Find', 'Your'].map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block mr-4"
                  >
                    {word}
                  </motion.span>
                ))}
                <br className="hidden md:block"/>
                <motion.span
                  initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F9D47D]"
                >
                  Path Home
                </motion.span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Explore affordable housing, homeownership programs, neighborhood resources, and personalized tools—all in one place.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button asChild size="lg" className="glow-btn w-full sm:w-auto bg-accent hover:bg-accent/90 text-white rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-accent/20 transition-transform hover:-translate-y-1">
                  <Link href="/buy">Get Started</Link>
                </Button>
                <Button asChild size="lg" className="glow-btn w-full sm:w-auto bg-[#ff007f] hover:bg-[#ff007f]/90 text-white rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-[#ff007f]/20 transition-transform hover:-translate-y-1 group">
                  <Link href="/simulator">
                    <Gamepad2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Play the Simulator
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full max-w-lg lg:max-w-xl mx-auto relative hidden md:block"
            >
              <div className="relative aspect-square w-full">
                <img 
                  src={heroIllustration} 
                  alt="Newport News City Skyline Illustration" 
                  className="w-full h-full object-contain filter drop-shadow-2xl living-photo-3"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white [clip-path:polygon(0_100%,100%_100%,100%_100%,0_0)] md:[clip-path:polygon(0_100%,100%_100%,100%_0,0_100%)] z-10"></div>
      </section>

      {/* Smart Search Section */}
      <section className="py-10 bg-white border-b border-border/30 z-20 relative">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="relative flex items-center bg-white rounded-full shadow-lg border border-border/40 px-4 py-3 gap-3">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="What are you looking for? Try 'rental assistance' or 'buy a home'"
              className="flex-1 outline-none text-sm bg-transparent text-foreground placeholder:text-muted-foreground"
              data-testid="input-smart-search"
            />
            <button onClick={() => handleSearch(searchQuery)} className="bg-accent text-white rounded-full px-4 py-1.5 text-sm font-medium hover:bg-accent/90 transition-colors" data-testid="button-search-submit">
              Search
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {['Rental Assistance','First-Time Buyer','Housing Counselor','Emergency Housing','Grants','Home Repairs'].map(chip => (
              <button key={chip} onClick={() => { setSearchQuery(chip); handleSearch(chip); }}
                className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors border border-accent/20"
                data-testid={`chip-${chip.toLowerCase().replace(/ /g,'-')}`}>
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Quick Action Cards */}
      <section id="programs" className="py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16" variant="fadeUp">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Your Newport News. Your Future.</h2>
            <div className="h-1 w-16 bg-accent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Whether you're planting roots, looking for your next home, or need a helping hand — Newport News has resources built around you.</p>
          </AnimatedSection>
          
          <StaggerSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" speed="normal">
            {[
              { icon: Home, title: "Buy a Home", desc: "Find listings, financing, and homebuyer programs", href: "/buy" },
              { icon: Building2, title: "Find Rental Resources", desc: "Browse affordable rentals and subsidized housing", href: "/rent" },
              { icon: Calculator, title: "Can I Afford It?", desc: "Use our affordability calculator to plan your budget", href: "#calculator" },
              { icon: MapPin, title: "Explore Neighborhoods", desc: "Discover communities that match your lifestyle", href: "/neighborhoods" },
              { icon: GraduationCap, title: "First-Time Buyer Programs", desc: "Special grants and loan assistance for first-timers", href: "/resources" },
              { icon: HandHeart, title: "Housing Assistance", desc: "Emergency help, vouchers, and support programs", href: "/resources" }
            ].map((card) => (
              <StaggerItem key={card.title} variant="fadeUp">
                <TiltCard intensity={6}>
                  <Link href={card.href} className="block group h-full">
                    <Card className="h-full border-transparent border-l-4 border-l-accent shadow-sm hover:shadow-2xl bg-white overflow-hidden relative gradient-border-hover shine-on-hover">
                      <CardContent className="p-8 flex flex-col h-full">
                        <motion.div
                          className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mb-6 text-accent"
                          whileHover={{ scale: 1.15, rotate: 6 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <card.icon className="w-7 h-7" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-primary mb-3">{card.title}</h3>
                        <p className="text-muted-foreground mb-6 flex-1">{card.desc}</p>
                        <div className="flex items-center text-accent font-medium text-sm mt-auto group-hover:gap-2 transition-all">
                          Explore <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerSection>
        </div>
      </section>

      {/* NEW: Simulator Featured Section */}
      <section className="py-24 bg-[#0a0a0e] relative overflow-hidden text-white">
        {/* Decorative ambient gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] bg-[#ff007f] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[50%] bg-[#00f0ff] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a24] border border-[#ff007f]/30 text-[#ffea00] text-sm font-bold tracking-wide uppercase">
                <Gamepad2 className="w-4 h-4" />
                Interactive Experience
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Learn Homeownership <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] to-[#ffea00]">Through Play</span>
              </h2>
              <p className="text-lg text-white/80 leading-relaxed max-w-xl">
                Buying your first home can feel overwhelming. Our interactive simulator breaks the process into simple, engaging steps that help you understand budgeting, credit, mortgages, closing, and homeownership before making real-world decisions.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 pt-4">
                {[
                  { icon: Calculator, label: "Learn to Budget" },
                  { icon: TrendingUp, label: "Improve Your Credit" },
                  { icon: Building2, label: "Tour Homes" },
                  { icon: Banknote, label: "Understand Mortgages" },
                  { icon: Key, label: "Experience Closing Day" },
                  { icon: Brush, label: "Decorate Your First Home" },
                ].map((item, idx) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 text-sm font-medium hover:text-[#00f0ff] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#ffea00]">
                      <item.icon className="w-4 h-4" />
                    </div>
                    {item.label}
                  </motion.div>
                ))}
              </div>

              <div className="pt-6">
                <Button asChild size="lg" className="w-full sm:w-auto bg-[#ff007f] hover:bg-[#ff007f]/90 text-white rounded-full px-8 h-14 text-base font-bold shadow-[0_0_20px_rgba(255,0,127,0.3)] transition-transform hover:-translate-y-1">
                  <Link href="/simulator">Play the Simulator Free</Link>
                </Button>
              </div>
            </div>

            {/* Right: Stylized Preview Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-lg mx-auto"
            >
              {/* Back panel */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-0 w-[80%] aspect-video bg-[#110e15] rounded-xl border-2 border-[#00f0ff] shadow-[8px_8px_0px_#00f0ff] overflow-hidden"
              >
                <div className="h-6 bg-[#00f0ff]/10 border-b border-[#00f0ff] flex items-center px-3 gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#00f0ff]/40"></div>
                  <div className="w-2 h-2 rounded-full bg-[#00f0ff]/40"></div>
                  <div className="w-2 h-2 rounded-full bg-[#00f0ff]/40"></div>
                </div>
                <div className="p-4 flex flex-col gap-3 h-full">
                  <div className="w-1/2 h-4 bg-[#00f0ff]/20 rounded"></div>
                  <div className="w-3/4 h-4 bg-[#00f0ff]/20 rounded"></div>
                  <div className="mt-auto flex justify-between">
                    <div className="w-12 h-12 bg-[#00f0ff]/20 rounded-lg"></div>
                    <div className="w-12 h-12 bg-[#00f0ff]/20 rounded-lg"></div>
                  </div>
                </div>
              </motion.div>

              {/* Front panel */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-0 w-[85%] aspect-video bg-[#110e15] rounded-xl border-2 border-[#ff007f] shadow-[-8px_8px_0px_#ff007f] overflow-hidden z-10"
              >
                <div className="h-6 bg-[#ff007f]/10 border-b border-[#ff007f] flex items-center px-3 gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ff007f]/40"></div>
                  <div className="w-2 h-2 rounded-full bg-[#ff007f]/40"></div>
                  <div className="w-2 h-2 rounded-full bg-[#ff007f]/40"></div>
                </div>
                <div className="p-5 flex items-center gap-4 h-full relative">
                  <div className="w-16 h-20 bg-[#ffea00] rounded border-2 border-black absolute right-6 bottom-4 rotate-12 flex items-center justify-center">
                    <Star className="text-black w-8 h-8" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="w-full h-8 bg-[#ff007f]/20 rounded border border-[#ff007f]/30"></div>
                    <div className="w-2/3 h-8 bg-[#ff007f]/20 rounded border border-[#ff007f]/30"></div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating badge */}
              <motion.div 
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] left-[5%] z-20 bg-[#ffea00] text-black font-extrabold px-4 py-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rotate-[-6deg]"
              >
                LEVEL UP!
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Life in Newport News — Cinematic Mosaic */}
      <section className="relative bg-[#060d1a] overflow-hidden py-24">
        {/* Ambient glows */}
        <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-accent rounded-full blur-[180px] opacity-[0.12] pointer-events-none" />
        <div className="absolute bottom-0 right-[-5%] w-[400px] h-[400px] bg-secondary rounded-full blur-[150px] opacity-[0.10] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-widest text-white/70 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Newport News, Virginia
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.05]">
                Life in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-[#00C2D4]">Newport News</span>
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/50 text-lg max-w-sm leading-relaxed lg:text-right"
            >
              A waterfront city where military families, young professionals, and lifelong residents all call home.
            </motion.p>
          </div>

          {/* Mosaic grid */}
          <div className="grid grid-cols-12 gap-4" style={{ gridTemplateRows: '300px 280px' }}>
            {/* Large left — waterfront */}
            <motion.a
              href="/neighborhoods"
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="col-span-12 md:col-span-7 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer"
            >
              <img src={lifestyleWaterfrontDog} alt="Waterfront Newport News" className="w-full h-full object-cover living-photo-5" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              {/* Animated accent line */}
              <motion.div className="absolute left-8 bottom-28 h-0.5 bg-secondary" initial={{ width: 0 }} whileInView={{ width: 48 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }} />
              <div className="absolute bottom-8 left-8 right-8">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Waterfront City</span>
                <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">Where the James River Meets Home</h3>
                <p className="text-white/65 text-sm">Walk the boardwalk, kayak at sunrise, or dine on the water — Newport News' waterfront is always steps away.</p>
              </div>
              {/* Hover arrow */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </motion.a>

            {/* Top right — homeowners */}
            <motion.a
              href="/buy"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="col-span-12 md:col-span-5 relative rounded-3xl overflow-hidden group cursor-pointer"
            >
              <img src={lifestyleNewHomeowners} alt="First-time homeowners" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 living-photo" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/70 to-accent/40" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold mb-2 w-fit">
                  <Home className="w-3 h-3" /> First-Time Buyers
                </div>
                <div className="text-xl font-bold text-white">Young families planting roots</div>
                <p className="text-white/65 text-sm mt-1">Up to $25K in down payment assistance available →</p>
              </div>
            </motion.a>

            {/* Bottom right — 2 side-by-side */}
            <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-4">
              {[
                { img: lifestyleMilitaryFamily, label: 'Military Families', sub: 'Dedicated programs', href: '/resources', badge: '🎖️' },
                { img: lifestyleCoffeeShop, label: 'Neighborhood Life', sub: 'Local spots & culture', href: '/neighborhoods', badge: '☕' },
              ].map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 living-photo-2" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-lg mb-0.5">{item.badge}</div>
                    <div className="text-white font-bold text-sm leading-tight">{item.label}</div>
                    <div className="text-white/55 text-xs">{item.sub}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Newport News vitals strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden"
          >
            {[
              { value: '~180K', label: 'Residents', sub: 'And growing' },
              { value: '$235K', label: 'Median Home Price', sub: 'Below VA average' },
              { value: '35mi', label: 'of Waterfront', sub: 'James River & Bay' },
              { value: 'Top 10', label: 'Military City', sub: 'USA, Military Times' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.04] px-6 py-5 text-center hover:bg-white/[0.08] transition-colors">
                <div className="text-2xl font-extrabold text-white mb-0.5">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-white/50">{stat.label}</div>
                <div className="text-xs text-white/35 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:24px_24px]"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="container relative z-10 mx-auto px-4">
          <StaggerSection className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10" speed="fast">
            {[
              { end: 2400, prefix: '', suffix: '+', label: "Families Assisted" },
              { end: 18,   prefix: '\u0024', suffix: 'M', label: "Housing Aid Distributed" },
              { end: 340,  prefix: '',  suffix: '',  label: "Affordable Units Available" },
              { end: 92,   prefix: '',  suffix: '%', label: "Satisfaction Rating" },
            ].map((stat, i) => (
              <StaggerItem key={i} variant="scaleIn">
                <div className="text-center px-4">
                  <div className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    <CountUp end={stat.end} prefix={stat.prefix} suffix={stat.suffix} duration={2} />
                  </div>
                  <motion.div
                    className="w-8 h-1 bg-secondary mx-auto mb-3 rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.12 }}
                  />
                  <div className="text-white/80 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerSection>
        </motion.div>
      </section>

      {/* 3. Affordability Calculator */}
      <section id="calculator" className="py-24 bg-gradient-to-br from-[#f0f4ff] via-white to-muted/60 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-sm font-semibold text-primary mb-4">
              <Calculator className="w-4 h-4" aria-hidden="true" /> Affordability Calculator
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
              What Can You <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary/80">Actually Afford?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Plug in your numbers. See your real monthly payment, DTI, and which Newport News assistance programs match your situation.
            </p>
          </div>

          <Card className="shadow-2xl border-border/50 bg-white overflow-hidden">
            <Tabs value={calcTab} onValueChange={setCalcTab} className="w-full">
              <div className="flex border-b border-border bg-muted/30">
                <TabsList className="w-full h-16 bg-transparent p-0 rounded-none border-none grid grid-cols-2 gap-0">
                  <TabsTrigger 
                    value="buy" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-white text-base font-bold"
                  >
                    Buying Power
                  </TabsTrigger>
                  <TabsTrigger 
                    value="compare" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-white text-base font-bold"
                  >
                    Rent vs. Buy
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Buying Power Tab */}
              <TabsContent value="buy" className="p-0 m-0">
                <div className="grid lg:grid-cols-5 gap-0">
                  {/* Inputs */}
                  <div className="lg:col-span-3 p-8 lg:p-10 space-y-8">
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-foreground">Monthly Gross Income</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            value={income[0]} 
                            onChange={(e) => setIncome([Number(e.target.value)])}
                            className="w-32 pl-8 font-bold text-primary bg-muted/50 border-none" 
                          />
                        </div>
                      </div>
                      <Slider value={income} onValueChange={setIncome} max={20000} min={1000} step={100} />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-foreground">Target Home Price</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            value={homePrice[0]} 
                            onChange={(e) => setHomePrice([Number(e.target.value)])}
                            className="w-32 pl-8 font-bold text-primary bg-muted/50 border-none" 
                          />
                        </div>
                      </div>
                      <Slider value={homePrice} onValueChange={setHomePrice} max={600000} min={50000} step={1000} />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-foreground">Down Payment</label>
                          <div className="relative">
                            <Input 
                              type="number" 
                              value={downPayment[0]} 
                              onChange={(e) => setDownPayment([Number(e.target.value)])}
                              className="w-20 pr-8 font-bold text-primary bg-muted/50 border-none text-right" 
                            />
                            <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                        <Slider value={downPayment} onValueChange={setDownPayment} max={30} min={0} step={1} />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-foreground">Interest Rate</label>
                          <div className="relative">
                            <Input 
                              type="number" 
                              value={interestRate[0]} 
                              onChange={(e) => setInterestRate([Number(e.target.value)])}
                              className="w-20 pr-8 font-bold text-primary bg-muted/50 border-none text-right" 
                            />
                            <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                        <Slider value={interestRate} onValueChange={setInterestRate} max={10} min={3} step={0.1} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Monthly Taxes</label>
                        <Input type="number" value={taxes[0]} onChange={e => setTaxes([Number(e.target.value)])} className="bg-muted/50 border-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Monthly Insurance</label>
                        <Input type="number" value={insurance[0]} onChange={e => setInsurance([Number(e.target.value)])} className="bg-muted/50 border-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Monthly HOA Fees</label>
                        <Input type="number" value={hoa[0]} onChange={e => setHoa([Number(e.target.value)])} className="bg-muted/50 border-none" />
                      </div>
                    </div>

                  </div>

                  {/* Results Panel */}
                  <div className="lg:col-span-2 bg-primary text-white p-8 lg:p-10 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-white/80 mb-6">Estimated Breakdown</h3>
                    
                    <div className="mb-8">
                      <p className="text-sm font-medium text-secondary mb-1 uppercase tracking-wider">Est. Monthly Payment</p>
                      <div className="text-5xl font-extrabold mb-2">${Math.round(totalMonthly).toLocaleString()}</div>
                      <p className="text-sm text-white/60">P&I + Taxes + Insurance + HOA</p>
                    </div>

                    <div className="space-y-4 border-t border-white/10 pt-6 mb-8">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Down Payment Amount</span>
                        <span className="font-bold">${Math.round(dpAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Debt-to-Income (DTI)</span>
                        <span className="font-bold">{dti.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border ${dtiColor} mb-8`}>
                      <div className="font-bold mb-1">{verdict}</div>
                      <div className="text-sm opacity-90">Based on standard lending rules.</div>
                    </div>

                    {(dti > 36 || income[0] < 4000) && (
                      <div className="space-y-3 mb-8">
                        <p className="text-xs font-bold uppercase tracking-wider text-secondary">Suggested Programs</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">Down Payment Assistance</Badge>
                          <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">First-Time Buyer Grants</Badge>
                        </div>
                      </div>
                    )}

                    <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 mt-auto">
                      <Link href="/contact">Talk to a Counselor</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Compare Tab */}
              <TabsContent value="compare" className="p-0 m-0">
                <div className="p-8 lg:p-12 text-center">
                  <div className="max-w-md mx-auto mb-10 space-y-4">
                    <label className="text-lg font-bold text-foreground">Current Monthly Rent</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        type="number" 
                        value={monthlyRent[0]} 
                        onChange={(e) => setMonthlyRent([Number(e.target.value)])}
                        className="h-14 pl-12 font-bold text-xl text-primary bg-muted/50 border-none" 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="p-8 rounded-2xl bg-muted/50 border border-border">
                      <h4 className="text-lg font-bold text-primary mb-2">5-Year Cost of Renting</h4>
                      <div className="text-4xl font-extrabold text-accent mb-4">${fiveYearRent.toLocaleString()}</div>
                      <p className="text-sm text-muted-foreground">This is money you will never see again.</p>
                    </div>
                    
                    <div className="p-8 rounded-2xl bg-primary text-white border border-primary">
                      <h4 className="text-lg font-bold mb-2">5-Year Cost of Buying</h4>
                      <div className="text-4xl font-extrabold text-secondary mb-4">${Math.round(fiveYearBuyCosts).toLocaleString()}</div>
                      <p className="text-sm text-white/80">Estimated unrecoverable costs (taxes, insurance, interest).</p>
                    </div>
                  </div>
                  
                  <p className="mt-8 text-muted-foreground font-medium">
                    {fiveYearBuyCosts < fiveYearRent 
                      ? "Buying looks more favorable over 5 years based on these estimates." 
                      : "Renting might be cheaper in the short term, but buying builds equity over time."}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </section>

      {/* 4. Neighborhood Highlights */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBhMjU0MDA4IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-60 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <AnimatedSection className="max-w-2xl" variant="slideLeft">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                <MapPin className="w-3.5 h-3.5" /> Six Neighborhoods
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-2 tracking-tight">Find Your <span className="text-accent">Neighborhood</span></h2>
              <div className="h-1 w-14 bg-gradient-to-r from-accent to-primary/40 rounded-full mb-4" />
              <p className="text-muted-foreground text-lg">From historic Hilton Village to master-planned Kiln Creek — every community has its own personality.</p>
            </AnimatedSection>
            <AnimatedSection variant="slideRight">
              <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-white px-6 gap-2 group h-11">
                <Link href="/neighborhoods">
                  Explore all neighborhoods <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </AnimatedSection>
          </div>

          <StaggerSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" speed="normal">
            {[
              { name: "Hilton Village", img: hiltonImage, desc: "Historic charm, walkable streets, and artisan shops.", price: "$320k", vibe: "🎨 Historic", walkScore: 8 },
              { name: "Denbigh", img: denbighImage, desc: "Spacious lots, great parks, and suburban feel.", price: "$285k", vibe: "🌳 Suburban", walkScore: 5 },
              { name: "Oyster Point", img: oysterImage, desc: "Modern condos, bustling commerce, and dining.", price: "$350k", vibe: "🏙️ Modern", walkScore: 7 },
              { name: "Southeast", img: southeastImage, desc: "Rich heritage, waterfront views, and community focus.", price: "$210k", vibe: "💧 Waterfront", walkScore: 6 }
            ].map((hood) => (
              <StaggerItem key={hood.name} variant="scaleGentle">
                <Link href="/neighborhoods" className="block group h-full">
                  <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-lg group-hover:shadow-2xl transition-all duration-500">
                    <img src={hood.img} alt={hood.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 living-photo-4" />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                    {/* Vibe tag top */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-2.5 py-1 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold rounded-full">{hood.vibe}</span>
                    </div>
                    {/* Content bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      {/* Avg price badge */}
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-secondary text-primary text-xs font-extrabold rounded-md mb-3">
                        <DollarSign className="w-3 h-3" />Avg {hood.price}
                      </div>
                      <h3 className="text-xl font-extrabold mb-1.5 leading-tight">{hood.name}</h3>
                      <p className="text-white/70 text-xs leading-relaxed line-clamp-2 mb-3">{hood.desc}</p>
                      {/* Walk score bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">Walkability</span>
                        <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-secondary rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${hood.walkScore * 10}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          />
                        </div>
                        <span className="text-xs font-bold text-secondary">{hood.walkScore}/10</span>
                      </div>
                    </div>
                    {/* Arrow hover */}
                    <motion.div
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 border border-white/25 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                    >
                      <ArrowRight className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerSection>

          {/* Match prompt */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10"
          >
            <div className="text-center sm:text-left">
              <div className="font-bold text-primary">Not sure which neighborhood fits you?</div>
              <div className="text-sm text-muted-foreground">Our interactive map shows schools, prices, and walkability side-by-side.</div>
            </div>
            <Button asChild className="shrink-0 rounded-full bg-accent hover:bg-accent/90 text-white gap-2 h-10 px-5">
              <Link href="/neighborhoods">
                Open the Map <MapPin className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* News & Events slideshow */}
      <NewsEventsSlideshow />

      {/* 5. Resident Services Teaser */}
      <section className="py-24 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <AnimatedSection className="max-w-2xl" variant="slideLeft">
              <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-none mb-4 px-4 py-1">Resident Services Hub</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">Everything You Need After Moving In</h2>
              <div className="h-1 w-14 bg-accent rounded-full mb-4" />
              <p className="text-muted-foreground text-lg">Everything you need to live, work, and thrive in Newport News—all in one place.</p>
            </AnimatedSection>
            <AnimatedSection variant="slideRight">
              <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full px-6 h-12">
                <Link href="/services">
                  Explore All Services <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </AnimatedSection>
          </div>

          <StaggerSection className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6" speed="fast">
            {[
              { icon: Banknote, title: "Pay Utility Bill", desc: "Quick and easy online payments." },
              { icon: Trash2, title: "Trash & Recycling", desc: "Find your collection day." },
              { icon: MapPinIcon, title: "Report an Issue", desc: "Help us keep our city beautiful." },
              { icon: Users, title: "Community Events", desc: "Discover what's happening." }
            ].map((service) => (
              <StaggerItem key={service.title} variant="flipUp">
                <Link href="/services" className="block group h-full">
                  <Card className="h-full border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:border-accent/30 bg-white card-lift">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <motion.div
                        className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mb-4 text-accent"
                        whileHover={{ scale: 1.2, rotate: -8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      >
                        <service.icon className="w-6 h-6" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-primary mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerSection>
        </div>
      </section>

      {/* Final CTA — with lifestyle photo background */}
      <section className="relative py-28 text-white text-center overflow-hidden">
        {/* Background photo */}
        <img
          src={lifestyleCommunityFestival}
          alt="Newport News community"
          className="absolute inset-0 w-full h-full object-cover living-photo"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/70 z-10" />
        {/* Teal glow spot */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_50%,_#0A8F7E_0%,_transparent_55%)] z-10 pointer-events-none" />
        <div className="container relative z-20 mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-sm font-medium mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Newport News is ready for you
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">Ready to find your<br className="hidden md:block" /> next home?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">Whether you want to buy, rent, or need assistance — our team is here to guide you every step of the way.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-full px-10 h-16 text-lg shadow-xl shadow-secondary/20 transition-transform hover:scale-105">
                <Link href="/contact">Contact Our Team</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full px-10 h-16 text-lg font-semibold bg-transparent">
                <Link href="/quiz">Take the Quiz</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
