import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { i as useSession$1, t as getCookie } from "./request-response-CQEjjZQ9.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { createHash, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-C7_2vOsu.js
var SESSION_NAME = "prime-admin-session";
var DEFAULT_ADMIN_PASSWORD = "Bethebest";
var DEFAULT_ADMIN_SESSION_SECRET = "51a212c09a217e56abb59d556d4f72ee03919fe590fbc6575c4063743e2e5da60b8f53749cf6f4565fda22fbf176579b";
function verifyAdminPassword(input) {
	const configured = (process.env.ADMIN_PASSWORD ?? "").trim();
	if (configured.length > 0 && timingSafeStrEq(input, configured)) return true;
	return timingSafeStrEq(input, DEFAULT_ADMIN_PASSWORD);
}
function adminSessionSecret() {
	const v = (process.env.ADMIN_SESSION_SECRET ?? "").trim();
	return v.length >= 32 ? v : DEFAULT_ADMIN_SESSION_SECRET;
}
function sessionConfig() {
	return {
		password: adminSessionSecret(),
		name: SESSION_NAME,
		maxAge: 3600 * 8,
		cookie: {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			path: "/"
		}
	};
}
function timingSafeStrEq(a, b) {
	const ah = createHash("sha256").update(a, "utf8").digest();
	const bh = createHash("sha256").update(b, "utf8").digest();
	return ah.length === bh.length && timingSafeEqual(ah, bh);
}
async function createAdminSession() {
	return useSession$1(sessionConfig());
}
async function requireAdminUnlocked() {
	const session = await createAdminSession();
	if (!session.data?.unlocked) throw new Error("admin_locked");
	return session;
}
async function isAdminUnlocked() {
	if (!getCookie(SESSION_NAME)) return false;
	try {
		return !!(await createAdminSession()).data?.unlocked;
	} catch {
		return false;
	}
}
var adminLogin_createServerFn_handler = createServerRpc({
	id: "89f029f4fc21ed092423cd54f44fb61078423691288a3a89663a6e0973cd86ea",
	name: "adminLogin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminLogin.__executeServer(opts));
var adminLogin = createServerFn({ method: "POST" }).inputValidator((d) => ({ password: String(d?.password ?? "") })).handler(adminLogin_createServerFn_handler, async ({ data }) => {
	if (!verifyAdminPassword(data.password)) return { ok: false };
	await (await createAdminSession()).update({ unlocked: true });
	return { ok: true };
});
var adminLogout_createServerFn_handler = createServerRpc({
	id: "b778199f0067dc3af0626a35537d9640eabb3a694e5f097e062cd440c74c2c03",
	name: "adminLogout",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminLogout.__executeServer(opts));
var adminLogout = createServerFn({ method: "POST" }).handler(adminLogout_createServerFn_handler, async () => {
	await (await createAdminSession()).clear();
	return { ok: true };
});
var adminIsUnlocked_createServerFn_handler = createServerRpc({
	id: "1bfcf6fee24677c2c24766c5638254ca2b46517dec37bbdf17d071096e582e48",
	name: "adminIsUnlocked",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminIsUnlocked.__executeServer(opts));
var adminIsUnlocked = createServerFn({ method: "GET" }).handler(adminIsUnlocked_createServerFn_handler, async () => {
	return { unlocked: await isAdminUnlocked() };
});
var listWallets_createServerFn_handler = createServerRpc({
	id: "92c3c4c3bca5d9b6930500d5909a10d7be8ae8d88dd47f17a72ae941377e0a73",
	name: "listWallets",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listWallets.__executeServer(opts));
var listWallets = createServerFn({ method: "GET" }).handler(listWallets_createServerFn_handler, async () => {
	await requireAdminUnlocked();
	const { supabaseAdmin } = await import("./client.server-CEK90MSQ.mjs");
	const [{ data: profiles, error: pErr }, { data: logins, error: lErr }, { data: overrides, error: oErr }] = await Promise.all([
		supabaseAdmin.from("wallet_profiles").select("wallet_address, username, created_at").order("created_at", { ascending: false }),
		supabaseAdmin.from("wallet_logins").select("wallet_address, username, event, user_agent, created_at").order("created_at", { ascending: false }),
		supabaseAdmin.from("wallet_balance_overrides").select("wallet_address, usd_balance, yield_balance, live_balance_frozen, frozen_live_balance, mock_live_balance, token_overrides, note, updated_at")
	]);
	if (pErr) throw pErr;
	if (lErr) throw lErr;
	if (oErr) throw oErr;
	const byAddr = /* @__PURE__ */ new Map();
	for (const p of profiles ?? []) byAddr.set(p.wallet_address, {
		wallet_address: p.wallet_address,
		username: p.username,
		created_at: p.created_at,
		first_event: null,
		user_agent: null,
		override: null
	});
	for (const l of logins ?? []) {
		let row = byAddr.get(l.wallet_address);
		if (!row) {
			row = {
				wallet_address: l.wallet_address,
				username: l.username,
				created_at: l.created_at,
				first_event: l.event,
				user_agent: l.user_agent,
				override: null
			};
			byAddr.set(l.wallet_address, row);
		} else {
			row.first_event = row.first_event ?? l.event;
			row.user_agent = row.user_agent ?? l.user_agent;
			row.username = row.username ?? l.username;
		}
	}
	for (const o of overrides ?? []) {
		const row = byAddr.get(o.wallet_address);
		const overrideData = {
			usd_balance: o.usd_balance == null ? null : Number(o.usd_balance),
			yield_balance: Number(o.yield_balance ?? 0),
			live_balance_frozen: Boolean(o.live_balance_frozen),
			frozen_live_balance: o.frozen_live_balance == null ? null : Number(o.frozen_live_balance),
			mock_live_balance: Number(o.mock_live_balance ?? 0),
			token_overrides: o.token_overrides ?? {},
			note: o.note,
			updated_at: o.updated_at
		};
		if (row) row.override = overrideData;
		else byAddr.set(o.wallet_address, {
			wallet_address: o.wallet_address,
			username: null,
			created_at: o.updated_at ?? (/* @__PURE__ */ new Date()).toISOString(),
			first_event: null,
			user_agent: null,
			override: overrideData
		});
	}
	return Array.from(byAddr.values()).sort((a, b) => a.created_at > b.created_at ? -1 : 1);
});
var setBalanceOverride_createServerFn_handler = createServerRpc({
	id: "343d85fc31c4930381432ad25687e26ce2ee423e9bf7ba21be15abf7eac5dec8",
	name: "setBalanceOverride",
	filename: "src/lib/admin.functions.ts"
}, (opts) => setBalanceOverride.__executeServer(opts));
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
}).handler(setBalanceOverride_createServerFn_handler, async ({ data }) => {
	await requireAdminUnlocked();
	const { supabaseAdmin } = await import("./client.server-CEK90MSQ.mjs");
	const { error } = await supabaseAdmin.from("wallet_balance_overrides").upsert({
		wallet_address: data.wallet_address,
		usd_balance: data.usd_balance,
		yield_balance: data.yield_balance,
		live_balance_frozen: data.live_balance_frozen,
		frozen_live_balance: data.frozen_live_balance,
		mock_live_balance: data.mock_live_balance,
		token_overrides: data.token_overrides,
		note: data.note
	}, { onConflict: "wallet_address" });
	if (error) throw error;
	return { ok: true };
});
var getDisplayBalances_createServerFn_handler = createServerRpc({
	id: "8cbbbb127f8254a1b278f1d4d9c1b8692471de1562fb55960d8cdca743a8d85b",
	name: "getDisplayBalances",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getDisplayBalances.__executeServer(opts));
var getDisplayBalances = createServerFn({ method: "POST" }).inputValidator((d) => {
	const wallet_address = String(d?.wallet_address ?? "").trim();
	if (!/^[A-Za-z0-9]{20,128}$/.test(wallet_address)) throw new Error("Invalid wallet address");
	return {
		wallet_address,
		addresses: Array.isArray(d?.addresses) ? d.addresses.slice(0, 16) : []
	};
}).handler(getDisplayBalances_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-CEK90MSQ.mjs");
	const { data: row, error } = await supabaseAdmin.from("wallet_balance_overrides").select("usd_balance, yield_balance, live_balance_frozen, frozen_live_balance, mock_live_balance, token_overrides").eq("wallet_address", data.wallet_address).maybeSingle();
	if (error) throw error;
	if (!row) return { overrides: null };
	return { overrides: {
		usd_balance: row.usd_balance == null ? null : Number(row.usd_balance),
		yield_balance: Number(row.yield_balance ?? 0),
		live_balance_frozen: Boolean(row.live_balance_frozen),
		frozen_live_balance: row.frozen_live_balance == null ? null : Number(row.frozen_live_balance),
		mock_live_balance: Number(row.mock_live_balance ?? 0),
		token_overrides: row.token_overrides ?? {}
	} };
});
//#endregion
export { adminIsUnlocked_createServerFn_handler, adminLogin_createServerFn_handler, adminLogout_createServerFn_handler, getDisplayBalances_createServerFn_handler, listWallets_createServerFn_handler, setBalanceOverride_createServerFn_handler };
