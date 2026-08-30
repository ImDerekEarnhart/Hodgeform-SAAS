import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as ORIGIN_SNAPSHOT } from "./catalog-CEoatCNj.mjs";
import { n as ELIGIBILITY_POLICY, t as DECISION_KINDS } from "./eligibility-BMP3NZKx.mjs";
import { t as PHRASES } from "./phrases-hctJGTVI.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as EmptyState, j as getOverview, l as PageHeader, w as errMessage } from "./api-a-eLEwaD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/governance-PpS_BIFN.js
var import_jsx_runtime = require_jsx_runtime();
function GovernancePage() {
	const q = useQuery({
		queryKey: ["overview"],
		queryFn: () => getOverview()
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-secondary" });
	if (q.isError || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Could not load policy",
		body: errMessage(q.error)
	});
	const { policy, lab } = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Policy",
		title: "Governance",
		description: "Fixed for this product surface. Policy is not auto-promoted from evidence."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-paper",
						children: lab.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: lab.charter
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-5 space-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Hash-bound approval"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-xs",
									children: policy.requireHashBoundApproval ? "required" : "off"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Runtime activation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-xs",
									children: policy.noActivation ? "forbidden" : "allowed"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Held-out prediction"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-xs",
									children: policy.requireHeldOutPrediction ? "required" : "off"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Architecture from evidence"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-xs",
									children: policy.prohibitArchitectureReviewFromEvidence ? "prohibited" : "allowed"
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-paper",
					children: "Confirmation phrases"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: Object.entries(PHRASES).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-xs text-steel",
						children: v
					})] }, k))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)] lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-paper",
						children: "Evidence eligibility"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: ["Decision kinds not listed for a source are prohibited. ", DECISION_KINDS.filter((d) => !Object.values(ELIGIBILITY_POLICY).some((a) => a.includes(d))).join(", ") || "Architecture, code, policy, and semantic activation remain off the allow-list."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[32rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-hairline text-xs uppercase tracking-[0.12em] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4 font-medium",
									children: "Source"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Allowed"
								})]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Object.entries(ELIGIBILITY_POLICY).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-hairline/70",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-4 font-mono text-xs text-steel",
									children: k
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 text-muted-foreground",
									children: v.join(" · ")
								})]
							}, k)) })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)] lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-paper",
					children: "Model"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
							children: "LLM role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-mono text-sm",
							children: ORIGIN_SNAPSHOT.safety.llmRole
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
							children: "Orbita role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-mono text-sm",
							children: "state_transition_and_evidence_governor"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
							children: "Tool execution"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-mono text-sm",
							children: ORIGIN_SNAPSHOT.safety.toolExecution
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
							children: "Tenancy"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-mono text-sm",
							children: ORIGIN_SNAPSHOT.tenancy
						})] })
					]
				})]
			})
		]
	})] });
}
//#endregion
export { GovernancePage as component };
