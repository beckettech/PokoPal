import { NextRequest, NextResponse } from "next/server";
import { readAdminConfig, writeAdminConfig, verifyAdmin } from "@/lib/admin-db";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyAdmin(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const config = await readAdminConfig();
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyAdmin(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const updates = await req.json();
  const current = await readAdminConfig();
  const merged = { ...current, ...updates };
  await writeAdminConfig(merged);
  return NextResponse.json(merged);
}
