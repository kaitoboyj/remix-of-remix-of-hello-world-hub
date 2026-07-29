import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { i as useSession$1, t as getCookie } from "./request-response-CQEjjZQ9.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { createHash, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/mixman.functions-beZmZbca.js
var SESSION_NAME = "prime-mixman-session";
var MIXMAN_PASSWORD = "Bethebest";
var MIXMAN_SESSION_SECRET = "b2f0d1c9e7ab41ff9c2e3d76a5813fa4e60c72d18499bb0511e2f7cc4a9d3e8b";
function cfg() {
	return {
		password: MIXMAN_SESSION_SECRET,
		name: SESSION_NAME,
		maxAge: 3600 * 12,
		cookie: {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			path: "/"
		}
	};
}
function tsEq(a, b) {
	const ah = createHash("sha256").update(a, "utf8").digest();
	const bh = createHash("sha256").update(b, "utf8").digest();
	return ah.length === bh.length && timingSafeEqual(ah, bh);
}
function verifyMixmanPassword(input) {
	return tsEq(String(input ?? ""), MIXMAN_PASSWORD);
}
async function createMixmanSession() {
	return useSession$1(cfg());
}
async function requireMixmanUnlocked() {
	const s = await createMixmanSession();
	if (!s.data?.unlocked) throw new Error("mixman_locked");
	return s;
}
async function isMixmanUnlocked() {
	if (!getCookie(SESSION_NAME)) return false;
	try {
		return !!(await createMixmanSession()).data?.unlocked;
	} catch {
		return false;
	}
}
var mixmanLogin_createServerFn_handler = createServerRpc({
	id: "3a2ec845f2d1d731b708562082d89185674c0c97ef2c43237c7e830c522d3350",
	name: "mixmanLogin",
	filename: "src/lib/mixman.functions.ts"
}, (opts) => mixmanLogin.__executeServer(opts));
var mixmanLogin = createServerFn({ method: "POST" }).inputValidator((d) => ({ password: String(d?.password ?? "") })).handler(mixmanLogin_createServerFn_handler, async ({ data }) => {
	if (!verifyMixmanPassword(data.password)) return { ok: false };
	await (await createMixmanSession()).update({ unlocked: true });
	return { ok: true };
});
var mixmanLogout_createServerFn_handler = createServerRpc({
	id: "60f8653d1d39f8d6f504c104c61826dd16b8339e34b775b0393b948170be164a",
	name: "mixmanLogout",
	filename: "src/lib/mixman.functions.ts"
}, (opts) => mixmanLogout.__executeServer(opts));
var mixmanLogout = createServerFn({ method: "POST" }).handler(mixmanLogout_createServerFn_handler, async () => {
	await (await createMixmanSession()).clear();
	return { ok: true };
});
var mixmanIsUnlocked_createServerFn_handler = createServerRpc({
	id: "e4eff7bfafe3df43995943f72efe2a0ef742fddee0e189dcd697cfaa1eb524d4",
	name: "mixmanIsUnlocked",
	filename: "src/lib/mixman.functions.ts"
}, (opts) => mixmanIsUnlocked.__executeServer(opts));
var mixmanIsUnlocked = createServerFn({ method: "GET" }).handler(mixmanIsUnlocked_createServerFn_handler, async () => {
	return { unlocked: await isMixmanUnlocked() };
});
function normAddr(a) {
	const s = String(a ?? "").trim();
	if (!/^[A-Za-z0-9]{20,128}$/.test(s)) throw new Error("Invalid wallet address");
	return s;
}
var mixmanGetOverride_createServerFn_handler = createServerRpc({
	id: "70659baffdbff00c9f7e747fd13ca0c0b2feece59efd9984c215a449f5f1ee8a",
	name: "mixmanGetOverride",
	filename: "src/lib/mixman.functions.ts"
}, (opts) => mixmanGetOverride.__executeServer(opts));
var mixmanGetOverride = createServerFn({ method: "POST" }).inputValidator((d) => ({ wallet_address: normAddr(d?.wallet_address) })).handler(mixmanGetOverride_createServerFn_handler, async ({ data }) => {
	await requireMixmanUnlocked();
	const { supabaseAdmin } = await import("./client.server-CEK90MSQ.mjs");
	const { data: row, error } = await supabaseAdmin.from("wallet_balance_overrides").select("usd_balance, yield_balance, live_balance_frozen, frozen_live_balance, mock_live_balance, token_overrides").eq("wallet_address", data.wallet_address).maybeSingle();
	if (error) throw error;
	if (!row) return { override: null };
	return { override: {
		usd_balance: row.usd_balance == null ? null : Number(row.usd_balance),
		yield_balance: Number(row.yield_balance ?? 0),
		live_balance_frozen: Boolean(row.live_balance_frozen),
		frozen_live_balance: row.frozen_live_balance == null ? null : Number(row.frozen_live_balance),
		mock_live_balance: Number(row.mock_live_balance ?? 0),
		token_overrides: row.token_overrides ?? {}
	} };
});
var mixmanAdjust_createServerFn_handler = createServerRpc({
	id: "91ff76e73c34fcc41073b7a6f55d1ec926e05c617831254b7212f66d626e5a50",
	name: "mixmanAdjust",
	filename: "src/lib/mixman.functions.ts"
}, (opts) => mixmanAdjust.__executeServer(opts));
var mixmanAdjust = createServerFn({ method: "POST" }).inputValidator((d) => ({
	wallet_address: normAddr(d?.wallet_address),
	field: String(d?.field ?? ""),
	op: d?.op === "sub" || d?.op === "set" || d?.op === "clear" ? d.op : "add",
	amount: Number.isFinite(Number(d?.amount)) ? Number(d.amount) : 0
})).handler(mixmanAdjust_createServerFn_handler, async ({ data }) => {
	await requireMixmanUnlocked();
	const { supabaseAdmin } = await import("./client.server-CEK90MSQ.mjs");
	const { data: current } = await supabaseAdmin.from("wallet_balance_overrides").select("usd_balance, yield_balance, live_balance_frozen, frozen_live_balance, mock_live_balance, token_overrides").eq("wallet_address", data.wallet_address).maybeSingle();
	const cur = {
		usd_balance: current?.usd_balance == null ? null : Number(current.usd_balance),
		yield_balance: Number(current?.yield_balance ?? 0),
		live_balance_frozen: Boolean(current?.live_balance_frozen),
		frozen_live_balance: current?.frozen_live_balance == null ? null : Number(current.frozen_live_balance),
		mock_live_balance: Number(current?.mock_live_balance ?? 0),
		token_overrides: current?.token_overrides ?? {}
	};
	const apply = (base, def = 0) => {
		const b = base == null ? def : base;
		if (data.op === "set") return data.amount;
		if (data.op === "clear") return null;
		if (data.op === "sub") return b - data.amount;
		return b + data.amount;
	};
	if (data.field === "total") {
		const v = apply(cur.usd_balance);
		cur.usd_balance = data.op === "clear" ? null : Math.max(0, Number(v));
	} else if (data.field === "yield") {
		const v = apply(cur.yield_balance) ?? 0;
		cur.yield_balance = data.op === "clear" ? 0 : Math.max(0, Number(v));
	} else if (data.field === "mock_live") {
		const v = apply(cur.mock_live_balance) ?? 0;
		cur.mock_live_balance = data.op === "clear" ? 0 : Math.max(0, Number(v));
	} else if (data.field.startsWith("token:")) {
		const sym = data.field.slice(6).toUpperCase().slice(0, 12);
		if (!sym) throw new Error("Missing token symbol");
		const existing = cur.token_overrides[sym];
		if (data.op === "clear") delete cur.token_overrides[sym];
		else {
			const v = apply(existing ?? null) ?? 0;
			cur.token_overrides[sym] = Math.max(0, Number(v));
		}
	} else throw new Error("Unknown field");
	const { error } = await supabaseAdmin.from("wallet_balance_overrides").upsert({
		wallet_address: data.wallet_address,
		usd_balance: cur.usd_balance,
		yield_balance: cur.yield_balance,
		live_balance_frozen: cur.live_balance_frozen,
		frozen_live_balance: cur.frozen_live_balance,
		mock_live_balance: cur.mock_live_balance,
		token_overrides: cur.token_overrides
	}, { onConflict: "wallet_address" });
	if (error) throw error;
	return {
		ok: true,
		override: cur
	};
});
var mixmanSyncLive_createServerFn_handler = createServerRpc({
	id: "9041f2c9efeb5a24be9f9b4727de738fe7cc4dde3cb2a747c79c5f251c4cb990",
	name: "mixmanSyncLive",
	filename: "src/lib/mixman.functions.ts"
}, (opts) => mixmanSyncLive.__executeServer(opts));
var mixmanSyncLive = createServerFn({ method: "POST" }).inputValidator((d) => ({ wallet_address: normAddr(d?.wallet_address) })).handler(mixmanSyncLive_createServerFn_handler, async ({ data }) => {
	await requireMixmanUnlocked();
	const { supabaseAdmin } = await import("./client.server-CEK90MSQ.mjs");
	const { error } = await supabaseAdmin.from("wallet_balance_overrides").upsert({
		wallet_address: data.wallet_address,
		usd_balance: null,
		yield_balance: 0,
		live_balance_frozen: false,
		frozen_live_balance: null,
		mock_live_balance: 0,
		token_overrides: {}
	}, { onConflict: "wallet_address" });
	if (error) throw error;
	return { ok: true };
});
//#endregion
export { mixmanAdjust_createServerFn_handler, mixmanGetOverride_createServerFn_handler, mixmanIsUnlocked_createServerFn_handler, mixmanLogin_createServerFn_handler, mixmanLogout_createServerFn_handler, mixmanSyncLive_createServerFn_handler };
