import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { STARTER_OPERATORS } from "./catalog";
import { eligibilityFor } from "./eligibility";
import { hashCanonical, mintId, parseJson } from "./hash";
import { assertStageArtifact, nextLoopState } from "./loops";
import { PHRASES } from "./phrases";
import type {
  CaseStatus,
  EpistemicStatus,
  EvidenceOutcome,
  EvidenceReceipt,
  Experiment,
  ExperimentStatus,
  IndependenceLevel,
  JsonValue,
  KnowledgeClaim,
  Lab,
  LabOverview,
  LabPolicy,
  LoopState,
  Operator,
  OperatorContract,
  ProblemLoop,
  ProblemLoopEvent,
  ResearchCase,
  SourceKind,
  Tournament,
  TournamentStatus,
} from "./types";

type Sql = Awaited<ReturnType<typeof getSql>>;

function jsonNote(body: JsonValue): string {
  if (body && typeof body === "object" && !Array.isArray(body) && typeof body.note === "string") {
    return body.note;
  }
  return JSON.stringify(body);
}

async function ensureLab(sql: Sql, userId: string) {
  await sql`
    insert into labs (user_id, name, slug, charter)
    values (${userId}, ${"Research Lab"}, ${"lab"}, ${"Tenant-isolated Orbita research lab. Receipts only. No runtime activation."})
    on conflict (user_id) do nothing
  `;
  await sql`
    insert into lab_policy (user_id)
    values (${userId})
    on conflict (user_id) do nothing
  `;
}

function mapLab(row: {
  user_id: string;
  name: string;
  slug: string;
  charter: string;
  created_at: string;
}): Lab {
  return {
    userId: row.user_id,
    name: row.name,
    slug: row.slug,
    charter: row.charter,
    createdAt: row.created_at,
  };
}

function mapPolicy(row: {
  require_hash_bound_approval: boolean;
  prohibit_architecture_review_from_evidence: boolean;
  require_held_out_prediction: boolean;
  no_activation: boolean;
  updated_at: string;
}): LabPolicy {
  return {
    requireHashBoundApproval: row.require_hash_bound_approval,
    prohibitArchitectureReviewFromEvidence: row.prohibit_architecture_review_from_evidence,
    requireHeldOutPrediction: row.require_held_out_prediction,
    noActivation: row.no_activation,
    updatedAt: row.updated_at,
  };
}

