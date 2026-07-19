import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Home, Building2, Calculator, MapPin, 
  GraduationCap, HandHeart, ArrowRight, Star,
  Calendar, MapPin as MapPinIcon, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import heroIllustration from '@assets/generated_images/hero_illustration.png';
import hiltonImage from '@assets/generated_images/hilton_village.jpg';
import denbighImage from '@assets/generated_images/denbigh.jpg';
import oysterImage from '@assets/generated_images/oyster_point.jpg';
import southeastImage from '@assets/generated_images/southeast.jpg';

export default function HomePage() {
  const [income, setIncome] = useState([6000]);
  const [downPayment, setDownPayment] = useState([20]);
  const [homePrice, setHomePrice] = useState([250000]);

  // Rough calculation
  const loanAmount = homePrice[0] * (1 - downPayment[0] / 100);
  const interestRate = 0.065;
  const monthlyRate = interestRate / 12;
  const numPayments = 30 * 12;
  const monthlyMortgage = loanAmount > 0 ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1) : 0;
  
  const taxesAndIns = 400; // estimated
  const totalMonthly = monthlyMortgage + taxesAndIns;
  const maxAffordable = income[0] * 0.28; // 28% rule

  const isAffordable = totalMonthly <= maxAffordable;

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0B2146] to-accent/80 z-0"></div>
        {/* Subtle animated pattern could go here */}
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
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-muted [clip-path:polygon(0_100%,100%_100%,100%_100%,0_0)] md:[clip-path:polygon(0_100%,100%_100%,100%_0,0_100%)]"></div>
      </section>

      {/* 2. Quick Action Cards */}
      <section id="programs" className="py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">How can we help you today?</h2>
            <p className="text-muted-foreground text-lg">Whether you're looking to buy your first home or need rental assistance, we have resources designed for you.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: Home, title: "Buy a Home", desc: "Find listings, financing, and homebuyer programs", href: "/buy" },
              { icon: Building2, title: "Find Rental Resources", desc: "Browse affordable rentals and subsidized housing", href: "/rent" },
              { icon: Calculator, title: "Can I Afford It?", desc: "Use our affordability calculator to plan your budget", href: "#calculator" },
              { icon: MapPin, title: "Explore Neighborhoods", desc: "Discover communities that match your lifestyle", href: "/neighborhoods" },
              { icon: GraduationCap, title: "First-Time Buyer Programs", desc: "Special grants and loan assistance for first-timers", href: "/assistance" },
              { icon: HandHeart, title: "Housing Assistance", desc: "Emergency help, vouchers, and support programs", href: "/assistance" }
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={card.href} className="block group h-full">
                  <Card className="h-full border-transparent shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden group-hover:border-accent/20 bg-white">
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

      {/* Stats Bar */}
      <section className="bg-primary py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:24px_24px]"></div>
        <div className="container relative z-10 mx-auto px-4">
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
        </div>
      </section>

      {/* 3. Affordability Calculator */}
      <section id="calculator" className="py-24 bg-gradient-to-br from-white to-muted relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
                <Calculator className="w-4 h-4" /> Try our tools
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Wondering if buying a home is possible?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Use our simple calculator to estimate your buying power. We take into account standard rates to give you a realistic picture of what you might afford in Newport News.
              </p>
              <ul className="space-y-4 mb-8">
                {['Compare renting vs. owning costs', 'Understand down payment impacts', 'See if you qualify for assistance grants'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                      <ArrowRight className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <span className="text-foreground/80 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="shadow-xl border-border/50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-primary mb-8 text-center border-b border-border pb-6">Affordability Estimate</h3>
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-foreground">Monthly Household Income</label>
                        <span className="font-semibold text-primary">${income[0].toLocaleString()}</span>
                      </div>
                      <Slider value={income} onValueChange={setIncome} max={20000} min={1000} step={100} className="w-full" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-foreground">Target Home Price</label>
                        <span className="font-semibold text-primary">${homePrice[0].toLocaleString()}</span>
                      </div>
                      <Slider value={homePrice} onValueChange={setHomePrice} max={600000} min={50000} step={5000} className="w-full" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-foreground">Down Payment ({downPayment[0]}%)</label>
                        <span className="font-semibold text-primary">${(homePrice[0] * downPayment[0] / 100).toLocaleString()}</span>
                      </div>
                      <Slider value={downPayment} onValueChange={setDownPayment} max={50} min={0} step={1} className="w-full" />
                    </div>

                    <div className="pt-6 border-t border-border bg-muted/50 -mx-8 -mb-8 p-8 rounded-b-xl">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <p className="text-sm text-muted-foreground font-medium mb-1">Est. Monthly Payment</p>
                          <div className="text-4xl font-extrabold text-primary">${Math.round(totalMonthly).toLocaleString()}</div>
                          <p className="text-xs text-muted-foreground mt-1">Includes est. taxes & insurance</p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 ${isAffordable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isAffordable ? 'Looks Good!' : 'Might be tight'}
                        </div>
                      </div>
                      <Button asChild className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-lg text-base">
                        <Link href="/buy">Connect with a Counselor</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
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

      {/* 5. Events */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Community Events & Workshops</h2>
            <p className="text-muted-foreground text-lg">Join us to learn more about housing opportunities, financial wellness, and community engagement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Homebuyer Workshop", date: "AUG 5", fullDate: "August 5, 2026", loc: "City Hall, Room 204", desc: "Learn the step-by-step process of buying your first home." },
              { title: "Financial Literacy Seminar", date: "AUG 12", fullDate: "August 12, 2026", loc: "Online (Zoom)", desc: "Build the financial foundation to qualify for a mortgage." },
              { title: "Neighborhood Cleanup", date: "AUG 19", fullDate: "August 19, 2026", loc: "Hilton Village Park", desc: "Join neighbors to beautify our community spaces." },
              { title: "Housing Fair", date: "SEP 3", fullDate: "September 3, 2026", loc: "Convention Center", desc: "Meet lenders, landlords, and housing counselors." }
            ].map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="flex flex-row overflow-hidden hover:shadow-lg transition-shadow border-none bg-white">
                  <div className="w-24 bg-primary text-white flex flex-col items-center justify-center p-4 text-center shrink-0">
                    <span className="text-sm font-bold text-secondary uppercase tracking-wider">{event.date.split(' ')[0]}</span>
                    <span className="text-3xl font-extrabold">{event.date.split(' ')[1]}</span>
                  </div>
                  <CardContent className="p-6 flex flex-col justify-center flex-1">
                    <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-3 font-medium">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-accent" /> {event.fullDate}</span>
                      <span className="hidden sm:inline text-border">•</span>
                      <span className="flex items-center gap-1.5"><MapPinIcon className="w-4 h-4 text-accent" /> {event.loc}</span>
                    </div>
                    <p className="text-foreground/80 text-sm">{event.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" className="rounded-full px-8 bg-transparent border-primary/20 text-primary hover:bg-primary/5">View Full Calendar</Button>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Stories from Newport News</h2>
            <p className="text-muted-foreground text-lg">Hear from real residents who have used our programs to find their home.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Marcus T.", role: "Denbigh resident", quote: "I never thought homeownership was possible at 26, but the First-Time Buyer program made it happen.", initials: "MT", color: "bg-primary" },
              { name: "Jasmine R.", role: "Southeast community", quote: "The rental assistance helped my family through a really hard time. The process was easy and the team was kind.", initials: "JR", color: "bg-accent" },
              { name: "Devon S.", role: "Oyster Point", quote: "The affordability calculator helped me realize I was closer to buying than I thought. Game changer.", initials: "DS", color: "bg-secondary" }
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <Card className="h-full border-border/50 shadow-sm bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex gap-1 mb-6 text-secondary">
                      {[...Array(5)].map((_, idx) => <Star key={idx} className="w-5 h-5 fill-current" />)}
                    </div>
                    <p className="text-foreground/90 italic text-lg leading-relaxed flex-1 mb-8">"{t.quote}"</p>
                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border">
                      <div className={`w-12 h-12 rounded-full ${t.color} text-white flex items-center justify-center font-bold text-lg shadow-inner`}>
                        {t.initials}
                      </div>
                      <div>
                        <div className="font-bold text-primary">{t.name}</div>
                        <div className="text-sm text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to find your next home?</h2>
          <p className="text-xl text-white/80 mb-10">Whether you want to buy, rent, or need assistance, we're here to help guide you.</p>
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-full px-10 h-16 text-lg shadow-xl shadow-secondary/20 transition-transform hover:scale-105">
            <Link href="/contact">Contact Our Team</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
