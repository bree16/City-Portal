import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Home, Building2, Calculator, MapPin, 
  GraduationCap, HandHeart, ArrowRight, Star,
  Calendar, MapPin as MapPinIcon, Users, DollarSign, Percent, Banknote, Search, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import heroIllustration from '@assets/generated_images/hero_illustration.png';
import heroPremium from '@assets/generated_images/hero_premium.jpg';
import hiltonImage from '@assets/generated_images/hilton_village.jpg';
import denbighImage from '@assets/generated_images/denbigh.jpg';
import oysterImage from '@assets/generated_images/oyster_point.jpg';
import southeastImage from '@assets/generated_images/southeast.jpg';
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
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0B2146] to-accent/80 z-0"></div>
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
                Find Your <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F9D47D]">Path Home</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Explore affordable housing, homeownership programs, neighborhood resources, and personalized tools—all in one place.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-accent/20 transition-transform hover:-translate-y-1">
                  <Link href="/buy">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-base font-semibold bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white transition-colors">
                  <a href="#programs">Learn More</a>
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
                  className="w-full h-full object-contain filter drop-shadow-2xl"
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
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Your Newport News. Your Future.</h2>
            <p className="text-muted-foreground text-lg">Whether you're planting roots, looking for your next home, or need a helping hand — Newport News has resources built around you.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: Home, title: "Buy a Home", desc: "Find listings, financing, and homebuyer programs", href: "/buy" },
              { icon: Building2, title: "Find Rental Resources", desc: "Browse affordable rentals and subsidized housing", href: "/rent" },
              { icon: Calculator, title: "Can I Afford It?", desc: "Use our affordability calculator to plan your budget", href: "#calculator" },
              { icon: MapPin, title: "Explore Neighborhoods", desc: "Discover communities that match your lifestyle", href: "/neighborhoods" },
              { icon: GraduationCap, title: "First-Time Buyer Programs", desc: "Special grants and loan assistance for first-timers", href: "/resources" },
              { icon: HandHeart, title: "Housing Assistance", desc: "Emergency help, vouchers, and support programs", href: "/resources" }
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={card.href} className="block group h-full">
                  <Card className="h-full border-transparent border-l-4 border-l-accent shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-accent/5 transition-all duration-300 overflow-hidden group-hover:border-accent/20 bg-white">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mb-6 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                        <card.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-3">{card.title}</h3>
                      <p className="text-muted-foreground mb-6 flex-1">{card.desc}</p>
                      <div className="flex items-center text-accent font-medium text-sm mt-auto group-hover:underline">
                        Explore <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Life in Newport News — Lifestyle Photo Band */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
              Real People. Real Community.
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Life in Newport News</h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">A city where military families, first-time buyers, young professionals, and lifelong residents all call home.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {[
              { img: lifestyleNewHomeowners, caption: "First-Time Homeowners", sub: "Young families planting roots in Newport News", href: "/buy" },
              { img: lifestyleMilitaryFamily, caption: "Military Families Welcome", sub: "Dedicated programs for veterans and active duty", href: "/resources" },
              { img: lifestyleCommunityFestival, caption: "Community at the Heart", sub: "Festivals, farmers markets, and neighborhood events", href: "/neighborhoods" },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="block group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
                style={{ height: '340px' }}
              >
                <img src={item.img} alt={item.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-lg font-bold leading-snug">{item.caption}</div>
                  <div className="text-sm text-white/75 mt-1">{item.sub}</div>
                </div>
              </motion.a>
            ))}
          </div>
          {/* Second row — 2-column wider photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mt-5">
            {[
              { img: lifestyleWaterfrontDog, caption: "Waterfront Living", sub: "Walk the James River boardwalk any morning of the week" },
              { img: lifestyleCoffeeShop, caption: "Neighborhood Gems", sub: "Local coffee shops, restaurants, and boutiques on every block" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group"
                style={{ height: '260px' }}
              >
                <img src={item.img} alt={item.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-lg font-bold">{item.caption}</div>
                  <div className="text-sm text-white/75 mt-1">{item.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:24px_24px]"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {[
              { num: "2,400+", label: "Families Assisted" },
              { num: "$18M", label: "Housing Aid Distributed" },
              { num: "340", label: "Affordable Units Available" },
              { num: "92%", label: "Satisfaction Rating" }
            ].map((stat, i) => (
              <div key={i} className="text-center px-4">
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-2">{stat.num}</div>
                <div className="w-8 h-1 bg-secondary mx-auto mb-3 rounded-full"></div>
                <div className="text-white/80 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 3. Affordability Calculator */}
      <section id="calculator" className="py-24 bg-gradient-to-br from-white to-muted relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Affordability Calculator</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Plan your budget and see what housing options are within your reach in Newport News.
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
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Explore Neighborhoods</h2>
              <p className="text-muted-foreground text-lg">Discover the unique character and offerings of communities across Newport News.</p>
            </div>
            <Button asChild variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10 group">
              <Link href="/neighborhoods">
                View all neighborhoods <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Hilton Village", img: hiltonImage, desc: "Historic charm, walkable streets, and artisan shops.", price: "$320k" },
              { name: "Denbigh", img: denbighImage, desc: "Spacious lots, great parks, and suburban feel.", price: "$285k" },
              { name: "Oyster Point", img: oysterImage, desc: "Modern condos, bustling commerce, and dining.", price: "$350k" },
              { name: "Southeast", img: southeastImage, desc: "Rich heritage, waterfront views, and community focus.", price: "$210k" }
            ].map((hood, i) => (
              <motion.div
                key={hood.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href="/neighborhoods" className="block group">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md group-hover:shadow-xl transition-all duration-300">
                    <img src={hood.img} alt={hood.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="inline-block px-2.5 py-1 bg-secondary text-primary text-xs font-bold rounded-md mb-3">Avg: {hood.price}</div>
                      <h3 className="text-2xl font-bold mb-2">{hood.name}</h3>
                      <p className="text-white/80 text-sm line-clamp-2">{hood.desc}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Resident Services Teaser */}
      <section className="py-24 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-none mb-4 px-4 py-1">Resident Services Hub</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Everything You Need After Moving In</h2>
              <p className="text-muted-foreground text-lg">Everything you need to live, work, and thrive in Newport News—all in one place.</p>
            </div>
            <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full px-6 h-12">
              <Link href="/services">
                Explore All Services <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Banknote, title: "Pay Utility Bill", desc: "Quick and easy online payments." },
              { icon: Trash2, title: "Trash & Recycling", desc: "Find your collection day." },
              { icon: MapPinIcon, title: "Report an Issue", desc: "Help us keep our city beautiful." },
              { icon: Users, title: "Community Events", desc: "Discover what's happening." }
            ].map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link href="/services" className="block group h-full">
                  <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-accent/30 bg-white">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mb-4 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                        <service.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-primary mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — with lifestyle photo background */}
      <section className="relative py-28 text-white text-center overflow-hidden">
        {/* Background photo */}
        <img
          src={lifestyleCommunityFestival}
          alt="Newport News community"
          className="absolute inset-0 w-full h-full object-cover"
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
