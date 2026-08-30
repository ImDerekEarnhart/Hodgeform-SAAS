import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PHRASES } from "./phrases-hctJGTVI.mjs";
import { t as Button } from "./button-DHYwryGW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$1 } from "./router-B8EonqWx.mjs";
import { A as getOperator, E as freezeOperator, c as OperatorBadge, i as EmptyState, l as PageHeader, o as HashChip, w as errMessage } from "./api-a-eLEwaD.mjs";
import { t as Input } from "./input-Bz15FOWP.mjs";
import { t as Label } from "./label-C5kNbI7R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/genome._operatorId-xoZswNFM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OperatorDetail() {
	const { operatorId } = Route$1.useParams();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["operator", operatorId],
		queryFn: () => getOperator({ data: operatorId })
	});
	const [hash, setHash] = (0, import_react.useState)("");
	const [phrase, setPhrase] = (0, import_react.useState)("");
	const freeze = useMutation({
		mutationFn: () => freezeOperator({ data: {
			id: operatorId,
			expectedReviewHash: hash || q.data?.reviewHash || "",
			confirmation: phrase
		} }),
		onSuccess: () => {
			toast.success("Operator frozen.");
			qc.invalidateQueries({ queryKey: ["operator", operatorId] });
			qc.invalidateQueries({ queryKey: ["operators"] });
			qc.invalidateQueries({ queryKey: ["overview"] });
		},
		onError: (e) => toast.error(errMessage(e))
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-xl bg-secondary" });
	if (q.isError || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Operator not found",
		body: errMessage(q.error)
	});
	const op = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/lab/genome",
					className: "text-muted-foreground hover:text-paper",
					children: "Genome"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-2 text-muted-foreground",
					children: "/"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs text-steel",
					children: op.operatorKey
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "operator",
			title: op.name,
			description: op.description,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OperatorBadge, { status: op.status })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-paper",
					children: "Contract"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-4 space-y-4",
					children: Object.entries(op.contract).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs uppercase tracking-[0.14em] text-steel",
						children: k.replaceAll("_", " ")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 text-sm text-muted-foreground",
						children: v
					})] }, k))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-paper",
						children: "Hashes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
							children: "Contract hash"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, {
							value: op.contractHash,
							className: "mt-1"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
							children: "Review hash"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, {
							value: op.reviewHash,
							className: "mt-1"
						})] })]
					}),
					op.status === "review_needed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-6 space-y-3",
						onSubmit: (e) => {
							e.preventDefault();
							freeze.mutate();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Freeze requires the current review hash and the phrase:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-steel",
								children: PHRASES.freezeOperator
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "rh",
									children: "Expected review hash"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "rh",
									className: "font-mono text-xs",
									value: hash || op.reviewHash,
									onChange: (e) => setHash(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ph",
									children: "Confirmation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ph",
									value: phrase,
									onChange: (e) => setPhrase(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: freeze.isPending,
								children: "Freeze operator"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-muted-foreground",
						children: "This contract is frozen. It cannot be edited in place."
					})
				]
			})]
		})
	] });
}
//#endregion
export { OperatorDetail as component };
