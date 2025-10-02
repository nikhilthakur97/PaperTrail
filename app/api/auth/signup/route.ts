import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/database/db-server";
import { users, verificationTokens } from "@/app/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/app/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (email not verified yet)
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        emailVerified: null, // Will be set after email verification
      })
      .returning();

    // Generate verification token (crypto-secure random string)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token
    await db.insert(verificationTokens).values({
      identifier: email,
      token,
      expires,
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(email, token);

    if (!emailResult.success) {
      // If email fails, we should still create the account
      // but notify the user to contact support or resend
      console.error("Failed to send verification email:", emailResult.error);
      
      return NextResponse.json(
        {
          success: true,
          message: "Account created but failed to send verification email. Please try resending.",
          emailSent: false,
          user: {
            id: newUser[0].id,
            name: newUser[0].name,
            email: newUser[0].email,
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created! Please check your email to verify your account.",
        emailSent: true,
        user: {
          id: newUser[0].id,
          name: newUser[0].name,
          email: newUser[0].email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}

