// Vercel serverless function — proxies chat to the Claude API.
// The API key stays server-side (never shipped to the browser).
// Set ANTHROPIC_API_KEY (and optionally ANTHROPIC_MODEL) in Vercel → Settings → Environment Variables.

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
// Haiku 4.5 = fast + low cost, ideal for a website assistant. Override with ANTHROPIC_MODEL
// (e.g. "claude-opus-4-8" or "claude-sonnet-5") for higher quality.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5';

const SYSTEM_PROMPT = `You are the friendly AI assistant on Navneet Yadav's freelance developer portfolio website.

IMPORTANT — who you are:
- You are Navneet's website assistant, NOT Navneet himself. Always speak about him in the third person ("Navneet has…", "He can build…", "You can hire him…"). Never say "I am Navneet" or reply as if you were him.

About Navneet (use this to answer):
- Role: Freelance Full Stack Developer, 4+ years of hands-on experience, 50+ projects delivered.
- Skills — Frontend: React, Next.js, JavaScript, TypeScript, Tailwind CSS. Backend: Node.js, Python, Java, PHP, FastAPI, REST APIs. AI/ML: OpenAI API, LangChain, RAG systems, AI integration. Mobile: Android (Java/Kotlin), Firebase. DevOps: AWS, Docker, CI/CD, Git, Linux. Plus digital marketing (SEO, Google & Meta Ads).
- Services: custom websites & web apps, e-commerce platforms, AI/LLM integration, Android apps, custom dashboards, REST APIs. Available for remote work worldwide.
- Contact: email Navneetyadav8070@gmail.com, phone +91 8826999747, based in Greater Noida, India.

How to respond:
- Be professional, warm and concise (usually 2–5 sentences). Reply in the user's language (English, Hindi or Hinglish).
- Your goal is to help visitors understand what Navneet offers and gently encourage them to hire him or reach out via the Contact form on the page.
- If you don't know something, say so briefly and point them to the Contact form — do not invent facts.
- If a "USER PROJECT CONTEXT" block is provided, the user is a logged-in client; use it to answer questions about THEIR own projects (status, payments, timelines). Never invent project data beyond what's given.
- Plain text only — no markdown headings or code fences.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Not configured yet — the frontend falls back to its built-in answers.
    res.status(503).json({ error: 'not_configured' });
    return;
  }

  try {
    const body = req.body || {};
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];

    // Sanitise: only user/assistant text turns, keep the last 12, cap length.
    const messages = rawMessages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

    // The Messages API requires the first message to be from the user.
    while (messages.length && messages[0].role === 'assistant') messages.shift();
    if (messages.length === 0) {
      res.status(400).json({ error: 'no_messages' });
      return;
    }

    let system = SYSTEM_PROMPT;
    if (typeof body.context === 'string' && body.context.trim()) {
      system += `\n\nUSER PROJECT CONTEXT (the logged-in client's own data):\n${body.context.slice(0, 3000)}`;
    }

    const upstream = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 1024, system, messages }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      console.error('Anthropic API error:', upstream.status, detail);
      res.status(502).json({ error: 'upstream_error' });
      return;
    }

    const data = await upstream.json();

    if (data.stop_reason === 'refusal') {
      res.status(200).json({
        reply: "Sorry, I can't help with that one. For anything about Navneet's work, feel free to ask or use the Contact form.",
      });
      return;
    }

    const reply = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    res.status(200).json({ reply: reply || "Sorry, I didn't quite catch that. Could you rephrase?" });
  } catch (err) {
    console.error('chat handler error:', err);
    res.status(500).json({ error: 'server_error' });
  }
}
