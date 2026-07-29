import { r as __exportAll } from "../_runtime.mjs";
import { a as sha1, o as sha256, s as ripemd160 } from "./noble__hashes.mjs";
import { C as regex, E as union, S as pipe, T as tuple, _ as number$2, a as bigint, b as parse, c as function_, d as is, f as length, g as nullish, h as nullable, i as array, l as instance, m as minValue, n as esm_default, o as custom, p as maxValue, r as any, s as everyItem, u as integer, v as object, w as string, x as partial, y as optional } from "./bip32+bs58check+valibot+wif.mjs";
import { a as encode$4, i as decode$4, n as checkForInput, o as encodingLength$1, r as checkForOutput, t as Psbt$1 } from "./bip174+[...].mjs";
import { t as require_dist } from "./bech32.mjs";
//#region node_modules/bitcoinjs-lib/src/esm/networks.js
var networks_exports = /* @__PURE__ */ __exportAll({
	bitcoin: () => bitcoin,
	regtest: () => regtest,
	testnet: () => testnet
});
/**
* Represents the Bitcoin network configuration.
*/
var bitcoin = {
	/**
	* The message prefix used for signing Bitcoin messages.
	*/
	messagePrefix: "Bitcoin Signed Message:\n",
	/**
	* The Bech32 prefix used for Bitcoin addresses.
	*/
	bech32: "bc",
	/**
	* The BIP32 key prefixes for Bitcoin.
	*/
	bip32: {
		/**
		* The public key prefix for BIP32 extended public keys.
		*/
		public: 76067358,
		/**
		* The private key prefix for BIP32 extended private keys.
		*/
		private: 76066276
	},
	/**
	* The prefix for Bitcoin public key hashes.
	*/
	pubKeyHash: 0,
	/**
	* The prefix for Bitcoin script hashes.
	*/
	scriptHash: 5,
	/**
	* The prefix for Bitcoin Wallet Import Format (WIF) private keys.
	*/
	wif: 128
};
/**
* Represents the regtest network configuration.
*/
var regtest = {
	messagePrefix: "Bitcoin Signed Message:\n",
	bech32: "bcrt",
	bip32: {
		public: 70617039,
		private: 70615956
	},
	pubKeyHash: 111,
	scriptHash: 196,
	wif: 239
};
/**
* Represents the testnet network configuration.
*/
var testnet = {
	messagePrefix: "Bitcoin Signed Message:\n",
	bech32: "tb",
	bip32: {
		public: 70617039,
		private: 70615956
	},
	pubKeyHash: 111,
	scriptHash: 196,
	wif: 239
};
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/bip66.js
/**
* Checks if the given buffer is a valid BIP66-encoded signature.
*
* @param buffer - The buffer to check.
* @returns A boolean indicating whether the buffer is a valid BIP66-encoded signature.
*/
function check(buffer) {
	if (buffer.length < 8) return false;
	if (buffer.length > 72) return false;
	if (buffer[0] !== 48) return false;
	if (buffer[1] !== buffer.length - 2) return false;
	if (buffer[2] !== 2) return false;
	const lenR = buffer[3];
	if (lenR === 0) return false;
	if (5 + lenR >= buffer.length) return false;
	if (buffer[4 + lenR] !== 2) return false;
	const lenS = buffer[5 + lenR];
	if (lenS === 0) return false;
	if (6 + lenR + lenS !== buffer.length) return false;
	if (buffer[4] & 128) return false;
	if (lenR > 1 && buffer[4] === 0 && !(buffer[5] & 128)) return false;
	if (buffer[lenR + 6] & 128) return false;
	if (lenS > 1 && buffer[lenR + 6] === 0 && !(buffer[lenR + 7] & 128)) return false;
	return true;
}
/**
* Decodes a DER-encoded signature buffer and returns the R and S values.
* @param buffer - The DER-encoded signature buffer.
* @returns An object containing the R and S values.
* @throws {Error} If the DER sequence length is too short, too long, or invalid.
* @throws {Error} If the R or S length is zero or invalid.
* @throws {Error} If the R or S value is negative or excessively padded.
*/
function decode$3(buffer) {
	if (buffer.length < 8) throw new Error("DER sequence length is too short");
	if (buffer.length > 72) throw new Error("DER sequence length is too long");
	if (buffer[0] !== 48) throw new Error("Expected DER sequence");
	if (buffer[1] !== buffer.length - 2) throw new Error("DER sequence length is invalid");
	if (buffer[2] !== 2) throw new Error("Expected DER integer");
	const lenR = buffer[3];
	if (lenR === 0) throw new Error("R length is zero");
	if (5 + lenR >= buffer.length) throw new Error("R length is too long");
	if (buffer[4 + lenR] !== 2) throw new Error("Expected DER integer (2)");
	const lenS = buffer[5 + lenR];
	if (lenS === 0) throw new Error("S length is zero");
	if (6 + lenR + lenS !== buffer.length) throw new Error("S length is invalid");
	if (buffer[4] & 128) throw new Error("R value is negative");
	if (lenR > 1 && buffer[4] === 0 && !(buffer[5] & 128)) throw new Error("R value excessively padded");
	if (buffer[lenR + 6] & 128) throw new Error("S value is negative");
	if (lenS > 1 && buffer[lenR + 6] === 0 && !(buffer[lenR + 7] & 128)) throw new Error("S value excessively padded");
	return {
		r: buffer.slice(4, 4 + lenR),
		s: buffer.slice(6 + lenR)
	};
}
function encode$3(r, s) {
	const lenR = r.length;
	const lenS = s.length;
	if (lenR === 0) throw new Error("R length is zero");
	if (lenS === 0) throw new Error("S length is zero");
	if (lenR > 33) throw new Error("R length is too long");
	if (lenS > 33) throw new Error("S length is too long");
	if (r[0] & 128) throw new Error("R value is negative");
	if (s[0] & 128) throw new Error("S value is negative");
	if (lenR > 1 && r[0] === 0 && !(r[1] & 128)) throw new Error("R value excessively padded");
	if (lenS > 1 && s[0] === 0 && !(s[1] & 128)) throw new Error("S value excessively padded");
	const signature = new Uint8Array(6 + lenR + lenS);
	signature[0] = 48;
	signature[1] = signature.length - 2;
	signature[2] = 2;
	signature[3] = r.length;
	signature.set(r, 4);
	signature[4 + lenR] = 2;
	signature[5 + lenR] = s.length;
	signature.set(s, 6 + lenR);
	return signature;
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/ops.js
var OPS$8;
(function(OPS) {
	OPS[OPS["OP_FALSE"] = 0] = "OP_FALSE";
	OPS[OPS["OP_0"] = 0] = "OP_0";
	OPS[OPS["OP_PUSHDATA1"] = 76] = "OP_PUSHDATA1";
	OPS[OPS["OP_PUSHDATA2"] = 77] = "OP_PUSHDATA2";
	OPS[OPS["OP_PUSHDATA4"] = 78] = "OP_PUSHDATA4";
	OPS[OPS["OP_1NEGATE"] = 79] = "OP_1NEGATE";
	OPS[OPS["OP_RESERVED"] = 80] = "OP_RESERVED";
	OPS[OPS["OP_TRUE"] = 81] = "OP_TRUE";
	OPS[OPS["OP_1"] = 81] = "OP_1";
	OPS[OPS["OP_2"] = 82] = "OP_2";
	OPS[OPS["OP_3"] = 83] = "OP_3";
	OPS[OPS["OP_4"] = 84] = "OP_4";
	OPS[OPS["OP_5"] = 85] = "OP_5";
	OPS[OPS["OP_6"] = 86] = "OP_6";
	OPS[OPS["OP_7"] = 87] = "OP_7";
	OPS[OPS["OP_8"] = 88] = "OP_8";
	OPS[OPS["OP_9"] = 89] = "OP_9";
	OPS[OPS["OP_10"] = 90] = "OP_10";
	OPS[OPS["OP_11"] = 91] = "OP_11";
	OPS[OPS["OP_12"] = 92] = "OP_12";
	OPS[OPS["OP_13"] = 93] = "OP_13";
	OPS[OPS["OP_14"] = 94] = "OP_14";
	OPS[OPS["OP_15"] = 95] = "OP_15";
	OPS[OPS["OP_16"] = 96] = "OP_16";
	OPS[OPS["OP_NOP"] = 97] = "OP_NOP";
	OPS[OPS["OP_VER"] = 98] = "OP_VER";
	OPS[OPS["OP_IF"] = 99] = "OP_IF";
	OPS[OPS["OP_NOTIF"] = 100] = "OP_NOTIF";
	OPS[OPS["OP_VERIF"] = 101] = "OP_VERIF";
	OPS[OPS["OP_VERNOTIF"] = 102] = "OP_VERNOTIF";
	OPS[OPS["OP_ELSE"] = 103] = "OP_ELSE";
	OPS[OPS["OP_ENDIF"] = 104] = "OP_ENDIF";
	OPS[OPS["OP_VERIFY"] = 105] = "OP_VERIFY";
	OPS[OPS["OP_RETURN"] = 106] = "OP_RETURN";
	OPS[OPS["OP_TOALTSTACK"] = 107] = "OP_TOALTSTACK";
	OPS[OPS["OP_FROMALTSTACK"] = 108] = "OP_FROMALTSTACK";
	OPS[OPS["OP_2DROP"] = 109] = "OP_2DROP";
	OPS[OPS["OP_2DUP"] = 110] = "OP_2DUP";
	OPS[OPS["OP_3DUP"] = 111] = "OP_3DUP";
	OPS[OPS["OP_2OVER"] = 112] = "OP_2OVER";
	OPS[OPS["OP_2ROT"] = 113] = "OP_2ROT";
	OPS[OPS["OP_2SWAP"] = 114] = "OP_2SWAP";
	OPS[OPS["OP_IFDUP"] = 115] = "OP_IFDUP";
	OPS[OPS["OP_DEPTH"] = 116] = "OP_DEPTH";
	OPS[OPS["OP_DROP"] = 117] = "OP_DROP";
	OPS[OPS["OP_DUP"] = 118] = "OP_DUP";
	OPS[OPS["OP_NIP"] = 119] = "OP_NIP";
	OPS[OPS["OP_OVER"] = 120] = "OP_OVER";
	OPS[OPS["OP_PICK"] = 121] = "OP_PICK";
	OPS[OPS["OP_ROLL"] = 122] = "OP_ROLL";
	OPS[OPS["OP_ROT"] = 123] = "OP_ROT";
	OPS[OPS["OP_SWAP"] = 124] = "OP_SWAP";
	OPS[OPS["OP_TUCK"] = 125] = "OP_TUCK";
	OPS[OPS["OP_CAT"] = 126] = "OP_CAT";
	OPS[OPS["OP_SUBSTR"] = 127] = "OP_SUBSTR";
	OPS[OPS["OP_LEFT"] = 128] = "OP_LEFT";
	OPS[OPS["OP_RIGHT"] = 129] = "OP_RIGHT";
	OPS[OPS["OP_SIZE"] = 130] = "OP_SIZE";
	OPS[OPS["OP_INVERT"] = 131] = "OP_INVERT";
	OPS[OPS["OP_AND"] = 132] = "OP_AND";
	OPS[OPS["OP_OR"] = 133] = "OP_OR";
	OPS[OPS["OP_XOR"] = 134] = "OP_XOR";
	OPS[OPS["OP_EQUAL"] = 135] = "OP_EQUAL";
	OPS[OPS["OP_EQUALVERIFY"] = 136] = "OP_EQUALVERIFY";
	OPS[OPS["OP_RESERVED1"] = 137] = "OP_RESERVED1";
	OPS[OPS["OP_RESERVED2"] = 138] = "OP_RESERVED2";
	OPS[OPS["OP_1ADD"] = 139] = "OP_1ADD";
	OPS[OPS["OP_1SUB"] = 140] = "OP_1SUB";
	OPS[OPS["OP_2MUL"] = 141] = "OP_2MUL";
	OPS[OPS["OP_2DIV"] = 142] = "OP_2DIV";
	OPS[OPS["OP_NEGATE"] = 143] = "OP_NEGATE";
	OPS[OPS["OP_ABS"] = 144] = "OP_ABS";
	OPS[OPS["OP_NOT"] = 145] = "OP_NOT";
	OPS[OPS["OP_0NOTEQUAL"] = 146] = "OP_0NOTEQUAL";
	OPS[OPS["OP_ADD"] = 147] = "OP_ADD";
	OPS[OPS["OP_SUB"] = 148] = "OP_SUB";
	OPS[OPS["OP_MUL"] = 149] = "OP_MUL";
	OPS[OPS["OP_DIV"] = 150] = "OP_DIV";
	OPS[OPS["OP_MOD"] = 151] = "OP_MOD";
	OPS[OPS["OP_LSHIFT"] = 152] = "OP_LSHIFT";
	OPS[OPS["OP_RSHIFT"] = 153] = "OP_RSHIFT";
	OPS[OPS["OP_BOOLAND"] = 154] = "OP_BOOLAND";
	OPS[OPS["OP_BOOLOR"] = 155] = "OP_BOOLOR";
	OPS[OPS["OP_NUMEQUAL"] = 156] = "OP_NUMEQUAL";
	OPS[OPS["OP_NUMEQUALVERIFY"] = 157] = "OP_NUMEQUALVERIFY";
	OPS[OPS["OP_NUMNOTEQUAL"] = 158] = "OP_NUMNOTEQUAL";
	OPS[OPS["OP_LESSTHAN"] = 159] = "OP_LESSTHAN";
	OPS[OPS["OP_GREATERTHAN"] = 160] = "OP_GREATERTHAN";
	OPS[OPS["OP_LESSTHANOREQUAL"] = 161] = "OP_LESSTHANOREQUAL";
	OPS[OPS["OP_GREATERTHANOREQUAL"] = 162] = "OP_GREATERTHANOREQUAL";
	OPS[OPS["OP_MIN"] = 163] = "OP_MIN";
	OPS[OPS["OP_MAX"] = 164] = "OP_MAX";
	OPS[OPS["OP_WITHIN"] = 165] = "OP_WITHIN";
	OPS[OPS["OP_RIPEMD160"] = 166] = "OP_RIPEMD160";
	OPS[OPS["OP_SHA1"] = 167] = "OP_SHA1";
	OPS[OPS["OP_SHA256"] = 168] = "OP_SHA256";
	OPS[OPS["OP_HASH160"] = 169] = "OP_HASH160";
	OPS[OPS["OP_HASH256"] = 170] = "OP_HASH256";
	OPS[OPS["OP_CODESEPARATOR"] = 171] = "OP_CODESEPARATOR";
	OPS[OPS["OP_CHECKSIG"] = 172] = "OP_CHECKSIG";
	OPS[OPS["OP_CHECKSIGVERIFY"] = 173] = "OP_CHECKSIGVERIFY";
	OPS[OPS["OP_CHECKMULTISIG"] = 174] = "OP_CHECKMULTISIG";
	OPS[OPS["OP_CHECKMULTISIGVERIFY"] = 175] = "OP_CHECKMULTISIGVERIFY";
	OPS[OPS["OP_NOP1"] = 176] = "OP_NOP1";
	OPS[OPS["OP_CHECKLOCKTIMEVERIFY"] = 177] = "OP_CHECKLOCKTIMEVERIFY";
	OPS[OPS["OP_NOP2"] = 177] = "OP_NOP2";
	OPS[OPS["OP_CHECKSEQUENCEVERIFY"] = 178] = "OP_CHECKSEQUENCEVERIFY";
	OPS[OPS["OP_NOP3"] = 178] = "OP_NOP3";
	OPS[OPS["OP_NOP4"] = 179] = "OP_NOP4";
	OPS[OPS["OP_NOP5"] = 180] = "OP_NOP5";
	OPS[OPS["OP_NOP6"] = 181] = "OP_NOP6";
	OPS[OPS["OP_NOP7"] = 182] = "OP_NOP7";
	OPS[OPS["OP_NOP8"] = 183] = "OP_NOP8";
	OPS[OPS["OP_NOP9"] = 184] = "OP_NOP9";
	OPS[OPS["OP_NOP10"] = 185] = "OP_NOP10";
	OPS[OPS["OP_CHECKSIGADD"] = 186] = "OP_CHECKSIGADD";
	OPS[OPS["OP_PUBKEYHASH"] = 253] = "OP_PUBKEYHASH";
	OPS[OPS["OP_PUBKEY"] = 254] = "OP_PUBKEY";
	OPS[OPS["OP_INVALIDOPCODE"] = 255] = "OP_INVALIDOPCODE";
})(OPS$8 || (OPS$8 = {}));
//#endregion
//#region node_modules/bitcoinjs-lib/node_modules/uint8array-tools/src/mjs/index.js
function concat(arrays) {
	return Uint8Array.from(Buffer.concat(arrays));
}
function toHex(bytes) {
	return Buffer.from(bytes || []).toString("hex");
}
function fromHex(hexString) {
	return Uint8Array.from(Buffer.from(hexString || "", "hex"));
}
function fromBase64(base64) {
	return Uint8Array.from(Buffer.from(base64 || "", "base64"));
}
function compare(v1, v2) {
	return Buffer.from(v1).compare(Buffer.from(v2));
}
function writeUInt8(buffer, offset, value) {
	if (offset + 1 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	const buf = Buffer.alloc(1);
	buf.writeUInt8(value, 0);
	buffer.set(Uint8Array.from(buf), offset);
	return offset + 1;
}
function writeUInt16(buffer, offset, value, littleEndian) {
	if (offset + 2 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.alloc(2);
	if (littleEndian === "LE") buf.writeUInt16LE(value, 0);
	else buf.writeUInt16BE(value, 0);
	buffer.set(Uint8Array.from(buf), offset);
	return offset + 2;
}
function writeUInt32(buffer, offset, value, littleEndian) {
	if (offset + 4 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.alloc(4);
	if (littleEndian === "LE") buf.writeUInt32LE(value, 0);
	else buf.writeUInt32BE(value, 0);
	buffer.set(Uint8Array.from(buf), offset);
	return offset + 4;
}
function writeUInt64(buffer, offset, value, littleEndian) {
	if (offset + 8 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.alloc(8);
	if (value > 18446744073709551615n) throw new Error(`The value of "value" is out of range. It must be >= 0 and <= 18446744073709551615. Received ${value}`);
	if (littleEndian === "LE") buf.writeBigUInt64LE(value, 0);
	else buf.writeBigUInt64BE(value, 0);
	buffer.set(Uint8Array.from(buf), offset);
	return offset + 8;
}
function readUInt8(buffer, offset) {
	if (offset + 1 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	return Buffer.from(buffer).readUInt8(offset);
}
function readUInt16(buffer, offset, littleEndian) {
	if (offset + 2 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.from(buffer);
	if (littleEndian === "LE") return buf.readUInt16LE(offset);
	else return buf.readUInt16BE(offset);
}
function readUInt32(buffer, offset, littleEndian) {
	if (offset + 4 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.from(buffer);
	if (littleEndian === "LE") return buf.readUInt32LE(offset);
	else return buf.readUInt32BE(offset);
}
function writeInt32(buffer, offset, value, littleEndian) {
	if (offset + 4 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.alloc(4);
	if (littleEndian === "LE") buf.writeInt32LE(value, 0);
	else buf.writeInt32BE(value, 0);
	buffer.set(Uint8Array.from(buf), offset);
	return offset + 4;
}
function writeInt64(buffer, offset, value, littleEndian) {
	if (offset + 8 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	if (value > 9223372036854775807n || value < -9223372036854775808n) throw new Error(`The value of "value" is out of range. It must be >= ${-9223372036854775808n} and <= 9223372036854775807. Received ${value}`);
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.alloc(8);
	if (littleEndian === "LE") buf.writeBigInt64LE(value, 0);
	else buf.writeBigInt64BE(value, 0);
	buffer.set(Uint8Array.from(buf), offset);
	return offset + 8;
}
function readInt32(buffer, offset, littleEndian) {
	if (offset + 4 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	if (littleEndian === "LE") return Buffer.from(buffer).readInt32LE(offset);
	else return Buffer.from(buffer).readInt32BE(offset);
}
function readInt64(buffer, offset, littleEndian) {
	if (offset + 8 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	if (littleEndian === "LE") return Buffer.from(buffer).readBigInt64LE(offset);
	else return Buffer.from(buffer).readBigInt64BE(offset);
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/push_data.js
/**
* Calculates the encoding length of a number used for push data in Bitcoin transactions.
* @param i The number to calculate the encoding length for.
* @returns The encoding length of the number.
*/
function encodingLength(i) {
	return i < OPS$8.OP_PUSHDATA1 ? 1 : i <= 255 ? 2 : i <= 65535 ? 3 : 5;
}
/**
* Encodes a number into a buffer using a variable-length encoding scheme.
* The encoded buffer is written starting at the specified offset.
* Returns the size of the encoded buffer.
*
* @param buffer - The buffer to write the encoded data into.
* @param num - The number to encode.
* @param offset - The offset at which to start writing the encoded buffer.
* @returns The size of the encoded buffer.
*/
function encode$2(buffer, num, offset) {
	const size = encodingLength(num);
	if (size === 1) writeUInt8(buffer, offset, num);
	else if (size === 2) {
		writeUInt8(buffer, offset, OPS$8.OP_PUSHDATA1);
		writeUInt8(buffer, offset + 1, num);
	} else if (size === 3) {
		writeUInt8(buffer, offset, OPS$8.OP_PUSHDATA2);
		writeUInt16(buffer, offset + 1, num, "LE");
	} else {
		writeUInt8(buffer, offset, OPS$8.OP_PUSHDATA4);
		writeUInt32(buffer, offset + 1, num, "LE");
	}
	return size;
}
/**
* Decodes a buffer and returns information about the opcode, number, and size.
* @param buffer - The buffer to decode.
* @param offset - The offset within the buffer to start decoding.
* @returns An object containing the opcode, number, and size, or null if decoding fails.
*/
function decode$2(buffer, offset) {
	const opcode = readUInt8(buffer, offset);
	let num;
	let size;
	if (opcode < OPS$8.OP_PUSHDATA1) {
		num = opcode;
		size = 1;
	} else if (opcode === OPS$8.OP_PUSHDATA1) {
		if (offset + 2 > buffer.length) return null;
		num = readUInt8(buffer, offset + 1);
		size = 2;
	} else if (opcode === OPS$8.OP_PUSHDATA2) {
		if (offset + 3 > buffer.length) return null;
		num = readUInt16(buffer, offset + 1, "LE");
		size = 3;
	} else {
		if (offset + 5 > buffer.length) return null;
		if (opcode !== OPS$8.OP_PUSHDATA4) throw new Error("Unexpected opcode");
		num = readUInt32(buffer, offset + 1, "LE");
		size = 5;
	}
	return {
		opcode,
		number: num,
		size
	};
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/script_number.js
var script_number_exports = /* @__PURE__ */ __exportAll({
	decode: () => decode$1,
	encode: () => encode$1
});
/**
* Decodes a script number from a buffer.
*
* @param buffer - The buffer containing the script number.
* @param maxLength - The maximum length of the script number. Defaults to 4.
* @param minimal - Whether the script number should be minimal. Defaults to true.
* @returns The decoded script number.
* @throws {TypeError} If the script number overflows the maximum length.
* @throws {Error} If the script number is not minimally encoded when minimal is true.
*/
function decode$1(buffer, maxLength, minimal) {
	maxLength = maxLength || 4;
	minimal = minimal === void 0 ? true : minimal;
	const length = buffer.length;
	if (length === 0) return 0;
	if (length > maxLength) throw new TypeError("Script number overflow");
	if (minimal) {
		if ((buffer[length - 1] & 127) === 0) {
			if (length <= 1 || (buffer[length - 2] & 128) === 0) throw new Error("Non-minimally encoded script number");
		}
	}
	if (length === 5) {
		const a = readUInt32(buffer, 0, "LE");
		const b = readUInt8(buffer, 4);
		if (b & 128) return -((b & -129) * 4294967296 + a);
		return b * 4294967296 + a;
	}
	let result = 0;
	for (let i = 0; i < length; ++i) result |= buffer[i] << 8 * i;
	if (buffer[length - 1] & 128) return -(result & ~(128 << 8 * (length - 1)));
	return result;
}
function scriptNumSize(i) {
	return i > 2147483647 ? 5 : i > 8388607 ? 4 : i > 32767 ? 3 : i > 127 ? 2 : i > 0 ? 1 : 0;
}
/**
* Encodes a number into a Uint8Array using a specific format.
*
* @param _number - The number to encode.
* @returns The encoded number as a Uint8Array.
*/
function encode$1(_number) {
	let value = Math.abs(_number);
	const size = scriptNumSize(value);
	const buffer = new Uint8Array(size);
	const negative = _number < 0;
	for (let i = 0; i < size; ++i) {
		writeUInt8(buffer, i, value & 255);
		value >>= 8;
	}
	if (buffer[size - 1] & 128) writeUInt8(buffer, size - 1, negative ? 128 : 0);
	else if (negative) buffer[size - 1] |= 128;
	return buffer;
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/types.js
var ZERO32 = new Uint8Array(32);
var EC_P = fromHex("fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
var NBufferSchemaFactory = (size) => pipe(instance(Uint8Array), length(size));
/**
* Checks if two arrays of Buffers are equal.
* @param a - The first array of Buffers.
* @param b - The second array of Buffers.
* @returns True if the arrays are equal, false otherwise.
*/
function stacksEqual(a, b) {
	if (a.length !== b.length) return false;
	return a.every((x, i) => {
		return compare(x, b[i]) === 0;
	});
}
/**
* Checks if the given value is a valid elliptic curve point.
* @param p - The value to check.
* @returns True if the value is a valid elliptic curve point, false otherwise.
*/
function isPoint(p) {
	if (!(p instanceof Uint8Array)) return false;
	if (p.length < 33) return false;
	const t = p[0];
	const x = p.slice(1, 33);
	if (compare(ZERO32, x) === 0) return false;
	if (compare(x, EC_P) >= 0) return false;
	if ((t === 2 || t === 3) && p.length === 33) return true;
	const y = p.slice(33);
	if (compare(ZERO32, y) === 0) return false;
	if (compare(y, EC_P) >= 0) return false;
	if (t === 4 && p.length === 65) return true;
	return false;
}
function isTapleaf(o) {
	if (!o || !("output" in o)) return false;
	if (!(o.output instanceof Uint8Array)) return false;
	if (o.version !== void 0) return (o.version & 254) === o.version;
	return true;
}
function isTaptree(scriptTree) {
	if (!Array.isArray(scriptTree)) return isTapleaf(scriptTree);
	if (scriptTree.length !== 2) return false;
	return scriptTree.every((t) => isTaptree(t));
}
var Buffer256bitSchema = NBufferSchemaFactory(32);
var Hash160bitSchema = NBufferSchemaFactory(20);
var Hash256bitSchema = NBufferSchemaFactory(32);
var BufferSchema = instance(Uint8Array);
var HexSchema = pipe(string(), regex(/^([0-9a-f]{2})+$/i));
var UInt8Schema = pipe(number$2(), integer(), minValue(0), maxValue(255));
var UInt32Schema = pipe(number$2(), integer(), minValue(0), maxValue(4294967295));
var SatoshiSchema = pipe(bigint(), minValue(0n), maxValue(9223372036854775807n));
var NullablePartial = (a) => object(Object.entries(a).reduce((acc, next) => ({
	...acc,
	[next[0]]: nullish(next[1])
}), {}));
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/script_signature.js
var script_signature_exports = /* @__PURE__ */ __exportAll({
	decode: () => decode,
	encode: () => encode
});
var ZERO$1 = new Uint8Array(1);
/**
* Converts a buffer to a DER-encoded buffer.
* @param x - The buffer to be converted.
* @returns The DER-encoded buffer.
*/
function toDER(x) {
	let i = 0;
	while (x[i] === 0) ++i;
	if (i === x.length) return ZERO$1;
	x = x.slice(i);
	if (x[0] & 128) return concat([ZERO$1, x]);
	return x;
}
/**
* Converts a DER-encoded signature to a buffer.
* If the first byte of the input buffer is 0x00, it is skipped.
* The resulting buffer is 32 bytes long, filled with zeros if necessary.
* @param x - The DER-encoded signature.
* @returns The converted buffer.
*/
function fromDER(x) {
	if (x[0] === 0) x = x.slice(1);
	const buffer = new Uint8Array(32);
	const bstart = Math.max(0, 32 - x.length);
	buffer.set(x, bstart);
	return buffer;
}
/**
* Decodes a buffer into a ScriptSignature object.
* @param buffer - The buffer to decode.
* @returns The decoded ScriptSignature object.
* @throws Error if the hashType is invalid.
*/
function decode(buffer) {
	const hashType = readUInt8(buffer, buffer.length - 1);
	if (!isDefinedHashType(hashType)) throw new Error("Invalid hashType " + hashType);
	const decoded = decode$3(buffer.subarray(0, -1));
	return {
		signature: concat([fromDER(decoded.r), fromDER(decoded.s)]),
		hashType
	};
}
/**
* Encodes a signature and hash type into a buffer.
* @param signature - The signature to encode.
* @param hashType - The hash type to encode.
* @returns The encoded buffer.
* @throws Error if the hashType is invalid.
*/
function encode(signature, hashType) {
	parse(object({
		signature: NBufferSchemaFactory(64),
		hashType: UInt8Schema
	}), {
		signature,
		hashType
	});
	if (!isDefinedHashType(hashType)) throw new Error("Invalid hashType " + hashType);
	const hashTypeBuffer = new Uint8Array(1);
	writeUInt8(hashTypeBuffer, 0, hashType);
	return concat([encode$3(toDER(signature.slice(0, 32)), toDER(signature.slice(32, 64))), hashTypeBuffer]);
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/script.js
/**
* Script tools module for working with Bitcoin scripts.
* Provides utilities such as decompiling, compiling, converting to/from ASM, stack manipulation,
* and script validation functions.
*
* @packageDocumentation
*/
var script_exports = /* @__PURE__ */ __exportAll({
	OPS: () => OPS$8,
	compile: () => compile,
	countNonPushOnlyOPs: () => countNonPushOnlyOPs,
	decompile: () => decompile,
	fromASM: () => fromASM,
	isCanonicalPubKey: () => isCanonicalPubKey,
	isCanonicalScriptSignature: () => isCanonicalScriptSignature,
	isDefinedHashType: () => isDefinedHashType,
	isPushOnly: () => isPushOnly,
	number: () => number,
	signature: () => signature,
	toASM: () => toASM,
	toStack: () => toStack
});
/** Base opcode for OP_INT values. */
var OP_INT_BASE$1 = OPS$8.OP_RESERVED;
/** Validation schema for a Bitcoin script stack. */
var StackSchema = array(union([instance(Uint8Array), number$2()]));
/**
* Determines if a value corresponds to an OP_INT opcode.
*
* @param value - The opcode to check.
* @returns True if the value is an OP_INT, false otherwise.
*/
function isOPInt(value) {
	return is(number$2(), value) && (value === OPS$8.OP_0 || value >= OPS$8.OP_1 && value <= OPS$8.OP_16 || value === OPS$8.OP_1NEGATE);
}
/**
* Checks if a script chunk is push-only (contains only data or OP_INT opcodes).
*
* @param value - The chunk to check.
* @returns True if the chunk is push-only, false otherwise.
*/
function isPushOnlyChunk(value) {
	return is(BufferSchema, value) || isOPInt(value);
}
/**
* Determines if a stack consists of only push operations.
*
* @param value - The stack to check.
* @returns True if all elements in the stack are push-only, false otherwise.
*/
function isPushOnly(value) {
	return is(pipe(any(), everyItem(isPushOnlyChunk)), value);
}
/**
* Counts the number of non-push-only opcodes in a stack.
*
* @param value - The stack to analyze.
* @returns The count of non-push-only opcodes.
*/
function countNonPushOnlyOPs(value) {
	return value.length - value.filter(isPushOnlyChunk).length;
}
/**
* Converts a minimal script buffer to its corresponding opcode, if applicable.
*
* @param buffer - The buffer to check.
* @returns The corresponding opcode or undefined if not minimal.
*/
function asMinimalOP(buffer) {
	if (buffer.length === 0) return OPS$8.OP_0;
	if (buffer.length !== 1) return;
	if (buffer[0] >= 1 && buffer[0] <= 16) return OP_INT_BASE$1 + buffer[0];
	if (buffer[0] === 129) return OPS$8.OP_1NEGATE;
}
/**
* Determines if a buffer or stack is a Uint8Array.
*
* @param buf - The buffer or stack to check.
* @returns True if the input is a Uint8Array, false otherwise.
*/
function chunksIsBuffer(buf) {
	return buf instanceof Uint8Array;
}
/**
* Determines if a buffer or stack is a valid stack.
*
* @param buf - The buffer or stack to check.
* @returns True if the input is a stack, false otherwise.
*/
function chunksIsArray(buf) {
	return is(StackSchema, buf);
}
/**
* Determines if a single chunk is a Uint8Array.
*
* @param buf - The chunk to check.
* @returns True if the chunk is a Uint8Array, false otherwise.
*/
function singleChunkIsBuffer(buf) {
	return buf instanceof Uint8Array;
}
/**
* Compiles an array of script chunks into a Uint8Array.
*
* @param chunks - The chunks to compile.
* @returns The compiled script as a Uint8Array.
* @throws Error if compilation fails.
*/
function compile(chunks) {
	if (chunksIsBuffer(chunks)) return chunks;
	parse(StackSchema, chunks);
	const bufferSize = chunks.reduce((accum, chunk) => {
		if (singleChunkIsBuffer(chunk)) {
			if (chunk.length === 1 && asMinimalOP(chunk) !== void 0) return accum + 1;
			return accum + encodingLength(chunk.length) + chunk.length;
		}
		return accum + 1;
	}, 0);
	const buffer = new Uint8Array(bufferSize);
	let offset = 0;
	chunks.forEach((chunk) => {
		if (singleChunkIsBuffer(chunk)) {
			const opcode = asMinimalOP(chunk);
			if (opcode !== void 0) {
				writeUInt8(buffer, offset, opcode);
				offset += 1;
				return;
			}
			offset += encode$2(buffer, chunk.length, offset);
			buffer.set(chunk, offset);
			offset += chunk.length;
		} else {
			writeUInt8(buffer, offset, chunk);
			offset += 1;
		}
	});
	if (offset !== buffer.length) throw new Error("Could not decode chunks");
	return buffer;
}
/**
* Decompiles a script buffer into an array of chunks.
*
* @param buffer - The script buffer to decompile.
* @returns The decompiled chunks or null if decompilation fails.
*/
function decompile(buffer) {
	if (chunksIsArray(buffer)) return buffer;
	parse(BufferSchema, buffer);
	const chunks = [];
	let i = 0;
	while (i < buffer.length) {
		const opcode = buffer[i];
		if (opcode > OPS$8.OP_0 && opcode <= OPS$8.OP_PUSHDATA4) {
			const d = decode$2(buffer, i);
			if (d === null) return null;
			i += d.size;
			if (i + d.number > buffer.length) return null;
			const data = buffer.slice(i, i + d.number);
			i += d.number;
			const op = asMinimalOP(data);
			if (op !== void 0) chunks.push(op);
			else chunks.push(data);
		} else {
			chunks.push(opcode);
			i += 1;
		}
	}
	return chunks;
}
/**
* Converts the given chunks into an ASM (Assembly) string representation.
* If the chunks parameter is a Buffer, it will be decompiled into a Stack before conversion.
* @param chunks - The chunks to convert into ASM.
* @returns The ASM string representation of the chunks.
*/
function toASM(chunks) {
	if (chunksIsBuffer(chunks)) chunks = decompile(chunks);
	if (!chunks) throw new Error("Could not convert invalid chunks to ASM");
	return chunks.map((chunk) => {
		if (singleChunkIsBuffer(chunk)) {
			const op = asMinimalOP(chunk);
			if (op === void 0) return toHex(chunk);
			chunk = op;
		}
		return OPS$8[chunk];
	}).join(" ");
}
/**
* Converts an ASM string to a Buffer.
* @param asm The ASM string to convert.
* @returns The converted Buffer.
*/
function fromASM(asm) {
	parse(string(), asm);
	return compile(asm.split(" ").map((chunk) => {
		if (isNaN(Number(chunk)) && chunk in OPS$8) return OPS$8[chunk];
		parse(HexSchema, chunk);
		return fromHex(chunk);
	}));
}
/**
* Converts the given chunks into a stack of buffers.
*
* @param chunks - The chunks to convert.
* @returns The stack of buffers.
*/
function toStack(chunks) {
	chunks = decompile(chunks);
	parse(custom(isPushOnly), chunks);
	return chunks.map((op) => {
		if (singleChunkIsBuffer(op)) return op;
		if (op === OPS$8.OP_0) return new Uint8Array(0);
		return encode$1(op - OP_INT_BASE$1);
	});
}
/**
* Checks if the provided buffer is a canonical public key.
*
* @param buffer - The buffer to check, expected to be a Uint8Array.
* @returns A boolean indicating whether the buffer is a canonical public key.
*/
function isCanonicalPubKey(buffer) {
	return isPoint(buffer);
}
/**
* Checks if the provided hash type is defined.
*
* A hash type is considered defined if its modified value (after masking with ~0x80)
* is greater than 0x00 and less than 0x04.
*
* @param hashType - The hash type to check.
* @returns True if the hash type is defined, false otherwise.
*/
function isDefinedHashType(hashType) {
	const hashTypeMod = hashType & -129;
	return hashTypeMod > 0 && hashTypeMod < 4;
}
/**
* Checks if the provided buffer is a canonical script signature.
*
* A canonical script signature is a valid DER-encoded signature followed by a valid hash type byte.
*
* @param buffer - The buffer to check.
* @returns `true` if the buffer is a canonical script signature, `false` otherwise.
*/
function isCanonicalScriptSignature(buffer) {
	if (!(buffer instanceof Uint8Array)) return false;
	if (!isDefinedHashType(buffer[buffer.length - 1])) return false;
	return check(buffer.slice(0, -1));
}
var number = script_number_exports;
var signature = script_signature_exports;
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/payments/lazy.js
function prop(object, name, f) {
	Object.defineProperty(object, name, {
		configurable: true,
		enumerable: true,
		get() {
			const _value = f.call(this);
			this[name] = _value;
			return _value;
		},
		set(_value) {
			Object.defineProperty(this, name, {
				configurable: true,
				enumerable: true,
				value: _value,
				writable: true
			});
		}
	});
}
function value(f) {
	let _value;
	return () => {
		if (_value !== void 0) return _value;
		_value = f();
		return _value;
	};
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/payments/embed.js
var OPS$7 = OPS$8;
/**
* Embeds data in a Bitcoin payment.
* @param a - The payment object.
* @param opts - Optional payment options.
* @returns The modified payment object.
* @throws {TypeError} If there is not enough data or if the output is invalid.
*/
function p2data(a, opts) {
	if (!a.data && !a.output) throw new TypeError("Not enough data");
	opts = Object.assign({ validate: true }, opts || {});
	parse(partial(object({
		network: object({}),
		output: BufferSchema,
		data: array(BufferSchema)
	})), a);
	const o = {
		name: "embed",
		network: a.network || bitcoin
	};
	prop(o, "output", () => {
		if (!a.data) return;
		return compile([OPS$7.OP_RETURN].concat(a.data));
	});
	prop(o, "data", () => {
		if (!a.output) return;
		return decompile(a.output).slice(1);
	});
	if (opts.validate) {
		if (a.output) {
			const chunks = decompile(a.output);
			if (chunks[0] !== OPS$7.OP_RETURN) throw new TypeError("Output is invalid");
			if (!chunks.slice(1).every((chunk) => is(BufferSchema, chunk))) throw new TypeError("Output is invalid");
			if (a.data && !stacksEqual(a.data, o.data)) throw new TypeError("Data mismatch");
		}
	}
	return Object.assign(o, a);
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/payments/p2ms.js
var OPS$6 = OPS$8;
var OP_INT_BASE = OPS$6.OP_RESERVED;
function encodeSmallOrScriptNum(n) {
	return n <= 16 ? OP_INT_BASE + n : encode$1(n);
}
function decodeSmallOrScriptNum(chunk) {
	if (typeof chunk === "number") {
		const val = chunk - OP_INT_BASE;
		if (val < 1 || val > 16) throw new TypeError(`Invalid opcode: expected OP_1–OP_16, got ${chunk}`);
		return val;
	} else return decode$1(chunk);
}
function isSmallOrScriptNum(chunk) {
	if (typeof chunk === "number") return chunk - OP_INT_BASE >= 1 && chunk - OP_INT_BASE <= 16;
	else return Number.isInteger(decode$1(chunk));
}
/**
* Represents a function that creates a Pay-to-Multisig (P2MS) payment object.
* @param a - The payment object.
* @param opts - Optional payment options.
* @returns The created payment object.
* @throws {TypeError} If the provided data is not valid.
*/
function p2ms(a, opts) {
	if (!a.input && !a.output && !(a.pubkeys && a.m !== void 0) && !a.signatures) throw new TypeError("Not enough data");
	opts = Object.assign({ validate: true }, opts || {});
	function isAcceptableSignature(x) {
		return isCanonicalScriptSignature(x) || (opts.allowIncomplete && x === OPS$6.OP_0) !== void 0;
	}
	parse(partial(object({
		network: object({}),
		m: number$2(),
		n: number$2(),
		output: BufferSchema,
		pubkeys: array(custom(isPoint), "Received invalid pubkey"),
		signatures: array(custom(isAcceptableSignature), "Expected signature to be of type isAcceptableSignature"),
		input: BufferSchema
	})), a);
	const o = { network: a.network || bitcoin };
	let chunks = [];
	let decoded = false;
	function decode(output) {
		if (decoded) return;
		decoded = true;
		chunks = decompile(output);
		if (chunks.length < 3) throw new TypeError("Output is invalid");
		o.m = decodeSmallOrScriptNum(chunks[0]);
		o.n = decodeSmallOrScriptNum(chunks[chunks.length - 2]);
		o.pubkeys = chunks.slice(1, -2);
	}
	prop(o, "output", () => {
		if (!a.m) return;
		if (!o.n) return;
		if (!a.pubkeys) return;
		return compile([].concat(encodeSmallOrScriptNum(a.m), a.pubkeys, encodeSmallOrScriptNum(o.n), OPS$6.OP_CHECKMULTISIG));
	});
	prop(o, "m", () => {
		if (!o.output) return;
		decode(o.output);
		return o.m;
	});
	prop(o, "n", () => {
		if (!o.pubkeys) return;
		return o.pubkeys.length;
	});
	prop(o, "pubkeys", () => {
		if (!a.output) return;
		decode(a.output);
		return o.pubkeys;
	});
	prop(o, "signatures", () => {
		if (!a.input) return;
		return decompile(a.input).slice(1);
	});
	prop(o, "input", () => {
		if (!a.signatures) return;
		return compile([OPS$6.OP_0].concat(a.signatures));
	});
	prop(o, "witness", () => {
		if (!o.input) return;
		return [];
	});
	prop(o, "name", () => {
		if (!o.m || !o.n) return;
		return `p2ms(${o.m} of ${o.n})`;
	});
	if (opts.validate) {
		if (a.output) {
			decode(a.output);
			if (!isSmallOrScriptNum(chunks[0])) throw new TypeError("Output is invalid");
			if (!isSmallOrScriptNum(chunks[chunks.length - 2])) throw new TypeError("Output is invalid");
			if (chunks[chunks.length - 1] !== OPS$6.OP_CHECKMULTISIG) throw new TypeError("Output is invalid");
			if (o.m <= 0 || o.n > 20 || o.m > o.n || o.n !== chunks.length - 3) throw new TypeError("Output is invalid");
			if (!o.pubkeys.every((x) => isPoint(x))) throw new TypeError("Output is invalid");
			if (a.m !== void 0 && a.m !== o.m) throw new TypeError("m mismatch");
			if (a.n !== void 0 && a.n !== o.n) throw new TypeError("n mismatch");
			if (a.pubkeys && !stacksEqual(a.pubkeys, o.pubkeys)) throw new TypeError("Pubkeys mismatch");
		}
		if (a.pubkeys) {
			if (a.n !== void 0 && a.n !== a.pubkeys.length) throw new TypeError("Pubkey count mismatch");
			o.n = a.pubkeys.length;
			if (o.n < o.m) throw new TypeError("Pubkey count cannot be less than m");
		}
		if (a.signatures) {
			if (a.signatures.length < o.m) throw new TypeError("Not enough signatures provided");
			if (a.signatures.length > o.m) throw new TypeError("Too many signatures provided");
		}
		if (a.input) {
			if (a.input[0] !== OPS$6.OP_0) throw new TypeError("Input is invalid");
			if (o.signatures.length === 0 || !o.signatures.every(isAcceptableSignature)) throw new TypeError("Input has invalid signature(s)");
			if (a.signatures && !stacksEqual(a.signatures, o.signatures)) throw new TypeError("Signature mismatch");
			if (a.m !== void 0 && a.m !== a.signatures.length) throw new TypeError("Signature count mismatch");
		}
	}
	return Object.assign(o, a);
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/payments/p2pk.js
var OPS$5 = OPS$8;
/**
* Creates a pay-to-public-key (P2PK) payment object.
*
* @param a - The payment object containing the necessary data.
* @param opts - Optional payment options.
* @returns The P2PK payment object.
* @throws {TypeError} If the required data is not provided or if the data is invalid.
*/
function p2pk(a, opts) {
	if (!a.input && !a.output && !a.pubkey && !a.input && !a.signature) throw new TypeError("Not enough data");
	opts = Object.assign({ validate: true }, opts || {});
	parse(partial(object({
		network: object({}),
		output: BufferSchema,
		pubkey: custom(isPoint, "invalid pubkey"),
		signature: custom(isCanonicalScriptSignature, "Expected signature to be of type isCanonicalScriptSignature"),
		input: BufferSchema
	})), a);
	const _chunks = value(() => {
		return decompile(a.input);
	});
	const o = {
		name: "p2pk",
		network: a.network || bitcoin
	};
	prop(o, "output", () => {
		if (!a.pubkey) return;
		return compile([a.pubkey, OPS$5.OP_CHECKSIG]);
	});
	prop(o, "pubkey", () => {
		if (!a.output) return;
		return a.output.slice(1, -1);
	});
	prop(o, "signature", () => {
		if (!a.input) return;
		return _chunks()[0];
	});
	prop(o, "input", () => {
		if (!a.signature) return;
		return compile([a.signature]);
	});
	prop(o, "witness", () => {
		if (!o.input) return;
		return [];
	});
	if (opts.validate) {
		if (a.output) {
			if (a.output[a.output.length - 1] !== OPS$5.OP_CHECKSIG) throw new TypeError("Output is invalid");
			if (!isPoint(o.pubkey)) throw new TypeError("Output pubkey is invalid");
			if (a.pubkey && compare(a.pubkey, o.pubkey) !== 0) throw new TypeError("Pubkey mismatch");
		}
		if (a.signature) {
			if (a.input && compare(a.input, o.input) !== 0) throw new TypeError("Signature mismatch");
		}
		if (a.input) {
			if (_chunks().length !== 1) throw new TypeError("Input is invalid");
			if (!isCanonicalScriptSignature(o.signature)) throw new TypeError("Input has invalid signature");
		}
	}
	return Object.assign(o, a);
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/crypto.js
/**
* A module for hashing functions.
* include ripemd160、sha1、sha256、hash160、hash256、taggedHash
*
* @packageDocumentation
*/
var crypto_exports = /* @__PURE__ */ __exportAll({
	TAGGED_HASH_PREFIXES: () => TAGGED_HASH_PREFIXES,
	TAGS: () => TAGS,
	hash160: () => hash160,
	hash256: () => hash256,
	ripemd160: () => ripemd160,
	sha1: () => sha1,
	sha256: () => sha256,
	taggedHash: () => taggedHash
});
/**
* Computes the HASH160 (RIPEMD-160 after SHA-256) of the given buffer.
*
* @param buffer - The input data to be hashed.
* @returns The HASH160 of the input buffer.
*/
function hash160(buffer) {
	return ripemd160(sha256(buffer));
}
/**
* Computes the double SHA-256 hash of the given buffer.
*
* @param buffer - The input data to be hashed.
* @returns The double SHA-256 hash of the input buffer.
*/
function hash256(buffer) {
	return sha256(sha256(buffer));
}
var TAGS = [
	"BIP0340/challenge",
	"BIP0340/aux",
	"BIP0340/nonce",
	"TapLeaf",
	"TapBranch",
	"TapSighash",
	"TapTweak",
	"KeyAgg list",
	"KeyAgg coefficient"
];
/**
* A collection of tagged hash prefixes used in various BIP (Bitcoin Improvement Proposals)
* and Taproot-related operations. Each prefix is represented as a `Uint8Array`.
*
* @constant
* @type {TaggedHashPrefixes}
*
* @property {'BIP0340/challenge'} - Prefix for BIP0340 challenge.
* @property {'BIP0340/aux'} - Prefix for BIP0340 auxiliary data.
* @property {'BIP0340/nonce'} - Prefix for BIP0340 nonce.
* @property {TapLeaf} - Prefix for Taproot leaf.
* @property {TapBranch} - Prefix for Taproot branch.
* @property {TapSighash} - Prefix for Taproot sighash.
* @property {TapTweak} - Prefix for Taproot tweak.
* @property {'KeyAgg list'} - Prefix for key aggregation list.
* @property {'KeyAgg coefficient'} - Prefix for key aggregation coefficient.
*/
var TAGGED_HASH_PREFIXES = {
	"BIP0340/challenge": Uint8Array.from([
		123,
		181,
		45,
		122,
		159,
		239,
		88,
		50,
		62,
		177,
		191,
		122,
		64,
		125,
		179,
		130,
		210,
		243,
		242,
		216,
		27,
		177,
		34,
		79,
		73,
		254,
		81,
		143,
		109,
		72,
		211,
		124,
		123,
		181,
		45,
		122,
		159,
		239,
		88,
		50,
		62,
		177,
		191,
		122,
		64,
		125,
		179,
		130,
		210,
		243,
		242,
		216,
		27,
		177,
		34,
		79,
		73,
		254,
		81,
		143,
		109,
		72,
		211,
		124
	]),
	"BIP0340/aux": Uint8Array.from([
		241,
		239,
		78,
		94,
		192,
		99,
		202,
		218,
		109,
		148,
		202,
		250,
		157,
		152,
		126,
		160,
		105,
		38,
		88,
		57,
		236,
		193,
		31,
		151,
		45,
		119,
		165,
		46,
		216,
		193,
		204,
		144,
		241,
		239,
		78,
		94,
		192,
		99,
		202,
		218,
		109,
		148,
		202,
		250,
		157,
		152,
		126,
		160,
		105,
		38,
		88,
		57,
		236,
		193,
		31,
		151,
		45,
		119,
		165,
		46,
		216,
		193,
		204,
		144
	]),
	"BIP0340/nonce": Uint8Array.from([
		7,
		73,
		119,
		52,
		167,
		155,
		203,
		53,
		91,
		155,
		140,
		125,
		3,
		79,
		18,
		28,
		244,
		52,
		215,
		62,
		247,
		45,
		218,
		25,
		135,
		0,
		97,
		251,
		82,
		191,
		235,
		47,
		7,
		73,
		119,
		52,
		167,
		155,
		203,
		53,
		91,
		155,
		140,
		125,
		3,
		79,
		18,
		28,
		244,
		52,
		215,
		62,
		247,
		45,
		218,
		25,
		135,
		0,
		97,
		251,
		82,
		191,
		235,
		47
	]),
	TapLeaf: Uint8Array.from([
		174,
		234,
		143,
		220,
		66,
		8,
		152,
		49,
		5,
		115,
		75,
		88,
		8,
		29,
		30,
		38,
		56,
		211,
		95,
		28,
		181,
		64,
		8,
		212,
		211,
		87,
		202,
		3,
		190,
		120,
		233,
		238,
		174,
		234,
		143,
		220,
		66,
		8,
		152,
		49,
		5,
		115,
		75,
		88,
		8,
		29,
		30,
		38,
		56,
		211,
		95,
		28,
		181,
		64,
		8,
		212,
		211,
		87,
		202,
		3,
		190,
		120,
		233,
		238
	]),
	TapBranch: Uint8Array.from([
		25,
		65,
		161,
		242,
		229,
		110,
		185,
		95,
		162,
		169,
		241,
		148,
		190,
		92,
		1,
		247,
		33,
		111,
		51,
		237,
		130,
		176,
		145,
		70,
		52,
		144,
		208,
		91,
		245,
		22,
		160,
		21,
		25,
		65,
		161,
		242,
		229,
		110,
		185,
		95,
		162,
		169,
		241,
		148,
		190,
		92,
		1,
		247,
		33,
		111,
		51,
		237,
		130,
		176,
		145,
		70,
		52,
		144,
		208,
		91,
		245,
		22,
		160,
		21
	]),
	TapSighash: Uint8Array.from([
		244,
		10,
		72,
		223,
		75,
		42,
		112,
		200,
		180,
		146,
		75,
		242,
		101,
		70,
		97,
		237,
		61,
		149,
		253,
		102,
		163,
		19,
		235,
		135,
		35,
		117,
		151,
		198,
		40,
		228,
		160,
		49,
		244,
		10,
		72,
		223,
		75,
		42,
		112,
		200,
		180,
		146,
		75,
		242,
		101,
		70,
		97,
		237,
		61,
		149,
		253,
		102,
		163,
		19,
		235,
		135,
		35,
		117,
		151,
		198,
		40,
		228,
		160,
		49
	]),
	TapTweak: Uint8Array.from([
		232,
		15,
		225,
		99,
		156,
		156,
		160,
		80,
		227,
		175,
		27,
		57,
		193,
		67,
		198,
		62,
		66,
		156,
		188,
		235,
		21,
		217,
		64,
		251,
		181,
		197,
		161,
		244,
		175,
		87,
		197,
		233,
		232,
		15,
		225,
		99,
		156,
		156,
		160,
		80,
		227,
		175,
		27,
		57,
		193,
		67,
		198,
		62,
		66,
		156,
		188,
		235,
		21,
		217,
		64,
		251,
		181,
		197,
		161,
		244,
		175,
		87,
		197,
		233
	]),
	"KeyAgg list": Uint8Array.from([
		72,
		28,
		151,
		28,
		60,
		11,
		70,
		215,
		240,
		178,
		117,
		174,
		89,
		141,
		78,
		44,
		126,
		215,
		49,
		156,
		89,
		74,
		92,
		110,
		199,
		158,
		160,
		212,
		153,
		2,
		148,
		240,
		72,
		28,
		151,
		28,
		60,
		11,
		70,
		215,
		240,
		178,
		117,
		174,
		89,
		141,
		78,
		44,
		126,
		215,
		49,
		156,
		89,
		74,
		92,
		110,
		199,
		158,
		160,
		212,
		153,
		2,
		148,
		240
	]),
	"KeyAgg coefficient": Uint8Array.from([
		191,
		201,
		4,
		3,
		77,
		28,
		136,
		232,
		200,
		14,
		34,
		229,
		61,
		36,
		86,
		109,
		100,
		130,
		78,
		214,
		66,
		114,
		129,
		192,
		145,
		0,
		249,
		77,
		205,
		82,
		201,
		129,
		191,
		201,
		4,
		3,
		77,
		28,
		136,
		232,
		200,
		14,
		34,
		229,
		61,
		36,
		86,
		109,
		100,
		130,
		78,
		214,
		66,
		114,
		129,
		192,
		145,
		0,
		249,
		77,
		205,
		82,
		201,
		129
	])
};
/**
* Computes a tagged hash using the specified prefix and data.
*
* @param prefix - The prefix to use for the tagged hash. This should be one of the values from the `TaggedHashPrefix` enum.
* @param data - The data to hash, provided as a `Uint8Array`.
* @returns The resulting tagged hash as a `Uint8Array`.
*/
function taggedHash(prefix, data) {
	return sha256(concat([TAGGED_HASH_PREFIXES[prefix], data]));
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/payments/p2pkh.js
var OPS$4 = OPS$8;
/**
* Creates a Pay-to-Public-Key-Hash (P2PKH) payment object.
*
* @param a - The payment object containing the necessary data.
* @param opts - Optional payment options.
* @returns The P2PKH payment object.
* @throws {TypeError} If the required data is not provided or if the data is invalid.
*/
function p2pkh(a, opts) {
	if (!a.address && !a.hash && !a.output && !a.pubkey && !a.input) throw new TypeError("Not enough data");
	opts = Object.assign({ validate: true }, opts || {});
	parse(partial(object({
		network: object({}),
		address: string(),
		hash: Hash160bitSchema,
		output: NBufferSchemaFactory(25),
		pubkey: custom(isPoint),
		signature: custom(isCanonicalScriptSignature),
		input: BufferSchema
	})), a);
	const _address = value(() => {
		const payload = esm_default.decode(a.address);
		return {
			version: readUInt8(payload, 0),
			hash: payload.slice(1)
		};
	});
	const _chunks = value(() => {
		return decompile(a.input);
	});
	const network = a.network || bitcoin;
	const o = {
		name: "p2pkh",
		network
	};
	prop(o, "address", () => {
		if (!o.hash) return;
		const payload = new Uint8Array(21);
		writeUInt8(payload, 0, network.pubKeyHash);
		payload.set(o.hash, 1);
		return esm_default.encode(payload);
	});
	prop(o, "hash", () => {
		if (a.output) return a.output.slice(3, 23);
		if (a.address) return _address().hash;
		if (a.pubkey || o.pubkey) return hash160(a.pubkey || o.pubkey);
	});
	prop(o, "output", () => {
		if (!o.hash) return;
		return compile([
			OPS$4.OP_DUP,
			OPS$4.OP_HASH160,
			o.hash,
			OPS$4.OP_EQUALVERIFY,
			OPS$4.OP_CHECKSIG
		]);
	});
	prop(o, "pubkey", () => {
		if (!a.input) return;
		return _chunks()[1];
	});
	prop(o, "signature", () => {
		if (!a.input) return;
		return _chunks()[0];
	});
	prop(o, "input", () => {
		if (!a.pubkey) return;
		if (!a.signature) return;
		return compile([a.signature, a.pubkey]);
	});
	prop(o, "witness", () => {
		if (!o.input) return;
		return [];
	});
	if (opts.validate) {
		let hash = Uint8Array.from([]);
		if (a.address) {
			if (_address().version !== network.pubKeyHash) throw new TypeError("Invalid version or Network mismatch");
			if (_address().hash.length !== 20) throw new TypeError("Invalid address");
			hash = _address().hash;
		}
		if (a.hash) if (hash.length > 0 && compare(hash, a.hash) !== 0) throw new TypeError("Hash mismatch");
		else hash = a.hash;
		if (a.output) {
			if (a.output.length !== 25 || a.output[0] !== OPS$4.OP_DUP || a.output[1] !== OPS$4.OP_HASH160 || a.output[2] !== 20 || a.output[23] !== OPS$4.OP_EQUALVERIFY || a.output[24] !== OPS$4.OP_CHECKSIG) throw new TypeError("Output is invalid");
			const hash2 = a.output.slice(3, 23);
			if (hash.length > 0 && compare(hash, hash2) !== 0) throw new TypeError("Hash mismatch");
			else hash = hash2;
		}
		if (a.pubkey) {
			const pkh = hash160(a.pubkey);
			if (hash.length > 0 && compare(hash, pkh) !== 0) throw new TypeError("Hash mismatch");
			else hash = pkh;
		}
		if (a.input) {
			const chunks = _chunks();
			if (chunks.length !== 2) throw new TypeError("Input is invalid");
			if (!isCanonicalScriptSignature(chunks[0])) throw new TypeError("Input has invalid signature");
			if (!isPoint(chunks[1])) throw new TypeError("Input has invalid pubkey");
			if (a.signature && compare(a.signature, chunks[0]) !== 0) throw new TypeError("Signature mismatch");
			if (a.pubkey && compare(a.pubkey, chunks[1]) !== 0) throw new TypeError("Pubkey mismatch");
			const pkh = hash160(chunks[1]);
			if (hash.length > 0 && compare(hash, pkh) !== 0) throw new TypeError("Hash mismatch");
		}
	}
	return Object.assign(o, a);
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/payments/p2sh.js
var OPS$3 = OPS$8;
/**
* Creates a Pay-to-Script-Hash (P2SH) payment object.
*
* @param a - The payment object containing the necessary data.
* @param opts - Optional payment options.
* @returns The P2SH payment object.
* @throws {TypeError} If the required data is not provided or if the data is invalid.
*/
function p2sh(a, opts) {
	if (!a.address && !a.hash && !a.output && !a.redeem && !a.input) throw new TypeError("Not enough data");
	opts = Object.assign({ validate: true }, opts || {});
	parse(partial(object({
		network: object({}),
		address: string(),
		hash: NBufferSchemaFactory(20),
		output: NBufferSchemaFactory(23),
		redeem: partial(object({
			network: object({}),
			output: BufferSchema,
			input: BufferSchema,
			witness: array(BufferSchema)
		})),
		input: BufferSchema,
		witness: array(BufferSchema)
	})), a);
	let network = a.network;
	if (!network) network = a.redeem && a.redeem.network || bitcoin;
	const o = { network };
	const _address = value(() => {
		const payload = esm_default.decode(a.address);
		return {
			version: readUInt8(payload, 0),
			hash: payload.slice(1)
		};
	});
	const _chunks = value(() => {
		return decompile(a.input);
	});
	const _redeem = value(() => {
		const chunks = _chunks();
		const lastChunk = chunks[chunks.length - 1];
		return {
			network,
			output: lastChunk === OPS$3.OP_FALSE ? Uint8Array.from([]) : lastChunk,
			input: compile(chunks.slice(0, -1)),
			witness: a.witness || []
		};
	});
	prop(o, "address", () => {
		if (!o.hash) return;
		const payload = new Uint8Array(21);
		writeUInt8(payload, 0, o.network.scriptHash);
		payload.set(o.hash, 1);
		return esm_default.encode(payload);
	});
	prop(o, "hash", () => {
		if (a.output) return a.output.slice(2, 22);
		if (a.address) return _address().hash;
		if (o.redeem && o.redeem.output) return hash160(o.redeem.output);
	});
	prop(o, "output", () => {
		if (!o.hash) return;
		return compile([
			OPS$3.OP_HASH160,
			o.hash,
			OPS$3.OP_EQUAL
		]);
	});
	prop(o, "redeem", () => {
		if (!a.input) return;
		return _redeem();
	});
	prop(o, "input", () => {
		if (!a.redeem || !a.redeem.input || !a.redeem.output) return;
		return compile([].concat(decompile(a.redeem.input), a.redeem.output));
	});
	prop(o, "witness", () => {
		if (o.redeem && o.redeem.witness) return o.redeem.witness;
		if (o.input) return [];
	});
	prop(o, "name", () => {
		const nameParts = ["p2sh"];
		if (o.redeem !== void 0 && o.redeem.name !== void 0) nameParts.push(o.redeem.name);
		return nameParts.join("-");
	});
	if (opts.validate) {
		let hash = Uint8Array.from([]);
		if (a.address) {
			if (_address().version !== network.scriptHash) throw new TypeError("Invalid version or Network mismatch");
			if (_address().hash.length !== 20) throw new TypeError("Invalid address");
			hash = _address().hash;
		}
		if (a.hash) if (hash.length > 0 && compare(hash, a.hash) !== 0) throw new TypeError("Hash mismatch");
		else hash = a.hash;
		if (a.output) {
			if (a.output.length !== 23 || a.output[0] !== OPS$3.OP_HASH160 || a.output[1] !== 20 || a.output[22] !== OPS$3.OP_EQUAL) throw new TypeError("Output is invalid");
			const hash2 = a.output.slice(2, 22);
			if (hash.length > 0 && compare(hash, hash2) !== 0) throw new TypeError("Hash mismatch");
			else hash = hash2;
		}
		const checkRedeem = (redeem) => {
			if (redeem.output) {
				const decompile$2 = decompile(redeem.output);
				if (!decompile$2 || decompile$2.length < 1) throw new TypeError("Redeem.output too short");
				if (redeem.output.byteLength > 520) throw new TypeError("Redeem.output unspendable if larger than 520 bytes");
				if (countNonPushOnlyOPs(decompile$2) > 201) throw new TypeError("Redeem.output unspendable with more than 201 non-push ops");
				const hash2 = hash160(redeem.output);
				if (hash.length > 0 && compare(hash, hash2) !== 0) throw new TypeError("Hash mismatch");
				else hash = hash2;
			}
			if (redeem.input) {
				const hasInput = redeem.input.length > 0;
				const hasWitness = redeem.witness && redeem.witness.length > 0;
				if (!hasInput && !hasWitness) throw new TypeError("Empty input");
				if (hasInput && hasWitness) throw new TypeError("Input and witness provided");
				if (hasInput) {
					if (!isPushOnly(decompile(redeem.input))) throw new TypeError("Non push-only scriptSig");
				}
			}
		};
		if (a.input) {
			const chunks = _chunks();
			if (!chunks || chunks.length < 1) throw new TypeError("Input too short");
			if (!(_redeem().output instanceof Uint8Array)) throw new TypeError("Input is invalid");
			checkRedeem(_redeem());
		}
		if (a.redeem) {
			if (a.redeem.network && a.redeem.network !== network) throw new TypeError("Network mismatch");
			if (a.input) {
				const redeem = _redeem();
				if (a.redeem.output && compare(a.redeem.output, redeem.output) !== 0) throw new TypeError("Redeem.output mismatch");
				if (a.redeem.input && compare(a.redeem.input, redeem.input) !== 0) throw new TypeError("Redeem.input mismatch");
			}
			checkRedeem(a.redeem);
		}
		if (a.witness) {
			if (a.redeem && a.redeem.witness && !stacksEqual(a.redeem.witness, a.witness)) throw new TypeError("Witness and redeem.witness mismatch");
		}
	}
	return Object.assign(o, a);
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/payments/p2wpkh.js
var import_dist = require_dist();
var OPS$2 = OPS$8;
var EMPTY_BUFFER$2 = new Uint8Array(0);
/**
* Creates a pay-to-witness-public-key-hash (p2wpkh) payment object.
*
* @param a - The payment object containing the necessary data.
* @param opts - Optional payment options.
* @returns The p2wpkh payment object.
* @throws {TypeError} If the required data is missing or invalid.
*/
function p2wpkh(a, opts) {
	if (!a.address && !a.hash && !a.output && !a.pubkey && !a.witness) throw new TypeError("Not enough data");
	opts = Object.assign({ validate: true }, opts || {});
	parse(partial(object({
		address: string(),
		hash: NBufferSchemaFactory(20),
		input: NBufferSchemaFactory(0),
		network: object({}),
		output: NBufferSchemaFactory(22),
		pubkey: custom(isPoint, "Not a valid pubkey"),
		signature: custom(isCanonicalScriptSignature),
		witness: array(BufferSchema)
	})), a);
	const _address = value(() => {
		const result = import_dist.bech32.decode(a.address);
		const version = result.words.shift();
		const data = import_dist.bech32.fromWords(result.words);
		return {
			version,
			prefix: result.prefix,
			data: Uint8Array.from(data)
		};
	});
	const network = a.network || bitcoin;
	const o = {
		name: "p2wpkh",
		network
	};
	prop(o, "address", () => {
		if (!o.hash) return;
		const words = import_dist.bech32.toWords(o.hash);
		words.unshift(0);
		return import_dist.bech32.encode(network.bech32, words);
	});
	prop(o, "hash", () => {
		if (a.output) return a.output.slice(2, 22);
		if (a.address) return _address().data;
		if (a.pubkey || o.pubkey) return hash160(a.pubkey || o.pubkey);
	});
	prop(o, "output", () => {
		if (!o.hash) return;
		return compile([OPS$2.OP_0, o.hash]);
	});
	prop(o, "pubkey", () => {
		if (a.pubkey) return a.pubkey;
		if (!a.witness) return;
		return a.witness[1];
	});
	prop(o, "signature", () => {
		if (!a.witness) return;
		return a.witness[0];
	});
	prop(o, "input", () => {
		if (!o.witness) return;
		return EMPTY_BUFFER$2;
	});
	prop(o, "witness", () => {
		if (!a.pubkey) return;
		if (!a.signature) return;
		return [a.signature, a.pubkey];
	});
	if (opts.validate) {
		let hash = Uint8Array.from([]);
		if (a.address) {
			if (network && network.bech32 !== _address().prefix) throw new TypeError("Invalid prefix or Network mismatch");
			if (_address().version !== 0) throw new TypeError("Invalid address version");
			if (_address().data.length !== 20) throw new TypeError("Invalid address data");
			hash = _address().data;
		}
		if (a.hash) if (hash.length > 0 && compare(hash, a.hash) !== 0) throw new TypeError("Hash mismatch");
		else hash = a.hash;
		if (a.output) {
			if (a.output.length !== 22 || a.output[0] !== OPS$2.OP_0 || a.output[1] !== 20) throw new TypeError("Output is invalid");
			if (hash.length > 0 && compare(hash, a.output.slice(2)) !== 0) throw new TypeError("Hash mismatch");
			else hash = a.output.slice(2);
		}
		if (a.pubkey) {
			const pkh = hash160(a.pubkey);
			if (hash.length > 0 && compare(hash, pkh) !== 0) throw new TypeError("Hash mismatch");
			else hash = pkh;
			if (!isPoint(a.pubkey) || a.pubkey.length !== 33) throw new TypeError("Invalid pubkey for p2wpkh");
		}
		if (a.witness) {
			if (a.witness.length !== 2) throw new TypeError("Witness is invalid");
			if (!isCanonicalScriptSignature(a.witness[0])) throw new TypeError("Witness has invalid signature");
			if (!isPoint(a.witness[1]) || a.witness[1].length !== 33) throw new TypeError("Witness has invalid pubkey");
			if (a.signature && compare(a.signature, a.witness[0]) !== 0) throw new TypeError("Signature mismatch");
			if (a.pubkey && compare(a.pubkey, a.witness[1]) !== 0) throw new TypeError("Pubkey mismatch");
			const pkh = hash160(a.witness[1]);
			if (hash.length > 0 && compare(hash, pkh) !== 0) throw new TypeError("Hash mismatch");
		}
	}
	return Object.assign(o, a);
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/payments/p2wsh.js
var OPS$1 = OPS$8;
var EMPTY_BUFFER$1 = new Uint8Array(0);
function chunkHasUncompressedPubkey(chunk) {
	if (chunk instanceof Uint8Array && chunk.length === 65 && chunk[0] === 4 && isPoint(chunk)) return true;
	else return false;
}
/**
* Creates a Pay-to-Witness-Script-Hash (P2WSH) payment object.
*
* @param a - The payment object containing the necessary data.
* @param opts - Optional payment options.
* @returns The P2WSH payment object.
* @throws {TypeError} If the required data is missing or invalid.
*/
function p2wsh(a, opts) {
	if (!a.address && !a.hash && !a.output && !a.redeem && !a.witness) throw new TypeError("Not enough data");
	opts = Object.assign({ validate: true }, opts || {});
	parse(NullablePartial({
		network: object({}),
		address: string(),
		hash: Buffer256bitSchema,
		output: NBufferSchemaFactory(34),
		redeem: NullablePartial({
			input: BufferSchema,
			network: object({}),
			output: BufferSchema,
			witness: array(BufferSchema)
		}),
		input: NBufferSchemaFactory(0),
		witness: array(BufferSchema)
	}), a);
	const _address = value(() => {
		const result = import_dist.bech32.decode(a.address);
		const version = result.words.shift();
		const data = import_dist.bech32.fromWords(result.words);
		return {
			version,
			prefix: result.prefix,
			data: Uint8Array.from(data)
		};
	});
	const _rchunks = value(() => {
		return decompile(a.redeem.input);
	});
	let network = a.network;
	if (!network) network = a.redeem && a.redeem.network || bitcoin;
	const o = { network };
	prop(o, "address", () => {
		if (!o.hash) return;
		const words = import_dist.bech32.toWords(o.hash);
		words.unshift(0);
		return import_dist.bech32.encode(network.bech32, words);
	});
	prop(o, "hash", () => {
		if (a.output) return a.output.slice(2);
		if (a.address) return _address().data;
		if (o.redeem && o.redeem.output) return sha256(o.redeem.output);
	});
	prop(o, "output", () => {
		if (!o.hash) return;
		return compile([OPS$1.OP_0, o.hash]);
	});
	prop(o, "redeem", () => {
		if (!a.witness) return;
		return {
			output: a.witness[a.witness.length - 1],
			input: EMPTY_BUFFER$1,
			witness: a.witness.slice(0, -1)
		};
	});
	prop(o, "input", () => {
		if (!o.witness) return;
		return EMPTY_BUFFER$1;
	});
	prop(o, "witness", () => {
		if (a.redeem && a.redeem.input && a.redeem.input.length > 0 && a.redeem.output && a.redeem.output.length > 0) {
			const stack = toStack(_rchunks());
			o.redeem = Object.assign({ witness: stack }, a.redeem);
			o.redeem.input = EMPTY_BUFFER$1;
			return [].concat(stack, a.redeem.output);
		}
		if (!a.redeem) return;
		if (!a.redeem.output) return;
		if (!a.redeem.witness) return;
		return [].concat(a.redeem.witness, a.redeem.output);
	});
	prop(o, "name", () => {
		const nameParts = ["p2wsh"];
		if (o.redeem !== void 0 && o.redeem.name !== void 0) nameParts.push(o.redeem.name);
		return nameParts.join("-");
	});
	if (opts.validate) {
		let hash = Uint8Array.from([]);
		if (a.address) {
			if (_address().prefix !== network.bech32) throw new TypeError("Invalid prefix or Network mismatch");
			if (_address().version !== 0) throw new TypeError("Invalid address version");
			if (_address().data.length !== 32) throw new TypeError("Invalid address data");
			hash = _address().data;
		}
		if (a.hash) if (hash.length > 0 && compare(hash, a.hash) !== 0) throw new TypeError("Hash mismatch");
		else hash = a.hash;
		if (a.output) {
			if (a.output.length !== 34 || a.output[0] !== OPS$1.OP_0 || a.output[1] !== 32) throw new TypeError("Output is invalid");
			const hash2 = a.output.slice(2);
			if (hash.length > 0 && compare(hash, hash2) !== 0) throw new TypeError("Hash mismatch");
			else hash = hash2;
		}
		if (a.redeem) {
			if (a.redeem.network && a.redeem.network !== network) throw new TypeError("Network mismatch");
			if (a.redeem.input && a.redeem.input.length > 0 && a.redeem.witness && a.redeem.witness.length > 0) throw new TypeError("Ambiguous witness source");
			if (a.redeem.output) {
				const decompile$1 = decompile(a.redeem.output);
				if (!decompile$1 || decompile$1.length < 1) throw new TypeError("Redeem.output is invalid");
				if (a.redeem.output.byteLength > 3600) throw new TypeError("Redeem.output unspendable if larger than 3600 bytes");
				if (countNonPushOnlyOPs(decompile$1) > 201) throw new TypeError("Redeem.output unspendable with more than 201 non-push ops");
				const hash2 = sha256(a.redeem.output);
				if (hash.length > 0 && compare(hash, hash2) !== 0) throw new TypeError("Hash mismatch");
				else hash = hash2;
			}
			if (a.redeem.input && !isPushOnly(_rchunks())) throw new TypeError("Non push-only scriptSig");
			if (a.witness && a.redeem.witness && !stacksEqual(a.witness, a.redeem.witness)) throw new TypeError("Witness and redeem.witness mismatch");
			if (a.redeem.input && _rchunks().some(chunkHasUncompressedPubkey) || a.redeem.output && (decompile(a.redeem.output) || []).some(chunkHasUncompressedPubkey)) throw new TypeError("redeem.input or redeem.output contains uncompressed pubkey");
		}
		if (a.witness && a.witness.length > 0) {
			const wScript = a.witness[a.witness.length - 1];
			if (a.redeem && a.redeem.output && compare(a.redeem.output, wScript) !== 0) throw new TypeError("Witness and redeem.output mismatch");
			if (a.witness.some(chunkHasUncompressedPubkey) || (decompile(wScript) || []).some(chunkHasUncompressedPubkey)) throw new TypeError("Witness contains uncompressed pubkey");
		}
	}
	return Object.assign(o, a);
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/ecc_lib.js
var _ECCLIB_CACHE = {};
/**
* Initializes the ECC library with the provided instance.
* If `eccLib` is `undefined`, the library will be cleared.
* If `eccLib` is a new instance, it will be verified before setting it as the active library.
*
* @param eccLib The instance of the ECC library to initialize.
* @param opts Extra initialization options. Use {DANGER_DO_NOT_VERIFY_ECCLIB:true} if ecc verification should not be executed. Not recommended!
*/
function initEccLib(eccLib, opts) {
	if (!eccLib) _ECCLIB_CACHE.eccLib = eccLib;
	else if (eccLib !== _ECCLIB_CACHE.eccLib) {
		if (!opts?.DANGER_DO_NOT_VERIFY_ECCLIB) verifyEcc(eccLib);
		_ECCLIB_CACHE.eccLib = eccLib;
	}
}
/**
* Retrieves the ECC Library instance.
* Throws an error if the ECC Library is not provided.
* You must call initEccLib() with a valid TinySecp256k1Interface instance before calling this function.
* @returns The ECC Library instance.
* @throws Error if the ECC Library is not provided.
*/
function getEccLib() {
	if (!_ECCLIB_CACHE.eccLib) throw new Error("No ECC Library provided. You must call initEccLib() with a valid TinySecp256k1Interface instance");
	return _ECCLIB_CACHE.eccLib;
}
var h = (hex) => fromHex(hex);
/**
* Verifies the ECC functionality.
*
* @param ecc - The TinySecp256k1Interface object.
*/
function verifyEcc(ecc) {
	assert(typeof ecc.isXOnlyPoint === "function");
	assert(ecc.isXOnlyPoint(h("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798")));
	assert(ecc.isXOnlyPoint(h("fffffffffffffffffffffffffffffffffffffffffffffffffffffffeeffffc2e")));
	assert(ecc.isXOnlyPoint(h("f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9")));
	assert(ecc.isXOnlyPoint(h("0000000000000000000000000000000000000000000000000000000000000001")));
	assert(!ecc.isXOnlyPoint(h("0000000000000000000000000000000000000000000000000000000000000000")));
	assert(!ecc.isXOnlyPoint(h("fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f")));
	assert(typeof ecc.xOnlyPointAddTweak === "function");
	tweakAddVectors.forEach((t) => {
		const r = ecc.xOnlyPointAddTweak(h(t.pubkey), h(t.tweak));
		if (t.result === null) assert(r === null);
		else {
			assert(r !== null);
			assert(r.parity === t.parity);
			assert(compare(r.xOnlyPubkey, h(t.result)) === 0);
		}
	});
}
function assert(bool) {
	if (!bool) throw new Error("ecc library invalid");
}
var tweakAddVectors = [
	{
		pubkey: "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		tweak: "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140",
		parity: -1,
		result: null
	},
	{
		pubkey: "1617d38ed8d8657da4d4761e8057bc396ea9e4b9d29776d4be096016dbd2509b",
		tweak: "a8397a935f0dfceba6ba9618f6451ef4d80637abf4e6af2669fbc9de6a8fd2ac",
		parity: 1,
		result: "e478f99dab91052ab39a33ea35fd5e6e4933f4d28023cd597c9a1f6760346adf"
	},
	{
		pubkey: "2c0b7cf95324a07d05398b240174dc0c2be444d96b159aa6c7f7b1e668680991",
		tweak: "823c3cd2142744b075a87eade7e1b8678ba308d566226a0056ca2b7a76f86b47",
		parity: 0,
		result: "9534f8dc8c6deda2dc007655981c78b49c5d96c778fbf363462a11ec9dfd948c"
	}
];
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/bufferutils.js
var MAX_JS_NUMBER = 9007199254740991;
function verifuint(value, max) {
	if (typeof value !== "number" && typeof value !== "bigint") throw new Error("cannot write a non-number as a number");
	if (value < 0 && value < BigInt(0)) throw new Error("specified a negative value for writing an unsigned value");
	if (value > max && value > BigInt(max)) throw new Error("RangeError: value out of range");
	if (Math.floor(Number(value)) !== Number(value)) throw new Error("value has a fractional component");
}
/**
* Reverses the order of bytes in a buffer.
* @param buffer - The buffer to reverse.
* @returns A new buffer with the bytes reversed.
*/
function reverseBuffer(buffer) {
	if (buffer.length < 1) return buffer;
	let j = buffer.length - 1;
	let tmp = 0;
	for (let i = 0; i < buffer.length / 2; i++) {
		tmp = buffer[i];
		buffer[i] = buffer[j];
		buffer[j] = tmp;
		j--;
	}
	return buffer;
}
function cloneBuffer(buffer) {
	const clone = new Uint8Array(buffer.length);
	clone.set(buffer);
	return clone;
}
/**
* Helper class for serialization of bitcoin data types into a pre-allocated buffer.
*/
var BufferWriter = class BufferWriter {
	buffer;
	offset;
	static withCapacity(size) {
		return new BufferWriter(new Uint8Array(size));
	}
	constructor(buffer, offset = 0) {
		this.buffer = buffer;
		this.offset = offset;
		parse(tuple([BufferSchema, UInt32Schema]), [buffer, offset]);
	}
	writeUInt8(i) {
		this.offset = writeUInt8(this.buffer, this.offset, i);
	}
	writeInt32(i) {
		this.offset = writeInt32(this.buffer, this.offset, i, "LE");
	}
	writeInt64(i) {
		this.offset = writeInt64(this.buffer, this.offset, BigInt(i), "LE");
	}
	writeUInt32(i) {
		this.offset = writeUInt32(this.buffer, this.offset, i, "LE");
	}
	writeUInt64(i) {
		this.offset = writeUInt64(this.buffer, this.offset, BigInt(i), "LE");
	}
	writeVarInt(i) {
		const { bytes } = encode$4(i, this.buffer, this.offset);
		this.offset += bytes;
	}
	writeSlice(slice) {
		if (this.buffer.length < this.offset + slice.length) throw new Error("Cannot write slice out of bounds");
		this.buffer.set(slice, this.offset);
		this.offset += slice.length;
	}
	writeVarSlice(slice) {
		this.writeVarInt(slice.length);
		this.writeSlice(slice);
	}
	writeVector(vector) {
		this.writeVarInt(vector.length);
		vector.forEach((buf) => this.writeVarSlice(buf));
	}
	end() {
		if (this.buffer.length === this.offset) return this.buffer;
		throw new Error(`buffer size ${this.buffer.length}, offset ${this.offset}`);
	}
};
/**
* Helper class for reading of bitcoin data types from a buffer.
*/
var BufferReader = class {
	buffer;
	offset;
	constructor(buffer, offset = 0) {
		this.buffer = buffer;
		this.offset = offset;
		parse(tuple([BufferSchema, UInt32Schema]), [buffer, offset]);
	}
	readUInt8() {
		const result = readUInt8(this.buffer, this.offset);
		this.offset++;
		return result;
	}
	readInt32() {
		const result = readInt32(this.buffer, this.offset, "LE");
		this.offset += 4;
		return result;
	}
	readUInt32() {
		const result = readUInt32(this.buffer, this.offset, "LE");
		this.offset += 4;
		return result;
	}
	readInt64() {
		const result = readInt64(this.buffer, this.offset, "LE");
		this.offset += 8;
		return result;
	}
	readVarInt() {
		const { bigintValue, bytes } = decode$4(this.buffer, this.offset);
		this.offset += bytes;
		return bigintValue;
	}
	readSlice(n) {
		verifuint(n, MAX_JS_NUMBER);
		const num = Number(n);
		if (this.buffer.length < this.offset + num) throw new Error("Cannot read slice out of bounds");
		const result = this.buffer.slice(this.offset, this.offset + num);
		this.offset += num;
		return result;
	}
	readVarSlice() {
		return this.readSlice(this.readVarInt());
	}
	readVector() {
		const count = this.readVarInt();
		const vector = [];
		for (let i = 0; i < count; i++) vector.push(this.readVarSlice());
		return vector;
	}
};
var isHashBranch = (ht) => "left" in ht && "right" in ht;
/**
* Calculates the root hash from a given control block and leaf hash.
* @param controlBlock - The control block buffer.
* @param leafHash - The leaf hash buffer.
* @returns The root hash buffer.
* @throws {TypeError} If the control block length is less than 33.
*/
function rootHashFromPath(controlBlock, leafHash) {
	if (controlBlock.length < 33) throw new TypeError(`The control-block length is too small. Got ${controlBlock.length}, expected min 33.`);
	const m = (controlBlock.length - 33) / 32;
	let kj = leafHash;
	for (let j = 0; j < m; j++) {
		const ej = controlBlock.slice(33 + 32 * j, 65 + 32 * j);
		if (compare(kj, ej) < 0) kj = tapBranchHash(kj, ej);
		else kj = tapBranchHash(ej, kj);
	}
	return kj;
}
/**
* Build a hash tree of merkle nodes from the scripts binary tree.
* @param scriptTree - the tree of scripts to pairwise hash.
*/
function toHashTree(scriptTree) {
	if (isTapleaf(scriptTree)) return { hash: tapleafHash(scriptTree) };
	const hashes = [toHashTree(scriptTree[0]), toHashTree(scriptTree[1])];
	hashes.sort((a, b) => compare(a.hash, b.hash));
	const [left, right] = hashes;
	return {
		hash: tapBranchHash(left.hash, right.hash),
		left,
		right
	};
}
/**
* Given a HashTree, finds the path from a particular hash to the root.
* @param node - the root of the tree
* @param hash - the hash to search for
* @returns - array of sibling hashes, from leaf (inclusive) to root
* (exclusive) needed to prove inclusion of the specified hash. undefined if no
* path is found
*/
function findScriptPath(node, hash) {
	if (isHashBranch(node)) {
		const leftPath = findScriptPath(node.left, hash);
		if (leftPath !== void 0) return [...leftPath, node.right.hash];
		const rightPath = findScriptPath(node.right, hash);
		if (rightPath !== void 0) return [...rightPath, node.left.hash];
	} else if (compare(node.hash, hash) === 0) return [];
}
/**
* Calculates the tapleaf hash for a given Tapleaf object.
* @param leaf - The Tapleaf object to calculate the hash for.
* @returns The tapleaf hash as a Buffer.
*/
function tapleafHash(leaf) {
	const version = leaf.version || 192;
	return taggedHash("TapLeaf", concat([Uint8Array.from([version]), serializeScript(leaf.output)]));
}
/**
* Computes the taproot tweak hash for a given public key and optional hash.
* If a hash is provided, the public key and hash are concatenated before computing the hash.
* If no hash is provided, only the public key is used to compute the hash.
*
* @param pubKey - The public key buffer.
* @param h - The optional hash buffer.
* @returns The taproot tweak hash.
*/
function tapTweakHash(pubKey, h) {
	return taggedHash("TapTweak", concat(h ? [pubKey, h] : [pubKey]));
}
/**
* Tweak a public key with a given tweak hash.
* @param pubKey - The public key to be tweaked.
* @param h - The tweak hash.
* @returns The tweaked public key or null if the input is invalid.
*/
function tweakKey(pubKey, h) {
	if (!(pubKey instanceof Uint8Array)) return null;
	if (pubKey.length !== 32) return null;
	if (h && h.length !== 32) return null;
	const tweakHash = tapTweakHash(pubKey, h);
	const res = getEccLib().xOnlyPointAddTweak(pubKey, tweakHash);
	if (!res || res.xOnlyPubkey === null) return null;
	return {
		parity: res.parity,
		x: Uint8Array.from(res.xOnlyPubkey)
	};
}
/**
* Computes the TapBranch hash by concatenating two buffers and applying the 'TapBranch' tagged hash algorithm.
*
* @param a - The first buffer.
* @param b - The second buffer.
* @returns The TapBranch hash of the concatenated buffers.
*/
function tapBranchHash(a, b) {
	return taggedHash("TapBranch", concat([a, b]));
}
/**
* Serializes a script by encoding its length as a varint and concatenating it with the script.
*
* @param s - The script to be serialized.
* @returns The serialized script as a Buffer.
*/
function serializeScript(s) {
	const varintLen = encodingLength$1(s.length);
	const buffer = new Uint8Array(varintLen);
	encode$4(s.length, buffer);
	return concat([buffer, s]);
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/payments/p2tr.js
var OPS = OPS$8;
var TAPROOT_WITNESS_VERSION = 1;
var ANNEX_PREFIX = 80;
/**
* Creates a Pay-to-Taproot (P2TR) payment object.
*
* @param a - The payment object containing the necessary data for P2TR.
* @param opts - Optional payment options.
* @returns The P2TR payment object.
* @throws {TypeError} If the provided data is invalid or insufficient.
*/
function p2tr(a, opts) {
	if (!a.address && !a.output && !a.pubkey && !a.internalPubkey && !(a.witness && a.witness.length > 1)) throw new TypeError("Not enough data");
	opts = Object.assign({ validate: true }, opts || {});
	parse(partial(object({
		address: string(),
		input: NBufferSchemaFactory(0),
		network: object({}),
		output: NBufferSchemaFactory(34),
		internalPubkey: NBufferSchemaFactory(32),
		hash: NBufferSchemaFactory(32),
		pubkey: NBufferSchemaFactory(32),
		signature: union([NBufferSchemaFactory(64), NBufferSchemaFactory(65)]),
		witness: array(BufferSchema),
		scriptTree: custom(isTaptree, "Taptree is not of type isTaptree"),
		redeem: partial(object({
			output: BufferSchema,
			redeemVersion: number$2(),
			witness: array(BufferSchema)
		})),
		redeemVersion: number$2()
	})), a);
	const _address = value(() => {
		return fromBech32(a.address);
	});
	const _witness = value(() => {
		if (!a.witness || !a.witness.length) return;
		if (a.witness.length >= 2 && a.witness[a.witness.length - 1][0] === ANNEX_PREFIX) return a.witness.slice(0, -1);
		return a.witness.slice();
	});
	const _hashTree = value(() => {
		if (a.scriptTree) return toHashTree(a.scriptTree);
		if (a.hash) return { hash: a.hash };
	});
	const network = a.network || bitcoin;
	const o = {
		name: "p2tr",
		network
	};
	prop(o, "address", () => {
		if (!o.pubkey) return;
		const words = import_dist.bech32m.toWords(o.pubkey);
		words.unshift(TAPROOT_WITNESS_VERSION);
		return import_dist.bech32m.encode(network.bech32, words);
	});
	prop(o, "hash", () => {
		const hashTree = _hashTree();
		if (hashTree) return hashTree.hash;
		const w = _witness();
		if (w && w.length > 1) {
			const controlBlock = w[w.length - 1];
			const leafVersion = controlBlock[0] & 254;
			const script = w[w.length - 2];
			return rootHashFromPath(controlBlock, tapleafHash({
				output: script,
				version: leafVersion
			}));
		}
		return null;
	});
	prop(o, "output", () => {
		if (!o.pubkey) return;
		return compile([OPS.OP_1, o.pubkey]);
	});
	prop(o, "redeemVersion", () => {
		if (a.redeemVersion) return a.redeemVersion;
		if (a.redeem && a.redeem.redeemVersion !== void 0 && a.redeem.redeemVersion !== null) return a.redeem.redeemVersion;
		return 192;
	});
	prop(o, "redeem", () => {
		const witness = _witness();
		if (!witness || witness.length < 2) return;
		return {
			output: witness[witness.length - 2],
			witness: witness.slice(0, -2),
			redeemVersion: witness[witness.length - 1][0] & 254
		};
	});
	prop(o, "pubkey", () => {
		if (a.pubkey) return a.pubkey;
		if (a.output) return a.output.slice(2);
		if (a.address) return _address().data;
		if (o.internalPubkey) {
			const tweakedKey = tweakKey(o.internalPubkey, o.hash);
			if (tweakedKey) return tweakedKey.x;
		}
	});
	prop(o, "internalPubkey", () => {
		if (a.internalPubkey) return a.internalPubkey;
		const witness = _witness();
		if (witness && witness.length > 1) return witness[witness.length - 1].slice(1, 33);
	});
	prop(o, "signature", () => {
		if (a.signature) return a.signature;
		const witness = _witness();
		if (!witness || witness.length !== 1) return;
		return witness[0];
	});
	prop(o, "witness", () => {
		if (a.witness) return a.witness;
		const hashTree = _hashTree();
		if (hashTree && a.redeem && a.redeem.output && a.internalPubkey) {
			const path = findScriptPath(hashTree, tapleafHash({
				output: a.redeem.output,
				version: o.redeemVersion
			}));
			if (!path) return;
			const outputKey = tweakKey(a.internalPubkey, hashTree.hash);
			if (!outputKey) return;
			const controlBock = concat([Uint8Array.from([o.redeemVersion | outputKey.parity]), a.internalPubkey].concat(path));
			return [a.redeem.output, controlBock];
		}
		if (a.signature) return [a.signature];
	});
	if (opts.validate) {
		let pubkey = Uint8Array.from([]);
		if (a.address) {
			if (network && network.bech32 !== _address().prefix) throw new TypeError("Invalid prefix or Network mismatch");
			if (_address().version !== TAPROOT_WITNESS_VERSION) throw new TypeError("Invalid address version");
			if (_address().data.length !== 32) throw new TypeError("Invalid address data");
			pubkey = _address().data;
		}
		if (a.pubkey) if (pubkey.length > 0 && compare(pubkey, a.pubkey) !== 0) throw new TypeError("Pubkey mismatch");
		else pubkey = a.pubkey;
		if (a.output) {
			if (a.output.length !== 34 || a.output[0] !== OPS.OP_1 || a.output[1] !== 32) throw new TypeError("Output is invalid");
			if (pubkey.length > 0 && compare(pubkey, a.output.slice(2)) !== 0) throw new TypeError("Pubkey mismatch");
			else pubkey = a.output.slice(2);
		}
		if (a.internalPubkey) {
			const tweakedKey = tweakKey(a.internalPubkey, o.hash);
			if (pubkey.length > 0 && compare(pubkey, tweakedKey.x) !== 0) throw new TypeError("Pubkey mismatch");
			else pubkey = tweakedKey.x;
		}
		if (pubkey && pubkey.length) {
			if (!getEccLib().isXOnlyPoint(pubkey)) throw new TypeError("Invalid pubkey for p2tr");
		}
		const hashTree = _hashTree();
		if (a.hash && hashTree) {
			if (compare(a.hash, hashTree.hash) !== 0) throw new TypeError("Hash mismatch");
		}
		if (a.redeem && a.redeem.output && hashTree) {
			if (!findScriptPath(hashTree, tapleafHash({
				output: a.redeem.output,
				version: o.redeemVersion
			}))) throw new TypeError("Redeem script not in tree");
		}
		const witness = _witness();
		if (a.redeem && o.redeem) {
			if (a.redeem.redeemVersion) {
				if (a.redeem.redeemVersion !== o.redeem.redeemVersion) throw new TypeError("Redeem.redeemVersion and witness mismatch");
			}
			if (a.redeem.output) {
				if (decompile(a.redeem.output).length === 0) throw new TypeError("Redeem.output is invalid");
				if (o.redeem.output && compare(a.redeem.output, o.redeem.output) !== 0) throw new TypeError("Redeem.output and witness mismatch");
			}
			if (a.redeem.witness) {
				if (o.redeem.witness && !stacksEqual(a.redeem.witness, o.redeem.witness)) throw new TypeError("Redeem.witness and witness mismatch");
			}
		}
		if (witness && witness.length) if (witness.length === 1) {
			if (a.signature && compare(a.signature, witness[0]) !== 0) throw new TypeError("Signature mismatch");
		} else {
			const controlBlock = witness[witness.length - 1];
			if (controlBlock.length < 33) throw new TypeError(`The control-block length is too small. Got ${controlBlock.length}, expected min 33.`);
			if ((controlBlock.length - 33) % 32 !== 0) throw new TypeError(`The control-block length of ${controlBlock.length} is incorrect!`);
			const m = (controlBlock.length - 33) / 32;
			if (m > 128) throw new TypeError(`The script path is too long. Got ${m}, expected max 128.`);
			const internalPubkey = controlBlock.slice(1, 33);
			if (a.internalPubkey && compare(a.internalPubkey, internalPubkey) !== 0) throw new TypeError("Internal pubkey mismatch");
			if (!getEccLib().isXOnlyPoint(internalPubkey)) throw new TypeError("Invalid internalPubkey for p2tr witness");
			const leafVersion = controlBlock[0] & 254;
			const script = witness[witness.length - 2];
			const outputKey = tweakKey(internalPubkey, rootHashFromPath(controlBlock, tapleafHash({
				output: script,
				version: leafVersion
			})));
			if (!outputKey) throw new TypeError("Invalid outputKey for p2tr witness");
			if (pubkey.length && compare(pubkey, outputKey.x) !== 0) throw new TypeError("Pubkey mismatch for p2tr witness");
			if (outputKey.parity !== (controlBlock[0] & 1)) throw new Error("Incorrect parity");
		}
	}
	return Object.assign(o, a);
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/payments/index.js
var payments_exports = /* @__PURE__ */ __exportAll({
	embed: () => p2data,
	p2ms: () => p2ms,
	p2pk: () => p2pk,
	p2pkh: () => p2pkh,
	p2sh: () => p2sh,
	p2tr: () => p2tr,
	p2wpkh: () => p2wpkh,
	p2wsh: () => p2wsh
});
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/address.js
var address_exports = /* @__PURE__ */ __exportAll({
	fromBase58Check: () => fromBase58Check,
	fromBech32: () => fromBech32,
	fromOutputScript: () => fromOutputScript,
	toBase58Check: () => toBase58Check,
	toBech32: () => toBech32,
	toOutputScript: () => toOutputScript
});
var FUTURE_SEGWIT_MAX_SIZE = 40;
var FUTURE_SEGWIT_MIN_SIZE = 2;
var FUTURE_SEGWIT_MAX_VERSION = 16;
var FUTURE_SEGWIT_MIN_VERSION = 2;
var FUTURE_SEGWIT_VERSION_DIFF = 80;
var FUTURE_SEGWIT_VERSION_WARNING = "WARNING: Sending to a future segwit version address can lead to loss of funds. End users MUST be warned carefully in the GUI and asked if they wish to proceed with caution. Wallets should verify the segwit version from the output of fromBech32, then decide when it is safe to use which version of segwit.";
var WARNING_STATES = [false, false];
/**
* Converts an output buffer to a future segwit address.
* @param output - The output buffer.
* @param network - The network object.
* @returns The future segwit address.
* @throws {TypeError} If the program length or version is invalid for segwit address.
*/
function _toFutureSegwitAddress(output, network) {
	const data = output.slice(2);
	if (data.length < FUTURE_SEGWIT_MIN_SIZE || data.length > FUTURE_SEGWIT_MAX_SIZE) throw new TypeError("Invalid program length for segwit address");
	const version = output[0] - FUTURE_SEGWIT_VERSION_DIFF;
	if (version < FUTURE_SEGWIT_MIN_VERSION || version > FUTURE_SEGWIT_MAX_VERSION) throw new TypeError("Invalid version for segwit address");
	if (output[1] !== data.length) throw new TypeError("Invalid script for segwit address");
	if (WARNING_STATES[0] === false) {
		console.warn(FUTURE_SEGWIT_VERSION_WARNING);
		WARNING_STATES[0] = true;
	}
	return toBech32(data, version, network.bech32);
}
/**
* Decodes a base58check encoded Bitcoin address and returns the version and hash.
*
* @param address - The base58check encoded Bitcoin address to decode.
* @returns An object containing the version and hash of the decoded address.
* @throws {TypeError} If the address is too short or too long.
*/
function fromBase58Check(address) {
	const payload = esm_default.decode(address);
	if (payload.length < 21) throw new TypeError(address + " is too short");
	if (payload.length > 21) throw new TypeError(address + " is too long");
	return {
		version: readUInt8(payload, 0),
		hash: payload.slice(1)
	};
}
/**
* Converts a Bech32 or Bech32m encoded address to its corresponding data representation.
* @param address - The Bech32 or Bech32m encoded address.
* @returns An object containing the version, prefix, and data of the address.
* @throws {TypeError} If the address uses the wrong encoding.
*/
function fromBech32(address) {
	let result;
	let version;
	try {
		result = import_dist.bech32.decode(address);
	} catch (e) {}
	if (result) {
		version = result.words[0];
		if (version !== 0) throw new TypeError(address + " uses wrong encoding");
	} else {
		result = import_dist.bech32m.decode(address);
		version = result.words[0];
		if (version === 0) throw new TypeError(address + " uses wrong encoding");
	}
	const data = import_dist.bech32.fromWords(result.words.slice(1));
	return {
		version,
		prefix: result.prefix,
		data: Uint8Array.from(data)
	};
}
/**
* Converts a hash to a Base58Check-encoded string.
* @param hash - The hash to be encoded.
* @param version - The version byte to be prepended to the encoded string.
* @returns The Base58Check-encoded string.
*/
function toBase58Check(hash, version) {
	parse(tuple([Hash160bitSchema, UInt8Schema]), [hash, version]);
	const payload = new Uint8Array(21);
	writeUInt8(payload, 0, version);
	payload.set(hash, 1);
	return esm_default.encode(payload);
}
/**
* Converts a buffer to a Bech32 or Bech32m encoded string.
* @param data - The buffer to be encoded.
* @param version - The version number to be used in the encoding.
* @param prefix - The prefix string to be used in the encoding.
* @returns The Bech32 or Bech32m encoded string.
*/
function toBech32(data, version, prefix) {
	const words = import_dist.bech32.toWords(data);
	words.unshift(version);
	return version === 0 ? import_dist.bech32.encode(prefix, words) : import_dist.bech32m.encode(prefix, words);
}
/**
* Converts an output script to a Bitcoin address.
* @param output - The output script as a Buffer.
* @param network - The Bitcoin network (optional).
* @returns The Bitcoin address corresponding to the output script.
* @throws If the output script has no matching address.
*/
function fromOutputScript(output, network) {
	network = network || bitcoin;
	try {
		return p2pkh({
			output,
			network
		}).address;
	} catch (e) {}
	try {
		return p2sh({
			output,
			network
		}).address;
	} catch (e) {}
	try {
		return p2wpkh({
			output,
			network
		}).address;
	} catch (e) {}
	try {
		return p2wsh({
			output,
			network
		}).address;
	} catch (e) {}
	try {
		return p2tr({
			output,
			network
		}).address;
	} catch (e) {}
	try {
		return _toFutureSegwitAddress(output, network);
	} catch (e) {}
	throw new Error(toASM(output) + " has no matching Address");
}
/**
* Converts a Bitcoin address to its corresponding output script.
* @param address - The Bitcoin address to convert.
* @param network - The Bitcoin network to use. Defaults to the Bitcoin network.
* @returns The corresponding output script as a Buffer.
* @throws If the address has an invalid prefix or no matching script.
*/
function toOutputScript(address, network) {
	network = network || bitcoin;
	let decodeBase58;
	let decodeBech32;
	try {
		decodeBase58 = fromBase58Check(address);
	} catch (e) {}
	if (decodeBase58) {
		if (decodeBase58.version === network.pubKeyHash) return p2pkh({ hash: decodeBase58.hash }).output;
		if (decodeBase58.version === network.scriptHash) return p2sh({ hash: decodeBase58.hash }).output;
	} else {
		try {
			decodeBech32 = fromBech32(address);
		} catch (e) {}
		if (decodeBech32) {
			if (decodeBech32.prefix !== network.bech32) throw new Error(address + " has an invalid prefix");
			if (decodeBech32.version === 0) {
				if (decodeBech32.data.length === 20) return p2wpkh({ hash: decodeBech32.data }).output;
				if (decodeBech32.data.length === 32) return p2wsh({ hash: decodeBech32.data }).output;
			} else if (decodeBech32.version === 1) {
				if (decodeBech32.data.length === 32) return p2tr({ pubkey: decodeBech32.data }).output;
			} else if (decodeBech32.version >= FUTURE_SEGWIT_MIN_VERSION && decodeBech32.version <= FUTURE_SEGWIT_MAX_VERSION && decodeBech32.data.length >= FUTURE_SEGWIT_MIN_SIZE && decodeBech32.data.length <= FUTURE_SEGWIT_MAX_SIZE) {
				if (WARNING_STATES[1] === false) {
					console.warn(FUTURE_SEGWIT_VERSION_WARNING);
					WARNING_STATES[1] = true;
				}
				return compile([decodeBech32.version + FUTURE_SEGWIT_VERSION_DIFF, decodeBech32.data]);
			}
		}
	}
	throw new Error(address + " has no matching Script");
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/merkle.js
/**
* Calculates the Merkle root of an array of buffers using a specified digest function.
*
* @param values - The array of buffers.
* @param digestFn - The digest function used to calculate the hash of the concatenated buffers.
* @returns The Merkle root as a buffer.
* @throws {TypeError} If the values parameter is not an array or the digestFn parameter is not a function.
*/
function fastMerkleRoot(values, digestFn) {
	if (!Array.isArray(values)) throw TypeError("Expected values Array");
	if (typeof digestFn !== "function") throw TypeError("Expected digest Function");
	let length = values.length;
	const results = values.concat();
	while (length > 1) {
		let j = 0;
		for (let i = 0; i < length; i += 2, ++j) {
			const left = results[i];
			results[j] = digestFn(concat([left, i + 1 === length ? left : results[i + 1]]));
		}
		length = j;
	}
	return results[0];
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/transaction.js
function varSliceSize(someScript) {
	const length = someScript.length;
	return encodingLength$1(length) + length;
}
function vectorSize(someVector) {
	const length = someVector.length;
	return encodingLength$1(length) + someVector.reduce((sum, witness) => {
		return sum + varSliceSize(witness);
	}, 0);
}
var EMPTY_BUFFER = new Uint8Array(0);
var EMPTY_WITNESS = [];
var ZERO = fromHex("0000000000000000000000000000000000000000000000000000000000000000");
var ONE = fromHex("0000000000000000000000000000000000000000000000000000000000000001");
var BLANK_OUTPUT = {
	script: EMPTY_BUFFER,
	valueBuffer: fromHex("ffffffffffffffff")
};
function isOutput(out) {
	return out.value !== void 0;
}
/**
* Represents a Bitcoin transaction.
*/
var Transaction = class Transaction {
	static DEFAULT_SEQUENCE = 4294967295;
	static SIGHASH_DEFAULT = 0;
	static SIGHASH_ALL = 1;
	static SIGHASH_NONE = 2;
	static SIGHASH_SINGLE = 3;
	static SIGHASH_ANYONECANPAY = 128;
	static SIGHASH_OUTPUT_MASK = 3;
	static SIGHASH_INPUT_MASK = 128;
	static ADVANCED_TRANSACTION_MARKER = 0;
	static ADVANCED_TRANSACTION_FLAG = 1;
	static fromBuffer(buffer, _NO_STRICT) {
		const bufferReader = new BufferReader(buffer);
		const tx = new Transaction();
		tx.version = bufferReader.readUInt32();
		const marker = bufferReader.readUInt8();
		const flag = bufferReader.readUInt8();
		let hasWitnesses = false;
		if (marker === Transaction.ADVANCED_TRANSACTION_MARKER && flag === Transaction.ADVANCED_TRANSACTION_FLAG) hasWitnesses = true;
		else bufferReader.offset -= 2;
		const vinLen = bufferReader.readVarInt();
		for (let i = 0; i < vinLen; ++i) tx.ins.push({
			hash: bufferReader.readSlice(32),
			index: bufferReader.readUInt32(),
			script: bufferReader.readVarSlice(),
			sequence: bufferReader.readUInt32(),
			witness: EMPTY_WITNESS
		});
		const voutLen = bufferReader.readVarInt();
		for (let i = 0; i < voutLen; ++i) tx.outs.push({
			value: bufferReader.readInt64(),
			script: bufferReader.readVarSlice()
		});
		if (hasWitnesses) {
			for (let i = 0; i < vinLen; ++i) tx.ins[i].witness = bufferReader.readVector();
			if (!tx.hasWitnesses()) throw new Error("Transaction has superfluous witness data");
		}
		tx.locktime = bufferReader.readUInt32();
		if (_NO_STRICT) return tx;
		if (bufferReader.offset !== buffer.length) throw new Error("Transaction has unexpected data");
		return tx;
	}
	static fromHex(hex) {
		return Transaction.fromBuffer(fromHex(hex), false);
	}
	static isCoinbaseHash(buffer) {
		parse(Hash256bitSchema, buffer);
		for (let i = 0; i < 32; ++i) if (buffer[i] !== 0) return false;
		return true;
	}
	version = 1;
	locktime = 0;
	ins = [];
	outs = [];
	isCoinbase() {
		return this.ins.length === 1 && Transaction.isCoinbaseHash(this.ins[0].hash);
	}
	addInput(hash, index, sequence, scriptSig) {
		parse(tuple([
			Hash256bitSchema,
			UInt32Schema,
			nullable(optional(UInt32Schema)),
			nullable(optional(BufferSchema))
		]), [
			hash,
			index,
			sequence,
			scriptSig
		]);
		if (sequence === void 0 || sequence === null) sequence = Transaction.DEFAULT_SEQUENCE;
		return this.ins.push({
			hash,
			index,
			script: scriptSig || EMPTY_BUFFER,
			sequence,
			witness: EMPTY_WITNESS
		}) - 1;
	}
	addOutput(scriptPubKey, value) {
		parse(tuple([BufferSchema, SatoshiSchema]), [scriptPubKey, value]);
		return this.outs.push({
			script: scriptPubKey,
			value
		}) - 1;
	}
	hasWitnesses() {
		return this.ins.some((x) => {
			return x.witness.length !== 0;
		});
	}
	stripWitnesses() {
		this.ins.forEach((input) => {
			input.witness = EMPTY_WITNESS;
		});
	}
	weight() {
		const base = this.byteLength(false);
		const total = this.byteLength(true);
		return base * 3 + total;
	}
	virtualSize() {
		return Math.ceil(this.weight() / 4);
	}
	byteLength(_ALLOW_WITNESS = true) {
		const hasWitnesses = _ALLOW_WITNESS && this.hasWitnesses();
		return (hasWitnesses ? 10 : 8) + encodingLength$1(this.ins.length) + encodingLength$1(this.outs.length) + this.ins.reduce((sum, input) => {
			return sum + 40 + varSliceSize(input.script);
		}, 0) + this.outs.reduce((sum, output) => {
			return sum + 8 + varSliceSize(output.script);
		}, 0) + (hasWitnesses ? this.ins.reduce((sum, input) => {
			return sum + vectorSize(input.witness);
		}, 0) : 0);
	}
	clone() {
		const newTx = new Transaction();
		newTx.version = this.version;
		newTx.locktime = this.locktime;
		newTx.ins = this.ins.map((txIn) => {
			return {
				hash: txIn.hash,
				index: txIn.index,
				script: txIn.script,
				sequence: txIn.sequence,
				witness: txIn.witness
			};
		});
		newTx.outs = this.outs.map((txOut) => {
			return {
				script: txOut.script,
				value: txOut.value
			};
		});
		return newTx;
	}
	/**
	* Hash transaction for signing a specific input.
	*
	* Bitcoin uses a different hash for each signed transaction input.
	* This method copies the transaction, makes the necessary changes based on the
	* hashType, and then hashes the result.
	* This hash can then be used to sign the provided transaction input.
	*/
	hashForSignature(inIndex, prevOutScript, hashType) {
		parse(tuple([
			UInt32Schema,
			BufferSchema,
			number$2()
		]), [
			inIndex,
			prevOutScript,
			hashType
		]);
		if (inIndex >= this.ins.length) return ONE;
		const ourScript = compile(decompile(prevOutScript).filter((x) => {
			return x !== OPS$8.OP_CODESEPARATOR;
		}));
		const txTmp = this.clone();
		if ((hashType & 31) === Transaction.SIGHASH_NONE) {
			txTmp.outs = [];
			txTmp.ins.forEach((input, i) => {
				if (i === inIndex) return;
				input.sequence = 0;
			});
		} else if ((hashType & 31) === Transaction.SIGHASH_SINGLE) {
			if (inIndex >= this.outs.length) return ONE;
			txTmp.outs.length = inIndex + 1;
			for (let i = 0; i < inIndex; i++) txTmp.outs[i] = BLANK_OUTPUT;
			txTmp.ins.forEach((input, y) => {
				if (y === inIndex) return;
				input.sequence = 0;
			});
		}
		if (hashType & Transaction.SIGHASH_ANYONECANPAY) {
			txTmp.ins = [txTmp.ins[inIndex]];
			txTmp.ins[0].script = ourScript;
		} else {
			txTmp.ins.forEach((input) => {
				input.script = EMPTY_BUFFER;
			});
			txTmp.ins[inIndex].script = ourScript;
		}
		const buffer = new Uint8Array(txTmp.byteLength(false) + 4);
		writeInt32(buffer, buffer.length - 4, hashType, "LE");
		txTmp.__toBuffer(buffer, 0, false);
		return hash256(buffer);
	}
	hashForWitnessV1(inIndex, prevOutScripts, values, hashType, leafHash, annex) {
		parse(tuple([
			UInt32Schema,
			array(BufferSchema),
			array(SatoshiSchema),
			UInt32Schema
		]), [
			inIndex,
			prevOutScripts,
			values,
			hashType
		]);
		if (values.length !== this.ins.length || prevOutScripts.length !== this.ins.length) throw new Error("Must supply prevout script and value for all inputs");
		const outputType = hashType === Transaction.SIGHASH_DEFAULT ? Transaction.SIGHASH_ALL : hashType & Transaction.SIGHASH_OUTPUT_MASK;
		const isAnyoneCanPay = (hashType & Transaction.SIGHASH_INPUT_MASK) === Transaction.SIGHASH_ANYONECANPAY;
		const isNone = outputType === Transaction.SIGHASH_NONE;
		const isSingle = outputType === Transaction.SIGHASH_SINGLE;
		let hashPrevouts = EMPTY_BUFFER;
		let hashAmounts = EMPTY_BUFFER;
		let hashScriptPubKeys = EMPTY_BUFFER;
		let hashSequences = EMPTY_BUFFER;
		let hashOutputs = EMPTY_BUFFER;
		if (!isAnyoneCanPay) {
			let bufferWriter = BufferWriter.withCapacity(36 * this.ins.length);
			this.ins.forEach((txIn) => {
				bufferWriter.writeSlice(txIn.hash);
				bufferWriter.writeUInt32(txIn.index);
			});
			hashPrevouts = sha256(bufferWriter.end());
			bufferWriter = BufferWriter.withCapacity(8 * this.ins.length);
			values.forEach((value) => bufferWriter.writeInt64(value));
			hashAmounts = sha256(bufferWriter.end());
			bufferWriter = BufferWriter.withCapacity(prevOutScripts.map(varSliceSize).reduce((a, b) => a + b));
			prevOutScripts.forEach((prevOutScript) => bufferWriter.writeVarSlice(prevOutScript));
			hashScriptPubKeys = sha256(bufferWriter.end());
			bufferWriter = BufferWriter.withCapacity(4 * this.ins.length);
			this.ins.forEach((txIn) => bufferWriter.writeUInt32(txIn.sequence));
			hashSequences = sha256(bufferWriter.end());
		}
		if (!(isNone || isSingle)) {
			if (!this.outs.length) throw new Error("Add outputs to the transaction before signing.");
			const txOutsSize = this.outs.map((output) => 8 + varSliceSize(output.script)).reduce((a, b) => a + b);
			const bufferWriter = BufferWriter.withCapacity(txOutsSize);
			this.outs.forEach((out) => {
				bufferWriter.writeInt64(out.value);
				bufferWriter.writeVarSlice(out.script);
			});
			hashOutputs = sha256(bufferWriter.end());
		} else if (isSingle && inIndex < this.outs.length) {
			const output = this.outs[inIndex];
			const bufferWriter = BufferWriter.withCapacity(8 + varSliceSize(output.script));
			bufferWriter.writeInt64(output.value);
			bufferWriter.writeVarSlice(output.script);
			hashOutputs = sha256(bufferWriter.end());
		}
		const spendType = (leafHash ? 2 : 0) + (annex ? 1 : 0);
		const sigMsgSize = 174 - (isAnyoneCanPay ? 49 : 0) - (isNone ? 32 : 0) + (annex ? 32 : 0) + (leafHash ? 37 : 0);
		const sigMsgWriter = BufferWriter.withCapacity(sigMsgSize);
		sigMsgWriter.writeUInt8(hashType);
		sigMsgWriter.writeUInt32(this.version);
		sigMsgWriter.writeUInt32(this.locktime);
		sigMsgWriter.writeSlice(hashPrevouts);
		sigMsgWriter.writeSlice(hashAmounts);
		sigMsgWriter.writeSlice(hashScriptPubKeys);
		sigMsgWriter.writeSlice(hashSequences);
		if (!(isNone || isSingle)) sigMsgWriter.writeSlice(hashOutputs);
		sigMsgWriter.writeUInt8(spendType);
		if (isAnyoneCanPay) {
			const input = this.ins[inIndex];
			sigMsgWriter.writeSlice(input.hash);
			sigMsgWriter.writeUInt32(input.index);
			sigMsgWriter.writeInt64(values[inIndex]);
			sigMsgWriter.writeVarSlice(prevOutScripts[inIndex]);
			sigMsgWriter.writeUInt32(input.sequence);
		} else sigMsgWriter.writeUInt32(inIndex);
		if (annex) {
			const bufferWriter = BufferWriter.withCapacity(varSliceSize(annex));
			bufferWriter.writeVarSlice(annex);
			sigMsgWriter.writeSlice(sha256(bufferWriter.end()));
		}
		if (isSingle) sigMsgWriter.writeSlice(hashOutputs);
		if (leafHash) {
			sigMsgWriter.writeSlice(leafHash);
			sigMsgWriter.writeUInt8(0);
			sigMsgWriter.writeUInt32(4294967295);
		}
		return taggedHash("TapSighash", concat([Uint8Array.from([0]), sigMsgWriter.end()]));
	}
	hashForWitnessV0(inIndex, prevOutScript, value, hashType) {
		parse(tuple([
			UInt32Schema,
			BufferSchema,
			SatoshiSchema,
			UInt32Schema
		]), [
			inIndex,
			prevOutScript,
			value,
			hashType
		]);
		let tbuffer = Uint8Array.from([]);
		let bufferWriter;
		let hashOutputs = ZERO;
		let hashPrevouts = ZERO;
		let hashSequence = ZERO;
		if (!(hashType & Transaction.SIGHASH_ANYONECANPAY)) {
			tbuffer = new Uint8Array(36 * this.ins.length);
			bufferWriter = new BufferWriter(tbuffer, 0);
			this.ins.forEach((txIn) => {
				bufferWriter.writeSlice(txIn.hash);
				bufferWriter.writeUInt32(txIn.index);
			});
			hashPrevouts = hash256(tbuffer);
		}
		if (!(hashType & Transaction.SIGHASH_ANYONECANPAY) && (hashType & 31) !== Transaction.SIGHASH_SINGLE && (hashType & 31) !== Transaction.SIGHASH_NONE) {
			tbuffer = new Uint8Array(4 * this.ins.length);
			bufferWriter = new BufferWriter(tbuffer, 0);
			this.ins.forEach((txIn) => {
				bufferWriter.writeUInt32(txIn.sequence);
			});
			hashSequence = hash256(tbuffer);
		}
		if ((hashType & 31) !== Transaction.SIGHASH_SINGLE && (hashType & 31) !== Transaction.SIGHASH_NONE) {
			const txOutsSize = this.outs.reduce((sum, output) => {
				return sum + 8 + varSliceSize(output.script);
			}, 0);
			tbuffer = new Uint8Array(txOutsSize);
			bufferWriter = new BufferWriter(tbuffer, 0);
			this.outs.forEach((out) => {
				bufferWriter.writeInt64(out.value);
				bufferWriter.writeVarSlice(out.script);
			});
			hashOutputs = hash256(tbuffer);
		} else if ((hashType & 31) === Transaction.SIGHASH_SINGLE && inIndex < this.outs.length) {
			const output = this.outs[inIndex];
			tbuffer = new Uint8Array(8 + varSliceSize(output.script));
			bufferWriter = new BufferWriter(tbuffer, 0);
			bufferWriter.writeInt64(output.value);
			bufferWriter.writeVarSlice(output.script);
			hashOutputs = hash256(tbuffer);
		}
		tbuffer = new Uint8Array(156 + varSliceSize(prevOutScript));
		bufferWriter = new BufferWriter(tbuffer, 0);
		const input = this.ins[inIndex];
		bufferWriter.writeUInt32(this.version);
		bufferWriter.writeSlice(hashPrevouts);
		bufferWriter.writeSlice(hashSequence);
		bufferWriter.writeSlice(input.hash);
		bufferWriter.writeUInt32(input.index);
		bufferWriter.writeVarSlice(prevOutScript);
		bufferWriter.writeInt64(value);
		bufferWriter.writeUInt32(input.sequence);
		bufferWriter.writeSlice(hashOutputs);
		bufferWriter.writeUInt32(this.locktime);
		bufferWriter.writeUInt32(hashType);
		return hash256(tbuffer);
	}
	getHash(forWitness) {
		if (forWitness && this.isCoinbase()) return new Uint8Array(32);
		return hash256(this.__toBuffer(void 0, void 0, forWitness));
	}
	getId() {
		return toHex(reverseBuffer(this.getHash(false)));
	}
	toBuffer(buffer, initialOffset) {
		return this.__toBuffer(buffer, initialOffset, true);
	}
	toHex() {
		return toHex(this.toBuffer(void 0, void 0));
	}
	setInputScript(index, scriptSig) {
		parse(tuple([number$2(), BufferSchema]), [index, scriptSig]);
		this.ins[index].script = scriptSig;
	}
	setWitness(index, witness) {
		parse(tuple([number$2(), array(BufferSchema)]), [index, witness]);
		this.ins[index].witness = witness;
	}
	__toBuffer(buffer, initialOffset, _ALLOW_WITNESS = false) {
		if (!buffer) buffer = new Uint8Array(this.byteLength(_ALLOW_WITNESS));
		const bufferWriter = new BufferWriter(buffer, initialOffset || 0);
		bufferWriter.writeUInt32(this.version);
		const hasWitnesses = _ALLOW_WITNESS && this.hasWitnesses();
		if (hasWitnesses) {
			bufferWriter.writeUInt8(Transaction.ADVANCED_TRANSACTION_MARKER);
			bufferWriter.writeUInt8(Transaction.ADVANCED_TRANSACTION_FLAG);
		}
		bufferWriter.writeVarInt(this.ins.length);
		this.ins.forEach((txIn) => {
			bufferWriter.writeSlice(txIn.hash);
			bufferWriter.writeUInt32(txIn.index);
			bufferWriter.writeVarSlice(txIn.script);
			bufferWriter.writeUInt32(txIn.sequence);
		});
		bufferWriter.writeVarInt(this.outs.length);
		this.outs.forEach((txOut) => {
			if (isOutput(txOut)) bufferWriter.writeInt64(txOut.value);
			else bufferWriter.writeSlice(txOut.valueBuffer);
			bufferWriter.writeVarSlice(txOut.script);
		});
		if (hasWitnesses) this.ins.forEach((input) => {
			bufferWriter.writeVector(input.witness);
		});
		bufferWriter.writeUInt32(this.locktime);
		if (initialOffset !== void 0) return buffer.slice(initialOffset, bufferWriter.offset);
		return buffer;
	}
};
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/block.js
var errorMerkleNoTxes = /* @__PURE__ */ new TypeError("Cannot compute merkle root for zero transactions");
var errorWitnessNotSegwit = /* @__PURE__ */ new TypeError("Cannot compute witness commit for non-segwit block");
var Block = class Block {
	static fromBuffer(buffer) {
		if (buffer.length < 80) throw new Error("Buffer too small (< 80 bytes)");
		const bufferReader = new BufferReader(buffer);
		const block = new Block();
		block.version = bufferReader.readInt32();
		block.prevHash = bufferReader.readSlice(32);
		block.merkleRoot = bufferReader.readSlice(32);
		block.timestamp = bufferReader.readUInt32();
		block.bits = bufferReader.readUInt32();
		block.nonce = bufferReader.readUInt32();
		if (buffer.length === 80) return block;
		const readTransaction = () => {
			const tx = Transaction.fromBuffer(bufferReader.buffer.slice(bufferReader.offset), true);
			bufferReader.offset += tx.byteLength();
			return tx;
		};
		const nTransactions = bufferReader.readVarInt();
		block.transactions = [];
		for (let i = 0; i < nTransactions; ++i) {
			const tx = readTransaction();
			block.transactions.push(tx);
		}
		const witnessCommit = block.getWitnessCommit();
		if (witnessCommit) block.witnessCommit = witnessCommit;
		return block;
	}
	static fromHex(hex) {
		return Block.fromBuffer(fromHex(hex));
	}
	static calculateTarget(bits) {
		const exponent = ((bits & 4278190080) >> 24) - 3;
		const mantissa = bits & 8388607;
		const target = new Uint8Array(32);
		target[29 - exponent] = mantissa >> 16 & 255;
		target[30 - exponent] = mantissa >> 8 & 255;
		target[31 - exponent] = mantissa & 255;
		return target;
	}
	static calculateMerkleRoot(transactions, forWitness) {
		parse(array(object({ getHash: function_() })), transactions);
		if (transactions.length === 0) throw errorMerkleNoTxes;
		if (forWitness && !txesHaveWitnessCommit(transactions)) throw errorWitnessNotSegwit;
		const rootHash = fastMerkleRoot(transactions.map((transaction) => transaction.getHash(forWitness)), hash256);
		return forWitness ? hash256(concat([rootHash, transactions[0].ins[0].witness[0]])) : rootHash;
	}
	version = 1;
	prevHash = void 0;
	merkleRoot = void 0;
	timestamp = 0;
	witnessCommit = void 0;
	bits = 0;
	nonce = 0;
	transactions = void 0;
	getWitnessCommit() {
		if (!txesHaveWitnessCommit(this.transactions)) return null;
		const witnessCommits = this.transactions[0].outs.filter((out) => compare(out.script.slice(0, 6), Uint8Array.from([
			106,
			36,
			170,
			33,
			169,
			237
		])) === 0).map((out) => out.script.slice(6, 38));
		if (witnessCommits.length === 0) return null;
		const result = witnessCommits[witnessCommits.length - 1];
		if (!(result instanceof Uint8Array && result.length === 32)) return null;
		return result;
	}
	hasWitnessCommit() {
		if (this.witnessCommit instanceof Uint8Array && this.witnessCommit.length === 32) return true;
		if (this.getWitnessCommit() !== null) return true;
		return false;
	}
	hasWitness() {
		return anyTxHasWitness(this.transactions);
	}
	weight() {
		const base = this.byteLength(false, false);
		const total = this.byteLength(false, true);
		return base * 3 + total;
	}
	byteLength(headersOnly, allowWitness = true) {
		if (headersOnly || !this.transactions) return 80;
		return 80 + encodingLength$1(this.transactions.length) + this.transactions.reduce((a, x) => a + x.byteLength(allowWitness), 0);
	}
	getHash() {
		return hash256(this.toBuffer(true));
	}
	getId() {
		return toHex(reverseBuffer(this.getHash()));
	}
	getUTCDate() {
		const date = /* @__PURE__ */ new Date(0);
		date.setUTCSeconds(this.timestamp);
		return date;
	}
	toBuffer(headersOnly) {
		const buffer = new Uint8Array(this.byteLength(headersOnly));
		const bufferWriter = new BufferWriter(buffer);
		bufferWriter.writeInt32(this.version);
		bufferWriter.writeSlice(this.prevHash);
		bufferWriter.writeSlice(this.merkleRoot);
		bufferWriter.writeUInt32(this.timestamp);
		bufferWriter.writeUInt32(this.bits);
		bufferWriter.writeUInt32(this.nonce);
		if (headersOnly || !this.transactions) return buffer;
		const { bytes } = encode$4(this.transactions.length, buffer, bufferWriter.offset);
		bufferWriter.offset += bytes;
		this.transactions.forEach((tx) => {
			const txSize = tx.byteLength();
			tx.toBuffer(buffer, bufferWriter.offset);
			bufferWriter.offset += txSize;
		});
		return buffer;
	}
	toHex(headersOnly) {
		return toHex(this.toBuffer(headersOnly));
	}
	checkTxRoots() {
		const hasWitnessCommit = this.hasWitnessCommit();
		if (!hasWitnessCommit && this.hasWitness()) return false;
		return this.__checkMerkleRoot() && (hasWitnessCommit ? this.__checkWitnessCommit() : true);
	}
	checkProofOfWork() {
		return compare(reverseBuffer(this.getHash()), Block.calculateTarget(this.bits)) <= 0;
	}
	__checkMerkleRoot() {
		if (!this.transactions) throw errorMerkleNoTxes;
		const actualMerkleRoot = Block.calculateMerkleRoot(this.transactions);
		return compare(this.merkleRoot, actualMerkleRoot) === 0;
	}
	__checkWitnessCommit() {
		if (!this.transactions) throw errorMerkleNoTxes;
		if (!this.hasWitnessCommit()) throw errorWitnessNotSegwit;
		const actualWitnessCommit = Block.calculateMerkleRoot(this.transactions, true);
		return compare(this.witnessCommit, actualWitnessCommit) === 0;
	}
};
function txesHaveWitnessCommit(transactions) {
	return transactions instanceof Array && transactions[0] && transactions[0].ins && transactions[0].ins instanceof Array && transactions[0].ins[0] && transactions[0].ins[0].witness && transactions[0].ins[0].witness instanceof Array && transactions[0].ins[0].witness.length > 0;
}
function anyTxHasWitness(transactions) {
	return transactions instanceof Array && transactions.some((tx) => typeof tx === "object" && tx.ins instanceof Array && tx.ins.some((input) => typeof input === "object" && input.witness instanceof Array && input.witness.length > 0));
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/psbt/psbtutils.js
/**
* Checks if a given payment factory can generate a payment script from a given script.
* @param payment The payment factory to check.
* @returns A function that takes a script and returns a boolean indicating whether the payment factory can generate a payment script from the script.
*/
function isPaymentFactory(payment) {
	return (script) => {
		try {
			payment({ output: script });
			return true;
		} catch (err) {
			return false;
		}
	};
}
var isP2MS = isPaymentFactory(p2ms);
var isP2PK = isPaymentFactory(p2pk);
var isP2PKH = isPaymentFactory(p2pkh);
var isP2WPKH = isPaymentFactory(p2wpkh);
var isP2WSHScript = isPaymentFactory(p2wsh);
var isP2SHScript = isPaymentFactory(p2sh);
var isP2TR = isPaymentFactory(p2tr);
/**
* Converts a witness stack to a script witness.
* @param witness The witness stack to convert.
* @returns The script witness as a Buffer.
*/
function witnessStackToScriptWitness(witness) {
	let buffer = new Uint8Array(0);
	function writeSlice(slice) {
		buffer = concat([buffer, slice]);
	}
	function writeVarInt(i) {
		const currentLen = buffer.length;
		const varintLen = encodingLength$1(i);
		buffer = concat([buffer, new Uint8Array(varintLen)]);
		encode$4(i, buffer, currentLen);
	}
	function writeVarSlice(slice) {
		writeVarInt(slice.length);
		writeSlice(slice);
	}
	function writeVector(vector) {
		writeVarInt(vector.length);
		vector.forEach(writeVarSlice);
	}
	writeVector(witness);
	return buffer;
}
/**
* Finds the position of a public key in a script.
* @param pubkey The public key to search for.
* @param script The script to search in.
* @returns The index of the public key in the script, or -1 if not found.
* @throws {Error} If there is an unknown script error.
*/
function pubkeyPositionInScript(pubkey, script) {
	const pubkeyHash = hash160(pubkey);
	const pubkeyXOnly = pubkey.slice(1, 33);
	const decompiled = decompile(script);
	if (decompiled === null) throw new Error("Unknown script error");
	return decompiled.findIndex((element) => {
		if (typeof element === "number") return false;
		return compare(pubkey, element) === 0 || compare(pubkeyHash, element) === 0 || compare(pubkeyXOnly, element) === 0;
	});
}
/**
* Checks if a public key is present in a script.
* @param pubkey The public key to check.
* @param script The script to search in.
* @returns A boolean indicating whether the public key is present in the script.
*/
function pubkeyInScript(pubkey, script) {
	return pubkeyPositionInScript(pubkey, script) !== -1;
}
/**
* Checks if an input contains a signature for a specific action.
* @param input - The input to check.
* @param action - The action to check for.
* @returns A boolean indicating whether the input contains a signature for the specified action.
*/
function checkInputForSig(input, action) {
	return extractPartialSigs(input).some((pSig) => signatureBlocksAction(pSig, signature.decode, action));
}
/**
* Determines if a given action is allowed for a signature block.
* @param signature - The signature block.
* @param signatureDecodeFn - The function used to decode the signature.
* @param action - The action to be checked.
* @returns True if the action is allowed, false otherwise.
*/
function signatureBlocksAction(signature, signatureDecodeFn, action) {
	const { hashType } = signatureDecodeFn(signature);
	const whitelist = [];
	if (hashType & Transaction.SIGHASH_ANYONECANPAY) whitelist.push("addInput");
	switch (hashType & 31) {
		case Transaction.SIGHASH_ALL: break;
		case Transaction.SIGHASH_SINGLE:
		case Transaction.SIGHASH_NONE:
			whitelist.push("addOutput");
			whitelist.push("setInputSequence");
			break;
	}
	if (whitelist.indexOf(action) === -1) return true;
	return false;
}
/**
* Extracts the signatures from a PsbtInput object.
* If the input has partial signatures, it returns an array of the signatures.
* If the input does not have partial signatures, it checks if it has a finalScriptSig or finalScriptWitness.
* If it does, it extracts the signatures from the final scripts and returns them.
* If none of the above conditions are met, it returns an empty array.
*
* @param input - The PsbtInput object from which to extract the signatures.
* @returns An array of signatures extracted from the PsbtInput object.
*/
function extractPartialSigs(input) {
	let pSigs = [];
	if ((input.partialSig || []).length === 0) {
		if (!input.finalScriptSig && !input.finalScriptWitness) return [];
		pSigs = getPsigsFromInputFinalScripts(input);
	} else pSigs = input.partialSig;
	return pSigs.map((p) => p.signature);
}
/**
* Retrieves the partial signatures (Psigs) from the input's final scripts.
* Psigs are extracted from both the final scriptSig and final scriptWitness of the input.
* Only canonical script signatures are considered.
*
* @param input - The PsbtInput object representing the input.
* @returns An array of PartialSig objects containing the extracted Psigs.
*/
function getPsigsFromInputFinalScripts(input) {
	const scriptItems = !input.finalScriptSig ? [] : decompile(input.finalScriptSig) || [];
	const witnessItems = !input.finalScriptWitness ? [] : decompile(input.finalScriptWitness) || [];
	return scriptItems.concat(witnessItems).filter((item) => {
		return item instanceof Uint8Array && isCanonicalScriptSignature(item);
	}).map((sig) => ({ signature: sig }));
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/psbt/bip371.js
/**
* Converts a public key to an X-only public key.
* @param pubKey The public key to convert.
* @returns The X-only public key.
*/
var toXOnly = (pubKey) => pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);
/**
* Default tapscript finalizer. It searches for the `tapLeafHashToFinalize` if provided.
* Otherwise it will search for the tapleaf that has at least one signature and has the shortest path.
* @param inputIndex the position of the PSBT input.
* @param input the PSBT input.
* @param tapLeafHashToFinalize optional, if provided the finalizer will search for a tapleaf that has this hash
*                              and will try to build the finalScriptWitness.
* @returns the finalScriptWitness or throws an exception if no tapleaf found.
*/
function tapScriptFinalizer(inputIndex, input, tapLeafHashToFinalize) {
	const tapLeaf = findTapLeafToFinalize(input, inputIndex, tapLeafHashToFinalize);
	try {
		return { finalScriptWitness: witnessStackToScriptWitness(sortSignatures(input, tapLeaf).concat(tapLeaf.script).concat(tapLeaf.controlBlock)) };
	} catch (err) {
		throw new Error(`Can not finalize taproot input #${inputIndex}: ${err}`);
	}
}
/**
* Serializes a taproot signature.
* @param sig The signature to serialize.
* @param sighashType The sighash type. Optional.
* @returns The serialized taproot signature.
*/
function serializeTaprootSignature(sig, sighashType) {
	return concat([sig, sighashType ? Uint8Array.from([sighashType]) : Uint8Array.from([])]);
}
/**
* Checks if a PSBT input is a taproot input.
* @param input The PSBT input to check.
* @returns True if the input is a taproot input, false otherwise.
*/
function isTaprootInput(input) {
	return input && !!(input.tapInternalKey || input.tapMerkleRoot || input.tapLeafScript && input.tapLeafScript.length || input.tapBip32Derivation && input.tapBip32Derivation.length || input.witnessUtxo && isP2TR(input.witnessUtxo.script));
}
/**
* Checks if a PSBT output is a taproot output.
* @param output The PSBT output to check.
* @param script The script to check. Optional.
* @returns True if the output is a taproot output, false otherwise.
*/
function isTaprootOutput(output, script) {
	return output && !!(output.tapInternalKey || output.tapTree || output.tapBip32Derivation && output.tapBip32Derivation.length || script && isP2TR(script));
}
/**
* Checks the taproot input fields for consistency.
* @param inputData The original input data.
* @param newInputData The new input data.
* @param action The action being performed.
* @throws Throws an error if the input fields are inconsistent.
*/
function checkTaprootInputFields(inputData, newInputData, action) {
	checkMixedTaprootAndNonTaprootInputFields(inputData, newInputData, action);
	checkIfTapLeafInTree(inputData, newInputData, action);
}
/**
* Checks the taproot output fields for consistency.
* @param outputData The original output data.
* @param newOutputData The new output data.
* @param action The action being performed.
* @throws Throws an error if the output fields are inconsistent.
*/
function checkTaprootOutputFields(outputData, newOutputData, action) {
	checkMixedTaprootAndNonTaprootOutputFields(outputData, newOutputData, action);
	checkTaprootScriptPubkey(outputData, newOutputData);
}
function checkTaprootScriptPubkey(outputData, newOutputData) {
	if (!newOutputData.tapTree && !newOutputData.tapInternalKey) return;
	const tapInternalKey = newOutputData.tapInternalKey || outputData.tapInternalKey;
	const tapTree = newOutputData.tapTree || outputData.tapTree;
	if (tapInternalKey) {
		const { script: scriptPubkey } = outputData;
		const script = getTaprootScripPubkey(tapInternalKey, tapTree);
		if (scriptPubkey && compare(script, scriptPubkey) !== 0) throw new Error("Error adding output. Script or address mismatch.");
	}
}
/**
* Returns the Taproot script public key.
*
* @param tapInternalKey - The Taproot internal key.
* @param tapTree - The Taproot tree (optional).
* @returns The Taproot script public key.
*/
function getTaprootScripPubkey(tapInternalKey, tapTree) {
	const { output } = p2tr({
		internalPubkey: tapInternalKey,
		scriptTree: tapTree && tapTreeFromList(tapTree.leaves)
	});
	return output;
}
/**
* Convert a BIP371 TapLeaf list to a TapTree (binary).
* @param leaves a list of tapleaves where each element of the list is (according to BIP371):
* One or more tuples representing the depth, leaf version, and script for a leaf in the Taproot tree,
* allowing the entire tree to be reconstructed. The tuples must be in depth first search order so that
* the tree is correctly reconstructed.
* @returns the corresponding taptree, or throws an exception if the tree cannot be reconstructed
*/
function tapTreeFromList(leaves = []) {
	if (leaves.length === 1 && leaves[0].depth === 0) return {
		output: leaves[0].script,
		version: leaves[0].leafVersion
	};
	return instertLeavesInTree(leaves);
}
/**
* Checks the taproot input for signatures.
* @param input The PSBT input to check.
* @param action The action being performed.
* @returns True if the input has taproot signatures, false otherwise.
*/
function checkTaprootInputForSigs(input, action) {
	return extractTaprootSigs(input).some((sig) => signatureBlocksAction(sig, decodeSchnorrSignature, action));
}
/**
* Decodes a Schnorr signature.
* @param signature The signature to decode.
* @returns The decoded Schnorr signature.
*/
function decodeSchnorrSignature(signature) {
	return {
		signature: signature.slice(0, 64),
		hashType: signature.slice(64)[0] || Transaction.SIGHASH_DEFAULT
	};
}
/**
* Extracts taproot signatures from a PSBT input.
* @param input The PSBT input to extract signatures from.
* @returns An array of taproot signatures.
*/
function extractTaprootSigs(input) {
	const sigs = [];
	if (input.tapKeySig) sigs.push(input.tapKeySig);
	if (input.tapScriptSig) sigs.push(...input.tapScriptSig.map((s) => s.signature));
	if (!sigs.length) {
		const finalTapKeySig = getTapKeySigFromWitness(input.finalScriptWitness);
		if (finalTapKeySig) sigs.push(finalTapKeySig);
	}
	return sigs;
}
/**
* Gets the taproot signature from the witness.
* @param finalScriptWitness The final script witness.
* @returns The taproot signature, or undefined if not found.
*/
function getTapKeySigFromWitness(finalScriptWitness) {
	if (!finalScriptWitness) return;
	const witness = finalScriptWitness.slice(2);
	if (witness.length === 64 || witness.length === 65) return witness;
}
/**
* Inserts the tapleaves into the taproot tree.
* @param leaves The tapleaves to insert.
* @returns The taproot tree.
* @throws Throws an error if there is no room left to insert a tapleaf in the tree.
*/
function instertLeavesInTree(leaves) {
	let tree;
	for (const leaf of leaves) {
		tree = instertLeafInTree(leaf, tree);
		if (!tree) throw new Error(`No room left to insert tapleaf in tree`);
	}
	return tree;
}
/**
* Inserts a tapleaf into the taproot tree.
* @param leaf The tapleaf to insert.
* @param tree The taproot tree.
* @param depth The current depth. Optional.
* @returns The updated taproot tree.
*/
function instertLeafInTree(leaf, tree, depth = 0) {
	if (depth > 128) throw new Error("Max taptree depth exceeded.");
	if (leaf.depth === depth) {
		if (!tree) return {
			output: leaf.script,
			version: leaf.leafVersion
		};
		return;
	}
	if (isTapleaf(tree)) return;
	const leftSide = instertLeafInTree(leaf, tree && tree[0], depth + 1);
	if (leftSide) return [leftSide, tree && tree[1]];
	const rightSide = instertLeafInTree(leaf, tree && tree[1], depth + 1);
	if (rightSide) return [tree && tree[0], rightSide];
}
/**
* Checks the input fields for mixed taproot and non-taproot fields.
* @param inputData The original input data.
* @param newInputData The new input data.
* @param action The action being performed.
* @throws Throws an error if the input fields are inconsistent.
*/
function checkMixedTaprootAndNonTaprootInputFields(inputData, newInputData, action) {
	const isBadTaprootUpdate = isTaprootInput(inputData) && hasNonTaprootFields(newInputData);
	const isBadNonTaprootUpdate = hasNonTaprootFields(inputData) && isTaprootInput(newInputData);
	const hasMixedFields = inputData === newInputData && isTaprootInput(newInputData) && hasNonTaprootFields(newInputData);
	if (isBadTaprootUpdate || isBadNonTaprootUpdate || hasMixedFields) throw new Error(`Invalid arguments for Psbt.${action}. Cannot use both taproot and non-taproot fields.`);
}
/**
* Checks the output fields for mixed taproot and non-taproot fields.
* @param inputData The original output data.
* @param newInputData The new output data.
* @param action The action being performed.
* @throws Throws an error if the output fields are inconsistent.
*/
function checkMixedTaprootAndNonTaprootOutputFields(inputData, newInputData, action) {
	const isBadTaprootUpdate = isTaprootOutput(inputData) && hasNonTaprootFields(newInputData);
	const isBadNonTaprootUpdate = hasNonTaprootFields(inputData) && isTaprootOutput(newInputData);
	const hasMixedFields = inputData === newInputData && isTaprootOutput(newInputData) && hasNonTaprootFields(newInputData);
	if (isBadTaprootUpdate || isBadNonTaprootUpdate || hasMixedFields) throw new Error(`Invalid arguments for Psbt.${action}. Cannot use both taproot and non-taproot fields.`);
}
/**
* Checks if the tap leaf is part of the tap tree for the given input data.
* Throws an error if the tap leaf is not part of the tap tree.
* @param inputData - The original PsbtInput data.
* @param newInputData - The new PsbtInput data.
* @param action - The action being performed.
* @throws {Error} - If the tap leaf is not part of the tap tree.
*/
function checkIfTapLeafInTree(inputData, newInputData, action) {
	if (newInputData.tapMerkleRoot) {
		const newLeafsInTree = (newInputData.tapLeafScript || []).every((l) => isTapLeafInTree(l, newInputData.tapMerkleRoot));
		const oldLeafsInTree = (inputData.tapLeafScript || []).every((l) => isTapLeafInTree(l, newInputData.tapMerkleRoot));
		if (!newLeafsInTree || !oldLeafsInTree) throw new Error(`Invalid arguments for Psbt.${action}. Tapleaf not part of taptree.`);
	} else if (inputData.tapMerkleRoot) {
		if (!(newInputData.tapLeafScript || []).every((l) => isTapLeafInTree(l, inputData.tapMerkleRoot))) throw new Error(`Invalid arguments for Psbt.${action}. Tapleaf not part of taptree.`);
	}
}
/**
* Checks if a TapLeafScript is present in a Merkle tree.
* @param tapLeaf The TapLeafScript to check.
* @param merkleRoot The Merkle root of the tree. If not provided, the function assumes the TapLeafScript is present.
* @returns A boolean indicating whether the TapLeafScript is present in the tree.
*/
function isTapLeafInTree(tapLeaf, merkleRoot) {
	if (!merkleRoot) return true;
	const leafHash = tapleafHash({
		output: tapLeaf.script,
		version: tapLeaf.leafVersion
	});
	return compare(rootHashFromPath(tapLeaf.controlBlock, leafHash), merkleRoot) === 0;
}
/**
* Sorts the signatures in the input's tapScriptSig array based on their position in the tapLeaf script.
*
* @param input - The PsbtInput object.
* @param tapLeaf - The TapLeafScript object.
* @returns An array of sorted signatures as Buffers.
*/
function sortSignatures(input, tapLeaf) {
	const leafHash = tapleafHash({
		output: tapLeaf.script,
		version: tapLeaf.leafVersion
	});
	return (input.tapScriptSig || []).filter((tss) => compare(tss.leafHash, leafHash) === 0).map((tss) => addPubkeyPositionInScript(tapLeaf.script, tss)).sort((t1, t2) => t2.positionInScript - t1.positionInScript).map((t) => t.signature);
}
/**
* Adds the position of a public key in a script to a TapScriptSig object.
* @param script The script in which to find the position of the public key.
* @param tss The TapScriptSig object to add the position to.
* @returns A TapScriptSigWitPosition object with the added position.
*/
function addPubkeyPositionInScript(script, tss) {
	return Object.assign({ positionInScript: pubkeyPositionInScript(tss.pubkey, script) }, tss);
}
/**
* Find tapleaf by hash, or get the signed tapleaf with the shortest path.
*/
function findTapLeafToFinalize(input, inputIndex, leafHashToFinalize) {
	if (!input.tapScriptSig || !input.tapScriptSig.length) throw new Error(`Can not finalize taproot input #${inputIndex}. No tapleaf script signature provided.`);
	const tapLeaf = (input.tapLeafScript || []).sort((a, b) => a.controlBlock.length - b.controlBlock.length).find((leaf) => canFinalizeLeaf(leaf, input.tapScriptSig, leafHashToFinalize));
	if (!tapLeaf) throw new Error(`Can not finalize taproot input #${inputIndex}. Signature for tapleaf script not found.`);
	return tapLeaf;
}
/**
* Determines whether a TapLeafScript can be finalized.
*
* @param leaf - The TapLeafScript to check.
* @param tapScriptSig - The array of TapScriptSig objects.
* @param hash - The optional hash to compare with the leaf hash.
* @returns A boolean indicating whether the TapLeafScript can be finalized.
*/
function canFinalizeLeaf(leaf, tapScriptSig, hash) {
	const leafHash = tapleafHash({
		output: leaf.script,
		version: leaf.leafVersion
	});
	return (!hash || compare(leafHash, hash) === 0) && tapScriptSig.find((tss) => compare(tss.leafHash, leafHash) === 0) !== void 0;
}
/**
* Checks if the given PsbtInput or PsbtOutput has non-taproot fields.
* Non-taproot fields include redeemScript, witnessScript, and bip32Derivation.
* @param io The PsbtInput or PsbtOutput to check.
* @returns A boolean indicating whether the given input or output has non-taproot fields.
*/
function hasNonTaprootFields(io) {
	return io && !!(io.redeemScript || io.witnessScript || io.bip32Derivation && io.bip32Derivation.length);
}
//#endregion
//#region node_modules/bitcoinjs-lib/src/esm/psbt.js
/**
* These are the default arguments for a Psbt instance.
*/
var DEFAULT_OPTS = {
	/**
	* A bitcoinjs Network object. This is only used if you pass an `address`
	* parameter to addOutput. Otherwise it is not needed and can be left default.
	*/
	network: bitcoin,
	/**
	* When extractTransaction is called, the fee rate is checked.
	* THIS IS NOT TO BE RELIED ON.
	* It is only here as a last ditch effort to prevent sending a 500 BTC fee etc.
	*/
	maximumFeeRate: 5e3
};
/**
* Psbt class can parse and generate a PSBT binary based off of the BIP174.
* There are 6 roles that this class fulfills. (Explained in BIP174)
*
* Creator: This can be done with `new Psbt()`
*
* Updater: This can be done with `psbt.addInput(input)`, `psbt.addInputs(inputs)`,
*   `psbt.addOutput(output)`, `psbt.addOutputs(outputs)` when you are looking to
*   add new inputs and outputs to the PSBT, and `psbt.updateGlobal(itemObject)`,
*   `psbt.updateInput(itemObject)`, `psbt.updateOutput(itemObject)`
*   addInput requires hash: Buffer | string; and index: number; as attributes
*   and can also include any attributes that are used in updateInput method.
*   addOutput requires script: Buffer; and value: number; and likewise can include
*   data for updateOutput.
*   For a list of what attributes should be what types. Check the bip174 library.
*   Also, check the integration tests for some examples of usage.
*
* Signer: There are a few methods. signAllInputs and signAllInputsAsync, which will search all input
*   information for your pubkey or pubkeyhash, and only sign inputs where it finds
*   your info. Or you can explicitly sign a specific input with signInput and
*   signInputAsync. For the async methods you can create a SignerAsync object
*   and use something like a hardware wallet to sign with. (You must implement this)
*
* Combiner: psbts can be combined easily with `psbt.combine(psbt2, psbt3, psbt4 ...)`
*   the psbt calling combine will always have precedence when a conflict occurs.
*   Combine checks if the internal bitcoin transaction is the same, so be sure that
*   all sequences, version, locktime, etc. are the same before combining.
*
* Input Finalizer: This role is fairly important. Not only does it need to construct
*   the input scriptSigs and witnesses, but it SHOULD verify the signatures etc.
*   Before running `psbt.finalizeAllInputs()` please run `psbt.validateSignaturesOfAllInputs()`
*   Running any finalize method will delete any data in the input(s) that are no longer
*   needed due to the finalized scripts containing the information.
*
* Transaction Extractor: This role will perform some checks before returning a
*   Transaction object. Such as fee rate not being larger than maximumFeeRate etc.
*/
var Psbt = class Psbt {
	data;
	static fromBase64(data, opts = {}) {
		const buffer = fromBase64(data);
		return this.fromBuffer(buffer, opts);
	}
	static fromHex(data, opts = {}) {
		const buffer = fromHex(data);
		return this.fromBuffer(buffer, opts);
	}
	static fromBuffer(buffer, opts = {}) {
		const psbt = new Psbt(opts, Psbt$1.fromBuffer(buffer, transactionFromBuffer));
		checkTxForDupeIns(psbt.__CACHE.__TX, psbt.__CACHE);
		return psbt;
	}
	__CACHE;
	opts;
	constructor(opts = {}, data = new Psbt$1(new PsbtTransaction())) {
		this.data = data;
		this.opts = Object.assign({}, DEFAULT_OPTS, opts);
		this.__CACHE = {
			__NON_WITNESS_UTXO_TX_CACHE: [],
			__NON_WITNESS_UTXO_BUF_CACHE: [],
			__TX_IN_CACHE: {},
			__TX: this.data.globalMap.unsignedTx.tx,
			__UNSAFE_SIGN_NONSEGWIT: false
		};
		if (this.data.inputs.length === 0) this.setVersion(2);
		const dpew = (obj, attr, enumerable, writable) => Object.defineProperty(obj, attr, {
			enumerable,
			writable
		});
		dpew(this, "__CACHE", false, true);
		dpew(this, "opts", false, true);
	}
	get inputCount() {
		return this.data.inputs.length;
	}
	get version() {
		return this.__CACHE.__TX.version;
	}
	set version(version) {
		this.setVersion(version);
	}
	get locktime() {
		return this.__CACHE.__TX.locktime;
	}
	set locktime(locktime) {
		this.setLocktime(locktime);
	}
	get txInputs() {
		return this.__CACHE.__TX.ins.map((input) => ({
			hash: cloneBuffer(input.hash),
			index: input.index,
			sequence: input.sequence
		}));
	}
	get txOutputs() {
		return this.__CACHE.__TX.outs.map((output) => {
			let address;
			try {
				address = fromOutputScript(output.script, this.opts.network);
			} catch (_) {}
			return {
				script: cloneBuffer(output.script),
				value: output.value,
				address
			};
		});
	}
	combine(...those) {
		this.data.combine(...those.map((o) => o.data));
		return this;
	}
	clone() {
		const res = Psbt.fromBuffer(this.data.toBuffer());
		res.opts = JSON.parse(JSON.stringify(this.opts));
		return res;
	}
	setMaximumFeeRate(satoshiPerByte) {
		check32Bit(satoshiPerByte);
		this.opts.maximumFeeRate = satoshiPerByte;
	}
	setVersion(version) {
		check32Bit(version);
		checkInputsForPartialSig(this.data.inputs, "setVersion");
		const c = this.__CACHE;
		c.__TX.version = version;
		c.__EXTRACTED_TX = void 0;
		return this;
	}
	setLocktime(locktime) {
		check32Bit(locktime);
		checkInputsForPartialSig(this.data.inputs, "setLocktime");
		const c = this.__CACHE;
		c.__TX.locktime = locktime;
		c.__EXTRACTED_TX = void 0;
		return this;
	}
	setInputSequence(inputIndex, sequence) {
		check32Bit(sequence);
		checkInputsForPartialSig(this.data.inputs, "setInputSequence");
		const c = this.__CACHE;
		if (c.__TX.ins.length <= inputIndex) throw new Error("Input index too high");
		c.__TX.ins[inputIndex].sequence = sequence;
		c.__EXTRACTED_TX = void 0;
		return this;
	}
	addInputs(inputDatas) {
		inputDatas.forEach((inputData) => this.addInput(inputData));
		return this;
	}
	addInput(inputData) {
		if (arguments.length > 1 || !inputData || inputData.hash === void 0 || inputData.index === void 0) throw new Error("Invalid arguments for Psbt.addInput. Requires single object with at least [hash] and [index]");
		checkTaprootInputFields(inputData, inputData, "addInput");
		checkInputsForPartialSig(this.data.inputs, "addInput");
		if (inputData.witnessScript) checkInvalidP2WSH(inputData.witnessScript);
		const c = this.__CACHE;
		this.data.addInput(inputData);
		const txIn = c.__TX.ins[c.__TX.ins.length - 1];
		checkTxInputCache(c, txIn);
		const inputIndex = this.data.inputs.length - 1;
		const input = this.data.inputs[inputIndex];
		if (input.nonWitnessUtxo) addNonWitnessTxCache(this.__CACHE, input, inputIndex);
		c.__FEE = void 0;
		c.__FEE_RATE = void 0;
		c.__EXTRACTED_TX = void 0;
		return this;
	}
	addOutputs(outputDatas) {
		outputDatas.forEach((outputData) => this.addOutput(outputData));
		return this;
	}
	addOutput(outputData) {
		if (arguments.length > 1 || !outputData || outputData.value === void 0 || outputData.address === void 0 && outputData.script === void 0) throw new Error("Invalid arguments for Psbt.addOutput. Requires single object with at least [script or address] and [value]");
		checkInputsForPartialSig(this.data.inputs, "addOutput");
		const { address } = outputData;
		if (typeof address === "string") {
			const { network } = this.opts;
			const script = toOutputScript(address, network);
			outputData = Object.assign({}, outputData, { script });
		}
		checkTaprootOutputFields(outputData, outputData, "addOutput");
		const c = this.__CACHE;
		this.data.addOutput(outputData);
		c.__FEE = void 0;
		c.__FEE_RATE = void 0;
		c.__EXTRACTED_TX = void 0;
		return this;
	}
	extractTransaction(disableFeeCheck) {
		if (!this.data.inputs.every(isFinalized)) throw new Error("Not finalized");
		const c = this.__CACHE;
		if (!disableFeeCheck) checkFees(this, c, this.opts);
		if (c.__EXTRACTED_TX) return c.__EXTRACTED_TX;
		const tx = c.__TX.clone();
		inputFinalizeGetAmts(this.data.inputs, tx, c, true);
		return tx;
	}
	getFeeRate() {
		return getTxCacheValue("__FEE_RATE", "fee rate", this.data.inputs, this.__CACHE);
	}
	getFee() {
		return getTxCacheValue("__FEE", "fee", this.data.inputs, this.__CACHE);
	}
	finalizeAllInputs() {
		checkForInput(this.data.inputs, 0);
		range(this.data.inputs.length).forEach((idx) => this.finalizeInput(idx));
		return this;
	}
	finalizeInput(inputIndex, finalScriptsFunc) {
		const input = checkForInput(this.data.inputs, inputIndex);
		if (isTaprootInput(input)) return this._finalizeTaprootInput(inputIndex, input, void 0, finalScriptsFunc);
		return this._finalizeInput(inputIndex, input, finalScriptsFunc);
	}
	finalizeTaprootInput(inputIndex, tapLeafHashToFinalize, finalScriptsFunc = tapScriptFinalizer) {
		const input = checkForInput(this.data.inputs, inputIndex);
		if (isTaprootInput(input)) return this._finalizeTaprootInput(inputIndex, input, tapLeafHashToFinalize, finalScriptsFunc);
		throw new Error(`Cannot finalize input #${inputIndex}. Not Taproot.`);
	}
	_finalizeInput(inputIndex, input, finalScriptsFunc = getFinalScripts) {
		const { script, isP2SH, isP2WSH, isSegwit } = getScriptFromInput(inputIndex, input, this.__CACHE);
		if (!script) throw new Error(`No script found for input #${inputIndex}`);
		checkPartialSigSighashes(input);
		const { finalScriptSig, finalScriptWitness } = finalScriptsFunc(inputIndex, input, script, isSegwit, isP2SH, isP2WSH);
		if (finalScriptSig) this.data.updateInput(inputIndex, { finalScriptSig });
		if (finalScriptWitness) this.data.updateInput(inputIndex, { finalScriptWitness });
		if (!finalScriptSig && !finalScriptWitness) throw new Error(`Unknown error finalizing input #${inputIndex}`);
		this.data.clearFinalizedInput(inputIndex);
		return this;
	}
	_finalizeTaprootInput(inputIndex, input, tapLeafHashToFinalize, finalScriptsFunc = tapScriptFinalizer) {
		if (!input.witnessUtxo) throw new Error(`Cannot finalize input #${inputIndex}. Missing withness utxo.`);
		if (input.tapKeySig) {
			const finalScriptWitness = witnessStackToScriptWitness(p2tr({
				output: input.witnessUtxo.script,
				signature: input.tapKeySig
			}).witness);
			this.data.updateInput(inputIndex, { finalScriptWitness });
		} else {
			const { finalScriptWitness } = finalScriptsFunc(inputIndex, input, tapLeafHashToFinalize);
			this.data.updateInput(inputIndex, { finalScriptWitness });
		}
		this.data.clearFinalizedInput(inputIndex);
		return this;
	}
	getInputType(inputIndex) {
		const input = checkForInput(this.data.inputs, inputIndex);
		const result = getMeaningfulScript(getScriptFromUtxo(inputIndex, input, this.__CACHE), inputIndex, "input", input.redeemScript || redeemFromFinalScriptSig(input.finalScriptSig), input.witnessScript || redeemFromFinalWitnessScript(input.finalScriptWitness));
		return (result.type === "raw" ? "" : result.type + "-") + classifyScript(result.meaningfulScript);
	}
	inputHasPubkey(inputIndex, pubkey) {
		return pubkeyInInput(pubkey, checkForInput(this.data.inputs, inputIndex), inputIndex, this.__CACHE);
	}
	inputHasHDKey(inputIndex, root) {
		const input = checkForInput(this.data.inputs, inputIndex);
		const derivationIsMine = bip32DerivationIsMine(root);
		return !!input.bip32Derivation && input.bip32Derivation.some(derivationIsMine);
	}
	outputHasPubkey(outputIndex, pubkey) {
		return pubkeyInOutput(pubkey, checkForOutput(this.data.outputs, outputIndex), outputIndex, this.__CACHE);
	}
	outputHasHDKey(outputIndex, root) {
		const output = checkForOutput(this.data.outputs, outputIndex);
		const derivationIsMine = bip32DerivationIsMine(root);
		return !!output.bip32Derivation && output.bip32Derivation.some(derivationIsMine);
	}
	validateSignaturesOfAllInputs(validator) {
		checkForInput(this.data.inputs, 0);
		return range(this.data.inputs.length).map((idx) => this.validateSignaturesOfInput(idx, validator)).reduce((final, res) => res === true && final, true);
	}
	validateSignaturesOfInput(inputIndex, validator, pubkey) {
		const input = this.data.inputs[inputIndex];
		if (isTaprootInput(input)) return this.validateSignaturesOfTaprootInput(inputIndex, validator, pubkey);
		return this._validateSignaturesOfInput(inputIndex, validator, pubkey);
	}
	_validateSignaturesOfInput(inputIndex, validator, pubkey) {
		const input = this.data.inputs[inputIndex];
		const partialSig = (input || {}).partialSig;
		if (!input || !partialSig || partialSig.length < 1) throw new Error("No signatures to validate");
		if (typeof validator !== "function") throw new Error("Need validator function to validate signatures");
		const mySigs = pubkey ? partialSig.filter((sig) => compare(sig.pubkey, pubkey) === 0) : partialSig;
		if (mySigs.length < 1) throw new Error("No signatures for this pubkey");
		const results = [];
		let hashCache;
		let scriptCache;
		let sighashCache;
		for (const pSig of mySigs) {
			const sig = signature.decode(pSig.signature);
			const { hash, script } = sighashCache !== sig.hashType ? getHashForSig(inputIndex, Object.assign({}, input, { sighashType: sig.hashType }), this.__CACHE, true) : {
				hash: hashCache,
				script: scriptCache
			};
			sighashCache = sig.hashType;
			hashCache = hash;
			scriptCache = script;
			checkScriptForPubkey(pSig.pubkey, script, "verify");
			results.push(validator(pSig.pubkey, hash, sig.signature));
		}
		return results.every((res) => res === true);
	}
	validateSignaturesOfTaprootInput(inputIndex, validator, pubkey) {
		const input = this.data.inputs[inputIndex];
		const tapKeySig = (input || {}).tapKeySig;
		const tapScriptSig = (input || {}).tapScriptSig;
		if (!input && !tapKeySig && !(tapScriptSig && !tapScriptSig.length)) throw new Error("No signatures to validate");
		if (typeof validator !== "function") throw new Error("Need validator function to validate signatures");
		pubkey = pubkey && toXOnly(pubkey);
		const allHashses = pubkey ? getTaprootHashesForSigValidation(inputIndex, input, this.data.inputs, pubkey, this.__CACHE) : getAllTaprootHashesForSigValidation(inputIndex, input, this.data.inputs, this.__CACHE);
		if (!allHashses.length) throw new Error("No signatures for this pubkey");
		const tapKeyHash = allHashses.find((h) => !h.leafHash);
		let validationResultCount = 0;
		if (tapKeySig && tapKeyHash) {
			if (!validator(tapKeyHash.pubkey, tapKeyHash.hash, trimTaprootSig(tapKeySig))) return false;
			validationResultCount++;
		}
		if (tapScriptSig) for (const tapSig of tapScriptSig) {
			const tapSigHash = allHashses.find((h) => compare(h.pubkey, tapSig.pubkey) === 0);
			if (tapSigHash) {
				if (!validator(tapSig.pubkey, tapSigHash.hash, trimTaprootSig(tapSig.signature))) return false;
				validationResultCount++;
			}
		}
		return validationResultCount > 0;
	}
	signAllInputsHD(hdKeyPair, sighashTypes = [Transaction.SIGHASH_ALL]) {
		if (!hdKeyPair || !hdKeyPair.publicKey || !hdKeyPair.fingerprint) throw new Error("Need HDSigner to sign input");
		const results = [];
		for (const i of range(this.data.inputs.length)) try {
			this.signInputHD(i, hdKeyPair, sighashTypes);
			results.push(true);
		} catch (err) {
			results.push(false);
		}
		if (results.every((v) => v === false)) throw new Error("No inputs were signed");
		return this;
	}
	signAllInputsHDAsync(hdKeyPair, sighashTypes = [Transaction.SIGHASH_ALL]) {
		return new Promise((resolve, reject) => {
			if (!hdKeyPair || !hdKeyPair.publicKey || !hdKeyPair.fingerprint) return reject(/* @__PURE__ */ new Error("Need HDSigner to sign input"));
			const results = [];
			const promises = [];
			for (const i of range(this.data.inputs.length)) promises.push(this.signInputHDAsync(i, hdKeyPair, sighashTypes).then(() => {
				results.push(true);
			}, () => {
				results.push(false);
			}));
			return Promise.all(promises).then(() => {
				if (results.every((v) => v === false)) return reject(/* @__PURE__ */ new Error("No inputs were signed"));
				resolve();
			});
		});
	}
	signInputHD(inputIndex, hdKeyPair, sighashTypes = [Transaction.SIGHASH_ALL]) {
		if (!hdKeyPair || !hdKeyPair.publicKey || !hdKeyPair.fingerprint) throw new Error("Need HDSigner to sign input");
		getSignersFromHD(inputIndex, this.data.inputs, hdKeyPair).forEach((signer) => this.signInput(inputIndex, signer, sighashTypes));
		return this;
	}
	signInputHDAsync(inputIndex, hdKeyPair, sighashTypes = [Transaction.SIGHASH_ALL]) {
		return new Promise((resolve, reject) => {
			if (!hdKeyPair || !hdKeyPair.publicKey || !hdKeyPair.fingerprint) return reject(/* @__PURE__ */ new Error("Need HDSigner to sign input"));
			const promises = getSignersFromHD(inputIndex, this.data.inputs, hdKeyPair).map((signer) => this.signInputAsync(inputIndex, signer, sighashTypes));
			return Promise.all(promises).then(() => {
				resolve();
			}).catch(reject);
		});
	}
	signAllInputs(keyPair, sighashTypes) {
		if (!keyPair || !keyPair.publicKey) throw new Error("Need Signer to sign input");
		const results = [];
		for (const i of range(this.data.inputs.length)) try {
			this.signInput(i, keyPair, sighashTypes);
			results.push(true);
		} catch (err) {
			results.push(false);
		}
		if (results.every((v) => v === false)) throw new Error("No inputs were signed");
		return this;
	}
	signAllInputsAsync(keyPair, sighashTypes) {
		return new Promise((resolve, reject) => {
			if (!keyPair || !keyPair.publicKey) return reject(/* @__PURE__ */ new Error("Need Signer to sign input"));
			const results = [];
			const promises = [];
			for (const [i] of this.data.inputs.entries()) promises.push(this.signInputAsync(i, keyPair, sighashTypes).then(() => {
				results.push(true);
			}, () => {
				results.push(false);
			}));
			return Promise.all(promises).then(() => {
				if (results.every((v) => v === false)) return reject(/* @__PURE__ */ new Error("No inputs were signed"));
				resolve();
			});
		});
	}
	signInput(inputIndex, keyPair, sighashTypes) {
		if (!keyPair || !keyPair.publicKey) throw new Error("Need Signer to sign input");
		const input = checkForInput(this.data.inputs, inputIndex);
		if (isTaprootInput(input)) return this._signTaprootInput(inputIndex, input, keyPair, void 0, sighashTypes);
		return this._signInput(inputIndex, keyPair, sighashTypes);
	}
	signTaprootInput(inputIndex, keyPair, tapLeafHashToSign, sighashTypes) {
		if (!keyPair || !keyPair.publicKey) throw new Error("Need Signer to sign input");
		const input = checkForInput(this.data.inputs, inputIndex);
		if (isTaprootInput(input)) return this._signTaprootInput(inputIndex, input, keyPair, tapLeafHashToSign, sighashTypes);
		throw new Error(`Input #${inputIndex} is not of type Taproot.`);
	}
	_signInput(inputIndex, keyPair, sighashTypes = [Transaction.SIGHASH_ALL]) {
		const { hash, sighashType } = getHashAndSighashType(this.data.inputs, inputIndex, keyPair.publicKey, this.__CACHE, sighashTypes);
		const partialSig = [{
			pubkey: keyPair.publicKey,
			signature: signature.encode(keyPair.sign(hash), sighashType)
		}];
		this.data.updateInput(inputIndex, { partialSig });
		return this;
	}
	_signTaprootInput(inputIndex, input, keyPair, tapLeafHashToSign, allowedSighashTypes = [Transaction.SIGHASH_DEFAULT]) {
		const hashesForSig = this.checkTaprootHashesForSig(inputIndex, input, keyPair, tapLeafHashToSign, allowedSighashTypes);
		const tapKeySig = hashesForSig.filter((h) => !h.leafHash).map((h) => serializeTaprootSignature(keyPair.signSchnorr(h.hash), input.sighashType))[0];
		const tapScriptSig = hashesForSig.filter((h) => !!h.leafHash).map((h) => ({
			pubkey: toXOnly(keyPair.publicKey),
			signature: serializeTaprootSignature(keyPair.signSchnorr(h.hash), input.sighashType),
			leafHash: h.leafHash
		}));
		if (tapKeySig) this.data.updateInput(inputIndex, { tapKeySig });
		if (tapScriptSig.length) this.data.updateInput(inputIndex, { tapScriptSig });
		return this;
	}
	signInputAsync(inputIndex, keyPair, sighashTypes) {
		return Promise.resolve().then(() => {
			if (!keyPair || !keyPair.publicKey) throw new Error("Need Signer to sign input");
			const input = checkForInput(this.data.inputs, inputIndex);
			if (isTaprootInput(input)) return this._signTaprootInputAsync(inputIndex, input, keyPair, void 0, sighashTypes);
			return this._signInputAsync(inputIndex, keyPair, sighashTypes);
		});
	}
	signTaprootInputAsync(inputIndex, keyPair, tapLeafHash, sighashTypes) {
		return Promise.resolve().then(() => {
			if (!keyPair || !keyPair.publicKey) throw new Error("Need Signer to sign input");
			const input = checkForInput(this.data.inputs, inputIndex);
			if (isTaprootInput(input)) return this._signTaprootInputAsync(inputIndex, input, keyPair, tapLeafHash, sighashTypes);
			throw new Error(`Input #${inputIndex} is not of type Taproot.`);
		});
	}
	_signInputAsync(inputIndex, keyPair, sighashTypes = [Transaction.SIGHASH_ALL]) {
		const { hash, sighashType } = getHashAndSighashType(this.data.inputs, inputIndex, keyPair.publicKey, this.__CACHE, sighashTypes);
		return Promise.resolve(keyPair.sign(hash)).then((signature$1) => {
			const partialSig = [{
				pubkey: keyPair.publicKey,
				signature: signature.encode(signature$1, sighashType)
			}];
			this.data.updateInput(inputIndex, { partialSig });
		});
	}
	async _signTaprootInputAsync(inputIndex, input, keyPair, tapLeafHash, sighashTypes = [Transaction.SIGHASH_DEFAULT]) {
		const hashesForSig = this.checkTaprootHashesForSig(inputIndex, input, keyPair, tapLeafHash, sighashTypes);
		const signaturePromises = [];
		const tapKeyHash = hashesForSig.filter((h) => !h.leafHash)[0];
		if (tapKeyHash) {
			const tapKeySigPromise = Promise.resolve(keyPair.signSchnorr(tapKeyHash.hash)).then((sig) => {
				return { tapKeySig: serializeTaprootSignature(sig, input.sighashType) };
			});
			signaturePromises.push(tapKeySigPromise);
		}
		const tapScriptHashes = hashesForSig.filter((h) => !!h.leafHash);
		if (tapScriptHashes.length) {
			const tapScriptSigPromises = tapScriptHashes.map((tsh) => {
				return Promise.resolve(keyPair.signSchnorr(tsh.hash)).then((signature) => {
					return { tapScriptSig: [{
						pubkey: toXOnly(keyPair.publicKey),
						signature: serializeTaprootSignature(signature, input.sighashType),
						leafHash: tsh.leafHash
					}] };
				});
			});
			signaturePromises.push(...tapScriptSigPromises);
		}
		return Promise.all(signaturePromises).then((results) => {
			results.forEach((v) => this.data.updateInput(inputIndex, v));
		});
	}
	checkTaprootHashesForSig(inputIndex, input, keyPair, tapLeafHashToSign, allowedSighashTypes) {
		if (typeof keyPair.signSchnorr !== "function") throw new Error(`Need Schnorr Signer to sign taproot input #${inputIndex}.`);
		const hashesForSig = getTaprootHashesForSigning(inputIndex, input, this.data.inputs, keyPair.publicKey, this.__CACHE, tapLeafHashToSign, allowedSighashTypes);
		if (!hashesForSig || !hashesForSig.length) throw new Error(`Can not sign for input #${inputIndex} with the key ${toHex(keyPair.publicKey)}`);
		return hashesForSig;
	}
	toBuffer() {
		checkCache(this.__CACHE);
		return this.data.toBuffer();
	}
	toHex() {
		checkCache(this.__CACHE);
		return this.data.toHex();
	}
	toBase64() {
		checkCache(this.__CACHE);
		return this.data.toBase64();
	}
	updateGlobal(updateData) {
		this.data.updateGlobal(updateData);
		return this;
	}
	updateInput(inputIndex, updateData) {
		if (updateData.witnessScript) checkInvalidP2WSH(updateData.witnessScript);
		checkTaprootInputFields(this.data.inputs[inputIndex], updateData, "updateInput");
		this.data.updateInput(inputIndex, updateData);
		if (updateData.nonWitnessUtxo) addNonWitnessTxCache(this.__CACHE, this.data.inputs[inputIndex], inputIndex);
		return this;
	}
	updateOutput(outputIndex, updateData) {
		const outputData = this.data.outputs[outputIndex];
		checkTaprootOutputFields(outputData, updateData, "updateOutput");
		this.data.updateOutput(outputIndex, updateData);
		return this;
	}
	addUnknownKeyValToGlobal(keyVal) {
		this.data.addUnknownKeyValToGlobal(keyVal);
		return this;
	}
	addUnknownKeyValToInput(inputIndex, keyVal) {
		this.data.addUnknownKeyValToInput(inputIndex, keyVal);
		return this;
	}
	addUnknownKeyValToOutput(outputIndex, keyVal) {
		this.data.addUnknownKeyValToOutput(outputIndex, keyVal);
		return this;
	}
	clearFinalizedInput(inputIndex) {
		this.data.clearFinalizedInput(inputIndex);
		return this;
	}
};
/**
* This function is needed to pass to the bip174 base class's fromBuffer.
* It takes the "transaction buffer" portion of the psbt buffer and returns a
* Transaction (From the bip174 library) interface.
*/
var transactionFromBuffer = (buffer) => new PsbtTransaction(buffer);
/**
* This class implements the Transaction interface from bip174 library.
* It contains a bitcoinjs-lib Transaction object.
*/
var PsbtTransaction = class {
	tx;
	constructor(buffer = Uint8Array.from([
		2,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	])) {
		this.tx = Transaction.fromBuffer(buffer);
		checkTxEmpty(this.tx);
		Object.defineProperty(this, "tx", {
			enumerable: false,
			writable: true
		});
	}
	getInputOutputCounts() {
		return {
			inputCount: this.tx.ins.length,
			outputCount: this.tx.outs.length
		};
	}
	addInput(input) {
		if (input.hash === void 0 || input.index === void 0 || !(input.hash instanceof Uint8Array) && typeof input.hash !== "string" || typeof input.index !== "number") throw new Error("Error adding input.");
		const hash = typeof input.hash === "string" ? reverseBuffer(fromHex(input.hash)) : input.hash;
		this.tx.addInput(hash, input.index, input.sequence);
	}
	addOutput(output) {
		if (output.script === void 0 || output.value === void 0 || !(output.script instanceof Uint8Array) || typeof output.value !== "bigint") throw new Error("Error adding output.");
		this.tx.addOutput(output.script, output.value);
	}
	toBuffer() {
		return this.tx.toBuffer();
	}
};
function canFinalize(input, script, scriptType) {
	switch (scriptType) {
		case "pubkey":
		case "pubkeyhash":
		case "witnesspubkeyhash": return hasSigs(1, input.partialSig);
		case "multisig":
			const p2ms$1 = p2ms({ output: script });
			return hasSigs(p2ms$1.m, input.partialSig, p2ms$1.pubkeys);
		default: return false;
	}
}
function checkCache(cache) {
	if (cache.__UNSAFE_SIGN_NONSEGWIT !== false) throw new Error("Not BIP174 compliant, can not export");
}
function hasSigs(neededSigs, partialSig, pubkeys) {
	if (!partialSig) return false;
	let sigs;
	if (pubkeys) sigs = pubkeys.map((pkey) => {
		const pubkey = compressPubkey(pkey);
		return partialSig.find((pSig) => compare(pSig.pubkey, pubkey) === 0);
	}).filter((v) => !!v);
	else sigs = partialSig;
	if (sigs.length > neededSigs) throw new Error("Too many signatures");
	return sigs.length === neededSigs;
}
function isFinalized(input) {
	return !!input.finalScriptSig || !!input.finalScriptWitness;
}
function bip32DerivationIsMine(root) {
	return (d) => {
		if (compare(root.fingerprint, d.masterFingerprint)) return false;
		if (compare(root.derivePath(d.path).publicKey, d.pubkey)) return false;
		return true;
	};
}
function check32Bit(num) {
	if (typeof num !== "number" || num !== Math.floor(num) || num > 4294967295 || num < 0) throw new Error("Invalid 32 bit integer");
}
function checkFees(psbt, cache, opts) {
	const feeRate = cache.__FEE_RATE || psbt.getFeeRate();
	const vsize = cache.__EXTRACTED_TX.virtualSize();
	const satoshis = feeRate * vsize;
	if (feeRate >= opts.maximumFeeRate) throw new Error(`Warning: You are paying around ${(satoshis / 1e8).toFixed(8)} in fees, which is ${feeRate} satoshi per byte for a transaction with a VSize of ${vsize} bytes (segwit counted as 0.25 byte per byte). Use setMaximumFeeRate method to raise your threshold, or pass true to the first arg of extractTransaction.`);
}
function checkInputsForPartialSig(inputs, action) {
	inputs.forEach((input) => {
		if (isTaprootInput(input) ? checkTaprootInputForSigs(input, action) : checkInputForSig(input, action)) throw new Error("Can not modify transaction, signatures exist.");
	});
}
function checkPartialSigSighashes(input) {
	if (!input.sighashType || !input.partialSig) return;
	const { partialSig, sighashType } = input;
	partialSig.forEach((pSig) => {
		const { hashType } = signature.decode(pSig.signature);
		if (sighashType !== hashType) throw new Error("Signature sighash does not match input sighash type");
	});
}
function checkScriptForPubkey(pubkey, script, action) {
	if (!pubkeyInScript(pubkey, script)) throw new Error(`Can not ${action} for this input with the key ${toHex(pubkey)}`);
}
function checkTxEmpty(tx) {
	if (!tx.ins.every((input) => input.script && input.script.length === 0 && input.witness && input.witness.length === 0)) throw new Error("Format Error: Transaction ScriptSigs are not empty");
}
function checkTxForDupeIns(tx, cache) {
	tx.ins.forEach((input) => {
		checkTxInputCache(cache, input);
	});
}
function checkTxInputCache(cache, input) {
	const key = toHex(reverseBuffer(Uint8Array.from(input.hash))) + ":" + input.index;
	if (cache.__TX_IN_CACHE[key]) throw new Error("Duplicate input detected.");
	cache.__TX_IN_CACHE[key] = 1;
}
function scriptCheckerFactory(payment, paymentScriptName) {
	return (inputIndex, scriptPubKey, redeemScript, ioType) => {
		const redeemScriptOutput = payment({ redeem: { output: redeemScript } }).output;
		if (compare(scriptPubKey, redeemScriptOutput)) throw new Error(`${paymentScriptName} for ${ioType} #${inputIndex} doesn't match the scriptPubKey in the prevout`);
	};
}
var checkRedeemScript = scriptCheckerFactory(p2sh, "Redeem script");
var checkWitnessScript = scriptCheckerFactory(p2wsh, "Witness script");
function getTxCacheValue(key, name, inputs, c) {
	if (!inputs.every(isFinalized)) throw new Error(`PSBT must be finalized to calculate ${name}`);
	if (key === "__FEE_RATE" && c.__FEE_RATE) return c.__FEE_RATE;
	if (key === "__FEE" && c.__FEE) return c.__FEE;
	let tx;
	let mustFinalize = true;
	if (c.__EXTRACTED_TX) {
		tx = c.__EXTRACTED_TX;
		mustFinalize = false;
	} else tx = c.__TX.clone();
	inputFinalizeGetAmts(inputs, tx, c, mustFinalize);
	if (key === "__FEE_RATE") return c.__FEE_RATE;
	else if (key === "__FEE") return c.__FEE;
}
function getFinalScripts(inputIndex, input, script, isSegwit, isP2SH, isP2WSH) {
	const scriptType = classifyScript(script);
	if (!canFinalize(input, script, scriptType)) throw new Error(`Can not finalize input #${inputIndex}`);
	return prepareFinalScripts(script, scriptType, input.partialSig, isSegwit, isP2SH, isP2WSH);
}
function prepareFinalScripts(script, scriptType, partialSig, isSegwit, isP2SH, isP2WSH) {
	let finalScriptSig;
	let finalScriptWitness;
	const payment = getPayment(script, scriptType, partialSig);
	const p2wsh$1 = !isP2WSH ? null : p2wsh({ redeem: payment });
	const p2sh$1 = !isP2SH ? null : p2sh({ redeem: p2wsh$1 || payment });
	if (isSegwit) {
		if (p2wsh$1) finalScriptWitness = witnessStackToScriptWitness(p2wsh$1.witness);
		else finalScriptWitness = witnessStackToScriptWitness(payment.witness);
		if (p2sh$1) finalScriptSig = p2sh$1.input;
	} else if (p2sh$1) finalScriptSig = p2sh$1.input;
	else finalScriptSig = payment.input;
	return {
		finalScriptSig,
		finalScriptWitness
	};
}
function getHashAndSighashType(inputs, inputIndex, pubkey, cache, sighashTypes) {
	const { hash, sighashType, script } = getHashForSig(inputIndex, checkForInput(inputs, inputIndex), cache, false, sighashTypes);
	checkScriptForPubkey(pubkey, script, "sign");
	return {
		hash,
		sighashType
	};
}
function getHashForSig(inputIndex, input, cache, forValidate, sighashTypes) {
	const unsignedTx = cache.__TX;
	const sighashType = input.sighashType || Transaction.SIGHASH_ALL;
	checkSighashTypeAllowed(sighashType, sighashTypes);
	let hash;
	let prevout;
	if (input.nonWitnessUtxo) {
		const nonWitnessUtxoTx = nonWitnessUtxoTxFromCache(cache, input, inputIndex);
		const prevoutHash = unsignedTx.ins[inputIndex].hash;
		if (compare(prevoutHash, nonWitnessUtxoTx.getHash()) !== 0) throw new Error(`Non-witness UTXO hash for input #${inputIndex} doesn't match the hash specified in the prevout`);
		const prevoutIndex = unsignedTx.ins[inputIndex].index;
		prevout = nonWitnessUtxoTx.outs[prevoutIndex];
	} else if (input.witnessUtxo) prevout = input.witnessUtxo;
	else throw new Error("Need a Utxo input item for signing");
	const { meaningfulScript, type } = getMeaningfulScript(prevout.script, inputIndex, "input", input.redeemScript, input.witnessScript);
	if (["p2sh-p2wsh", "p2wsh"].indexOf(type) >= 0) hash = unsignedTx.hashForWitnessV0(inputIndex, meaningfulScript, prevout.value, sighashType);
	else if (isP2WPKH(meaningfulScript)) {
		const signingScript = p2pkh({ hash: meaningfulScript.slice(2) }).output;
		hash = unsignedTx.hashForWitnessV0(inputIndex, signingScript, prevout.value, sighashType);
	} else {
		if (input.nonWitnessUtxo === void 0 && cache.__UNSAFE_SIGN_NONSEGWIT === false) throw new Error(`Input #${inputIndex} has witnessUtxo but non-segwit script: ${toHex(meaningfulScript)}`);
		if (!forValidate && cache.__UNSAFE_SIGN_NONSEGWIT !== false) console.warn("Warning: Signing non-segwit inputs without the full parent transaction means there is a chance that a miner could feed you incorrect information to trick you into paying large fees. This behavior is the same as Psbt's predecessor (TransactionBuilder - now removed) when signing non-segwit scripts. You are not able to export this Psbt with toBuffer|toBase64|toHex since it is not BIP174 compliant.\n*********************\nPROCEED WITH CAUTION!\n*********************");
		hash = unsignedTx.hashForSignature(inputIndex, meaningfulScript, sighashType);
	}
	return {
		script: meaningfulScript,
		sighashType,
		hash
	};
}
function getAllTaprootHashesForSigValidation(inputIndex, input, inputs, cache) {
	const allPublicKeys = [];
	if (input.tapInternalKey) {
		const key = getPrevoutTaprootKey(inputIndex, input, cache);
		if (key) allPublicKeys.push(key);
	}
	if (input.tapScriptSig) {
		const tapScriptPubkeys = input.tapScriptSig.map((tss) => tss.pubkey);
		allPublicKeys.push(...tapScriptPubkeys);
	}
	return allPublicKeys.map((publicKey) => getTaprootHashesForSigValidation(inputIndex, input, inputs, publicKey, cache)).flat();
}
function getPrevoutTaprootKey(inputIndex, input, cache) {
	const { script } = getScriptAndAmountFromUtxo(inputIndex, input, cache);
	return isP2TR(script) ? script.subarray(2, 34) : null;
}
function trimTaprootSig(signature) {
	return signature.length === 64 ? signature : signature.subarray(0, 64);
}
function getTaprootHashesForSigning(inputIndex, input, inputs, pubkey, cache, tapLeafHashToSign, allowedSighashTypes) {
	const sighashType = input.sighashType || Transaction.SIGHASH_DEFAULT;
	checkSighashTypeAllowed(sighashType, allowedSighashTypes);
	return getTaprootHashesForSig(inputIndex, input, inputs, pubkey, cache, Boolean(input.tapInternalKey && !tapLeafHashToSign), sighashType, tapLeafHashToSign);
}
function getTaprootHashesForSigValidation(inputIndex, input, inputs, pubkey, cache) {
	const sighashType = input.sighashType || Transaction.SIGHASH_DEFAULT;
	return getTaprootHashesForSig(inputIndex, input, inputs, pubkey, cache, Boolean(input.tapKeySig), sighashType);
}
function getTaprootHashesForSig(inputIndex, input, inputs, pubkey, cache, keySpend, sighashType, tapLeafHashToSign) {
	const unsignedTx = cache.__TX;
	const prevOuts = inputs.map((i, index) => getScriptAndAmountFromUtxo(index, i, cache));
	const signingScripts = prevOuts.map((o) => o.script);
	const values = prevOuts.map((o) => o.value);
	const hashes = [];
	if (keySpend) {
		const outputKey = getPrevoutTaprootKey(inputIndex, input, cache) || Uint8Array.from([]);
		if (compare(toXOnly(pubkey), outputKey) === 0) {
			const tapKeyHash = unsignedTx.hashForWitnessV1(inputIndex, signingScripts, values, sighashType);
			hashes.push({
				pubkey,
				hash: tapKeyHash
			});
		}
	}
	const tapLeafHashes = (input.tapLeafScript || []).filter((tapLeaf) => pubkeyInScript(pubkey, tapLeaf.script)).map((tapLeaf) => {
		const hash = tapleafHash({
			output: tapLeaf.script,
			version: tapLeaf.leafVersion
		});
		return Object.assign({ hash }, tapLeaf);
	}).filter((tapLeaf) => !tapLeafHashToSign || compare(tapLeafHashToSign, tapLeaf.hash) === 0).map((tapLeaf) => {
		return {
			pubkey,
			hash: unsignedTx.hashForWitnessV1(inputIndex, signingScripts, values, sighashType, tapLeaf.hash),
			leafHash: tapLeaf.hash
		};
	});
	return hashes.concat(tapLeafHashes);
}
function checkSighashTypeAllowed(sighashType, sighashTypes) {
	if (sighashTypes && sighashTypes.indexOf(sighashType) < 0) {
		const str = sighashTypeToString(sighashType);
		throw new Error(`Sighash type is not allowed. Retry the sign method passing the sighashTypes array of whitelisted types. Sighash type: ${str}`);
	}
}
function getPayment(script, scriptType, partialSig) {
	let payment;
	switch (scriptType) {
		case "multisig":
			payment = p2ms({
				output: script,
				signatures: getSortedSigs(script, partialSig)
			});
			break;
		case "pubkey":
			payment = p2pk({
				output: script,
				signature: partialSig[0].signature
			});
			break;
		case "pubkeyhash":
			payment = p2pkh({
				output: script,
				pubkey: partialSig[0].pubkey,
				signature: partialSig[0].signature
			});
			break;
		case "witnesspubkeyhash":
			payment = p2wpkh({
				output: script,
				pubkey: partialSig[0].pubkey,
				signature: partialSig[0].signature
			});
			break;
	}
	return payment;
}
function getScriptFromInput(inputIndex, input, cache) {
	const unsignedTx = cache.__TX;
	const res = {
		script: null,
		isSegwit: false,
		isP2SH: false,
		isP2WSH: false
	};
	res.isP2SH = !!input.redeemScript;
	res.isP2WSH = !!input.witnessScript;
	if (input.witnessScript) res.script = input.witnessScript;
	else if (input.redeemScript) res.script = input.redeemScript;
	else if (input.nonWitnessUtxo) {
		const nonWitnessUtxoTx = nonWitnessUtxoTxFromCache(cache, input, inputIndex);
		const prevoutIndex = unsignedTx.ins[inputIndex].index;
		res.script = nonWitnessUtxoTx.outs[prevoutIndex].script;
	} else if (input.witnessUtxo) res.script = input.witnessUtxo.script;
	if (input.witnessScript || isP2WPKH(res.script)) res.isSegwit = true;
	return res;
}
function getSignersFromHD(inputIndex, inputs, hdKeyPair) {
	const input = checkForInput(inputs, inputIndex);
	if (!input.bip32Derivation || input.bip32Derivation.length === 0) throw new Error("Need bip32Derivation to sign with HD");
	const myDerivations = input.bip32Derivation.map((bipDv) => {
		if (compare(bipDv.masterFingerprint, hdKeyPair.fingerprint) === 0) return bipDv;
		else return;
	}).filter((v) => !!v);
	if (myDerivations.length === 0) throw new Error("Need one bip32Derivation masterFingerprint to match the HDSigner fingerprint");
	return myDerivations.map((bipDv) => {
		const node = hdKeyPair.derivePath(bipDv.path);
		if (compare(bipDv.pubkey, node.publicKey) !== 0) throw new Error("pubkey did not match bip32Derivation");
		return node;
	});
}
function getSortedSigs(script, partialSig) {
	return p2ms({ output: script }).pubkeys.map((pk) => {
		return (partialSig.filter((ps) => {
			return compare(ps.pubkey, pk) === 0;
		})[0] || {}).signature;
	}).filter((v) => !!v);
}
function scriptWitnessToWitnessStack(buffer) {
	let offset = 0;
	function readSlice(n) {
		offset += n;
		return buffer.slice(offset - n, offset);
	}
	function readVarInt() {
		const vi = decode$4(buffer, offset);
		offset += encodingLength$1(vi.bigintValue);
		return vi.numberValue;
	}
	function readVarSlice() {
		return readSlice(readVarInt());
	}
	function readVector() {
		const count = readVarInt();
		const vector = [];
		for (let i = 0; i < count; i++) vector.push(readVarSlice());
		return vector;
	}
	return readVector();
}
function sighashTypeToString(sighashType) {
	let text = sighashType & Transaction.SIGHASH_ANYONECANPAY ? "SIGHASH_ANYONECANPAY | " : "";
	switch (sighashType & 31) {
		case Transaction.SIGHASH_ALL:
			text += "SIGHASH_ALL";
			break;
		case Transaction.SIGHASH_SINGLE:
			text += "SIGHASH_SINGLE";
			break;
		case Transaction.SIGHASH_NONE:
			text += "SIGHASH_NONE";
			break;
	}
	return text;
}
function addNonWitnessTxCache(cache, input, inputIndex) {
	cache.__NON_WITNESS_UTXO_BUF_CACHE[inputIndex] = input.nonWitnessUtxo;
	const tx = Transaction.fromBuffer(input.nonWitnessUtxo);
	cache.__NON_WITNESS_UTXO_TX_CACHE[inputIndex] = tx;
	const self = cache;
	const selfIndex = inputIndex;
	delete input.nonWitnessUtxo;
	Object.defineProperty(input, "nonWitnessUtxo", {
		enumerable: true,
		get() {
			const buf = self.__NON_WITNESS_UTXO_BUF_CACHE[selfIndex];
			const txCache = self.__NON_WITNESS_UTXO_TX_CACHE[selfIndex];
			if (buf !== void 0) return buf;
			else {
				const newBuf = txCache.toBuffer();
				self.__NON_WITNESS_UTXO_BUF_CACHE[selfIndex] = newBuf;
				return newBuf;
			}
		},
		set(data) {
			self.__NON_WITNESS_UTXO_BUF_CACHE[selfIndex] = data;
		}
	});
}
function inputFinalizeGetAmts(inputs, tx, cache, mustFinalize) {
	let inputAmount = 0n;
	inputs.forEach((input, idx) => {
		if (mustFinalize && input.finalScriptSig) tx.ins[idx].script = input.finalScriptSig;
		if (mustFinalize && input.finalScriptWitness) tx.ins[idx].witness = scriptWitnessToWitnessStack(input.finalScriptWitness);
		if (input.witnessUtxo) inputAmount += input.witnessUtxo.value;
		else if (input.nonWitnessUtxo) {
			const nwTx = nonWitnessUtxoTxFromCache(cache, input, idx);
			const vout = tx.ins[idx].index;
			const out = nwTx.outs[vout];
			inputAmount += out.value;
		}
	});
	const outputAmount = tx.outs.reduce((total, o) => total + o.value, 0n);
	const fee = inputAmount - outputAmount;
	if (fee < 0) throw new Error("Outputs are spending more than Inputs");
	const bytes = tx.virtualSize();
	cache.__FEE = fee;
	cache.__EXTRACTED_TX = tx;
	cache.__FEE_RATE = Math.floor(Number(fee / BigInt(bytes)));
}
function nonWitnessUtxoTxFromCache(cache, input, inputIndex) {
	const c = cache.__NON_WITNESS_UTXO_TX_CACHE;
	if (!c[inputIndex]) addNonWitnessTxCache(cache, input, inputIndex);
	return c[inputIndex];
}
function getScriptFromUtxo(inputIndex, input, cache) {
	const { script } = getScriptAndAmountFromUtxo(inputIndex, input, cache);
	return script;
}
function getScriptAndAmountFromUtxo(inputIndex, input, cache) {
	if (input.witnessUtxo !== void 0) return {
		script: input.witnessUtxo.script,
		value: input.witnessUtxo.value
	};
	else if (input.nonWitnessUtxo !== void 0) {
		const o = nonWitnessUtxoTxFromCache(cache, input, inputIndex).outs[cache.__TX.ins[inputIndex].index];
		return {
			script: o.script,
			value: o.value
		};
	} else throw new Error("Can't find pubkey in input without Utxo data");
}
function pubkeyInInput(pubkey, input, inputIndex, cache) {
	const { meaningfulScript } = getMeaningfulScript(getScriptFromUtxo(inputIndex, input, cache), inputIndex, "input", input.redeemScript, input.witnessScript);
	return pubkeyInScript(pubkey, meaningfulScript);
}
function pubkeyInOutput(pubkey, output, outputIndex, cache) {
	const script = cache.__TX.outs[outputIndex].script;
	const { meaningfulScript } = getMeaningfulScript(script, outputIndex, "output", output.redeemScript, output.witnessScript);
	return pubkeyInScript(pubkey, meaningfulScript);
}
function redeemFromFinalScriptSig(finalScript) {
	if (!finalScript) return;
	const decomp = decompile(finalScript);
	if (!decomp) return;
	const lastItem = decomp[decomp.length - 1];
	if (!(lastItem instanceof Uint8Array) || isPubkeyLike(lastItem) || isSigLike(lastItem)) return;
	if (!decompile(lastItem)) return;
	return lastItem;
}
function redeemFromFinalWitnessScript(finalScript) {
	if (!finalScript) return;
	const decomp = scriptWitnessToWitnessStack(finalScript);
	const lastItem = decomp[decomp.length - 1];
	if (isPubkeyLike(lastItem)) return;
	if (!decompile(lastItem)) return;
	return lastItem;
}
function compressPubkey(pubkey) {
	if (pubkey.length === 65) {
		const parity = pubkey[64] & 1;
		const newKey = pubkey.slice(0, 33);
		newKey[0] = 2 | parity;
		return newKey;
	}
	return pubkey.slice();
}
function isPubkeyLike(buf) {
	return buf.length === 33 && isCanonicalPubKey(buf);
}
function isSigLike(buf) {
	return isCanonicalScriptSignature(buf);
}
function getMeaningfulScript(script, index, ioType, redeemScript, witnessScript) {
	const isP2SH = isP2SHScript(script);
	const isP2SHP2WSH = isP2SH && redeemScript && isP2WSHScript(redeemScript);
	const isP2WSH = isP2WSHScript(script);
	if (isP2SH && redeemScript === void 0) throw new Error("scriptPubkey is P2SH but redeemScript missing");
	if ((isP2WSH || isP2SHP2WSH) && witnessScript === void 0) throw new Error("scriptPubkey or redeemScript is P2WSH but witnessScript missing");
	let meaningfulScript;
	if (isP2SHP2WSH) {
		meaningfulScript = witnessScript;
		checkRedeemScript(index, script, redeemScript, ioType);
		checkWitnessScript(index, redeemScript, witnessScript, ioType);
		checkInvalidP2WSH(meaningfulScript);
	} else if (isP2WSH) {
		meaningfulScript = witnessScript;
		checkWitnessScript(index, script, witnessScript, ioType);
		checkInvalidP2WSH(meaningfulScript);
	} else if (isP2SH) {
		meaningfulScript = redeemScript;
		checkRedeemScript(index, script, redeemScript, ioType);
	} else meaningfulScript = script;
	return {
		meaningfulScript,
		type: isP2SHP2WSH ? "p2sh-p2wsh" : isP2SH ? "p2sh" : isP2WSH ? "p2wsh" : "raw"
	};
}
function checkInvalidP2WSH(script) {
	if (isP2WPKH(script) || isP2SHScript(script)) throw new Error("P2WPKH or P2SH can not be contained within P2WSH");
}
function classifyScript(script) {
	if (isP2WPKH(script)) return "witnesspubkeyhash";
	if (isP2PKH(script)) return "pubkeyhash";
	if (isP2MS(script)) return "multisig";
	if (isP2PK(script)) return "pubkey";
	return "nonstandard";
}
function range(n) {
	return [...Array(n).keys()];
}
//#endregion
export { address_exports as a, crypto_exports as c, networks_exports as d, Transaction as i, script_exports as l, toXOnly as n, payments_exports as o, Block as r, initEccLib as s, Psbt as t, OPS$8 as u };
