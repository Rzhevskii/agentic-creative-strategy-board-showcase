export type RunStatus = "queued" | "running" | "completed" | "failed";
export type RunMode = "live" | "fallback";
export type RunStage =
  | "intake"
  | "discovery"
  | "extraction"
  | "normalization"
  | "clustering"
  | "brief"
  | "audio";

export type RunRequest = {
  brief: string;
  contextUrl?: string;
  inputImagePath?: string;
  demoMode: boolean;
};

export type RunCreatedResponse = {
  sessionId: string;
  runId: string;
  status: RunStatus;
  eventStreamUrl: string;
};

export type RunStateResponse = {
  runId: string;
  status: RunStatus;
  stage?: RunStage | null;
  mode?: RunMode | null;
  warningMessages: string[];
  boardPayload?: BoardPayload | null;
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

export type Overused = {
  label: string;
  reason: string;
  evidenceSourceIds: string[];
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

export type AudioRecap = {
  status: "ready" | "unavailable";
  audioPath?: string;
  transcript?: string;
};

export type StoryBlockBase = {
  blockId: string;
  type:
    | "narrative_text"
    | "source_collage"
    | "generated_image"
    | "audio_clip"
    | "strategy_callout"
    | "citation_callout";
  title?: string;
  description?: string;
  citationSourceIds?: string[];
};

export type NarrativeTextBlock = StoryBlockBase & {
  type: "narrative_text";
  body: string;
};

export type SourceCollageBlock = StoryBlockBase & {
  type: "source_collage";
  items: Array<{
    itemId: string;
    sourceId: string;
    title?: string;
    imagePath?: string | null;
    caption?: string;
    citationLabel?: string;
  }>;
};

export type GeneratedImageBlock = StoryBlockBase & {
  type: "generated_image";
  imagePath: string;
  alt: string;
  promptSummary?: string;
  generationModel?: string;
};

export type AudioClipBlock = StoryBlockBase & {
  type: "audio_clip";
  audioPath: string;
  transcript?: string;
};

export type StrategyCalloutBlock = StoryBlockBase & {
  type: "strategy_callout";
  label: string;
  body: string;
};

export type CitationCalloutBlock = StoryBlockBase & {
  type: "citation_callout";
  claim: string;
  supportingSourceIds: string[];
};

export type StoryBlock =
  | NarrativeTextBlock
  | SourceCollageBlock
  | GeneratedImageBlock
  | AudioClipBlock
  | StrategyCalloutBlock
  | CitationCalloutBlock;

export type VisualBlock = {
  blockId: string;
  type: "bar_chart" | "comparison_table" | "timeline" | "matrix_2x2" | "quote_strip" | "signal_meter";
  title?: string;
  description?: string;
  citationSourceIds?: string[];
  [key: string]: unknown;
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
  overused: Overused[];
  opportunities: Opportunity[];
  nextTestBrief: NextTestBrief;
  audioRecap: AudioRecap;
  storyBlocks: StoryBlock[];
  visualBlocks?: VisualBlock[];
};

export type RunStageEventPayload = {
  runId: string;
  stage: RunStage;
  message?: string;
  progress?: number;
  selectedSourceCount?: number;
};

export type RunWarningPayload = {
  runId: string;
  message: string;
};

export type RunCompletedPayload = {
  runId: string;
  status: "completed";
  boardPayload: BoardPayload;
};

export type RunFailedPayload = {
  runId: string;
  status: "failed";
  message: string;
};
