import {
  alreadySentMeeting,
  bookingComplete,
  MEETING_SENT,
  resolveBookingReply,
  slotsFromSession,
  type ChatTurn,
} from '../lib/rag/session-memory';

const visitor = { name: 'maziz', email: 'maziz@example.com' };

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
  console.log(`[ok] ${message}`);
}

const history: ChatTurn[] = [
  { role: 'assistant', content: 'Hello maziz. I am RAGX.' },
  { role: 'user', content: 'Do he build voice agents?' },
  { role: 'assistant', content: 'Yes, Musharraf builds production-grade AI voice agents.' },
  { role: 'user', content: 'How to work on Discovery Call with them?' },
  { role: 'assistant', content: 'A discovery call is the best way to start. Please share your preferred date and time in US Eastern.' },
  { role: 'user', content: 'I am available this Saturday at 4 p.m.' },
  { role: 'assistant', content: 'Please confirm if 4 p.m. is US Eastern time. Also, what specific AI project would you like to discuss?' },
];

const confirm = 'Yes, it is US Eastern Time and I would like to discuss a production grade AI agent.';
const slots = slotsFromSession(history, confirm, visitor);
assert(Boolean(slots.dateText && /saturday/i.test(slots.dateText)), `captured Saturday, got ${slots.dateText}`);
assert(Boolean(slots.timeText && /4/.test(slots.timeText)), `captured 4pm, got ${slots.timeText}`);
assert(slots.timezone === 'US Eastern', `captured timezone, got ${slots.timezone}`);
assert(Boolean(slots.agenda && /production/i.test(slots.agenda)), `captured agenda, got ${slots.agenda}`);
assert(bookingComplete(slots), 'slots complete after confirm');

const reply = resolveBookingReply({ slots, query: confirm, history, channel: 'text' });
assert(Boolean(reply && reply.includes(MEETING_SENT)), `confirmation reply, got ${reply}`);
assert(!alreadySentMeeting(history), 'not already sent before confirm');

const repeat = resolveBookingReply({
  slots,
  query: 'As I said earlier, this Saturday, 4 p.m. US Eastern Time.',
  history: [...history, { role: 'user', content: confirm }, { role: 'assistant', content: MEETING_SENT }],
  channel: 'text',
});
assert(Boolean(repeat && /already/i.test(repeat)), `no re-ask after send, got ${repeat}`);

console.log('session memory smoke passed');
