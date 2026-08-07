import { NextResponse } from "next/server";

type Agent = {
  agentId: string;
  name: string;
  domain: string;
};

// Simple in-memory store for the prototype
export const agents = new Map<string, Agent>();

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

    agents.set(agentId, {
      agentId,
      name: persona.name,
      domain: persona.domain,
    });

    return NextResponse.json(
      { agentId },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request" },
      { status: 400 }
    );
  }
}