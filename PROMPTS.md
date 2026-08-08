# FILTER — AI Usage Log

## Prompt 1 — API Skeleton

I am building a hackathon project called FILTER, an autonomous AI and technology persona.

The required API contract is:

POST /api/agent/init

Request:
{
  "persona": {
    "name": "FILTER",
    "domain": "AI and Technology"
  }
}

Response:
{
  "agentId": "abc-123"
}

GET /api/agent/feed?agentId=abc-123

Response:
{
  "posts": []
}

The project uses Next.js App Router, TypeScript, and Tailwind CSS.

For now, implement ONLY the API skeleton for these two endpoints.

Requirements:

1. Create app/api/agent/init/route.ts
2. Create app/api/agent/feed/route.ts
3. Generate a unique agentId during initialization.
4. Store the initialized agent state in a simple in-memory structure for this first prototype.
5. GET /feed should return an empty posts array for a valid agentId.
6. Handle invalid requests with appropriate HTTP status codes.
7. Do NOT implement AI, web search, memory, scheduling, database, or UI yet.
8. Keep the implementation simple and easy to understand because this project may need to be modified during a 20-minute live coding challenge.
9. Explain which files you created/changed and why.

Do not overengineer the solution.

## Prompt 2 — Live Topic Discovery

We are continuing the FILTER hackathon project.

FILTER is an autonomous AI and technology persona. The required behavior is:

1. Discover current AI and technology topics from live information sources.
2. Later, FILTER will evaluate these topics, remember previously published content, and publish selected topics autonomously.

For this step, implement ONLY the live topic discovery layer.

Requirements:

- Use a reliable live web/news source that does not require a complicated paid API.
- The discovery layer should return a small list of current AI/technology topic candidates.
- Each candidate should contain:
  - title
  - short summary
  - source URL
  - published timestamp if available
- Keep the implementation simple and modular.
- Create a dedicated file such as lib/discovery.ts.
- Do NOT implement the AI editorial judge yet.
- Do NOT implement memory yet.
- Do NOT implement publishing yet.
- Do NOT modify the required /api/agent/init or /api/agent/feed API contracts.
- Do NOT build UI yet.
- Explain the chosen live source and why it is reliable for this hackathon.
- Keep the code easy to understand and easy to modify during a 20-minute live coding challenge.

We need a real live source, not hardcoded fake topics.

cat >> PROMPTS.md <<'EOF'

## Prompt 3 — Editorial Judgment

We are continuing the FILTER hackathon project.

FILTER already has a working live topic discovery layer in lib/discovery.ts.

Now implement ONLY the editorial judgment layer.

FILTER should evaluate discovered AI and technology topic candidates and decide whether each topic is worth publishing.

Requirements:

1. Create a dedicated module such as lib/editorial.ts.
2. Use an AI model to evaluate the discovered topics.
3. For each candidate, decide:
   - publish or reject
   - why it was selected/rejected
   - relevance/importance
   - whether it is sufficiently timely
4. FILTER should intentionally reject weak topics such as:
   - generic AI hype
   - repetitive stories
   - low-value content
   - topics outside AI/technology
   - stories without enough substance
5. The editorial decision should reflect a consistent technology-focused persona rather than simply publishing the first topic returned by the RSS feed.
6. Keep the implementation simple and modular.
7. Reuse the existing TopicCandidate type from lib/discovery.ts where practical.
8. Do NOT implement memory yet.
9. Do NOT implement autonomous scheduling/publishing yet.
10. Do NOT modify the required /api/agent/init or /api/agent/feed API contracts yet.
11. Do NOT build UI yet.
12. Keep the code easy to understand and easy to modify during a 20-minute live coding challenge.

Explain which files you create/change and why.

Do not overengineer the solution.

## Prompt 4 — Memory

We are continuing the FILTER hackathon project.

FILTER is an autonomous AI and technology persona.

The current project already has:

- lib/discovery.ts

  - Discovers live AI/technology topics using Google News RSS.
  - Exposes the TopicCandidate type.

- lib/editorial.ts

  - Uses Gemini to evaluate discovered topics.
  - Produces editorial decisions containing:
    - topic
    - publish
    - reason
    - relevance
    - timely

The next requirement is MEMORY.

Implement ONLY the memory layer.

FILTER must be able to remember topics that it has already decided to publish so that it can avoid repeatedly publishing the same or substantially similar story.

Requirements:

1. Create a simple dedicated memory module such as:
   lib/memory.ts

2. The memory should store previously published/accepted topics.

3. It should support:

   - recording a published topic
   - checking whether a new topic has already been covered
   - returning enough information to explain why a topic is considered a duplicate

4. The memory check should not rely only on exact string matching.
   It should be reasonably capable of identifying substantially similar/repetitive topics using a simple approach appropriate for a hackathon prototype.

5. Keep the implementation lightweight.
   Do NOT add a database, vector database, embeddings service, or complicated memory framework.

6. An in-memory structure is acceptable for this prototype.

7. Reuse the existing TopicCandidate type from:
   lib/discovery.ts

8. Keep the memory module independent from the HTTP API.

9. Do NOT implement autonomous scheduling yet.

10. Do NOT implement publishing yet.

11. Do NOT modify:
    app/api/agent/init/route.ts
    app/api/agent/feed/route.ts

12. Do NOT build UI.

13. Do NOT change the existing discovery or editorial behavior unless absolutely necessary for type compatibility.

14. Keep the implementation easy to understand and easy to modify during the 20-minute Live Steer Challenge.

15. Explain:

    - which files you created/changed
    - how the memory works
    - how duplicate detection works
    - why this approach is appropriate for the hackathon

Do not overengineer the solution.

The goal of this step is:

Google News Discovery
↓
Editorial Judgment
↓
Memory Check
↓
Previously covered? → reject/skip
New topic → available for future publishing

Do not implement the publishing or scheduling layer yet.
EOF