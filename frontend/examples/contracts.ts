export type RunMode = "live" | "fallback";

export type RunRequest = {
  brief: string;
  contextUrl?: string;
  inputImagePath?: string;
  demoMode: boolean;
};

export type Source = {
  sourceId: string;
  title: string;
  url: string;
  domain: string;
  screenshotPath?: string | null;
  citationLabel: string;
};

export type PatternCluster = {
  clusterId: string;
  label: string;
  summary: string;
  evidenceSourceIds: string[];
  evidenceCount: number;
};

export type Opportunity = {
  label: string;
  rationale: string;
  differentiationAngle: string;
  evidenceSourceIds: string[];
};

export type NextTestBrief = {
  audience: string;
  hook: string;
  angle: string;
  visualDirection: string;
  copyDirection: string;
  whyThisNow: string;
};

export type BoardPayload = {
  sessionId: string;
  runId: string;
  mode: RunMode;
  input: {
    brief: string;
    contextUrl?: string | null;
    inputImagePath?: string | null;
    targetNiche: string;
  };
  sources: Source[];
  patternClusters: PatternCluster[];
  overused: Array<{ label: string; reason: string; evidenceSourceIds: string[] }>;
  opportunities: Opportunity[];
  nextTestBrief: NextTestBrief;
  audioRecap: { status: "ready" | "unavailable"; audioPath?: string; transcript?: string };
  storyBlocks: Array<{ blockId: string; type: string; title?: string }>;
};
