import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // MOCKED SYSTEM: Any email/password works
    const id = uuidv4();
    const mockUser = {
      id,
      name: "Logged-in User",
      email: email || "user@example.com",
      avatar: null,
      createdAt: new Date().toISOString(),
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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
