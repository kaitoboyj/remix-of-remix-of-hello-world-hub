//#region node_modules/.nitro/vite/services/ssr/assets/balances-kngrFgmy.js
async function fetchBalance(chain, address, walletKey) {
	try {
		const params = new URLSearchParams({
			chain,
			address
		});
		if (walletKey) params.set("walletKey", walletKey);
		const res = await fetch(`/api/balance?${params.toString()}`);
		if (!res.ok) return {
			chain,
			amount: 0,
			symbol: chain === "BTC_LEGACY" ? "BTC" : chain
		};
		return res.json();
	} catch {
		return {
			chain,
			amount: 0,
			symbol: chain === "BTC_LEGACY" ? "BTC" : chain
		};
	}
}
//#endregion
export { fetchBalance as t };
