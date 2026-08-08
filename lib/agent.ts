import { discoverTopics } from "./discovery";
import { evaluateTopics } from "./editorial";
import { agents, postsByAgent, PublishedPost } from "./store";

export async function runAgentCycle(
  agentId: string,
  limit = 5
): Promise<PublishedPost[]> {
  const agent = agents.get(agentId);

  if (!agent) {
    throw new Error("Agent not found");
  }

  const topics = await discoverTopics(limit);
  const decisions = await evaluateTopics(topics);

  const publishedPosts: PublishedPost[] = [];

  for (const decision of decisions) {
    if (!decision.publish) {
      continue;
    }

    const post: PublishedPost = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      text: decision.topic.summary,
      rationale: decision.reason,
      sources: [decision.topic.sourceUrl],
      topic: decision.topic,
    };

    publishedPosts.push(post);
  }

  const existingPosts = postsByAgent.get(agentId) ?? [];

  postsByAgent.set(agentId, [
    ...existingPosts,
    ...publishedPosts,
  ]);

  return publishedPosts;
}
