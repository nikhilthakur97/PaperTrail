import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/database/db-server";
import { users } from "@/app/database/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists with this email
    const existingUser = await db
      .select({
        id: users.id,
        email: users.email,
        passwordHash: users.passwordHash,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({
        exists: false,
        message: "No account found with this email",
      });
    }

    const user = existingUser[0];

    // Check if user has password (or is OAuth-only)
    if (!user.passwordHash) {
      return NextResponse.json({
        exists: true,
        hasPassword: false,
        isVerified: !!user.emailVerified,
        message: "This email is linked to a Google account. Please sign in with Google.",
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json({
        exists: true,
        hasPassword: true,
        isVerified: false,
        message: "Please verify your email before signing in. Check your inbox for the verification link.",
      });
    }

    return NextResponse.json({
      exists: true,
      hasPassword: true,
      isVerified: true,
      message: "Email found. Please enter your password.",
    });
  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

