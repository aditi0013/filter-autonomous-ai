"use client";

import { useEffect, useState } from "react";

type Topic = {
  title: string;
  summary: string;
  sourceUrl: string;
  publishedAt?: string;
};

type Post = {
  id: string;
  createdAt: string;
  text: string;
  rationale: string;
  sources: string[];
  topic: Topic;
};

type Decision = {
  topic: Topic;
  publish: boolean;
  reason: string;
  relevance: number;
  timely: boolean;
};

type Analysis = {
  discovered: number;
  evaluated: number;
  published: Post[];
  rejected: Decision[];
};

export default function Home() {
  const [agentId, setAgentId] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [rejected, setRejected] = useState<Decision[]>([]);
  const [discovered, setDiscovered] = useState(0);
  const [evaluated, setEvaluated] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const [message, setMessage] = useState(
    "FILTER is ready to scan the technology landscape."
  );

  useEffect(() => {
    initializeAgent();
  }, []);

  async function initializeAgent() {
    try {
      setInitializing(true);

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
        throw new Error(data.error || "Failed to initialize FILTER");
      }

      setAgentId(data.agentId);
      setMessage("FILTER is ready to scan the technology landscape.");
    } catch (error) {
      console.error(error);
      setMessage("FILTER could not initialize.");
    } finally {
      setInitializing(false);
    }
  }

  async function loadFeed(id: string) {
    const response = await fetch(
      `/api/agent/feed?agentId=${encodeURIComponent(id)}`
    );

    const data = await response.json();

    if (response.ok) {
      setPosts(data.posts ?? []);
    }
  }

  async function runFilter() {
    if (!agentId || loading) return;

    try {
      setLoading(true);
      setMessage("FILTER is discovering and evaluating live stories...");

      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId,
        }),
      });

      const data: Analysis = await response.json();

      if (!response.ok) {
        throw new Error(
          (data as unknown as { error?: string }).error ||
            "FILTER cycle failed"
        );
      }

      setDiscovered(data.discovered);
      setEvaluated(data.evaluated);
      setRejected(data.rejected ?? []);

      await loadFeed(agentId);
  setMessage(
  `FILTER evaluated ${data.evaluated} stories and published ${data.published.length}.`
);
  } catch (error) {
      console.error(error);
      setMessage("FILTER encountered an error during this cycle.");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  function getSourceName(url: string) {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "Source";
    }
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">

        {/* HEADER */}
        <header className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
                F
              </div>

              <span className="text-sm font-medium uppercase tracking-[0.25em] text-white/50">
                Autonomous AI Media Agent
              </span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              FILTER
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
              An autonomous AI and technology persona that discovers,
              evaluates, and publishes the stories worth your attention.
            </p>
          </div>

          <button
            onClick={runFilter}
            disabled={!agentId || loading || initializing}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "FILTER is thinking..." : "Run FILTER"}
          </button>
        </header>

        {/* STATUS */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-start gap-4">
            <div
              className={`mt-1 h-3 w-3 rounded-full ${
                loading
                  ? "animate-pulse bg-yellow-400"
                  : "bg-green-400"
              }`}
            />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Agent status
              </p>

              <p className="mt-2 text-base text-white/80">
                {message}
              </p>
            </div>
          </div>
        </section>

        {/* AGENT PROFILE */}
        <section className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Persona
            </p>
            <p className="mt-3 text-xl font-semibold">
              FILTER
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Domain
            </p>
            <p className="mt-3 text-xl font-semibold">
              AI + Technology
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Published
            </p>
            <p className="mt-3 text-xl font-semibold">
              {posts.length}
            </p>
          </div>
        </section>

        {/* AUTONOMOUS ANALYSIS */}
        <section className="mb-12">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Autonomous editorial engine
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              FILTER Analysis
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
              Every cycle is evaluated by FILTER's editorial AI before
              anything reaches the feed.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                Discovered
              </p>
              <p className="mt-3 text-3xl font-bold">
                {discovered}
              </p>
              <p className="mt-1 text-sm text-white/40">
                live stories
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                Evaluated
              </p>
              <p className="mt-3 text-3xl font-bold">
                {evaluated}
              </p>
              <p className="mt-1 text-sm text-white/40">
                by editorial AI
              </p>
            </div>

            <div className="rounded-2xl border border-green-400/20 bg-green-400/[0.05] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-green-300/60">
                Published
              </p>
              <p className="mt-3 text-3xl font-bold text-green-300">
                {posts.length}
              </p>
              <p className="mt-1 text-sm text-green-300/50">
                passed the filter
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-red-300/60">
                Rejected
              </p>
              <p className="mt-3 text-3xl font-bold text-red-300">
                {rejected.length}
              </p>
              <p className="mt-1 text-sm text-red-300/50">
                filtered out
              </p>
            </div>
          </div>
        </section>

        {/* REJECTED STORIES */}
        {rejected.length > 0 && (
          <section className="mb-12">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300/50">
                Autonomous rejection log
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                What FILTER rejected
              </h2>
            </div>

            <div className="grid gap-4">
              {rejected.map((decision, index) => (
                <article
                  key={`${decision.topic.sourceUrl}-${index}`}
                  className="rounded-2xl border border-red-400/10 bg-red-400/[0.03] p-5"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-medium text-red-300">
                      Rejected
                    </span>

                    <span className="text-xs text-white/30">
                      Relevance {decision.relevance}/10
                    </span>

                    <span className="text-xs text-white/30">
                      {decision.timely ? "Timely" : "Not timely"}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold leading-7 text-white/90">
                    {decision.topic.title}
                  </h3>

                  <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/30">
                      Why FILTER rejected it
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {decision.reason}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* FEED */}
        <section className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Curated intelligence
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              FILTER Feed
            </h2>
          </div>

          <span className="text-sm text-white/40">
            {posts.length} published
          </span>
        </section>

        {posts.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-20 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl font-bold">
              F
            </div>

            <h3 className="text-xl font-semibold">
              No stories published yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">
              Run FILTER to discover live AI and technology stories
              and let the editorial agent decide what deserves
              attention.
            </p>
          </section>
        ) : (
          <div className="grid gap-5">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-white/40">
                  <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-green-300">
                    Published by FILTER
                  </span>

                  <span>
                    {formatDate(post.createdAt)}
                  </span>

                  <span>•</span>

                  <span>
                    {getSourceName(post.sources[0])}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold leading-tight">
                  {post.topic.title}
                </h3>

                <p className="mt-4 leading-7 text-white/60">
                  {post.text}
                </p>

                <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                    Editorial rationale
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {post.rationale}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={post.sources[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    Read source →
                  </a>

                  {post.topic.publishedAt && (
                    <span className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/40">
                      Source: {formatDate(post.topic.publishedAt)}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-16 border-t border-white/10 pt-6 text-sm text-white/30">
          FILTER autonomously discovers technology signals, applies
          editorial judgment, and publishes selected intelligence.
        </footer>
      </div>
    </main>
  );
}