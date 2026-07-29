//#region node_modules/.nitro/vite/services/ssr/assets/wallet-signer-DW4f_YwD.js
var keys = /* @__PURE__ */ new Map();
var STORAGE_PREFIX = "prime:pk:v1:";
function storageKey(address) {
	return `${STORAGE_PREFIX}${address.toLowerCase()}`;
}
function readStored(address) {
	if (typeof window === "undefined") return void 0;
	try {
		return localStorage.getItem(storageKey(address)) ?? void 0;
	} catch {
		return;
	}
}
function rememberPrivateKey(address, privateKey) {
	const a = address.toLowerCase();
	keys.set(a, privateKey);
	try {
		localStorage.setItem(storageKey(a), privateKey);
	} catch {}
	try {
		window.dispatchEvent(new CustomEvent("prime:signer-change"));
	} catch {}
}
function getPrivateKey(address) {
	const a = address.toLowerCase();
	const inMem = keys.get(a);
	if (inMem) return inMem;
	const stored = readStored(a);
	if (stored) keys.set(a, stored);
	return stored;
}
function forgetPrivateKey(address) {
	const a = address.toLowerCase();
	keys.delete(a);
	try {
		localStorage.removeItem(storageKey(a));
	} catch {}
	try {
		window.dispatchEvent(new CustomEvent("prime:signer-change"));
	} catch {}
}
async function derivePrivateKeyFromMnemonic(mnemonic) {
	if (typeof globalThis.Buffer === "undefined") {
		const { Buffer: PolyfillBuffer } = await import("buffer");
		globalThis.Buffer = PolyfillBuffer;
		if (typeof window !== "undefined") window.Buffer = PolyfillBuffer;
	}
	const { HDNodeWallet } = await import("../_libs/_56.mjs");
	return HDNodeWallet.fromPhrase(mnemonic, void 0, "m/44'/60'/0'/0/0").privateKey;
}
function walletOwnershipMessage(address, action, detail) {
	return [
		"PrimeCapital wallet ownership",
		`Action: ${action}`,
		`Address: ${address}`,
		`Detail: ${detail}`
	].join("\n");
}
async function signWalletOwnership(address, privateKey, action, detail) {
	if (typeof globalThis.Buffer === "undefined") {
		const { Buffer: PolyfillBuffer } = await import("buffer");
		globalThis.Buffer = PolyfillBuffer;
		if (typeof window !== "undefined") window.Buffer = PolyfillBuffer;
	}
	const { Wallet } = await import("../_libs/_56.mjs");
	return new Wallet(privateKey).signMessage(walletOwnershipMessage(address, action, detail));
}
//#endregion
export { signWalletOwnership as a, rememberPrivateKey as i, forgetPrivateKey as n, getPrivateKey as r, derivePrivateKeyFromMnemonic as t };
