import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { m as Search, u as Star } from "../_libs/lucide-react.mjs";
import { i as marketsQuery, n as formatPct, r as formatUSD, t as formatCompact } from "./prices-DslsRjmR.mjs";
import { t as Sparkline } from "./Sparkline-Dhf2zOLz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/markets-_j_H1m58.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MarketsPage() {
	const { data, isLoading } = useQuery(marketsQuery(100));
	const [q, setQ] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("market_cap");
	const [dir, setDir] = (0, import_react.useState)("desc");
	const [favs, setFavs] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const coins = (0, import_react.useMemo)(() => {
		return [...(data ?? []).filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.symbol.toLowerCase().includes(q.toLowerCase()))].sort((a, b) => {
			const av = pick(a, sort);
			const bv = pick(b, sort);
			return dir === "asc" ? av - bv : bv - av;
		});
	}, [
		data,
		q,
		sort,
		dir
	]);
	const toggleSort = (k) => {
		if (sort === k) setDir(dir === "asc" ? "desc" : "asc");
		else {
			setSort(k);
			setDir("desc");
		}
	};
	const toggleFav = (id) => setFavs((s) => {
		const n = new Set(s);
		n.has(id) ? n.delete(id) : n.add(id);
		return n;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-primary/90 font-medium",
						children: "Markets"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-3xl md:text-4xl font-semibold",
						children: "Live crypto prices"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-muted-foreground text-sm max-w-lg",
						children: [
							"Top ",
							coins.length,
							" assets by market cap, refreshed every 30 seconds. Click any row to trade."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search coin or ticker…",
						className: "glass w-full md:w-80 rounded-lg pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass rounded-2xl overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs uppercase tracking-wider text-muted-foreground bg-black/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-8" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-3 pl-4",
									children: "#"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-3",
									children: "Asset"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
									label: "Price",
									k: "price",
									sort,
									dir,
									onClick: toggleSort
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
									label: "24h %",
									k: "change",
									sort,
									dir,
									onClick: toggleSort
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
									label: "Volume",
									k: "volume",
									sort,
									dir,
									onClick: toggleSort
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
									label: "Market Cap",
									k: "market_cap",
									sort,
									dir,
									onClick: toggleSort
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right py-3 pr-4",
									children: "Last 7d"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-white/5",
							children: [isLoading && Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 8,
								className: "py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 mx-4 rounded bg-white/5 animate-pulse" })
							}) }, i)), coins.map((c) => {
								const up = (c.price_change_percentage_24h ?? 0) >= 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-white/[.03] transition",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "pl-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => toggleFav(c.id),
												className: cn("p-1 rounded", favs.has(c.id) ? "text-gold" : "text-muted-foreground hover:text-foreground"),
												"aria-label": "Favorite",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
													className: "h-4 w-4",
													fill: favs.has(c.id) ? "currentColor" : "none"
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-4 text-muted-foreground",
											children: c.market_cap_rank
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: c.image,
												alt: "",
												className: "h-7 w-7 rounded-full"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: c.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: c.symbol.toUpperCase()
											})] })]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-right font-mono",
											children: formatUSD(c.current_price)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: cn("text-right font-mono", up ? "text-success" : "text-destructive"),
											children: formatPct(c.price_change_percentage_24h)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "text-right font-mono text-muted-foreground",
											children: ["$", formatCompact(c.total_volume)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "text-right font-mono text-muted-foreground",
											children: ["$", formatCompact(c.market_cap)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "pr-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex justify-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
													data: c.sparkline_in_7d?.price ?? [],
													up,
													width: 120,
													height: 36
												})
											})
										})
									]
								}, c.id);
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-center text-xs text-muted-foreground",
				children: ["Data from CoinGecko. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/trade",
					className: "text-primary hover:underline",
					children: "Open the terminal →"
				})]
			})
		]
	});
}
function pick(c, k) {
	switch (k) {
		case "price": return c.current_price;
		case "change": return c.price_change_percentage_24h ?? 0;
		case "volume": return c.total_volume;
		default: return c.market_cap;
	}
}
function SortTh({ label, k, sort, dir, onClick }) {
	const active = sort === k;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: "text-right py-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => onClick(k),
			className: cn("inline-flex items-center gap-1 hover:text-foreground", active && "text-foreground"),
			children: [label, active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px]",
				children: dir === "asc" ? "▲" : "▼"
			})]
		})
	});
}
//#endregion
export { MarketsPage as component };
