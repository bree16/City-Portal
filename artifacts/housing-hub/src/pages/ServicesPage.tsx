import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplet, Trash2, Bus, PawPrint, Briefcase, ShieldAlert, 
  Car, Landmark, BookOpen, HeartPulse, School, CalendarDays,
  Search, Star, Bell, Settings2, ChevronRight,
  MapPin, CheckCircle2, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Types
type Category = 'All' | 'Utilities' | 'Transportation' | 'Government' | 'Education' | 'Health' | 'Employment' | 'Community' | 'Pets' | 'Safety';

interface Service {
  id: string;
  title: string;
  description: string;
  category: Category;
  icon: React.ElementType;
  gradient: string;
  keywords: string[];
}

const CATEGORIES: Category[] = [
  'All', 'Utilities', 'Transportation', 'Government', 'Education', 
  'Health', 'Employment', 'Community', 'Pets', 'Safety'
];

const SERVICES: Service[] = [
  { id: 'water', title: 'Water & Utilities', description: 'Start, stop, or manage your utility services.', category: 'Utilities', icon: Droplet, gradient: 'from-blue-500 to-cyan-400', keywords: ['water bill', 'pay utility bill', 'sewer', 'electric'] },
  { id: 'trash', title: 'Trash & Recycling', description: 'Collection schedules, recycling information, and bulk pickup.', category: 'Utilities', icon: Trash2, gradient: 'from-emerald-500 to-teal-400', keywords: ['trash schedule', 'find my trash day', 'garbage', 'pickup', 'recycling'] },
  { id: 'transit', title: 'Public Transportation', description: 'Bus routes, transit schedules, park-and-ride locations, and resources.', category: 'Transportation', icon: Bus, gradient: 'from-indigo-500 to-blue-400', keywords: ['bus routes', 'find transit', 'park and ride'] },
  { id: 'pets', title: 'Pet Services', description: 'Pet licensing, dog parks, animal shelter information, and adoption.', category: 'Pets', icon: PawPrint, gradient: 'from-orange-400 to-amber-300', keywords: ['pet license', 'register a pet', 'dog', 'adoption'] },
  { id: 'jobs', title: 'Jobs & Careers', description: 'City jobs, major employers, hiring events, internships, and opportunities.', category: 'Employment', icon: Briefcase, gradient: 'from-slate-600 to-slate-400', keywords: ['jobs', 'apply for city jobs', 'careers'] },
  { id: 'safety', title: 'Public Safety', description: 'Emergency resources, police services, fire department, and neighborhood safety.', category: 'Safety', icon: ShieldAlert, gradient: 'from-red-500 to-rose-400', keywords: ['police', 'emergency contacts', 'fire'] },
  { id: 'dmv', title: 'Transportation & DMV', description: 'Parking, vehicle services, transportation updates, and driving resources.', category: 'Transportation', icon: Car, gradient: 'from-violet-500 to-purple-400', keywords: ['parking', 'dmv'] },
  { id: 'gov', title: 'Government Services', description: 'Taxes, permits, voting information, public records, and city departments.', category: 'Government', icon: Landmark, gradient: 'from-stone-600 to-stone-400', keywords: ['permits', 'taxes', 'voting', 'report an issue'] },
  { id: 'library', title: 'Library & Learning', description: 'Library services, educational resources, community classes, and digital learning.', category: 'Education', icon: BookOpen, gradient: 'from-fuchsia-500 to-pink-400', keywords: ['library', 'classes'] },
  { id: 'health', title: 'Health & Wellness', description: 'Hospitals, urgent care, mental health resources, clinics, and wellness services.', category: 'Health', icon: HeartPulse, gradient: 'from-rose-500 to-pink-500', keywords: ['health', 'mental health', 'hospital'] },
  { id: 'schools', title: 'Schools & Education', description: 'Schools, colleges, childcare resources, and educational opportunities.', category: 'Education', icon: School, gradient: 'from-sky-500 to-blue-500', keywords: ['schools', 'childcare', 'college'] },
  { id: 'events', title: 'Community Events', description: 'Festivals, volunteer opportunities, farmers markets, concerts, and activities.', category: 'Community', icon: CalendarDays, gradient: 'from-yellow-500 to-orange-400', keywords: ['events', 'upcoming events', 'festival'] },
];

