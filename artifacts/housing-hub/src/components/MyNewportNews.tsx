import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser, useClerk } from '@clerk/react';
import {
  Droplet, Trash2, Star, Settings2, CheckCircle2, LogOut, UserPlus, LogIn, Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export interface DashboardService {
  id: string;
  title: string;
  icon: React.ElementType;
  url: string;
}

interface Profile {
  userId: string;
  address: string | null;
  neighborhood: string | null;
  trashDay: number | null;
  recyclingWeek: 'even' | 'odd' | null;
  billDueDay: number | null;
  favorites: string[];
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PAY_BILL_URL = 'https://www.nnva.gov/1433';

function isoWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function nextWeekday(target: number): Date {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = (target - d.getDay() + 7) % 7 || 7; // if today, show next week? No — today counts.
  const todayIsPickup = d.getDay() === target;
  if (!todayIsPickup) d.setDate(d.getDate() + diff);
  return d;
}

function describePickup(d: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function nextBillDue(dueDay: number): Date {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), dueDay);
  if (thisMonth.getTime() >= new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
    return thisMonth;
  }
  return new Date(now.getFullYear(), now.getMonth() + 1, dueDay);
}

function ProfileEditorDialog({
  profile,
  services,
  open,
  onOpenChange,
}: {
  profile: Profile | null;
  services: DashboardService[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const [address, setAddress] = useState(profile?.address ?? '');
  const [trashDay, setTrashDay] = useState<string>(profile?.trashDay != null ? String(profile.trashDay) : '');
  const [recyclingWeek, setRecyclingWeek] = useState<string>(profile?.recyclingWeek ?? '');
  const [billDueDay, setBillDueDay] = useState<string>(profile?.billDueDay != null ? String(profile.billDueDay) : '');
  const [favorites, setFavorites] = useState<string[]>(profile?.favorites ?? []);

  const save = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: address || null,
          trashDay: trashDay === '' ? null : Number(trashDay),
          recyclingWeek: recyclingWeek === '' ? null : recyclingWeek,
          billDueDay: billDueDay === '' ? null : Number(billDueDay),
          favorites,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      onOpenChange(false);
    },
  });

  const toggleFavorite = (id: string) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : f.length < 6 ? [...f, id] : f));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>My Newport News settings</DialogTitle>
          <DialogDescription>
            Tell us a little about your home and we'll personalize your dashboard. You can find your
            collection day on the city's{' '}
            <a href="https://www.nnva.gov/771" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              collection schedule
            </a>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="mynn-address">Street address (optional)</Label>
            <Input id="mynn-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" maxLength={200} />
          </div>
          <div className="space-y-1.5">
            <Label>Trash pickup day</Label>
            <Select value={trashDay} onValueChange={setTrashDay}>
              <SelectTrigger><SelectValue placeholder="Select a weekday" /></SelectTrigger>
              <SelectContent>
                {WEEKDAYS.map((d, i) => (
                  <SelectItem key={d} value={String(i)}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Recycling week</Label>
            <Select value={recyclingWeek} onValueChange={setRecyclingWeek}>
              <SelectTrigger><SelectValue placeholder="Which weeks is your recycling picked up?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="even">Even weeks (this week{isoWeekNumber(new Date()) % 2 === 0 ? ' — yes' : ''})</SelectItem>
                <SelectItem value="odd">Odd weeks (this week{isoWeekNumber(new Date()) % 2 === 1 ? ' — yes' : ''})</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mynn-bill">Utility bill due day of month</Label>
            <Input
              id="mynn-bill" type="number" min={1} max={28} value={billDueDay}
              onChange={(e) => setBillDueDay(e.target.value)} placeholder="e.g. 15"
            />
          </div>
          <div className="space-y-2">
            <Label>Favorite services (up to 6)</Label>
            <div className="grid grid-cols-2 gap-2">
              {services.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={favorites.includes(s.id)} onCheckedChange={() => toggleFavorite(s.id)} />
                  {s.title}
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => save.mutate()} disabled={save.isPending} className="w-full">
            {save.isPending ? 'Saving…' : 'Save my info'}
          </Button>
        </DialogFooter>
        {save.isError && <p className="text-sm text-destructive text-center">Couldn't save — please try again.</p>}
      </DialogContent>
    </Dialog>
  );
}

function SignedInDashboard({ services }: { services: DashboardService[] }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [editing, setEditing] = useState(false);

  const { data, isLoading } = useQuery<{ profile: Profile | null }>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('Failed to load profile');
      return res.json();
    },
  });

  const profile = data?.profile ?? null;
  const firstName = user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'neighbor';
  const initials = (user?.firstName?.[0] ?? firstName[0] ?? 'N').toUpperCase() + (user?.lastName?.[0]?.toUpperCase() ?? '');

  const needsSetup = !profile || (profile.trashDay == null && profile.billDueDay == null && profile.favorites.length === 0);

  const trashDate = profile?.trashDay != null ? nextWeekday(profile.trashDay) : null;
  const isRecyclingWeek =
    profile?.recyclingWeek != null && trashDate != null
      ? (isoWeekNumber(trashDate) % 2 === 0 ? 'even' : 'odd') === profile.recyclingWeek
      : null;
  const billDate = profile?.billDueDay != null ? nextBillDue(profile.billDueDay) : null;
  const favoriteServices = services.filter((s) => profile?.favorites?.includes(s.id));

  return (
    <Card className="border-border shadow-lg rounded-3xl overflow-hidden bg-white">
      <div className="h-24 bg-gradient-to-r from-primary to-accent relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <Button
          size="icon" variant="ghost"
          className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
          aria-label="Dashboard settings"
          onClick={() => setEditing(true)}
          data-testid="button-dashboard-settings"
        >
          <Settings2 className="w-5 h-5" />
        </Button>
      </div>

      <CardContent className="px-6 pb-6 pt-0 relative">
        <div className="flex justify-center -mt-10 mb-4">
          <div className="w-20 h-20 rounded-full bg-white p-1.5 shadow-md">
            <div className="w-full h-full bg-muted rounded-full flex items-center justify-center text-primary font-bold text-2xl">
              {initials}
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-primary">My Newport News</h3>
          <p className="text-sm text-muted-foreground">Welcome back, {firstName}</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-20 bg-muted/50 rounded-2xl animate-pulse" />
            <div className="h-20 bg-muted/50 rounded-2xl animate-pulse" />
          </div>
        ) : needsSetup ? (
          <div className="bg-muted/50 rounded-2xl p-5 border border-border/50 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Set up your dashboard to see your trash day, bill reminders, and favorite services here.
            </p>
            <Button onClick={() => setEditing(true)} className="rounded-full" data-testid="button-setup-dashboard">
              Set up my dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {billDate && (
              <div className="bg-muted/50 rounded-2xl p-4 border border-border/50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-blue-500" /> Utility Bill
                  </h4>
                  <Badge className="bg-blue-100 text-blue-700 border-none px-2 shadow-none font-semibold">Reminder</Badge>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Next bill due</p>
                    <p className="font-bold text-primary">
                      {billDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <Button asChild size="sm" className="h-8 rounded-full bg-white text-primary hover:bg-muted border border-border shadow-sm">
                    <a href={PAY_BILL_URL} target="_blank" rel="noopener noreferrer">Pay online</a>
                  </Button>
                </div>
              </div>
            )}

            {trashDate && (
              <div className="bg-muted/50 rounded-2xl p-4 border border-border/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Next Trash Pickup</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{describePickup(trashDate)}</p>
                    {isRecyclingWeek != null && (
                      <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${isRecyclingWeek ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                        <CheckCircle2 className="w-3 h-3" /> {isRecyclingWeek ? 'Recycling week' : 'No recycling this week'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {favoriteServices.length > 0 && (
              <div className="bg-muted/50 rounded-2xl p-4 border border-border/50">
                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Favorite Services
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {favoriteServices.map((s) => (
                    <a
                      key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1 group flex-1 min-w-[60px]"
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center group-hover:border-accent transition-colors">
                        <s.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground text-center">{s.title.split(' ')[0]}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full mt-6 rounded-xl border-border/60 hover:bg-muted text-primary shadow-sm font-medium"
          onClick={() => signOut({ redirectUrl: (import.meta.env.BASE_URL || '/') })}
          data-testid="button-sign-out"
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign out
        </Button>

        {editing && (
          <ProfileEditorDialog
            key={profile?.userId ?? 'new'}
            profile={profile}
            services={services}
            open={editing}
            onOpenChange={setEditing}
          />
        )}
      </CardContent>
    </Card>
  );
}

function SignedOutCard() {
  return (
    <Card className="border-border shadow-lg rounded-3xl overflow-hidden bg-white">
      <div className="h-24 bg-gradient-to-r from-primary to-accent relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      </div>
      <CardContent className="px-6 pb-6 pt-0 relative">
        <div className="flex justify-center -mt-10 mb-4">
          <div className="w-20 h-20 rounded-full bg-white p-1.5 shadow-md">
            <div className="w-full h-full bg-muted rounded-full flex items-center justify-center text-primary">
              <Bell className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-primary">My Newport News</h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Create a free account to see your trash pickup day, utility bill reminders, and your
            favorite city services — all in one place.
          </p>
        </div>
        <div className="space-y-3">
          <Button asChild className="w-full rounded-xl font-semibold" data-testid="button-create-account">
            <Link href="/sign-up"><UserPlus className="w-4 h-4 mr-2" /> Create my account</Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-xl" data-testid="button-sign-in">
            <Link href="/sign-in"><LogIn className="w-4 h-4 mr-2" /> Sign in</Link>
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground text-center mt-4 leading-relaxed">
          Your info stays on this site — payments always happen on the city's official secure portal.
        </p>
      </CardContent>
    </Card>
  );
}

export function MyNewportNews({ services }: { services: DashboardService[] }) {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) {
    return <div className="h-96 bg-white rounded-3xl border border-border shadow-lg animate-pulse" />;
  }
  return isSignedIn ? <SignedInDashboard services={services} /> : <SignedOutCard />;
}
