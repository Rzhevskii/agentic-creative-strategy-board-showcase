import type {
  AudioRecap,
  BoardPayload,
  NextTestBrief,
  Opportunity,
  Overused,
  PatternCluster,
  StoryBlock,
  Source,
  VisualBlock,
} from "@/types/contracts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isSource(value: unknown): value is Source {
  return (
    isRecord(value) &&
    isString(value.sourceId) &&
    isString(value.title) &&
    isString(value.url) &&
    isString(value.domain) &&
    isString(value.citationLabel)
  );
}

function isPatternCluster(value: unknown): value is PatternCluster {
  return (
    isRecord(value) &&
    isString(value.clusterId) &&
    isNonEmptyString(value.label) &&
    isNonEmptyString(value.summary) &&
    isStringArray(value.evidenceSourceIds) &&
    typeof value.evidenceCount === "number"
  );
}

function isOverused(value: unknown): value is Overused {
  return (
    isRecord(value) &&
    isNonEmptyString(value.label) &&
    isNonEmptyString(value.reason) &&
    isStringArray(value.evidenceSourceIds)
  );
}

function isOpportunity(value: unknown): value is Opportunity {
  return (
    isRecord(value) &&
    isNonEmptyString(value.label) &&
    isNonEmptyString(value.rationale) &&
    isNonEmptyString(value.differentiationAngle) &&
    isStringArray(value.evidenceSourceIds)
  );
}

function isNextTestBrief(value: unknown): value is NextTestBrief {
  return (
    isRecord(value) &&
    isNonEmptyString(value.audience) &&
    isNonEmptyString(value.hook) &&
    isNonEmptyString(value.angle) &&
    isNonEmptyString(value.visualDirection) &&
    isNonEmptyString(value.copyDirection) &&
    isNonEmptyString(value.whyThisNow)
  );
}

function isAudioRecap(value: unknown): value is AudioRecap {
  if (!isRecord(value)) {
    return false;
  }

  if (value.status === "ready") {
    return isNonEmptyString(value.audioPath);
  }

  if (value.status === "unavailable") {
    return true;
  }

  return false;
}

function isVisualBlock(value: unknown): value is VisualBlock {
  return isRecord(value) && isString(value.blockId) && isString(value.type);
}

function isStoryBlock(value: unknown): value is StoryBlock {
  if (!isRecord(value) || !isString(value.blockId) || !isString(value.type)) {
    return false;
  }

  switch (value.type) {
    case "narrative_text":
      return isNonEmptyString(value.body);
    case "screenshot_group":
      return (
        Array.isArray(value.items) &&
        value.items.length > 0 &&
        value.items.every(
          (item) => isRecord(item) && isString(item.itemId) && isNonEmptyString(item.sourceId)
        )
      );
    case "image_asset":
      return isNonEmptyString(value.imagePath) && isNonEmptyString(value.alt);
    case "audio_clip":
      return isNonEmptyString(value.audioPath);
    case "strategy_callout":
      return isNonEmptyString(value.label) && isNonEmptyString(value.body);
    case "citation_callout":
      return isNonEmptyString(value.claim) && isStringArray(value.supportingSourceIds);
    default:
      return false;
  }
}

export function parseBoardPayload(value: unknown): BoardPayload | null {
  const isBoardPayload =
    isRecord(value) &&
    isString(value.sessionId) &&
    isString(value.runId) &&
    (value.mode === "live" || value.mode === "fallback") &&
    isRecord(value.input) &&
    isString(value.input.brief) &&
    isString(value.input.targetNiche) &&
    Array.isArray(value.sources) &&
    value.sources.every(isSource) &&
    Array.isArray(value.patternClusters) &&
    value.patternClusters.every(isPatternCluster) &&
    Array.isArray(value.overused) &&
    value.overused.every(isOverused) &&
    Array.isArray(value.opportunities) &&
    value.opportunities.every(isOpportunity) &&
    isNextTestBrief(value.nextTestBrief) &&
    isAudioRecap(value.audioRecap) &&
    Array.isArray(value.storyBlocks) &&
    value.storyBlocks.length >= 4 &&
    value.storyBlocks.every(isStoryBlock) &&
    (!("visualBlocks" in value) ||
      value.visualBlocks === undefined ||
      (Array.isArray(value.visualBlocks) && value.visualBlocks.every(isVisualBlock)));

  return isBoardPayload ? (value as BoardPayload) : null;
}
