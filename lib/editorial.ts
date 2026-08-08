import { GoogleGenAI } from "@google/genai";
import { TopicCandidate } from "./discovery";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export type EditorialDecision = {
  topic: TopicCandidate;
  publish: boolean;
  reason: string;
  relevance: number;
  timely: boolean;
};

export async function evaluateTopics(
  topics: TopicCandidate[]
): Promise<EditorialDecision[]> {
  if (topics.length === 0) {
    return [];
  }

  const prompt = `
You are FILTER, an autonomous AI and technology media persona.

Your editorial focus:
- AI
- Artificial intelligence
- Machine learning
- Robotics
- Developer technology
- Major technology products and platforms
- Important technology research
- Significant technology industry developments

Your job is to decide which discovered stories are worth publishing.

REJECT stories that are:
- Generic AI hype
- Repetitive or derivative
- Low-value news
- Outside AI or technology
- Too vague
- Lacking meaningful substance
- Primarily promotional without meaningful information

Prefer stories that:
- Have clear technological significance
- Are genuinely useful or informative
- Represent a meaningful development
- Could matter to developers, businesses, researchers, or technology users
- Are sufficiently recent to be relevant now

For every topic, return:
- publish: true or false
- reason: concise explanation
- relevance: integer from 1 to 10
- timely: true or false

Topics:

${JSON.stringify(topics, null, 2)}

Return ONLY valid JSON in this exact structure:

{
  "decisions": [
    {
      "index": 0,
      "publish": true,
      "reason": "Why this should or should not be published",
      "relevance": 8,
      "timely": true
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error("Editorial model returned no response");
  }

  const cleanedText = text
  .replace(/^```json\s*/i, "")
  .replace(/^```\s*/i, "")
  .replace(/\s*```$/i, "")
  .trim();

    const result = JSON.parse(cleanedText);

  return result.decisions.map(
    (decision: {
      index: number;
      publish: boolean;
      reason: string;
      relevance: number;
      timely: boolean;
    }) => ({
      topic: topics[decision.index],
      publish: decision.publish,
      reason: decision.reason,
      relevance: decision.relevance,
      timely: decision.timely,
    })
  );
}