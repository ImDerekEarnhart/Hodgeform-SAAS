import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DHYwryGW.mjs";
import { t as GROK_PROVIDERS } from "./server-BkOJ_EAM.mjs";
import { t as Input } from "./input-Bz15FOWP.mjs";
import { t as Label } from "./label-C5kNbI7R.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as HodgeMark } from "./hodge-mark-BNZYkiWx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DqMIfwQX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 w-80 animate-pulse rounded-xl bg-secondary" })
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/lab" });
	async function onEmail(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			if (mode === "up") {
				const { error: err } = await authClient.signUp.email({
					email,
					password,
					name: name.trim() || email.split("@")[0]
				});
				if (err) throw new Error(err.message ?? "Sign-up failed");
			} else {
				const { error: err } = await authClient.signIn.email({
					email,
					password
				});
				if (err) throw new Error(err.message ?? "Sign-in failed");
			}
			window.location.href = "/lab";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign-in failed");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "mb-8 flex items-center justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HodgeMark, { className: "size-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-xl text-paper",
					children: "Hodgeform Lab"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-card p-6 shadow-[var(--shadow-border)] sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl text-paper",
						children: mode === "in" ? "Sign in" : "Create a lab"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Your lab is private to this account. The origin tenant is never loaded in."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 grid gap-2",
							children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								className: "w-full",
								onClick: () => void signIn(p.providerId, { callbackURL: "/lab" }),
								children: ["Continue with ", p.label]
							}, p.providerId))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-6 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
								"or email",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "space-y-3",
							onSubmit: onEmail,
							children: [
								mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "name",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										value: name,
										onChange: (e) => setName(e.target.value),
										autoComplete: "name"
									})]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "email",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										autoComplete: "email"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "password",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: "password",
										required: true,
										minLength: 8,
										value: password,
										onChange: (e) => setPassword(e.target.value),
										autoComplete: mode === "up" ? "new-password" : "current-password"
									})]
								}),
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-destructive",
									children: error
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "w-full",
									disabled: busy,
									children: busy ? "Working…" : mode === "in" ? "Sign in" : "Create account"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-4 w-full text-center text-sm text-muted-foreground underline-offset-4 hover:text-paper hover:underline",
							onClick: () => {
								setMode(mode === "in" ? "up" : "in");
								setError(null);
							},
							children: mode === "in" ? "Need an account? Create a lab" : "Already have a lab? Sign in"
						})
					] })
				]
			})]
		})
	});
}
//#endregion
export { Login as component };
