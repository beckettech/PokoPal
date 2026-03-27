import { NextRequest, NextResponse } from 'next/server';
import { sendBugReport } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, category, userEmail, handle, deviceInfo, page } = body;

    if (!description || description.length < 10) {
      return NextResponse.json({ error: 'Description must be at least 10 characters' }, { status: 400 });
    }

    const report = {
      id: `rpt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      description,
      category: category || 'bug',
      userEmail: userEmail || null,
      handle: handle || null,
      deviceInfo: deviceInfo || {},
      page: page || null,
    };

    console.log(`[Report] New issue report: ${report.id} (${category}) from ${userEmail || 'anonymous'}`);

    // Send email notification
    await sendBugReport({
      description: `[${category || 'bug'}] ${description}`,
      page: page || 'Unknown',
      userId: userEmail || handle || 'Anonymous',
      appVersion: deviceInfo?.appVersion || 'Unknown',
    });

    return NextResponse.json({ success: true, id: report.id });
  } catch (error) {
    console.error('[Report] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
