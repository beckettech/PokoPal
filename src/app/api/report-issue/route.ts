import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, category, userEmail, handle, deviceInfo } = body;

    if (!description || description.length < 10) {
      return NextResponse.json({ error: 'Description must be at least 10 characters' }, { status: 400 });
    }

    // Log the report
    const report = {
      id: `rpt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      description,
      category: category || 'bug',
      userEmail: userEmail || null,
      handle: handle || null,
      deviceInfo: deviceInfo || {},
    };

    console.log(`[Report] New issue report: ${report.id} (${category}) from ${userEmail || 'anonymous'}`);
    console.log(`[Report] ${description.slice(0, 200)}`);

    // In production, this would send an email to becketthoefling@gmail.com
    // For now, reports are logged to server console
    // TODO: Integrate email service (Resend, SendGrid, etc.)

    return NextResponse.json({ success: true, id: report.id });
  } catch (error) {
    console.error('[Report] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
