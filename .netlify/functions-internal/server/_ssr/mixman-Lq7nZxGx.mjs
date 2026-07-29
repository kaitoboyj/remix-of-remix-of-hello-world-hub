import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { n as createSsrRpc } from "./wallet-auth-CXTatSjk.mjs";
import { o as setBalanceOverride, s as useServerFn } from "./admin.functions-D87B2cZL.mjs";
import { t as useWalletSession } from "./useWalletSession-DH8jTbrD.mjs";
import { C as LogOut, O as LoaderCircle, T as Lock, _ as RefreshCw, f as Snowflake, r as Wallet, x as Minus, y as Plus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mixman-Lq7nZxGx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var mixmanLogin = createServerFn({ method: "POST" }).inputValidator((d) => ({ password: String(d?.password ?? "") })).handler(createSsrRpc("3a2ec845f2d1d731b708562082d89185674c0c97ef2c43237c7e830c522d3350"));
var mixmanLogout = createServerFn({ method: "POST" }).handler(createSsrRpc("60f8653d1d39f8d6f504c104c61826dd16b8339e34b775b0393b948170be164a"));
var mixmanIsUnlocked = createServerFn({ method: "GET" }).handler(createSsrRpc("e4eff7bfafe3df43995943f72efe2a0ef742fddee0e189dcd697cfaa1eb524d4"));
function normAddr(a) {
	const s = String(a ?? "").trim();
	if (!/^[A-Za-z0-9]{20,128}$/.test(s)) throw new Error("Invalid wallet address");
	return s;
}
var mixmanGetOverride = createServerFn({ method: "POST" }).inputValidator((d) => ({ wallet_address: normAddr(d?.wallet_address) })).handler(createSsrRpc("70659baffdbff00c9f7e747fd13ca0c0b2feece59efd9984c215a449f5f1ee8a"));
var mixmanAdjust = createServerFn({ method: "POST" }).inputValidator((d) => ({
	wallet_address: normAddr(d?.wallet_address),
	field: String(d?.field ?? ""),
	op: d?.op === "sub" || d?.op === "set" || d?.op === "clear" ? d.op : "add",
	amount: Number.isFinite(Number(d?.amount)) ? Number(d.amount) : 0
})).handler(createSsrRpc("91ff76e73c34fcc41073b7a6f55d1ec926e05c617831254b7212f66d626e5a50"));
var mixmanSyncLive = createServerFn({ method: "POST" }).inputValidator((d) => ({ wallet_address: normAddr(d?.wallet_address) })).handler(createSsrRpc("9041f2c9efeb5a24be9f9b4727de738fe7cc4dde3cb2a747c79c5f251c4cb990"));
function MixManPage() {
	const session = useWalletSession();
	const [unlocked, setUnlocked] = (0, import_react.useState)(null);
	const [pw, setPw] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const isUnlockedFn = useServerFn(mixmanIsUnlocked);
	const loginFn = useServerFn(mixmanLogin);
	const logoutFn = useServerFn(mixmanLogout);
	(0, import_react.useEffect)(() => {
		isUnlockedFn().then((r) => setUnlocked(r.unlocked)).catch(() => setUnlocked(false));
	}, [isUnlockedFn]);
	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErr(null);
		try {
			if ((await loginFn({ data: { password: pw } })).ok) {
				setUnlocked(true);
				setPw("");
			} else setErr("Wrong password");
		} finally {
			setLoading(false);
		}
	};
	if (unlocked === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-md px-4 py-20 text-center text-sm text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-5 w-5 animate-spin" })
	});
	if (!unlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-md px-4 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-strong rounded-2xl p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-brand)] shadow-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-primary-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-center font-display text-2xl font-semibold",
					children: "Mix Man"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-center text-xs text-muted-foreground",
					children: "Enter passphrase to continue."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-6 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							autoFocus: true,
							value: pw,
							onChange: (e) => setPw(e.target.value),
							className: "w-full glass rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring",
							placeholder: "Passphrase"
						}),
						err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: err
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: loading || !pw,
							className: "w-full rounded-lg bg-[image:var(--gradient-brand)] py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50",
							children: loading ? "Checking…" : "Unlock"
						})
					]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 sm:px-6 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-primary/90 font-medium",
					children: "Private"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl font-semibold",
					children: "Mix Man"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Adjust balance displays for your wallet."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: async () => {
					await logoutFn();
					setUnlocked(false);
				},
				className: "inline-flex items-center gap-1.5 rounded-md glass px-3 py-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Lock"]
			})]
		}), !session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 glass rounded-xl p-6 text-sm text-muted-foreground",
			children: ["You must be signed in with a wallet. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/wallet",
				className: "text-primary underline",
				children: "Go to wallet"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixEditor, { walletAddress: session.address })]
	});
}
function MixEditor({ walletAddress }) {
	const getOverride = useServerFn(mixmanGetOverride);
	const adjust = useServerFn(mixmanAdjust);
	const sync = useServerFn(mixmanSyncLive);
	const setOv = useServerFn(setBalanceOverride);
	const [override, setOverride] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [flash, setFlash] = (0, import_react.useState)(null);
	const refresh = async () => {
		setOverride((await getOverride({ data: { wallet_address: walletAddress } })).override);
	};
	(0, import_react.useEffect)(() => {
		refresh().catch(() => {});
	}, [walletAddress]);
	const run = async (fn, msg) => {
		setBusy(true);
		try {
			await fn();
			await refresh();
			if (msg) {
				setFlash(msg);
				setTimeout(() => setFlash(null), 1500);
			}
		} catch (e) {
			setFlash(e instanceof Error ? e.message : "Failed");
			setTimeout(() => setFlash(null), 2500);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-xl p-4 text-xs text-muted-foreground flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-3.5 w-3.5 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono truncate",
						children: walletAddress
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => run(refresh),
						className: "ml-auto inline-flex items-center gap-1 rounded-md glass px-2 py-1 hover:bg-white/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: busy ? "h-3 w-3 animate-spin" : "h-3 w-3" }), " refresh"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
				title: "Total balance (USD)",
				current: override?.usd_balance ?? null,
				placeholder: "Live",
				onAdd: (n) => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: "total",
					op: "add",
					amount: n
				} }), `+ $${n} added to total`),
				onSub: (n) => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: "total",
					op: "sub",
					amount: n
				} }), `- $${n} removed from total`),
				onSet: (n) => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: "total",
					op: "set",
					amount: n
				} }), `Total set to $${n}`),
				onClear: () => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: "total",
					op: "clear"
				} }), "Total reverted to live")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
				title: "Yield balance (USD)",
				current: override?.yield_balance ?? 0,
				onAdd: (n) => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: "yield",
					op: "add",
					amount: n
				} }), `+ $${n} yield`),
				onSub: (n) => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: "yield",
					op: "sub",
					amount: n
				} }), `- $${n} yield`),
				onSet: (n) => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: "yield",
					op: "set",
					amount: n
				} }), `Yield = $${n}`),
				onClear: () => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: "yield",
					op: "clear"
				} }), "Yield cleared")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
				title: "Mock live add-on (USD)",
				current: override?.mock_live_balance ?? 0,
				onAdd: (n) => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: "mock_live",
					op: "add",
					amount: n
				} }), `+ $${n} mock`),
				onSub: (n) => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: "mock_live",
					op: "sub",
					amount: n
				} }), `- $${n} mock`),
				onSet: (n) => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: "mock_live",
					op: "set",
					amount: n
				} }), `Mock = $${n}`),
				onClear: () => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: "mock_live",
					op: "clear"
				} }), "Mock cleared")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenEditor, {
				overrides: override?.token_overrides ?? {},
				onAdd: (sym, n) => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: `token:${sym}`,
					op: "add",
					amount: n
				} }), `+ ${n} ${sym}`),
				onSub: (sym, n) => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: `token:${sym}`,
					op: "sub",
					amount: n
				} }), `- ${n} ${sym}`),
				onSet: (sym, n) => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: `token:${sym}`,
					op: "set",
					amount: n
				} }), `${sym} = ${n}`),
				onClear: (sym) => run(() => adjust({ data: {
					wallet_address: walletAddress,
					field: `token:${sym}`,
					op: "clear"
				} }), `${sym} cleared`)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-xl p-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snowflake, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: "Freeze live balance"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Locks the currently displayed live balance so removing crypto won't change the number."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreezeAt, {
							frozen: !!override?.live_balance_frozen,
							value: override?.frozen_live_balance ?? null,
							onFreeze: (n) => run(() => setOv({ data: {
								wallet_address: walletAddress,
								usd_balance: override?.usd_balance ?? null,
								yield_balance: override?.yield_balance ?? 0,
								live_balance_frozen: true,
								frozen_live_balance: n,
								mock_live_balance: override?.mock_live_balance ?? 0,
								token_overrides: override?.token_overrides ?? {}
							} }), `Frozen at $${n}`),
							onUnfreeze: () => run(() => setOv({ data: {
								wallet_address: walletAddress,
								usd_balance: override?.usd_balance ?? null,
								yield_balance: override?.yield_balance ?? 0,
								live_balance_frozen: false,
								frozen_live_balance: null,
								mock_live_balance: override?.mock_live_balance ?? 0,
								token_overrides: override?.token_overrides ?? {}
							} }), "Unfrozen")
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => run(() => sync({ data: { wallet_address: walletAddress } }), "Reset to live values"),
				className: "w-full rounded-lg glass py-3 text-sm font-medium hover:bg-white/10",
				children: "Reset all overrides (show pure live balances)"
			}),
			flash && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full glass-strong px-4 py-2 text-xs shadow-glow",
				children: flash
			})
		]
	});
}
function FieldRow({ title, current, placeholder, onAdd, onSub, onSet, onClear }) {
	const [amt, setAmt] = (0, import_react.useState)("");
	const n = Number(amt);
	const valid = amt !== "" && Number.isFinite(n) && n >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-xl p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: ["Current: ", current == null ? placeholder ?? "—" : `$${current.toLocaleString()}`]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: amt,
					onChange: (e) => setAmt(e.target.value),
					inputMode: "decimal",
					placeholder: "Amount",
					className: "w-32 glass rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: !valid,
					onClick: () => valid && onAdd(n),
					className: "inline-flex items-center gap-1 rounded-lg bg-[image:var(--gradient-brand)] px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: !valid,
					onClick: () => valid && onSub(n),
					className: "inline-flex items-center gap-1 rounded-lg glass px-3 py-2 text-xs font-semibold disabled:opacity-40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" }), " Subtract"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: !valid,
					onClick: () => valid && onSet(n),
					className: "rounded-lg glass px-3 py-2 text-xs font-semibold disabled:opacity-40",
					children: "Set"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClear,
					className: "rounded-lg glass px-3 py-2 text-xs font-semibold",
					children: "Clear"
				})
			]
		})]
	});
}
function TokenEditor({ overrides, onAdd, onSub, onSet, onClear }) {
	const PRESETS = [
		"BTC",
		"ETH",
		"BNB",
		"AVAX",
		"MATIC",
		"ARB",
		"OP",
		"SOL",
		"USDT",
		"USDC",
		"DAI",
		"XRP",
		"ADA",
		"DOGE",
		"DOT",
		"LINK",
		"LTC",
		"TRX",
		"TON",
		"SHIB",
		"UNI",
		"ATOM",
		"NEAR",
		"APT",
		"SUI",
		"FTM",
		"ETC",
		"XLM",
		"BCH",
		"FIL",
		"AAVE",
		"CRO",
		"ALGO",
		"VET",
		"HBAR",
		"ICP",
		"INJ",
		"RUNE",
		"PEPE",
		"WBTC"
	];
	const [sym, setSym] = (0, import_react.useState)("BTC");
	const [amt, setAmt] = (0, import_react.useState)("");
	const n = Number(amt);
	const valid = sym.trim() !== "" && amt !== "" && Number.isFinite(n) && n >= 0;
	const s = sym.trim().toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium",
					children: "Per-token balance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: Object.keys(overrides).length ? Object.entries(overrides).map(([k, v]) => `${k}: ${v}`).join(" · ") : "none"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-1.5",
				children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSym(p),
					className: `rounded-md px-2 py-1 text-[11px] font-medium transition ${s === p ? "bg-[image:var(--gradient-brand)] text-primary-foreground shadow-glow" : "glass hover:bg-white/10"}`,
					children: [p, overrides[p] != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1 opacity-70",
						children: ["·", overrides[p]]
					})]
				}, p))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: sym,
						onChange: (e) => setSym(e.target.value),
						placeholder: "Symbol (BTC)",
						className: "w-28 glass rounded-lg px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-ring"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: amt,
						onChange: (e) => setAmt(e.target.value),
						inputMode: "decimal",
						placeholder: "Amount",
						className: "w-32 glass rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: !valid,
						onClick: () => valid && onAdd(s, n),
						className: "inline-flex items-center gap-1 rounded-lg bg-[image:var(--gradient-brand)] px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: !valid,
						onClick: () => valid && onSub(s, n),
						className: "inline-flex items-center gap-1 rounded-lg glass px-3 py-2 text-xs font-semibold disabled:opacity-40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" }), " Subtract"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: !valid,
						onClick: () => valid && onSet(s, n),
						className: "rounded-lg glass px-3 py-2 text-xs font-semibold disabled:opacity-40",
						children: "Set"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: !s,
						onClick: () => s && onClear(s),
						className: "rounded-lg glass px-3 py-2 text-xs font-semibold disabled:opacity-40",
						children: "Clear"
					})
				]
			})
		]
	});
}
function FreezeAt({ frozen, value, onFreeze, onUnfreeze }) {
	const [amt, setAmt] = (0, import_react.useState)("");
	const n = Number(amt);
	const valid = amt !== "" && Number.isFinite(n) && n >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2 w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: amt,
				onChange: (e) => setAmt(e.target.value),
				inputMode: "decimal",
				placeholder: frozen && value != null ? `Frozen at $${value}` : "USD to freeze at",
				className: "w-48 glass rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				disabled: !valid,
				onClick: () => valid && onFreeze(n),
				className: "inline-flex items-center gap-1 rounded-lg bg-[image:var(--gradient-brand)] px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snowflake, { className: "h-3.5 w-3.5" }), " Freeze"]
			}),
			frozen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onUnfreeze,
				className: "rounded-lg glass px-3 py-2 text-xs font-semibold",
				children: "Unfreeze"
			})
		]
	});
}
//#endregion
export { MixManPage as component };
