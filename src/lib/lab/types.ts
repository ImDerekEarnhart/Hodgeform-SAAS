export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export const CASE_STATUSES = [
  "created",
  "ingested",
  "plan_ready",
  "approved",
  "completed",
  "failed",
] as const;
export type CaseStatus = (typeof CASE_STATUSES)[number];

export const OPERATOR_STATUSES = ["review_needed", "frozen"] as const;
export type OperatorStatus = (typeof OPERATOR_STATUSES)[number];

export const EXPERIMENT_STATUSES = [
  "draft",
  "frozen",
  "staged",
  "approved",
  "recorded",
  "failed",
] as const;
export type ExperimentStatus = (typeof EXPERIMENT_STATUSES)[number];

export const TOURNAMENT_STATUSES = ["draft", "frozen", "revealed", "completed"] as const;
export type TournamentStatus = (typeof TOURNAMENT_STATUSES)[number];

export const LOOP_STATES = [
  "GOAL",
  "REPRESENT",
  "PLAN",
  "ACT",
  "OBSERVE",
  "FALSIFY",
  "DIAGNOSE",
  "REPAIR_LEARN",
  "RETRY",
  "COMMIT_REFUSE",
  "COMPLETED",
] as const;
export type LoopState = (typeof LOOP_STATES)[number];

export const EPISTEMIC_STATUSES = [
  "HYPOTHESIS",
  "CONJECTURE",
  "FINITE_SURVIVOR",
  "PROVED_ON_PAPER",
  "USE_NOW",
  "FALSIFIED",
  "SUPERSEDED",
] as const;
export type EpistemicStatus = (typeof EPISTEMIC_STATUSES)[number];

export const EVIDENCE_OUTCOMES = ["supported", "refuted", "inconclusive", "artifact"] as const;
export type EvidenceOutcome = (typeof EVIDENCE_OUTCOMES)[number];

export const INDEPENDENCE_LEVELS = ["same_case", "same_family", "cross_domain", "external"] as const;
export type IndependenceLevel = (typeof INDEPENDENCE_LEVELS)[number];

export const SOURCE_KINDS = [
  "DISCOVERY_RUN",
  "EXTERNAL_EXPERIMENT",
  "GENOME_TOURNAMENT",
  "INDEPENDENT_VERIFIER",
  "PROOF_ASSISTANT",
] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];

export type OperatorContract = {
  kill_switch: string;
  intervention: string;
  recovery_test: string;
  held_out_prediction: string;
};

export type Lab = {
  userId: string;
  name: string;
  slug: string;
  charter: string;
  createdAt: string;
};

export type LabPolicy = {
  requireHashBoundApproval: boolean;
  prohibitArchitectureReviewFromEvidence: boolean;
  requireHeldOutPrediction: boolean;
  noActivation: boolean;
  updatedAt: string;
};

export type ResearchCase = {
  id: string;
  name: string;
  goal: string;
  domainHint: string | null;
  status: CaseStatus;
  plan: JsonValue | null;
  planHash: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Operator = {
  id: string;
  operatorKey: string;
  name: string;
  description: string;
  status: OperatorStatus;
  contract: OperatorContract;
  contractHash: string;
  reviewHash: string;
  sourceCaseId: string | null;
  createdAt: string;
};

export type EvidenceReceipt = {
  id: string;
  schemaId: string;
  sourceKind: SourceKind;
  caseId: string | null;
  operatorId: string | null;
  experimentId: string | null;
  domain: string;
  outcome: EvidenceOutcome;
  independenceLevel: IndependenceLevel;
  body: JsonValue;
  receiptHash: string;
  eligibility: {
    allowed: string[];
    prohibited: string[];
  };
  createdAt: string;
};

export type Experiment = {
  id: string;
  caseId: string;
  scientificQuestion: string;
  claimScope: JsonValue;
  executionSpec: JsonValue;
  verdictSchema: JsonValue;
  independentVerifier: JsonValue;
  falsificationCoverage: JsonValue;
  antiRescueRules: string[];
  experimentHash: string;
  manifest: JsonValue | null;
  manifestHash: string | null;
  status: ExperimentStatus;
  createdBy: string;
  createdAt: string;
};

export type ProblemLoop = {
  id: string;
  goal: string;
  successCriteria: string[];
  allowedCapabilities: string[];
  maxCycles: number;
  state: LoopState;
  cycle: number;
  previousEventHash: string;
  createdBy: string;
  createdAt: string;
  events: ProblemLoopEvent[];
};

export type ProblemLoopEvent = {
  id: string;
  state: LoopState;
  nextState: LoopState;
  artifact: JsonValue;
  artifactHash: string;
  eventHash: string;
  previousEventHash: string;
  actor: string;
  createdAt: string;
};

export type KnowledgeClaim = {
  id: string;
  caseId: string | null;
  claimKey: string;
  statement: string;
  epistemicStatus: EpistemicStatus;
  scope: JsonValue;
  supersededBy: string | null;
  createdAt: string;
};

export type Contradiction = {
  id: string;
  claimA: string;
  claimB: string;
  rationale: string;
  createdAt: string;
};

export type Tournament = {
  id: string;
  name: string;
  target: JsonValue;
  status: TournamentStatus;
  manifestHash: string;
  antiRescue: boolean;
  createdAt: string;
};

export type LabOverview = {
  lab: Lab;
  policy: LabPolicy;
  counts: {
    cases: number;
    operators: number;
    frozenOperators: number;
    evidence: number;
    experiments: number;
    pendingApprovals: number;
    openLoops: number;
    claims: number;
    tournaments: number;
  };
};
