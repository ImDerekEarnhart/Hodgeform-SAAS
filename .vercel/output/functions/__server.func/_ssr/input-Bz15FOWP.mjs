import "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground/80 outline-none transition-[box-shadow,border-color] duration-150 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
//#endregion
export { Input as t };
