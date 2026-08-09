import { NextResponse } from "next/server";
import {
  agents,
  postsByAgent,
  cycleStateByAgent,
  Agent,
} from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { persona } = body;

    if (
      !persona ||
      typeof persona.name !== "string" ||
      typeof persona.domain !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid persona data" },
        { status: 400 }
      );
    }

    const agentId = crypto.randomUUID();

    const agent: Agent = {
      agentId,
      name: persona.name,
      domain: persona.domain,
    };

    agents.set(agentId, agent);
    postsByAgent.set(agentId, []);

cycleStateByAgent.set(agentId, {
  lastCycleAt: null,
  cycleRunning: false,
});

    return NextResponse.json({ agentId }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request" },
      { status: 400 }
    );
  }
}