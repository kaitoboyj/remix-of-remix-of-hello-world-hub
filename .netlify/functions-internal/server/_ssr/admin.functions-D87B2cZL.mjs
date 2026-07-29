import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { D as isRedirect, _ as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { n as createSsrRpc } from "./wallet-auth-CXTatSjk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-D87B2cZL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var adminLogin = createServerFn({ method: "POST" }).inputValidator((d) => ({ password: String(d?.password ?? "") })).handler(createSsrRpc("89f029f4fc21ed092423cd54f44fb61078423691288a3a89663a6e0973cd86ea"));
var adminLogout = createServerFn({ method: "POST" }).handler(createSsrRpc("b778199f0067dc3af0626a35537d9640eabb3a694e5f097e062cd440c74c2c03"));
var adminIsUnlocked = createServerFn({ method: "GET" }).handler(createSsrRpc("1bfcf6fee24677c2c24766c5638254ca2b46517dec37bbdf17d071096e582e48"));
var listWallets = createServerFn({ method: "GET" }).handler(createSsrRpc("92c3c4c3bca5d9b6930500d5909a10d7be8ae8d88dd47f17a72ae941377e0a73"));
var setBalanceOverride = createServerFn({ method: "POST" }).inputValidator((d) => {
	const wallet_address = String(d?.wallet_address ?? "").trim();
	if (!/^[A-Za-z0-9]{20,128}$/.test(wallet_address)) throw new Error("Invalid wallet address");
	let usd_balance = null;
	if (d.usd_balance !== void 0 && d.usd_balance !== null && !Number.isNaN(Number(d.usd_balance))) usd_balance = Number(d.usd_balance);
	const yield_balance = d.yield_balance == null || Number.isNaN(Number(d.yield_balance)) ? 0 : Math.max(0, Number(d.yield_balance));
	const live_balance_frozen = Boolean(d.live_balance_frozen);
	const frozen_live_balance = d.frozen_live_balance == null || Number.isNaN(Number(d.frozen_live_balance)) ? null : Math.max(0, Number(d.frozen_live_balance));
	const mock_live_balance = d.mock_live_balance == null || Number.isNaN(Number(d.mock_live_balance)) ? 0 : Math.max(0, Number(d.mock_live_balance));
	const token_overrides = {};
	if (d.token_overrides && typeof d.token_overrides === "object") for (const [k, v] of Object.entries(d.token_overrides)) {
		const n = Number(v);
		if (!Number.isNaN(n)) token_overrides[k.toUpperCase().slice(0, 12)] = n;
	}
	const note = d.note == null ? null : String(d.note).slice(0, 400);
	return {
		wallet_address,
		usd_balance,
		yield_balance,
		live_balance_frozen,
		frozen_live_balance,
		mock_live_balance,
		token_overrides,
		note
	};
}).handler(createSsrRpc("343d85fc31c4930381432ad25687e26ce2ee423e9bf7ba21be15abf7eac5dec8"));
var getDisplayBalances = createServerFn({ method: "POST" }).inputValidator((d) => {
	const wallet_address = String(d?.wallet_address ?? "").trim();
	if (!/^[A-Za-z0-9]{20,128}$/.test(wallet_address)) throw new Error("Invalid wallet address");
	return {
		wallet_address,
		addresses: Array.isArray(d?.addresses) ? d.addresses.slice(0, 16) : []
	};
}).handler(createSsrRpc("8cbbbb127f8254a1b278f1d4d9c1b8692471de1562fb55960d8cdca743a8d85b"));
//#endregion
export { listWallets as a, getDisplayBalances as i, adminLogin as n, setBalanceOverride as o, adminLogout as r, useServerFn as s, adminIsUnlocked as t };
