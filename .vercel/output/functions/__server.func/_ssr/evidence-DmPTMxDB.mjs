import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ELIGIBILITY_POLICY } from "./eligibility-BMP3NZKx.mjs";
import { t as Button } from "./button-DHYwryGW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { K as verifyEvidence, L as listEvidence, P as jsonStringField, i as EmptyState, l as PageHeader, o as HashChip, t as Badge, v as createEvidence, w as errMessage } from "./api-a-eLEwaD.mjs";
import { t as Input } from "./input-Bz15FOWP.mjs";
import { t as Label } from "./label-C5kNbI7R.mjs";
import { t as Textarea } from "./textarea-Br5Xyvxj.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DV8FlHQB.mjs";
import { i as SOURCE_KINDS, n as EVIDENCE_OUTCOMES, r as INDEPENDENCE_LEVELS } from "./types-CDZWq-RW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/evidence-DmPTMxDB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EvidencePage() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["evidence"],
		queryFn: () => listEvidence()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [sourceKind, setSourceKind] = (0, import_react.useState)("DISCOVERY_RUN");
	const [domain, setDomain] = (0, import_react.useState)("");
	const [outcome, setOutcome] = (0, import_react.useState)("inconclusive");
	const [independence, setIndependence] = (0, import_react.useState)("same_case");
	const [body, setBody] = (0, import_react.useState)("");
	const [verifyId, setVerifyId] = (0, import_react.useState)(null);
	const create = useMutation({
		mutationFn: () => createEvidence({ data: {
			sourceKind,
			domain,
			outcome,
			independenceLevel: independence,
			body
		} }),
		onSuccess: (r) => {
			toast.success("Receipt appended.");
			setOpen(false);
			setBody("");
			setDomain("");
			qc.invalidateQueries({ queryKey: ["evidence"] });
			qc.invalidateQueries({ queryKey: ["overview"] });
			setVerifyId(r.id);
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const verify = useMutation({
		mutationFn: (id) => verifyEvidence({ data: id }),
		onSuccess: (r) => {
			toast.success(r.matches ? "Receipt hash verified." : "Hash mismatch.");
		},
		onError: (e) => toast.error(errMessage(e))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Ledger",
			title: "Evidence",
			description: "Append-only receipts. Eligible only for the decision kinds their source adapter allows. No activation authority.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "Record receipt"
			})
		}),
		q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-secondary" }) : q.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Could not load ledger",
			body: errMessage(q.error)
		}) : q.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Empty ledger",
			body: "Normalize an observation into an immutable receipt. Discovery-run evidence cannot authorize architecture or code review.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "Record receipt"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: q.data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] text-steel",
							children: r.sourceKind
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: r.outcome === "artifact" || r.outcome === "refuted" ? "danger" : "steel",
							children: r.outcome
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-paper",
						children: r.domain
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: jsonStringField(r.body, "note") ?? JSON.stringify(r.body)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, { value: r.receiptHash }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: ["allowed: ", r.eligibility.allowed.join(", ") || "none"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => verify.mutate(r.id),
								children: "Verify"
							})
						]
					}),
					verifyId === r.id && verify.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-[11px] text-steel",
						children: verify.data.matches ? "recomputed hash matches" : "recomputed hash diverges"
					}) : null
				]
			}, r.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-h-[90dvh] overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Normalize a receipt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Allowed for ",
					sourceKind,
					": ",
					ELIGIBILITY_POLICY[sourceKind].join(", "),
					"."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						create.mutate();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "sk",
								children: "Source kind"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "sk",
								className: "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm",
								value: sourceKind,
								onChange: (e) => setSourceKind(e.target.value),
								children: SOURCE_KINDS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "dom",
								children: "Domain"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "dom",
								value: domain,
								onChange: (e) => setDomain(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "out",
									children: "Outcome"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: "out",
									className: "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm",
									value: outcome,
									onChange: (e) => setOutcome(e.target.value),
									children: EVIDENCE_OUTCOMES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ind",
									children: "Independence"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: "ind",
									className: "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm",
									value: independence,
									onChange: (e) => setIndependence(e.target.value),
									children: INDEPENDENCE_LEVELS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "body",
								children: "Body"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "body",
								value: body,
								onChange: (e) => setBody(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: create.isPending,
							children: "Append receipt"
						}) })
					]
				})]
			})
		})
	] });
}
//#endregion
export { EvidencePage as component };
