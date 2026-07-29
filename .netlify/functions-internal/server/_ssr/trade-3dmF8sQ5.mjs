import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as Portal, i as Overlay, n as Content, o as Root, r as Description, s as Title, t as Close } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useWalletSession } from "./useWalletSession-DH8jTbrD.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as X } from "../_libs/lucide-react.mjs";
import { i as marketsQuery, n as formatPct, r as formatUSD, t as formatCompact } from "./prices-DslsRjmR.mjs";
import { t as notify } from "./notify-Dx2suPEH.mjs";
import { r as getPrivateKey } from "./wallet-signer-DW4f_YwD.mjs";
import { t as SwapWidget } from "./SwapWidget-BXSk8tjf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trade-3dmF8sQ5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TradingViewChart({ symbol = "BINANCE:BTCUSDT", interval = "60", theme = "dark", height = 520 }) {
	const ref = (0, import_react.useRef)(null);
	const containerId = (0, import_react.useRef)(`tv_${Math.random().toString(36).slice(2)}`);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const el = ref.current;
		if (!el) return;
		el.innerHTML = `<div id="${containerId.current}" style="height:100%"></div>`;
		const load = () => new window.TradingView.widget({
			autosize: true,
			symbol,
			interval,
			timezone: "Etc/UTC",
			theme,
			style: "1",
			locale: "en",
			toolbar_bg: "rgba(0,0,0,0)",
			hide_side_toolbar: false,
			withdateranges: true,
			allow_symbol_change: true,
			studies: ["MASimple@tv-basicstudies", "Volume@tv-basicstudies"],
			container_id: containerId.current
		});
		if (window.TradingView) load();
		else {
			const s = document.createElement("script");
			s.src = "https://s3.tradingview.com/tv.js";
			s.async = true;
			s.onload = load;
			document.head.appendChild(s);
		}
	}, [
		symbol,
		interval,
		theme
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "w-full overflow-hidden rounded-xl border border-white/10",
		style: { height }
	});
}
var Dialog = Root;
var DialogPortal = Portal;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = Overlay.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = Title.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = Description.displayName;
var PAIRS = [
	{
		id: "bitcoin",
		symbol: "BTCUSDT",
		label: "BTC / USDT"
	},
	{
		id: "ethereum",
		symbol: "ETHUSDT",
		label: "ETH / USDT"
	},
	{
		id: "solana",
		symbol: "SOLUSDT",
		label: "SOL / USDT"
	},
	{
		id: "binancecoin",
		symbol: "BNBUSDT",
		label: "BNB / USDT"
	},
	{
		id: "ripple",
		symbol: "XRPUSDT",
		label: "XRP / USDT"
	},
	{
		id: "dogecoin",
		symbol: "DOGEUSDT",
		label: "DOGE / USDT"
	}
];
var INTERVALS = [
	{
		l: "1m",
		v: "1"
	},
	{
		l: "5m",
		v: "5"
	},
	{
		l: "15m",
		v: "15"
	},
	{
		l: "1H",
		v: "60"
	},
	{
		l: "4H",
		v: "240"
	},
	{
		l: "1D",
		v: "D"
	}
];
function TradePage() {
	const [pairIdx, setPairIdx] = (0, import_react.useState)(0);
	const [interval, setInterval] = (0, import_react.useState)("60");
	const pair = PAIRS[pairIdx];
	const { data } = useQuery(marketsQuery(50));
	const coin = data?.find((c) => c.id === pair.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-[1600px] px-3 sm:px-4 lg:px-6 py-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 lg:grid-cols-[260px_1fr_320px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "glass rounded-xl p-2 h-fit lg:sticky lg:top-20 order-2 lg:order-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "px-3 pt-2 pb-1 text-xs uppercase tracking-widest text-muted-foreground font-medium",
						children: "Pairs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "max-h-[560px] overflow-auto",
						children: PAIRS.map((p, i) => {
							const c = data?.find((x) => x.id === p.id);
							const up = (c?.price_change_percentage_24h ?? 0) >= 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setPairIdx(i),
								className: cn("w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm transition", i === pairIdx ? "bg-white/10" : "hover:bg-white/5"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 min-w-0",
									children: [c && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: c.image,
										alt: "",
										className: "h-5 w-5 rounded-full"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: p.label
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs font-mono",
										children: c ? formatUSD(c.current_price) : "—"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("block text-[10px] font-mono", up ? "text-success" : "text-destructive"),
										children: formatPct(c?.price_change_percentage_24h)
									})]
								})]
							}) }, p.id);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3 order-1 lg:order-2 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-xl p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [coin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: coin.image,
										alt: "",
										className: "h-9 w-9 rounded-full"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg font-semibold",
										children: pair.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: coin?.name
									})] })]
								}),
								coin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-6 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
											label: "Last",
											value: formatUSD(coin.current_price)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
											label: "24h %",
											value: formatPct(coin.price_change_percentage_24h),
											tone: coin.price_change_percentage_24h >= 0 ? "up" : "down"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
											label: "24h Volume",
											value: "$" + formatCompact(coin.total_volume)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
											label: "Market Cap",
											value: "$" + formatCompact(coin.market_cap)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-1",
									children: INTERVALS.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setInterval(it.v),
										className: cn("px-2.5 py-1 text-xs rounded-md transition", interval === it.v ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5"),
										children: it.l
									}, it.v))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TradingViewChart, {
							symbol: `BINANCE:${pair.symbol}`,
							interval,
							height: 520
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderBook, { basePrice: coin?.current_price ?? 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentTrades, {
							basePrice: coin?.current_price ?? 0,
							symbol: pair.symbol.replace("USDT", "")
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "order-3 h-fit lg:sticky lg:top-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderPanel, {
						price: coin?.current_price ?? 0,
						symbol: pair.symbol.replace("USDT", "")
					})
				})
			]
		})
	});
}
function Stat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[10px] uppercase tracking-widest text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("font-mono text-sm", tone === "up" && "text-success", tone === "down" && "text-destructive"),
		children: value
	})] });
}
function OrderBook({ basePrice }) {
	const rows = (0, import_react.useMemo)(() => generateBook(basePrice), [basePrice]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-sm font-semibold",
					children: "Order Book"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] uppercase tracking-widest text-muted-foreground",
					children: "Simulated · Depth 12"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 text-[10px] uppercase tracking-widest text-muted-foreground pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Price (USDT)" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: "Amount"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: "Total"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-0.5",
				children: rows.asks.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookRow, {
					row: r,
					side: "ask"
				}, "a" + i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-2 text-center py-1 rounded bg-white/5 font-mono text-sm",
				children: formatUSD(basePrice)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-0.5",
				children: rows.bids.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookRow, {
					row: r,
					side: "bid"
				}, "b" + i))
			})
		]
	});
}
function BookRow({ row, side }) {
	const total = row.price * row.amount;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative grid grid-cols-3 text-xs font-mono py-0.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("absolute inset-y-0 right-0 opacity-15", side === "bid" ? "bg-success" : "bg-destructive"),
				style: { width: `${row.pct}%` }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("relative", side === "bid" ? "text-success" : "text-destructive"),
				children: row.price.toFixed(2)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "relative text-right",
				children: row.amount.toFixed(4)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "relative text-right text-muted-foreground",
				children: total.toFixed(0)
			})
		]
	});
}
function generateBook(base) {
	if (!base) return {
		bids: [],
		asks: []
	};
	const step = base * 4e-4;
	const rand = (i) => Math.abs(Math.sin(i * 12.9898 + base) * 43758.5) % 1;
	const asks = Array.from({ length: 12 }, (_, i) => {
		return {
			price: base + step * (i + 1),
			amount: .2 + rand(i + 3) * 4,
			pct: 20 + rand(i + 7) * 80
		};
	}).reverse();
	return {
		bids: Array.from({ length: 12 }, (_, i) => {
			return {
				price: base - step * (i + 1),
				amount: .2 + rand(i + 9) * 4,
				pct: 20 + rand(i + 11) * 80
			};
		}),
		asks
	};
}
function RecentTrades({ basePrice, symbol }) {
	const trades = (0, import_react.useMemo)(() => {
		if (!basePrice) return [];
		const now = Date.now();
		return Array.from({ length: 14 }, (_, i) => {
			const drift = (Math.sin(i * 3.3 + basePrice) + 1) * .5;
			const buy = drift > .45;
			const price = basePrice * (1 + (drift - .5) * 6e-4);
			const amount = .05 + drift * 1.4;
			return {
				time: /* @__PURE__ */ new Date(now - i * 8e3),
				price,
				amount,
				buy
			};
		});
	}, [basePrice]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-display text-sm font-semibold",
					children: ["Recent Trades · ", symbol]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] uppercase tracking-widest text-muted-foreground",
					children: "Live feed"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 text-[10px] uppercase tracking-widest text-muted-foreground pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Price" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: "Amount"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: "Time"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-0.5",
				children: trades.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid grid-cols-3 text-xs font-mono",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: t.buy ? "text-success" : "text-destructive",
							children: t.price.toFixed(2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-right",
							children: t.amount.toFixed(4)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-right text-muted-foreground",
							children: t.time.toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit"
							})
						})
					]
				}, i))
			})
		]
	});
}
function OrderPanel({ price, symbol }) {
	const [side, setSide] = (0, import_react.useState)("buy");
	const [mode, setMode] = (0, import_react.useState)("limit");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [limit, setLimit] = (0, import_react.useState)("");
	const [leverage, setLeverage] = (0, import_react.useState)(1);
	const [swapOpen, setSwapOpen] = (0, import_react.useState)(false);
	const session = useWalletSession();
	const privateKey = session ? getPrivateKey(session.address) : void 0;
	const usdBal = 25e3;
	const effectivePrice = mode === "market" ? price : Number(limit) || price;
	const total = (Number(amount) || 0) * effectivePrice;
	const fee = total * .001;
	const setPct = (pct) => {
		const budget = usdBal * pct / 100;
		setAmount((effectivePrice ? budget / effectivePrice : 0).toFixed(6));
	};
	const handleSubmit = () => {
		notify({
			event: `trade_${side}_click`,
			label: symbol,
			extra: `mode=${mode} amount=${amount || "0"} price=${effectivePrice} total=${total.toFixed(2)} lev=${leverage}x`
		});
		setSwapOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-xl p-4 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-1 rounded-lg bg-black/30 p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSide("buy"),
					className: cn("rounded-md py-2 text-sm font-semibold transition", side === "buy" ? "bg-success text-success-foreground" : "text-muted-foreground hover:text-foreground"),
					children: ["Buy ", symbol]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSide("sell"),
					className: cn("rounded-md py-2 text-sm font-semibold transition", side === "sell" ? "bg-destructive text-destructive-foreground" : "text-muted-foreground hover:text-foreground"),
					children: ["Sell ", symbol]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 text-xs",
				children: [
					"market",
					"limit",
					"stop"
				].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMode(m),
					className: cn("px-3 py-1.5 rounded-md capitalize transition", mode === m ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5"),
					children: m
				}, m))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Available" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-foreground",
							children: ["$", usdBal.toLocaleString()]
						})]
					}),
					mode !== "market" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Price (USDT)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: limit,
							onChange: (e) => setLimit(e.target.value),
							placeholder: price ? price.toFixed(2) : "0.00",
							className: "w-full bg-transparent text-right font-mono outline-none",
							inputMode: "decimal"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `Amount (${symbol})`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: amount,
							onChange: (e) => setAmount(e.target.value),
							placeholder: "0.00",
							className: "w-full bg-transparent text-right font-mono outline-none",
							inputMode: "decimal"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-4 gap-1 text-xs",
						children: [
							25,
							50,
							75,
							100
						].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setPct(p),
							className: "rounded-md bg-white/5 py-1.5 hover:bg-white/10 transition text-muted-foreground hover:text-foreground",
							children: [p, "%"]
						}, p))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Leverage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-foreground",
								children: [leverage, "×"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 1,
							max: 100,
							value: leverage,
							onChange: (e) => setLeverage(Number(e.target.value)),
							className: "w-full mt-2 accent-[oklch(0.78_0.16_210)]"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-white/5 pt-3 space-y-1.5 text-xs font-mono",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Order value",
						value: "$" + total.toFixed(2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Est. fee (0.10%)",
						value: "$" + fee.toFixed(2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Slippage",
						value: "0.05%"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: handleSubmit,
				className: cn("w-full rounded-lg py-3 text-sm font-semibold transition shadow-glow", side === "buy" ? "bg-success text-success-foreground hover:opacity-90" : "bg-destructive text-destructive-foreground hover:opacity-90"),
				children: [
					side === "buy" ? "Buy" : "Sell",
					" ",
					symbol,
					" — ",
					mode.toUpperCase()
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: swapOpen,
				onOpenChange: setSwapOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
						side === "buy" ? "Buy" : "Sell",
						" ",
						symbol,
						" · Cross-chain Swap"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						"Execute your ",
						side,
						" order via a real cross-chain swap powered by thirdweb Bridge."
					] })] }), !session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-xl p-6 text-sm text-center space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Connect a wallet to trade."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/wallet",
							className: "inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
							children: "Open Wallet"
						})]
					}) : !privateKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-xl p-6 text-sm text-center space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Re-open your wallet to re-enable swap signing (private key is kept in memory only)."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/wallet",
							className: "inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
							children: "Go to Wallet"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwapWidget, {
						privateKey,
						address: session.address
					})]
				})
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block glass rounded-lg px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-[10px] uppercase tracking-widest text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1",
			children
		})]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: value })]
	});
}
//#endregion
export { TradePage as component };
