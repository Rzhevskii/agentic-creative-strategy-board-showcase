import type { RunRequest } from "@/types/contracts";

export type BriefDraft = {
  productDescription: string;
  usersAndPayers: string;
  targetGeography: string;
  competitorsAndBenchmarks: string;
  successCriteria: string;
  triggerContext: string;
  contextUrl: string;
  demoMode: boolean;
};

export function serializeBriefDraft(draft: BriefDraft): RunRequest {
  const lines = [
    ["Product", draft.productDescription],
    ["Users and buyers", draft.usersAndPayers],
    ["Target geography", draft.targetGeography],
    ["Competitors and benchmarks", draft.competitorsAndBenchmarks],
    ["Success criteria", draft.successCriteria],
    ["Trigger context", draft.triggerContext],
  ]
    .filter(([, value]) => value.trim())
    .map(([label, value]) => {
      const v = value.trim();
      return `${label}: ${v.endsWith(".") ? v : v + "."}`;
    });

  const request: RunRequest = {
    brief: lines.join(" "),
    demoMode: draft.demoMode,
  };

  const contextUrl = draft.contextUrl.trim();
  if (contextUrl) {
    request.contextUrl = contextUrl;
  }

  return request;
}