function mapCase(row: {
  id: string;
  name: string;
  goal: string;
  domain_hint: string | null;
  status: string;
  plan_json: string | null;
  plan_hash: string | null;
  created_at: string;
  updated_at: string;
}): ResearchCase {
  return {
    id: row.id,
    name: row.name,
    goal: row.goal,
    domainHint: row.domain_hint,
    status: row.status as CaseStatus,
    plan: parseJson<JsonValue | null>(row.plan_json, null),
    planHash: row.plan_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapOperator(row: {
  id: string;
  operator_key: string;
  name: string;
  description: string;
  status: string;
  contract_json: string;
  contract_hash: string;
  review_hash: string;
  source_case_id: string | null;
  created_at: string;
}): Operator {
  return {
    id: row.id,
    operatorKey: row.operator_key,
    name: row.name,
    description: row.description,
    status: row.status as Operator["status"],
    contract: parseJson<OperatorContract>(row.contract_json, {
      kill_switch: "",
      intervention: "",
      recovery_test: "",
      held_out_prediction: "",
    }),
    contractHash: row.contract_hash,
    reviewHash: row.review_hash,
    sourceCaseId: row.source_case_id,
    createdAt: row.created_at,
  };
}

function mapEvidence(row: {
  id: string;
  schema_id: string;
  source_kind: string;
  case_id: string | null;
  operator_id: string | null;
  experiment_id: string | null;
  domain: string;
  outcome: string;
  independence_level: string;
  body_json: string;
  receipt_hash: string;
  eligibility_json: string;
  created_at: string;
}): EvidenceReceipt {
  return {
    id: row.id,
    schemaId: row.schema_id,
    sourceKind: row.source_kind as SourceKind,
    caseId: row.case_id,
    operatorId: row.operator_id,
    experimentId: row.experiment_id,
    domain: row.domain,
    outcome: row.outcome as EvidenceOutcome,
    independenceLevel: row.independence_level as IndependenceLevel,
    body: parseJson(row.body_json, {}),
    receiptHash: row.receipt_hash,
    eligibility: parseJson(row.eligibility_json, { allowed: [], prohibited: [] }),
    createdAt: row.created_at,
  };
}

function mapExperiment(row: {
  id: string;
  case_id: string;
  scientific_question: string;
  claim_scope_json: string;
  execution_spec_json: string;
  verdict_schema_json: string;
  independent_verifier_json: string;
  falsification_coverage_json: string;
  anti_rescue_rules_json: string;
  experiment_hash: string;
  manifest_json: string | null;
  manifest_hash: string | null;
  status: string;
  created_by: string;
  created_at: string;
}): Experiment {
  return {
    id: row.id,
    caseId: row.case_id,
    scientificQuestion: row.scientific_question,
    claimScope: parseJson(row.claim_scope_json, {}),
    executionSpec: parseJson(row.execution_spec_json, {}),
    verdictSchema: parseJson(row.verdict_schema_json, {}),
    independentVerifier: parseJson(row.independent_verifier_json, {}),
    falsificationCoverage: parseJson(row.falsification_coverage_json, {}),
    antiRescueRules: parseJson<string[]>(row.anti_rescue_rules_json, []),
    experimentHash: row.experiment_hash,
    manifest: parseJson<JsonValue | null>(row.manifest_json, null),
    manifestHash: row.manifest_hash,
    status: row.status as ExperimentStatus,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

function mapLoop(row: {
  id: string;
  goal: string;
  success_criteria_json: string;
  allowed_capabilities_json: string;
  max_cycles: number;
  state: string;
  cycle: number;
  previous_event_hash: string;
  created_by: string;
  created_at: string;
}): Omit<ProblemLoop, "events"> {
  return {
    id: row.id,
    goal: row.goal,
    successCriteria: parseJson<string[]>(row.success_criteria_json, []),
    allowedCapabilities: parseJson<string[]>(row.allowed_capabilities_json, []),
    maxCycles: row.max_cycles,
    state: row.state as LoopState,
    cycle: row.cycle,
    previousEventHash: row.previous_event_hash,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

function mapEvent(row: {
  id: string;
  state: string;
  next_state: string;
  artifact_json: string;
  artifact_hash: string;
  event_hash: string;
  previous_event_hash: string;
  actor: string;
  created_at: string;
}): ProblemLoopEvent {
  return {
    id: row.id,
    state: row.state as LoopState,
    nextState: row.next_state as LoopState,
    artifact: parseJson(row.artifact_json, {}),
    artifactHash: row.artifact_hash,
    eventHash: row.event_hash,
    previousEventHash: row.previous_event_hash,
    actor: row.actor,
    createdAt: row.created_at,
  };
}

function mapClaim(row: {
  id: string;
  case_id: string | null;
  claim_key: string;
  statement: string;
  epistemic_status: string;
  scope_json: string;
  superseded_by: string | null;
  created_at: string;
}): KnowledgeClaim {
  return {
    id: row.id,
    caseId: row.case_id,
    claimKey: row.claim_key,
    statement: row.statement,
    epistemicStatus: row.epistemic_status as EpistemicStatus,
    scope: parseJson(row.scope_json, {}),
    supersededBy: row.superseded_by,
    createdAt: row.created_at,
  };
}

function mapTournament(row: {
  id: string;
  name: string;
  target_json: string;
  status: string;
  manifest_hash: string;
  anti_rescue: boolean;
  created_at: string;
}): Tournament {
  return {
    id: row.id,
    name: row.name,
    target: parseJson(row.target_json, {}),
    status: row.status as TournamentStatus,
    manifestHash: row.manifest_hash,
    antiRescue: row.anti_rescue,
    createdAt: row.created_at,
  };
}

function operatorHashes(input: {
  operatorKey: string;
  name: string;
  description: string;
  contract: OperatorContract;
}) {
  const contractHash = hashCanonical(input.contract);
  const reviewHash = hashCanonical({
    operator_key: input.operatorKey,
    name: input.name,
    description: input.description,
    contract: input.contract,
    contract_hash: contractHash,
  });
  return { contractHash, reviewHash };
}

export const getOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<LabOverview> => {
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const labs = await sql<{
      user_id: string;
      name: string;
      slug: string;
      charter: string;
      created_at: string;
    }>`select user_id, name, slug, charter, created_at::text as created_at from labs where user_id = ${context.userId}`;
    const policies = await sql<{
      require_hash_bound_approval: boolean;
      prohibit_architecture_review_from_evidence: boolean;
      require_held_out_prediction: boolean;
      no_activation: boolean;
      updated_at: string;
    }>`select require_hash_bound_approval, prohibit_architecture_review_from_evidence, require_held_out_prediction, no_activation, updated_at::text as updated_at from lab_policy where user_id = ${context.userId}`;
    const counts = await sql<{
      cases: number;
      operators: number;
      frozen_operators: number;
      evidence: number;
      experiments: number;
      pending_approvals: number;
      open_loops: number;
      claims: number;
      tournaments: number;
    }>`
      select
        (select count(*)::int from cases where user_id = ${context.userId}) as cases,
        (select count(*)::int from operators where user_id = ${context.userId}) as operators,
        (select count(*)::int from operators where user_id = ${context.userId} and status = 'frozen') as frozen_operators,
        (select count(*)::int from evidence_receipts where user_id = ${context.userId}) as evidence,
        (select count(*)::int from experiments where user_id = ${context.userId}) as experiments,
        (select count(*)::int from experiments where user_id = ${context.userId} and status in ('frozen','staged')) as pending_approvals,
        (select count(*)::int from problem_loops where user_id = ${context.userId} and state <> 'COMPLETED') as open_loops,
        (select count(*)::int from claims where user_id = ${context.userId}) as claims,
        (select count(*)::int from tournaments where user_id = ${context.userId}) as tournaments
    `;
    const c = counts[0];
    return {
      lab: mapLab(labs[0]),
      policy: mapPolicy(policies[0]),
      counts: {
        cases: c.cases,
        operators: c.operators,
        frozenOperators: c.frozen_operators,
        evidence: c.evidence,
        experiments: c.experiments,
        pendingApprovals: c.pending_approvals,
        openLoops: c.open_loops,
        claims: c.claims,
        tournaments: c.tournaments,
      },
    };
  });

export const updateLab = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string; charter: string }) => ({
    name: input.name.trim(),
    charter: input.charter.trim(),
  }))
  .handler(async ({ context, data }) => {
    if (!data.name) throw new Error("Lab name is required.");
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "lab";
    await sql`
      update labs set name = ${data.name}, slug = ${slug}, charter = ${data.charter}
      where user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const listCases = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const rows = await sql<{
      id: string;
      name: string;
      goal: string;
      domain_hint: string | null;
      status: string;
      plan_json: string | null;
      plan_hash: string | null;
      created_at: string;
      updated_at: string;
    }>`
      select id, name, goal, domain_hint, status, plan_json, plan_hash,
             created_at::text as created_at, updated_at::text as updated_at
      from cases where user_id = ${context.userId}
      order by created_at desc
    `;
    return rows.map(mapCase);
  });

export const getCase = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      name: string;
      goal: string;
      domain_hint: string | null;
      status: string;
      plan_json: string | null;
      plan_hash: string | null;
      created_at: string;
      updated_at: string;
    }>`
      select id, name, goal, domain_hint, status, plan_json, plan_hash,
             created_at::text as created_at, updated_at::text as updated_at
      from cases where id = ${id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Case not found.");
    return mapCase(rows[0]);
  });

export const createCase = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string; goal?: string; domainHint?: string }) => ({
    name: input.name.trim(),
    goal: (input.goal ?? "").trim(),
    domainHint: (input.domainHint ?? "").trim() || null,
  }))
  .handler(async ({ context, data }) => {
    if (!data.name) throw new Error("Case name is required.");
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const id = mintId("case");
    await sql`
      insert into cases (id, user_id, name, goal, domain_hint, status)
      values (${id}, ${context.userId}, ${data.name}, ${data.goal}, ${data.domainHint}, ${"created"})
    `;
    return { id };
  });

