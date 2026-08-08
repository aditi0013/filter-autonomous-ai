import Parser from "rss-parser";

const parser = new Parser();

export type TopicCandidate = {
  title: string;
  summary: string;
  sourceUrl: string;
  publishedAt?: string;
};

const GOOGLE_NEWS_RSS =
  "https://news.google.com/rss/search?q=AI+OR+artificial+intelligence+OR+technology&hl=en-US&gl=US&ceid=US:en";

function cleanSummary(text?: string): string {
  if (!text) {
    return "No summary available.";
  }

  return text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 240);
}

export async function discoverTopics(
  limit = 5
): Promise<TopicCandidate[]> {
  const feed = await parser.parseURL(GOOGLE_NEWS_RSS);

  return feed.items
    .filter((item) => item.title && item.link)
    .slice(0, limit)
    .map((item) => ({
      title: item.title!.trim(),
      summary: cleanSummary(item.contentSnippet || item.content),
      sourceUrl: item.link!,
      publishedAt: item.isoDate || item.pubDate,
    }));
}