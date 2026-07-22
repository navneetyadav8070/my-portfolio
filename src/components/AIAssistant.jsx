import { useState, useEffect, useRef } from 'react';
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import { onAuthChange, getClientProjects } from '../firebase/config';

// ---------- Navneet ke baare me knowledge (guest ko dikhega) ----------
const OWNER = {
  name: 'Navneet Yadav',
  role: 'Freelance Full Stack Developer',
  email: 'Navneetyadav8070@gmail.com',
  phone: '+91 8826999747',
  location: 'Greater Noida, India (Remote — worldwide)',
};

const money = (a) => '₹' + (Number(a) || 0).toLocaleString('en-IN');

const STATUS_LABEL = {
  not_started: 'Not Started',
  in_progress: 'In Process',
  in_review: 'In Review',
  on_hold: 'On Hold',
  completed: 'Completed',
};
const statusOf = (p) => STATUS_LABEL[p.workStatus || (Number(p.progress) >= 100 ? 'completed' : 'in_progress')] || 'In Process';

// Static answers about Navneet
const ANSWERS = {
  projects:
    `${OWNER.name} has delivered 50+ projects — including custom e-commerce platforms (React + FastAPI), realtime Firebase apps, Telegram automation bots, custom dashboards and AI-integrated products.\n\n👉 Scroll to the "Projects" section to see featured work.`,
  skills:
    `Here's what ${OWNER.name} works with:\n\n• Frontend: React, Next.js, JavaScript, TypeScript, Tailwind CSS\n• Backend: Node.js, Python, Java, PHP, FastAPI, REST APIs\n• AI/ML: OpenAI API, LangChain, RAG systems, AI integration\n• Mobile: Android (Java/Kotlin), Firebase\n• DevOps: AWS, Docker, CI/CD, Git, Linux\n• Marketing: SEO, Google & Meta Ads`,
  experience:
    `${OWNER.name} has 4+ years of hands-on experience building websites, web apps, Android apps and AI integrations — combined with digital marketing to help products actually grow.`,
  services:
    `${OWNER.name} offers:\n\n• Custom websites & web apps\n• E-commerce platforms\n• AI/LLM integration\n• Android apps\n• Custom dashboards & REST APIs\n• Digital marketing (SEO / Ads)\n\nAvailable for remote projects worldwide. 🌍`,
  contact:
    `You can reach ${OWNER.name} here:\n\n📧 ${OWNER.email}\n📞 ${OWNER.phone}\n📍 ${OWNER.location}\n\nOr use the Contact form on this page.`,
};

// Guest quick commands (English)
const GUEST_COMMANDS = [
  { label: 'How many projects?', key: 'projects' },
  { label: 'What skills do you have?', key: 'skills' },
  { label: 'How much experience?', key: 'experience' },
  { label: 'What services do you offer?', key: 'services' },
  { label: 'How to contact?', key: 'contact' },
];

