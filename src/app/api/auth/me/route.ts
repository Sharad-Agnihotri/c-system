import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql, initDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    await initDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { rows } = await sql`
      SELECT id, name, email, avatar, "createdAt" FROM users WHERE id = ${decoded.userId}
    `;
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
