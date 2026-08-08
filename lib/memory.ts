import { TopicCandidate } from "./discovery";

type MemoryRecord = {
  topic: TopicCandidate;
  recordedAt: string;
};

export type MemoryCheckResult = {
  covered: boolean;
  reason: string;
  matchedTopic?: TopicCandidate;
};

const publishedMemory: MemoryRecord[] = [];

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "with",
  "is",
  "are",
  "new",
  "latest",
  "news",
]);

function getKeywords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
  );
}

function similarity(a: string, b: string): number {
  const wordsA = getKeywords(a);
  const wordsB = getKeywords(b);

  if (wordsA.size === 0 || wordsB.size === 0) {
    return 0;
  }

  const intersection = [...wordsA].filter((word) => wordsB.has(word));
  const union = new Set([...wordsA, ...wordsB]);

  return intersection.length / union.size;
}

export function recordPublishedTopic(topic: TopicCandidate): void {
  publishedMemory.push({
    topic,
    recordedAt: new Date().toISOString(),
  });
}

export function checkTopicCovered(
  topic: TopicCandidate
): MemoryCheckResult {
  for (const record of publishedMemory) {
    if (record.topic.sourceUrl === topic.sourceUrl) {
      return {
        covered: true,
        reason: "This exact source has already been covered.",
        matchedTopic: record.topic,
      };
    }

    const titleSimilarity = similarity(
      topic.title,
      record.topic.title
    );

    const combinedSimilarity = similarity(
      `${topic.title} ${topic.summary}`,
      `${record.topic.title} ${record.topic.summary}`
    );

    if (titleSimilarity >= 0.5 || combinedSimilarity >= 0.45) {
      return {
        covered: true,
        reason:
          "This topic is substantially similar to a previously covered story.",
        matchedTopic: record.topic,
      };
    }
  }

  return {
    covered: false,
    reason:
      "No substantially similar previously covered topic was found.",
  };
}