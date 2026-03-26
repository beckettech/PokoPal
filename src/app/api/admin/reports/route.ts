import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
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

export async function GET() {
  const db = await readReportsDB();
  return NextResponse.json(db.reports);
}
