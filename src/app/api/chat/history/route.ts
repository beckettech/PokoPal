import { NextRequest, NextResponse } from "next/server";
import { readUsersDB, writeUsersDB } from "@/lib/auth-db";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// GET /api/chat/history?token=xxx
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await readUsersDB();
    const user = db.users.find((u: any) => u.token === token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return NextResponse.json({ messages: user.chatHistory || [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST /api/chat/history - Save a chat message
export async function POST(req: NextRequest) {
  try {
    const { token, message } = await req.json();
    if (!token || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const db = await readUsersDB();
    const userIndex = db.users.findIndex((u: any) => u.token === token);
    if (userIndex === -1) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const chatMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: message.role,
      content: message.content,
      timestamp: Date.now(),
    };

    if (!db.users[userIndex].chatHistory) {
      db.users[userIndex].chatHistory = [];
    }

    db.users[userIndex].chatHistory.push(chatMsg);

    // Keep last 50 messages per user
    if (db.users[userIndex].chatHistory.length > 50) {
      db.users[userIndex].chatHistory = db.users[userIndex].chatHistory.slice(-50);
    }

    await writeUsersDB(db);

    return NextResponse.json({ success: true, message: chatMsg });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE /api/chat/history?token=xxx - Clear chat history
export async function DELETE(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await readUsersDB();
    const userIndex = db.users.findIndex((u: any) => u.token === token);
    if (userIndex === -1) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    db.users[userIndex].chatHistory = [];
    await writeUsersDB(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
