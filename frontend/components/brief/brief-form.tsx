"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createRun } from "@/lib/api/client";
import { serializeBriefDraft, type BriefDraft } from "@/lib/serializers/brief";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel, FieldMessage, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DemoModeToggle } from "./demo-mode-toggle";

const INITIAL_DRAFT: BriefDraft = {
  productDescription: "",
  usersAndPayers: "",
  targetGeography: "",
  competitorsAndBenchmarks: "",
  successCriteria: "",
  triggerContext: "",
  contextUrl: "",
  demoMode: true,
};

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function BriefForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<BriefDraft>(INITIAL_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function setField<K extends keyof BriefDraft>(key: K, value: BriefDraft[K]) {
    if (error) setError(null);
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!draft.productDescription.trim()) {
      setError("Product description is required.");
      return;
    }

    if (draft.contextUrl.trim() && !isValidHttpUrl(draft.contextUrl.trim())) {
      setError("Context URL must be a valid http or https URL.");
      return;
    }

    startTransition(async () => {
      try {
        const request = serializeBriefDraft(draft);
        const response = await createRun(request);
        router.push(`/run/${response.runId}`);
      } catch (submissionError) {
        setError(submissionError instanceof Error ? submissionError.message : "Failed to start run.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Structured brief</CardTitle>
        <CardDescription>
          This intake surface is a sanitized public slice of the original board-first creative strategy workflow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="productDescription">Product and core job</FieldLabel>
              <FieldDescription>Describe what the product is and what job the audience hires it to do.</FieldDescription>
              <Textarea
                id="productDescription"
                value={draft.productDescription}
                onChange={(event) => setField("productDescription", event.target.value)}
                placeholder="Agentic creative strategy support for founder-led teams"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="usersAndPayers">Users, buyers, decision makers</FieldLabel>
              <Input
                id="usersAndPayers"
                value={draft.usersAndPayers}
                onChange={(event) => setField("usersAndPayers", event.target.value)}
                placeholder="Founders, chiefs of staff, early operators"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="targetGeography">Target geography</FieldLabel>
              <Input
                id="targetGeography"
                value={draft.targetGeography}
                onChange={(event) => setField("targetGeography", event.target.value)}
                placeholder="United States, United Kingdom"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="competitorsAndBenchmarks">Seed competitors and benchmarks</FieldLabel>
              <Textarea
                id="competitorsAndBenchmarks"
                value={draft.competitorsAndBenchmarks}
                onChange={(event) => setField("competitorsAndBenchmarks", event.target.value)}
                placeholder="Selected competitor pages, source links, or category references"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="successCriteria">Success criteria</FieldLabel>
              <Input
                id="successCriteria"
                value={draft.successCriteria}
                onChange={(event) => setField("successCriteria", event.target.value)}
                placeholder="3-5 patterns, 1 overused angle, 2 opportunities, 1 next-test brief"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="triggerContext">Trigger context</FieldLabel>
              <Input
                id="triggerContext"
                value={draft.triggerContext}
                onChange={(event) => setField("triggerContext", event.target.value)}
                placeholder="Why does this campaign decision matter right now?"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="contextUrl">Optional context URL</FieldLabel>
              <Input
                id="contextUrl"
                value={draft.contextUrl}
                onChange={(event) => setField("contextUrl", event.target.value)}
                placeholder="https://example.com/context"
              />
            </Field>

            <DemoModeToggle checked={draft.demoMode} onCheckedChange={(checked) => setField("demoMode", checked)} />

            {error ? <FieldMessage>{error}</FieldMessage> : null}
          </FieldSet>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button disabled={isPending} type="submit">
              {isPending ? "Starting run..." : "Start demo run"}
            </Button>
            <Button
              type="button"
              style={{ background: "#e2e8f0", color: "#0f172a" }}
              onClick={() => setDraft(INITIAL_DRAFT)}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
