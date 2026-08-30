import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DHYwryGW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as createLoop, i as EmptyState, l as PageHeader, s as LoopBadge, w as errMessage, z as listLoops } from "./api-a-eLEwaD.mjs";
import { t as Input } from "./input-Bz15FOWP.mjs";
import { t as Label } from "./label-C5kNbI7R.mjs";
import { t as Textarea } from "./textarea-Br5Xyvxj.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DV8FlHQB.mjs";
import { t as useCurrentUser } from "./use-current-user-DG6UNzh9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/loops-Ayr8_Ivj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoopsLayout() {
	if (useRouterState({ select: (s) => s.location.pathname }) !== "/lab/loops") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoopsPage, {});
}
function LoopsPage() {
	const user = useCurrentUser();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["loops"],
		queryFn: () => listLoops()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [goal, setGoal] = (0, import_react.useState)("");
	const [criteria, setCriteria] = (0, import_react.useState)("");
	const [caps, setCaps] = (0, import_react.useState)("human-review\nreceipt-only");
	const [cycles, setCycles] = (0, import_react.useState)("3");
	const create = useMutation({
		mutationFn: () => createLoop({ data: {
			goal,
			successCriteria: criteria,
			allowedCapabilities: caps,
			maxCycles: Number(cycles),
			createdBy: user?.displayName ?? "lab-owner"
		} }),
		onSuccess: () => {
			toast.success("Loop frozen at GOAL.");
			setOpen(false);
			setGoal("");
			setCriteria("");
			qc.invalidateQueries({ queryKey: ["loops"] });
			qc.invalidateQueries({ queryKey: ["overview"] });
		},
		onError: (e) => toast.error(errMessage(e))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Governed problem solving",
			title: "Loops",
			description: "One admissible next state. Artifacts are hash-chained. Repair never auto-activates.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "New loop"
			})
		}),
		q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-secondary" }) : q.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Could not load loops",
			body: errMessage(q.error)
		}) : q.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No loops",
			body: "Freeze an objective, success criteria, capabilities, and a retry budget. The first state is GOAL.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "New loop"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: q.data.map((loop) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/lab/loops/$loopId",
				params: { loopId: loop.id },
				className: "block rounded-xl bg-card p-5 shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-paper",
						children: loop.goal
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoopBadge, { state: loop.state })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-mono text-[11px] text-steel",
					children: [
						"cycle ",
						loop.cycle,
						"/",
						loop.maxCycles,
						" · ",
						loop.id
					]
				})]
			}) }, loop.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Freeze a loop" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Charter is immutable after create. Advancing requires the previous event hash." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					create.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "goal",
							children: "Goal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "goal",
							value: goal,
							onChange: (e) => setGoal(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "sc",
							children: "Success criteria (one per line)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "sc",
							value: criteria,
							onChange: (e) => setCriteria(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "cap",
							children: "Allowed capabilities"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "cap",
							value: caps,
							onChange: (e) => setCaps(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "cy",
							children: "Max cycles"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "cy",
							type: "number",
							min: 1,
							max: 8,
							value: cycles,
							onChange: (e) => setCycles(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: create.isPending,
						children: "Create loop"
					}) })
				]
			})] })
		})
	] });
}
//#endregion
export { LoopsLayout as component };
