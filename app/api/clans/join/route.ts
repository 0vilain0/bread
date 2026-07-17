import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { joinCode, userEmail } = body;

  if (!joinCode || !userEmail) {
    return NextResponse.json({ error: "joinCode and userEmail are required" }, { status: 400 });
  }

  const user = await prisma.profile.findUnique({ where: { email: userEmail } });
  if (!user) {
    return NextResponse.json({ error: "Authenticated user not found" }, { status: 401 });
  }

  const table = await prisma.table.findUnique({ where: { joinCode } });
  if (!table) {
    return NextResponse.json({ error: "Invalid join code" }, { status: 404 });
  }

  const existingMember = await prisma.tableMember.findUnique({
    where: {
      profileId_tableId: {
        profileId: user.id,
        tableId: table.id,
      },
    },
  });

  if (existingMember) {
    return NextResponse.json({ message: "Already joined", member: existingMember }, { status: 200 });
  }

  const member = await prisma.tableMember.create({
    data: {
      profileId: user.id,
      tableId: table.id,
      credits: 50,
    },
  });

  return NextResponse.json({ member }, { status: 201 });
}
