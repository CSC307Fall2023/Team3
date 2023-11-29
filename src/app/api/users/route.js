import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const data = await request.json();
  const { username, email, password } = data;
  if (username && email && password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    try {
      user = await prisma.user.create({
        data: { username: username, email: email, password: hashedPassword }
      });
    } catch (e) {
      return NextResponse.json({error: e.message}, {status: 500 })
    }
    return NextResponse.json(user);
  }
  return NextResponse.json({ error: 'Username, Email, or Password not defined' }, { status: 500 });
}