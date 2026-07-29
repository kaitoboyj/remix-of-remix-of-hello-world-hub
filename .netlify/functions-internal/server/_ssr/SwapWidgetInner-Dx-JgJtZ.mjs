import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { ab as ThirdwebProvider, ib as BridgeWidget, ix as ethereum, kx as createThirdwebClient, nb as privateKeyToAccount, rb as createWalletAdapter, rx as useConnect } from "../_libs/thirdweb+uqr+viem+zod.mjs";
import { createRequire } from "node:module";
//#region node_modules/.nitro/vite/services/ssr/assets/SwapWidgetInner-Dx-JgJtZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __require = /* @__PURE__ */ createRequire(import.meta.url);
if (typeof WebSocket === "undefined") global.WebSocket = __require("ws");
function SwapWidgetInner(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThirdwebProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bridge, { ...props }) });
}
function Bridge({ clientId, privateKey, onSuccess, onError }) {
	const client = (0, import_react.useMemo)(() => {
		const clientConfig = { clientId };
		if (typeof window === "undefined" && typeof WebSocket !== "undefined") clientConfig.transport = __require("ws");
		return createThirdwebClient(clientConfig);
	}, [clientId]);
	const { connect } = useConnect();
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		connect(async () => {
			const wallet = createWalletAdapter({
				client,
				adaptedAccount: privateKeyToAccount({
					client,
					privateKey
				}),
				chain: ethereum,
				onDisconnect: () => {},
				switchChain: async () => {}
			});
			if (cancelled) throw new Error("cancelled");
			return wallet;
		}).catch((e) => onError?.(e instanceof Error ? e.message : String(e)));
		return () => {
			cancelled = true;
		};
	}, [
		client,
		privateKey,
		connect,
		onError
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BridgeWidget, {
			client,
			theme: "dark",
			swap: {
				onSuccess: (data) => onSuccess?.({
					kind: "swap",
					quote: data.quote?.originAmount?.toString?.()
				}),
				onError: (e) => onError?.(e.message)
			}
		})
	});
}
//#endregion
export { SwapWidgetInner };
