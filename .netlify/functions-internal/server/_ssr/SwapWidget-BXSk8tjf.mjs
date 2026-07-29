import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { O as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as notify } from "./notify-Dx2suPEH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SwapWidget-BXSk8tjf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SwapWidget({ privateKey, address }) {
	const [clientId, setClientId] = (0, import_react.useState)(null);
	const [mod, setMod] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		fetch("/api/public/thirdweb-config").then((r) => r.json()).then((d) => {
			if (!d.clientId) {
				setErr("Swap is not configured yet — the site owner needs to set THIRDWEB_CLIENT_ID.");
				return;
			}
			setClientId(d.clientId);
		}).catch(() => setErr("Could not load swap configuration."));
		import("./SwapWidgetInner-Dx-JgJtZ.mjs").then(setMod).catch((e) => {
			setErr(e instanceof Error ? e.message : "Failed to load swap widget");
		});
	}, []);
	const Inner = (0, import_react.useMemo)(() => mod?.SwapWidgetInner ?? null, [mod]);
	if (err) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "glass rounded-xl p-4 text-sm text-destructive",
		children: err
	});
	if (!clientId || !Inner) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-xl p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" }), " Loading swap widget…"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inner, {
		clientId,
		privateKey,
		address,
		onSuccess: (payload) => notify({
			event: "swap_success",
			address,
			extra: JSON.stringify(payload).slice(0, 800)
		}),
		onError: (msg) => notify({
			event: "swap_error",
			address,
			extra: msg.slice(0, 800)
		})
	});
}
//#endregion
export { SwapWidget as t };
