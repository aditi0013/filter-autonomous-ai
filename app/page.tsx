"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  createdAt: string;
  text: string;
  rationale: string;
  sources: string[];
  topic: {
    title: string;
    summary: string;
    sourceUrl: string;
    publishedAt?: string;
  };
};

export default function Home() {
  const [agentId, setAgentId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [status, setStatus] = useState("Initializing FILTER...");

  useEffect(() => {
    async function initialize() {
      try {
        const response = await fetch("/api/agent/init", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            persona: {
              name: "FILTER",
              domain: "AI and technology",
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to initialize agent");
        }

        setAgentId(data.agentId);
        setStatus("FILTER is ready.");
      } catch (error) {
        console.error(error);
        setStatus("Failed to initialize FILTER.");
      } finally {
        setInitializing(false);
      }
    }

    initialize();
  }, []);

  async function runFilter() {
    if (!agentId) return;

    setLoading(true);
    setStatus("FILTER is discovering and evaluating stories...");

    try {
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Agent cycle failed");
      }

      setPosts((current) => [...data.posts, ...current]);
      setStatus(
        `Cycle complete — ${data.published} ${data.published === 1 ? "story" : "stories"} published.`
      );
    } catch (error) {
      console.error(error);
      setStatus("FILTER could not complete the cycle.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <header className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
              <span className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">
                Autonomous AI
              </span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              FILTER
            </h1>

            <p className="mt-3 max-w-2xl text-lg text-zinc-400">
              An autonomous AI and technology media persona that discovers,
              judges, and publishes what matters.
            </p>
          </div>

          <button
            onClick={runFilter}
            disabled={!agentId || loading || initializing}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Running..." : "Run FILTER"}
          </button>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-zinc-500">Persona</p>
            <p className="mt-2 font-semibold">FILTER</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-zinc-500">Domain</p>
            <p className="mt-2 font-semibold">AI + Technology</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-zinc-500">Published</p>
            <p className="mt-2 font-semibold">{posts.length} stories</p>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3">
            <span
              className={`h-2 w-2 rounded-full ${
                loading ? "animate-pulse bg-yellow-400" : "bg-emerald-400"
              }`}
            />
            <p className="text-sm text-zinc-300">{status}</p>
          </div>

          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
            {["Discover", "Evaluate", "Decide", "Publish"].map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <span className="text-xs text-zinc-600">0{index + 1}</span>
                <p className="mt-1 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Autonomous feed
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                Published by FILTER
              </h2>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <p className="text-zinc-400">
                No stories published yet.
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                Run FILTER to discover and evaluate live technology stories.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/20"
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 font-medium text-emerald-400">
                      ✓ Published
                    </span>

                    {post.topic.publishedAt && (
                      <span className="text-zinc-600">
                        {new Date(post.topic.publishedAt).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold leading-8">
                    {post.topic.title}
                  </h3>

                  <p className="mt-3 text-zinc-400">
                    {post.text}
                  </p>

                  <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      FILTER&apos;s rationale
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      {post.rationale}
                    </p>
                  </div>

                  <div className="mt-5">
                    <a
                      href={post.topic.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
                    >
                      Read original source →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
