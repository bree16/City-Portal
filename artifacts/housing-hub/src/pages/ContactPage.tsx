import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "A housing specialist will get back to you within 2 business days.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="flex flex-col w-full pt-20 min-h-screen bg-muted/20">
      {/* Hero */}
      <section className="bg-primary text-white py-16 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0B2146] to-accent/60 z-0"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">Get in Touch — We're Here to Help</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Have questions about housing programs or need assistance? Our team is ready.
          </p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-16">
          
          {/* Top Info Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm text-center p-8 bg-white">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-primary mb-2">Office Location</h3>
              <p className="text-muted-foreground text-sm">2400 Washington Avenue<br/>Newport News, VA 23607</p>
            </Card>
            <Card className="border-none shadow-sm text-center p-8 bg-white">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-primary mb-2">Phone</h3>
              <p className="text-muted-foreground text-sm">(757) 933-2311<br/>Hours: Mon–Fri 8am–5pm</p>
            </Card>
            <Card className="border-none shadow-sm text-center p-8 bg-white">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-primary mb-2">Email</h3>
              <p className="text-muted-foreground text-sm">housing@newportnewsva.gov</p>
            </Card>
          </div>

          {/* Map Placeholder */}
          <div className="w-full h-[300px] bg-primary/5 rounded-2xl border border-border flex flex-col items-center justify-center gap-4 relative overflow-hidden">
            <MapPin className="w-10 h-10 text-accent" />
            <div className="text-center">
              <p className="font-bold text-primary text-lg">2400 Washington Ave, Newport News, VA</p>
            </div>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white mt-2">
              Open in Google Maps
            </Button>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Contact Form (Left) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <Card className="border-none shadow-lg bg-white">
                <CardContent className="p-8 lg:p-10">
                  <h2 className="text-2xl font-bold text-primary mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" placeholder="Jane Doe" required className="bg-muted/50 border-none focus-visible:ring-accent" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="jane@example.com" required className="bg-muted/50 border-none focus-visible:ring-accent" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input id="phone" type="tel" placeholder="(757) 555-0123" className="bg-muted/50 border-none focus-visible:ring-accent" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic</Label>
                      <Select required>
                        <SelectTrigger className="bg-muted/50 border-none focus:ring-accent">
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buy">Buy a Home</SelectItem>
                          <SelectItem value="rent">Find a Rental</SelectItem>
                          <SelectItem value="assistance">Housing Assistance</SelectItem>
                          <SelectItem value="report">Report an Issue</SelectItem>
                          <SelectItem value="general">General Question</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="How can we help you?" 
                        rows={5} 
                        required 
                        className="bg-muted/50 border-none focus-visible:ring-accent resize-none" 
                      />
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-lg font-bold text-base gap-2">
                      <Send className="w-4 h-4" /> Submit
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emergency Numbers (Right) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <h2 className="text-2xl font-bold text-primary">Emergency Housing Numbers</h2>
              <div className="space-y-4">
                {[
                  { name: "Emergency Housing Hotline", num: "(757) 933-2311" },
                  { name: "Virginia 211 Helpline", num: "2-1-1" },
                  { name: "NNRHA", num: "(757) 928-2600" },
                  { name: "Homeless Outreach", num: "(757) 933-2400" }
                ].map((ph, i) => (
                  <Card key={i} className="bg-white border-l-4 border-l-accent shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-primary mb-1">{ph.name}</h4>
                        <div className="text-lg font-extrabold text-foreground">{ph.num}</div>
                      </div>
                      <a href={`tel:${ph.num.replace(/[^0-9]/g, '')}`} className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors">
                        <Phone className="w-5 h-5" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Request Counselor Section */}
          <div className="mt-16">
            <Card className="border-none shadow-lg bg-gradient-to-br from-primary to-[#0B2146] text-white">
              <CardContent className="p-8 lg:p-12">
                <div className="max-w-3xl mx-auto text-center mb-10">
                  <h2 className="text-3xl font-bold mb-4">Request a Housing Counselor</h2>
                  <p className="text-white/80">Get free, confidential advice from a certified professional. A counselor will contact you within 2 business days.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="c-name" className="text-white">Name</Label>
                      <Input id="c-name" required className="bg-white/20 border-none text-white placeholder:text-white/50 focus-visible:ring-secondary" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-email" className="text-white">Email</Label>
                      <Input id="c-email" type="email" required className="bg-white/20 border-none text-white placeholder:text-white/50 focus-visible:ring-secondary" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-phone" className="text-white">Phone</Label>
                      <Input id="c-phone" type="tel" required className="bg-white/20 border-none text-white placeholder:text-white/50 focus-visible:ring-secondary" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-white">Preferred Contact Method</Label>
                      <RadioGroup defaultValue="phone" className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="phone" id="r-phone" className="border-white text-secondary" />
                          <Label htmlFor="r-phone" className="text-white">Phone</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="r-email" className="border-white text-secondary" />
                          <Label htmlFor="r-email" className="text-white">Email</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Best time to reach you</Label>
                      <Input placeholder="e.g. Weekdays after 3pm" className="bg-white/20 border-none text-white placeholder:text-white/50 focus-visible:ring-secondary" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Topic of Concern</Label>
                    <Select required>
                      <SelectTrigger className="bg-white/20 border-none text-white focus:ring-secondary">
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">Credit Repair</SelectItem>
                        <SelectItem value="buy">Buying a Home</SelectItem>
                        <SelectItem value="rent">Rental Issues / Eviction</SelectItem>
                        <SelectItem value="foreclosure">Foreclosure Prevention</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 text-lg">
                    Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>
    </div>
  );
}