export const ingestCase = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const rows = await sql<{ status: string }>`
      select status from cases where id = ${id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Case not found.");
    if (rows[0].status !== "created") throw new Error("Only created cases can be ingested.");
    await sql`
      update cases set status = ${"ingested"}, updated_at = now()
      where id = ${id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const writePlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; steps: string; falsifiers: string; successChecks: string }) => ({
    id: input.id,
    steps: input.steps.trim(),
    falsifiers: input.falsifiers.trim(),
    successChecks: input.successChecks.trim(),
  }))
  .handler(async ({ context, data }) => {
    if (!data.steps || !data.falsifiers || !data.successChecks) {
      throw new Error("A plan needs steps, falsifiers, and success checks.");
    }
    const sql = await getSql();
    const rows = await sql<{ status: string }>`
      select status from cases where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Case not found.");
    if (!["ingested", "plan_ready"].includes(rows[0].status)) {
      throw new Error("Plans can only be written on ingested cases.");
    }
    const plan = {
      steps: data.steps,
      falsifiers: data.falsifiers,
      success_checks: data.successChecks,
      anti_rescue_rules: ["Do not widen scope after seeing results.", "Do not drop failed checks."],
    };
    const planHash = hashCanonical(plan);
    const planJson = JSON.stringify(plan);
    await sql`
      update cases
      set status = ${"plan_ready"}, plan_json = ${planJson}, plan_hash = ${planHash}, updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { planHash };
  });

export const approvePlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; expectedPlanHash: string; confirmation: string; reviewer: string }) => ({
    id: input.id,
    expectedPlanHash: input.expectedPlanHash.trim(),
    confirmation: input.confirmation.trim(),
    reviewer: input.reviewer.trim(),
  }))
  .handler(async ({ context, data }) => {
    if (data.confirmation !== PHRASES.approvePlan) {
      throw new Error("Confirmation phrase does not match.");
    }
    const sql = await getSql();
    const rows = await sql<{ status: string; plan_hash: string | null }>`
      select status, plan_hash from cases where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Case not found.");
    if (rows[0].status !== "plan_ready") throw new Error("Only plan_ready cases can be approved.");
    if (!rows[0].plan_hash || rows[0].plan_hash !== data.expectedPlanHash) {
      throw new Error("Plan hash mismatch. Approve only the exact frozen plan.");
    }
    await sql`
      update cases set status = ${"approved"}, updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true as const, reviewer: data.reviewer };
  });

export const completeCase = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const rows = await sql<{ status: string }>`
      select status from cases where id = ${id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Case not found.");
    if (rows[0].status !== "approved") throw new Error("Only approved cases can be completed.");
    await sql`
      update cases set status = ${"completed"}, updated_at = now()
      where id = ${id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const deleteCase = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; confirmation: string }) => ({
    id: input.id,
    confirmation: input.confirmation.trim(),
  }))
  .handler(async ({ context, data }) => {
    if (data.confirmation !== PHRASES.deleteCase) {
      throw new Error("Confirmation phrase does not match.");
    }
    const sql = await getSql();
    const res = await sql`
      delete from cases where id = ${data.id} and user_id = ${context.userId}
    `;
    void res;
    return { ok: true as const };
  });

export const listOperators = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const rows = await sql<{
      id: string;
      operator_key: string;
      name: string;
      description: string;
      status: string;
      contract_json: string;
      contract_hash: string;
      review_hash: string;
      source_case_id: string | null;
      created_at: string;
    }>`
      select id, operator_key, name, description, status, contract_json, contract_hash, review_hash,
             source_case_id, created_at::text as created_at
      from operators where user_id = ${context.userId}
      order by created_at desc
    `;
    return rows.map(mapOperator);
  });

