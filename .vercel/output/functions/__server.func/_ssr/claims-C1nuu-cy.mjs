import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-DHYwryGW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { F as listCases, I as listClaims, P as jsonStringField, W as supersedeClaim, _ as createClaim, d as addContradiction, i as EmptyState, l as PageHeader, r as ClaimBadge, w as errMessage } from "./api-a-eLEwaD.mjs";
import { t as Input } from "./input-Bz15FOWP.mjs";
import { t as Label } from "./label-C5kNbI7R.mjs";
import { t as Textarea } from "./textarea-Br5Xyvxj.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DV8FlHQB.mjs";
import { t as EPISTEMIC_STATUSES } from "./types-CDZWq-RW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/claims-C1nuu-cy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClaimsPage() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["claims"],
		queryFn: () => listClaims()
	});
	const cases = useQuery({
		queryKey: ["cases"],
		queryFn: () => listCases()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [contraOpen, setContraOpen] = (0, import_react.useState)(false);
	const [key, setKey] = (0, import_react.useState)("");
	const [statement, setStatement] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("HYPOTHESIS");
	const [scope, setScope] = (0, import_react.useState)("this case only");
	const [caseId, setCaseId] = (0, import_react.useState)("");
	const [superId, setSuperId] = (0, import_react.useState)(null);
	const [newStatement, setNewStatement] = (0, import_react.useState)("");
	const [rationale, setRationale] = (0, import_react.useState)("");
	const [claimA, setClaimA] = (0, import_react.useState)("");
	const [claimB, setClaimB] = (0, import_react.useState)("");
	const [contraRationale, setContraRationale] = (0, import_react.useState)("");
	const create = useMutation({
		mutationFn: () => createClaim({ data: {
			claimKey: key,
			statement,
			epistemicStatus: status,
			scope,
			caseId: caseId || null
		} }),
		onSuccess: () => {
			toast.success("Claim recorded.");
			setOpen(false);
			setKey("");
			setStatement("");
			qc.invalidateQueries({ queryKey: ["claims"] });
			qc.invalidateQueries({ queryKey: ["overview"] });
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const supersede = useMutation({
		mutationFn: () => supersedeClaim({ data: {
			id: superId,
			newStatement,
			rationale
		} }),
		onSuccess: () => {
			toast.success("Prior claim retained as SUPERSEDED.");
			setSuperId(null);
			qc.invalidateQueries({ queryKey: ["claims"] });
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const contra = useMutation({
		mutationFn: () => addContradiction({ data: {
			claimA,
			claimB,
			rationale: contraRationale
		} }),
		onSuccess: () => {
			toast.success("Contradiction recorded. Neither claim was erased.");
			setContraOpen(false);
			qc.invalidateQueries({ queryKey: ["claims"] });
		},
		onError: (e) => toast.error(errMessage(e))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Epistemic ledger",
			title: "Claims",
			description: "Status is explicit. Contradictions are recorded, not resolved by deletion. Supersession keeps history.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => setContraOpen(true),
				children: "Record contradiction"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "New claim"
			})] })
		}),
		q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-secondary" }) : q.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Could not load claims",
			body: errMessage(q.error)
		}) : q.data.claims.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No claims",
			body: "A claim is a scoped statement with an epistemic status. Bounded evidence cannot become universal.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "New claim"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: q.data.claims.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] text-steel",
							children: c.claimKey
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClaimBadge, { status: c.epistemicStatus })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-paper",
						children: c.statement
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: ["scope: ", jsonStringField(c.scope, "text") ?? JSON.stringify(c.scope)]
					}),
					c.epistemicStatus !== "SUPERSEDED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						className: "mt-3",
						onClick: () => {
							setSuperId(c.id);
							setNewStatement("");
							setRationale("");
						},
						children: "Supersede"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-[11px] text-muted-foreground",
						children: ["superseded by ", c.supersededBy]
					})
				]
			}, c.id))
		}), q.data.contradictions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-paper",
				children: "Contradictions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-3",
				children: q.data.contradictions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-card p-4 text-sm shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-[11px] text-steel",
						children: [
							c.claimA,
							" ⊥ ",
							c.claimB
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-muted-foreground",
						children: c.rationale
					})]
				}, c.id))
			})]
		}) : null] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Record a claim" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Scope is mandatory. Status is not inferred." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					create.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ck",
								children: "Key"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ck",
								className: "font-mono text-xs",
								value: key,
								onChange: (e) => setKey(e.target.value),
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "st",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "st",
								className: "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm",
								value: status,
								onChange: (e) => setStatus(e.target.value),
								children: EPISTEMIC_STATUSES.filter((s) => s !== "SUPERSEDED").map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "cs",
							children: "Case (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "cs",
							className: "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm",
							value: caseId,
							onChange: (e) => setCaseId(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Unlinked"
							}), cases.data?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "stm",
							children: "Statement"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "stm",
							value: statement,
							onChange: (e) => setStatement(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "sc",
							children: "Scope"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "sc",
							value: scope,
							onChange: (e) => setScope(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: create.isPending,
						children: "Record"
					}) })
				]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: Boolean(superId),
			onOpenChange: (v) => !v && setSuperId(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Supersede claim" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "The prior claim is retained with status SUPERSEDED." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					supersede.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "ns",
							children: "New statement"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "ns",
							value: newStatement,
							onChange: (e) => setNewStatement(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "ra",
							children: "Rationale"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "ra",
							value: rationale,
							onChange: (e) => setRationale(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: supersede.isPending,
						children: "Supersede"
					}) })
				]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: contraOpen,
			onOpenChange: setContraOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Record a contradiction" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Neither claim is erased." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					contra.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "ca",
							children: "Claim A"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "ca",
							className: "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm",
							value: claimA,
							onChange: (e) => setClaimA(e.target.value),
							required: true,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select"
							}), q.data?.claims.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.claimKey
							}, c.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "cb",
							children: "Claim B"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "cb",
							className: "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm",
							value: claimB,
							onChange: (e) => setClaimB(e.target.value),
							required: true,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select"
							}), q.data?.claims.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.claimKey
							}, c.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "cr",
							children: "Rationale"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "cr",
							value: contraRationale,
							onChange: (e) => setContraRationale(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: contra.isPending,
						children: "Record"
					}) })
				]
			})] })
		})
	] });
}
//#endregion
export { ClaimsPage as component };
