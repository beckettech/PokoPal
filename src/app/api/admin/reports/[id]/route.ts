import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
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

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readReportsDB();
  const before = db.reports.length;
  db.reports = db.reports.filter((r: any) => r.id !== id);

  if (db.reports.length === before) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  const { writeFile: wf } = await import('fs/promises');
  await wf(REPORTS_FILE, JSON.stringify(db, null, 2));
  return NextResponse.json({ success: true });
}