export const getOperator = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      operator_key: string;
      name: string;
      description: string;
      status: string;
      contract_json: string;
      contract_hash: string;
      review_hash: string;
      source_case_id: string | null;
      created_at: string;
    }>`
      select id, operator_key, name, description, status, contract_json, contract_hash, review_hash,
             source_case_id, created_at::text as created_at
      from operators where id = ${id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Operator not found.");
    return mapOperator(rows[0]);
  });

export const createOperator = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    operatorKey: string;
    name: string;
    description: string;
    contract: OperatorContract;
    sourceCaseId?: string | null;
  }) => ({
    operatorKey: input.operatorKey.trim().toLowerCase().replace(/\s+/g, "-"),
    name: input.name.trim(),
    description: input.description.trim(),
    contract: {
      kill_switch: input.contract.kill_switch.trim(),
      intervention: input.contract.intervention.trim(),
      recovery_test: input.contract.recovery_test.trim(),
      held_out_prediction: input.contract.held_out_prediction.trim(),
    },
    sourceCaseId: input.sourceCaseId ?? null,
  }))
  .handler(async ({ context, data }) => {
    if (!data.operatorKey || !data.name) throw new Error("Operator key and name are required.");
    const missing = Object.entries(data.contract)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    if (missing.length) throw new Error(`Contract incomplete: ${missing.join(", ")}`);
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const id = mintId("op");
    const { contractHash, reviewHash } = operatorHashes(data);
    const contractJson = JSON.stringify(data.contract);
    try {
      await sql`
        insert into operators (
          id, user_id, operator_key, name, description, status,
          contract_json, contract_hash, review_hash, source_case_id
        ) values (
          ${id}, ${context.userId}, ${data.operatorKey}, ${data.name}, ${data.description},
          ${"review_needed"}, ${contractJson}, ${contractHash}, ${reviewHash}, ${data.sourceCaseId}
        )
      `;
    } catch {
      throw new Error("An operator with that key already exists in this lab.");
    }
    return { id, contractHash, reviewHash };
  });

export const importStarterGenome = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    let imported = 0;
    for (const op of STARTER_OPERATORS) {
      const existing = await sql<{ id: string }>`
        select id from operators where user_id = ${context.userId} and operator_key = ${op.operatorKey}
      `;
      if (existing[0]) continue;
      const id = mintId("op");
      const { contractHash, reviewHash } = operatorHashes({
        operatorKey: op.operatorKey,
        name: op.name,
        description: op.description,
        contract: op.contract,
      });
      const contractJson = JSON.stringify(op.contract);
      await sql`
        insert into operators (
          id, user_id, operator_key, name, description, status,
          contract_json, contract_hash, review_hash, source_case_id
        ) values (
          ${id}, ${context.userId}, ${op.operatorKey}, ${op.name}, ${op.description},
          ${"review_needed"}, ${contractJson}, ${contractHash}, ${reviewHash}, ${null}
        )
      `;
      imported += 1;
    }
    return { imported };
  });

export const freezeOperator = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; expectedReviewHash: string; confirmation: string }) => ({
    id: input.id,
    expectedReviewHash: input.expectedReviewHash.trim(),
    confirmation: input.confirmation.trim(),
  }))
  .handler(async ({ context, data }) => {
    if (data.confirmation !== PHRASES.freezeOperator) {
      throw new Error("Confirmation phrase does not match.");
    }
    const sql = await getSql();
    const rows = await sql<{ status: string; review_hash: string }>`
      select status, review_hash from operators where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Operator not found.");
    if (rows[0].status !== "review_needed") throw new Error("Only review_needed operators can be frozen.");
    if (rows[0].review_hash !== data.expectedReviewHash) {
      throw new Error("Review hash mismatch. Freeze only the exact reviewed contract.");
    }
    await sql`
      update operators set status = ${"frozen"}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const listEvidence = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const rows = await sql<{
      id: string;
      schema_id: string;
      source_kind: string;
      case_id: string | null;
      operator_id: string | null;
      experiment_id: string | null;
      domain: string;
      outcome: string;
      independence_level: string;
      body_json: string;
      receipt_hash: string;
      eligibility_json: string;
      created_at: string;
    }>`
      select id, schema_id, source_kind, case_id, operator_id, experiment_id, domain, outcome,
             independence_level, body_json, receipt_hash, eligibility_json,
             created_at::text as created_at
      from evidence_receipts where user_id = ${context.userId}
      order by created_at desc
    `;
    return rows.map(mapEvidence);
  });

export const createEvidence = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    sourceKind: SourceKind;
    domain: string;
    outcome: EvidenceOutcome;
    independenceLevel: IndependenceLevel;
    body: string;
    caseId?: string | null;
    operatorId?: string | null;
    experimentId?: string | null;
  }) => ({
    sourceKind: input.sourceKind,
    domain: input.domain.trim(),
    outcome: input.outcome,
    independenceLevel: input.independenceLevel,
    body: input.body.trim(),
    caseId: input.caseId ?? null,
    operatorId: input.operatorId ?? null,
    experimentId: input.experimentId ?? null,
  }))
  .handler(async ({ context, data }) => {
    if (!data.domain || !data.body) throw new Error("Domain and body are required.");
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const eligibility = eligibilityFor(data.sourceKind);
    const id = mintId("evidence");
    const receipt = {
      schema: "orbita-evidence-receipt/1",
      id,
      source_kind: data.sourceKind,
      domain: data.domain,
      outcome: data.outcome,
      independence_level: data.independenceLevel,
      body: data.body,
      case_id: data.caseId,
      operator_id: data.operatorId,
      experiment_id: data.experimentId,
      eligibility,
    };
    const receiptHash = hashCanonical(receipt);
    await sql`
      insert into evidence_receipts (
        id, user_id, schema_id, source_kind, case_id, operator_id, experiment_id,
        domain, outcome, independence_level, body_json, receipt_hash, eligibility_json
      ) values (
        ${id}, ${context.userId}, ${"orbita-evidence-receipt/1"}, ${data.sourceKind},
        ${data.caseId}, ${data.operatorId}, ${data.experimentId}, ${data.domain},
        ${data.outcome}, ${data.independenceLevel}, ${JSON.stringify({ note: data.body })},
        ${receiptHash}, ${JSON.stringify(eligibility)}
      )
    `;
    return { id, receiptHash, eligibility };
  });

export const verifyEvidence = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      schema_id: string;
      source_kind: string;
      case_id: string | null;
      operator_id: string | null;
      experiment_id: string | null;
      domain: string;
      outcome: string;
      independence_level: string;
      body_json: string;
      receipt_hash: string;
      eligibility_json: string;
      created_at: string;
    }>`
      select id, schema_id, source_kind, case_id, operator_id, experiment_id, domain, outcome,
             independence_level, body_json, receipt_hash, eligibility_json,
             created_at::text as created_at
      from evidence_receipts where id = ${id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Receipt not found.");
    const rec = mapEvidence(rows[0]);
    const eligibility = eligibilityFor(rec.sourceKind);
    const rebuilt = {
      schema: rec.schemaId,
      id: rec.id,
      source_kind: rec.sourceKind,
      domain: rec.domain,
      outcome: rec.outcome,
      independence_level: rec.independenceLevel,
      body: jsonNote(rec.body),
      case_id: rec.caseId,
      operator_id: rec.operatorId,
      experiment_id: rec.experimentId,
      eligibility,
    };
    const recomputed = hashCanonical(rebuilt);
    return {
      id: rec.id,
      stored: rec.receiptHash,
      recomputed,
      matches: recomputed === rec.receiptHash,
      eligibility,
    };
  });

