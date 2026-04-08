import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const hashedPassword = await hashPassword(password);
    const createdAt = new Date().toISOString();

    // Insert user into database
    db.prepare(
      "INSERT INTO users (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)"
    ).run(id, name, email, hashedPassword, createdAt);

    // Generate JWT
    const token = signToken({ userId: id, email });

    // Set cookie and return success
    const response = NextResponse.json({
      success: true,
      user: { id, name, email, createdAt },
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
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
