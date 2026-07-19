import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Building2, Home, HeartHandshake, ShieldCheck, GraduationCap, Users, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type Category = "All" | "Homeownership" | "Housing Assistance" | "Helpful Services";

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const resources = [
    {
      title: "Virginia Housing",
      category: "Homeownership",
      icon: Home,
      desc: "Statewide authority providing affordable mortgages, down payment assistance, and homeownership education."
    },
    {
      title: "Newport News Redevelopment & Housing Authority (NNRHA)",
      category: "Homeownership",
      icon: Building2,
      desc: "Local agency offering housing programs, vouchers, and community development."
    },
    {
      title: "Newport News Choice Neighborhood",
      category: "Homeownership",
      icon: Users,
      desc: "Federal initiative to transform distressed housing and surrounding neighborhoods."
    },
    {
      title: "Virginia Housing & Community Development Corporation",
      category: "Homeownership",
      icon: Building2,
      desc: "State agency supporting housing development and community revitalization."
    },
    {
      title: "Virginia Peninsula REALTORS®",
      category: "Homeownership",
      icon: Home,
      desc: "Local real estate professionals committed to housing access in the Peninsula region."
    },
    {
      title: "Housing Counseling",
      category: "Housing Assistance",
      icon: HeartHandshake,
      desc: "Free certified counseling for renters, buyers, and homeowners facing challenges."
    },
    {
      title: "Fair Housing",
      category: "Housing Assistance",
      icon: ShieldCheck,
      desc: "Know your rights. File a complaint if you've experienced housing discrimination."
    },
    {
      title: "Emergency Housing",
      category: "Housing Assistance",
      icon: Home,
      desc: "Immediate shelter and assistance for families in crisis."
    },
    {
      title: "Homeless Prevention",
      category: "Housing Assistance",
      icon: HeartHandshake,
      desc: "Programs to help residents avoid homelessness before it happens."
    },
    {
      title: "Housing Crisis Resources",
      category: "Housing Assistance",
      icon: ShieldCheck,
      desc: "Rapid response for housing emergencies including eviction and displacement."
    },
    {
      title: "Community Action Programs",
      category: "Housing Assistance",
      icon: Users,
      desc: "Local agencies providing wrap-around services including housing support."
    },
    {
      title: "Veteran Housing Assistance",
      category: "Housing Assistance",
      icon: ShieldCheck,
      desc: "Specialized programs for veterans including VA loans and transitional housing."
    },
    {
      title: "United Way 211",
      category: "Housing Assistance",
      icon: HeartHandshake,
      desc: "Call or text 2-1-1 to connect with local housing and social services."
    },
    {
      title: "Housing Opportunities Made Equal (HOME)",
      category: "Housing Assistance",
      icon: Home,
      desc: "Federal program funding affordable housing development and rental assistance."
    },
    {
      title: "Find a Housing Counselor",
      category: "Helpful Services",
      icon: Users,
      desc: "Search for HUD-approved counselors serving Newport News."
    },
    {
      title: "Homebuyer Education",
      category: "Helpful Services",
      icon: GraduationCap,
      desc: "Complete the required HUD education course online or in person."
    },
    {
      title: "Human Services",
      category: "Helpful Services",
      icon: HeartHandshake,
      desc: "City department offering benefits, childcare assistance, and family support."
    },
    {
      title: "Property Information",
      category: "Helpful Services",
      icon: BookOpen,
      desc: "Search Newport News property records, ownership, and assessments."
    },
    {
      title: "Taxes",
      category: "Helpful Services",
      icon: Building2,
      desc: "Pay property taxes and understand your tax obligations."
    },
    {
      title: "Permits",
      category: "Helpful Services",
      icon: BookOpen,
      desc: "Apply for building permits for home renovations and new construction."
    },
    {
      title: "Solid Waste",
      category: "Helpful Services",
      icon: Building2,
      desc: "Bulk item pickup, recycling, and waste management services."
    },
    {
      title: "Bill Pay",
      category: "Helpful Services",
      icon: Building2,
      desc: "Pay city utility bills and fees online."
    },
    {
      title: "Jobs",
      category: "Helpful Services",
      icon: Users,
      desc: "City of Newport News employment opportunities and career resources."
    }
  ];

  const filteredResources = activeCategory === "All" 
    ? resources 
    : resources.filter(r => r.category === activeCategory);

  return (
    <div className="flex flex-col w-full pt-20 bg-muted/20 min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-16 lg:py-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0B2146] to-accent/80 z-0"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Housing Resources</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Everything you need in one place. Browse official programs, community partners, and helpful services.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* Featured Section */}
          <div className="mb-16">
            <Card className="border-accent/20 border-2 shadow-lg overflow-hidden bg-primary text-white">
              <CardContent className="p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="flex-1 relative z-10">
                  <Badge className="bg-accent hover:bg-accent text-white border-none font-bold tracking-wider uppercase mb-4">Featured Resource</Badge>
                  <h2 className="text-3xl font-bold mb-4">Strategic Housing Initiatives Plan (SHIP)</h2>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    The City's long-term housing roadmap — focused on affordability, redevelopment, neighborhood stability, homeownership opportunities, and partnerships.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-accent hover:bg-accent/90 text-white font-bold h-12 px-6 rounded-lg">
                      Learn About SHIP
                    </Button>
                    <Button variant="outline" className="border-white/30 text-primary hover:bg-white/10 hover:text-white bg-white font-bold h-12 px-6 rounded-lg">
                      Read SHIP Document
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories Tab */}
          <div className="mb-10">
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex gap-2">
                {["All", "Homeownership", "Housing Assistance", "Helpful Services"].map((cat) => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? "default" : "outline"}
                    onClick={() => setActiveCategory(cat as Category)}
                    className={`rounded-full px-6 font-medium ${
                      activeCategory === cat 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'bg-white border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
          </div>

          {/* Resource Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res, i) => (
              <motion.div
                key={res.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-white group flex flex-col">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-accent">
                        <res.icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className="bg-secondary/10 text-primary border-secondary/20">
                        {res.category}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg text-primary mb-3 leading-tight group-hover:text-accent transition-colors">{res.title}</h3>
                    <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                      {res.desc}
                    </p>
                    <Button variant="link" className="p-0 h-auto font-bold text-accent justify-start gap-1">
                      Learn More <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
