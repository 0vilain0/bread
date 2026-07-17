import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tableId = url.searchParams.get("tableId");
  const since = url.searchParams.get("since");

  if (!tableId) {
    return NextResponse.json({ error: "tableId query param is required" }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      tableId: Number(tableId),
      ...(since ? { createdAt: { gt: new Date(since) } } : {}),
    },
    orderBy: { createdAt: "asc" },
    include: { author: true },
  });

  return NextResponse.json({ messages });
}
