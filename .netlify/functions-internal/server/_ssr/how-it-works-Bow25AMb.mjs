import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as ChartColumn, b as Newspaper, d as Sparkles, i as WalletMinimal, k as KeyRound, o as UserCheck, p as ShieldCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/how-it-works-Bow25AMb.js
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	{
		icon: WalletMinimal,
		title: "1. Create or import a wallet",
		body: "Generate a fresh BIP39 seed phrase in your browser, or import an existing 12/24-word mnemonic. Keys are derived locally using BIP32/44/84 — the seed never touches our servers."
	},
	{
		icon: UserCheck,
		title: "2. Pick a username",
		body: "The first time a wallet signs in, you choose a unique username. That username is permanently tied to your wallet address and used to identify you across the platform."
	},
	{
		icon: KeyRound,
		title: "3. Sign in with your wallet",
		body: "There are no passwords and no emails. Whenever the wallet is active, you're signed in — anywhere your wallet goes, your PrimeCapital identity follows."
	},
	{
		icon: ChartColumn,
		title: "4. Trade like a pro",
		body: "Open the Terminal for live TradingView charts across BTC, ETH, SOL, BNB, XRP, DOGE and more, plus an order book and market data updated every few seconds."
	},
	{
		icon: Sparkles,
		title: "5. Watch your balances",
		body: "The Home dashboard shows your total portfolio value in USD, plus native balances for each derived address (BTC, ETH and every EVM chain) fetched directly on-chain."
	},
	{
		icon: Newspaper,
		title: "6. Stay on top of the news",
		body: "The News page pulls the freshest crypto headlines in real time so you can react before the market does."
	},
	{
		icon: ShieldCheck,
		title: "7. Self-custody, always",
		body: "PrimeCapital never sees your mnemonic, private keys, or trades routed through your wallet. Back up your seed offline — anyone with those 12 words controls the wallet."
	}
];
function HowItWorksPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center max-w-2xl mx-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-primary/90 font-medium",
						children: "Guide"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-2 font-display text-4xl md:text-5xl font-semibold leading-tight",
						children: [
							"How ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient",
								children: "PrimeCapital"
							}),
							" works"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted-foreground",
						children: "Everything you need to know to go from zero to trading with a self-custody wallet — in about a minute."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-4 sm:grid-cols-2",
				children: STEPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-brand)]/20 border border-primary/20 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-semibold",
							children: s.title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground leading-relaxed",
						children: s.body
					})]
				}, s.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-strong mt-10 rounded-2xl p-6 md:p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold",
						children: "Ready to take custody?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground max-w-lg mx-auto",
						children: "Create a wallet in ten seconds — no email, no password, no third party in between."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-col sm:flex-row gap-3 justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/wallet",
							className: "inline-flex items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-brand)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletMinimal, { className: "h-4 w-4" }), " Open Wallet"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/trade",
							className: "inline-flex items-center justify-center gap-2 rounded-lg glass px-5 py-2.5 text-sm font-semibold hover:bg-white/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" }), " Launch Terminal"]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { HowItWorksPage as component };
