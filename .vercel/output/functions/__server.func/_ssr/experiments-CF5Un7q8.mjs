import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as PHRASES } from "./phrases-hctJGTVI.mjs";
import { t as Button } from "./button-DHYwryGW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { F as listCases, H as recordExperiment, R as listExperiments, T as freezeExperiment, U as stageExperiment, a as ExperimentBadge, i as EmptyState, l as PageHeader, o as HashChip, p as approveExperiment, w as errMessage, y as createExperiment } from "./api-a-eLEwaD.mjs";
import { t as Input } from "./input-Bz15FOWP.mjs";
import { t as Label } from "./label-C5kNbI7R.mjs";
import { t as Textarea } from "./textarea-Br5Xyvxj.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DV8FlHQB.mjs";
import { t as useCurrentUser } from "./use-current-user-DG6UNzh9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/experiments-CF5Un7q8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExperimentsPage() {
	const user = useCurrentUser();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["experiments"],
		queryFn: () => listExperiments()
	});
	const cases = useQuery({
		queryKey: ["cases"],
		queryFn: () => listCases()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		caseId: "",
		scientificQuestion: "",
		claimScope: "",
		executionSpec: "",
		verifier: "",
		coverage: "",
		antiRescue: "Do not widen scope after seeing results.\nDo not drop failed checks."
	});
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [expHash, setExpHash] = (0, import_react.useState)("");
	const [manHash, setManHash] = (0, import_react.useState)("");
	const [rationale, setRationale] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [observation, setObservation] = (0, import_react.useState)("");
	const [outcome, setOutcome] = (0, import_react.useState)("inconclusive");
	const actor = user?.displayName ?? user?.primaryEmail ?? "lab-owner";
	const invalidate = () => {
		qc.invalidateQueries({ queryKey: ["experiments"] });
		qc.invalidateQueries({ queryKey: ["overview"] });
		qc.invalidateQueries({ queryKey: ["evidence"] });
	};
	const create = useMutation({
		mutationFn: () => createExperiment({ data: {
			...form,
			createdBy: actor
		} }),
		onSuccess: () => {
			toast.success("Draft experiment created.");
			setOpen(false);
			invalidate();
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const freeze = useMutation({
		mutationFn: (id) => freezeExperiment({ data: {
			id,
			expectedExperimentHash: expHash
		} }),
		onSuccess: () => {
			toast.success("Experiment frozen.");
			invalidate();
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const stage = useMutation({
		mutationFn: (id) => stageExperiment({ data: {
			id,
			expectedExperimentHash: expHash,
			submittedBy: actor
		} }),
		onSuccess: (r) => {
			toast.success("Staged. Execution remains blocked.");
			setManHash(r.manifestHash);
			invalidate();
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const approve = useMutation({
		mutationFn: (id) => approveExperiment({ data: {
			id,
			expectedExperimentHash: expHash,
			expectedManifestHash: manHash,
			reviewer: actor,
			rationale,
			confirmation: confirm
		} }),
		onSuccess: () => {
			toast.success("Approved.");
			invalidate();
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const record = useMutation({
		mutationFn: (id) => recordExperiment({ data: {
			id,
			observation,
			outcome
		} }),
		onSuccess: () => {
			toast.success("Receipt recorded. No runtime was activated.");
			setObservation("");
			invalidate();
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const current = q.data?.find((e) => e.id === selected) ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Governed execution",
			title: "Experiments",
			description: "Freeze, stage, approve against both hashes. Recording writes a receipt. The lab does not run code.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "New experiment"
			})
		}),
		q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-secondary" }) : q.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Could not load experiments",
			body: errMessage(q.error)
		}) : q.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No experiments",
			body: "Bind an experiment to a case, freeze the spec, stage a manifest, then approve both hashes.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "New experiment"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1fr_1.1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: q.data.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setSelected(ex.id);
						setExpHash(ex.experimentHash);
						setManHash(ex.manifestHash ?? "");
					},
					className: "w-full rounded-xl bg-card p-5 text-left shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg text-paper",
							children: ex.scientificQuestion
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExperimentBadge, { status: ex.status })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-[11px] text-steel",
						children: ex.id
					})]
				}) }, ex.id))
			}), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-paper",
						children: "Review"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: current.scientificQuestion
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
							children: "Experiment hash"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, {
							value: current.experimentHash,
							className: "mt-1"
						})] }), current.manifestHash ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
							children: "Manifest hash"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, {
							value: current.manifestHash,
							className: "mt-1"
						})] }) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-3",
						children: [
							current.status === "draft" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => freeze.mutate(current.id),
								disabled: freeze.isPending,
								children: "Freeze"
							}) : null,
							current.status === "frozen" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => stage.mutate(current.id),
								disabled: stage.isPending,
								children: "Stage manifest"
							}) : null,
							current.status === "staged" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "space-y-3",
								onSubmit: (e) => {
									e.preventDefault();
									approve.mutate(current.id);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-xs text-steel",
										children: PHRASES.approveExperiment
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "eh",
											children: "Expected experiment hash"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "eh",
											className: "font-mono text-xs",
											value: expHash,
											onChange: (e) => setExpHash(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "mh",
											children: "Expected manifest hash"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "mh",
											className: "font-mono text-xs",
											value: manHash,
											onChange: (e) => setManHash(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "rat",
											children: "Rationale"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "rat",
											value: rationale,
											onChange: (e) => setRationale(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "cf",
											children: "Confirmation"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "cf",
											value: confirm,
											onChange: (e) => setConfirm(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										disabled: approve.isPending,
										children: "Approve"
									})
								]
							}) : null,
							current.status === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "space-y-3",
								onSubmit: (e) => {
									e.preventDefault();
									record.mutate(current.id);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Record an observation receipt. Runtime stays off."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: observation,
										onChange: (e) => setObservation(e.target.value),
										placeholder: "Observation"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm",
										value: outcome,
										onChange: (e) => setOutcome(e.target.value),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "supported",
												children: "supported"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "refuted",
												children: "refuted"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "inconclusive",
												children: "inconclusive"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "artifact",
												children: "artifact"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										disabled: record.isPending,
										children: "Record receipt"
									})
								]
							}) : null
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Select an experiment to review."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-h-[90dvh] overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Freeze an experiment spec" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Bind it to a case. Execution stays blocked until hash-bound approval." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						create.mutate();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "cid",
								children: "Case"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "cid",
								required: true,
								className: "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm",
								value: form.caseId,
								onChange: (e) => setForm({
									...form,
									caseId: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select a case"
								}), cases.data?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							})]
						}),
						[
							["scientificQuestion", "Scientific question"],
							["claimScope", "Claim scope"],
							["executionSpec", "Execution spec"],
							["verifier", "Independent verifier"],
							["coverage", "Falsification coverage"],
							["antiRescue", "Anti-rescue rules (one per line)"]
						].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: k,
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: k,
								required: true,
								value: form[k],
								onChange: (e) => setForm({
									...form,
									[k]: e.target.value
								})
							})]
						}, k)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: create.isPending || !form.caseId,
							children: "Create draft"
						}) })
					]
				})]
			})
		})
	] });
}
//#endregion
export { ExperimentsPage as component };
