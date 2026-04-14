import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { setAuthCookie, signJwt } from "@/lib/auth";
import { signupSchema } from "@/lib/schemas";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = signupSchema.parse(json);

    await connectDb();

    const existing = await User.findOne({ email: data.email }).lean();
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    });

    const token = signJwt({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Signup failed" },
      { status: 400 },
    );
  }
}
