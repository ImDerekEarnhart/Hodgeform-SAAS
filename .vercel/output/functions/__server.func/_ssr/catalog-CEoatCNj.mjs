//#region node_modules/.nitro/vite/services/ssr/assets/catalog-CEoatCNj.js
/** Seven cross-domain families. Imported as review_needed — nothing is frozen or proven. */
var STARTER_OPERATORS = [
	{
		operatorKey: "kill-switch-validation",
		name: "Kill-switch validation",
		description: "Refuse freeze unless the operator names a concrete, independently testable stop condition and a recovery test that reproduces identical hashes.",
		contract: {
			kill_switch: "Abort if the operator cannot name a stop condition that a second reviewer can execute without the original author.",
			intervention: "Insert a held-out trial the drafting process did not see, then require the kill switch to fire or stay silent as predicted.",
			recovery_test: "After abort, re-run the frozen protocol from stored artifacts and confirm contract_hash and review_hash are unchanged.",
			held_out_prediction: "A named binary: the kill switch fires (true) or stays silent (false) on the held-out trial."
		}
	},
	{
		operatorKey: "artifact-mimicry-detection",
		name: "Artifact-mimicry detection",
		description: "Separate genuine structure from artifacts that imitate it under the same representation.",
		contract: {
			kill_switch: "Abort if a shuffled or null control produces the same signature as the claimed discovery.",
			intervention: "Run a matched artifact cohort (label shuffle, time-reverse, or representation-preserving noise) alongside the candidate.",
			recovery_test: "Recompute the discriminant on frozen inputs; any drift in the signature hash fails recovery.",
			held_out_prediction: "The artifact cohort's discriminant stays below the pre-registered threshold."
		}
	},
	{
		operatorKey: "boundary-first-discovery",
		name: "Boundary-first discovery",
		description: "Search the failure surface before celebrating interior successes. Interior hits without a mapped boundary are not claims.",
		contract: {
			kill_switch: "Abort if no negative example or out-of-scope region is exhibited before a positive claim is written.",
			intervention: "Require a boundary sketch: at least one nearby input that flips the verdict.",
			recovery_test: "Replay the boundary pair from frozen inputs; both verdicts must match the registered pair.",
			held_out_prediction: "A held-out point on the claimed interior remains interior; a held-out boundary point flips."
		}
	},
	{
		operatorKey: "fiber-refinement-recovery",
		name: "Fiber-refinement recovery",
		description: "When a representation collapses distinct targets, refine the fiber rather than rescue the original statement.",
		contract: {
			kill_switch: "Abort if two frozen worlds share a representation but differ on the target and no refinement is proposed.",
			intervention: "Partition the colliding worlds and name the extra coordinate that separates them.",
			recovery_test: "Re-encode both worlds under the refined fiber; collision must disappear and hashes of the original snapshot must remain.",
			held_out_prediction: "A third frozen world is classified correctly by the refined fiber without refitting."
		}
	},
	{
		operatorKey: "relational-blindness-test",
		name: "Relational-blindness test",
		description: "Detect when language can name parts but cannot name the relation that makes the parts a whole.",
		contract: {
			kill_switch: "Abort if the protocol only scores token overlap or part lists and never tests a relation-level probe.",
			intervention: "Present two scenes with identical parts and opposite relations; require a forced-choice that cannot be solved from parts alone.",
			recovery_test: "Replay the forced-choice pair from frozen scenes; the registered relation label must be recovered.",
			held_out_prediction: "A new pair with the same relation and novel parts is classified as that relation."
		}
	},
	{
		operatorKey: "empirical-closure-trilemma",
		name: "Empirical-closure trilemma",
		description: "A claim, its evidence scope, and its intended use must close. If they do not, refuse promotion rather than stretch the scope.",
		contract: {
			kill_switch: "Abort if the intended use quantifies over a larger set than the evidence scope.",
			intervention: "Write the evidence scope, the claim scope, and the use-now decision as three frozen objects and check inclusion.",
			recovery_test: "Recompute the inclusion check from the three frozen objects; the boolean must match.",
			held_out_prediction: "A use that sits inside the evidence scope is allowed; a use that sits outside is refused."
		}
	},
	{
		operatorKey: "matched-cohort-ablation",
		name: "Matched-cohort ablation",
		description: "An effect is not a discovery until a matched cohort without the proposed mechanism fails to reproduce it.",
		contract: {
			kill_switch: "Abort if no matched cohort is named, or if the cohort differs on more than the claimed mechanism.",
			intervention: "Build a cohort matched on confounders and ablate only the proposed mechanism.",
			recovery_test: "Replay both arms from frozen assignments; effect-size hashes must match the registered pair.",
			held_out_prediction: "The ablated arm does not reproduce the effect above the pre-registered margin."
		}
	}
];
var ORIGIN_SNAPSHOT = {
	product: "Orbita Agent Research Server",
	version: "0.10.0",
	genome: "orbita-discovery-genome",
	tenancy: "authenticated subject binding",
	safety: {
		tenantSelectedBy: "authenticated subject binding",
		databaseExposed: false,
		automaticPolicyPromotion: false,
		runtimeActivation: false,
		toolExecution: "receipts_only",
		llmRole: "proposal_only"
	},
	loopStates: [
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
		"COMPLETED"
	],
	epistemic: [
		"HYPOTHESIS",
		"CONJECTURE",
		"FINITE_SURVIVOR",
		"PROVED_ON_PAPER",
		"USE_NOW",
		"FALSIFIED"
	]
};
//#endregion
export { STARTER_OPERATORS as n, ORIGIN_SNAPSHOT as t };
