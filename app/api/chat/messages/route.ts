import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tableId = url.searchParams.get("tableId");
  if (!tableId) {
    return NextResponse.json({ error: "tableId query param is required" }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: { tableId: Number(tableId) },
    orderBy: { createdAt: "asc" },
    include: { author: true },
  });

  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { tableId, authorEmail, content } = body;

  if (!tableId || !authorEmail || !content) {
    return NextResponse.json({ error: "tableId, authorEmail, and content are required" }, { status: 400 });
  }

  const author = await prisma.profile.findUnique({ where: { email: authorEmail } });
  if (!author) {
    return NextResponse.json({ error: "Authenticated user not found" }, { status: 401 });
  }

  const table = await prisma.table.findUnique({ where: { id: Number(tableId) } });
  if (!table) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: {
      tableId: Number(tableId),
      authorId: author.id,
      content,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
