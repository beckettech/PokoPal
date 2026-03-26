import { NextRequest, NextResponse } from "next/server";
import { readAdminConfig, writeAdminConfig, verifyAdmin } from "@/lib/admin-db";

export async function GET() {
  const config = await readAdminConfig();
  // Check expiry
  if (config.broadcastExpiry && new Date(config.broadcastExpiry) < new Date()) {
    return NextResponse.json({ message: null });
  }
  return NextResponse.json({ message: config.broadcastMessage });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyAdmin(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { message, expiryHours } = await req.json();
  const config = await readAdminConfig();
  config.broadcastMessage = message || null;
  config.broadcastExpiry = expiryHours ? new Date(Date.now() + expiryHours * 3600000).toISOString() : null;
  await writeAdminConfig(config);
  return NextResponse.json(config);
}
