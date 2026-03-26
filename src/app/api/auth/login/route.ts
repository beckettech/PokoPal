import { NextRequest, NextResponse } from "next/server";
import { readUsersDB, writeUsersDB } from "@/lib/auth-db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 });
    }

    const db = await readUsersDB();
    const user = db.users.find((u: any) => u.email === email.toLowerCase());

    if (!user || user.password !== btoa(password)) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    // Auto-admin for hardcoded email
    if (user.email === "becketthoefling@gmail.com") {
      user.isAdmin = true;
    }

    // Rotate token on login
    const token = crypto.randomUUID();
    user.token = token;
    await writeUsersDB(db);

    return NextResponse.json({
      success: true,
      token,
      user: { email: user.email, handle: user.handle, isAdmin: user.isAdmin || false },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
