import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Missing RESEND_API_KEY');
  return new Resend(key);
}

export async function sendEmail({
  to,
  subject,
  html,
  from = 'Pokopia Guide <noreply@pokopal.com>',
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const { data, error } = await getResend().emails.send({
      from,
      to,
      subject,
      html,
    });
    if (error) {
      console.error('Resend error:', error);
      return false;
    }
    console.log('Email sent:', data?.id);
    return true;
  } catch (e) {
    console.error('Email send error:', e);
    return false;
  }
}

export async function sendBugReport({
  description,
  page,
  userId,
  appVersion,
}: {
  description: string;
  page?: string;
  userId?: string;
  appVersion?: string;
}) {
  return sendEmail({
    to: 'becketthoefling@gmail.com',
    subject: `🐛 Bug Report: ${page || 'Unknown Page'}`,
    html: `
      <h2>Pokopia Guide Bug Report</h2>
      <p><strong>Page:</strong> ${page || 'Unknown'}</p>
      <p><strong>User:</strong> ${userId || 'Not logged in'}</p>
      <p><strong>Version:</strong> ${appVersion || 'Unknown'}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <hr>
      <p>${description.replace(/\n/g, '<br>')}</p>
    `,
  });
}

export async function sendWelcomeEmail({ email, handle }: { email: string; handle: string }) {
  return sendEmail({
    to: email,
    subject: 'Welcome to Pokopia Guide! 🎮',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #EF4444;">🎮 Welcome to Pokopia Guide!</h1>
        <p>Thanks for joining — your ultimate Pokémon Pokopia companion!</p>
        <h3>What you can do:</h3>
        <ul>
          <li>📖 Browse the full Pokédex with 300+ Pokémon</li>
          <li>🗺️ Explore habitats & locations</li>
          <li>🏠 Discover habitat requirements & recipes</li>
          <li>💬 Chat with Dexter AI for instant help</li>
          <li>🔍 Track captured & discovered Pokémon</li>
          <li>🎭 View all forms, rarities & specialties</li>
        </ul>
        <p style="color: #666;">More features coming soon — stay tuned!</p>
        <p style="color: #999; font-size: 12px;">Pokopia Guide — <a href="https://pokopal.com">pokopal.com</a></p>
      </div>
    `,
  });
}
