import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-DHYwryGW.mjs";
import { a as Repeat, c as Hexagon, d as Bookmark, i as Scale, l as FlaskConical, o as Menu, r as ScrollText, s as LayoutGrid, t as X, u as Files } from "../_libs/lucide-react.mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as HodgeMark } from "./hodge-mark-BNZYkiWx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lab-BTvQabM2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
var NAV = [
	{
		to: "/lab",
		label: "Overview",
		icon: LayoutGrid,
		exact: true
	},
	{
		to: "/lab/cases",
		label: "Cases",
		icon: Files,
		exact: false
	},
	{
		to: "/lab/genome",
		label: "Genome",
		icon: Hexagon,
		exact: false
	},
	{
		to: "/lab/evidence",
		label: "Evidence",
		icon: ScrollText,
		exact: false
	},
	{
		to: "/lab/experiments",
		label: "Experiments",
		icon: FlaskConical,
		exact: false
	},
	{
		to: "/lab/loops",
		label: "Loops",
		icon: Repeat,
		exact: false
	},
	{
		to: "/lab/claims",
		label: "Claims",
		icon: Bookmark,
		exact: false
	},
	{
		to: "/lab/governance",
		label: "Governance",
		icon: Scale,
		exact: false
	}
];
function LabShell({ children }) {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", { className: "hidden w-60 shrink-0 border-r border-hairline bg-card md:block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-48 animate-pulse rounded-md bg-secondary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-40 animate-pulse rounded-xl bg-secondary" })]
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	const nav = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-0.5",
		children: NAV.map((item) => {
			const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: () => setOpen(false),
				className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors", active ? "bg-secondary text-paper" : "text-muted-foreground hover:bg-secondary/70 hover:text-paper"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-4",
					strokeWidth: 1.75
				}), item.label]
			}, item.to);
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden w-60 shrink-0 flex-col border-r border-hairline bg-card md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5 px-4 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HodgeMark, { className: "size-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg tracking-tight text-paper",
						children: "Hodgeform Lab"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 px-3",
					children: nav
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-hairline px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm text-paper",
							children: label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-mono text-[11px] text-muted-foreground",
							children: user.id.slice(0, 16)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: signingOut,
							onClick: () => {
								setSigningOut(true);
								signOut("/").catch(() => setSigningOut(false));
							},
							className: "mt-2 text-xs text-muted-foreground underline-offset-4 hover:text-paper hover:underline",
							children: signingOut ? "Signing out…" : "Sign out"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between border-b border-hairline px-4 py-3 md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HodgeMark, { className: "size-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-base text-paper",
							children: "Hodgeform Lab"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Menu",
						onClick: () => setOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					})]
				}),
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fixed inset-0 z-50 md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute inset-0 bg-ink/70",
						"aria-label": "Close menu",
						onClick: () => setOpen(false)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex h-full w-72 max-w-[85%] flex-col bg-card p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-lg text-paper",
									children: "Lab"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									"aria-label": "Close",
									onClick: () => setOpen(false),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
								})]
							}),
							nav,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-auto border-t border-hairline pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm",
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-2 text-xs text-muted-foreground underline-offset-4 hover:underline",
									onClick: () => {
										setSigningOut(true);
										signOut("/").catch(() => setSigningOut(false));
									},
									children: "Sign out"
								})]
							})
						]
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-4 py-6 sm:px-8 sm:py-8",
					children
				})
			]
		})]
	});
}
function LabLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { LabLayout as component };
