import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getDisplayBalances, s as useServerFn } from "./admin.functions-D87B2cZL.mjs";
import { t as useWalletSession } from "./useWalletSession-DH8jTbrD.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { F as ChartColumn, I as ArrowUpRight, T as Lock, d as Sparkles, g as Rocket, i as WalletMinimal, p as ShieldCheck, t as Zap } from "../_libs/lucide-react.mjs";
import { t as CopyButton } from "./CopyButton-3o43l5K1.mjs";
import { t as fetchBalance } from "./balances-kngrFgmy.mjs";
import { i as marketsQuery, n as formatPct, r as formatUSD, t as formatCompact } from "./prices-DslsRjmR.mjs";
import { t as Sparkline } from "./Sparkline-Dhf2zOLz.mjs";
import { t as useYieldDisplay } from "./useYieldDisplay-CiBDnOTQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DxsxBEb7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MarketTicker() {
	const { data } = useQuery(marketsQuery(20));
	const coins = data ?? [];
	if (coins.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden border-y border-white/5 bg-black/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-ticker flex gap-8 whitespace-nowrap py-2.5",
				children: [...coins, ...coins].map((c, i) => {
					const up = (c.price_change_percentage_24h ?? 0) >= 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.image,
								alt: "",
								className: "h-4 w-4 rounded-full"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: c.symbol.toUpperCase()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: formatUSD(c.current_price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("font-mono text-xs", up ? "text-success" : "text-destructive"),
								children: formatPct(c.price_change_percentage_24h)
							})
						]
					}, `${c.id}-${i}`);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" })
		]
	});
}
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketTicker, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeWalletBalances, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureGrid, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsBand, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTASection, {})
	] });
}
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
function HomeWalletBalances() {
	const session = useWalletSession();
	const addresses = session?.wallet?.addresses ?? [];
	const walletKey = session?.address ?? "";
	const { data: markets } = useQuery(marketsQuery(100));
	const getDisplay = useServerFn(getDisplayBalances);
	const [balances, setBalances] = (0, import_react.useState)({});
	const [display, setDisplay] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (addresses.length === 0) return;
		let cancelled = false;
		setBalances(Object.fromEntries(addresses.map((a) => [a.chain, "loading"])));
		addresses.forEach((a) => {
			fetchBalance(a.chain, a.address, walletKey).then((balance) => {
				if (!cancelled) setBalances((prev) => ({
					...prev,
					[a.chain]: balance
				}));
			});
		});
		return () => {
			cancelled = true;
		};
	}, [addresses, walletKey]);
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
	const rows = addresses.map((address) => {
		const balance = balances[address.chain];
		const amount = balance && balance !== "loading" ? balance.amount : null;
		const symbol = balance && balance !== "loading" ? balance.symbol : address.chain.replace("BTC_LEGACY", "BTC");
		const price = priceBySymbol.get(PRICE_SYMBOL[address.chain] ?? symbol.toLowerCase()) ?? 0;
		return {
			address,
			amount,
			symbol,
			usd: amount == null ? null : amount * price,
			loading: balance === "loading" || balance === void 0
		};
	});
	const realTotal = rows.reduce((sum, row) => sum + (row.usd ?? 0), 0);
	const initialBalance = display?.live_balance_frozen && display.frozen_live_balance != null ? display.frozen_live_balance : realTotal + (display?.mock_live_balance ?? 0);
	const animatedYield = useYieldDisplay(display?.yield_balance ?? 0);
	const total = initialBalance + animatedYield.value;
	if (!session?.wallet || addresses.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-strong rounded-2xl p-5 md:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 md:flex-row md:items-end md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-primary/90 font-medium",
						children: "Total balance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-3xl font-semibold",
						children: formatUSD(total, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							session.wallet.label,
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: session.username
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-3 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceStat, {
							title: "Initial balance",
							value: initialBalance,
							caption: display?.live_balance_frozen ? "Frozen display" : ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceStat, {
							title: "Yield",
							value: animatedYield.value,
							caption: `${animatedYield.pct >= 0 ? "+" : ""}${animatedYield.pct.toFixed(2)}%`,
							tone: animatedYield.pct >= 0 ? "up" : "down",
							totalPct: initialBalance > 0 ? animatedYield.value / initialBalance * 100 : 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceStat, {
							title: "Combined total",
							value: total,
							caption: "Initial + yield"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-xl p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: row.address.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-widest text-muted-foreground",
									children: row.symbol
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-sm text-right",
									children: row.loading ? "Loading" : `${(row.amount ?? 0).toFixed(6)}`
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-mono text-[11px] text-muted-foreground flex-1",
									children: row.address.address
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
									value: row.address.address,
									label: ""
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: row.usd == null ? "$—" : formatUSD(row.usd, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})
							})
						]
					}, row.address.chain))
				})
			]
		})
	});
}
function BalanceStat({ title, value, caption, tone, totalPct }) {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex items-center gap-2 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-xs text-muted-foreground", tone === "up" && "text-success", tone === "down" && "text-destructive"),
					children: caption
				}), totalPct !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("text-[10px] font-mono rounded px-1.5 py-0.5", totalPct >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"),
					children: [
						"Total ",
						totalPct >= 0 ? "+" : "",
						totalPct.toFixed(2),
						"%"
					]
				})]
			})
		]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 -z-10",
				style: { backgroundImage: "var(--gradient-hero)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 grid-bg opacity-60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative flex h-1.5 w-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full rounded-full bg-success animate-pulse-dot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-1.5 w-1.5 rounded-full bg-success" })]
							}), "Live markets · Real-time BIP39 wallets"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-6 font-display text-5xl md:text-7xl font-semibold leading-[1.02] tracking-tight",
							children: [
								"Trade crypto like a",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: "professional."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Custody it like a paranoid."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-6 max-w-xl text-lg text-muted-foreground",
							children: "PrimeCapital combines an institutional trading terminal with a browser-native HD wallet. Real prices. Real keys. No middleman."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col sm:flex-row gap-3 justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/trade",
								className: "inline-flex items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition",
								children: ["Launch Terminal ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/wallet",
								className: "inline-flex items-center justify-center gap-2 rounded-lg glass-strong px-6 py-3 text-sm font-semibold hover:bg-white/10 transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletMinimal, { className: "h-4 w-4" }), " Create a Wallet"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-muted-foreground",
							children: "BIP39 · BIP32 · BIP44 · BIP84 · AES-encrypted local storage"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroPreview, {})]
			})
		]
	});
}
function HeroPreview() {
	const { data } = useQuery(marketsQuery(5));
	const coins = data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto mt-16 max-w-5xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-x-20 -top-10 h-64 bg-[image:var(--gradient-brand)] opacity-20 blur-3xl -z-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-strong rounded-2xl p-4 md:p-6 shadow-elev",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-2 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-destructive/70" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-warning/70" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-success/70" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-3 text-xs text-muted-foreground font-mono",
						children: "prime.terminal / BTC-USDT"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden sm:flex gap-1 text-xs text-muted-foreground",
					children: [
						"1m",
						"5m",
						"15m",
						"1H",
						"4H",
						"1D"
					].map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("rounded px-2 py-1", i === 3 && "bg-white/10 text-foreground"),
						children: t
					}, t))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-[1fr_260px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl bg-black/40 p-4 h-72 md:h-80 relative overflow-hidden border border-white/5",
					children: coins[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex flex-col p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-widest text-muted-foreground",
									children: "BTC / USDT"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-display text-4xl font-semibold",
									children: formatUSD(coins[0].current_price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: cn("mt-1 text-sm font-mono", coins[0].price_change_percentage_24h >= 0 ? "text-success" : "text-destructive"),
									children: [formatPct(coins[0].price_change_percentage_24h), " · 24h"]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right text-xs text-muted-foreground space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Vol · ", formatCompact(coins[0].total_volume)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Cap · ", formatCompact(coins[0].market_cap)] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-auto -mx-5 -mb-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
								data: coins[0].sparkline_in_7d?.price ?? [],
								up: coins[0].price_change_percentage_24h >= 0,
								width: 800,
								height: 140,
								className: "w-full h-36"
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl bg-black/30 border border-white/5 divide-y divide-white/5",
					children: coins.slice(0, 5).map((c) => {
						const up = c.price_change_percentage_24h >= 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 px-3 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: c.image,
									alt: "",
									className: "h-6 w-6 rounded-full"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium truncate",
										children: c.symbol.toUpperCase()
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground truncate",
										children: c.name
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-mono",
										children: formatUSD(c.current_price)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cn("text-xs font-mono", up ? "text-success" : "text-destructive"),
										children: formatPct(c.price_change_percentage_24h)
									})]
								})
							]
						}, c.id);
					})
				})]
			})]
		})]
	});
}
function TrendingSection() {
	const { data, isLoading } = useQuery(marketsQuery(8));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-widest text-primary/90 font-medium",
				children: "Live Markets"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-3xl md:text-4xl font-semibold",
				children: "Trending right now"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/markets",
				className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1",
				children: ["All markets ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: (isLoading ? Array.from({ length: 8 }) : data ?? []).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingCard, { coin: c }, c?.id ?? i))
		})]
	});
}
function TrendingCard({ coin }) {
	if (!coin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "glass rounded-xl h-40 animate-pulse" });
	const up = coin.price_change_percentage_24h >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/trade",
		className: "group glass rounded-xl p-4 hover:bg-white/[.06] transition-all hover:-translate-y-0.5 relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: coin.image,
					alt: "",
					className: "h-8 w-8 rounded-full"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: coin.symbol.toUpperCase()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: coin.name
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl font-semibold",
					children: formatUSD(coin.current_price)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-xs font-mono px-1.5 py-0.5 rounded", up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"),
					children: formatPct(coin.price_change_percentage_24h)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 -mx-4 -mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
					data: coin.sparkline_in_7d?.price ?? [],
					up,
					width: 280,
					height: 56,
					className: "w-full h-14"
				})
			})
		]
	});
}
var FEATURES = [
	{
		icon: ChartColumn,
		title: "Pro trading terminal",
		body: "Full TradingView charts, 50+ indicators, drawing tools, and multiple timeframes."
	},
	{
		icon: WalletMinimal,
		title: "Browser-native HD wallets",
		body: "BIP39 mnemonics, BIP32/44/84 derivation for BTC, ETH, and every EVM chain."
	},
	{
		icon: Lock,
		title: "Non-custodial by default",
		body: "Keys are encrypted with AES and stored only in your browser. Ever."
	},
	{
		icon: Rocket,
		title: "Real-time everywhere",
		body: "Live prices, live order books, live sparklines. Updated every second."
	},
	{
		icon: ShieldCheck,
		title: "Institutional security",
		body: "2FA-ready, device tracking, anti-phishing codes and withdrawal whitelists."
	},
	{
		icon: Sparkles,
		title: "Zero clutter",
		body: "A design tuned for hours of screen time. Bloomberg density, Apple polish."
	}
];
function FeatureGrid() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-widest text-primary/90 font-medium",
				children: "Why PrimeCapital"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-2 font-display text-3xl md:text-4xl font-semibold",
				children: [
					"Everything a trader needs.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Nothing they don't."
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-xl p-6 hover:bg-white/[.05] transition group",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-10 w-10 items-center justify-center rounded-lg bg-[image:var(--gradient-brand)]/20 border border-primary/20 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-display text-lg font-semibold",
						children: f.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground leading-relaxed",
						children: f.body
					})
				]
			}, f.title))
		})]
	});
}
function StatsBand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-strong rounded-2xl p-8 md:p-10 grid gap-6 md:grid-cols-4 relative overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 -right-24 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" }), [
				{
					k: "$142B+",
					v: "24h volume across venues"
				},
				{
					k: "500+",
					v: "listed assets"
				},
				{
					k: "7",
					v: "supported chains"
				},
				{
					k: "0.01%",
					v: "maker fee, VIP tier"
				}
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl md:text-4xl font-semibold text-gradient",
				children: s.k
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: s.v
			})] }, s.k))]
		})
	});
}
function CTASection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-3xl glass-strong p-10 md:p-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 -z-10 opacity-70",
					style: { backgroundImage: "var(--gradient-hero)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "mx-auto h-8 w-8 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-3xl md:text-5xl font-semibold",
					children: "Ready when you are."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-4 max-w-lg text-muted-foreground",
					children: "Generate a wallet in under 10 seconds. Trade on the same page. No email required."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col sm:flex-row gap-3 justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/wallet",
						className: "rounded-lg bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow",
						children: "Create a wallet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/markets",
						className: "rounded-lg glass-strong px-6 py-3 text-sm font-semibold",
						children: "Explore markets"
					})]
				})
			]
		})
	});
}
//#endregion
export { HomePage as component };
