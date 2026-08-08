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

