import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  const payload = {
    from: process.env.RESEND_FROM_EMAIL || 'ragx@maziz.me',
    to: [process.env.ADMIN_EMAIL || 'io@maziz.me'],
    subject: `New Inquiry: General`,
    html: `<p>New contact from Test (test@test.com)</p><p>Message here</p>`
  };

  console.log("Payload:", payload);

  const { data, error } = await resend.emails.send(payload);
  console.log("Response:", data);
  console.log("Error:", error);
}

test();
