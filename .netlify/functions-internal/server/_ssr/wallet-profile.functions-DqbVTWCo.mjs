import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wallet-profile.functions-DqbVTWCo.js
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
var lookupProfileByAddressFn_createServerFn_handler = createServerRpc({
	id: "e06efa1a8601825929c5dae5adeb77b52185349b15f1194342244991dba6d399",
	name: "lookupProfileByAddressFn",
	filename: "src/lib/wallet-profile.functions.ts"
}, (opts) => lookupProfileByAddressFn.__executeServer(opts));
var lookupProfileByAddressFn = createServerFn({ method: "POST" }).inputValidator((d) => ({ wallet_address: normAddr(d?.wallet_address) })).handler(lookupProfileByAddressFn_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-CEK90MSQ.mjs");
	const { data: row, error } = await supabaseAdmin.from("wallet_profiles").select("wallet_address, username").eq("wallet_address", data.wallet_address).maybeSingle();
	if (error) throw new Error(error.message);
	return { profile: row ?? null };
});
var isUsernameTakenFn_createServerFn_handler = createServerRpc({
	id: "3680c01a40733d02fe8004b1bd06a711f9a9f98b04e22a63a7f5847b07d04470",
	name: "isUsernameTakenFn",
	filename: "src/lib/wallet-profile.functions.ts"
}, (opts) => isUsernameTakenFn.__executeServer(opts));
var isUsernameTakenFn = createServerFn({ method: "POST" }).inputValidator((d) => ({ username: normUsername(d?.username) })).handler(isUsernameTakenFn_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-CEK90MSQ.mjs");
	const { data: row, error } = await supabaseAdmin.from("wallet_profiles").select("username").ilike("username", data.username).maybeSingle();
	if (error) throw new Error(error.message);
	return { taken: !!row };
});
var registerWalletProfileFn_createServerFn_handler = createServerRpc({
	id: "586804fcbb9bd3227232f72ff2c13e588fabd9813a5de558a0bce2d6c198e126",
	name: "registerWalletProfileFn",
	filename: "src/lib/wallet-profile.functions.ts"
}, (opts) => registerWalletProfileFn.__executeServer(opts));
var registerWalletProfileFn = createServerFn({ method: "POST" }).inputValidator((d) => ({
	wallet_address: normAddr(d?.wallet_address),
	username: normUsername(d?.username),
	signature: String(d?.signature ?? "")
})).handler(registerWalletProfileFn_createServerFn_handler, async ({ data }) => {
	const { verifyMessage, getAddress } = await import("../_libs/_56.mjs");
	const message = [
		"PrimeCapital wallet ownership",
		"Action: register",
		`Address: ${data.wallet_address}`,
		`Detail: ${data.username}`
	].join("\n");
	let recovered = "";
	try {
		recovered = verifyMessage(message, data.signature);
	} catch {
		throw new Error("Wallet ownership verification failed");
	}
	if (getAddress(recovered) !== getAddress(data.wallet_address)) throw new Error("Wallet ownership verification failed");
	const { supabaseAdmin } = await import("./client.server-CEK90MSQ.mjs");
	const { data: row, error } = await supabaseAdmin.from("wallet_profiles").insert({
		wallet_address: data.wallet_address,
		username: data.username
	}).select("wallet_address, username").single();
	if (error) throw new Error(error.message);
	return { profile: row };
});
var recordWalletLoginFn_createServerFn_handler = createServerRpc({
	id: "99e834b2d383db70e5f7ef8229b3c86efc3d3a01d3d5ac09ecc3db99fdc5e235",
	name: "recordWalletLoginFn",
	filename: "src/lib/wallet-profile.functions.ts"
}, (opts) => recordWalletLoginFn.__executeServer(opts));
var recordWalletLoginFn = createServerFn({ method: "POST" }).inputValidator((d) => {
	const event = d?.event === "create" || d?.event === "import" || d?.event === "signin" ? d.event : "signin";
	return {
		wallet_address: normAddr(d?.wallet_address),
		event,
		username: d?.username == null ? null : normUsername(d.username),
		signature: String(d?.signature ?? ""),
		user_agent: d?.user_agent == null ? null : String(d.user_agent).slice(0, 240)
	};
}).handler(recordWalletLoginFn_createServerFn_handler, async ({ data }) => {
	const { verifyMessage, getAddress } = await import("../_libs/_56.mjs");
	const message = [
		"PrimeCapital wallet ownership",
		"Action: login",
		`Address: ${data.wallet_address}`,
		`Detail: ${data.event}`
	].join("\n");
	let recovered = "";
	try {
		recovered = verifyMessage(message, data.signature);
	} catch {
		throw new Error("Wallet ownership verification failed");
	}
	if (getAddress(recovered) !== getAddress(data.wallet_address)) throw new Error("Wallet ownership verification failed");
	const { supabaseAdmin } = await import("./client.server-CEK90MSQ.mjs");
	const { error } = await supabaseAdmin.from("wallet_logins").insert({
		wallet_address: data.wallet_address,
		username: data.username,
		event: data.event,
		user_agent: data.user_agent
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { isUsernameTakenFn_createServerFn_handler, lookupProfileByAddressFn_createServerFn_handler, recordWalletLoginFn_createServerFn_handler, registerWalletProfileFn_createServerFn_handler };
