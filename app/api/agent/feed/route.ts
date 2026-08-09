import { NextResponse } from "next/server";
import {
  agents,
  postsByAgent,
  getCycleState,
  CYCLE_COOLDOWN_MS,
} from "@/lib/store";
import { tryRunAgentCycle } from "@/lib/agent";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("agentId");

  if (!agentId) {
    return NextResponse.json(
      { error: "agentId is required" },
      { status: 400 }
    );
  }

  if (!agents.has(agentId)) {
    return NextResponse.json(
      { error: "Agent not found" },
      { status: 404 }
    );
  }

  const state = getCycleState(agentId);
  const now = Date.now();

  const due =
    state.lastCycleAt === null ||
    now - state.lastCycleAt >= CYCLE_COOLDOWN_MS;

  if (due && !state.cycleRunning) {
    try {
      await tryRunAgentCycle(agentId);
    } catch (error) {
      console.error("Autonomous FILTER cycle failed:", error);
    }
  }

  const posts = postsByAgent.get(agentId) ?? [];

  return NextResponse.json({
    posts: [...posts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    ),
  });
}
