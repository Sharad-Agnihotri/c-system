import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      const decoded = verifyToken(token);

      // MOCKED SYSTEM: Return user from token or mock info
      return NextResponse.json({
        success: true,
        user: {
          id: decoded.userId,
          name: "Active User",
          email: decoded.email,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (e) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
