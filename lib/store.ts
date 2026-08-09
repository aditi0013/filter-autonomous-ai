import { TopicCandidate } from "./discovery";

export type Agent = {
  agentId: string;
  name: string;
  domain: string;
};

export type PublishedPost = {
  id: string;
  createdAt: string;
  text: string;
  rationale: string;
  sources: string[];
  topic: TopicCandidate;
};

export type AgentCycleState = {
  lastCycleAt: number | null;
  cycleRunning: boolean;
};

export const agents = new Map<string, Agent>();

export const postsByAgent = new Map<string, PublishedPost[]>();

export const cycleStateByAgent = new Map<string, AgentCycleState>();

export const CYCLE_COOLDOWN_MS = 60_000;

export function getCycleState(agentId: string): AgentCycleState {
  let state = cycleStateByAgent.get(agentId);

  if (!state) {
    state = {
      lastCycleAt: null,
      cycleRunning: false,
    };

    cycleStateByAgent.set(agentId, state);
  }

  return state;
}
