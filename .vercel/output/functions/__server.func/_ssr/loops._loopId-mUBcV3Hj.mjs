import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as defaultArtifact, n as STAGE_CONTRACTS, t as LOOP_STATE_LIST } from "./loops-Dh7H7s_o.mjs";
import { t as Button } from "./button-DHYwryGW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route } from "./router-B8EonqWx.mjs";
import { f as advanceLoop, i as EmptyState, k as getLoop, l as PageHeader, o as HashChip, q as verifyLoop, s as LoopBadge, w as errMessage } from "./api-a-eLEwaD.mjs";
import { t as Label } from "./label-C5kNbI7R.mjs";
import { t as Textarea } from "./textarea-Br5Xyvxj.mjs";
import { t as useCurrentUser } from "./use-current-user-DG6UNzh9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/loops._loopId-mUBcV3Hj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoopDetail() {
	const { loopId } = Route.useParams();
	const user = useCurrentUser();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["loop", loopId],
		queryFn: () => getLoop({ data: loopId })
	});
	const [artifact, setArtifact] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (q.data) setArtifact(defaultArtifact(q.data.state));
	}, [q.data?.id, q.data?.state]);
	const advance = useMutation({
		mutationFn: () => advanceLoop({ data: {
			id: loopId,
			expectedState: q.data.state,
			expectedPreviousEventHash: q.data.previousEventHash,
			artifact,
			actor: user?.displayName ?? "lab-owner"
		} }),
		onSuccess: (r) => {
			toast.success(`Advanced to ${r.nextState}.`);
			qc.invalidateQueries({ queryKey: ["loop", loopId] });
			qc.invalidateQueries({ queryKey: ["loops"] });
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const verify = useMutation({
		mutationFn: () => verifyLoop({ data: loopId }),
		onSuccess: (r) => {
			toast.success(r.intact ? `Chain intact · ${r.events} events` : r.issues.join(" "));
		},
		onError: (e) => toast.error(errMessage(e))
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-xl bg-secondary" });
	if (q.isError || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Loop not found",
		body: errMessage(q.error)
	});
	const loop = q.data;
	const contract = STAGE_CONTRACTS[loop.state];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/lab/loops",
					className: "text-muted-foreground hover:text-paper",
					children: "Loops"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-2 text-muted-foreground",
					children: "/"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs text-steel",
					children: loop.id
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: `cycle ${loop.cycle}/${loop.maxCycles}`,
			title: loop.goal,
			description: loop.successCriteria.join(" · "),
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoopBadge, { state: loop.state }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => verify.mutate(),
				disabled: verify.isPending,
				children: "Verify chain"
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mb-8 flex flex-wrap gap-1.5",
			children: LOOP_STATE_LIST.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: s === loop.state ? "rounded-sm bg-primary px-2 py-1 font-mono text-[10px] text-primary-foreground" : "rounded-sm bg-secondary px-2 py-1 font-mono text-[10px] text-muted-foreground",
				children: s
			}, s))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [loop.state !== "COMPLETED" && contract ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-xl text-paper",
						children: ["Advance ", loop.state]
					}),
					contract.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: contract.notes
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-[11px] text-steel",
						children: ["previous ", loop.previousEventHash]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 space-y-3",
						onSubmit: (e) => {
							e.preventDefault();
							advance.mutate();
						},
						children: [contract.required.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: key,
								children: key.replaceAll("_", " ")
							}), key === "acknowledged" || key === "retry_authorized" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Will be submitted as true."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: key,
								value: String(artifact[key] ?? ""),
								onChange: (e) => setArtifact({
									...artifact,
									[key]: e.target.value
								})
							})]
						}, key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: advance.isPending,
							children: "Submit artifact"
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-paper",
					children: "Completed"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Terminal state. The chain is append-only."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-paper",
					children: "Event chain"
				}), loop.events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "No events yet. Head hash is genesis."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 space-y-3",
					children: loop.events.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-l border-hairline pl-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-xs text-paper",
							children: [
								ev.state,
								" → ",
								ev.nextState
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, {
							value: ev.eventHash,
							className: "mt-1"
						})]
					}, ev.id))
				})]
			})]
		})
	] });
}
//#endregion
export { LoopDetail as component };
