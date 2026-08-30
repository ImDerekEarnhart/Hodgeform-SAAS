import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DHYwryGW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { F as listCases, g as createCase, i as EmptyState, l as PageHeader, n as CaseBadge, w as errMessage } from "./api-a-eLEwaD.mjs";
import { t as Input } from "./input-Bz15FOWP.mjs";
import { t as Label } from "./label-C5kNbI7R.mjs";
import { t as Textarea } from "./textarea-Br5Xyvxj.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DV8FlHQB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases-_hWIPEft.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CasesLayout() {
	if (useRouterState({ select: (s) => s.location.pathname }) !== "/lab/cases") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CasesPage, {});
}
function CasesPage() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["cases"],
		queryFn: () => listCases()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [goal, setGoal] = (0, import_react.useState)("");
	const [domain, setDomain] = (0, import_react.useState)("");
	const create = useMutation({
		mutationFn: () => createCase({ data: {
			name,
			goal,
			domainHint: domain
		} }),
		onSuccess: () => {
			toast.success("Case opened.");
			setOpen(false);
			setName("");
			setGoal("");
			setDomain("");
			qc.invalidateQueries({ queryKey: ["cases"] });
			qc.invalidateQueries({ queryKey: ["overview"] });
		},
		onError: (e) => toast.error(errMessage(e))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Research",
			title: "Cases",
			description: "Leave the goal blank for bounded open discovery. Claims derived from a case survive deletion.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "Open a case"
			})
		}),
		q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-xl bg-secondary" }, i))
		}) : q.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Could not load cases",
			body: errMessage(q.error)
		}) : q.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No cases yet",
			body: "Open a research case. A blank goal is a legitimate starting point — bounded open discovery, not a missing field.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "Open a case"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: q.data.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/lab/cases/$caseId",
				params: { caseId: c.id },
				className: "block rounded-xl bg-card p-5 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl text-paper",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseBadge, { status: c.status })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 line-clamp-2 text-sm text-muted-foreground",
						children: c.goal || "Bounded open discovery — no goal registered."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-mono text-[11px] text-steel",
						children: c.id
					})
				]
			}) }, c.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Open a case" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "A case is a durable research object. You can ingest, freeze a plan, and approve it later." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					create.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "case-name",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "case-name",
							required: true,
							value: name,
							onChange: (e) => setName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "case-goal",
							children: "Goal (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "case-goal",
							value: goal,
							onChange: (e) => setGoal(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "case-domain",
							children: "Domain hint"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "case-domain",
							value: domain,
							onChange: (e) => setDomain(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: create.isPending,
						children: create.isPending ? "Opening…" : "Open case"
					}) })
				]
			})] })
		})
	] });
}
//#endregion
export { CasesLayout as component };