const SUGGESTED_SEARCHES = ['Water Bill', 'Trash Schedule', 'Bus Routes', 'Jobs', 'Pet License', 'Library', 'Police', 'Events', 'Permits', 'Schools'];
const QUICK_ACTIONS = ['Pay Utility Bill', 'Report an Issue', 'Apply for City Jobs', 'Find My Trash Day', 'Register a Pet', 'Find Transit', 'Upcoming Events', 'Emergency Contacts'];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter logic
  const filteredServices = SERVICES.filter(service => {
    const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = service.title.toLowerCase().includes(lowerQuery) || 
                          service.description.toLowerCase().includes(lowerQuery) ||
                          service.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery));
    return matchesCategory && matchesSearch;
  });

  const typeaheadSuggestions = searchQuery 
    ? SUGGESTED_SEARCHES.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pt-20">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0D2B5E] to-accent/90 opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-4 py-1.5 text-sm mb-2 rounded-full">
              Resident Services Hub
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Welcome to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F9D47D]">Newport News</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Everyday city services, resources, and community connections without leaving the site.
            </p>

            {/* Search Bar */}
            <div className="mt-10 relative max-w-2xl mx-auto">
              <div className={`relative flex items-center bg-white rounded-full shadow-2xl border-4 transition-colors duration-300 ${isSearchFocused ? 'border-accent/50' : 'border-white/20'}`}>
                <Search className="w-6 h-6 text-muted-foreground ml-6 shrink-0" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="What city service are you looking for?"
                  aria-label="Search city services"
                  className="flex-1 border-none shadow-none h-16 rounded-full text-lg pl-4 pr-32 focus-visible:ring-0 text-foreground"
                  data-testid="input-service-search"
                />
                <Button className="absolute right-2 rounded-full bg-accent hover:bg-accent/90 text-white px-8 h-12 text-base font-semibold shadow-md">
                  Find
                </Button>
              </div>

              {/* Type-ahead suggestions dropdown */}
              <AnimatePresence>
                {isSearchFocused && typeaheadSuggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-border overflow-hidden z-50 text-left"
                  >
                    {typeaheadSuggestions.map((suggestion, i) => (
                      <button 
                        key={i}
                        className="w-full text-left px-6 py-4 hover:bg-muted text-foreground flex items-center gap-3 transition-colors border-b border-border/50 last:border-0"
                        onMouseDown={() => setSearchQuery(suggestion)}
                      >
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{suggestion}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Search Chips */}
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                <span className="text-sm text-white/70 py-1.5 mr-2">Suggested:</span>
                {SUGGESTED_SEARCHES.slice(0, 5).map(chip => (
                  <button 
                    key={chip} 
                    onClick={() => setSearchQuery(chip)}
                    className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/10 backdrop-blur-sm"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Pills */}
      <div className="bg-white border-b border-border shadow-sm sticky top-20 z-30">
        <div className="container mx-auto px-4 py-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 min-w-max pb-2 md:pb-0 justify-start md:justify-center">
            {QUICK_ACTIONS.map(action => (
              <button 
                key={action}
                className="whitespace-nowrap px-5 py-2.5 rounded-full bg-muted/50 hover:bg-accent/10 hover:text-accent text-foreground/80 font-medium text-sm border border-border hover:border-accent/30 transition-all shadow-sm hover:shadow"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Main Services */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-10">
            
            {/* Category Filters */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Browse by Category</h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      activeCategory === category 
                        ? 'bg-primary text-white shadow-md scale-105' 
                        : 'bg-white text-muted-foreground hover:bg-muted border border-border hover:border-primary/30'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Services Grid — 6 per row on wide desktop, 3 on tablet, 2 on mobile */}
            <div>
              <AnimatePresence mode="popLayout">
                {filteredServices.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-center py-20 bg-white rounded-3xl border border-border shadow-sm"
                  >
                    <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground">No services found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or category filter.</p>
                    <Button variant="outline" className="mt-6 rounded-full" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>
                      Clear Filters
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6"
                  >
                    {filteredServices.map((service, i) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        key={service.id}
                      >
                        <Card className="h-full border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden bg-white/70 backdrop-blur-sm relative cursor-pointer rounded-2xl flex flex-col">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
                          
                          <CardContent className="p-6 flex flex-col h-full items-center text-center relative z-10">
                            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${service.gradient} p-0.5 shadow-lg mb-5 group-hover:scale-110 transition-transform duration-500`}>
                              <div className="w-full h-full bg-white rounded-full flex items-center justify-center relative overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                                <service.icon className={`w-8 h-8 text-transparent bg-clip-text bg-gradient-to-br ${service.gradient} drop-shadow-sm group-hover:animate-pulse`} stroke="url(#gradient)" style={{ stroke: 'hsl(var(--primary))' }} />
                              </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-primary mb-2 leading-tight">{service.title}</h3>
                            <p className="text-muted-foreground text-sm flex-1 leading-relaxed">{service.description}</p>
                            
                            <div className="mt-6 flex flex-col w-full gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                              <Button className="w-full bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-xl shadow-none transition-colors border border-primary/10">
                                Learn More
                              </Button>
                              <Button variant="ghost" className="w-full text-accent hover:text-accent hover:bg-accent/10 rounded-xl flex items-center justify-center gap-1 h-9">
                                Quick Access <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </div>
                          </CardContent>
                          
                          {/* Interactive ripple effect overlay on click could be added here, currently handled via CSS or framer motion if implemented */}
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: "My Newport News" Prototype Dashboard */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-40 space-y-6">
              
              <Card className="border-border shadow-lg rounded-3xl overflow-hidden bg-white">
                <div className="h-24 bg-gradient-to-r from-primary to-accent relative">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                  <Button size="icon" variant="ghost" className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full" aria-label="Dashboard settings">
                    <Settings2 className="w-5 h-5" />
                  </Button>
                </div>
                
                <CardContent className="px-6 pb-6 pt-0 relative">
                  <div className="flex justify-center -mt-10 mb-4">
                    <div className="w-20 h-20 rounded-full bg-white p-1.5 shadow-md">
                      <div className="w-full h-full bg-muted rounded-full flex items-center justify-center text-primary font-bold text-2xl">
                        JD
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-primary">My Newport News</h3>
                    <p className="text-sm text-muted-foreground">Welcome back, John</p>
                  </div>

                  <div className="space-y-5">
                    {/* Widget 1 */}
                    <div className="bg-muted/50 rounded-2xl p-4 border border-border/50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <Droplet className="w-4 h-4 text-blue-500" /> Utility Status
                        </h4>
                        <Badge className="bg-green-100 text-green-700 border-none px-2 shadow-none font-semibold">Active</Badge>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Next bill due</p>
                          <p className="font-bold text-primary">Oct 15, 2023</p>
                        </div>
                        <Button size="sm" className="h-8 rounded-full bg-white text-primary hover:bg-muted border border-border shadow-sm">Pay $84</Button>
                      </div>
                    </div>

                    {/* Widget 2 */}
                    <div className="bg-muted/50 rounded-2xl p-4 border border-border/50">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">Next Trash Pickup</h4>
                          <p className="text-sm text-muted-foreground mt-0.5">Tomorrow morning</p>
                          <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Recycling week
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Widget 3 */}
                    <div className="bg-muted/50 rounded-2xl p-4 border border-border/50">
                      <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Favorite Services
                      </h4>
                      <div className="flex gap-2">
                        <button className="flex flex-col items-center gap-1 group flex-1">
                          <div className="w-10 h-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center group-hover:border-accent transition-colors">
                            <Library className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-[10px] font-medium text-muted-foreground text-center">Library</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 group flex-1">
                          <div className="w-10 h-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center group-hover:border-accent transition-colors">
                            <Briefcase className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-[10px] font-medium text-muted-foreground text-center">Jobs</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 group flex-1">
                          <div className="w-10 h-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center group-hover:border-accent transition-colors">
                            <ShieldAlert className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-[10px] font-medium text-muted-foreground text-center">Safety</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 group flex-1">
                          <div className="w-10 h-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center border-dashed group-hover:border-accent group-hover:bg-accent/5 transition-all text-muted-foreground">
                            +
                          </div>
                          <span className="text-[10px] font-medium text-muted-foreground text-center">Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-6 rounded-xl border-border/60 hover:bg-muted text-primary shadow-sm font-medium">
                    View Full Dashboard
                  </Button>
                </CardContent>
              </Card>

              {/* Promo Card */}
              <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-gradient-to-br from-accent to-accent/80 text-white relative">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <CardContent className="p-6">
                  <Bell className="w-8 h-8 mb-4 text-white/80" />
                  <h3 className="font-bold text-lg mb-2">City Alerts</h3>
                  <p className="text-white/80 text-sm mb-4">Sign up for emergency notifications and important city updates directly to your phone.</p>
                  <Button className="w-full bg-white text-accent hover:bg-white/90 rounded-full font-bold shadow-sm">
                    Manage Alerts
                  </Button>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>

      {/* Journey Flow Section */}
      <section className="py-20 bg-white border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-none mb-4 px-4 py-1">The Full Journey</Badge>
            <h2 className="text-3xl font-bold text-primary mb-4">Homeownership is Only the Beginning</h2>
            <p className="text-lg text-muted-foreground">
              From finding your dream home to putting down roots, we're here to support every step of your Newport News story.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-muted flex items-center justify-center mb-6 shadow-sm group-hover:border-primary transition-colors">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">1. Find Your Home</h3>
                <p className="text-sm text-muted-foreground px-4">Explore neighborhoods, learn through our simulator, and secure financing.</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-muted flex items-center justify-center mb-6 shadow-sm group-hover:border-accent transition-colors">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">2. Move In</h3>
                <p className="text-sm text-muted-foreground px-4">Get keys, set up utilities, and settle into your new neighborhood.</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-primary border-4 border-primary/20 flex items-center justify-center mb-6 shadow-md shadow-primary/20 scale-110">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">3. Thrive in the City</h3>
                <p className="text-sm text-muted-foreground px-4">Access resident services, join community events, and become part of the story.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// Helper component for the missing Library icon in the prototype widget
function Library(props: any) {
  return <BookOpen {...props} />;
}
