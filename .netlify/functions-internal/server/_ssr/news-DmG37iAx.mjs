import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as queryOptions, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as ArrowUpRight, b as Newspaper, v as Radio } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/news-DmG37iAx.js
var import_jsx_runtime = require_jsx_runtime();
async function fetchNews() {
	const res = await fetch("/api/news");
	if (!res.ok) throw new Error("Failed to fetch news");
	return res.json();
}
var newsQuery = queryOptions({
	queryKey: ["news"],
	queryFn: fetchNews,
	staleTime: 6e4,
	refetchInterval: 6e4
});
function NewsPage() {
	const { data, isLoading } = useQuery(newsQuery);
	const items = data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary/90 font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-3.5 w-3.5" }), " Live Desk"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl md:text-5xl font-semibold",
						children: "Crypto news"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-sm text-muted-foreground",
						children: "Breaking digital asset headlines refreshed automatically as new stories publish."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/trade",
					className: "inline-flex items-center gap-2 rounded-lg glass px-4 py-2 text-sm font-semibold hover:bg-white/10",
					children: ["Open terminal ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: Array.from({ length: 9 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "glass rounded-xl h-64 animate-pulse" }, i))
			}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 glass-strong rounded-2xl p-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "mx-auto h-8 w-8 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "News is temporarily unavailable."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsCard, {
					item,
					priority: index < 3
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-16 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/mixman",
					"aria-label": ".",
					title: ".",
					className: "h-1.5 w-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
				})
			})
		]
	});
}
function NewsCard({ item, priority }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: item.url,
		target: "_blank",
		rel: "noreferrer",
		className: "group glass rounded-xl overflow-hidden transition hover:-translate-y-0.5 hover:bg-white/[.06]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "aspect-[16/9] bg-white/5 overflow-hidden",
			children: item.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: item.image,
				alt: "",
				loading: priority ? "eager" : "lazy",
				className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full w-full items-center justify-center bg-[image:var(--gradient-hero)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "h-10 w-10 text-primary/80" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
					className: "text-[11px] uppercase tracking-widest text-muted-foreground",
					dateTime: item.publishedAt,
					children: new Intl.DateTimeFormat("en-US", {
						month: "short",
						day: "numeric",
						hour: "numeric",
						minute: "2-digit"
					}).format(new Date(item.publishedAt))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 line-clamp-3 font-display text-lg font-semibold leading-tight group-hover:text-primary transition-colors",
					children: item.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground",
					children: item.summary
				})
			]
		})]
	});
}
//#endregion
export { NewsPage as component };
