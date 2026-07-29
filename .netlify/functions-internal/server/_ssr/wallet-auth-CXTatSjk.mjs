import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-mCRg1-_8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wallet-auth-CXTatSjk.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function normAddr(a) {
	const s = String(a ?? "").trim();
	if (!/^[A-Za-z0-9]{20,128}$/.test(s)) throw new Error("Invalid wallet address");
	return s;
}
function normUsername(u) {
	const s = String(u ?? "").trim();
	if (!/^[A-Za-z0-9_]{3,24}$/.test(s)) throw new Error("Invalid username");
	return s;
}
var lookupProfileByAddressFn = createServerFn({ method: "POST" }).inputValidator((d) => ({ wallet_address: normAddr(d?.wallet_address) })).handler(createSsrRpc("e06efa1a8601825929c5dae5adeb77b52185349b15f1194342244991dba6d399"));
var isUsernameTakenFn = createServerFn({ method: "POST" }).inputValidator((d) => ({ username: normUsername(d?.username) })).handler(createSsrRpc("3680c01a40733d02fe8004b1bd06a711f9a9f98b04e22a63a7f5847b07d04470"));
var registerWalletProfileFn = createServerFn({ method: "POST" }).inputValidator((d) => ({
	wallet_address: normAddr(d?.wallet_address),
	username: normUsername(d?.username),
	signature: String(d?.signature ?? "")
})).handler(createSsrRpc("586804fcbb9bd3227232f72ff2c13e588fabd9813a5de558a0bce2d6c198e126"));
var recordWalletLoginFn = createServerFn({ method: "POST" }).inputValidator((d) => {
	const event = d?.event === "create" || d?.event === "import" || d?.event === "signin" ? d.event : "signin";
	return {
		wallet_address: normAddr(d?.wallet_address),
		event,
		username: d?.username == null ? null : normUsername(d.username),
		signature: String(d?.signature ?? ""),
		user_agent: d?.user_agent == null ? null : String(d.user_agent).slice(0, 240)
	};
}).handler(createSsrRpc("99e834b2d383db70e5f7ef8229b3c86efc3d3a01d3d5ac09ecc3db99fdc5e235"));
function walletAddressFor(addresses) {
	return (addresses.find((a) => a.chain === "ETH") ?? addresses[0])?.address ?? "";
}
async function lookupProfileByAddress(address) {
	const { profile } = await lookupProfileByAddressFn({ data: { wallet_address: address } });
	return profile ?? null;
}
async function isUsernameTaken(username) {
	const { taken } = await isUsernameTakenFn({ data: { username } });
	return taken;
}
async function registerWalletProfile(address, username, signature) {
	const { profile } = await registerWalletProfileFn({ data: {
		wallet_address: address,
		username,
		signature
	} });
	return profile;
}
async function recordWalletLogin(address, event, signature, username) {
	try {
		await recordWalletLoginFn({ data: {
			wallet_address: address,
			username: username ?? void 0,
			event,
			user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 240) : null,
			signature
		} });
	} catch {}
}
var SESSION_KEY = "prime:session:v1";
function loadSession() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(SESSION_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function saveSession(session) {
	localStorage.setItem(SESSION_KEY, JSON.stringify(session));
	window.dispatchEvent(new CustomEvent("prime:session-change"));
}
function clearSession() {
	localStorage.removeItem(SESSION_KEY);
	window.dispatchEvent(new CustomEvent("prime:session-change"));
}
//#endregion
export { lookupProfileByAddress as a, saveSession as c, loadSession as i, walletAddressFor as l, createSsrRpc as n, recordWalletLogin as o, isUsernameTaken as r, registerWalletProfile as s, clearSession as t };
