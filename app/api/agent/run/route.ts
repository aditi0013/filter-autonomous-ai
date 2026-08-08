import { NextResponse } from "next/server";
import { runAgentCycle } from "@/lib/agent";

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

    const posts = await runAgentCycle(agentId);

    return NextResponse.json({
      published: posts.length,
      posts,
    });
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
