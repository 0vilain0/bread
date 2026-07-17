import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tableId = url.searchParams.get("tableId");
  if (!tableId) {
    return NextResponse.json({ error: "tableId query param is required" }, { status: 400 });
  }

  const posts = await prisma.studyPost.findMany({
    where: { tableId: Number(tableId) },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { tableId, authorEmail, title, content, type, bountyPrice } = body;

  if (!tableId || !authorEmail || !title || !content || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const author = await prisma.profile.findUnique({ where: { email: authorEmail } });
  if (!author) {
    return NextResponse.json({ error: "Authenticated user not found" }, { status: 401 });
  }

  const member = await prisma.tableMember.findUnique({
    where: {
      profileId_tableId: {
        profileId: author.id,
        tableId: Number(tableId),
      },
    },
  });

  if (!member) {
    return NextResponse.json({ error: "User is not a member of this table" }, { status: 403 });
  }

  const normalizedType = type.toUpperCase();
  if (!["OFFER", "REQUEST"].includes(normalizedType)) {
    return NextResponse.json({ error: "Invalid post type" }, { status: 400 });
  }

  const price = Number(bountyPrice || 0);
  if (normalizedType === "REQUEST" && member.credits < price) {
    return NextResponse.json({ error: "Insufficient credits for request bounty" }, { status: 400 });
  }

  const post = await prisma.studyPost.create({
    data: {
      tableId: Number(tableId),
      authorId: author.id,
      title,
      content,
      type: normalizedType as "OFFER" | "REQUEST",
      bountyPrice: price,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
