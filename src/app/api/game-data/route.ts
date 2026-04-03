// /api/game-data/route.ts — Serve game data overrides for remote updates
// GET: Returns current data version and overrides
// POST: Admin endpoint to update data (requires admin key)

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'game-data.json');
const ADMIN_KEY = process.env.ADMIN_KEY || 'pokopia-admin-2026';

interface GameDataEntry {
  type: 'pokemon' | 'request';
  id: string | number;
  field: string;
  value: any;
  reason?: string;
}

function loadData(): { version: string; overrides: Record<string, any>; entries: GameDataEntry[] } {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { version: '0', overrides: {}, entries: [] };
  }
}

function saveData(data: any) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Build overrides from entries
function buildOverrides(entries: GameDataEntry[]): Record<string, any> {
  const overrides: Record<string, any> = {};
  for (const entry of entries) {
    const collection = entry.type === 'pokemon' ? 'pokemon' : 'requests';
    if (!overrides[collection]) overrides[collection] = {};
    if (!overrides[collection][String(entry.id)]) overrides[collection][String(entry.id)] = {};
    overrides[collection][String(entry.id)][entry.field] = entry.value;
  }
  return overrides;
}

// GET — return current game data version and overrides
export async function GET() {
  const data = loadData();
  return NextResponse.json({
    version: data.version,
    overrides: data.overrides,
    _entryCount: data.entries.length,
  });
}

// POST — add a data override (admin only)
export async function POST(request: NextRequest) {
  const auth = request.headers.get('x-admin-key');
  if (auth !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { type, id, field, value, reason, reset } = body;

  // Reset all overrides
  if (reset) {
    const fresh = { version: '0', overrides: {}, entries: [] };
    saveData(fresh);
    return NextResponse.json({ success: true, message: 'All overrides reset', data: fresh });
  }

  if (!type || id == null || !field || value === undefined) {
    return NextResponse.json({ error: 'Missing required fields: type, id, field, value' }, { status: 400 });
  }

  const data = loadData();
  data.version = String(Date.now());

  // Check if entry already exists for same type/id/field
  const existingIdx = data.entries.findIndex(
    (e: GameDataEntry) => e.type === type && String(e.id) === String(id) && e.field === field
  );

  const entry: GameDataEntry = { type, id, field, value, reason };
  if (existingIdx >= 0) {
    data.entries[existingIdx] = entry;
  } else {
    data.entries.push(entry);
  }

  // Rebuild overrides
  data.overrides = buildOverrides(data.entries);
  saveData(data);

  return NextResponse.json({ success: true, entry, version: data.version });
}

// DELETE — remove a specific override
export async function DELETE(request: NextRequest) {
  const auth = request.headers.get('x-admin-key');
  if (auth !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const field = searchParams.get('field');

  if (!type || !id || !field) {
    return NextResponse.json({ error: 'Missing type, id, or field' }, { status: 400 });
  }

  const data = loadData();
  data.entries = data.entries.filter(
    (e: GameDataEntry) => !(e.type === type && String(e.id) === String(id) && e.field === field)
  );
  data.version = String(Date.now());
  data.overrides = buildOverrides(data.entries);
  saveData(data);

  return NextResponse.json({ success: true, remaining: data.entries.length });
}