export const listExperiments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const rows = await sql<{
      id: string;
      case_id: string;
      scientific_question: string;
      claim_scope_json: string;
      execution_spec_json: string;
      verdict_schema_json: string;
      independent_verifier_json: string;
      falsification_coverage_json: string;
      anti_rescue_rules_json: string;
      experiment_hash: string;
      manifest_json: string | null;
      manifest_hash: string | null;
      status: string;
      created_by: string;
      created_at: string;
    }>`
      select id, case_id, scientific_question, claim_scope_json, execution_spec_json,
             verdict_schema_json, independent_verifier_json, falsification_coverage_json,
             anti_rescue_rules_json, experiment_hash, manifest_json, manifest_hash, status,
             created_by, created_at::text as created_at
      from experiments where user_id = ${context.userId}
      order by created_at desc
    `;
    return rows.map(mapExperiment);
  });

export const createExperiment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    caseId: string;
    scientificQuestion: string;
    claimScope: string;
    executionSpec: string;
    verifier: string;
    coverage: string;
    antiRescue: string;
    createdBy: string;
  }) => ({
    caseId: input.caseId,
    scientificQuestion: input.scientificQuestion.trim(),
    claimScope: input.claimScope.trim(),
    executionSpec: input.executionSpec.trim(),
    verifier: input.verifier.trim(),
    coverage: input.coverage.trim(),
    antiRescue: input.antiRescue.trim(),
    createdBy: input.createdBy.trim() || "lab-owner",
  }))
  .handler(async ({ context, data }) => {
    if (!data.scientificQuestion) throw new Error("Scientific question is required.");
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const cases = await sql<{ id: string }>`
      select id from cases where id = ${data.caseId} and user_id = ${context.userId}
    `;
    if (!cases[0]) throw new Error("Case not found in this lab.");
    const frozen = {
      case_id: data.caseId,
      scientific_question: data.scientificQuestion,
      claim_scope: { text: data.claimScope },
      execution_spec: { text: data.executionSpec },
      verdict_schema: { allowed: ["supported", "refuted", "inconclusive", "artifact"] },
      independent_verifier: { text: data.verifier },
      falsification_coverage: { text: data.coverage },
      anti_rescue_rules: data.antiRescue
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const experimentHash = hashCanonical(frozen);
    const id = mintId("exp");
    await sql`
      insert into experiments (
        id, user_id, case_id, scientific_question, claim_scope_json, execution_spec_json,
        verdict_schema_json, independent_verifier_json, falsification_coverage_json,
        anti_rescue_rules_json, experiment_hash, status, created_by
      ) values (
        ${id}, ${context.userId}, ${data.caseId}, ${data.scientificQuestion},
        ${JSON.stringify(frozen.claim_scope)}, ${JSON.stringify(frozen.execution_spec)},
        ${JSON.stringify(frozen.verdict_schema)}, ${JSON.stringify(frozen.independent_verifier)},
        ${JSON.stringify(frozen.falsification_coverage)}, ${JSON.stringify(frozen.anti_rescue_rules)},
        ${experimentHash}, ${"draft"}, ${data.createdBy}
      )
    `;
    return { id, experimentHash };
  });

export const freezeExperiment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; expectedExperimentHash: string }) => ({
    id: input.id,
    expectedExperimentHash: input.expectedExperimentHash.trim(),
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ status: string; experiment_hash: string }>`
      select status, experiment_hash from experiments where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Experiment not found.");
    if (rows[0].status !== "draft") throw new Error("Only draft experiments can be frozen.");
    if (rows[0].experiment_hash !== data.expectedExperimentHash) {
      throw new Error("Experiment hash mismatch.");
    }
    await sql`
      update experiments set status = ${"frozen"}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const stageExperiment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; expectedExperimentHash: string; submittedBy: string }) => ({
    id: input.id,
    expectedExperimentHash: input.expectedExperimentHash.trim(),
    submittedBy: input.submittedBy.trim() || "lab-owner",
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ status: string; experiment_hash: string }>`
      select status, experiment_hash from experiments where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Experiment not found.");
    if (rows[0].status !== "frozen") throw new Error("Only frozen experiments can be staged.");
    if (rows[0].experiment_hash !== data.expectedExperimentHash) {
      throw new Error("Experiment hash mismatch.");
    }
    const manifest = {
      experiment_id: data.id,
      experiment_hash: rows[0].experiment_hash,
      submitted_by: data.submittedBy,
      runtime_activation: false,
      execution: "blocked_pending_approval",
    };
    const manifestHash = hashCanonical(manifest);
    await sql`
      update experiments
      set status = ${"staged"},
          manifest_json = ${JSON.stringify(manifest)},
          manifest_hash = ${manifestHash}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { manifestHash };
  });

