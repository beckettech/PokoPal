import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, handle } = await req.json();
    if (!email || !handle) {
      return NextResponse.json({ error: 'Missing email or handle' }, { status: 400 });
    }
    await sendWelcomeEmail({ email, handle });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Welcome] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
