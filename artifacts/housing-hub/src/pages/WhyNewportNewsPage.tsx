import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Home, Landmark, Scale, Key, Heart, Shield, Anchor, Zap, 
  GraduationCap, Cpu, UtensilsCrossed, Coffee, Palette, Music, 
  Calendar, ShoppingBag, MapPin, Sun, Car
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import heroImage from '@assets/generated_images/why_hero.jpg';
import parksImage from '@assets/stock_images/why_parks.jpg';
import restaurantsImage from '@assets/stock_images/why_restaurants.jpg';
import coffeeImage from '@assets/stock_images/why_coffee.jpg';
import artsImage from '@assets/stock_images/why_arts.jpg';
import entertainmentImage from '@assets/stock_images/why_entertainment.jpg';
import eventsImage from '@assets/stock_images/why_events.jpg';
import shoppingImage from '@assets/stock_images/why_shopping.jpg';
import neighborhoodsImage from '@assets/stock_images/why_neighborhoods.jpg';
import petsImage from '@assets/stock_images/why_pets.jpg';
import waterfrontImage from '@assets/stock_images/why_waterfront.jpg';
import employersImage from '@assets/stock_images/why_employers.jpg';
import schoolsImage from '@assets/stock_images/why_schools.jpg';

const commuteData = {
  'Hilton Village': [{dest:'Newport News Shipbuilding',mins:12},{dest:'Jefferson Lab',mins:18},{dest:'Riverside Hospital',mins:22},{dest:'Fort Eustis',mins:35}],
  'Denbigh': [{dest:'Newport News Shipbuilding',mins:20},{dest:'Jefferson Lab',mins:8},{dest:'Riverside Hospital',mins:15},{dest:'Fort Eustis',mins:28}],
  'Oyster Point': [{dest:'Newport News Shipbuilding',mins:25},{dest:'Jefferson Lab',mins:10},{dest:'Riverside Hospital',mins:10},{dest:'Fort Eustis',mins:30}],
  'Southeast': [{dest:'Newport News Shipbuilding',mins:10},{dest:'Jefferson Lab',mins:25},{dest:'Riverside Hospital',mins:18},{dest:'Fort Eustis',mins:40}],
};