export const approveExperiment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id: string;
    expectedExperimentHash: string;
    expectedManifestHash: string;
    reviewer: string;
    rationale: string;
    confirmation: string;
  }) => ({
    id: input.id,
    expectedExperimentHash: input.expectedExperimentHash.trim(),
    expectedManifestHash: input.expectedManifestHash.trim(),
    reviewer: input.reviewer.trim(),
    rationale: input.rationale.trim(),
    confirmation: input.confirmation.trim(),
  }))
  .handler(async ({ context, data }) => {
    if (data.confirmation !== PHRASES.approveExperiment) {
      throw new Error("Confirmation phrase does not match.");
    }
    if (!data.reviewer || !data.rationale) throw new Error("Reviewer and rationale are required.");
    const sql = await getSql();
    const rows = await sql<{
      status: string;
      experiment_hash: string;
      manifest_hash: string | null;
    }>`
      select status, experiment_hash, manifest_hash
      from experiments where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Experiment not found.");
    if (rows[0].status !== "staged") throw new Error("Only staged experiments can be approved.");
    const accepted =
      rows[0].experiment_hash === data.expectedExperimentHash &&
      rows[0].manifest_hash === data.expectedManifestHash;
    const approvalId = mintId("appr");
    await sql`
      insert into experiment_approvals (
        id, user_id, experiment_id, expected_experiment_hash, expected_manifest_hash,
        reviewer, rationale, confirmation, accepted
      ) values (
        ${approvalId}, ${context.userId}, ${data.id}, ${data.expectedExperimentHash},
        ${data.expectedManifestHash}, ${data.reviewer}, ${data.rationale},
        ${data.confirmation}, ${accepted}
      )
    `;
    if (!accepted) throw new Error("Hash mismatch. Approval recorded as rejected.");
    await sql`
      update experiments set status = ${"approved"}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true as const, approvalId };
  });

export const recordExperiment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; observation: string; outcome: EvidenceOutcome }) => ({
    id: input.id,
    observation: input.observation.trim(),
    outcome: input.outcome,
  }))
  .handler(async ({ context, data }) => {
    if (!data.observation) throw new Error("Observation receipt is required.");
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const rows = await sql<{
      status: string;
      case_id: string;
      scientific_question: string;
    }>`
      select status, case_id, scientific_question
      from experiments where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Experiment not found.");
    if (rows[0].status !== "approved") throw new Error("Only approved experiments can record receipts.");
    const eligibility = eligibilityFor("EXTERNAL_EXPERIMENT");
    const evidenceId = mintId("evidence");
    const receipt = {
      schema: "orbita-evidence-receipt/1",
      id: evidenceId,
      source_kind: "EXTERNAL_EXPERIMENT",
      domain: "external-experiment",
      outcome: data.outcome,
      independence_level: "external",
      body: data.observation,
      case_id: rows[0].case_id,
      operator_id: null,
      experiment_id: data.id,
      eligibility,
    };
    const receiptHash = hashCanonical(receipt);
    await sql`
      insert into evidence_receipts (
        id, user_id, schema_id, source_kind, case_id, operator_id, experiment_id,
        domain, outcome, independence_level, body_json, receipt_hash, eligibility_json
      ) values (
        ${evidenceId}, ${context.userId}, ${"orbita-evidence-receipt/1"}, ${"EXTERNAL_EXPERIMENT"},
        ${rows[0].case_id}, ${null}, ${data.id}, ${"external-experiment"},
        ${data.outcome}, ${"external"}, ${JSON.stringify({ note: data.observation })},
        ${receiptHash}, ${JSON.stringify(eligibility)}
      )
    `;
    await sql`
      update experiments set status = ${"recorded"}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { evidenceId, receiptHash };
  });

export const listLoops = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const rows = await sql<{
      id: string;
      goal: string;
      success_criteria_json: string;
      allowed_capabilities_json: string;
      max_cycles: number;
      state: string;
      cycle: number;
      previous_event_hash: string;
      created_by: string;
      created_at: string;
    }>`
      select id, goal, success_criteria_json, allowed_capabilities_json, max_cycles, state, cycle,
             previous_event_hash, created_by, created_at::text as created_at
      from problem_loops where user_id = ${context.userId}
      order by created_at desc
    `;
    return rows.map((r) => ({ ...mapLoop(r), events: [] as ProblemLoopEvent[] }));
  });

