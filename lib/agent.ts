import { discoverTopics } from "./discovery";
import { evaluateTopics, EditorialDecision } from "./editorial";
import {
  checkTopicCovered,
  recordPublishedTopic,
} from "./memory";
import { agents, postsByAgent, PublishedPost } from "./store";

export type AgentCycleResult = {
  discovered: number;
  evaluated: number;
  published: PublishedPost[];
  rejected: EditorialDecision[];
};

export async function runAgentCycle(
  agentId: string,
  limit = 5
): Promise<AgentCycleResult> {
  const agent = agents.get(agentId);

  if (!agent) {
    throw new Error("Agent not found");
  }

  // 1. Discover live topics
  const topics = await discoverTopics(limit);

  // 2. Let FILTER make editorial decisions
  const decisions = await evaluateTopics(topics);

  const publishedPosts: PublishedPost[] = [];
  const rejected: EditorialDecision[] = [];

  // 3. Apply memory before publishing
  for (const decision of decisions) {
    if (!decision.publish) {
      rejected.push(decision);
      continue;
    }

    const memoryCheck = checkTopicCovered(decision.topic);

    if (memoryCheck.covered) {
      rejected.push({
        ...decision,
        publish: false,
        reason: `Rejected by memory: ${memoryCheck.reason}`,
      });

      console.log(
        `FILTER skipped duplicate topic: ${memoryCheck.reason}`
      );

      continue;
    }

    // 4. Publish accepted topic
    const post: PublishedPost = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      text: decision.topic.summary,
      rationale: decision.reason,
      sources: [decision.topic.sourceUrl],
      topic: decision.topic,
    };

    publishedPosts.push(post);

    // 5. Remember published topic
    recordPublishedTopic(decision.topic);
  }

  // 6. Store published posts for this agent
  const existingPosts = postsByAgent.get(agentId) ?? [];

  postsByAgent.set(agentId, [
    ...existingPosts,
    ...publishedPosts,
  ]);

  return {
    discovered: topics.length,
    evaluated: decisions.length,
    published: publishedPosts,
    rejected,
  };
}