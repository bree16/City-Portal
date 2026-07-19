import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    <div className="flex flex-col w-full pt-20 min-h-screen bg-muted/30">
      {/* Hero */}
      <section className="bg-primary text-white py-16 text-center px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Get in Touch</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Have questions about housing programs or need assistance? Our team is here to help.
          </p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            
            {/* Contact Info (2 cols) */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-bold text-primary mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-accent">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Office Location</h4>
                      <p className="text-muted-foreground text-sm">City Hall, 2400 Washington Ave<br/>Newport News, VA 23607</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-accent">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Phone Number</h4>
                      <p className="text-muted-foreground text-sm">(757) 926-8000</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-accent">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Email Address</h4>
                      <p className="text-muted-foreground text-sm">housing@nnva.gov</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-accent">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Office Hours</h4>
                      <p className="text-muted-foreground text-sm">Mon-Fri: 8:00 AM - 5:00 PM<br/>Sat-Sun: Closed</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Map Placeholder */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full h-48 bg-gray-200 rounded-xl border border-border/50 flex flex-col items-center justify-center gap-2 overflow-hidden relative"
              >
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <MapPin className="w-8 h-8 text-muted-foreground z-10" />
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-primary font-semibold hover:underline z-10">
                  View on Google Maps
                </a>
              </motion.div>
            </div>

            {/* Contact Form (3 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <Card className="border-none shadow-lg bg-white">
                <CardContent className="p-8 lg:p-10">
                  <h2 className="text-2xl font-bold text-primary mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Jane" required className="bg-muted/50 border-none focus-visible:ring-accent" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" required className="bg-muted/50 border-none focus-visible:ring-accent" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="jane@example.com" required className="bg-muted/50 border-none focus-visible:ring-accent" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
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
                          <SelectItem value="buy">Buying a Home</SelectItem>
                          <SelectItem value="rent">Rental Resources</SelectItem>
                          <SelectItem value="assistance">Housing Assistance/Emergency</SelectItem>
                          <SelectItem value="other">General Inquiry</SelectItem>
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

                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white h-12 rounded-lg font-bold text-base gap-2">
                      <Send className="w-4 h-4" /> Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
