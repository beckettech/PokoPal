import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { readUsersDB } from "./auth-db";

const ADMIN_CONFIG_FILE = path.join(process.cwd(), "data", "admin-config.json");

const DEFAULT_CONFIG = {
  broadcastMessage: null,
  broadcastExpiry: null,
  dataVersion: 1,
};

export async function readAdminConfig() {
  try {
    const data = await readFile(ADMIN_CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export async function writeAdminConfig(config: any) {
  await mkdir(path.dirname(ADMIN_CONFIG_FILE), { recursive: true });
  await writeFile(ADMIN_CONFIG_FILE, JSON.stringify(config, null, 2));
}

export async function verifyAdmin(token: string): Promise<boolean> {
  const db = await readUsersDB();
  const user = db.users.find((u: any) => u.token === token && u.isAdmin);
  return !!user;
}
