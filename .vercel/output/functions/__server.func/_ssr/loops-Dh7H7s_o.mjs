//#region node_modules/.nitro/vite/services/ssr/assets/loops-Dh7H7s_o.js
var LOOP_STATE_LIST = [
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
];
var STAGE_CONTRACTS = {
	GOAL: {
		required: ["acknowledged"],
		notes: "Charter is already frozen. Acknowledge to enter representation."
	},
	REPRESENT: { required: ["problem_representation", "unknowns"] },
	PLAN: { required: [
		"steps",
		"falsifiers",
		"success_checks",
		"anti_rescue_rules"
	] },
	ACT: {
		required: [
			"executor",
			"action_receipts",
			"execution_status"
		],
		notes: "Receipts only. This lab does not activate runtime execution."
	},
	OBSERVE: { required: ["observations", "evidence_hashes"] },
	FALSIFY: { required: [
		"verdict",
		"checks",
		"failed_checks",
		"scope"
	] },
	DIAGNOSE: { required: [
		"limitation_kind",
		"rationale",
		"evidence_hashes"
	] },
	REPAIR_LEARN: {
		required: [
			"repair_kind",
			"candidate_hash",
			"prospective_predictions",
			"known_risks"
		],
		notes: "activation_requested is always false."
	},
	RETRY: { required: [
		"change_summary",
		"retained_falsifiers",
		"retry_authorized"
	] },
	COMMIT_REFUSE: { required: [
		"decision",
		"statement",
		"evidence_hashes",
		"limitations"
	] }
};
function nextLoopState(state, artifact, cycle, maxCycles) {
	const rec = asRecord(artifact);
	switch (state) {
		case "GOAL": return "REPRESENT";
		case "REPRESENT": return "PLAN";
		case "PLAN": return "ACT";
		case "ACT":
			if (String(rec.execution_status ?? "") === "completed") return "OBSERVE";
			return "DIAGNOSE";
		case "OBSERVE": return "FALSIFY";
		case "FALSIFY":
			if (String(rec.verdict ?? "") === "survived") return "COMMIT_REFUSE";
			return "DIAGNOSE";
		case "DIAGNOSE": return "REPAIR_LEARN";
		case "REPAIR_LEARN": return "RETRY";
		case "RETRY":
			if (cycle + 1 >= maxCycles) return "COMMIT_REFUSE";
			return "PLAN";
		case "COMMIT_REFUSE": return "COMPLETED";
		case "COMPLETED": throw new Error("Loop is already completed.");
		default: throw new Error(`Unknown loop state: ${state}`);
	}
}
function assertStageArtifact(state, artifact) {
	const rec = asRecord(artifact);
	const contract = STAGE_CONTRACTS[state];
	if (!contract) throw new Error(`No stage contract for ${state}`);
	const missing = contract.required.filter((key) => {
		const value = rec[key];
		if (value === void 0 || value === null) return true;
		if (typeof value === "string" && value.trim() === "") return true;
		if (Array.isArray(value) && value.length === 0) return true;
		return false;
	});
	if (missing.length) throw new Error(`Stage ${state} is missing required fields: ${missing.join(", ")}`);
	if (state === "ACT") {
		const status = String(rec.execution_status);
		if (![
			"completed",
			"failed",
			"blocked",
			"not_executed"
		].includes(status)) throw new Error("ACT.execution_status must be completed, failed, blocked, or not_executed.");
	}
	if (state === "FALSIFY") {
		const verdict = String(rec.verdict);
		if (![
			"inconclusive",
			"refuted",
			"survived"
		].includes(verdict)) throw new Error("FALSIFY.verdict must be inconclusive, refuted, or survived.");
	}
	if (state === "COMMIT_REFUSE") {
		const decision = String(rec.decision);
		if (!["commit", "refuse"].includes(decision)) throw new Error("COMMIT_REFUSE.decision must be commit or refuse.");
	}
	if (state === "REPAIR_LEARN") rec.activation_requested = false;
}
function asRecord(value) {
	if (value && typeof value === "object" && !Array.isArray(value)) return value;
	throw new Error("Stage artifact must be an object.");
}
function defaultArtifact(state) {
	switch (state) {
		case "GOAL": return { acknowledged: true };
		case "REPRESENT": return {
			problem_representation: "",
			unknowns: ""
		};
		case "PLAN": return {
			steps: "",
			falsifiers: "",
			success_checks: "",
			anti_rescue_rules: ""
		};
		case "ACT": return {
			executor: "human",
			action_receipts: "",
			execution_status: "not_executed"
		};
		case "OBSERVE": return {
			observations: "",
			evidence_hashes: ""
		};
		case "FALSIFY": return {
			verdict: "inconclusive",
			checks: "",
			failed_checks: "none",
			scope: "this case only"
		};
		case "DIAGNOSE": return {
			limitation_kind: "SEARCH_FAILURE",
			rationale: "",
			evidence_hashes: ""
		};
		case "REPAIR_LEARN": return {
			repair_kind: "search_strategy",
			candidate_hash: "",
			prospective_predictions: "",
			known_risks: "",
			activation_requested: false
		};
		case "RETRY": return {
			change_summary: "",
			retained_falsifiers: "",
			retry_authorized: true
		};
		case "COMMIT_REFUSE": return {
			decision: "refuse",
			statement: "",
			evidence_hashes: "",
			limitations: ""
		};
		default: return {};
	}
}
//#endregion
export { nextLoopState as a, defaultArtifact as i, STAGE_CONTRACTS as n, assertStageArtifact as r, LOOP_STATE_LIST as t };
