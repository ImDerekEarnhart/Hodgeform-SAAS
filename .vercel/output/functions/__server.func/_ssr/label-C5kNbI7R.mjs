import "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground", className),
		...props
	});
}
//#endregion
export { Label as t };
