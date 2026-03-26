import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const REPORTS_FILE = path.join(process.cwd(), 'data', 'reports.json');

async function readReportsDB() {
  try {
    const data = await readFile(REPORTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { reports: [] };
  }
}

async function writeReportsDB(db: { reports: any[] }) {
  await mkdir(path.dirname(REPORTS_FILE), { recursive: true });
  await writeFile(REPORTS_FILE, JSON.stringify(db, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, category, attachments, userEmail, handle, deviceInfo } = body;

    if (!description || description.length < 10) {
      return NextResponse.json({ error: 'Description must be at least 10 characters' }, { status: 400 });
    }

    const db = await readReportsDB();
    const report = {
      id: `rpt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      description,
      category: category || 'bug',
      attachments: attachments || [],
      userEmail: userEmail || null,
      handle: handle || null,
      deviceInfo: deviceInfo || {},
    };

    db.reports.unshift(report);
    await writeReportsDB(db);

    console.log(`[Report] New issue report: ${report.id} (${category}) from ${userEmail || 'anonymous'}`);
    console.log(`[Report] ${description.slice(0, 100)}`);

    return NextResponse.json({ success: true, id: report.id });
  } catch (error) {
    console.error('[Report] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