// Logged-in extra commands
const USER_COMMANDS = [
  { label: 'My project status', key: 'status' },
  { label: 'Payment details', key: 'payment' },
  { label: 'Estimated time', key: 'eta' },
];

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState(null); // null = not loaded
  const [messages, setMessages] = useState([
    { from: 'bot', text: `Hi! 👋 I'm ${OWNER.name}'s assistant. Ask me about his projects, skills, experience or services. Just tap a suggestion below.` },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // Auth state
  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        try {
          const res = await getClientProjects(u.email);
          setProjects(res.docs.map((d) => ({ id: d.id, ...d.data() })));
        } catch {
          setProjects([]);
        }
      } else {
        setProjects(null);
      }
    });
    return () => unsub();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const pushBot = (text) => setMessages((m) => [...m, { from: 'bot', text }]);
  const pushUser = (text) => setMessages((m) => [...m, { from: 'user', text }]);

  // ---------- Logged-in answers (live project data) ----------
  const projectStatusAnswer = () => {
    if (!projects || projects.length === 0) return `You don't have any active projects yet. Start one from the Services section and I'll track it here! 🚀`;
    return `Your projects (${projects.length}):\n\n` + projects.map((p) =>
      `• ${p.projectName || 'Project'} — ${statusOf(p)} (${Number(p.progress) || 0}% done)`
    ).join('\n');
  };

  const paymentAnswer = () => {
    if (!projects || projects.length === 0) return `No payments yet. Once you start a project, your payment details will show up here.`;
    const paid = projects.reduce((s, p) => s + (Number(p.paidAmount) || 0), 0);
    const remaining = projects.reduce((s, p) => s + (Number(p.remainingAmount) || 0), 0);
    const lines = projects.map((p) =>
      `• ${p.projectName || 'Project'}: paid ${money(p.paidAmount)} of ${money(p.totalAmount)}` +
      ((Number(p.remainingAmount) || 0) > 0 ? `, remaining ${money(p.remainingAmount)}` : ' — fully paid ✅')
    ).join('\n');
    return `${lines}\n\nTotal paid: ${money(paid)}\nTotal remaining (bakaya): ${money(remaining)}`;
  };

  const etaAnswer = () => {
    if (!projects || projects.length === 0) return `No active projects, so no timelines yet.`;
    return `Estimated timelines:\n\n` + projects.map((p) =>
      `• ${p.projectName || 'Project'}: ${p.estimatedTime || 'TBD'} — currently ${statusOf(p)}`
    ).join('\n');
  };

  // ---------- Resolve a command/keyword to a reply ----------
  const answerFor = (key) => {
    if (ANSWERS[key]) return ANSWERS[key];
    if (['status', 'payment', 'eta'].includes(key)) {
      if (!user) return `🔒 Please login to your account to see your project tracking (status, payments & timelines).`;
      if (key === 'status') return projectStatusAnswer();
      if (key === 'payment') return paymentAnswer();
      if (key === 'eta') return etaAnswer();
    }
    return `I can help with: projects, skills, experience, services and contact.${user ? ' You can also ask about your project status, payments or estimated time.' : ''}`;
  };

  const runCommand = (cmd) => {
    pushUser(cmd.label);
    setTimeout(() => pushBot(answerFor(cmd.key)), 250);
  };

  const detectKey = (t) => {
    const s = t.toLowerCase();
    if (/(payment|paid|amount|bakaya|remain|balance|pay\b)/.test(s)) return 'payment';
    if (/(time|eta|duration|deadline|samay|long)/.test(s)) return 'eta';
    if (/(status|track|progress|my project)/.test(s)) return 'status';
    if (/(project|work|portfolio)/.test(s)) return 'projects';
    if (/(skill|tech|stack|technolog)/.test(s)) return 'skills';
    if (/(experience|years|expert)/.test(s)) return 'experience';
    if (/(service|offer|build|make)/.test(s)) return 'services';
    if (/(contact|email|phone|reach|hire|available)/.test(s)) return 'contact';
    return 'help';
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    pushUser(text);
    setInput('');
    const key = detectKey(text);
    setTimeout(() => pushBot(answerFor(key)), 250);
  };

  const commands = user ? [...USER_COMMANDS, ...GUEST_COMMANDS] : GUEST_COMMANDS;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      {/* ---------- Chat panel ---------- */}
      {open && (
        <div className="w-[calc(100vw-2.5rem)] sm:w-96 h-[68vh] max-h-[540px] glass rounded-2xl border border-accent/20 shadow-2xl shadow-black/50 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10 bg-dark/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-green-400 flex items-center justify-center text-dark shrink-0">
                <FaRobot size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">Portfolio Assistant</p>
                <p className="text-[11px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-1">
              <FaTimes size={16} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line break-words ${
                  m.from === 'user'
                    ? 'bg-accent text-dark rounded-br-sm font-medium'
                    : 'bg-white/5 text-gray-200 border border-white/5 rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick commands */}
          <div className="px-3 pt-2 pb-1 flex gap-2 overflow-x-auto border-t border-white/5">
            {commands.map((c) => (
              <button
                key={c.key}
                onClick={() => runCommand(c)}
                className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all shrink-0"
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 flex items-center gap-2 border-t border-white/5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              aria-label="Type your question"
              className="flex-1 min-w-0 px-3.5 py-2.5 bg-dark text-white text-sm rounded-xl border border-white/10 focus:border-accent focus:outline-none"
            />
            <button type="submit" aria-label="Send message" className="w-10 h-10 shrink-0 rounded-xl bg-accent text-dark flex items-center justify-center hover:bg-accent-hover transition-all">
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      )}

      {/* ---------- Floating button ---------- */}
      <button
        type="button"
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-accent to-green-400 text-dark flex items-center justify-center shadow-xl shadow-accent/30 hover:scale-105 active:scale-95 transition-transform outline-none"
      >
        {open ? <FaTimes size={20} /> : <FaCommentDots size={22} />}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-dark rounded-full flex items-center justify-center">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          </span>
        )}
      </button>
    </div>
  );
};

export default AIAssistant;
