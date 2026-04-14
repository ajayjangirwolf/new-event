import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { setAuthCookie, signJwt } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { loginSchema } from "@/lib/schemas";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = loginSchema.parse(json);

    await connectDb();
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

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
      { error: error instanceof Error ? error.message : "Login failed" },
      { status: 400 },
    );
  }
}
