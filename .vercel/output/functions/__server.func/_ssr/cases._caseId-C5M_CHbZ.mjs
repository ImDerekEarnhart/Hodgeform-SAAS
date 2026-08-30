import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PHRASES } from "./phrases-hctJGTVI.mjs";
import { t as Button } from "./button-DHYwryGW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Route$2 } from "./router-B8EonqWx.mjs";
import { C as deleteCase, J as writePlan, N as ingestCase, O as getCase, h as completeCase, i as EmptyState, l as PageHeader, m as approvePlan, n as CaseBadge, o as HashChip, w as errMessage } from "./api-a-eLEwaD.mjs";
import { t as Input } from "./input-Bz15FOWP.mjs";
import { t as Label } from "./label-C5kNbI7R.mjs";
import { t as Textarea } from "./textarea-Br5Xyvxj.mjs";
import { t as useCurrentUser } from "./use-current-user-DG6UNzh9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases._caseId-C5M_CHbZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CaseDetail() {
	const { caseId } = Route$2.useParams();
	const nav = useNavigate();
	const user = useCurrentUser();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["case", caseId],
		queryFn: () => getCase({ data: caseId })
	});
	const [steps, setSteps] = (0, import_react.useState)("");
	const [falsifiers, setFalsifiers] = (0, import_react.useState)("");
	const [checks, setChecks] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [hashInput, setHashInput] = (0, import_react.useState)("");
	const [deletePhrase, setDeletePhrase] = (0, import_react.useState)("");
	const invalidate = () => {
		qc.invalidateQueries({ queryKey: ["case", caseId] });
		qc.invalidateQueries({ queryKey: ["cases"] });
		qc.invalidateQueries({ queryKey: ["overview"] });
	};
	const ingest = useMutation({
		mutationFn: () => ingestCase({ data: caseId }),
		onSuccess: () => {
			toast.success("Case ingested.");
			invalidate();
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const plan = useMutation({
		mutationFn: () => writePlan({ data: {
			id: caseId,
			steps,
			falsifiers,
			successChecks: checks
		} }),
		onSuccess: (r) => {
			toast.success("Plan frozen.");
			setHashInput(r.planHash);
			invalidate();
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const approve = useMutation({
		mutationFn: () => approvePlan({ data: {
			id: caseId,
			expectedPlanHash: hashInput,
			confirmation: confirm,
			reviewer: user?.displayName ?? user?.primaryEmail ?? "lab-owner"
		} }),
		onSuccess: () => {
			toast.success("Plan approved.");
			invalidate();
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const complete = useMutation({
		mutationFn: () => completeCase({ data: caseId }),
		onSuccess: () => {
			toast.success("Case completed.");
			invalidate();
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const remove = useMutation({
		mutationFn: () => deleteCase({ data: {
			id: caseId,
			confirmation: deletePhrase
		} }),
		onSuccess: () => {
			toast.success("Case deleted. Derived claims remain.");
			nav({ to: "/lab/cases" });
		},
		onError: (e) => toast.error(errMessage(e))
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-xl bg-secondary" });
	if (q.isError || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Case not found",
		body: errMessage(q.error)
	});
	const c = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/lab/cases",
					className: "text-muted-foreground hover:text-paper",
					children: "Cases"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-2 text-muted-foreground",
					children: "/"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs text-steel",
					children: c.id
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: c.domainHint ?? "case",
			title: c.name,
			description: c.goal || "Bounded open discovery — no goal registered.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseBadge, { status: c.status })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl text-paper",
							children: "Lifecycle"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-4 space-y-2 font-mono text-xs text-muted-foreground",
							children: [
								"created",
								"ingested",
								"plan_ready",
								"approved",
								"completed"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: s === c.status ? "text-paper" : "",
								children: [s === c.status ? "→ " : "  ", s]
							}, s))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-2",
							children: [c.status === "created" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => ingest.mutate(),
								disabled: ingest.isPending,
								children: "Ingest"
							}) : null, c.status === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => complete.mutate(),
								disabled: complete.isPending,
								children: "Complete"
							}) : null]
						})
					]
				}),
				c.status === "ingested" || c.status === "plan_ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-paper",
						children: "Freeze a plan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 space-y-3",
						onSubmit: (e) => {
							e.preventDefault();
							plan.mutate();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "steps",
									children: "Steps"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "steps",
									value: steps,
									onChange: (e) => setSteps(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "falsifiers",
									children: "Falsifiers"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "falsifiers",
									value: falsifiers,
									onChange: (e) => setFalsifiers(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "checks",
									children: "Success checks"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "checks",
									value: checks,
									onChange: (e) => setChecks(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: plan.isPending,
								children: plan.isPending ? "Hashing…" : "Write plan"
							})
						]
					})]
				}) : null,
				c.planHash ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl text-paper",
							children: "Hash-bound approval"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Approve only the exact frozen plan. Phrase:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-xs text-steel",
							children: PHRASES.approvePlan
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
								children: "Plan hash"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, {
								value: c.planHash,
								className: "mt-1"
							})]
						}),
						c.status === "plan_ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-4 space-y-3",
							onSubmit: (e) => {
								e.preventDefault();
								approve.mutate();
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "ph",
										children: "Expected plan hash"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "ph",
										className: "font-mono text-xs",
										value: hashInput || c.planHash,
										onChange: (e) => setHashInput(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pc",
										children: "Confirmation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pc",
										value: confirm,
										onChange: (e) => setConfirm(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: approve.isPending,
									children: "Approve plan"
								})
							]
						}) : null
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)] lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl text-paper",
							children: "Delete"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: [
								"Irreversible for the case. Type ",
								PHRASES.deleteCase,
								". Derived claims remain in the ledger."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-4 flex flex-col gap-2 sm:flex-row",
							onSubmit: (e) => {
								e.preventDefault();
								remove.mutate();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: deletePhrase,
								onChange: (e) => setDeletePhrase(e.target.value),
								placeholder: PHRASES.deleteCase
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "destructive",
								disabled: remove.isPending,
								children: "Delete"
							})]
						})
					]
				})
			]
		})
	] });
}
//#endregion
export { CaseDetail as component };
