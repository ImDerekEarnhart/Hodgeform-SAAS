import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Dc9vEUX4.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as createSsrRpc } from "./router-B8EonqWx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-a-eLEwaD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em]", {
	variants: { variant: {
		default: "bg-secondary text-muted-foreground",
		paper: "bg-primary/10 text-paper",
		steel: "bg-accent/15 text-steel",
		frozen: "bg-primary text-primary-foreground",
		warn: "bg-warn/15 text-warn",
		danger: "bg-destructive/15 text-destructive",
		outline: "border border-border text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function jsonStringField(value, key) {
	if (value && typeof value === "object" && !Array.isArray(value)) {
		const inner = value[key];
		if (typeof inner === "string") return inner;
	}
}
function shortHash(hash) {
	if (!hash) return "—";
	if (hash.length <= 18) return hash;
	return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}
function HashChip({ value, className }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cn("hash-chip inline-flex max-w-full items-center truncate rounded-sm bg-secondary px-2 py-1 text-[11px] text-steel hover:text-paper", className),
		title: value,
		onClick: async () => {
			try {
				await navigator.clipboard.writeText(value);
				setCopied(true);
				setTimeout(() => setCopied(false), 1200);
			} catch {
				toast.error("Could not copy hash.");
			}
		},
		children: copied ? "copied" : shortHash(value)
	});
}
function CaseBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: status === "approved" || status === "completed" ? "frozen" : status === "failed" ? "danger" : status === "plan_ready" ? "paper" : status === "ingested" ? "steel" : "default",
		children: status.replace("_", " ")
	});
}
function OperatorBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: status === "frozen" ? "frozen" : "warn",
		children: status.replace("_", " ")
	});
}
function ExperimentBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: status === "approved" || status === "recorded" ? "frozen" : status === "failed" ? "danger" : status === "staged" || status === "frozen" ? "steel" : "default",
		children: status
	});
}
function LoopBadge({ state }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: state === "COMPLETED" ? "frozen" : "steel",
		children: state
	});
}
function ClaimBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: status === "FALSIFIED" ? "danger" : status === "PROVED_ON_PAPER" || status === "USE_NOW" ? "frozen" : status === "FINITE_SURVIVOR" ? "steel" : status === "SUPERSEDED" ? "default" : "warn",
		children: status.replaceAll("_", " ")
	});
}
function TournamentBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: status === "frozen" || status === "completed" ? "frozen" : "default",
		children: status
	});
}
function PageHeader({ kicker, title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl",
			children: [
				kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium uppercase tracking-[0.18em] text-steel",
					children: kicker
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-medium tracking-tight text-paper sm:text-4xl",
					children: title
				}),
				description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: description
				}) : null
			]
		}), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: actions
		}) : null]
	});
}
function EmptyState({ title, body, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-6 py-14 text-center shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-paper",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
				children: body
			}),
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex justify-center",
				children: action
			}) : null
		]
	});
}
function errMessage(err) {
	return err instanceof Error ? err.message : "Something went wrong.";
}
var getOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("da17e6ce73df51018b0bc61d75d17e35bfd63ceae81ed76e4fb83b36a51912d0"));
var updateLab = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	name: input.name.trim(),
	charter: input.charter.trim()
})).handler(createSsrRpc("a1b4b1116a4a3f14a29174717d7b15b7fed1f3e1807bce0ed1f4dacfe82c926e"));
var listCases = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("772a8353235ac5cb223ed5a83bc443ddaa4495ebc32d895f296436d3d581db14"));
var getCase = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("371a5b040d73c083bce0b907ee337a53de3455eb0a2a5f5a00e9997759f1dcfe"));
var createCase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	name: input.name.trim(),
	goal: (input.goal ?? "").trim(),
	domainHint: (input.domainHint ?? "").trim() || null
})).handler(createSsrRpc("82736b389bfa30f58ee0155ff5c7914e66dd8067758fe3f99e647af7128189ee"));
var ingestCase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("e0f314cb2e51b45cf35089d6d4806f140366c0a926c6d1a2b9d73b35c20ce641"));
var writePlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	steps: input.steps.trim(),
	falsifiers: input.falsifiers.trim(),
	successChecks: input.successChecks.trim()
})).handler(createSsrRpc("02d966444ea7268c054faa3c40016d1d4c1c52ecdd643b9d8cad0859ed21068a"));
var approvePlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedPlanHash: input.expectedPlanHash.trim(),
	confirmation: input.confirmation.trim(),
	reviewer: input.reviewer.trim()
})).handler(createSsrRpc("f600533e3d7e6aee0980f3283d03df65946bc0fd70d7963253b2a2d94e74b452"));
var completeCase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("85baa82556f8beca695738cde4f2cc792ec20fc2b37bffa18950a81fce1b2f95"));
var deleteCase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	confirmation: input.confirmation.trim()
})).handler(createSsrRpc("36fb45ae704b0db1cade6454e96f280b06983976faa92a82f2b7b5f392ef63a2"));
var listOperators = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2d080aa63017418c2d9cea6f0c00ae6195ec22e35368a46bff240a8687ababd7"));
var getOperator = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("24cfddc75f49aa26d4be9d9d2f5b3f885c814400092b0fae270e454793d7cb95"));
var createOperator = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	operatorKey: input.operatorKey.trim().toLowerCase().replace(/\s+/g, "-"),
	name: input.name.trim(),
	description: input.description.trim(),
	contract: {
		kill_switch: input.contract.kill_switch.trim(),
		intervention: input.contract.intervention.trim(),
		recovery_test: input.contract.recovery_test.trim(),
		held_out_prediction: input.contract.held_out_prediction.trim()
	},
	sourceCaseId: input.sourceCaseId ?? null
})).handler(createSsrRpc("cf3938794ee3396a2717f59131f0172c051ff7057c62b7662f59c12c1e3b521d"));
var importStarterGenome = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("95e95ef458854e5cd9442d39339f7f2300cb6ba2add1cd98141535b9582d971d"));
var freezeOperator = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedReviewHash: input.expectedReviewHash.trim(),
	confirmation: input.confirmation.trim()
})).handler(createSsrRpc("a50fb3a5b43b72ef0d0a9a69c4ab0e7708b0573fb12a6f12b2dbc2157277ad30"));
var listEvidence = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("328e38ca6a734e95ca5c3c05453edd611e11cfe2b025d1efe12b8203d7a5c1be"));
var createEvidence = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	sourceKind: input.sourceKind,
	domain: input.domain.trim(),
	outcome: input.outcome,
	independenceLevel: input.independenceLevel,
	body: input.body.trim(),
	caseId: input.caseId ?? null,
	operatorId: input.operatorId ?? null,
	experimentId: input.experimentId ?? null
})).handler(createSsrRpc("823ddc13ab39b0d96c15a0961b8f82d3572e617d912adf208b09f065c0deaeb7"));
var verifyEvidence = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("38a587876ffad343d1abf418ce9727878d5e61d183eb438c9e24307c1c47aa96"));
var listExperiments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3763c8a6bb54e306539ed7f264325cdf2f1e177c25dce39872aec7399b6da384"));
var createExperiment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	caseId: input.caseId,
	scientificQuestion: input.scientificQuestion.trim(),
	claimScope: input.claimScope.trim(),
	executionSpec: input.executionSpec.trim(),
	verifier: input.verifier.trim(),
	coverage: input.coverage.trim(),
	antiRescue: input.antiRescue.trim(),
	createdBy: input.createdBy.trim() || "lab-owner"
})).handler(createSsrRpc("9083e15e38b64602e86f372178e27d584afed84b33884a4d0535058e8908e87d"));
var freezeExperiment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedExperimentHash: input.expectedExperimentHash.trim()
})).handler(createSsrRpc("6b150694997c0ddf096c20fd5182ea43b7dfcb7841eed036443de5223e1800bf"));
var stageExperiment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedExperimentHash: input.expectedExperimentHash.trim(),
	submittedBy: input.submittedBy.trim() || "lab-owner"
})).handler(createSsrRpc("1924efa8ce614494af72125031d19297836fac67e4e0a4ca67453ec14bc0bc94"));
var approveExperiment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedExperimentHash: input.expectedExperimentHash.trim(),
	expectedManifestHash: input.expectedManifestHash.trim(),
	reviewer: input.reviewer.trim(),
	rationale: input.rationale.trim(),
	confirmation: input.confirmation.trim()
})).handler(createSsrRpc("48a6666c1b8f7c39ace8d303c80ec195d737708068e2a1ced5b1955aa1448ec3"));
var recordExperiment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	observation: input.observation.trim(),
	outcome: input.outcome
})).handler(createSsrRpc("a65f3ad5a3ab3d98aa13847d1fc05b6c97f87cff882f8b17df0830e7741c81e9"));
var listLoops = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8951745397edd69ab47d0b4be7c627a4a3e81263c1ca37562dec688030ab323b"));
var getLoop = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("f87d2b8ccc5df9275439f866cf430564e77f8c84820ee822150ff4283545701d"));
var createLoop = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	goal: input.goal.trim(),
	successCriteria: input.successCriteria.split("\n").map((s) => s.trim()).filter(Boolean),
	allowedCapabilities: input.allowedCapabilities.split("\n").map((s) => s.trim()).filter(Boolean),
	maxCycles: Math.max(1, Math.min(8, Number(input.maxCycles) || 3)),
	createdBy: input.createdBy.trim() || "lab-owner"
})).handler(createSsrRpc("35f94c20cf0ff8a04f3c41f1d16ce93cfe0de9a52edcbe90d44ebcce33c17b82"));
var advanceLoop = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedState: input.expectedState,
	expectedPreviousEventHash: input.expectedPreviousEventHash.trim(),
	artifact: input.artifact,
	actor: input.actor.trim() || "lab-owner"
})).handler(createSsrRpc("eaab270e1ecae7de151754dd615f94076fc5aca8d43526f0cbe36158a42facf1"));
var verifyLoop = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("6eee07b635e9880eb4d52acf0788b248c1efdd4818247785515784344caee708"));
var listClaims = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3a38c7e808afe9096fac2f35cfd2902088fa2ff6e2fd3eef30c11c4f42d15b28"));
var createClaim = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	claimKey: input.claimKey.trim().toUpperCase().replace(/\s+/g, "-"),
	statement: input.statement.trim(),
	epistemicStatus: input.epistemicStatus,
	scope: input.scope.trim(),
	caseId: input.caseId ?? null
})).handler(createSsrRpc("665ca66a04ee16282e3994e353034138df28054b7e9adfcf6e71463c021ff71e"));
var supersedeClaim = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	newStatement: input.newStatement.trim(),
	rationale: input.rationale.trim()
})).handler(createSsrRpc("25a25e9a0f4832ed8e011ed111849a616acaa29f16489026d50f26b49903490a"));
var addContradiction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	claimA: input.claimA,
	claimB: input.claimB,
	rationale: input.rationale.trim()
})).handler(createSsrRpc("2268a4f6257b847c68d5a4b8e86e8843bee0434c69b8db41d2edbc0ef57fd265"));
var listTournaments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1c2cdaa4a7f80770ab04bf4325a4525cc246c2dd58b5491baa7f936ede6012c9"));
var createTournament = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	name: input.name.trim(),
	target: input.target.trim()
})).handler(createSsrRpc("51ea9907705055f9a2deecb1b9eb503b499c459b26bf1d35223b5a495fb85f58"));
var freezeTournament = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedReviewHash: input.expectedReviewHash.trim(),
	confirmation: input.confirmation.trim()
})).handler(createSsrRpc("98e14025b7f62533000b123be84163e19b4eb34ddc818333ef5fd912ac0e85a1"));
//#endregion
export { getOperator as A, listOperators as B, deleteCase as C, freezeTournament as D, freezeOperator as E, listCases as F, updateLab as G, recordExperiment as H, listClaims as I, writePlan as J, verifyEvidence as K, listEvidence as L, importStarterGenome as M, ingestCase as N, getCase as O, jsonStringField as P, listExperiments as R, createTournament as S, freezeExperiment as T, stageExperiment as U, listTournaments as V, supersedeClaim as W, createClaim as _, ExperimentBadge as a, createLoop as b, OperatorBadge as c, addContradiction as d, advanceLoop as f, createCase as g, completeCase as h, EmptyState as i, getOverview as j, getLoop as k, PageHeader as l, approvePlan as m, CaseBadge as n, HashChip as o, approveExperiment as p, verifyLoop as q, ClaimBadge as r, LoopBadge as s, Badge as t, TournamentBadge as u, createEvidence as v, errMessage as w, createOperator as x, createExperiment as y, listLoops as z };
