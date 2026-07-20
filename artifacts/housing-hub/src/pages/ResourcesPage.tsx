import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Building2, Home, HeartHandshake, ShieldCheck, GraduationCap, Users, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import resourcesHero from '@assets/generated_images/resources_hero.jpg';

type Category = "All" | "Homeownership" | "Housing Assistance" | "Helpful Services";

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const resources = [
    {
      title: "Virginia Housing",
      category: "Homeownership",
      icon: Home,
      desc: "Statewide authority providing affordable mortgages, down payment assistance, and homeownership education.",
      url: "https://www.virginiahousing.com/"
    },
    {
      title: "Newport News Redevelopment & Housing Authority (NNRHA)",
      category: "Homeownership",
      icon: Building2,
      desc: "Local agency offering housing programs, vouchers, and community development.",
      url: "https://nnrha.net/"
    },
    {
      title: "Newport News Choice Neighborhood",
      category: "Homeownership",
      icon: Users,
      desc: "Federal initiative to transform distressed housing and surrounding neighborhoods.",
      url: "https://www.nnva.gov/2765/Choice-Neighborhood"
    },
    {
      title: "Virginia Housing & Community Development Corporation",
      category: "Homeownership",
      icon: Building2,
      desc: "State agency supporting housing development and community revitalization.",
      url: "https://www.vhcdc.org/"
    },
    {
      title: "Virginia Peninsula REALTORS®",
      category: "Homeownership",
      icon: Home,
      desc: "Local real estate professionals committed to housing access in the Peninsula region.",
      url: "https://vpar.realtor/"
    },
    {
      title: "Housing Counseling",
      category: "Housing Assistance",
      icon: HeartHandshake,
      desc: "Free certified counseling for renters, buyers, and homeowners facing challenges.",
      url: "https://www.hud.gov/counseling"
    },
    {
      title: "Fair Housing",
      category: "Housing Assistance",
      icon: ShieldCheck,
      desc: "Know your rights. File a complaint if you've experienced housing discrimination.",
      url: "https://www.dpor.virginia.gov/fairhousing/"
    },
    {
      title: "Emergency Housing",
      category: "Housing Assistance",
      icon: Home,
      desc: "Immediate shelter and assistance for families in crisis — Housing Crisis Hotline.",
      url: "https://www.theplanningcouncil.org/housing-crisis-hotline/"
    },
    {
      title: "Homeless Prevention",
      category: "Housing Assistance",
      icon: HeartHandshake,
      desc: "THRIVE Peninsula programs to help residents avoid homelessness before it happens.",
      url: "https://thriveva.org/"
    },
    {
      title: "Housing Crisis Resources",
      category: "Housing Assistance",
      icon: ShieldCheck,
      desc: "Virginia DHCD rapid response for housing emergencies including eviction and displacement.",
      url: "https://www.dhcd.virginia.gov/homelessnesshousing-crisis-resources"
    },
    {
      title: "Community Action Programs",
      category: "Housing Assistance",
      icon: Users,
      desc: "Hampton Roads Community Action Program — wrap-around services including housing support.",
      url: "https://www.hrcapinc.org/"
    },
    {
      title: "Veteran Housing Assistance",
      category: "Housing Assistance",
      icon: ShieldCheck,
      desc: "National Call Center for Homeless Veterans and VA housing programs.",
      url: "https://www.va.gov/homeless/nationalcallcenter.asp"
    },
    {
      title: "United Way 211",
      category: "Housing Assistance",
      icon: HeartHandshake,
      desc: "Call or text 2-1-1 to connect with local housing and social services.",
      url: "https://www.211virginia.org/"
    },
    {
      title: "Housing Opportunities Made Equal (HOME)",
      category: "Housing Assistance",
      icon: Home,
      desc: "Virginia's statewide fair-housing organization fighting housing discrimination.",
      url: "https://homeofva.org/"
    },
    {
      title: "Find a Housing Counselor",
      category: "Helpful Services",
      icon: Users,
      desc: "Search for HUD-approved counselors serving Newport News.",
      url: "https://www.hud.gov/counseling"
    },
    {
      title: "Homebuyer Education",
      category: "Helpful Services",
      icon: GraduationCap,
      desc: "Complete the required homebuyer education course online or in person.",
      url: "https://www.virginiahousing.com/homebuyers/homebuyer-education"
    },
    {
      title: "Human Services",
      category: "Helpful Services",
      icon: HeartHandshake,
      desc: "City department offering benefits, childcare assistance, and family support.",
      url: "https://www.nnva.gov/253/Human-Services"
    },
    {
      title: "Property Information",
      category: "Helpful Services",
      icon: BookOpen,
      desc: "Search Newport News property records, ownership, and assessments.",
      url: "https://www.nnva.gov/149/Property-Information"
    },
    {
      title: "Taxes",
      category: "Helpful Services",
      icon: Building2,
      desc: "Pay property taxes and understand your tax obligations.",
      url: "https://www.nnva.gov/413/Treasurer"
    },
    {
      title: "Permits",
      category: "Helpful Services",
      icon: BookOpen,
      desc: "Apply for building permits for home renovations and new construction.",
      url: "https://www.nnva.gov/1058/Permit-Applications"
    },
    {
      title: "Solid Waste",
      category: "Helpful Services",
      icon: Building2,
      desc: "Bulk item pickup, recycling, and waste management services.",
      url: "https://www.nnva.gov/378/Solid-Waste"
    },
    {
      title: "Bill Pay",
      category: "Helpful Services",
      icon: Building2,
      desc: "Pay city utility bills and fees online.",
      url: "https://www.nnva.gov/1483/Online-Services"
    },
    {
      title: "Jobs",
      category: "Helpful Services",
      icon: Users,
      desc: "City of Newport News employment opportunities and career resources.",
      url: "https://www.governmentjobs.com/careers/newportnews"
    }
  ];

  const filteredResources = activeCategory === "All" 
    ? resources 
    : resources.filter(r => r.category === activeCategory);

  return (
    <div className="flex flex-col w-full pt-20 bg-muted/20 min-h-screen">
      {/* Hero — photo background */}
      <section className="relative text-white py-20 lg:py-32 text-center px-4 overflow-hidden">
        <img src={resourcesHero} alt="Community members meeting with housing counselor" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/92 via-primary/80 to-accent/50 z-10" />
        <div className="container mx-auto max-w-4xl relative z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-sm font-medium mb-5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Programs & Resources
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Everything You Need in One Place</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Browse programs, organizations, and community services — organized around what matters to you, not what department runs it.
            </p>
          </motion.div>
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
                    <Button asChild className="bg-accent hover:bg-accent/90 text-white font-bold h-12 px-6 rounded-lg">
                      <a href="https://www.nnva.gov/3027/Housing-Resources" target="_blank" rel="noopener noreferrer">
                        Learn About SHIP
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="border-white/30 text-primary hover:bg-white/10 hover:text-white bg-white font-bold h-12 px-6 rounded-lg">
                      <a href="https://nngov.civicweb.net/document/276368/Strategic%20Housing%20Initiatives%20Plan%20Presentation.pdf?handle=B7C83EF52AFF4A2D885AA7ADD92CF12D" target="_blank" rel="noopener noreferrer">
                        Read SHIP Document
                      </a>
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Card className="h-full border-l-4 border-l-accent border-border/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-white group flex flex-col">
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
                    <Button asChild variant="link" className="p-0 h-auto font-bold text-accent justify-start gap-1">
                      <a href={res.url} target="_blank" rel="noopener noreferrer">
                        Learn More <ExternalLink className="w-3.5 h-3.5" />
                      </a>
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
