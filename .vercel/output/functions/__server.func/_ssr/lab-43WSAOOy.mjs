import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-DHYwryGW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { G as updateLab, M as importStarterGenome, i as EmptyState, j as getOverview, l as PageHeader, w as errMessage } from "./api-a-eLEwaD.mjs";
import { t as Input } from "./input-Bz15FOWP.mjs";
import { t as Label } from "./label-C5kNbI7R.mjs";
import { t as Textarea } from "./textarea-Br5Xyvxj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lab-43WSAOOy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl bg-card text-card-foreground shadow-[var(--shadow-border)]", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("p-5", className),
		...props
	});
}
function LabHome() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["overview"],
		queryFn: () => getOverview()
	});
	const [name, setName] = (0, import_react.useState)(null);
	const [charter, setCharter] = (0, import_react.useState)(null);
	const save = useMutation({
		mutationFn: () => updateLab({ data: {
			name: name ?? q.data?.lab.name ?? "",
			charter: charter ?? q.data?.lab.charter ?? ""
		} }),
		onSuccess: () => {
			toast.success("Lab updated.");
			qc.invalidateQueries({ queryKey: ["overview"] });
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const seed = useMutation({
		mutationFn: () => importStarterGenome(),
		onSuccess: (r) => {
			toast.success(r.imported ? `Imported ${r.imported} starter operators.` : "Starter genome already present.");
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(errMessage(e))
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-64 animate-pulse rounded-md bg-secondary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-xl bg-secondary" }, i))
		})]
	});
	if (q.isError || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Could not load lab",
		body: errMessage(q.error)
	});
	const { lab, policy, counts } = q.data;
	const stats = [
		{
			label: "Cases",
			value: counts.cases,
			to: "/lab/cases"
		},
		{
			label: "Operators",
			value: counts.operators,
			to: "/lab/genome"
		},
		{
			label: "Frozen",
			value: counts.frozenOperators,
			to: "/lab/genome"
		},
		{
			label: "Evidence",
			value: counts.evidence,
			to: "/lab/evidence"
		},
		{
			label: "Pending review",
			value: counts.pendingApprovals,
			to: "/lab/experiments"
		},
		{
			label: "Open loops",
			value: counts.openLoops,
			to: "/lab/loops"
		},
		{
			label: "Claims",
			value: counts.claims,
			to: "/lab/claims"
		},
		{
			label: "Tournaments",
			value: counts.tournaments,
			to: "/lab/genome"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Tenant",
			title: lab.name,
			description: "This lab is bound to your signed-in subject. Origin-tenant cases are not loaded here.",
			actions: counts.operators === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => seed.mutate(),
				disabled: seed.isPending,
				children: seed.isPending ? "Importing…" : "Import starter genome"
			}) : null
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: s.to,
				className: "block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-3xl tabular-nums text-paper",
							children: s.value
						})]
					})
				})
			}, s.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				onSubmit: (e) => {
					e.preventDefault();
					save.mutate();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-paper",
					children: "Charter"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "lab-name",
								children: "Lab name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "lab-name",
								value: name ?? lab.name,
								onChange: (e) => setName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "charter",
								children: "Charter"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "charter",
								value: charter ?? lab.charter,
								onChange: (e) => setCharter(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: save.isPending,
							children: save.isPending ? "Saving…" : "Save"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-paper",
						children: "Governance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Hash-bound approval"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-paper",
									children: policy.requireHashBoundApproval ? "required" : "off"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "No activation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-paper",
									children: policy.noActivation ? "enforced" : "off"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Held-out prediction"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-paper",
									children: policy.requireHeldOutPrediction ? "required" : "off"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Arch. review from evidence"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-paper",
									children: policy.prohibitArchitectureReviewFromEvidence ? "prohibited" : "allowed"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "mt-5 w-full",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/lab/governance",
							children: "Open governance"
						})
					})
				]
			})]
		})
	] });
}
//#endregion
export { LabHome as component };
