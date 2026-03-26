import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

async function getUsers() {
  try {
    const data = await readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 });
    }

    const users = await getUsers();
    const user = users.find((u: any) => u.email === email.toLowerCase());

    if (!user || user.password !== btoa(password)) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    const token = crypto.randomUUID();

    return NextResponse.json({
      success: true,
      token,
      user: { email: user.email, handle: user.handle },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
