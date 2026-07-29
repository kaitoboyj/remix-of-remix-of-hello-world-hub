import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useWalletSession } from "./useWalletSession-DH8jTbrD.mjs";
import { L as ArrowLeftRight, r as Wallet } from "../_libs/lucide-react.mjs";
import { r as getPrivateKey } from "./wallet-signer-DW4f_YwD.mjs";
import { t as SwapWidget } from "./SwapWidget-BXSk8tjf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/swap-C2Z9z_kz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SwapPage() {
	const session = useWalletSession();
	const [pk, setPk] = (0, import_react.useState)(void 0);
	const [tick, setTick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const refresh = () => setTick((t) => t + 1);
		window.addEventListener("prime:signer-change", refresh);
		return () => window.removeEventListener("prime:signer-change", refresh);
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		if (!session?.address) {
			setPk(null);
			return;
		}
		setPk(void 0);
		const started = Date.now();
		const refresh = () => {
			const key = getPrivateKey(session.address);
			if (cancelled) return;
			if (key) {
				setPk(key);
				return;
			}
			if (Date.now() - started < 2500) window.setTimeout(refresh, 250);
			else setPk(null);
		};
		refresh();
		return () => {
			cancelled = true;
		};
	}, [session?.address, tick]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-primary/90 font-medium",
					children: "Cross-Chain"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-2 font-display text-3xl md:text-4xl font-semibold flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "h-7 w-7 text-primary" }), " Swap"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground max-w-2xl",
					children: "Bridge and swap tokens across EVM chains directly from your wallet. Transactions are signed locally by your imported or generated wallet — funds move on-chain from your real address."
				})
			]
		}), !session ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NeedsWallet, { reason: "signin" }) : pk === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass rounded-xl p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground",
			children: "Loading wallet signer…"
		}) : !pk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NeedsWallet, { reason: "rehydrate" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwapWidget, {
			privateKey: pk,
			address: session.address
		})]
	});
}
function NeedsWallet({ reason }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-strong rounded-2xl p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-brand)] shadow-glow",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-6 w-6 text-primary-foreground" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 font-display text-xl font-semibold",
				children: reason === "signin" ? "Sign in with a wallet" : "Unlock your wallet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground max-w-md mx-auto",
				children: reason === "signin" ? "Create or import a wallet to enable cross-chain swaps." : "Your session is active but the signing key is not loaded in this tab. Re-open your wallet to unlock swapping."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/wallet",
				className: "mt-5 inline-flex items-center gap-2 rounded-lg bg-[image:var(--gradient-brand)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow",
				children: "Go to Wallet"
			})
		]
	});
}
//#endregion
export { SwapPage as component };
