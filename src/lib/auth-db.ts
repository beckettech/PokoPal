import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

interface UsersDB {
  users: any[];
}

export async function readUsersDB(): Promise<UsersDB> {
  try {
    const data = await readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { users: [] };
  }
}

export async function writeUsersDB(db: UsersDB): Promise<void> {
  await mkdir(path.dirname(USERS_FILE), { recursive: true });
  await writeFile(USERS_FILE, JSON.stringify(db, null, 2));
}
