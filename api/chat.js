// Vercel serverless function — proxies chat to Google Gemini (free tier).
// The API key stays server-side (never shipped to the browser).
// Get a FREE key at https://aistudio.google.com/apikey and add it in
// Vercel → Settings → Environment Variables as GEMINI_API_KEY.

// Models are tried in order until one works (auto-recovers from a bad name).
const MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-1.5-flash',
].filter(Boolean);

const SYSTEM_PROMPT = `You are the friendly AI assistant on Navneet Yadav's freelance developer portfolio website.

WHO YOU ARE:
- You are Navneet's website assistant, NOT Navneet himself. Always speak about him in the third person ("Navneet has…", "He can build…"). Never reply as if you were him.

ABOUT NAVNEET:
- Freelance Full Stack Developer, 4+ years experience, 50+ projects delivered.
- Skills — Frontend: React, Next.js, JavaScript, TypeScript, Tailwind. Backend: Node.js, Python, Java, PHP, FastAPI, REST APIs. AI: OpenAI API, LangChain, RAG, AI integration. Mobile: Android (Java/Kotlin), Firebase. DevOps: AWS, Docker, CI/CD, Git. Plus SEO & Ads.
- Services: websites, web apps, e-commerce, AI integration, Android apps, dashboards, REST APIs. Remote, worldwide.
- Contact: Navneetyadav8070@gmail.com, +91 8826999747, Greater Noida, India.

HOW TO ANSWER (very important):
- Keep answers SHORT — 1 to 2 sentences, maximum ~40 words. Even for small or simple questions, reply briefly. Never write long paragraphs or lists unless the user explicitly asks for details.
- Reply in the user's language (English, Hindi or Hinglish). Plain text only — no markdown.
- Goal: help visitors understand what Navneet offers and nudge them to hire him or use the Contact form.
- If you don't know something, say so in one line and point to the Contact form. Never invent facts.
- If a "USER PROJECT CONTEXT" block is given, the user is a logged-in client — use it to answer about THEIR projects (status, payment, timeline) briefly. Never invent project data.`;

export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Quick diagnostic: GET /api/chat  →  is the key present, which models will be tried
  if (req.method === 'GET') {
    res.status(200).json({ ok: true, hasKey: !!apiKey, models: MODELS });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  if (!apiKey) {
    res.status(503).json({ error: 'not_configured' });
    return;
  }

  try {
    const body = req.body || {};
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];

    // Sanitise + convert to Gemini format (roles: "user" / "model").
    const contents = rawMessages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-12)
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content.slice(0, 2000) }],
      }));

    while (contents.length && contents[0].role === 'model') contents.shift();
    if (contents.length === 0) {
      res.status(400).json({ error: 'no_messages' });
      return;
    }

    let system = SYSTEM_PROMPT;
    if (typeof body.context === 'string' && body.context.trim()) {
      system += `\n\nUSER PROJECT CONTEXT (the logged-in client's own data):\n${body.context.slice(0, 3000)}`;
    }

    const payload = JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      // Bigger ceiling so the visible answer is never cut off — newer "flash"
      // models spend part of the budget on internal thinking. The answer still
      // stays short because the system prompt asks for 1-2 sentences.
      generationConfig: { temperature: 0.6, maxOutputTokens: 2048 },
    });

    let lastStatus = 0;
    let lastDetail = '';

    // Try each candidate model until one responds successfully.
    for (const model of MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      let upstream;
      try {
        upstream = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
          body: payload,
        });
      } catch (e) {
        lastStatus = 0;
        lastDetail = String(e && e.message ? e.message : e);
        continue;
      }

      if (!upstream.ok) {
        lastStatus = upstream.status;
        lastDetail = await upstream.text().catch(() => '');
        // 400/404 usually = bad model name → try the next candidate.
        // 401/403/429 = key/quota → the next model won't help, but trying is harmless.
        continue;
      }

      const data = await upstream.json();
      const cand = data.candidates && data.candidates[0];
      const reply = cand && cand.content && Array.isArray(cand.content.parts)
        ? cand.content.parts.map((p) => p.text || '').join('').trim()
        : '';

      if (reply) {
        res.status(200).json({ reply });
        return;
      }
      // Empty (safety block etc.) — don't keep looping models, just fall through.
      lastStatus = 200;
      lastDetail = JSON.stringify(data).slice(0, 300);
      break;
    }

    // Every model failed — surface the real reason so it can be fixed.
    console.error('Gemini failed:', lastStatus, lastDetail);
    res.status(502).json({
      error: 'upstream_error',
      status: lastStatus,
      detail: (lastDetail || '').slice(0, 400),
    });
  } catch (err) {
    console.error('chat handler error:', err);
    res.status(500).json({ error: 'server_error', detail: String(err && err.message ? err.message : err) });
  }
}
