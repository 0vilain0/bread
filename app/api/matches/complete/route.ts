import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { matchId, learnerEmail, teacherEmail } = body;

  if (!matchId || !learnerEmail || !teacherEmail) {
    return NextResponse.json({ error: "matchId, learnerEmail, and teacherEmail are required" }, { status: 400 });
  }

  const learner = await prisma.profile.findUnique({ where: { email: learnerEmail } });
  const teacher = await prisma.profile.findUnique({ where: { email: teacherEmail } });
  if (!learner || !teacher) {
    return NextResponse.json({ error: "Learner or teacher not found" }, { status: 404 });
  }

  const match = await prisma.match.findUnique({ where: { id: Number(matchId) } });
  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }
  if (match.status !== "PENDING") {
    return NextResponse.json({ error: "Match is not pending" }, { status: 400 });
  }

  const learnerMember = await prisma.tableMember.findUnique({
    where: {
      profileId_tableId: {
        profileId: learner.id,
        tableId: match.tableId,
      },
    },
  });

  const teacherMember = await prisma.tableMember.findUnique({
    where: {
      profileId_tableId: {
        profileId: teacher.id,
        tableId: match.tableId,
      },
    },
  });

  if (!learnerMember || !teacherMember) {
    return NextResponse.json({ error: "Learner or teacher is not a member of the table" }, { status: 403 });
  }

  if (learnerMember.credits < match.bountyPrice) {
    return NextResponse.json({ error: "Insufficient learner credits" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx: any) => {
      const learnerRow = await (tx.$queryRawUnsafe as any)(
        `SELECT id, credits FROM "TableMember" WHERE "profileId" = $1 AND "tableId" = $2 FOR UPDATE`,
        learner.id,
        match.tableId
      );

      const teacherRow = await (tx.$queryRawUnsafe as any)(
        `SELECT id, credits FROM "TableMember" WHERE "profileId" = $1 AND "tableId" = $2 FOR UPDATE`,
        teacher.id,
        match.tableId
      );

      if (learnerRow.length === 0 || teacherRow.length === 0) {
        throw new Error("Learner or teacher membership not found under lock");
      }

      const lockedLearner = learnerRow[0];
      const lockedTeacher = teacherRow[0];

      if (lockedLearner.credits < match.bountyPrice) {
        throw new Error("Insufficient credits after lock");
      }

      const updatedLearner = await tx.tableMember.update({
        where: { id: lockedLearner.id },
        data: { credits: lockedLearner.credits - match.bountyPrice },
      });

      const updatedTeacher = await tx.tableMember.update({
        where: { id: lockedTeacher.id },
        data: { credits: lockedTeacher.credits + match.bountyPrice },
      });

      const updatedMatch = await tx.match.update({
        where: { id: Number(matchId) },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      return { updatedLearner, updatedTeacher, updatedMatch };
    });

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
