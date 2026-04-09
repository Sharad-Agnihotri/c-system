import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    // MOCKED SYSTEM: No database check, just return success
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const mockUser = {
      id,
      name: name || "Demo User",
      email: email || "demo@example.com",
      createdAt
    };

    const token = signToken({ userId: id, email: mockUser.email });

    const response = NextResponse.json({
      success: true,
      user: mockUser,
      token,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
