import { NextResponse } from "next/server";

import { generateRoadmap } from "@/lib/ai/generate";
import { getOfflineRoadmap, isOfflineBakingEnabled } from "@/lib/ai/offlineMode";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { current_job, target_job, hours_per_day } = body;

    if (
      typeof current_job !== "string" ||
      !current_job.trim() ||
      typeof target_job !== "string" ||
      !target_job.trim() ||
      typeof hours_per_day !== "number" ||
      hours_per_day < 0.5 ||
      hours_per_day > 24
    ) {
      return NextResponse.json(
        {
          detail:
            "current_job, target_job, and hours_per_day (0.5-24) are required",
        },
        { status: 400 }
      );
    }

    if (isOfflineBakingEnabled()) {
      return NextResponse.json(getOfflineRoadmap(), { status: 200 });
    }

    const roadmap = await generateRoadmap(
      current_job.trim(),
      target_job.trim(),
      hours_per_day
    );

    return NextResponse.json(roadmap, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate roadmap";

    const status = message.includes("must be") || message.includes("required")
      ? 400
      : 500;

    return NextResponse.json({ detail: message }, { status });
  }
}
