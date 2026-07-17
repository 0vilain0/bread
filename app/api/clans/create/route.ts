import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description, userEmail } = body;

  if (!name || !userEmail) {
    return NextResponse.json({ error: "Name and userEmail are required" }, { status: 400 });
  }

  const user = await prisma.profile.findUnique({ where: { email: userEmail } });
  if (!user) {
    return NextResponse.json({ error: "Authenticated user not found" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Only super admins can create clans" }, { status: 403 });
  }

  const joinCode = [...Array(6)]
    .map(() => Math.random().toString(36).charAt(2).toUpperCase())
    .join("");

  const clan = await prisma.table.create({
    data: {
      name,
      description: description || "",
      joinCode,
      ownerId: user.id,
    },
  });

  return NextResponse.json({ clan }, { status: 201 });
}
