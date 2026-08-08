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

export const agents = new Map<string, Agent>();

export const postsByAgent = new Map<string, PublishedPost[]>();