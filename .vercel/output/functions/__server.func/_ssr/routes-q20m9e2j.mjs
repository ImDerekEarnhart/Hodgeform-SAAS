import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as STARTER_OPERATORS, t as ORIGIN_SNAPSHOT } from "./catalog-CEoatCNj.mjs";
import { n as ELIGIBILITY_POLICY } from "./eligibility-BMP3NZKx.mjs";
import { t as Button } from "./button-DHYwryGW.mjs";
import { f as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as HodgeMark } from "./hodge-mark-BNZYkiWx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-q20m9e2j.js
var import_jsx_runtime = require_jsx_runtime();
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-11 w-28 animate-pulse rounded-md bg-secondary" });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/lab",
			children: "Enter lab"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				children: "Sign in"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				children: "Open a lab"
			})
		})]
	});
}
function Home() {
	const { user, isPending } = useCurrentUserState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HodgeMark, { className: "size-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg tracking-tight",
						children: "Hodgeform Lab"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "lab-grid relative overflow-hidden border-y border-hairline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-medium uppercase tracking-[0.2em] text-steel",
							children: [
								"Orbita ",
								ORIGIN_SNAPSHOT.version,
								" · tenant isolated"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-paper sm:text-6xl",
							children: "A Hodgeform of your own."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-xl text-base text-muted-foreground sm:text-lg",
							children: "Not a window into the origin tenant. Each account is a sealed research lab: cases, discovery operators, hash-bound experiments, an append-only evidence ledger, and governed problem loops."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col gap-3 sm:flex-row",
							children: [isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 w-40 animate-pulse rounded-md bg-secondary" }) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/lab",
									children: ["Enter your lab ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/login",
									children: ["Open a lab ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#model",
									children: "Read the model"
								})
							})]
						}),
						null
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "model",
				className: "mx-auto grid max-w-6xl gap-px bg-hairline px-0 sm:grid-cols-3",
				children: [
					{
						k: "Tenancy",
						t: "Subject-bound, not shared",
						d: "Every row is scoped to the signed-in account. The origin lab is a public snapshot, never copied into yours."
					},
					{
						k: "Review",
						t: "Hash-bound freeze",
						d: "Operators, plans, and experiments freeze only against the exact SHA-256 of canonical JSON plus a confirmation phrase."
					},
					{
						k: "Activation",
						t: "Receipts, not runtime",
						d: "The lab records executor receipts. It does not deploy code, promote policy, or activate architecture."
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "bg-background px-6 py-10 sm:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.16em] text-steel",
							children: item.k
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-2xl text-paper",
							children: item.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: item.d
						})
					]
				}, item.k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.16em] text-steel",
						children: "Discovery genome"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl text-paper",
						children: "Seven families. Nothing proven on import."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-sm text-muted-foreground",
						children: "Starter operators arrive as review_needed. Freeze is a deliberate act against the current review hash."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 grid gap-3 sm:grid-cols-2",
						children: STARTER_OPERATORS.map((op) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] text-steel",
									children: op.operatorKey
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 font-display text-lg text-paper",
									children: op.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: op.description
								})
							]
						}, op.operatorKey))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-hairline bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.16em] text-steel",
							children: "Evidence ledger"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-3xl text-paper",
							children: "Bounded evidence cannot become universal."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-2xl text-sm text-muted-foreground",
							children: "Each receipt is append-only, hashed, and eligible only for the decision kinds its source adapter allows. Architecture, code, and policy promotion stay prohibited."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-[32rem] text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-hairline text-xs uppercase tracking-[0.12em] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4 font-medium",
										children: "Source"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 font-medium",
										children: "Allowed decisions"
									})]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Object.entries(ELIGIBILITY_POLICY).map(([kind, allowed]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-hairline/70",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 font-mono text-xs text-steel",
										children: kind
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 text-muted-foreground",
										children: allowed.join(" · ")
									})]
								}, kind)) })]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.16em] text-steel",
						children: "Problem loops"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl text-paper",
						children: "One admissible next state."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-sm text-muted-foreground",
						children: "LLM proposes. Orbita governs the transition. Artifacts are hash-chained. Repair never auto-activates."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-8 flex flex-wrap gap-2",
						children: ORIGIN_SNAPSHOT.loopStates.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-sm bg-secondary px-2.5 py-1.5 font-mono text-[11px] tracking-wide text-paper",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [String(i + 1).padStart(2, "0"), " "]
							}), s]
						}, s))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-hairline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.16em] text-steel",
							children: "Origin snapshot"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-3xl text-paper",
							children: "Public face of Hodgeform. Read-only."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-2xl text-sm text-muted-foreground",
							children: "The origin lab is not imported into new accounts. This is the model your lab implements locally, under your tenancy."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
							children: [
								["Product", ORIGIN_SNAPSHOT.product],
								["Genome", ORIGIN_SNAPSHOT.genome],
								["Tenancy", ORIGIN_SNAPSHOT.tenancy],
								["Tool execution", ORIGIN_SNAPSHOT.safety.toolExecution]
							].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
									children: k
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 font-mono text-sm text-paper",
									children: v
								})]
							}, k))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-hairline px-4 py-8 text-center text-xs text-muted-foreground",
				children: [
					"Hodgeform Lab · Orbita ",
					ORIGIN_SNAPSHOT.version,
					" · no runtime activation"
				]
			})
		]
	});
}
//#endregion
export { Home as component };
