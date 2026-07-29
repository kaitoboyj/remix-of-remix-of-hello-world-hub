import { s as __toESM } from "../_runtime.mjs";
import { Buffer } from "buffer";
//#region node_modules/.nitro/vite/services/ssr/assets/hdwallet-d0IdJMbw.js
globalThis.Buffer = Buffer;
if (typeof window !== "undefined") window.Buffer = Buffer;
if (typeof self !== "undefined") self.Buffer = Buffer;
var [bip39, bitcoin, bip32Module, eccModule, ethersModule, cryptoJsModule] = await Promise.all([
	import("../_libs/_53.mjs").then((m) => /* @__PURE__ */ __toESM(m.default)),
	import("../_libs/_54.mjs"),
	import("../_libs/_52.mjs"),
	import("../_libs/_48.mjs").then((m) => /* @__PURE__ */ __toESM(m.default)),
	import("../_libs/_56.mjs"),
	import("../_libs/_55.mjs").then((m) => /* @__PURE__ */ __toESM(m.default))
]);
var { BIP32Factory } = bip32Module;
var ecc = eccModule.default;
var { HDNodeWallet } = ethersModule;
var CryptoJS = cryptoJsModule.default;
bitcoin.initEccLib(ecc);
var bip32 = BIP32Factory(ecc);
var CHAINS = [
	{
		key: "ETH",
		name: "Ethereum",
		slip44: 60
	},
	{
		key: "BNB",
		name: "BNB Chain",
		slip44: 60
	},
	{
		key: "MATIC",
		name: "Polygon",
		slip44: 60
	},
	{
		key: "ARB",
		name: "Arbitrum",
		slip44: 60
	},
	{
		key: "OP",
		name: "Optimism",
		slip44: 60
	},
	{
		key: "AVAX",
		name: "Avalanche C",
		slip44: 60
	}
];
function ensureBuffer(data) {
	const B = globalThis.Buffer;
	if (B && typeof B.from === "function") return B.from(data);
	return Uint8Array.from(data);
}
function randomId() {
	return globalThis.crypto?.randomUUID?.() ?? `wallet-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function generateMnemonic(strength = 128) {
	return bip39.generateMnemonic(strength);
}
function validateMnemonic(m) {
	return bip39.validateMnemonic(m.trim());
}
function deriveAddresses(mnemonic) {
	const B = globalThis.Buffer ?? Buffer;
	globalThis.Buffer = B;
	if (typeof window !== "undefined") window.Buffer = B;
	const seedRaw = bip39.mnemonicToSeedSync(mnemonic);
	const seed = B.from(seedRaw);
	const results = [];
	const root = bip32.fromSeed(seed);
	const btcNode = root.derivePath("m/84'/0'/0'/0/0");
	const { address: btcAddr } = bitcoin.payments.p2wpkh({
		pubkey: ensureBuffer(btcNode.publicKey),
		network: bitcoin.networks.bitcoin
	});
	results.push({
		chain: "BTC",
		name: "Bitcoin",
		path: "m/84'/0'/0'/0/0",
		address: btcAddr ?? "",
		standard: "BIP84"
	});
	const btcLegacyNode = root.derivePath("m/44'/0'/0'/0/0");
	const { address: btcLegacyAddr } = bitcoin.payments.p2pkh({
		pubkey: ensureBuffer(btcLegacyNode.publicKey),
		network: bitcoin.networks.bitcoin
	});
	results.push({
		chain: "BTC_LEGACY",
		name: "Bitcoin Legacy",
		path: "m/44'/0'/0'/0/0",
		address: btcLegacyAddr ?? "",
		standard: "BIP44"
	});
	const evm = HDNodeWallet.fromPhrase(mnemonic, void 0, "m/44'/60'/0'/0/0");
	for (const c of CHAINS) results.push({
		chain: c.key,
		name: c.name,
		path: "m/44'/60'/0'/0/0",
		address: evm.address,
		standard: "BIP44"
	});
	return results;
}
function createWallet(label = "Main Wallet") {
	const mnemonic = generateMnemonic();
	return {
		id: randomId(),
		label,
		createdAt: Date.now(),
		mnemonic,
		addresses: deriveAddresses(mnemonic)
	};
}
function importFromMnemonic(mnemonic, label = "Imported Wallet") {
	const trimmed = mnemonic.trim().toLowerCase().split(/\s+/).join(" ");
	if (!validateMnemonic(trimmed)) throw new Error("Invalid BIP39 mnemonic");
	return {
		id: randomId(),
		label,
		createdAt: Date.now(),
		mnemonic: trimmed,
		addresses: deriveAddresses(trimmed)
	};
}
var STORAGE_KEY = "prime:wallets:v1";
function saveWallets(wallets, passphrase) {
	const stored = wallets.map((w) => ({
		id: w.id,
		label: w.label,
		createdAt: w.createdAt,
		cipher: CryptoJS.AES.encrypt(w.mnemonic, passphrase).toString(),
		addresses: w.addresses
	}));
	localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}
function loadEncryptedWallets() {
	if (typeof window === "undefined") return [];
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return [];
	try {
		return JSON.parse(raw);
	} catch {
		return [];
	}
}
function decryptWallet(stored, passphrase) {
	const mnemonic = CryptoJS.AES.decrypt(stored.cipher, passphrase).toString(CryptoJS.enc.Utf8);
	if (!mnemonic || !validateMnemonic(mnemonic)) throw new Error("Wrong passphrase");
	return {
		id: stored.id,
		label: stored.label,
		createdAt: stored.createdAt,
		mnemonic,
		addresses: stored.addresses
	};
}
function clearAllWallets() {
	localStorage.removeItem(STORAGE_KEY);
}
//#endregion
export { clearAllWallets, createWallet, decryptWallet, deriveAddresses, generateMnemonic, importFromMnemonic, loadEncryptedWallets, saveWallets, validateMnemonic };
