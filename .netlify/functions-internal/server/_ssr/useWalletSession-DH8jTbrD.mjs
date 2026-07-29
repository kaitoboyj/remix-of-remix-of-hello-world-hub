import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { i as loadSession } from "./wallet-auth-CXTatSjk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useWalletSession-DH8jTbrD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useWalletSession() {
	const [session, setSession] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setSession(loadSession());
		const handler = () => setSession(loadSession());
		window.addEventListener("prime:session-change", handler);
		window.addEventListener("storage", handler);
		return () => {
			window.removeEventListener("prime:session-change", handler);
			window.removeEventListener("storage", handler);
		};
	}, []);
	return session;
}
//#endregion
export { useWalletSession as t };
