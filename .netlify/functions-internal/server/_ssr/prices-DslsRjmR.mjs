import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prices-DslsRjmR.js
async function fetchMarkets(perPage = 100) {
	const res = await fetch(`/api/markets?per_page=${perPage}`);
	if (!res.ok) throw new Error("Failed to fetch markets");
	return res.json();
}
var marketsQuery = (perPage = 50) => queryOptions({
	queryKey: ["markets", perPage],
	queryFn: () => fetchMarkets(perPage),
	staleTime: 3e4,
	refetchInterval: 3e4
});
function formatUSD(n, opts = {}) {
	if (!Number.isFinite(n)) return "$—";
	const abs = Math.abs(n);
	const digits = abs >= 1e3 ? 2 : abs >= 1 ? 2 : abs >= .01 ? 4 : 6;
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
		...opts
	}).format(n);
}
function formatCompact(n) {
	if (!Number.isFinite(n)) return "—";
	return new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 2
	}).format(n);
}
function formatPct(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}
//#endregion
export { marketsQuery as i, formatPct as n, formatUSD as r, formatCompact as t };
