import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { verifyAdmin } from "@/lib/admin-db";

const GIFTS_FILE = path.join(process.cwd(), "data", "mystery-gifts.json");

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyAdmin(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await readFile(GIFTS_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ gifts: [] });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyAdmin(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  await writeFile(GIFTS_FILE, JSON.stringify(data, null, 2));
  return NextResponse.json({ success: true });
}
