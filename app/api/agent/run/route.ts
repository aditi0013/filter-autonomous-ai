import { NextResponse } from "next/server";
import { tryRunAgentCycle } from "@/lib/agent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentId } = body;

    if (!agentId || typeof agentId !== "string") {
      return NextResponse.json(
        { error: "agentId is required" },
        { status: 400 }
      );
    }

    const cycle = await tryRunAgentCycle(agentId);

    if (!cycle.started) {
      return NextResponse.json({
        discovered: 0,
        evaluated: 0,
        published: [],
        rejected: [],
      });
    }

    return NextResponse.json(cycle.result);
  } catch (error) {
    console.error("Agent cycle failed:", error);

    if (error instanceof Error && error.message === "Agent not found") {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Agent cycle failed" },
      { status: 500 }
    );
  }
}
