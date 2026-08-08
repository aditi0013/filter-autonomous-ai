import { NextResponse } from "next/server";
import { discoverTopics } from "@/lib/discovery";
import { evaluateTopics } from "@/lib/editorial";

export async function GET() {
  try {
    const topics = await discoverTopics(5);
    const decisions = await evaluateTopics(topics);

    return NextResponse.json({
      count: decisions.length,
      decisions,
    });
  } catch (error) {
    console.error("Editorial test failed:", error);

    return NextResponse.json(
      { error: "Failed to evaluate topics" },
      { status: 500 }
    );
  }
}