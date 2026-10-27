// Claude API calls (direct from the browser with the user's own key).
import { PRINCIPLES, REFS, TIPS, INVITATIONS } from './content.js';

const API_URL = 'https://api.anthropic.com/v1/messages';

export async function callClaude({ apiKey, model, system, messages, maxTokens = 2000 }) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data.error && data.error.message) || ('HTTP ' + res.status));
  return (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
}

export function langName(l) { return l === 'en' ? 'English' : 'Japanese'; }

// ---------------------------------------------------------------------------
// Coach system prompt: method brief + curated references + tips
// ---------------------------------------------------------------------------
export function coachSystem(outLang) {
  const principles = PRINCIPLES.map((p, i) =>
    `${i + 1}. ${p.en.title} [evidence: ${p.evidence}] — ${p.en.body} Sources: ${p.refs.map((r) => REFS[r].cite).join(' | ')}`
  ).join('\n');
  const tips = TIPS.map((t) => `- tip:${t.id} (${t.category}, ${t.evidence}): ${t.en.title} — ${t.en.tryToday} [${t.refs.map((r) => REFS[r].cite.split('(')[0].trim()).join('; ')}]`).join('\n');
  return `You are the question coach inside "Question Garden", a personal app for growing "living questions".
You have deep expertise in how deep, meaningful questions are found, examined, reframed and refined, and in research on embodied cognition, dialogue and relational learning.

METHOD BRIEF (follow it):
${principles}

TECHNIQUES you may use — always name the technique and its source when you use one:
- Question burst / diverge first (Gregersen; QFT, Rothstein & Santana)
- Open ⇄ closed conversion and prioritizing (QFT, Rothstein & Santana)
- Surfacing and challenging assumptions / problematization (Alvesson & Sandberg 2011; Davis 1971)
- Socratic question types: clarification, assumptions, evidence, perspectives, implications (Paul & Elder)
- Why → What if → How progression (Berger, A More Beautiful Question / 『Q思考』)
- Embodied and relational practices from the TIPS list below

TIPS (embodied, place-based and relational practices, with evidence levels):
${tips}

RULES:
- The user is ALWAYS the author of their questions. Never silently rewrite the question. Offer options and ask; the user writes the next version.
- Only cite sources from this prompt. Never invent sources, studies, authors or findings. If unsure, say so.
- Separate well-supported findings, emerging/debated ideas, and your own interpretation when you mention research.
- Fragments are referenced as [F1], [F2]… Cite them when you draw on them. Never invent fragment content.
- Names may be anonymized as "Person A" etc. Keep them as-is.
- Be warm, concise and specific. No flattery.
- Write your entire answer in ${langName(outLang)}. The user's own words may be in either language; quote them as they are.`;
}

// Build fragment list text with F-indices; returns {text, map}
export function fragmentsBlock(frags, anon) {
  const map = {};
  const lines = frags.map((f, i) => {
    const key = 'F' + (i + 1);
    map[key] = f.id;
    const kind = f.type === 'experience' ? ` (experience: ${f.kind || ''})` : '';
    const body = anon((f.transcript || '').trim()) || '(audio only, no transcript)';
    const note = f.note ? ` — note: ${anon(f.note)}` : '';
    return `[${key}] ${new Date(f.createdAt).toISOString().slice(0, 10)}${kind}: ${body}${note}`;
  });
  return { text: lines.join('\n'), map };
}

export function questionBlock(q, versions, anon) {
  const hist = versions.map((v, i) => `v${i + 1} (${new Date(v.createdAt).toISOString().slice(0, 10)}): ${anon(v.text)}${v.why ? ` — why changed: ${anon(v.why)}` : ''}`).join('\n');
  return `QUESTION (current, stage: ${q.stage}): ${anon(q.text)}\nVERSION HISTORY:\n${hist || '(none)'}`;
}

export const PROMPTS = {
  summarize: (qb, fb) => `${qb}\n\nFRAGMENTS:\n${fb}\n\nTask: Summarize what these fragments say about the question in 4–7 short bullet points. Cite fragments like [F2]. End with one line: "Still open:" + the most important unresolved thread.`,
  connections: (fb) => `FRAGMENTS (from several questions; each line notes its question):\n${fb}\n\nTask: Find 3–5 meaningful connections between fragments and across questions (including across Japanese and English). For each: a short title, the fragments involved like [F1][F4], and one sentence on why the link matters. Then suggest one new question these connections open up (as a suggestion only).`,
  polish: (qb, fb) => `${qb}\n\nFRAGMENTS:\n${fb}\n\nTask: Coach me to refine this question. Respond ONLY with JSON (no markdown fences) in this shape:
{"reflection": "what my fragments suggest I really care about, citing [F#]",
 "assumption": "one hidden assumption in the current question, and why it matters",
 "alternatives": [{"text": "an alternative version of the question", "rationale": "one line", "technique": "technique name + source"}],
 "next_step": {"category": "body|place|people", "text": "ONE concrete embodied or relational next step", "tip": "tip id from the TIPS list or null"},
 "ask": "one question back to me that helps me write the next version myself"}
Give 2–3 alternatives: e.g., more open, narrower, reframed. Consider the stage (why / whatif / how).`,
  translate: (text, to) => `Translate the following into natural ${langName(to)}. Output only the translation.\n\n${text}`,
};

export function parseJSON(text) {
  try { return JSON.parse(text); } catch (e) {}
  const m = text.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch (e) {} }
  return null;
}

export { INVITATIONS };
