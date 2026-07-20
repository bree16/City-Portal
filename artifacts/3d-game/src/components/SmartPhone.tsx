import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { homes } from '@/data/homes';
import { getAudioEngine } from '@/hooks/useGameAudio';
import { GameIcon, GameIconName } from '@/components/ui/GameIcon';
import { useAudioControls } from '@/components/AudioManager';

// ── Module-level State (Persistence across unmounts in session) ─────
let windowState = {
  x: window.innerWidth > 400 ? Math.max(20, window.innerWidth - 380) : 20,
  y: window.innerHeight > 800 ? Math.max(20, window.innerHeight - 760) : 20,
  minimized: false,
  maximized: false,
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  links?: { label: string; href: string }[];
};

let globalChatHistory: ChatMessage[] = [
  {
    id: 'init',
    role: 'assistant',
    content: "Hi! I'm your Housing Assistant. How can I help you on your journey to homeownership today?",
    suggestions: ["What's a good credit score?", "How do I get pre-approved?"]
  }
];

type AppId = 'budget' | 'credit' | 'housing' | 'documents' | 'achievements' | 'assistant' | 'notifications' | 'settings' | 'progress';

const APPS: { id: AppId; icon: GameIconName; label: string; color: string }[] = [
  { id: 'assistant',     icon: 'message-circle', label: 'Assistant',  color: '#38bdf8' },
  { id: 'housing',       icon: 'search-home',    label: 'Homes',      color: '#8B4513' },
  { id: 'budget',        icon: 'budget',         label: 'Budget',     color: '#0A8F7E' },
  { id: 'credit',        icon: 'gauge',          label: 'Credit',     color: '#1e293b' },
  { id: 'documents',     icon: 'documents',      label: 'Docs',       color: '#6B3FA0' },
  { id: 'achievements',  icon: 'trophy',         label: 'Awards',     color: '#C0392B' },
  { id: 'progress',      icon: 'target',         label: 'Progress',   color: '#d4a843' },
  { id: 'notifications', icon: 'bell',           label: 'Alerts',     color: '#f97316' },
  { id: 'settings',      icon: 'settings',       label: 'Settings',   color: '#475569' },
];

const ACHIEVEMENT_DEFS: { id: string; icon: GameIconName; label: string; desc: string }[] = [
  { id: 'budget_master',   icon: 'budget', label: 'Budget Master',  desc: 'Reviewed your finances' },
  { id: 'credit_champion', icon: 'star', label: 'Credit Champ',   desc: 'Improved your credit' },
  { id: 'deal_maker',      icon: 'handshake', label: 'Deal Maker',     desc: 'Negotiated your offer' },
  { id: 'first_mortgage',  icon: 'documents', label: 'Pre-Approved',   desc: 'Got mortgage approval' },
  { id: 'house_hunter',    icon: 'search', label: 'House Hunter',   desc: 'Chose your home' },
  { id: 'homeowner',       icon: 'keys', label: 'Homeowner',      desc: 'Closed on your home' },
  { id: 'dream_home',      icon: 'sparkles', label: 'Dream Home',     desc: 'Furnished your home' },
];

const DOC_LIST = [
  { id: 'paystubs', label: 'Pay Stubs',        detail: '2 most recent' },
  { id: 'bank',     label: 'Bank Statements',  detail: '2 months' },
  { id: 'w2',       label: 'W-2 Forms',        detail: '2 years' },
  { id: 'tax',      label: 'Tax Returns',      detail: '2 years' },
];

function creditTier(score: number) {
  if (score >= 740) return { label: 'Excellent', color: '#22c55e' };
  if (score >= 700) return { label: 'Very Good', color: '#4ade80' };
  if (score >= 660) return { label: 'Good',      color: '#a3e635' };
  if (score >= 620) return { label: 'Fair',      color: '#facc15' };
  return               { label: 'Poor',          color: '#f87171' };
}

/* ── Progress App ────────────────────────────────────────────── */
const STAGE_NAMES = ['', 'Renting', 'Preparing', 'Hunting', 'Offer', 'Mortgage', 'Closing', 'Move In'];
const OBJECTIVES = [
  { stage: 1, text: 'Talk to your landlord & save for a down payment' },
  { stage: 2, text: 'Visit the Housing Counselor to get pre-qualified' },
  { stage: 3, text: 'Browse homes at the Real Estate Office' },
  { stage: 4, text: "Make your offer at the Buyer's Agent office" },
  { stage: 5, text: 'Get mortgage approval at the Community Bank' },
  { stage: 6, text: 'Sign your closing papers at City Hall' },
  { stage: 7, text: 'Enjoy your new home! You did it!' },
];

