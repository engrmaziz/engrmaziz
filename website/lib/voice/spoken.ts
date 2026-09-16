const PATH_SPOKEN: Array<[RegExp, string]> = [
  [/https?:\/\/[^\s)]+/gi, ''],
  [/\[([^\]]+)\]\(([^)]+)\)/g, '$1'],
  [/\*\*([^*]+)\*\*/g, '$1'],
  [/\*([^*]+)\*/g, '$1'],
  [/`([^`]+)`/g, '$1'],
  [/^\s*#{1,6}\s+/gm, ''],
  [/^\s*[-*+]\s+/gm, ''],
  [/^\s*\d+\.\s+/gm, ''],
  [/\[(\d+)\]/g, ''],
  [/\bio@maziz\.me\b/gi, 'io at maziz.me'],
  [/\/hire\b/gi, 'the hire page'],
  [/\/about\b/gi, 'the about page'],
  [/\/contact\b/gi, 'the contact page'],
  [/\/services(?:\/[a-z0-9-]+)*/gi, 'the services page'],
  [/\/projects(?:\/[a-z0-9-]+)*/gi, 'the projects page'],
  [/Musharraf_Aziz_CV\.pdf/gi, 'Musharraf Aziz CV'],
  [/\bExplore\b:?/gi, ''],
];

export const VOICE_GREETING =
  'Hello. I am RAGX, Musharraf Aziz\'s assistant. Tell me what you want him to ship.';

export const VOICE_MISHEAR =
  'I did not catch that. Ask what Musharraf can ship, or how you would like to hire him.';

export function sttContextPrompt(visitorName?: string): string {
  const first = (visitorName || '').split(/\s+/)[0] || 'the visitor';
  return `English. ${first} is talking to an assistant named RAGX about hiring an engineer. Names that may appear: ${first}, RAGX, Musharraf Aziz. Topics: voice agents, RAG, chatbots, automation, hire.`;
}

export function toSpokenText(raw: string): string {
  let text = String(raw || '');
  for (const [pattern, replacement] of PATH_SPOKEN) {
    text = text.replace(pattern, replacement);
  }
  return text.replace(/\s+/g, ' ').replace(/\s+([,.!?])/g, '$1').trim();
}

export function withCalmDirection(text: string): string {
  return toSpokenText(text);
}

const TTS_MAX_CHARS = 180;

export function chunkForTts(raw: string, max = TTS_MAX_CHARS): string[] {
  const spoken = toSpokenText(raw);
  if (!spoken) return [];
  if (spoken.length <= max) return [spoken];

  const pieces: string[] = [];
  const { ready, rest } = pullCompleteSentences(`${spoken} `);
  const parts = [...ready, rest].map((part) => part.trim()).filter(Boolean);
  for (const part of parts.length ? parts : [spoken]) {
    if (part.length <= max) {
      pieces.push(part);
      continue;
    }
    let leftover = part;
    while (leftover.length > max) {
      const window = leftover.slice(0, max);
      const cut = Math.max(window.lastIndexOf(', '), window.lastIndexOf(' '));
      const at = cut >= 40 ? cut : max;
      pieces.push(leftover.slice(0, at).trim());
      leftover = leftover.slice(at).trim();
    }
    if (leftover) pieces.push(leftover);
  }
  return pieces.filter(Boolean);
}

export function pullCompleteSentences(buffer: string): { ready: string[]; rest: string } {
  const ready: string[] = [];
  let rest = buffer;
  const pattern = /[.!?](?:["')\]]+)?(?:\s+|$)/;
  while (rest.length >= 12) {
    const match = rest.match(pattern);
    if (!match || match.index === undefined) break;
    const end = match.index + match[0].length;
    const sentence = rest.slice(0, end).trim();
    rest = rest.slice(end);
    if (sentence.length >= 12) ready.push(sentence);
    else rest = `${sentence} ${rest}`.trim();
  }
  return { ready, rest };
}

export function spokenIntentReply(query: string, visitorName?: string): string | null {
  const msgLower = query.toLowerCase().trim();
  if (!msgLower) return null;
  const first = (visitorName || '').split(/\s+/)[0] || '';
  const isGreeting = /^(hello|hi|hey|greetings|how are you|good morning|good afternoon|what's up|yo)\b/.test(msgLower) && msgLower.length < 40;
  const isResume = /\b((download|get|send|share).{0,24}\b(resume|cv)|(resume|cv).{0,16}\b(download|pdf|file|link))\b/i.test(msgLower) && msgLower.length < 80;
  const isContact = /\b(contact|email|reach out|get in touch)\b/.test(msgLower) && msgLower.length < 50;
  if (isResume) {
    return `${first ? `${first}, you` : 'You'} can download Musharraf Aziz CV from the site. If you want the work instead, tell me whether you need a voice agent, a RAG system, or a hire.`;
  }
  if (isContact) {
    return 'Reach Musharraf at io at maziz.me, or use the contact page. Tell me the channel you need — voice, chat, RAG, or automation — and I will point you to the right next step.';
  }
  if (isGreeting) {
    return first
      ? `Hello ${first}. I am RAGX, Musharraf Aziz's assistant. Ask what he can ship, or how you would hire him.`
      : 'Hello. I am RAGX, Musharraf Aziz\'s assistant. Ask what he can ship, or how you would hire him.';
  }
  return null;
}

export function lockVisitorAddress(text: string, visitorName?: string): string {
  const spoken = toSpokenText(text);
  if (!spoken || !visitorName) return spoken;
  const first = visitorName.split(/\s+/)[0] || visitorName;
  if (/musharraf/i.test(visitorName)) return spoken;
  return spoken
    .replace(/\b(hello|hi|hey)\s+musharraf(?:\s+aziz)?\b/gi, `$1 ${first}`)
    .replace(/\byou are musharraf(?:\s+aziz)?\b/gi, `you are ${first}`)
    .replace(/\byour name is musharraf(?:\s+aziz)?\b/gi, `your name is ${first}`);
}
