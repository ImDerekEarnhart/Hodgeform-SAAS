import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PHRASES } from "./phrases-hctJGTVI.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-DHYwryGW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as listOperators, D as freezeTournament, M as importStarterGenome, P as jsonStringField, S as createTournament, V as listTournaments, c as OperatorBadge, i as EmptyState, l as PageHeader, o as HashChip, u as TournamentBadge, w as errMessage, x as createOperator } from "./api-a-eLEwaD.mjs";
import { t as Input } from "./input-Bz15FOWP.mjs";
import { t as Label } from "./label-C5kNbI7R.mjs";
import { t as Textarea } from "./textarea-Br5Xyvxj.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DV8FlHQB.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/genome-D1jX1q8W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-11 items-center gap-1 rounded-lg bg-secondary p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex h-9 items-center justify-center rounded-md px-3 text-sm text-muted-foreground transition-colors data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-[var(--shadow-border)]", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("mt-4 outline-none", className),
		...props
	});
}
function GenomeLayout() {
	if (useRouterState({ select: (s) => s.location.pathname }) !== "/lab/genome") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenomePage, {});
}
function GenomePage() {
	const qc = useQueryClient();
	const ops = useQuery({
		queryKey: ["operators"],
		queryFn: () => listOperators()
	});
	const tours = useQuery({
		queryKey: ["tournaments"],
		queryFn: () => listTournaments()
	});
	const [openOp, setOpenOp] = (0, import_react.useState)(false);
	const [openTour, setOpenTour] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		operatorKey: "",
		name: "",
		description: "",
		kill_switch: "",
		intervention: "",
		recovery_test: "",
		held_out_prediction: ""
	});
	const [tourName, setTourName] = (0, import_react.useState)("");
	const [tourTarget, setTourTarget] = (0, import_react.useState)("");
	const [freezeId, setFreezeId] = (0, import_react.useState)(null);
	const [freezeHash, setFreezeHash] = (0, import_react.useState)("");
	const [freezePhrase, setFreezePhrase] = (0, import_react.useState)("");
	const seed = useMutation({
		mutationFn: () => importStarterGenome(),
		onSuccess: (r) => {
			toast.success(r.imported ? `Imported ${r.imported} operators.` : "Already imported.");
			qc.invalidateQueries({ queryKey: ["operators"] });
			qc.invalidateQueries({ queryKey: ["overview"] });
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const createOp = useMutation({
		mutationFn: () => createOperator({ data: {
			operatorKey: form.operatorKey,
			name: form.name,
			description: form.description,
			contract: {
				kill_switch: form.kill_switch,
				intervention: form.intervention,
				recovery_test: form.recovery_test,
				held_out_prediction: form.held_out_prediction
			}
		} }),
		onSuccess: () => {
			toast.success("Operator created as review_needed.");
			setOpenOp(false);
			qc.invalidateQueries({ queryKey: ["operators"] });
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const createTour = useMutation({
		mutationFn: () => createTournament({ data: {
			name: tourName,
			target: tourTarget
		} }),
		onSuccess: () => {
			toast.success("Draft tournament created.");
			setOpenTour(false);
			setTourName("");
			setTourTarget("");
			qc.invalidateQueries({ queryKey: ["tournaments"] });
		},
		onError: (e) => toast.error(errMessage(e))
	});
	const freeze = useMutation({
		mutationFn: () => freezeTournament({ data: {
			id: freezeId,
			expectedReviewHash: freezeHash,
			confirmation: freezePhrase
		} }),
		onSuccess: () => {
			toast.success("Tournament frozen.");
			setFreezeId(null);
			qc.invalidateQueries({ queryKey: ["tournaments"] });
		},
		onError: (e) => toast.error(errMessage(e))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Discovery genome",
			title: "Operators",
			description: "Executable contracts stay review_needed until you freeze the exact review hash.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => seed.mutate(),
				disabled: seed.isPending,
				children: "Import starter genome"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpenOp(true),
				children: "New operator"
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "operators",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "operators",
					children: "Operators"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "tournaments",
					children: "Tournaments"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "operators",
					children: ops.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-secondary" }) : ops.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "Could not load operators",
						body: errMessage(ops.error)
					}) : ops.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "Empty genome",
						body: "Import the seven cross-domain families, or write your own. Nothing is frozen or proven on import.",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => seed.mutate(),
							disabled: seed.isPending,
							children: "Import starter genome"
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-3 sm:grid-cols-2",
						children: ops.data.map((op) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/lab/genome/$operatorId",
							params: { operatorId: op.id },
							className: "block h-full rounded-xl bg-card p-5 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[11px] text-steel",
										children: op.operatorKey
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-1 font-display text-xl text-paper",
										children: op.name
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OperatorBadge, { status: op.status })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 line-clamp-3 text-sm text-muted-foreground",
									children: op.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, { value: op.reviewHash })
								})
							]
						}) }, op.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "tournaments",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setOpenTour(true),
							children: "New tournament"
						})
					}), tours.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 animate-pulse rounded-xl bg-secondary" }) : tours.data && tours.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No tournaments",
						body: "Create a draft around one declared unseen target. Freeze requires the current manifest hash."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: tours.data?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-xl text-paper",
										children: t.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TournamentBadge, { status: t.status })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: ["Unseen target: ", jsonStringField(t.target, "unseen") ?? "—"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, { value: t.manifestHash }), t.status === "draft" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => {
											setFreezeId(t.id);
											setFreezeHash(t.manifestHash);
											setFreezePhrase("");
										},
										children: "Freeze"
									}) : null]
								})
							]
						}, t.id))
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: openOp,
			onOpenChange: setOpenOp,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-h-[90dvh] overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New operator" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Created as review_needed. All four contract fields are required." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						createOp.mutate();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ok",
									children: "Key"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ok",
									className: "font-mono text-xs",
									value: form.operatorKey,
									onChange: (e) => setForm({
										...form,
										operatorKey: e.target.value
									}),
									required: true
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "on",
									children: "Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "on",
									value: form.name,
									onChange: (e) => setForm({
										...form,
										name: e.target.value
									}),
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "od",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "od",
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								})
							})]
						}),
						[
							"kill_switch",
							"intervention",
							"recovery_test",
							"held_out_prediction"
						].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: k,
								children: k.replaceAll("_", " ")
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
							disabled: createOp.isPending,
							children: "Create"
						}) })
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: openTour,
			onOpenChange: setOpenTour,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Draft tournament" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Blind discovery around one declared unseen target." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					createTour.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "tn",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "tn",
							value: tourName,
							onChange: (e) => setTourName(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "tt",
							children: "Unseen target"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "tt",
							value: tourTarget,
							onChange: (e) => setTourTarget(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: createTour.isPending,
						children: "Create draft"
					}) })
				]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: Boolean(freezeId),
			onOpenChange: (v) => !v && setFreezeId(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Freeze tournament" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: PHRASES.freezeTournament })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					freeze.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "th",
							children: "Expected manifest hash"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "th",
							className: "font-mono text-xs",
							value: freezeHash,
							onChange: (e) => setFreezeHash(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "tp",
							children: "Confirmation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "tp",
							value: freezePhrase,
							onChange: (e) => setFreezePhrase(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: freeze.isPending,
						children: "Freeze"
					}) })
				]
			})] })
		})
	] });
}
//#endregion
export { GenomeLayout as component };