function ProgressApp() {
  const { stage, month } = useGameStore();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 4px' }}>
      <div style={{ background: 'var(--teal-grad)', borderRadius: 16, padding: 16, color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8, marginBottom: 4 }}>Current Stage {stage}</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>{STAGE_NAMES[stage] || 'Done'}</div>
        <div style={{ fontSize: 16, background: 'rgba(0,0,0,0.25)', padding: '10px 12px', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <GameIcon name="target" size={20} color="var(--gold)" style={{ marginTop: 2 }} />
          <span style={{ lineHeight: 1.4, fontWeight: 500 }}>{OBJECTIVES.find(o => o.stage === stage)?.text || 'Journey complete!'}</span>
        </div>
      </div>

      <div style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 8 }}>Timeline</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.05)', padding: '14px 16px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
        <GameIcon name="calendar" size={28} color="var(--sky-blue)" />
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Month {month}</div>
          <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Months on your journey</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
        {OBJECTIVES.map(obj => {
          const isPast = obj.stage < stage;
          const isCurrent = obj.stage === stage;
          return (
            <div key={obj.stage} style={{ display: 'flex', gap: 12, opacity: isPast ? 0.5 : (isCurrent ? 1 : 0.3) }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: isPast ? 'var(--teal)' : (isCurrent ? 'var(--gold)' : 'rgba(255,255,255,0.1)'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isPast ? <GameIcon name="check" size={18} color="#fff" /> : <span style={{ fontSize: 17, fontWeight: 800, color: isCurrent ? '#000' : '#fff' }}>{obj.stage}</span>}
                </div>
                {obj.stage < 7 && <div style={{ width: 2, height: 36, background: isPast ? 'var(--teal)' : 'rgba(255,255,255,0.1)', margin: '4px 0' }} />}
              </div>
              <div style={{ paddingTop: 4, paddingBottom: 24 }}>
                <div style={{ fontSize: 17, fontWeight: isCurrent ? 800 : 600, color: '#fff', marginBottom: 4 }}>{STAGE_NAMES[obj.stage]}</div>
                <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{obj.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Housing Assistant App ───────────────────────────────────── */
function AssistantApp() {
  const [messages, setMessages] = useState(globalChatHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    globalChatHistory = newMsgs;
    setInput('');
    setLoading(true);

    try {
      // POST to absolute root path to hit API server
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const astMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "I'm having trouble connecting right now.",
        suggestions: data.suggestions,
        links: data.links
      };
      setMessages([...newMsgs, astMsg]);
      globalChatHistory = [...newMsgs, astMsg];
    } catch (e) {
      const errMsg: ChatMessage = { id: (Date.now()+1).toString(), role: 'assistant', content: 'Connection error. Please try again.' };
      setMessages([...newMsgs, errMsg]);
      globalChatHistory = [...newMsgs, errMsg];
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0 4px' }}>
      <div ref={scrollRef} className="phone-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              background: m.role === 'user' ? 'var(--teal)' : 'rgba(255,255,255,0.08)',
              border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)',
              padding: '12px 16px',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              maxWidth: '85%',
              fontSize: 16,
              lineHeight: 1.5,
              color: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {m.content}
            </div>
            {m.links && m.links.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8, width: '85%' }}>
                {m.links.map((l, i) => (
                  <button key={i} onClick={() => window.open(l.href, '_blank')} style={{ 
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, padding: '10px 14px', fontSize: 17, color: '#fff', fontWeight: 600,
                    textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer'
                  }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.label}</span>
                    <GameIcon name="arrow-right" size={18} color="var(--gold)" />
                  </button>
                ))}
              </div>
            )}
            {m.suggestions && m.role === 'assistant' && m === messages[messages.length - 1] && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {m.suggestions.map((s, i) => (
                  <button key={i} onClick={() => send(s)} style={{ 
                    fontSize: 17, fontWeight: 600, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--teal)', borderRadius: 16, color: 'var(--teal)', cursor: 'pointer'
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', marginLeft: 8, fontWeight: 500 }}>Assistant is typing...</div>}
      </div>
      <div style={{ padding: '12px 0 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <form onSubmit={e => { e.preventDefault(); send(input); }} style={{ display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question..."
            style={{ 
              flex: 1, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.15)', 
              borderRadius: 24, padding: '10px 16px', fontSize: 16, color: '#fff', outline: 'none',
              fontFamily: 'Inter, sans-serif'
            }}
          />
          <button type="submit" disabled={!input.trim() || loading} style={{ 
            background: 'var(--teal)', border: 'none', borderRadius: '50%', width: 40, height: 40, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (!input.trim() || loading) ? 'default' : 'pointer',
            opacity: (!input.trim() || loading) ? 0.5 : 1, color: '#fff', boxShadow: '0 4px 12px rgba(10, 143, 126, 0.4)'
          }}>
            <GameIcon name="arrow-right" size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Notifications App ───────────────────────────────────────── */
function NotificationsApp() {
  const { lifeEventLog } = useGameStore();
  
  if (lifeEventLog.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200, gap: 16, color: 'rgba(255,255,255,0.5)' }}>
        <GameIcon name="bell" size={40} />
        <div style={{ fontSize: 18, fontWeight: 700 }}>No Notifications</div>
        <div style={{ fontSize: 16 }}>Events will appear here.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[...lifeEventLog].reverse().map((ev, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '14px 16px',
          display: 'flex',
          gap: 14,
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GameIcon name="info" size={20} color="var(--gold)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, color: '#fff', fontWeight: 600, lineHeight: 1.4 }}>{ev}</div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginTop: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recently</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Settings App ────────────────────────────────────────────── */
function SettingsApp() {
  const { muted, toggleMute, musicVolume, setMusicVolume, sfxVolume, setSfxVolume } = useAudioControls();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '0 4px' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '20px' }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Audio Settings</div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 18, fontWeight: 600, color: '#fff' }}>
            <GameIcon name={muted ? "audio-off" : "audio"} size={20} color={muted ? "#f87171" : "#fff"} /> Master Mute
          </div>
          <button onClick={toggleMute} style={{ width: 48, height: 26, borderRadius: 13, background: muted ? 'rgba(255,255,255,0.2)' : 'var(--teal)', position: 'relative', cursor: 'pointer', border: 'none', transition: 'background 0.2s' }}>
            <motion.div layout initial={false} animate={{ x: muted ? 2 : 24 }} style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>
              <span>Music Volume</span>
              <span>{Math.round(musicVolume * 100)}%</span>
            </div>
            <input type="range" min={0} max={100} value={Math.round(musicVolume * 100)} onChange={e => setMusicVolume(Number(e.target.value)/100)} style={{ width: '100%', accentColor: 'var(--teal)', cursor: 'pointer' }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>
              <span>SFX Volume</span>
              <span>{Math.round(sfxVolume * 100)}%</span>
            </div>
            <input type="range" min={0} max={100} value={Math.round(sfxVolume * 100)} onChange={e => setSfxVolume(Number(e.target.value)/100)} style={{ width: '100%', accentColor: 'var(--teal)', cursor: 'pointer' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Credit Arc Meter ────────────────────────────────────────── */
const ARC_R = 72;
const ARC_CX = 110;
const ARC_CY = 110;
const ARC_LEN = Math.PI * ARC_R; 

function CreditArc({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(1, (score - 300) / 550));
  const filled = pct * ARC_LEN;
  const tier = creditTier(score);
  return (
    <svg width={220} height={130} style={{ overflow: 'visible' }}>
      <path
        d={`M ${ARC_CX - ARC_R} ${ARC_CY} A ${ARC_R} ${ARC_R} 0 0 1 ${ARC_CX + ARC_R} ${ARC_CY}`}
        fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={16} strokeLinecap="round"
      />
      <motion.path
        d={`M ${ARC_CX - ARC_R} ${ARC_CY} A ${ARC_R} ${ARC_R} 0 0 1 ${ARC_CX + ARC_R} ${ARC_CY}`}
        fill="none" stroke={tier.color} strokeWidth={16} strokeLinecap="round"
        strokeDasharray={`${ARC_LEN} ${ARC_LEN}`}
        initial={{ strokeDashoffset: ARC_LEN }}
        animate={{ strokeDashoffset: ARC_LEN - filled }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <text x={ARC_CX} y={ARC_CY - 10} textAnchor="middle" fill="#fff" fontSize={36} fontWeight={800} fontFamily="Inter,sans-serif">
        {score}
      </text>
      <text x={ARC_CX} y={ARC_CY + 18} textAnchor="middle" fill={tier.color} fontSize={14} fontWeight={700} fontFamily="Inter,sans-serif">
        {tier.label}
      </text>
    </svg>
  );
}

/* ── Budget App ──────────────────────────────────────────────── */
function BudgetApp() {
  const { cash, savings, debt, monthlyIncome, monthlyExpenses } = useGameStore();
  const surplus = monthlyIncome - monthlyExpenses;
  const maxBar = Math.max(monthlyIncome, monthlyExpenses) + 200;

  const Bar = ({ value, color, label }: { value: number; color: string; label: string }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, color: 'rgba(255,255,255,0.6)', marginBottom: 6, fontWeight: 500 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 800, color: '#fff' }}>${value.toLocaleString()}/mo</span>
      </div>
      <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${(value / maxBar) * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 5, background: color }}
        />
      </div>
    </div>
  );

  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Cash',    value: `${cash.toLocaleString()}`,    color: 'var(--gold)', icon: 'money' as GameIconName },
          { label: 'Savings', value: `${savings.toLocaleString()}`, color: 'var(--teal)', icon: 'bank' as GameIconName },
          { label: 'Debt',    value: `${debt.toLocaleString()}`,    color: '#f87171', icon: 'credit-card' as GameIconName },
          { label: 'Surplus', value: `${surplus.toLocaleString()}`, color: surplus >= 0 ? '#4ade80' : '#f87171', icon: surplus >= 0 ? 'trend-up' as GameIconName : 'trend-down' as GameIconName },
        ].map(({ label, value, color, icon }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}><GameIcon name={icon} size={16} /> {label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Monthly Budget</div>
      <Bar value={monthlyIncome}   color="var(--teal)" label="Income" />
      <Bar value={monthlyExpenses} color="#C0392B" label="Expenses" />
      <div style={{
        marginTop: 16, padding: '12px 16px', borderRadius: 12,
        background: surplus >= 0 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
        border: `1px solid ${surplus >= 0 ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
        fontSize: 16, color: surplus >= 0 ? '#4ade80' : '#f87171', fontWeight: 700,
        display: 'flex', alignItems: 'center', gap: 8, lineHeight: 1.4
      }}>
        <GameIcon name={surplus >= 0 ? 'check' : 'warning'} size={20} />
        {surplus >= 0 ? `${surplus.toLocaleString()} monthly surplus — keep saving!` : `${Math.abs(surplus).toLocaleString()} over budget — review expenses`}
      </div>
    </div>
  );
}

/* ── Credit App ──────────────────────────────────────────────── */
function CreditApp() {
  const { creditScore } = useGameStore();
  const TIPS: { icon: GameIconName; text: string }[] = [
    { icon: 'credit-card', text: 'Pay every bill on time — payment history is 35% of your score.' },
    { icon: 'trend-down', text: 'Keep credit card balances under 30% of your limit.' },
    { icon: 'block', text: "Don't apply for new credit before your mortgage — hard pulls lower scores." },
    { icon: 'calendar', text: 'Longer credit history = higher score. Keep old accounts open.' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 4px' }}>
      <CreditArc score={creditScore} />
      <div style={{ width: '100%', marginTop: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Score Milestones</div>
        {[
          { score: 620, label: 'FHA Loan Minimum', met: creditScore >= 620 },
          { score: 660, label: 'Better Interest Rate', met: creditScore >= 660 },
          { score: 700, label: 'Conventional Loan', met: creditScore >= 700 },
          { score: 740, label: 'Best Rates Available', met: creditScore >= 740 },
        ].map(({ score, label, met }) => (
          <div key={score} style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
            padding: '10px 14px', borderRadius: 12,
            background: met ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${met ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)'}`
          }}>
            <span style={{ display: 'flex' }}><GameIcon name={met ? 'check' : 'uncheck'} size={20} color={met ? '#4ade80' : 'rgba(255,255,255,0.3)'} /></span>
            <span style={{ fontSize: 16, color: met ? '#4ade80' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{score} — {label}</span>
          </div>
        ))}
        <div style={{ marginTop: 20, fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>How to Improve</div>
        {TIPS.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            <span style={{ display: 'flex', marginTop: 2 }}><GameIcon name={t.icon} size={20} color="var(--gold)" /></span><span>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Housing Search App ──────────────────────────────────────── */
function HousingApp() {
  const { stage, selectedHomeId, setSelectedHome, setPhoneOpen } = useGameStore();
  if (stage < 3) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 250, gap: 16, color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 20 }}>
        <GameIcon name="lock" size={40} />
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Unlocks in Stage 3</div>
        <div style={{ fontSize: 16, lineHeight: 1.5 }}>Visit the counselor first to start your home search.</div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 4px' }}>
      {homes.map((h) => {
        const selected = selectedHomeId === h.id;
        return (
          <div key={h.id} style={{
            borderRadius: 16, overflow: 'hidden',
            border: selected ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
            background: selected ? 'rgba(255,234,0,0.05)' : 'rgba(255,255,255,0.03)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <div style={{ height: 56, background: h.color, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10 }}>
              <GameIcon name="home" size={24} color="#fff" />
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{h.name}</div>
              {selected && <div style={{ marginLeft: 'auto', background: 'var(--gold)', color: '#000', fontSize: 15, fontWeight: 800, padding: '4px 8px', borderRadius: 8 }}>SELECTED</div>}
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>${h.price.toLocaleString()}</span>
                <span style={{ fontSize: 17, color: 'var(--teal)', fontWeight: 700 }}>${h.monthlyPayment}/mo</span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 17, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GameIcon name="bed" size={18} /> {h.beds}bd</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GameIcon name="bath" size={18} /> {h.baths}ba</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GameIcon name="ruler" size={18} /> {h.sqft.toLocaleString()} sqft</span>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GameIcon name="walk" size={16} /> Walk {h.walkability}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GameIcon name="school" size={16} /> Schools {h.schools}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GameIcon name="car" size={16} /> {h.commute}min</span>
              </div>
              <button
                onClick={() => { getAudioEngine().play('click'); setSelectedHome(h.id); setPhoneOpen(false); }}
                style={{
                  width: '100%', padding: '12px', fontWeight: 700, fontSize: 16, borderRadius: 12,
                  background: selected ? 'var(--teal)' : 'rgba(255,255,255,0.1)', color: '#fff',
                  border: selected ? 'none' : '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s'
                }}
              >
                {selected ? <><GameIcon name="check" size={18} /> Selected — Go Negotiate</> : 'Select This Home'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Documents App ───────────────────────────────────────────── */
function DocumentsApp() {
  const { stage, completedInteractions } = useGameStore();
  const stageGate = stage >= 5;
  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 16, lineHeight: 1.5, background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: 12 }}>
        {stageGate
          ? "Documents you've submitted to the bank for your mortgage application."
          : "You'll gather these documents at the bank in Stage 5."}
      </div>
      {DOC_LIST.map(({ id, label, detail }) => {
        const done = stageGate && completedInteractions.includes(id);
        return (
          <div key={id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
            borderRadius: 16, marginBottom: 10,
            background: done ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${done ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <span style={{ display: 'flex', color: done ? '#4ade80' : 'rgba(255,255,255,0.3)' }}><GameIcon name={done ? 'check' : 'documents'} size={24} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: done ? '#4ade80' : '#fff' }}>{label}</div>
              <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{detail}</div>
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 20, padding: '14px 16px', borderRadius: 16, background: 'rgba(255,234,0,0.08)', border: '1px solid rgba(255,234,0,0.2)', fontSize: 17, color: 'rgba(255,234,0,0.9)', lineHeight: 1.5, display: 'flex', gap: 10 }}>
        <GameIcon name="lightbulb" size={18} style={{ marginTop: 2, flexShrink: 0 }} /> <span>Gather these docs early — missing documents are the #1 cause of mortgage delays.</span>
      </div>
    </div>
  );
}

/* ── Achievements App ────────────────────────────────────────── */
function AchievementsApp() {
  const { achievements } = useGameStore();
  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <span>Awards</span>
        <span>{achievements.length} / {ACHIEVEMENT_DEFS.length}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {ACHIEVEMENT_DEFS.map(({ id, icon, label, desc }) => {
          const earned = achievements.includes(id);
          return (
            <div key={id} style={{
              padding: '16px 12px', borderRadius: 16, textAlign: 'center',
              background: earned ? 'rgba(255,234,0,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${earned ? 'rgba(255,234,0,0.4)' : 'rgba(255,255,255,0.06)'}`,
              filter: earned ? 'none' : 'grayscale(1) opacity(0.5)',
              boxShadow: earned ? '0 8px 16px rgba(255,234,0,0.1)' : 'none'
            }}>
              <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
                <GameIcon name={earned ? icon : 'lock'} size={32} color={earned ? "var(--gold)" : "#fff"} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: earned ? 'var(--gold)' : 'rgba(255,255,255,0.7)', marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Phone Shell ─────────────────────────────────────────────── */
const APP_COMPONENTS: Record<AppId, React.ComponentType> = {
  budget:       BudgetApp,
  credit:       CreditApp,
  housing:      HousingApp,
  documents:    DocumentsApp,
  achievements: AchievementsApp,
  progress:     ProgressApp,
  assistant:    AssistantApp,
  notifications:NotificationsApp,
  settings:     SettingsApp,
};

export function SmartPhone() {
  const { phoneOpen, setPhoneOpen, month } = useGameStore();
  const [activeApp, setActiveApp] = useState<AppId | null>(null);

  const [pos, setPos] = useState({ x: windowState.x, y: windowState.y });
  const [minimized, setMinimized] = useState(windowState.minimized);
  const [maximized, setMaximized] = useState(windowState.maximized);
  const dragControls = useDragControls();

  const clampPos = (x: number, y: number, isMax: boolean) => {
    const w = isMax ? 400 : 360;
    const maxX = window.innerWidth - 60; // Keep at least 60px of phone visible horizontally
    const maxY = window.innerHeight - 40; // Keep at least 40px visible vertically
    const minX = -w + 60;
    const minY = 0;
    return {
      x: Math.max(minX, Math.min(x, maxX)),
      y: Math.max(minY, Math.min(y, maxY))
    };
  };

  // Clamp position on mount to ensure it stays on screen
  useEffect(() => {
    const clamped = clampPos(windowState.x, windowState.y, windowState.maximized);
    windowState.x = clamped.x;
    windowState.y = clamped.y;
    setPos(clamped);

    const handleResize = () => {
      setPos(prev => {
        const c = clampPos(prev.x, prev.y, windowState.maximized);
        windowState.x = c.x;
        windowState.y = c.y;
        return c;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const AppScreen = activeApp ? APP_COMPONENTS[activeApp] : null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none' }}>
      <AnimatePresence>
        {phoneOpen && !minimized && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => { setPhoneOpen(false); setActiveApp(null); }}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(5, 10, 20, 0.4)',
              backdropFilter: 'blur(3px)',
              pointerEvents: 'auto',
            }}
          />
        )}
        
        {phoneOpen && !minimized && (
          <motion.div
            key="phone"
            drag={!maximized}
            dragListener={false}
            dragControls={dragControls}
            dragMomentum={false}
            onDragEnd={(e, info) => {
              const nx = pos.x + info.offset.x;
              const ny = pos.y + info.offset.y;
              const clamped = clampPos(nx, ny, maximized);
              setPos(clamped);
              windowState.x = clamped.x;
              windowState.y = clamped.y;
            }}
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{
              opacity: 1, scale: 1,
              x: maximized ? window.innerWidth / 2 - (maximized ? 400 : 360) / 2 - pos.x : 0,
              y: maximized ? window.innerHeight / 2 - (maximized ? 800 : 720) / 2 - pos.y : 0,
            }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: pos.x, top: pos.y,
              width: maximized ? 400 : 360,
              height: maximized ? 800 : 720,
              maxHeight: '92dvh',
              borderRadius: maximized ? 24 : 36,
              background: 'rgba(10, 20, 42, 0.85)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              fontFamily: 'Inter, sans-serif',
              pointerEvents: 'auto',
            }}
          >
            <style>{`
              .phone-scroll::-webkit-scrollbar { width: 4px; }
              .phone-scroll::-webkit-scrollbar-track { background: transparent; }
              .phone-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 4px; }
              .phone-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
            `}</style>

            {/* Status Bar / Drag Handle */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              style={{ padding: '16px 20px 12px', touchAction: 'none', cursor: maximized ? 'default' : 'grab', flexShrink: 0, position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16, color: '#fff', fontWeight: 600 }}>
                <span style={{ width: 60 }}>M{month}</span>
                {/* Dynamic Island / Notch */}
                <div style={{ width: 80, height: 24, borderRadius: 12, background: '#000', border: '1px solid rgba(255,255,255,0.05)', position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 12, boxShadow: 'inset 0 -1px 2px rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', gap: 6, width: 60, justifyContent: 'flex-end', alignItems: 'center' }}>
                  <GameIcon name="signal" size={16} color="#fff" />
                  <GameIcon name="wifi" size={16} color="#fff" />
                  <GameIcon name="battery-full" size={20} color="#fff" />
                </div>
              </div>
            </div>

            {/* Window Controls */}
            {!activeApp && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, padding: '0 24px 12px', opacity: 0.6, flexShrink: 0 }}>
                <button onClick={() => { getAudioEngine().play('click'); setMinimized(true); windowState.minimized = true; }} style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#fff', padding: 4 }}><GameIcon name="window-minimize" size={18} /></button>
                <button onClick={() => { 
                  getAudioEngine().play('click'); 
                  const newMax = !maximized;
                  setMaximized(newMax); 
                  windowState.maximized = newMax; 
                  const clamped = clampPos(pos.x, pos.y, newMax);
                  setPos(clamped);
                  windowState.x = clamped.x;
                  windowState.y = clamped.y;
                }} style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#fff', padding: 4 }}><GameIcon name={maximized ? "window-restore" : "maximize"} size={18} /></button>
                <button onClick={() => { getAudioEngine().play('click'); setPhoneOpen(false); }} style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#fff', padding: 4 }}><GameIcon name="close" size={18} /></button>
              </div>
            )}

            {/* App Header (when in app) */}
            {activeApp && (
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: 12, flexShrink: 0 }}>
                <button onClick={() => { getAudioEngine().play('click'); setActiveApp(null); }} style={{ background: 'transparent', border: 'none', color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 18, fontWeight: 600, padding: '4px 0' }}>
                  <GameIcon name="arrow-left" size={18} /> Back
                </button>
                <div style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 800, color: '#fff', paddingRight: 60 }}>
                  {APPS.find(a => a.id === activeApp)?.label}
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="phone-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px 20px 24px' }}>
              <AnimatePresence mode="wait">
                {AppScreen ? (
                  <motion.div key={activeApp} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <AppScreen />
                  </motion.div>
                ) : (
                  <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px 12px', padding: '10px 4px' }}>
                      {APPS.map(app => (
                        <div key={app.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <button 
                            onClick={() => { getAudioEngine().play('click'); setActiveApp(app.id); }}
                            style={{
                              width: 60, height: 60, borderRadius: 16,
                              background: `linear-gradient(135deg, ${app.color}, ${app.color}cc)`,
                              boxShadow: '0 6px 16px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.4)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', border: 'none', cursor: 'pointer', transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          >
                            <GameIcon name={app.icon} size={30} />
                          </button>
                          <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                            {app.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Home Indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 10px', flexShrink: 0, background: 'linear-gradient(to top, rgba(10,20,42,0.9), transparent)' }}>
              <button 
                onClick={() => { getAudioEngine().play('click'); setActiveApp(null); }}
                style={{ width: 130, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.5)', border: 'none', cursor: activeApp ? 'pointer' : 'default', transition: 'background 0.2s' }} 
                onMouseOver={activeApp ? (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.8)' : undefined}
                onMouseOut={activeApp ? (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.5)' : undefined}
              />
            </div>

          </motion.div>
        )}
        
        {phoneOpen && minimized && (
          <motion.div
            key="minimized-phone"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            style={{
              position: 'absolute',
              bottom: 84, // Right above the HUD phone button
              right: 20,
              zIndex: 55,
              pointerEvents: 'auto',
            }}
          >
            <button
              onClick={() => { getAudioEngine().play('click'); setMinimized(false); windowState.minimized = false; }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(10, 20, 42, 0.9)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                borderRadius: 24, padding: '8px 16px 8px 10px',
                color: '#fff', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }}>
                <GameIcon name="phone" size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>Phone</span>
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>Tap to open</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}