export default function WhyNewportNewsPage() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<keyof typeof commuteData>('Hilton Village');

  const lifestyleCards = [
    { title: "Parks & Recreation", icon: Home, image: parksImage, desc: "Over 50 parks, athletic fields, and green spaces across the city.", url: "https://www.nnva.gov/1450/Parks-Recreation-Tourism" },
    { title: "Local Restaurants", icon: UtensilsCrossed, image: restaurantsImage, desc: "Diverse dining from waterfront seafood to international cuisine.", url: "https://www.yelp.com/search?find_desc=restaurants&find_loc=Newport+News%2C+VA" },
    { title: "Coffee Shops", icon: Coffee, image: coffeeImage, desc: "Independent cafes and local spots perfect for remote work and meetups.", url: "https://www.google.com/maps/search/coffee+shops+Newport+News+VA" },
    { title: "Arts & Culture", icon: Palette, image: artsImage, desc: "A growing arts scene with murals, galleries, and cultural events.", url: "https://www.nmas.org/" },
    { title: "Entertainment", icon: Music, image: entertainmentImage, desc: "Live music, venues, and year-round entertainment for every taste.", url: "https://www.visitnewportnews.com/things-to-do/entertainment/" },
    { title: "Community Events", icon: Calendar, image: eventsImage, desc: "Festivals, neighborhood gatherings, and holiday celebrations throughout the year.", url: "https://www.visitnewportnews.com/events/" },
    { title: "Shopping", icon: ShoppingBag, image: shoppingImage, desc: "From major malls to local boutiques, shopping for every need and budget.", url: "https://www.patrickhemall.com/" },
    { title: "Walkable Neighborhoods", icon: MapPin, image: neighborhoodsImage, desc: "Tree-lined streets and pedestrian-friendly communities to explore.", url: "/neighborhoods" },
    { title: "Pet-Friendly Spaces", icon: Heart, image: petsImage, desc: "Dog parks, walking trails, and pet-welcoming neighborhoods throughout the city.", url: "https://www.nnva.gov/1454/Dog-Parks" },
    { title: "Waterfront Activities", icon: Anchor, image: waterfrontImage, desc: "Kayaking, fishing, trails, and stunning views along the James River.", url: "https://www.nolandtrail.com/" },
    { title: "Major Employers", icon: Building2, image: employersImage, desc: "World-class employers across shipbuilding, healthcare, government, and tech.", url: "#employers" },
    { title: "Schools & Education", icon: GraduationCap, image: schoolsImage, desc: "Strong public schools and proximity to several colleges and universities.", url: "https://www.nnschools.org/" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero — full-bleed lifestyle photo */}
      <section className="relative pt-40 pb-32 text-white overflow-hidden min-h-[560px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Newport News Community" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/75 to-accent/50"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7}}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-sm font-medium mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Newport News, Virginia
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">Why Newport News?</h1>
            <p className="text-xl md:text-2xl text-white/85 leading-relaxed max-w-2xl mx-auto">
              More than housing — a vibrant, welcoming community where you can build your future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Life in Newport News - Lifestyle Cards */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Life in Newport News</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover what makes our city a fantastic place to live, work, and play.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lifestyleCards.map((card, i) => (
              <motion.div key={card.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay: i*0.05}} viewport={{once:true}}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="h-40 overflow-hidden relative">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg text-primary">
                    <card.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-primary mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">{card.desc}</p>
                  {card.url.startsWith('/') ? (
                    <a href={card.url} className="text-accent font-medium text-sm flex items-center gap-1 group-hover:underline">Learn More →</a>
                  ) : (
                    <a href={card.url} target="_blank" rel="noopener noreferrer" className="text-accent font-medium text-sm flex items-center gap-1 group-hover:underline">Learn More →</a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Military & Veteran Resources */}
      <section className="py-20 bg-primary text-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-secondary" />
              Proudly Military-Friendly
            </h2>
            <div className="w-16 h-1 bg-yellow-400 mx-auto mt-3 mb-6 rounded-full" />
            <p className="text-lg text-white/80 max-w-3xl mx-auto">Newport News is home to thousands of active duty service members, veterans, and their families. We're here to support your housing journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="military">
            {[
              { title: "Active Duty Relocation", desc: "PCS move to the area? We can help you find housing near Fort Eustis and NWS Yorktown.", url: "https://installations.militaryonesource.mil/fort-eustis" },
              { title: "VA Home Loans", desc: "Zero down payment options for eligible veterans and active duty. Talk to a VA-approved lender.", url: "https://www.va.gov/housing-assistance/home-loans/" },
              { title: "Military Spouse Resources", desc: "Housing, employment, and community resources for military spouses navigating relocation.", url: "https://www.militaryonesource.mil/" },
              { title: "Veteran Housing Assistance", desc: "From transitional housing to homeownership programs specifically designed for veterans.", url: "https://www.va.gov/housing-assistance/" }
            ].map((card, i) => (
              <motion.div key={card.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay: i*0.1}} viewport={{once:true}}
                className="bg-white rounded-2xl p-6 text-foreground shadow-lg flex flex-col">
                <h3 className="font-bold text-xl text-primary mb-3">{card.title}</h3>
                <p className="text-muted-foreground text-sm flex-1 mb-6 leading-relaxed">{card.desc}</p>
                <Button asChild variant="outline" className="w-full border-secondary text-primary hover:bg-secondary hover:text-primary transition-colors font-semibold">
                  <a href={card.url} target="_blank" rel="noopener noreferrer">Learn More</a>
                </Button>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full text-white font-medium border border-white/20">
              <Shield className="w-5 h-5 text-secondary" />
              Call our Military Housing Line: (757) 933-2311
            </div>
          </div>
        </div>
      </section>

      {/* A Day in Newport News Timeline */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">A Day in Newport News</h2>
            <p className="text-lg text-muted-foreground">Experience a typical day exploring everything the city has to offer.</p>
          </div>

          <div className="relative border-l-2 border-accent/20 pl-8 ml-4 md:ml-0 md:pl-0 md:border-l-0">
            {/* Desktop Center Line */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-[1px] w-0.5 bg-accent/20"></div>

            <div className="space-y-12">
              {[
                { time: "7:00 AM", title: "Morning Run on Noland Trail", icon: Sun, desc: "Start your day on 14 miles of scenic waterfront trail." },
                { time: "9:00 AM", title: "Coffee at a Local Cafe", icon: Coffee, desc: "Work from a cozy neighborhood coffee shop." },
                { time: "12:00 PM", title: "Lunch at the Waterfront", icon: UtensilsCrossed, desc: "Fresh seafood and stunning James River views." },
                { time: "3:00 PM", title: "Explore the Museums", icon: Landmark, desc: "Visit the Mariners Museum or Air & Space Science Center." },
                { time: "6:00 PM", title: "Neighborhood Walk with Your Dog", icon: Heart, desc: "Pet-friendly parks and trails throughout the city." },
                { time: "8:00 PM", title: "Dinner & Live Music", icon: Music, desc: "Vibrant dining and entertainment scene downtown." },
              ].map((item, i) => (
                <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay: i*0.1}} viewport={{once:true}}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${i % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                  
                  {/* Dot */}
                  <div className="absolute left-[-41px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-accent ring-4 ring-white z-10"></div>
                  
                  <div className={`md:w-5/12 bg-muted/50 p-6 rounded-2xl border border-border/50 ${i % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary"><item.icon className="w-5 h-5" /></div>
                      <span className="font-bold text-accent text-sm tracking-wider">{item.time}</span>
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Major Employers */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Career Opportunities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Join thousands of professionals working at world-class organizations right here in the city.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Newport News Shipbuilding (HII)", icon: Anchor, ind: "Manufacturing", desc: "The largest industrial employer in Virginia employing tens of thousands.", url: "https://careers.huntingtoningalls.com/" },
              { name: "U.S. Military & Government", icon: Shield, ind: "Government", desc: "Fort Eustis, NWS Yorktown, and federal agencies provide thousands of careers.", url: "https://www.usajobs.gov/" },
              { name: "Riverside Health System", icon: Heart, ind: "Healthcare", desc: "Major regional healthcare provider with hospitals, clinics, and research facilities.", url: "https://www.riversideonline.com/careers" },
              { name: "Jefferson Lab", icon: Zap, ind: "Science & Research", desc: "DOE national lab doing cutting-edge nuclear physics research.", url: "https://www.jlab.org/human_resources/employment" },
              { name: "Newport News Public Schools", icon: GraduationCap, ind: "Education", desc: "City school system employing educators and support staff across dozens of schools.", url: "https://www.nnschools.org/careers" },
              { name: "Technology & Manufacturing", icon: Cpu, ind: "Technology", desc: "Growing tech sector and advanced manufacturing companies.", url: "https://www.governmentjobs.com/careers/newportnews" }
            ].map((emp, i) => (
              <motion.div key={emp.name} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay: i*0.05}} viewport={{once:true}}
                className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <emp.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">{emp.ind}</div>
                    <h3 className="font-bold text-primary leading-tight">{emp.name}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{emp.desc}</p>
                <Button asChild variant="outline" className="w-full text-primary border-border/50 hover:bg-muted font-medium">
                  <a href={emp.url} target="_blank" rel="noopener noreferrer">Explore Careers</a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commute Explorer */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Explore Commute Times</h2>
              <p className="text-lg text-muted-foreground mb-8">See how long it takes to get to major employers from different neighborhoods.</p>
              
              <div className="flex flex-wrap gap-3">
                {(Object.keys(commuteData) as Array<keyof typeof commuteData>).map((hood) => (
                  <button key={hood} onClick={() => setSelectedNeighborhood(hood)}
                    className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                      selectedNeighborhood === hood 
                      ? 'bg-primary text-white shadow-md scale-105' 
                      : 'bg-white border border-border text-foreground hover:border-primary/30 hover:bg-muted/50'
                    }`}>
                    {hood}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-muted/30 rounded-3xl p-8 border border-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" /> From {selectedNeighborhood}
              </h3>
              
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {commuteData[selectedNeighborhood].map((route, i) => (
                    <motion.div key={`${selectedNeighborhood}-${route.dest}`}
                      initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={{delay: i*0.05}}
                      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-border/40">
                      <div className="font-medium text-primary">{route.dest}</div>
                      <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg text-sm">
                        <Car className="w-5 h-5 text-accent" /> <span className="text-2xl font-bold text-primary">{route.mins}</span> mins
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why People Love Living Here</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "Newport News has everything — great parks, waterfront trails, amazing food, and I can afford to own a home here.", name: "Dominique H.", hood: "Denbigh", initials: "DH" },
              { text: "Moving here was the best decision. The sense of community and the outdoor spaces are incredible.", name: "Carlos M.", hood: "Hilton Village", initials: "CM" },
              { text: "I came for a job and stayed for the lifestyle. Newport News is growing fast and it feels exciting to be part of it.", name: "Priya L.", hood: "Oyster Point", initials: "PL" }
            ].map((test, i) => (
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay: i*0.1}} viewport={{once:true}}
                className="bg-white rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative text-foreground">
                <div className="text-6xl text-accent/20 font-serif leading-none mb-2 select-none">“</div>
                <p className="text-lg italic relative z-10 mb-8 pt-2 leading-relaxed">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4A843] text-primary font-bold flex items-center justify-center text-lg shadow-inner">{test.initials}</div>
                  <div>
                    <div className="font-bold text-primary">{test.name}</div>
                    <div className="text-sm text-muted-foreground">{test.hood}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
