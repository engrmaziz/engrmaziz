export type ChatTurn = { role: 'user' | 'assistant' | 'system'; content: string };

export type BookingSlots = {
  name?: string;
  email?: string;
  dateText?: string;
  timeText?: string;
  timezone?: string;
  agenda?: string;
};

export const MEETING_SENT =
  'Your meeting request has been sent. Musharraf will confirm the schedule shortly.';

const sessionTurns = new Map<string, ChatTurn[]>();
const MAX_TURNS = 32;

const DAY_RE =
  /\b(?:this|next)?\s*(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today)\b/i;
const DATE_RE = /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?\b/i;
const NUMERIC_DATE_RE = /\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b/;
const TIME_RE = /\b(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)\b/i;
const TZ_RE = /\b(us\s*eastern|eastern(?:\s+time)?|\bet\b|\best\b|\bedt\b|new york time)\b/i;
const AGENDA_RE =
  /(?:discuss(?:ing)?|talk about|agenda(?:\s+is)?|project(?:\s+is)?|need|want(?:\s+to)?)\s+(.{8,160}?)(?:[.!?]|$)/i;
const CONFIRM_RE =
  /\b(yes|yeah|yep|correct|confirmed?|that'?s right|as i (?:said|told)|exactly)\b/i;
const BOOKING_RE =
  /\b(book|meeting|discovery call|schedule|available|appointment|call with|saturday|sunday|monday|tuesday|wednesday|thursday|friday|\d{1,2}\s*(a\.?m\.?|p\.?m\.?)|eastern|agenda)\b/i;

function normalize(text: string): string {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function sameTurn(a: ChatTurn, b: ChatTurn): boolean {
  return a.role === b.role && normalize(a.content) === normalize(b.content);
}

export function rememberTurn(conversationId: string, role: ChatTurn['role'], content: string) {
  if (!conversationId || role === 'system') return;
  const text = normalize(content);
  if (!text) return;
  const prev = sessionTurns.get(conversationId) || [];
  const nextTurn: ChatTurn = { role, content: text };
  const last = prev[prev.length - 1];
  if (last && sameTurn(last, nextTurn)) return;
  const next = [...prev, nextTurn].slice(-MAX_TURNS);
  sessionTurns.set(conversationId, next);
}

export function recallTurns(conversationId: string): ChatTurn[] {
  if (!conversationId) return [];
  return [...(sessionTurns.get(conversationId) || [])];
}

export function mergeHistories(...lists: Array<ChatTurn[] | null | undefined>): ChatTurn[] {
  const out: ChatTurn[] = [];
  for (const list of lists) {
    if (!list) continue;
    for (const raw of list) {
      if (!raw || (raw.role !== 'user' && raw.role !== 'assistant')) continue;
      const turn: ChatTurn = { role: raw.role, content: normalize(raw.content) };
      if (!turn.content) continue;
      const last = out[out.length - 1];
      if (last && sameTurn(last, turn)) continue;
      const dup = out.findIndex((item) => sameTurn(item, turn));
      if (dup >= 0 && out.length - dup <= 3) continue;
      out.push(turn);
    }
  }
  return out.slice(-MAX_TURNS);
}

export function stripCurrentUserTurn(history: ChatTurn[], query: string): ChatTurn[] {
  const q = normalize(query);
  if (!q || !history.length) return history;
  const last = history[history.length - 1];
  if (last?.role === 'user' && normalize(last.content) === q) return history.slice(0, -1);
  return history;
}

export function alreadySentMeeting(history: ChatTurn[]): boolean {
  return history.some((turn) => turn.role === 'assistant' && /meeting request has been sent/i.test(turn.content));
}

export function isBookingQuery(query: string): boolean {
  return BOOKING_RE.test(query || '');
}

export function looksLikeConfirmation(query: string): boolean {
  return CONFIRM_RE.test(query || '');
}

function takeDate(text: string): string | undefined {
  return text.match(DAY_RE)?.[0] || text.match(DATE_RE)?.[0] || text.match(NUMERIC_DATE_RE)?.[0];
}

function takeTime(text: string): string | undefined {
  const match = text.match(TIME_RE);
  if (!match) return undefined;
  const hour = match[1];
  const mins = match[2] ? `:${match[2]}` : '';
  const mer = (match[3] || '').replace(/\./g, '').toLowerCase();
  return `${hour}${mins} ${mer}`;
}

function takeTimezone(text: string): string | undefined {
  const match = text.match(TZ_RE);
  if (!match) return undefined;
  return /eastern/i.test(match[0]) || /\bet\b/i.test(match[0]) ? 'US Eastern' : match[0];
}

function takeAgenda(text: string): string | undefined {
  const match = text.match(AGENDA_RE);
  if (match?.[1]) {
    const cleaned = match[1].replace(/\b(us\s*eastern(?:\s+time)?|please|thanks?)\b/gi, '').trim();
    if (cleaned.length >= 8) return cleaned.replace(/[.]+$/, '');
  }
  if (/\b(production[- ]grade|voice agent|call agent|chatbot|rag|workflow|automation)\b/i.test(text) && !/^(yes|yeah)\b/i.test(text.trim())) {
    return text.replace(CONFIRM_RE, '').replace(TZ_RE, '').replace(/\s+/g, ' ').trim().slice(0, 160);
  }
  return undefined;
}

export function extractBookingSlots(
  texts: string[],
  visitor?: { name?: string; email?: string }
): BookingSlots {
  const slots: BookingSlots = {};
  if (visitor?.name) slots.name = visitor.name;
  if (visitor?.email) slots.email = visitor.email;
  for (const raw of texts) {
    const text = normalize(raw);
    if (!text) continue;
    const dateText = takeDate(text);
    const timeText = takeTime(text);
    const timezone = takeTimezone(text);
    const agenda = takeAgenda(text);
    if (dateText) slots.dateText = dateText;
    if (timeText) slots.timeText = timeText;
    if (timezone) slots.timezone = timezone;
    if (agenda) slots.agenda = agenda;
  }
  return slots;
}

export function mergeBookingSlots(...parts: BookingSlots[]): BookingSlots {
  const slots: BookingSlots = {};
  for (const part of parts) {
    if (part.name) slots.name = part.name;
    if (part.email) slots.email = part.email;
    if (part.dateText) slots.dateText = part.dateText;
    if (part.timeText) slots.timeText = part.timeText;
    if (part.timezone) slots.timezone = part.timezone;
    if (part.agenda) slots.agenda = part.agenda;
  }
  return slots;
}

export function slotsFromSession(
  history: ChatTurn[],
  currentQuery: string,
  visitor?: { name?: string; email?: string }
): BookingSlots {
  const texts = [...history.map((turn) => turn.content), currentQuery];
  return extractBookingSlots(texts, visitor);
}

export function bookingComplete(slots: BookingSlots): boolean {
  return Boolean(slots.name && slots.email && slots.dateText && slots.timeText && slots.timezone && slots.agenda);
}

export function missingBookingFields(slots: BookingSlots): string[] {
  const missing: string[] = [];
  if (!slots.dateText) missing.push('preferred date');
  if (!slots.timeText) missing.push('preferred time');
  if (!slots.timezone) missing.push('timezone (US Eastern)');
  if (!slots.agenda) missing.push('what you want to discuss');
  return missing;
}

export function formatWhen(slots: BookingSlots): string {
  const bits = [slots.dateText, slots.timeText ? `at ${slots.timeText}` : '', slots.timezone].filter(Boolean);
  return bits.join(' ');
}

export function formatSessionState(slots: BookingSlots, historyCount: number): string {
  const known: string[] = [];
  if (slots.name) known.push(`Name: ${slots.name}`);
  if (slots.email) known.push(`Email: ${slots.email}`);
  if (slots.dateText) known.push(`Date: ${slots.dateText}`);
  if (slots.timeText) known.push(`Time: ${slots.timeText}`);
  if (slots.timezone) known.push(`Timezone: ${slots.timezone}`);
  if (slots.agenda) known.push(`Agenda: ${slots.agenda}`);
  const missing = missingBookingFields(slots);
  return [
    `Turns already in this session: ${historyCount}. Use them. Do not restart the conversation.`,
    known.length ? `Known booking fields:\n${known.map((line) => `- ${line}`).join('\n')}` : 'Known booking fields: name and email from the visitor block. Date/time/agenda still open.',
    missing.length ? `Ask ONLY for: ${missing.join(', ')}. Never re-ask a known field.` : 'All booking fields are known. Do not ask for date, time, timezone, or agenda again.',
  ].join('\n');
}

export function resolveBookingReply(opts: {
  slots: BookingSlots;
  query: string;
  history: ChatTurn[];
  channel: 'text' | 'voice';
}): string | null {
  const { slots, query, history, channel } = opts;
  if (alreadySentMeeting(history)) {
    return channel === 'voice'
      ? 'That meeting request is already with Musharraf. He will confirm the schedule shortly.'
      : 'That meeting request is already with Musharraf. He will confirm the schedule shortly.';
  }

  const bookingTurn = isBookingQuery(query) || Boolean(slots.dateText || slots.timeText || slots.agenda);
  if (!bookingTurn) return null;

  if (bookingComplete(slots) && (looksLikeConfirmation(query) || isBookingQuery(query))) {
    return channel === 'voice'
      ? `${MEETING_SENT} I have ${formatWhen(slots)} for ${slots.agenda}.`
      : MEETING_SENT;
  }

  if (bookingComplete(slots)) {
    return channel === 'voice'
      ? `I have ${formatWhen(slots)} to discuss ${slots.agenda}. Say yes and I will send the meeting request.`
      : `I have ${formatWhen(slots)} to discuss ${slots.agenda}. Reply yes and I will send the meeting request.`;
  }

  const missing = missingBookingFields(slots);
  if (!missing.length) return null;
  if (!slots.dateText && !slots.timeText && !isBookingQuery(query)) return null;

  const known = formatWhen(slots);
  const ask = missing[0];
  if (channel === 'voice') {
    return known
      ? `I have ${known}. I still need ${ask}.`
      : `I can book a twenty-minute discovery call. What ${ask} works in US Eastern?`;
  }
  return known
    ? `Noted: ${known}${slots.agenda ? ` — ${slots.agenda}` : ''}. I still need ${ask}.`
    : `A twenty-minute discovery call is the fastest way to start. What ${ask} works for you?`;
}

export function formatBookingEmail(slots: BookingSlots, history: ChatTurn[], latest: string): string {
  const transcript = history
    .concat(latest ? [{ role: 'user', content: latest }] : [])
    .map((turn) => `${turn.role === 'user' ? 'Visitor' : 'RAGX'}: ${turn.content}`)
    .join('\n\n');
  return [
    'Meeting request from RAGX',
    '',
    `Name: ${slots.name || 'Unknown'}`,
    `Email: ${slots.email || 'Unknown'}`,
    `When: ${formatWhen(slots) || 'Not captured'}`,
    `Agenda: ${slots.agenda || 'Not captured'}`,
    '',
    'Transcript:',
    transcript || latest,
  ].join('\n');
}
