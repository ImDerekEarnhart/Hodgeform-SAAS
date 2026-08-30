/** Exact confirmation phrases — hash-bound review refuses any other string. */
export const PHRASES = {
  freezeOperator: "I reviewed this exact discovery operator",
  freezeTournament: "I reviewed this exact blind tournament",
  approvePlan: "I approve this exact plan",
  approveExperiment: "I approve this exact frozen experiment and staged manifest",
  deleteCase: "DELETE THIS CASE",
} as const;

export type PhraseKey = keyof typeof PHRASES;
