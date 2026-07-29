import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { N as Copy, P as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CopyButton-3o43l5K1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CopyButton({ value, label = "Copy", className }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const onClick = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 1400);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-label": label,
		title: label,
		className: cn("inline-flex items-center gap-1 rounded-md glass px-2 py-1 text-[11px] font-medium hover:bg-white/10 transition", className),
		children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), copied ? "Copied" : label]
	});
}
//#endregion
export { CopyButton as t };