export const getLoop = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      goal: string;
      success_criteria_json: string;
      allowed_capabilities_json: string;
      max_cycles: number;
      state: string;
      cycle: number;
      previous_event_hash: string;
      created_by: string;
      created_at: string;
    }>`
      select id, goal, success_criteria_json, allowed_capabilities_json, max_cycles, state, cycle,
             previous_event_hash, created_by, created_at::text as created_at
      from problem_loops where id = ${id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Loop not found.");
    const events = await sql<{
      id: string;
      state: string;
      next_state: string;
      artifact_json: string;
      artifact_hash: string;
      event_hash: string;
      previous_event_hash: string;
      actor: string;
      created_at: string;
    }>`
      select id, state, next_state, artifact_json, artifact_hash, event_hash, previous_event_hash,
             actor, created_at::text as created_at
      from problem_loop_events
      where loop_id = ${id} and user_id = ${context.userId}
      order by created_at asc
    `;
    return { ...mapLoop(rows[0]), events: events.map(mapEvent) };
  });

export const createLoop = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    goal: string;
    successCriteria: string;
    allowedCapabilities: string;
    maxCycles: number;
    createdBy: string;
  }) => ({
    goal: input.goal.trim(),
    successCriteria: input.successCriteria
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    allowedCapabilities: input.allowedCapabilities
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    maxCycles: Math.max(1, Math.min(8, Number(input.maxCycles) || 3)),
    createdBy: input.createdBy.trim() || "lab-owner",
  }))
  .handler(async ({ context, data }) => {
    if (!data.goal || data.successCriteria.length === 0) {
      throw new Error("Goal and at least one success criterion are required.");
    }
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const id = mintId("loop");
    await sql`
      insert into problem_loops (
        id, user_id, goal, success_criteria_json, allowed_capabilities_json,
        max_cycles, state, cycle, previous_event_hash, created_by
      ) values (
        ${id}, ${context.userId}, ${data.goal}, ${JSON.stringify(data.successCriteria)},
        ${JSON.stringify(data.allowedCapabilities)}, ${data.maxCycles}, ${"GOAL"},
        ${0}, ${"genesis"}, ${data.createdBy}
      )
    `;
    return { id };
  });

export const advanceLoop = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id: string;
    expectedState: LoopState;
    expectedPreviousEventHash: string;
    artifact: JsonValue;
    actor: string;
  }) => ({
    id: input.id,
    expectedState: input.expectedState,
    expectedPreviousEventHash: input.expectedPreviousEventHash.trim(),
    artifact: input.artifact,
    actor: input.actor.trim() || "lab-owner",
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{
      state: string;
      cycle: number;
      max_cycles: number;
      previous_event_hash: string;
    }>`
      select state, cycle, max_cycles, previous_event_hash
      from problem_loops where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Loop not found.");
    if (rows[0].state !== data.expectedState) {
      throw new Error(`Expected state ${data.expectedState}, loop is in ${rows[0].state}.`);
    }
    if (rows[0].previous_event_hash !== data.expectedPreviousEventHash) {
      throw new Error("Event-chain hash mismatch. Reload the loop and retry.");
    }
    const state = rows[0].state as LoopState;
    assertStageArtifact(state, data.artifact);
    const next = nextLoopState(state, data.artifact, rows[0].cycle, rows[0].max_cycles);
    const artifactHash = hashCanonical(data.artifact);
    const eventPayload = {
      loop_id: data.id,
      state,
      next_state: next,
      artifact_hash: artifactHash,
      previous_event_hash: rows[0].previous_event_hash,
      actor: data.actor,
    };
    const eventHash = hashCanonical(eventPayload);
    const eventId = mintId("evt");
    await sql`
      insert into problem_loop_events (
        id, user_id, loop_id, state, next_state, artifact_json, artifact_hash,
        event_hash, previous_event_hash, actor
      ) values (
        ${eventId}, ${context.userId}, ${data.id}, ${state}, ${next},
        ${JSON.stringify(data.artifact)}, ${artifactHash}, ${eventHash},
        ${rows[0].previous_event_hash}, ${data.actor}
      )
    `;
    const nextCycle = state === "RETRY" ? rows[0].cycle + 1 : rows[0].cycle;
    await sql`
      update problem_loops
      set state = ${next}, cycle = ${nextCycle}, previous_event_hash = ${eventHash}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { nextState: next, eventHash };
  });

export const verifyLoop = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const events = await sql<{
      event_hash: string;
      previous_event_hash: string;
      state: string;
      next_state: string;
      artifact_json: string;
      actor: string;
    }>`
      select event_hash, previous_event_hash, state, next_state, artifact_json, actor
      from problem_loop_events
      where loop_id = ${id} and user_id = ${context.userId}
      order by created_at asc
    `;
    let prev = "genesis";
    const issues: string[] = [];
    for (const ev of events) {
      if (ev.previous_event_hash !== prev) {
        issues.push(`Broken chain at ${ev.state}: expected previous ${prev}.`);
      }
      const artifact = parseJson<JsonValue>(ev.artifact_json, {});
      const artifactHash = hashCanonical(artifact);
      const eventPayload = {
        loop_id: id,
        state: ev.state,
        next_state: ev.next_state,
        artifact_hash: artifactHash,
        previous_event_hash: ev.previous_event_hash,
        actor: ev.actor,
      };
      const recomputed = hashCanonical(eventPayload);
      if (recomputed !== ev.event_hash) {
        issues.push(`Hash mismatch at ${ev.state}.`);
      }
      prev = ev.event_hash;
    }
    return { events: events.length, intact: issues.length === 0, issues };
  });

export const listClaims = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const rows = await sql<{
      id: string;
      case_id: string | null;
      claim_key: string;
      statement: string;
      epistemic_status: string;
      scope_json: string;
      superseded_by: string | null;
      created_at: string;
    }>`
      select id, case_id, claim_key, statement, epistemic_status, scope_json, superseded_by,
             created_at::text as created_at
      from claims where user_id = ${context.userId}
      order by created_at desc
    `;
    const cons = await sql<{
      id: string;
      claim_a: string;
      claim_b: string;
      rationale: string;
      created_at: string;
    }>`
      select id, claim_a, claim_b, rationale, created_at::text as created_at
      from contradictions where user_id = ${context.userId}
      order by created_at desc
    `;
    return {
      claims: rows.map(mapClaim),
      contradictions: cons.map((c) => ({
        id: c.id,
        claimA: c.claim_a,
        claimB: c.claim_b,
        rationale: c.rationale,
        createdAt: c.created_at,
      })),
    };
  });

export const createClaim = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    claimKey: string;
    statement: string;
    epistemicStatus: EpistemicStatus;
    scope: string;
    caseId?: string | null;
  }) => ({
    claimKey: input.claimKey.trim().toUpperCase().replace(/\s+/g, "-"),
    statement: input.statement.trim(),
    epistemicStatus: input.epistemicStatus,
    scope: input.scope.trim(),
    caseId: input.caseId ?? null,
  }))
  .handler(async ({ context, data }) => {
    if (!data.claimKey || !data.statement || !data.scope) {
      throw new Error("Key, statement, and scope are required.");
    }
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const id = mintId("claim");
    await sql`
      insert into claims (id, user_id, case_id, claim_key, statement, epistemic_status, scope_json)
      values (
        ${id}, ${context.userId}, ${data.caseId}, ${data.claimKey}, ${data.statement},
        ${data.epistemicStatus}, ${JSON.stringify({ text: data.scope })}
      )
    `;
    return { id };
  });

export const supersedeClaim = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; newStatement: string; rationale: string }) => ({
    id: input.id,
    newStatement: input.newStatement.trim(),
    rationale: input.rationale.trim(),
  }))
  .handler(async ({ context, data }) => {
    if (!data.newStatement || !data.rationale) throw new Error("Statement and rationale are required.");
    const sql = await getSql();
    const rows = await sql<{
      claim_key: string;
      case_id: string | null;
      scope_json: string;
    }>`
      select claim_key, case_id, scope_json from claims
      where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Claim not found.");
    const newId = mintId("claim");
    await sql`
      insert into claims (id, user_id, case_id, claim_key, statement, epistemic_status, scope_json)
      values (
        ${newId}, ${context.userId}, ${rows[0].case_id}, ${rows[0].claim_key}, ${data.newStatement},
        ${"HYPOTHESIS"}, ${rows[0].scope_json}
      )
    `;
    await sql`
      update claims set epistemic_status = ${"SUPERSEDED"}, superseded_by = ${newId}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { id: newId };
  });

export const addContradiction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { claimA: string; claimB: string; rationale: string }) => ({
    claimA: input.claimA,
    claimB: input.claimB,
    rationale: input.rationale.trim(),
  }))
  .handler(async ({ context, data }) => {
    if (data.claimA === data.claimB) throw new Error("A contradiction needs two distinct claims.");
    if (!data.rationale) throw new Error("Rationale is required.");
    const sql = await getSql();
    const found = await sql<{ id: string }>`
      select id from claims
      where user_id = ${context.userId} and id in (${data.claimA}, ${data.claimB})
    `;
    if (found.length < 2) throw new Error("Both claims must belong to this lab.");
    const id = mintId("contra");
    await sql`
      insert into contradictions (id, user_id, claim_a, claim_b, rationale)
      values (${id}, ${context.userId}, ${data.claimA}, ${data.claimB}, ${data.rationale})
    `;
    return { id };
  });

export const listTournaments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const rows = await sql<{
      id: string;
      name: string;
      target_json: string;
      status: string;
      manifest_hash: string;
      anti_rescue: boolean;
      created_at: string;
    }>`
      select id, name, target_json, status, manifest_hash, anti_rescue,
             created_at::text as created_at
      from tournaments where user_id = ${context.userId}
      order by created_at desc
    `;
    return rows.map(mapTournament);
  });

export const createTournament = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string; target: string }) => ({
    name: input.name.trim(),
    target: input.target.trim(),
  }))
  .handler(async ({ context, data }) => {
    if (!data.name || !data.target) throw new Error("Name and unseen target are required.");
    const sql = await getSql();
    await ensureLab(sql, context.userId);
    const id = mintId("tour");
    const target = { unseen: data.target };
    const manifestHash = hashCanonical({
      id,
      name: data.name,
      target,
      anti_rescue: true,
      status: "draft",
    });
    await sql`
      insert into tournaments (id, user_id, name, target_json, status, manifest_hash, anti_rescue)
      values (${id}, ${context.userId}, ${data.name}, ${JSON.stringify(target)}, ${"draft"}, ${manifestHash}, ${true})
    `;
    return { id, manifestHash };
  });

export const freezeTournament = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; expectedReviewHash: string; confirmation: string }) => ({
    id: input.id,
    expectedReviewHash: input.expectedReviewHash.trim(),
    confirmation: input.confirmation.trim(),
  }))
  .handler(async ({ context, data }) => {
    if (data.confirmation !== PHRASES.freezeTournament) {
      throw new Error("Confirmation phrase does not match.");
    }
    const sql = await getSql();
    const rows = await sql<{ status: string; manifest_hash: string }>`
      select status, manifest_hash from tournaments where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Tournament not found.");
    if (rows[0].status !== "draft") throw new Error("Only draft tournaments can be frozen.");
    if (rows[0].manifest_hash !== data.expectedReviewHash) {
      throw new Error("Manifest hash mismatch.");
    }
    await sql`
      update tournaments set status = ${"frozen"}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });
