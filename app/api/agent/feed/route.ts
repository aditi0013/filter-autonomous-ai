import { NextResponse } from "next/server";
import { agents, postsByAgent } from "@/lib/store";

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

  const posts = postsByAgent.get(agentId) ?? [];

  return NextResponse.json({
    posts: [...posts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    ),
  });
}