import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
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

async function saveUsers(users: any[]) {
  await mkdir(path.dirname(USERS_FILE), { recursive: true });
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, handle } = await req.json();

    // Validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (handle.length < 2 || /\s/.test(handle)) {
      return NextResponse.json({ success: false, error: "Handle must be at least 2 characters with no spaces" }, { status: 400 });
    }

    const users = await getUsers();

    // Check duplicate email
    if (users.some((u: any) => u.email === email.toLowerCase())) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 409 });
    }

    const userId = crypto.randomUUID();
    const token = crypto.randomUUID();
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      password: btoa(password),
      handle: handle.toLowerCase().replace("@", ""),
      token,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await saveUsers(users);

    return NextResponse.json({
      success: true,
      token,
      user: { email: newUser.email, handle: newUser.handle },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
