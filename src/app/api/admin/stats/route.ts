import { NextRequest, NextResponse } from "next/server";
import { readUsersDB } from "@/lib/auth-db";
import { verifyAdmin } from "@/lib/admin-db";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyAdmin(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = await readUsersDB();
  const users = db.users || [];
  return NextResponse.json({
    totalUsers: users.length,
    adminUsers: users.filter((u: any) => u.isAdmin).length,
    users: users.map((u: any) => ({ email: u.email, handle: u.handle, isAdmin: u.isAdmin, createdAt: u.createdAt })),
  });
}
