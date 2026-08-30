import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-BeTYogex.mjs";
import { t as authMiddleware } from "./middleware-Dc9vEUX4.mjs";
import { n as STARTER_OPERATORS } from "./catalog-CEoatCNj.mjs";
import { r as eligibilityFor } from "./eligibility-BMP3NZKx.mjs";
import { a as nextLoopState, r as assertStageArtifact } from "./loops-Dh7H7s_o.mjs";
import { t as PHRASES } from "./phrases-hctJGTVI.mjs";
import { createHash, randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/api-BB2uIlz1.js
function canonicalJson(value) {
	return JSON.stringify(sortKeys(value));
}
function sortKeys(value) {
	if (Array.isArray(value)) return value.map(sortKeys);
	if (value && typeof value === "object") {
		const obj = value;
		const out = {};
		for (const key of Object.keys(obj).sort()) out[key] = sortKeys(obj[key]);
		return out;
	}
	return value;
}
function sha256Hex(text) {
	return createHash("sha256").update(text).digest("hex");
}
function hashCanonical(value) {
	return sha256Hex(canonicalJson(value));
}
function mintId(prefix) {
	return `${prefix}_${randomBytes(8).toString("hex")}`;
}
function parseJson(raw, fallback) {
	if (!raw) return fallback;
	try {
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
function jsonNote(body) {
	if (body && typeof body === "object" && !Array.isArray(body) && typeof body.note === "string") return body.note;
	return JSON.stringify(body);
}
async function ensureLab(sql, userId) {
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
function mapLab(row) {
	return {
		userId: row.user_id,
		name: row.name,
		slug: row.slug,
		charter: row.charter,
		createdAt: row.created_at
	};
}
function mapPolicy(row) {
	return {
		requireHashBoundApproval: row.require_hash_bound_approval,
		prohibitArchitectureReviewFromEvidence: row.prohibit_architecture_review_from_evidence,
		requireHeldOutPrediction: row.require_held_out_prediction,
		noActivation: row.no_activation,
		updatedAt: row.updated_at
	};
}
function mapCase(row) {
	return {
		id: row.id,
		name: row.name,
		goal: row.goal,
		domainHint: row.domain_hint,
		status: row.status,
		plan: parseJson(row.plan_json, null),
		planHash: row.plan_hash,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
function mapOperator(row) {
	return {
		id: row.id,
		operatorKey: row.operator_key,
		name: row.name,
		description: row.description,
		status: row.status,
		contract: parseJson(row.contract_json, {
			kill_switch: "",
			intervention: "",
			recovery_test: "",
			held_out_prediction: ""
		}),
		contractHash: row.contract_hash,
		reviewHash: row.review_hash,
		sourceCaseId: row.source_case_id,
		createdAt: row.created_at
	};
}
function mapEvidence(row) {
	return {
		id: row.id,
		schemaId: row.schema_id,
		sourceKind: row.source_kind,
		caseId: row.case_id,
		operatorId: row.operator_id,
		experimentId: row.experiment_id,
		domain: row.domain,
		outcome: row.outcome,
		independenceLevel: row.independence_level,
		body: parseJson(row.body_json, {}),
		receiptHash: row.receipt_hash,
		eligibility: parseJson(row.eligibility_json, {
			allowed: [],
			prohibited: []
		}),
		createdAt: row.created_at
	};
}
function mapExperiment(row) {
	return {
		id: row.id,
		caseId: row.case_id,
		scientificQuestion: row.scientific_question,
		claimScope: parseJson(row.claim_scope_json, {}),
		executionSpec: parseJson(row.execution_spec_json, {}),
		verdictSchema: parseJson(row.verdict_schema_json, {}),
		independentVerifier: parseJson(row.independent_verifier_json, {}),
		falsificationCoverage: parseJson(row.falsification_coverage_json, {}),
		antiRescueRules: parseJson(row.anti_rescue_rules_json, []),
		experimentHash: row.experiment_hash,
		manifest: parseJson(row.manifest_json, null),
		manifestHash: row.manifest_hash,
		status: row.status,
		createdBy: row.created_by,
		createdAt: row.created_at
	};
}
function mapLoop(row) {
	return {
		id: row.id,
		goal: row.goal,
		successCriteria: parseJson(row.success_criteria_json, []),
		allowedCapabilities: parseJson(row.allowed_capabilities_json, []),
		maxCycles: row.max_cycles,
		state: row.state,
		cycle: row.cycle,
		previousEventHash: row.previous_event_hash,
		createdBy: row.created_by,
		createdAt: row.created_at
	};
}
function mapEvent(row) {
	return {
		id: row.id,
		state: row.state,
		nextState: row.next_state,
		artifact: parseJson(row.artifact_json, {}),
		artifactHash: row.artifact_hash,
		eventHash: row.event_hash,
		previousEventHash: row.previous_event_hash,
		actor: row.actor,
		createdAt: row.created_at
	};
}
function mapClaim(row) {
	return {
		id: row.id,
		caseId: row.case_id,
		claimKey: row.claim_key,
		statement: row.statement,
		epistemicStatus: row.epistemic_status,
		scope: parseJson(row.scope_json, {}),
		supersededBy: row.superseded_by,
		createdAt: row.created_at
	};
}
function mapTournament(row) {
	return {
		id: row.id,
		name: row.name,
		target: parseJson(row.target_json, {}),
		status: row.status,
		manifestHash: row.manifest_hash,
		antiRescue: row.anti_rescue,
		createdAt: row.created_at
	};
}
function operatorHashes(input) {
	const contractHash = hashCanonical(input.contract);
	return {
		contractHash,
		reviewHash: hashCanonical({
			operator_key: input.operatorKey,
			name: input.name,
			description: input.description,
			contract: input.contract,
			contract_hash: contractHash
		})
	};
}
var getOverview_createServerFn_handler = createServerRpc({
	id: "da17e6ce73df51018b0bc61d75d17e35bfd63ceae81ed76e4fb83b36a51912d0",
	name: "getOverview",
	filename: "src/lib/lab/api.ts"
}, (opts) => getOverview.__executeServer(opts));
var getOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getOverview_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureLab(sql, context.userId);
	const labs = await sql`select user_id, name, slug, charter, created_at::text as created_at from labs where user_id = ${context.userId}`;
	const policies = await sql`select require_hash_bound_approval, prohibit_architecture_review_from_evidence, require_held_out_prediction, no_activation, updated_at::text as updated_at from lab_policy where user_id = ${context.userId}`;
	const c = (await sql`
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
    `)[0];
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
			tournaments: c.tournaments
		}
	};
});
var updateLab_createServerFn_handler = createServerRpc({
	id: "a1b4b1116a4a3f14a29174717d7b15b7fed1f3e1807bce0ed1f4dacfe82c926e",
	name: "updateLab",
	filename: "src/lib/lab/api.ts"
}, (opts) => updateLab.__executeServer(opts));
var updateLab = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	name: input.name.trim(),
	charter: input.charter.trim()
})).handler(updateLab_createServerFn_handler, async ({ context, data }) => {
	if (!data.name) throw new Error("Lab name is required.");
	const sql = await getSql();
	await ensureLab(sql, context.userId);
	const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "lab";
	await sql`
      update labs set name = ${data.name}, slug = ${slug}, charter = ${data.charter}
      where user_id = ${context.userId}
    `;
	return { ok: true };
});
var listCases_createServerFn_handler = createServerRpc({
	id: "772a8353235ac5cb223ed5a83bc443ddaa4495ebc32d895f296436d3d581db14",
	name: "listCases",
	filename: "src/lib/lab/api.ts"
}, (opts) => listCases.__executeServer(opts));
var listCases = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCases_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureLab(sql, context.userId);
	return (await sql`
      select id, name, goal, domain_hint, status, plan_json, plan_hash,
             created_at::text as created_at, updated_at::text as updated_at
      from cases where user_id = ${context.userId}
      order by created_at desc
    `).map(mapCase);
});
var getCase_createServerFn_handler = createServerRpc({
	id: "371a5b040d73c083bce0b907ee337a53de3455eb0a2a5f5a00e9997759f1dcfe",
	name: "getCase",
	filename: "src/lib/lab/api.ts"
}, (opts) => getCase.__executeServer(opts));
var getCase = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getCase_createServerFn_handler, async ({ context, data: id }) => {
	const rows = await (await getSql())`
      select id, name, goal, domain_hint, status, plan_json, plan_hash,
             created_at::text as created_at, updated_at::text as updated_at
      from cases where id = ${id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Case not found.");
	return mapCase(rows[0]);
});
var createCase_createServerFn_handler = createServerRpc({
	id: "82736b389bfa30f58ee0155ff5c7914e66dd8067758fe3f99e647af7128189ee",
	name: "createCase",
	filename: "src/lib/lab/api.ts"
}, (opts) => createCase.__executeServer(opts));
var createCase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	name: input.name.trim(),
	goal: (input.goal ?? "").trim(),
	domainHint: (input.domainHint ?? "").trim() || null
})).handler(createCase_createServerFn_handler, async ({ context, data }) => {
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
var ingestCase_createServerFn_handler = createServerRpc({
	id: "e0f314cb2e51b45cf35089d6d4806f140366c0a926c6d1a2b9d73b35c20ce641",
	name: "ingestCase",
	filename: "src/lib/lab/api.ts"
}, (opts) => ingestCase.__executeServer(opts));
var ingestCase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(ingestCase_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	const rows = await sql`
      select status from cases where id = ${id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Case not found.");
	if (rows[0].status !== "created") throw new Error("Only created cases can be ingested.");
	await sql`
      update cases set status = ${"ingested"}, updated_at = now()
      where id = ${id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var writePlan_createServerFn_handler = createServerRpc({
	id: "02d966444ea7268c054faa3c40016d1d4c1c52ecdd643b9d8cad0859ed21068a",
	name: "writePlan",
	filename: "src/lib/lab/api.ts"
}, (opts) => writePlan.__executeServer(opts));
var writePlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	steps: input.steps.trim(),
	falsifiers: input.falsifiers.trim(),
	successChecks: input.successChecks.trim()
})).handler(writePlan_createServerFn_handler, async ({ context, data }) => {
	if (!data.steps || !data.falsifiers || !data.successChecks) throw new Error("A plan needs steps, falsifiers, and success checks.");
	const sql = await getSql();
	const rows = await sql`
      select status from cases where id = ${data.id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Case not found.");
	if (!["ingested", "plan_ready"].includes(rows[0].status)) throw new Error("Plans can only be written on ingested cases.");
	const plan = {
		steps: data.steps,
		falsifiers: data.falsifiers,
		success_checks: data.successChecks,
		anti_rescue_rules: ["Do not widen scope after seeing results.", "Do not drop failed checks."]
	};
	const planHash = hashCanonical(plan);
	await sql`
      update cases
      set status = ${"plan_ready"}, plan_json = ${JSON.stringify(plan)}, plan_hash = ${planHash}, updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return { planHash };
});
var approvePlan_createServerFn_handler = createServerRpc({
	id: "f600533e3d7e6aee0980f3283d03df65946bc0fd70d7963253b2a2d94e74b452",
	name: "approvePlan",
	filename: "src/lib/lab/api.ts"
}, (opts) => approvePlan.__executeServer(opts));
var approvePlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedPlanHash: input.expectedPlanHash.trim(),
	confirmation: input.confirmation.trim(),
	reviewer: input.reviewer.trim()
})).handler(approvePlan_createServerFn_handler, async ({ context, data }) => {
	if (data.confirmation !== PHRASES.approvePlan) throw new Error("Confirmation phrase does not match.");
	const sql = await getSql();
	const rows = await sql`
      select status, plan_hash from cases where id = ${data.id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Case not found.");
	if (rows[0].status !== "plan_ready") throw new Error("Only plan_ready cases can be approved.");
	if (!rows[0].plan_hash || rows[0].plan_hash !== data.expectedPlanHash) throw new Error("Plan hash mismatch. Approve only the exact frozen plan.");
	await sql`
      update cases set status = ${"approved"}, updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return {
		ok: true,
		reviewer: data.reviewer
	};
});
var completeCase_createServerFn_handler = createServerRpc({
	id: "85baa82556f8beca695738cde4f2cc792ec20fc2b37bffa18950a81fce1b2f95",
	name: "completeCase",
	filename: "src/lib/lab/api.ts"
}, (opts) => completeCase.__executeServer(opts));
var completeCase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(completeCase_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	const rows = await sql`
      select status from cases where id = ${id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Case not found.");
	if (rows[0].status !== "approved") throw new Error("Only approved cases can be completed.");
	await sql`
      update cases set status = ${"completed"}, updated_at = now()
      where id = ${id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var deleteCase_createServerFn_handler = createServerRpc({
	id: "36fb45ae704b0db1cade6454e96f280b06983976faa92a82f2b7b5f392ef63a2",
	name: "deleteCase",
	filename: "src/lib/lab/api.ts"
}, (opts) => deleteCase.__executeServer(opts));
var deleteCase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	confirmation: input.confirmation.trim()
})).handler(deleteCase_createServerFn_handler, async ({ context, data }) => {
	if (data.confirmation !== PHRASES.deleteCase) throw new Error("Confirmation phrase does not match.");
	await (await getSql())`
      delete from cases where id = ${data.id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var listOperators_createServerFn_handler = createServerRpc({
	id: "2d080aa63017418c2d9cea6f0c00ae6195ec22e35368a46bff240a8687ababd7",
	name: "listOperators",
	filename: "src/lib/lab/api.ts"
}, (opts) => listOperators.__executeServer(opts));
var listOperators = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listOperators_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureLab(sql, context.userId);
	return (await sql`
      select id, operator_key, name, description, status, contract_json, contract_hash, review_hash,
             source_case_id, created_at::text as created_at
      from operators where user_id = ${context.userId}
      order by created_at desc
    `).map(mapOperator);
});
var getOperator_createServerFn_handler = createServerRpc({
	id: "24cfddc75f49aa26d4be9d9d2f5b3f885c814400092b0fae270e454793d7cb95",
	name: "getOperator",
	filename: "src/lib/lab/api.ts"
}, (opts) => getOperator.__executeServer(opts));
var getOperator = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getOperator_createServerFn_handler, async ({ context, data: id }) => {
	const rows = await (await getSql())`
      select id, operator_key, name, description, status, contract_json, contract_hash, review_hash,
             source_case_id, created_at::text as created_at
      from operators where id = ${id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Operator not found.");
	return mapOperator(rows[0]);
});
var createOperator_createServerFn_handler = createServerRpc({
	id: "cf3938794ee3396a2717f59131f0172c051ff7057c62b7662f59c12c1e3b521d",
	name: "createOperator",
	filename: "src/lib/lab/api.ts"
}, (opts) => createOperator.__executeServer(opts));
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
})).handler(createOperator_createServerFn_handler, async ({ context, data }) => {
	if (!data.operatorKey || !data.name) throw new Error("Operator key and name are required.");
	const missing = Object.entries(data.contract).filter(([, v]) => !v).map(([k]) => k);
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
	return {
		id,
		contractHash,
		reviewHash
	};
});
var importStarterGenome_createServerFn_handler = createServerRpc({
	id: "95e95ef458854e5cd9442d39339f7f2300cb6ba2add1cd98141535b9582d971d",
	name: "importStarterGenome",
	filename: "src/lib/lab/api.ts"
}, (opts) => importStarterGenome.__executeServer(opts));
var importStarterGenome = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(importStarterGenome_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureLab(sql, context.userId);
	let imported = 0;
	for (const op of STARTER_OPERATORS) {
		if ((await sql`
        select id from operators where user_id = ${context.userId} and operator_key = ${op.operatorKey}
      `)[0]) continue;
		const id = mintId("op");
		const { contractHash, reviewHash } = operatorHashes({
			operatorKey: op.operatorKey,
			name: op.name,
			description: op.description,
			contract: op.contract
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
var freezeOperator_createServerFn_handler = createServerRpc({
	id: "a50fb3a5b43b72ef0d0a9a69c4ab0e7708b0573fb12a6f12b2dbc2157277ad30",
	name: "freezeOperator",
	filename: "src/lib/lab/api.ts"
}, (opts) => freezeOperator.__executeServer(opts));
var freezeOperator = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedReviewHash: input.expectedReviewHash.trim(),
	confirmation: input.confirmation.trim()
})).handler(freezeOperator_createServerFn_handler, async ({ context, data }) => {
	if (data.confirmation !== PHRASES.freezeOperator) throw new Error("Confirmation phrase does not match.");
	const sql = await getSql();
	const rows = await sql`
      select status, review_hash from operators where id = ${data.id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Operator not found.");
	if (rows[0].status !== "review_needed") throw new Error("Only review_needed operators can be frozen.");
	if (rows[0].review_hash !== data.expectedReviewHash) throw new Error("Review hash mismatch. Freeze only the exact reviewed contract.");
	await sql`
      update operators set status = ${"frozen"}
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var listEvidence_createServerFn_handler = createServerRpc({
	id: "328e38ca6a734e95ca5c3c05453edd611e11cfe2b025d1efe12b8203d7a5c1be",
	name: "listEvidence",
	filename: "src/lib/lab/api.ts"
}, (opts) => listEvidence.__executeServer(opts));
var listEvidence = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listEvidence_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureLab(sql, context.userId);
	return (await sql`
      select id, schema_id, source_kind, case_id, operator_id, experiment_id, domain, outcome,
             independence_level, body_json, receipt_hash, eligibility_json,
             created_at::text as created_at
      from evidence_receipts where user_id = ${context.userId}
      order by created_at desc
    `).map(mapEvidence);
});
var createEvidence_createServerFn_handler = createServerRpc({
	id: "823ddc13ab39b0d96c15a0961b8f82d3572e617d912adf208b09f065c0deaeb7",
	name: "createEvidence",
	filename: "src/lib/lab/api.ts"
}, (opts) => createEvidence.__executeServer(opts));
var createEvidence = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	sourceKind: input.sourceKind,
	domain: input.domain.trim(),
	outcome: input.outcome,
	independenceLevel: input.independenceLevel,
	body: input.body.trim(),
	caseId: input.caseId ?? null,
	operatorId: input.operatorId ?? null,
	experimentId: input.experimentId ?? null
})).handler(createEvidence_createServerFn_handler, async ({ context, data }) => {
	if (!data.domain || !data.body) throw new Error("Domain and body are required.");
	const sql = await getSql();
	await ensureLab(sql, context.userId);
	const eligibility = eligibilityFor(data.sourceKind);
	const id = mintId("evidence");
	const receiptHash = hashCanonical({
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
		eligibility
	});
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
	return {
		id,
		receiptHash,
		eligibility
	};
});
var verifyEvidence_createServerFn_handler = createServerRpc({
	id: "38a587876ffad343d1abf418ce9727878d5e61d183eb438c9e24307c1c47aa96",
	name: "verifyEvidence",
	filename: "src/lib/lab/api.ts"
}, (opts) => verifyEvidence.__executeServer(opts));
var verifyEvidence = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(verifyEvidence_createServerFn_handler, async ({ context, data: id }) => {
	const rows = await (await getSql())`
      select id, schema_id, source_kind, case_id, operator_id, experiment_id, domain, outcome,
             independence_level, body_json, receipt_hash, eligibility_json,
             created_at::text as created_at
      from evidence_receipts where id = ${id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Receipt not found.");
	const rec = mapEvidence(rows[0]);
	const eligibility = eligibilityFor(rec.sourceKind);
	const recomputed = hashCanonical({
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
		eligibility
	});
	return {
		id: rec.id,
		stored: rec.receiptHash,
		recomputed,
		matches: recomputed === rec.receiptHash,
		eligibility
	};
});
var listExperiments_createServerFn_handler = createServerRpc({
	id: "3763c8a6bb54e306539ed7f264325cdf2f1e177c25dce39872aec7399b6da384",
	name: "listExperiments",
	filename: "src/lib/lab/api.ts"
}, (opts) => listExperiments.__executeServer(opts));
var listExperiments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listExperiments_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureLab(sql, context.userId);
	return (await sql`
      select id, case_id, scientific_question, claim_scope_json, execution_spec_json,
             verdict_schema_json, independent_verifier_json, falsification_coverage_json,
             anti_rescue_rules_json, experiment_hash, manifest_json, manifest_hash, status,
             created_by, created_at::text as created_at
      from experiments where user_id = ${context.userId}
      order by created_at desc
    `).map(mapExperiment);
});
var createExperiment_createServerFn_handler = createServerRpc({
	id: "9083e15e38b64602e86f372178e27d584afed84b33884a4d0535058e8908e87d",
	name: "createExperiment",
	filename: "src/lib/lab/api.ts"
}, (opts) => createExperiment.__executeServer(opts));
var createExperiment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	caseId: input.caseId,
	scientificQuestion: input.scientificQuestion.trim(),
	claimScope: input.claimScope.trim(),
	executionSpec: input.executionSpec.trim(),
	verifier: input.verifier.trim(),
	coverage: input.coverage.trim(),
	antiRescue: input.antiRescue.trim(),
	createdBy: input.createdBy.trim() || "lab-owner"
})).handler(createExperiment_createServerFn_handler, async ({ context, data }) => {
	if (!data.scientificQuestion) throw new Error("Scientific question is required.");
	const sql = await getSql();
	await ensureLab(sql, context.userId);
	if (!(await sql`
      select id from cases where id = ${data.caseId} and user_id = ${context.userId}
    `)[0]) throw new Error("Case not found in this lab.");
	const frozen = {
		case_id: data.caseId,
		scientific_question: data.scientificQuestion,
		claim_scope: { text: data.claimScope },
		execution_spec: { text: data.executionSpec },
		verdict_schema: { allowed: [
			"supported",
			"refuted",
			"inconclusive",
			"artifact"
		] },
		independent_verifier: { text: data.verifier },
		falsification_coverage: { text: data.coverage },
		anti_rescue_rules: data.antiRescue.split("\n").map((s) => s.trim()).filter(Boolean)
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
	return {
		id,
		experimentHash
	};
});
var freezeExperiment_createServerFn_handler = createServerRpc({
	id: "6b150694997c0ddf096c20fd5182ea43b7dfcb7841eed036443de5223e1800bf",
	name: "freezeExperiment",
	filename: "src/lib/lab/api.ts"
}, (opts) => freezeExperiment.__executeServer(opts));
var freezeExperiment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedExperimentHash: input.expectedExperimentHash.trim()
})).handler(freezeExperiment_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const rows = await sql`
      select status, experiment_hash from experiments where id = ${data.id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Experiment not found.");
	if (rows[0].status !== "draft") throw new Error("Only draft experiments can be frozen.");
	if (rows[0].experiment_hash !== data.expectedExperimentHash) throw new Error("Experiment hash mismatch.");
	await sql`
      update experiments set status = ${"frozen"}
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var stageExperiment_createServerFn_handler = createServerRpc({
	id: "1924efa8ce614494af72125031d19297836fac67e4e0a4ca67453ec14bc0bc94",
	name: "stageExperiment",
	filename: "src/lib/lab/api.ts"
}, (opts) => stageExperiment.__executeServer(opts));
var stageExperiment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedExperimentHash: input.expectedExperimentHash.trim(),
	submittedBy: input.submittedBy.trim() || "lab-owner"
})).handler(stageExperiment_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const rows = await sql`
      select status, experiment_hash from experiments where id = ${data.id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Experiment not found.");
	if (rows[0].status !== "frozen") throw new Error("Only frozen experiments can be staged.");
	if (rows[0].experiment_hash !== data.expectedExperimentHash) throw new Error("Experiment hash mismatch.");
	const manifest = {
		experiment_id: data.id,
		experiment_hash: rows[0].experiment_hash,
		submitted_by: data.submittedBy,
		runtime_activation: false,
		execution: "blocked_pending_approval"
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
var approveExperiment_createServerFn_handler = createServerRpc({
	id: "48a6666c1b8f7c39ace8d303c80ec195d737708068e2a1ced5b1955aa1448ec3",
	name: "approveExperiment",
	filename: "src/lib/lab/api.ts"
}, (opts) => approveExperiment.__executeServer(opts));
var approveExperiment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedExperimentHash: input.expectedExperimentHash.trim(),
	expectedManifestHash: input.expectedManifestHash.trim(),
	reviewer: input.reviewer.trim(),
	rationale: input.rationale.trim(),
	confirmation: input.confirmation.trim()
})).handler(approveExperiment_createServerFn_handler, async ({ context, data }) => {
	if (data.confirmation !== PHRASES.approveExperiment) throw new Error("Confirmation phrase does not match.");
	if (!data.reviewer || !data.rationale) throw new Error("Reviewer and rationale are required.");
	const sql = await getSql();
	const rows = await sql`
      select status, experiment_hash, manifest_hash
      from experiments where id = ${data.id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Experiment not found.");
	if (rows[0].status !== "staged") throw new Error("Only staged experiments can be approved.");
	const accepted = rows[0].experiment_hash === data.expectedExperimentHash && rows[0].manifest_hash === data.expectedManifestHash;
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
	return {
		ok: true,
		approvalId
	};
});
var recordExperiment_createServerFn_handler = createServerRpc({
	id: "a65f3ad5a3ab3d98aa13847d1fc05b6c97f87cff882f8b17df0830e7741c81e9",
	name: "recordExperiment",
	filename: "src/lib/lab/api.ts"
}, (opts) => recordExperiment.__executeServer(opts));
var recordExperiment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	observation: input.observation.trim(),
	outcome: input.outcome
})).handler(recordExperiment_createServerFn_handler, async ({ context, data }) => {
	if (!data.observation) throw new Error("Observation receipt is required.");
	const sql = await getSql();
	await ensureLab(sql, context.userId);
	const rows = await sql`
      select status, case_id, scientific_question
      from experiments where id = ${data.id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Experiment not found.");
	if (rows[0].status !== "approved") throw new Error("Only approved experiments can record receipts.");
	const eligibility = eligibilityFor("EXTERNAL_EXPERIMENT");
	const evidenceId = mintId("evidence");
	const receiptHash = hashCanonical({
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
		eligibility
	});
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
	return {
		evidenceId,
		receiptHash
	};
});
var listLoops_createServerFn_handler = createServerRpc({
	id: "8951745397edd69ab47d0b4be7c627a4a3e81263c1ca37562dec688030ab323b",
	name: "listLoops",
	filename: "src/lib/lab/api.ts"
}, (opts) => listLoops.__executeServer(opts));
var listLoops = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listLoops_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureLab(sql, context.userId);
	return (await sql`
      select id, goal, success_criteria_json, allowed_capabilities_json, max_cycles, state, cycle,
             previous_event_hash, created_by, created_at::text as created_at
      from problem_loops where user_id = ${context.userId}
      order by created_at desc
    `).map((r) => ({
		...mapLoop(r),
		events: []
	}));
});
var getLoop_createServerFn_handler = createServerRpc({
	id: "f87d2b8ccc5df9275439f866cf430564e77f8c84820ee822150ff4283545701d",
	name: "getLoop",
	filename: "src/lib/lab/api.ts"
}, (opts) => getLoop.__executeServer(opts));
var getLoop = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getLoop_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	const rows = await sql`
      select id, goal, success_criteria_json, allowed_capabilities_json, max_cycles, state, cycle,
             previous_event_hash, created_by, created_at::text as created_at
      from problem_loops where id = ${id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Loop not found.");
	const events = await sql`
      select id, state, next_state, artifact_json, artifact_hash, event_hash, previous_event_hash,
             actor, created_at::text as created_at
      from problem_loop_events
      where loop_id = ${id} and user_id = ${context.userId}
      order by created_at asc
    `;
	return {
		...mapLoop(rows[0]),
		events: events.map(mapEvent)
	};
});
var createLoop_createServerFn_handler = createServerRpc({
	id: "35f94c20cf0ff8a04f3c41f1d16ce93cfe0de9a52edcbe90d44ebcce33c17b82",
	name: "createLoop",
	filename: "src/lib/lab/api.ts"
}, (opts) => createLoop.__executeServer(opts));
var createLoop = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	goal: input.goal.trim(),
	successCriteria: input.successCriteria.split("\n").map((s) => s.trim()).filter(Boolean),
	allowedCapabilities: input.allowedCapabilities.split("\n").map((s) => s.trim()).filter(Boolean),
	maxCycles: Math.max(1, Math.min(8, Number(input.maxCycles) || 3)),
	createdBy: input.createdBy.trim() || "lab-owner"
})).handler(createLoop_createServerFn_handler, async ({ context, data }) => {
	if (!data.goal || data.successCriteria.length === 0) throw new Error("Goal and at least one success criterion are required.");
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
var advanceLoop_createServerFn_handler = createServerRpc({
	id: "eaab270e1ecae7de151754dd615f94076fc5aca8d43526f0cbe36158a42facf1",
	name: "advanceLoop",
	filename: "src/lib/lab/api.ts"
}, (opts) => advanceLoop.__executeServer(opts));
var advanceLoop = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedState: input.expectedState,
	expectedPreviousEventHash: input.expectedPreviousEventHash.trim(),
	artifact: input.artifact,
	actor: input.actor.trim() || "lab-owner"
})).handler(advanceLoop_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const rows = await sql`
      select state, cycle, max_cycles, previous_event_hash
      from problem_loops where id = ${data.id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Loop not found.");
	if (rows[0].state !== data.expectedState) throw new Error(`Expected state ${data.expectedState}, loop is in ${rows[0].state}.`);
	if (rows[0].previous_event_hash !== data.expectedPreviousEventHash) throw new Error("Event-chain hash mismatch. Reload the loop and retry.");
	const state = rows[0].state;
	assertStageArtifact(state, data.artifact);
	const next = nextLoopState(state, data.artifact, rows[0].cycle, rows[0].max_cycles);
	const artifactHash = hashCanonical(data.artifact);
	const eventHash = hashCanonical({
		loop_id: data.id,
		state,
		next_state: next,
		artifact_hash: artifactHash,
		previous_event_hash: rows[0].previous_event_hash,
		actor: data.actor
	});
	await sql`
      insert into problem_loop_events (
        id, user_id, loop_id, state, next_state, artifact_json, artifact_hash,
        event_hash, previous_event_hash, actor
      ) values (
        ${mintId("evt")}, ${context.userId}, ${data.id}, ${state}, ${next},
        ${JSON.stringify(data.artifact)}, ${artifactHash}, ${eventHash},
        ${rows[0].previous_event_hash}, ${data.actor}
      )
    `;
	await sql`
      update problem_loops
      set state = ${next}, cycle = ${state === "RETRY" ? rows[0].cycle + 1 : rows[0].cycle}, previous_event_hash = ${eventHash}
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return {
		nextState: next,
		eventHash
	};
});
var verifyLoop_createServerFn_handler = createServerRpc({
	id: "6eee07b635e9880eb4d52acf0788b248c1efdd4818247785515784344caee708",
	name: "verifyLoop",
	filename: "src/lib/lab/api.ts"
}, (opts) => verifyLoop.__executeServer(opts));
var verifyLoop = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(verifyLoop_createServerFn_handler, async ({ context, data: id }) => {
	const events = await (await getSql())`
      select event_hash, previous_event_hash, state, next_state, artifact_json, actor
      from problem_loop_events
      where loop_id = ${id} and user_id = ${context.userId}
      order by created_at asc
    `;
	let prev = "genesis";
	const issues = [];
	for (const ev of events) {
		if (ev.previous_event_hash !== prev) issues.push(`Broken chain at ${ev.state}: expected previous ${prev}.`);
		const artifactHash = hashCanonical(parseJson(ev.artifact_json, {}));
		if (hashCanonical({
			loop_id: id,
			state: ev.state,
			next_state: ev.next_state,
			artifact_hash: artifactHash,
			previous_event_hash: ev.previous_event_hash,
			actor: ev.actor
		}) !== ev.event_hash) issues.push(`Hash mismatch at ${ev.state}.`);
		prev = ev.event_hash;
	}
	return {
		events: events.length,
		intact: issues.length === 0,
		issues
	};
});
var listClaims_createServerFn_handler = createServerRpc({
	id: "3a38c7e808afe9096fac2f35cfd2902088fa2ff6e2fd3eef30c11c4f42d15b28",
	name: "listClaims",
	filename: "src/lib/lab/api.ts"
}, (opts) => listClaims.__executeServer(opts));
var listClaims = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listClaims_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureLab(sql, context.userId);
	const rows = await sql`
      select id, case_id, claim_key, statement, epistemic_status, scope_json, superseded_by,
             created_at::text as created_at
      from claims where user_id = ${context.userId}
      order by created_at desc
    `;
	const cons = await sql`
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
			createdAt: c.created_at
		}))
	};
});
var createClaim_createServerFn_handler = createServerRpc({
	id: "665ca66a04ee16282e3994e353034138df28054b7e9adfcf6e71463c021ff71e",
	name: "createClaim",
	filename: "src/lib/lab/api.ts"
}, (opts) => createClaim.__executeServer(opts));
var createClaim = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	claimKey: input.claimKey.trim().toUpperCase().replace(/\s+/g, "-"),
	statement: input.statement.trim(),
	epistemicStatus: input.epistemicStatus,
	scope: input.scope.trim(),
	caseId: input.caseId ?? null
})).handler(createClaim_createServerFn_handler, async ({ context, data }) => {
	if (!data.claimKey || !data.statement || !data.scope) throw new Error("Key, statement, and scope are required.");
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
var supersedeClaim_createServerFn_handler = createServerRpc({
	id: "25a25e9a0f4832ed8e011ed111849a616acaa29f16489026d50f26b49903490a",
	name: "supersedeClaim",
	filename: "src/lib/lab/api.ts"
}, (opts) => supersedeClaim.__executeServer(opts));
var supersedeClaim = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	newStatement: input.newStatement.trim(),
	rationale: input.rationale.trim()
})).handler(supersedeClaim_createServerFn_handler, async ({ context, data }) => {
	if (!data.newStatement || !data.rationale) throw new Error("Statement and rationale are required.");
	const sql = await getSql();
	const rows = await sql`
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
var addContradiction_createServerFn_handler = createServerRpc({
	id: "2268a4f6257b847c68d5a4b8e86e8843bee0434c69b8db41d2edbc0ef57fd265",
	name: "addContradiction",
	filename: "src/lib/lab/api.ts"
}, (opts) => addContradiction.__executeServer(opts));
var addContradiction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	claimA: input.claimA,
	claimB: input.claimB,
	rationale: input.rationale.trim()
})).handler(addContradiction_createServerFn_handler, async ({ context, data }) => {
	if (data.claimA === data.claimB) throw new Error("A contradiction needs two distinct claims.");
	if (!data.rationale) throw new Error("Rationale is required.");
	const sql = await getSql();
	if ((await sql`
      select id from claims
      where user_id = ${context.userId} and id in (${data.claimA}, ${data.claimB})
    `).length < 2) throw new Error("Both claims must belong to this lab.");
	const id = mintId("contra");
	await sql`
      insert into contradictions (id, user_id, claim_a, claim_b, rationale)
      values (${id}, ${context.userId}, ${data.claimA}, ${data.claimB}, ${data.rationale})
    `;
	return { id };
});
var listTournaments_createServerFn_handler = createServerRpc({
	id: "1c2cdaa4a7f80770ab04bf4325a4525cc246c2dd58b5491baa7f936ede6012c9",
	name: "listTournaments",
	filename: "src/lib/lab/api.ts"
}, (opts) => listTournaments.__executeServer(opts));
var listTournaments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTournaments_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureLab(sql, context.userId);
	return (await sql`
      select id, name, target_json, status, manifest_hash, anti_rescue,
             created_at::text as created_at
      from tournaments where user_id = ${context.userId}
      order by created_at desc
    `).map(mapTournament);
});
var createTournament_createServerFn_handler = createServerRpc({
	id: "51ea9907705055f9a2deecb1b9eb503b499c459b26bf1d35223b5a495fb85f58",
	name: "createTournament",
	filename: "src/lib/lab/api.ts"
}, (opts) => createTournament.__executeServer(opts));
var createTournament = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	name: input.name.trim(),
	target: input.target.trim()
})).handler(createTournament_createServerFn_handler, async ({ context, data }) => {
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
		status: "draft"
	});
	await sql`
      insert into tournaments (id, user_id, name, target_json, status, manifest_hash, anti_rescue)
      values (${id}, ${context.userId}, ${data.name}, ${JSON.stringify(target)}, ${"draft"}, ${manifestHash}, ${true})
    `;
	return {
		id,
		manifestHash
	};
});
var freezeTournament_createServerFn_handler = createServerRpc({
	id: "98e14025b7f62533000b123be84163e19b4eb34ddc818333ef5fd912ac0e85a1",
	name: "freezeTournament",
	filename: "src/lib/lab/api.ts"
}, (opts) => freezeTournament.__executeServer(opts));
var freezeTournament = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: input.id,
	expectedReviewHash: input.expectedReviewHash.trim(),
	confirmation: input.confirmation.trim()
})).handler(freezeTournament_createServerFn_handler, async ({ context, data }) => {
	if (data.confirmation !== PHRASES.freezeTournament) throw new Error("Confirmation phrase does not match.");
	const sql = await getSql();
	const rows = await sql`
      select status, manifest_hash from tournaments where id = ${data.id} and user_id = ${context.userId}
    `;
	if (!rows[0]) throw new Error("Tournament not found.");
	if (rows[0].status !== "draft") throw new Error("Only draft tournaments can be frozen.");
	if (rows[0].manifest_hash !== data.expectedReviewHash) throw new Error("Manifest hash mismatch.");
	await sql`
      update tournaments set status = ${"frozen"}
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
//#endregion
export { addContradiction_createServerFn_handler, advanceLoop_createServerFn_handler, approveExperiment_createServerFn_handler, approvePlan_createServerFn_handler, completeCase_createServerFn_handler, createCase_createServerFn_handler, createClaim_createServerFn_handler, createEvidence_createServerFn_handler, createExperiment_createServerFn_handler, createLoop_createServerFn_handler, createOperator_createServerFn_handler, createTournament_createServerFn_handler, deleteCase_createServerFn_handler, freezeExperiment_createServerFn_handler, freezeOperator_createServerFn_handler, freezeTournament_createServerFn_handler, getCase_createServerFn_handler, getLoop_createServerFn_handler, getOperator_createServerFn_handler, getOverview_createServerFn_handler, importStarterGenome_createServerFn_handler, ingestCase_createServerFn_handler, listCases_createServerFn_handler, listClaims_createServerFn_handler, listEvidence_createServerFn_handler, listExperiments_createServerFn_handler, listLoops_createServerFn_handler, listOperators_createServerFn_handler, listTournaments_createServerFn_handler, recordExperiment_createServerFn_handler, stageExperiment_createServerFn_handler, supersedeClaim_createServerFn_handler, updateLab_createServerFn_handler, verifyEvidence_createServerFn_handler, verifyLoop_createServerFn_handler, writePlan_createServerFn_handler };
