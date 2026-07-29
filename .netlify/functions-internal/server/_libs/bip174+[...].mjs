import { r as __exportAll } from "../_runtime.mjs";
//#region node_modules/uint8array-tools/src/mjs/index.js
function fromUtf8$1(s) {
	return Uint8Array.from(Buffer.from(s || "", "utf8"));
}
function concat$1(arrays) {
	return Uint8Array.from(Buffer.concat(arrays));
}
function fromHex$1(hexString) {
	return Uint8Array.from(Buffer.from(hexString || "", "hex"));
}
function compare$1(v1, v2) {
	return Buffer.from(v1).compare(Buffer.from(v2));
}
function writeUInt8(buffer, offset, value) {
	if (offset + 1 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	const buf = Buffer.alloc(1);
	buf.writeUInt8(value, 0);
	buffer.set(Uint8Array.from(buf), offset);
}
function writeUInt16(buffer, offset, value, littleEndian) {
	if (offset + 2 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.alloc(2);
	if (littleEndian === "LE") buf.writeUInt16LE(value, 0);
	else buf.writeUInt16BE(value, 0);
	buffer.set(Uint8Array.from(buf), offset);
}
function writeUInt32$1(buffer, offset, value, littleEndian) {
	if (offset + 4 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.alloc(4);
	if (littleEndian === "LE") buf.writeUInt32LE(value, 0);
	else buf.writeUInt32BE(value, 0);
	buffer.set(Uint8Array.from(buf), offset);
}
function writeUInt64(buffer, offset, value, littleEndian) {
	if (offset + 8 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.alloc(8);
	if (value > 18446744073709551615n) throw new Error(`The value of "value" is out of range. It must be >= 0 and <= 18446744073709551615. Received ${value}`);
	if (littleEndian === "LE") buf.writeBigUInt64LE(value, 0);
	else buf.writeBigUInt64BE(value, 0);
	buffer.set(Uint8Array.from(buf), offset);
}
function readUInt16(buffer, offset, littleEndian) {
	if (offset + 2 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.from(buffer);
	if (littleEndian === "LE") return buf.readUInt16LE(offset);
	else return buf.readUInt16BE(offset);
}
function readUInt32$1(buffer, offset, littleEndian) {
	if (offset + 4 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.from(buffer);
	if (littleEndian === "LE") return buf.readUInt32LE(offset);
	else return buf.readUInt32BE(offset);
}
function readUInt64(buffer, offset, littleEndian) {
	if (offset + 8 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.from(buffer);
	if (littleEndian === "LE") return buf.readBigUInt64LE(offset);
	else return buf.readBigUInt64BE(offset);
}
//#endregion
//#region node_modules/varuint-bitcoin/src/esm/index.js
var checkUInt64 = (n) => {
	if (n < 0 || n > 18446744073709551615n) throw new RangeError("value out of range");
};
function checkUInt53(n) {
	if (n < 0 || n > Number.MAX_SAFE_INTEGER || n % 1 !== 0) throw new RangeError("value out of range");
}
function checkUint53OrUint64(n) {
	if (typeof n === "number") checkUInt53(n);
	else checkUInt64(n);
}
function encode$14(n, buffer, offset) {
	checkUint53OrUint64(n);
	if (offset === void 0) offset = 0;
	if (buffer === void 0) buffer = new Uint8Array(encodingLength(n));
	let bytes = 0;
	if (n < 253) {
		buffer.set([Number(n)], offset);
		bytes = 1;
	} else if (n <= 65535) {
		buffer.set([253], offset);
		writeUInt16(buffer, offset + 1, Number(n), "LE");
		bytes = 3;
	} else if (n <= 4294967295) {
		buffer.set([254], offset);
		writeUInt32$1(buffer, offset + 1, Number(n), "LE");
		bytes = 5;
	} else {
		buffer.set([255], offset);
		writeUInt64(buffer, offset + 1, BigInt(n), "LE");
		bytes = 9;
	}
	return {
		buffer,
		bytes
	};
}
function decode$13(buffer, offset) {
	if (offset === void 0) offset = 0;
	const first = buffer.at(offset);
	if (first === void 0) throw new Error("buffer too small");
	if (first < 253) return {
		numberValue: first,
		bigintValue: BigInt(first),
		bytes: 1
	};
	else if (first === 253) {
		const val = readUInt16(buffer, offset + 1, "LE");
		return {
			numberValue: val,
			bigintValue: BigInt(val),
			bytes: 3
		};
	} else if (first === 254) {
		const val = readUInt32$1(buffer, offset + 1, "LE");
		return {
			numberValue: val,
			bigintValue: BigInt(val),
			bytes: 5
		};
	} else {
		const number = readUInt64(buffer, offset + 1, "LE");
		return {
			numberValue: number <= Number.MAX_SAFE_INTEGER ? Number(number) : null,
			bigintValue: number,
			bytes: 9
		};
	}
}
function encodingLength(n) {
	checkUint53OrUint64(n);
	return n < 253 ? 1 : n <= 65535 ? 3 : n <= 4294967295 ? 5 : 9;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/typeFields.js
var GlobalTypes;
(function(GlobalTypes) {
	GlobalTypes[GlobalTypes["UNSIGNED_TX"] = 0] = "UNSIGNED_TX";
	GlobalTypes[GlobalTypes["GLOBAL_XPUB"] = 1] = "GLOBAL_XPUB";
})(GlobalTypes || (GlobalTypes = {}));
var InputTypes;
(function(InputTypes) {
	InputTypes[InputTypes["NON_WITNESS_UTXO"] = 0] = "NON_WITNESS_UTXO";
	InputTypes[InputTypes["WITNESS_UTXO"] = 1] = "WITNESS_UTXO";
	InputTypes[InputTypes["PARTIAL_SIG"] = 2] = "PARTIAL_SIG";
	InputTypes[InputTypes["SIGHASH_TYPE"] = 3] = "SIGHASH_TYPE";
	InputTypes[InputTypes["REDEEM_SCRIPT"] = 4] = "REDEEM_SCRIPT";
	InputTypes[InputTypes["WITNESS_SCRIPT"] = 5] = "WITNESS_SCRIPT";
	InputTypes[InputTypes["BIP32_DERIVATION"] = 6] = "BIP32_DERIVATION";
	InputTypes[InputTypes["FINAL_SCRIPTSIG"] = 7] = "FINAL_SCRIPTSIG";
	InputTypes[InputTypes["FINAL_SCRIPTWITNESS"] = 8] = "FINAL_SCRIPTWITNESS";
	InputTypes[InputTypes["POR_COMMITMENT"] = 9] = "POR_COMMITMENT";
	InputTypes[InputTypes["TAP_KEY_SIG"] = 19] = "TAP_KEY_SIG";
	InputTypes[InputTypes["TAP_SCRIPT_SIG"] = 20] = "TAP_SCRIPT_SIG";
	InputTypes[InputTypes["TAP_LEAF_SCRIPT"] = 21] = "TAP_LEAF_SCRIPT";
	InputTypes[InputTypes["TAP_BIP32_DERIVATION"] = 22] = "TAP_BIP32_DERIVATION";
	InputTypes[InputTypes["TAP_INTERNAL_KEY"] = 23] = "TAP_INTERNAL_KEY";
	InputTypes[InputTypes["TAP_MERKLE_ROOT"] = 24] = "TAP_MERKLE_ROOT";
})(InputTypes || (InputTypes = {}));
var OutputTypes;
(function(OutputTypes) {
	OutputTypes[OutputTypes["REDEEM_SCRIPT"] = 0] = "REDEEM_SCRIPT";
	OutputTypes[OutputTypes["WITNESS_SCRIPT"] = 1] = "WITNESS_SCRIPT";
	OutputTypes[OutputTypes["BIP32_DERIVATION"] = 2] = "BIP32_DERIVATION";
	OutputTypes[OutputTypes["TAP_INTERNAL_KEY"] = 5] = "TAP_INTERNAL_KEY";
	OutputTypes[OutputTypes["TAP_TREE"] = 6] = "TAP_TREE";
	OutputTypes[OutputTypes["TAP_BIP32_DERIVATION"] = 7] = "TAP_BIP32_DERIVATION";
})(OutputTypes || (OutputTypes = {}));
//#endregion
//#region node_modules/bip174/node_modules/uint8array-tools/src/mjs/index.js
function toUtf8(bytes) {
	return Buffer.from(bytes || []).toString();
}
function fromUtf8(s) {
	return Uint8Array.from(Buffer.from(s || "", "utf8"));
}
function concat(arrays) {
	return Uint8Array.from(Buffer.concat(arrays));
}
function toHex(bytes) {
	return Buffer.from(bytes || []).toString("hex");
}
function fromHex(hexString) {
	return Uint8Array.from(Buffer.from(hexString || "", "hex"));
}
function toBase64(bytes) {
	return Buffer.from(bytes).toString("base64");
}
function fromBase64(base64) {
	return Uint8Array.from(Buffer.from(base64 || "", "base64"));
}
function compare(v1, v2) {
	return Buffer.from(v1).compare(Buffer.from(v2));
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
function readUInt8(buffer, offset) {
	if (offset + 1 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	return Buffer.from(buffer).readUInt8(offset);
}
function readUInt32(buffer, offset, littleEndian) {
	if (offset + 4 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	const buf = Buffer.from(buffer);
	if (littleEndian === "LE") return buf.readUInt32LE(offset);
	else return buf.readUInt32BE(offset);
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
function readInt64(buffer, offset, littleEndian) {
	if (offset + 8 > buffer.length) throw new Error("Offset is outside the bounds of Uint8Array");
	littleEndian = littleEndian.toUpperCase();
	if (littleEndian === "LE") return Buffer.from(buffer).readBigInt64LE(offset);
	else return Buffer.from(buffer).readBigInt64BE(offset);
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/global/globalXpub.js
var globalXpub_exports = /* @__PURE__ */ __exportAll({
	canAddToArray: () => canAddToArray$3,
	check: () => check$12,
	decode: () => decode$12,
	encode: () => encode$13,
	expected: () => expected$12
});
var range$2 = (n) => [...Array(n).keys()];
function decode$12(keyVal) {
	if (keyVal.key[0] !== GlobalTypes.GLOBAL_XPUB) throw new Error("Decode Error: could not decode globalXpub with key 0x" + toHex(keyVal.key));
	if (keyVal.key.length !== 79 || ![2, 3].includes(keyVal.key[46])) throw new Error("Decode Error: globalXpub has invalid extended pubkey in key 0x" + toHex(keyVal.key));
	if (keyVal.value.length / 4 % 1 !== 0) throw new Error("Decode Error: Global GLOBAL_XPUB value length should be multiple of 4");
	const extendedPubkey = keyVal.key.slice(1);
	const data = {
		masterFingerprint: keyVal.value.slice(0, 4),
		extendedPubkey,
		path: "m"
	};
	for (const i of range$2(keyVal.value.length / 4 - 1)) {
		const val = readUInt32(keyVal.value, i * 4 + 4, "LE");
		const isHard = !!(val & 2147483648);
		const idx = val & 2147483647;
		data.path += "/" + idx.toString(10) + (isHard ? "'" : "");
	}
	return data;
}
function encode$13(data) {
	const key = concat([new Uint8Array([GlobalTypes.GLOBAL_XPUB]), data.extendedPubkey]);
	const splitPath = data.path.split("/");
	const value = new Uint8Array(splitPath.length * 4);
	value.set(data.masterFingerprint, 0);
	let offset = 4;
	splitPath.slice(1).forEach((level) => {
		const isHard = level.slice(-1) === "'";
		let num = 2147483647 & parseInt(isHard ? level.slice(0, -1) : level, 10);
		if (isHard) num += 2147483648;
		writeUInt32(value, offset, num, "LE");
		offset += 4;
	});
	return {
		key,
		value
	};
}
var expected$12 = "{ masterFingerprint: Uint8Array; extendedPubkey: Uint8Array; path: string; }";
function check$12(data) {
	const epk = data.extendedPubkey;
	const mfp = data.masterFingerprint;
	const p = data.path;
	return epk instanceof Uint8Array && epk.length === 78 && [2, 3].indexOf(epk[45]) > -1 && mfp instanceof Uint8Array && mfp.length === 4 && typeof p === "string" && !!p.match(/^m(\/\d+'?)*$/);
}
function canAddToArray$3(array, item, dupeSet) {
	const dupeString = toHex(item.extendedPubkey);
	if (dupeSet.has(dupeString)) return false;
	dupeSet.add(dupeString);
	return array.filter((v) => compare(v.extendedPubkey, item.extendedPubkey)).length === 0;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/global/unsignedTx.js
var unsignedTx_exports = /* @__PURE__ */ __exportAll({ encode: () => encode$12 });
function encode$12(data) {
	return {
		key: new Uint8Array([GlobalTypes.UNSIGNED_TX]),
		value: data.toBuffer()
	};
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/input/finalScriptSig.js
var finalScriptSig_exports = /* @__PURE__ */ __exportAll({
	canAdd: () => canAdd$8,
	check: () => check$11,
	decode: () => decode$11,
	encode: () => encode$11,
	expected: () => expected$11
});
function decode$11(keyVal) {
	if (keyVal.key[0] !== InputTypes.FINAL_SCRIPTSIG) throw new Error("Decode Error: could not decode finalScriptSig with key 0x" + toHex(keyVal.key));
	return keyVal.value;
}
function encode$11(data) {
	return {
		key: new Uint8Array([InputTypes.FINAL_SCRIPTSIG]),
		value: data
	};
}
var expected$11 = "Uint8Array";
function check$11(data) {
	return data instanceof Uint8Array;
}
function canAdd$8(currentData, newData) {
	return !!currentData && !!newData && currentData.finalScriptSig === void 0;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/input/finalScriptWitness.js
var finalScriptWitness_exports = /* @__PURE__ */ __exportAll({
	canAdd: () => canAdd$7,
	check: () => check$10,
	decode: () => decode$10,
	encode: () => encode$10,
	expected: () => expected$10
});
function decode$10(keyVal) {
	if (keyVal.key[0] !== InputTypes.FINAL_SCRIPTWITNESS) throw new Error("Decode Error: could not decode finalScriptWitness with key 0x" + toHex(keyVal.key));
	return keyVal.value;
}
function encode$10(data) {
	return {
		key: new Uint8Array([InputTypes.FINAL_SCRIPTWITNESS]),
		value: data
	};
}
var expected$10 = "Uint8Array";
function check$10(data) {
	return data instanceof Uint8Array;
}
function canAdd$7(currentData, newData) {
	return !!currentData && !!newData && currentData.finalScriptWitness === void 0;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/input/nonWitnessUtxo.js
var nonWitnessUtxo_exports = /* @__PURE__ */ __exportAll({
	canAdd: () => canAdd$6,
	check: () => check$9,
	decode: () => decode$9,
	encode: () => encode$9,
	expected: () => expected$9
});
function decode$9(keyVal) {
	if (keyVal.key[0] !== InputTypes.NON_WITNESS_UTXO) throw new Error("Decode Error: could not decode nonWitnessUtxo with key 0x" + toHex(keyVal.key));
	return keyVal.value;
}
function encode$9(data) {
	return {
		key: new Uint8Array([InputTypes.NON_WITNESS_UTXO]),
		value: data
	};
}
var expected$9 = "Uint8Array";
function check$9(data) {
	return data instanceof Uint8Array;
}
function canAdd$6(currentData, newData) {
	return !!currentData && !!newData && currentData.nonWitnessUtxo === void 0;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/input/partialSig.js
var partialSig_exports = /* @__PURE__ */ __exportAll({
	canAddToArray: () => canAddToArray$2,
	check: () => check$8,
	decode: () => decode$8,
	encode: () => encode$8,
	expected: () => expected$8
});
function decode$8(keyVal) {
	if (keyVal.key[0] !== InputTypes.PARTIAL_SIG) throw new Error("Decode Error: could not decode partialSig with key 0x" + toHex(keyVal.key));
	if (!(keyVal.key.length === 34 || keyVal.key.length === 66) || ![
		2,
		3,
		4
	].includes(keyVal.key[1])) throw new Error("Decode Error: partialSig has invalid pubkey in key 0x" + toHex(keyVal.key));
	return {
		pubkey: keyVal.key.slice(1),
		signature: keyVal.value
	};
}
function encode$8(pSig) {
	return {
		key: concat([new Uint8Array([InputTypes.PARTIAL_SIG]), pSig.pubkey]),
		value: pSig.signature
	};
}
var expected$8 = "{ pubkey: Uint8Array; signature: Uint8Array; }";
function check$8(data) {
	return data.pubkey instanceof Uint8Array && data.signature instanceof Uint8Array && [33, 65].includes(data.pubkey.length) && [
		2,
		3,
		4
	].includes(data.pubkey[0]) && isDerSigWithSighash(data.signature);
}
function isDerSigWithSighash(buf) {
	if (!(buf instanceof Uint8Array) || buf.length < 9) return false;
	if (buf[0] !== 48) return false;
	if (buf.length !== buf[1] + 3) return false;
	if (buf[2] !== 2) return false;
	const rLen = buf[3];
	if (rLen > 33 || rLen < 1) return false;
	if (buf[3 + rLen + 1] !== 2) return false;
	const sLen = buf[3 + rLen + 2];
	if (sLen > 33 || sLen < 1) return false;
	if (buf.length !== 3 + rLen + 2 + sLen + 2) return false;
	return true;
}
function canAddToArray$2(array, item, dupeSet) {
	const dupeString = toHex(item.pubkey);
	if (dupeSet.has(dupeString)) return false;
	dupeSet.add(dupeString);
	return array.filter((v) => compare(v.pubkey, item.pubkey) === 0).length === 0;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/input/porCommitment.js
var porCommitment_exports = /* @__PURE__ */ __exportAll({
	canAdd: () => canAdd$5,
	check: () => check$7,
	decode: () => decode$7,
	encode: () => encode$7,
	expected: () => expected$7
});
function decode$7(keyVal) {
	if (keyVal.key[0] !== InputTypes.POR_COMMITMENT) throw new Error("Decode Error: could not decode porCommitment with key 0x" + toHex(keyVal.key));
	return toUtf8(keyVal.value);
}
function encode$7(data) {
	return {
		key: new Uint8Array([InputTypes.POR_COMMITMENT]),
		value: fromUtf8(data)
	};
}
var expected$7 = "string";
function check$7(data) {
	return typeof data === "string";
}
function canAdd$5(currentData, newData) {
	return !!currentData && !!newData && currentData.porCommitment === void 0;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/input/sighashType.js
var sighashType_exports = /* @__PURE__ */ __exportAll({
	canAdd: () => canAdd$4,
	check: () => check$6,
	decode: () => decode$6,
	encode: () => encode$6,
	expected: () => expected$6
});
function decode$6(keyVal) {
	if (keyVal.key[0] !== InputTypes.SIGHASH_TYPE) throw new Error("Decode Error: could not decode sighashType with key 0x" + toHex(keyVal.key));
	return Number(readUInt32(keyVal.value, 0, "LE"));
}
function encode$6(data) {
	const key = Uint8Array.from([InputTypes.SIGHASH_TYPE]);
	const value = new Uint8Array(4);
	writeUInt32(value, 0, data, "LE");
	return {
		key,
		value
	};
}
var expected$6 = "number";
function check$6(data) {
	return typeof data === "number";
}
function canAdd$4(currentData, newData) {
	return !!currentData && !!newData && currentData.sighashType === void 0;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/input/tapKeySig.js
var tapKeySig_exports = /* @__PURE__ */ __exportAll({
	canAdd: () => canAdd$3,
	check: () => check$5,
	decode: () => decode$5,
	encode: () => encode$5,
	expected: () => expected$5
});
function decode$5(keyVal) {
	if (keyVal.key[0] !== InputTypes.TAP_KEY_SIG || keyVal.key.length !== 1) throw new Error("Decode Error: could not decode tapKeySig with key 0x" + toHex(keyVal.key));
	if (!check$5(keyVal.value)) throw new Error("Decode Error: tapKeySig not a valid 64-65-byte BIP340 signature");
	return keyVal.value;
}
function encode$5(value) {
	return {
		key: Uint8Array.from([InputTypes.TAP_KEY_SIG]),
		value
	};
}
var expected$5 = "Uint8Array";
function check$5(data) {
	return data instanceof Uint8Array && (data.length === 64 || data.length === 65);
}
function canAdd$3(currentData, newData) {
	return !!currentData && !!newData && currentData.tapKeySig === void 0;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/input/tapLeafScript.js
var tapLeafScript_exports = /* @__PURE__ */ __exportAll({
	canAddToArray: () => canAddToArray$1,
	check: () => check$4,
	decode: () => decode$4,
	encode: () => encode$4,
	expected: () => expected$4
});
function decode$4(keyVal) {
	if (keyVal.key[0] !== InputTypes.TAP_LEAF_SCRIPT) throw new Error("Decode Error: could not decode tapLeafScript with key 0x" + toHex(keyVal.key));
	if ((keyVal.key.length - 2) % 32 !== 0) throw new Error("Decode Error: tapLeafScript has invalid control block in key 0x" + toHex(keyVal.key));
	const leafVersion = keyVal.value[keyVal.value.length - 1];
	if ((keyVal.key[1] & 254) !== leafVersion) throw new Error("Decode Error: tapLeafScript bad leaf version in key 0x" + toHex(keyVal.key));
	const script = keyVal.value.slice(0, -1);
	return {
		controlBlock: keyVal.key.slice(1),
		script,
		leafVersion
	};
}
function encode$4(tScript) {
	const head = Uint8Array.from([InputTypes.TAP_LEAF_SCRIPT]);
	const verBuf = Uint8Array.from([tScript.leafVersion]);
	return {
		key: concat([head, tScript.controlBlock]),
		value: concat([tScript.script, verBuf])
	};
}
var expected$4 = "{ controlBlock: Uint8Array; leafVersion: number, script: Uint8Array; }";
function check$4(data) {
	return data.controlBlock instanceof Uint8Array && (data.controlBlock.length - 1) % 32 === 0 && (data.controlBlock[0] & 254) === data.leafVersion && data.script instanceof Uint8Array;
}
function canAddToArray$1(array, item, dupeSet) {
	const dupeString = toHex(item.controlBlock);
	if (dupeSet.has(dupeString)) return false;
	dupeSet.add(dupeString);
	return array.filter((v) => compare(v.controlBlock, item.controlBlock) === 0).length === 0;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/input/tapMerkleRoot.js
var tapMerkleRoot_exports = /* @__PURE__ */ __exportAll({
	canAdd: () => canAdd$2,
	check: () => check$3,
	decode: () => decode$3,
	encode: () => encode$3,
	expected: () => expected$3
});
function decode$3(keyVal) {
	if (keyVal.key[0] !== InputTypes.TAP_MERKLE_ROOT || keyVal.key.length !== 1) throw new Error("Decode Error: could not decode tapMerkleRoot with key 0x" + toHex(keyVal.key));
	if (!check$3(keyVal.value)) throw new Error("Decode Error: tapMerkleRoot not a 32-byte hash");
	return keyVal.value;
}
function encode$3(value) {
	return {
		key: Uint8Array.from([InputTypes.TAP_MERKLE_ROOT]),
		value
	};
}
var expected$3 = "Uint8Array";
function check$3(data) {
	return data instanceof Uint8Array && data.length === 32;
}
function canAdd$2(currentData, newData) {
	return !!currentData && !!newData && currentData.tapMerkleRoot === void 0;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/input/tapScriptSig.js
var tapScriptSig_exports = /* @__PURE__ */ __exportAll({
	canAddToArray: () => canAddToArray,
	check: () => check$2,
	decode: () => decode$2,
	encode: () => encode$2,
	expected: () => expected$2
});
function decode$2(keyVal) {
	if (keyVal.key[0] !== InputTypes.TAP_SCRIPT_SIG) throw new Error("Decode Error: could not decode tapScriptSig with key 0x" + toHex(keyVal.key));
	if (keyVal.key.length !== 65) throw new Error("Decode Error: tapScriptSig has invalid key 0x" + toHex(keyVal.key));
	if (keyVal.value.length !== 64 && keyVal.value.length !== 65) throw new Error("Decode Error: tapScriptSig has invalid signature in key 0x" + toHex(keyVal.key));
	return {
		pubkey: keyVal.key.slice(1, 33),
		leafHash: keyVal.key.slice(33),
		signature: keyVal.value
	};
}
function encode$2(tSig) {
	return {
		key: concat([
			Uint8Array.from([InputTypes.TAP_SCRIPT_SIG]),
			tSig.pubkey,
			tSig.leafHash
		]),
		value: tSig.signature
	};
}
var expected$2 = "{ pubkey: Uint8Array; leafHash: Uint8Array; signature: Uint8Array; }";
function check$2(data) {
	return data.pubkey instanceof Uint8Array && data.leafHash instanceof Uint8Array && data.signature instanceof Uint8Array && data.pubkey.length === 32 && data.leafHash.length === 32 && (data.signature.length === 64 || data.signature.length === 65);
}
function canAddToArray(array, item, dupeSet) {
	const dupeString = toHex(item.pubkey) + toHex(item.leafHash);
	if (dupeSet.has(dupeString)) return false;
	dupeSet.add(dupeString);
	return array.filter((v) => compare(v.pubkey, item.pubkey) === 0 && compare(v.leafHash, item.leafHash) === 0).length === 0;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/input/witnessUtxo.js
var witnessUtxo_exports = /* @__PURE__ */ __exportAll({
	canAdd: () => canAdd$1,
	check: () => check$1,
	decode: () => decode$1,
	encode: () => encode$1,
	expected: () => expected$1
});
function decode$1(keyVal) {
	if (keyVal.key[0] !== InputTypes.WITNESS_UTXO) throw new Error("Decode Error: could not decode witnessUtxo with key 0x" + toHex(keyVal.key));
	const value = readInt64(keyVal.value, 0, "LE");
	let _offset = 8;
	const { numberValue: scriptLen, bytes } = decode$13(keyVal.value, _offset);
	_offset += bytes;
	const script = keyVal.value.slice(_offset);
	if (script.length !== scriptLen) throw new Error("Decode Error: WITNESS_UTXO script is not proper length");
	return {
		script,
		value
	};
}
function encode$1(data) {
	const { script, value } = data;
	const varuintlen = encodingLength(script.length);
	const result = new Uint8Array(8 + varuintlen + script.length);
	writeInt64(result, 0, BigInt(value), "LE");
	encode$14(script.length, result, 8);
	result.set(script, 8 + varuintlen);
	return {
		key: Uint8Array.from([InputTypes.WITNESS_UTXO]),
		value: result
	};
}
var expected$1 = "{ script: Uint8Array; value: bigint; }";
function check$1(data) {
	return data.script instanceof Uint8Array && typeof data.value === "bigint";
}
function canAdd$1(currentData, newData) {
	return !!currentData && !!newData && currentData.witnessUtxo === void 0;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/output/tapTree.js
var tapTree_exports = /* @__PURE__ */ __exportAll({
	canAdd: () => canAdd,
	check: () => check,
	decode: () => decode,
	encode: () => encode,
	expected: () => expected
});
function decode(keyVal) {
	if (keyVal.key[0] !== OutputTypes.TAP_TREE || keyVal.key.length !== 1) throw new Error("Decode Error: could not decode tapTree with key 0x" + toHex(keyVal.key));
	let _offset = 0;
	const data = [];
	while (_offset < keyVal.value.length) {
		const depth = keyVal.value[_offset++];
		const leafVersion = keyVal.value[_offset++];
		const { numberValue: scriptLen, bytes } = decode$13(keyVal.value, _offset);
		_offset += bytes;
		data.push({
			depth,
			leafVersion,
			script: keyVal.value.slice(_offset, _offset + scriptLen)
		});
		_offset += scriptLen;
	}
	return { leaves: data };
}
function encode(tree) {
	return {
		key: Uint8Array.from([OutputTypes.TAP_TREE]),
		value: concat([].concat(...tree.leaves.map((tapLeaf) => [
			Uint8Array.of(tapLeaf.depth, tapLeaf.leafVersion),
			encode$14(BigInt(tapLeaf.script.length)).buffer,
			tapLeaf.script
		])))
	};
}
var expected = "{ leaves: [{ depth: number; leafVersion: number, script: Uint8Array; }] }";
function check(data) {
	return Array.isArray(data.leaves) && data.leaves.every((tapLeaf) => tapLeaf.depth >= 0 && tapLeaf.depth <= 128 && (tapLeaf.leafVersion & 254) === tapLeaf.leafVersion && tapLeaf.script instanceof Uint8Array);
}
function canAdd(currentData, newData) {
	return !!currentData && !!newData && currentData.tapTree === void 0;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/shared/bip32Derivation.js
var range$1 = (n) => [...Array(n).keys()];
var isValidDERKey = (pubkey) => pubkey.length === 33 && [2, 3].includes(pubkey[0]) || pubkey.length === 65 && 4 === pubkey[0];
function makeConverter$4(TYPE_BYTE, isValidPubkey = isValidDERKey) {
	function decode(keyVal) {
		if (keyVal.key[0] !== TYPE_BYTE) throw new Error("Decode Error: could not decode bip32Derivation with key 0x" + toHex(keyVal.key));
		const pubkey = keyVal.key.slice(1);
		if (!isValidPubkey(pubkey)) throw new Error("Decode Error: bip32Derivation has invalid pubkey in key 0x" + toHex(keyVal.key));
		if (keyVal.value.length / 4 % 1 !== 0) throw new Error("Decode Error: Input BIP32_DERIVATION value length should be multiple of 4");
		const data = {
			masterFingerprint: keyVal.value.slice(0, 4),
			pubkey,
			path: "m"
		};
		for (const i of range$1(keyVal.value.length / 4 - 1)) {
			const val = readUInt32(keyVal.value, i * 4 + 4, "LE");
			const isHard = !!(val & 2147483648);
			const idx = val & 2147483647;
			data.path += "/" + idx.toString(10) + (isHard ? "'" : "");
		}
		return data;
	}
	function encode(data) {
		const key = concat([Uint8Array.from([TYPE_BYTE]), data.pubkey]);
		const splitPath = data.path.split("/");
		const value = new Uint8Array(splitPath.length * 4);
		value.set(data.masterFingerprint, 0);
		let offset = 4;
		splitPath.slice(1).forEach((level) => {
			const isHard = level.slice(-1) === "'";
			let num = 2147483647 & parseInt(isHard ? level.slice(0, -1) : level, 10);
			if (isHard) num += 2147483648;
			writeUInt32(value, offset, num, "LE");
			offset += 4;
		});
		return {
			key,
			value
		};
	}
	const expected = "{ masterFingerprint: Uint8Array; pubkey: Uint8Array; path: string; }";
	function check(data) {
		return data.pubkey instanceof Uint8Array && data.masterFingerprint instanceof Uint8Array && typeof data.path === "string" && isValidPubkey(data.pubkey) && data.masterFingerprint.length === 4;
	}
	function canAddToArray(array, item, dupeSet) {
		const dupeString = toHex(item.pubkey);
		if (dupeSet.has(dupeString)) return false;
		dupeSet.add(dupeString);
		return array.filter((v) => compare(v.pubkey, item.pubkey) === 0).length === 0;
	}
	return {
		decode,
		encode,
		check,
		expected,
		canAddToArray
	};
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/shared/checkPubkey.js
function makeChecker(pubkeyTypes) {
	return checkPubkey;
	function checkPubkey(keyVal) {
		let pubkey;
		if (pubkeyTypes.includes(keyVal.key[0])) {
			pubkey = keyVal.key.slice(1);
			if (!(pubkey.length === 33 || pubkey.length === 65) || ![
				2,
				3,
				4
			].includes(pubkey[0])) throw new Error("Format Error: invalid pubkey in key 0x" + toHex(keyVal.key));
		}
		return pubkey;
	}
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/shared/redeemScript.js
function makeConverter$3(TYPE_BYTE) {
	function decode(keyVal) {
		if (keyVal.key[0] !== TYPE_BYTE) throw new Error("Decode Error: could not decode redeemScript with key 0x" + toHex(keyVal.key));
		return keyVal.value;
	}
	function encode(data) {
		return {
			key: Uint8Array.from([TYPE_BYTE]),
			value: data
		};
	}
	const expected = "Uint8Array";
	function check(data) {
		return data instanceof Uint8Array;
	}
	function canAdd(currentData, newData) {
		return !!currentData && !!newData && currentData.redeemScript === void 0;
	}
	return {
		decode,
		encode,
		check,
		expected,
		canAdd
	};
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/shared/tapBip32Derivation.js
var isValidBIP340Key = (pubkey) => pubkey.length === 32;
function makeConverter$2(TYPE_BYTE) {
	const parent = makeConverter$4(TYPE_BYTE, isValidBIP340Key);
	function decode(keyVal) {
		const { numberValue: nHashes, bytes: nHashesLen } = decode$13(keyVal.value);
		const base = parent.decode({
			key: keyVal.key,
			value: keyVal.value.slice(nHashesLen + Number(nHashes) * 32)
		});
		const leafHashes = new Array(Number(nHashes));
		for (let i = 0, _offset = nHashesLen; i < nHashes; i++, _offset += 32) leafHashes[i] = keyVal.value.slice(_offset, _offset + 32);
		return {
			...base,
			leafHashes
		};
	}
	function encode(data) {
		const base = parent.encode(data);
		const nHashesLen = encodingLength(data.leafHashes.length);
		const nHashesBuf = new Uint8Array(nHashesLen);
		encode$14(data.leafHashes.length, nHashesBuf);
		const value = concat([
			nHashesBuf,
			...data.leafHashes,
			base.value
		]);
		return {
			...base,
			value
		};
	}
	const expected = "{ masterFingerprint: Uint8Array; pubkey: Uint8Array; path: string; leafHashes: Uint8Array[]; }";
	function check(data) {
		return Array.isArray(data.leafHashes) && data.leafHashes.every((leafHash) => leafHash instanceof Uint8Array && leafHash.length === 32) && parent.check(data);
	}
	return {
		decode,
		encode,
		check,
		expected,
		canAddToArray: parent.canAddToArray
	};
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/shared/tapInternalKey.js
function makeConverter$1(TYPE_BYTE) {
	function decode(keyVal) {
		if (keyVal.key[0] !== TYPE_BYTE || keyVal.key.length !== 1) throw new Error("Decode Error: could not decode tapInternalKey with key 0x" + toHex(keyVal.key));
		if (keyVal.value.length !== 32) throw new Error("Decode Error: tapInternalKey not a 32-byte x-only pubkey");
		return keyVal.value;
	}
	function encode(value) {
		return {
			key: Uint8Array.from([TYPE_BYTE]),
			value
		};
	}
	const expected = "Uint8Array";
	function check(data) {
		return data instanceof Uint8Array && data.length === 32;
	}
	function canAdd(currentData, newData) {
		return !!currentData && !!newData && currentData.tapInternalKey === void 0;
	}
	return {
		decode,
		encode,
		check,
		expected,
		canAdd
	};
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/shared/witnessScript.js
function makeConverter(TYPE_BYTE) {
	function decode(keyVal) {
		if (keyVal.key[0] !== TYPE_BYTE) throw new Error("Decode Error: could not decode witnessScript with key 0x" + toHex(keyVal.key));
		return keyVal.value;
	}
	function encode(data) {
		return {
			key: Uint8Array.from([TYPE_BYTE]),
			value: data
		};
	}
	const expected = "Uint8Array";
	function check(data) {
		return data instanceof Uint8Array;
	}
	function canAdd(currentData, newData) {
		return !!currentData && !!newData && currentData.witnessScript === void 0;
	}
	return {
		decode,
		encode,
		check,
		expected,
		canAdd
	};
}
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/index.js
var converter_exports = /* @__PURE__ */ __exportAll({
	globals: () => globals,
	inputs: () => inputs,
	outputs: () => outputs
});
var globals = {
	unsignedTx: unsignedTx_exports,
	globalXpub: globalXpub_exports,
	checkPubkey: makeChecker([])
};
var inputs = {
	nonWitnessUtxo: nonWitnessUtxo_exports,
	partialSig: partialSig_exports,
	sighashType: sighashType_exports,
	finalScriptSig: finalScriptSig_exports,
	finalScriptWitness: finalScriptWitness_exports,
	porCommitment: porCommitment_exports,
	witnessUtxo: witnessUtxo_exports,
	bip32Derivation: makeConverter$4(InputTypes.BIP32_DERIVATION),
	redeemScript: makeConverter$3(InputTypes.REDEEM_SCRIPT),
	witnessScript: makeConverter(InputTypes.WITNESS_SCRIPT),
	checkPubkey: makeChecker([InputTypes.PARTIAL_SIG, InputTypes.BIP32_DERIVATION]),
	tapKeySig: tapKeySig_exports,
	tapScriptSig: tapScriptSig_exports,
	tapLeafScript: tapLeafScript_exports,
	tapBip32Derivation: makeConverter$2(InputTypes.TAP_BIP32_DERIVATION),
	tapInternalKey: makeConverter$1(InputTypes.TAP_INTERNAL_KEY),
	tapMerkleRoot: tapMerkleRoot_exports
};
var outputs = {
	bip32Derivation: makeConverter$4(OutputTypes.BIP32_DERIVATION),
	redeemScript: makeConverter$3(OutputTypes.REDEEM_SCRIPT),
	witnessScript: makeConverter(OutputTypes.WITNESS_SCRIPT),
	checkPubkey: makeChecker([OutputTypes.BIP32_DERIVATION]),
	tapBip32Derivation: makeConverter$2(OutputTypes.TAP_BIP32_DERIVATION),
	tapTree: tapTree_exports,
	tapInternalKey: makeConverter$1(OutputTypes.TAP_INTERNAL_KEY)
};
//#endregion
//#region node_modules/bip174/src/esm/lib/converter/tools.js
var range = (n) => [...Array(n).keys()];
function keyValsToBuffer(keyVals) {
	const buffers = keyVals.map(keyValToBuffer);
	buffers.push(Uint8Array.from([0]));
	return concat(buffers);
}
function keyValToBuffer(keyVal) {
	const keyLen = keyVal.key.length;
	const valLen = keyVal.value.length;
	const keyVarIntLen = encodingLength(keyLen);
	const valVarIntLen = encodingLength(valLen);
	const buffer = new Uint8Array(keyVarIntLen + keyLen + valVarIntLen + valLen);
	encode$14(keyLen, buffer, 0);
	buffer.set(keyVal.key, keyVarIntLen);
	encode$14(valLen, buffer, keyVarIntLen + keyLen);
	buffer.set(keyVal.value, keyVarIntLen + keyLen + valVarIntLen);
	return buffer;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/parser/fromBuffer.js
function psbtFromBuffer(buffer, txGetter) {
	let offset = 0;
	function varSlice() {
		const { numberValue: keyLen, bytes } = decode$13(buffer, offset);
		offset += bytes;
		const key = buffer.slice(offset, offset + Number(keyLen));
		offset += Number(keyLen);
		return key;
	}
	function readUInt32BE() {
		const num = readUInt32(buffer, offset, "BE");
		offset += 4;
		return num;
	}
	function readUInt8$1() {
		const num = readUInt8(buffer, offset);
		offset += 1;
		return num;
	}
	function getKeyValue() {
		return {
			key: varSlice(),
			value: varSlice()
		};
	}
	function checkEndOfKeyValPairs() {
		if (offset >= buffer.length) throw new Error("Format Error: Unexpected End of PSBT");
		const isEnd = readUInt8(buffer, offset) === 0;
		if (isEnd) offset++;
		return isEnd;
	}
	if (readUInt32BE() !== 1886610036) throw new Error("Format Error: Invalid Magic Number");
	if (readUInt8$1() !== 255) throw new Error("Format Error: Magic Number must be followed by 0xff separator");
	const globalMapKeyVals = [];
	const globalKeyIndex = {};
	while (!checkEndOfKeyValPairs()) {
		const keyVal = getKeyValue();
		const hexKey = toHex(keyVal.key);
		if (globalKeyIndex[hexKey]) throw new Error("Format Error: Keys must be unique for global keymap: key " + hexKey);
		globalKeyIndex[hexKey] = 1;
		globalMapKeyVals.push(keyVal);
	}
	const unsignedTxMaps = globalMapKeyVals.filter((keyVal) => keyVal.key[0] === GlobalTypes.UNSIGNED_TX);
	if (unsignedTxMaps.length !== 1) throw new Error("Format Error: Only one UNSIGNED_TX allowed");
	const unsignedTx = txGetter(unsignedTxMaps[0].value);
	const { inputCount, outputCount } = unsignedTx.getInputOutputCounts();
	const inputKeyVals = [];
	const outputKeyVals = [];
	for (const index of range(inputCount)) {
		const inputKeyIndex = {};
		const input = [];
		while (!checkEndOfKeyValPairs()) {
			const keyVal = getKeyValue();
			const hexKey = toHex(keyVal.key);
			if (inputKeyIndex[hexKey]) throw new Error("Format Error: Keys must be unique for each input: input index " + index + " key " + hexKey);
			inputKeyIndex[hexKey] = 1;
			input.push(keyVal);
		}
		inputKeyVals.push(input);
	}
	for (const index of range(outputCount)) {
		const outputKeyIndex = {};
		const output = [];
		while (!checkEndOfKeyValPairs()) {
			const keyVal = getKeyValue();
			const hexKey = toHex(keyVal.key);
			if (outputKeyIndex[hexKey]) throw new Error("Format Error: Keys must be unique for each output: output index " + index + " key " + hexKey);
			outputKeyIndex[hexKey] = 1;
			output.push(keyVal);
		}
		outputKeyVals.push(output);
	}
	return psbtFromKeyVals(unsignedTx, {
		globalMapKeyVals,
		inputKeyVals,
		outputKeyVals
	});
}
function checkKeyBuffer(type, keyBuf, keyNum) {
	if (compare(keyBuf, Uint8Array.from([keyNum]))) throw new Error(`Format Error: Invalid ${type} key: ${toHex(keyBuf)}`);
}
function psbtFromKeyVals(unsignedTx, { globalMapKeyVals, inputKeyVals, outputKeyVals }) {
	const globalMap = { unsignedTx };
	let txCount = 0;
	for (const keyVal of globalMapKeyVals) switch (keyVal.key[0]) {
		case GlobalTypes.UNSIGNED_TX:
			checkKeyBuffer("global", keyVal.key, GlobalTypes.UNSIGNED_TX);
			if (txCount > 0) throw new Error("Format Error: GlobalMap has multiple UNSIGNED_TX");
			txCount++;
			break;
		case GlobalTypes.GLOBAL_XPUB:
			if (globalMap.globalXpub === void 0) globalMap.globalXpub = [];
			globalMap.globalXpub.push(globals.globalXpub.decode(keyVal));
			break;
		default:
			if (!globalMap.unknownKeyVals) globalMap.unknownKeyVals = [];
			globalMap.unknownKeyVals.push(keyVal);
	}
	const inputCount = inputKeyVals.length;
	const outputCount = outputKeyVals.length;
	const inputs$2 = [];
	const outputs$2 = [];
	for (const index of range(inputCount)) {
		const input = {};
		for (const keyVal of inputKeyVals[index]) {
			inputs.checkPubkey(keyVal);
			switch (keyVal.key[0]) {
				case InputTypes.NON_WITNESS_UTXO:
					checkKeyBuffer("input", keyVal.key, InputTypes.NON_WITNESS_UTXO);
					if (input.nonWitnessUtxo !== void 0) throw new Error("Format Error: Input has multiple NON_WITNESS_UTXO");
					input.nonWitnessUtxo = inputs.nonWitnessUtxo.decode(keyVal);
					break;
				case InputTypes.WITNESS_UTXO:
					checkKeyBuffer("input", keyVal.key, InputTypes.WITNESS_UTXO);
					if (input.witnessUtxo !== void 0) throw new Error("Format Error: Input has multiple WITNESS_UTXO");
					input.witnessUtxo = inputs.witnessUtxo.decode(keyVal);
					break;
				case InputTypes.PARTIAL_SIG:
					if (input.partialSig === void 0) input.partialSig = [];
					input.partialSig.push(inputs.partialSig.decode(keyVal));
					break;
				case InputTypes.SIGHASH_TYPE:
					checkKeyBuffer("input", keyVal.key, InputTypes.SIGHASH_TYPE);
					if (input.sighashType !== void 0) throw new Error("Format Error: Input has multiple SIGHASH_TYPE");
					input.sighashType = inputs.sighashType.decode(keyVal);
					break;
				case InputTypes.REDEEM_SCRIPT:
					checkKeyBuffer("input", keyVal.key, InputTypes.REDEEM_SCRIPT);
					if (input.redeemScript !== void 0) throw new Error("Format Error: Input has multiple REDEEM_SCRIPT");
					input.redeemScript = inputs.redeemScript.decode(keyVal);
					break;
				case InputTypes.WITNESS_SCRIPT:
					checkKeyBuffer("input", keyVal.key, InputTypes.WITNESS_SCRIPT);
					if (input.witnessScript !== void 0) throw new Error("Format Error: Input has multiple WITNESS_SCRIPT");
					input.witnessScript = inputs.witnessScript.decode(keyVal);
					break;
				case InputTypes.BIP32_DERIVATION:
					if (input.bip32Derivation === void 0) input.bip32Derivation = [];
					input.bip32Derivation.push(inputs.bip32Derivation.decode(keyVal));
					break;
				case InputTypes.FINAL_SCRIPTSIG:
					checkKeyBuffer("input", keyVal.key, InputTypes.FINAL_SCRIPTSIG);
					input.finalScriptSig = inputs.finalScriptSig.decode(keyVal);
					break;
				case InputTypes.FINAL_SCRIPTWITNESS:
					checkKeyBuffer("input", keyVal.key, InputTypes.FINAL_SCRIPTWITNESS);
					input.finalScriptWitness = inputs.finalScriptWitness.decode(keyVal);
					break;
				case InputTypes.POR_COMMITMENT:
					checkKeyBuffer("input", keyVal.key, InputTypes.POR_COMMITMENT);
					input.porCommitment = inputs.porCommitment.decode(keyVal);
					break;
				case InputTypes.TAP_KEY_SIG:
					checkKeyBuffer("input", keyVal.key, InputTypes.TAP_KEY_SIG);
					input.tapKeySig = inputs.tapKeySig.decode(keyVal);
					break;
				case InputTypes.TAP_SCRIPT_SIG:
					if (input.tapScriptSig === void 0) input.tapScriptSig = [];
					input.tapScriptSig.push(inputs.tapScriptSig.decode(keyVal));
					break;
				case InputTypes.TAP_LEAF_SCRIPT:
					if (input.tapLeafScript === void 0) input.tapLeafScript = [];
					input.tapLeafScript.push(inputs.tapLeafScript.decode(keyVal));
					break;
				case InputTypes.TAP_BIP32_DERIVATION:
					if (input.tapBip32Derivation === void 0) input.tapBip32Derivation = [];
					input.tapBip32Derivation.push(inputs.tapBip32Derivation.decode(keyVal));
					break;
				case InputTypes.TAP_INTERNAL_KEY:
					checkKeyBuffer("input", keyVal.key, InputTypes.TAP_INTERNAL_KEY);
					input.tapInternalKey = inputs.tapInternalKey.decode(keyVal);
					break;
				case InputTypes.TAP_MERKLE_ROOT:
					checkKeyBuffer("input", keyVal.key, InputTypes.TAP_MERKLE_ROOT);
					input.tapMerkleRoot = inputs.tapMerkleRoot.decode(keyVal);
					break;
				default:
					if (!input.unknownKeyVals) input.unknownKeyVals = [];
					input.unknownKeyVals.push(keyVal);
			}
		}
		inputs$2.push(input);
	}
	for (const index of range(outputCount)) {
		const output = {};
		for (const keyVal of outputKeyVals[index]) {
			outputs.checkPubkey(keyVal);
			switch (keyVal.key[0]) {
				case OutputTypes.REDEEM_SCRIPT:
					checkKeyBuffer("output", keyVal.key, OutputTypes.REDEEM_SCRIPT);
					if (output.redeemScript !== void 0) throw new Error("Format Error: Output has multiple REDEEM_SCRIPT");
					output.redeemScript = outputs.redeemScript.decode(keyVal);
					break;
				case OutputTypes.WITNESS_SCRIPT:
					checkKeyBuffer("output", keyVal.key, OutputTypes.WITNESS_SCRIPT);
					if (output.witnessScript !== void 0) throw new Error("Format Error: Output has multiple WITNESS_SCRIPT");
					output.witnessScript = outputs.witnessScript.decode(keyVal);
					break;
				case OutputTypes.BIP32_DERIVATION:
					if (output.bip32Derivation === void 0) output.bip32Derivation = [];
					output.bip32Derivation.push(outputs.bip32Derivation.decode(keyVal));
					break;
				case OutputTypes.TAP_INTERNAL_KEY:
					checkKeyBuffer("output", keyVal.key, OutputTypes.TAP_INTERNAL_KEY);
					output.tapInternalKey = outputs.tapInternalKey.decode(keyVal);
					break;
				case OutputTypes.TAP_TREE:
					checkKeyBuffer("output", keyVal.key, OutputTypes.TAP_TREE);
					output.tapTree = outputs.tapTree.decode(keyVal);
					break;
				case OutputTypes.TAP_BIP32_DERIVATION:
					if (output.tapBip32Derivation === void 0) output.tapBip32Derivation = [];
					output.tapBip32Derivation.push(outputs.tapBip32Derivation.decode(keyVal));
					break;
				default:
					if (!output.unknownKeyVals) output.unknownKeyVals = [];
					output.unknownKeyVals.push(keyVal);
			}
		}
		outputs$2.push(output);
	}
	return {
		globalMap,
		inputs: inputs$2,
		outputs: outputs$2
	};
}
//#endregion
//#region node_modules/bip174/src/esm/lib/parser/toBuffer.js
function psbtToBuffer({ globalMap, inputs, outputs }) {
	const { globalKeyVals, inputKeyVals, outputKeyVals } = psbtToKeyVals({
		globalMap,
		inputs,
		outputs
	});
	const globalBuffer = keyValsToBuffer(globalKeyVals);
	const keyValsOrEmptyToBuffer = (keyVals) => keyVals.length === 0 ? [Uint8Array.from([0])] : keyVals.map(keyValsToBuffer);
	const inputBuffers = keyValsOrEmptyToBuffer(inputKeyVals);
	const outputBuffers = keyValsOrEmptyToBuffer(outputKeyVals);
	const header = new Uint8Array(5);
	header.set([
		112,
		115,
		98,
		116,
		255
	], 0);
	return concat([header, globalBuffer].concat(inputBuffers, outputBuffers));
}
var sortKeyVals = (a, b) => {
	return compare(a.key, b.key);
};
function keyValsFromMap(keyValMap, converterFactory) {
	const keyHexSet = /* @__PURE__ */ new Set();
	const keyVals = Object.entries(keyValMap).reduce((result, [key, value]) => {
		if (key === "unknownKeyVals") return result;
		const converter = converterFactory[key];
		if (converter === void 0) return result;
		const encodedKeyVals = (Array.isArray(value) ? value : [value]).map(converter.encode);
		encodedKeyVals.map((kv) => toHex(kv.key)).forEach((hex) => {
			if (keyHexSet.has(hex)) throw new Error("Serialize Error: Duplicate key: " + hex);
			keyHexSet.add(hex);
		});
		return result.concat(encodedKeyVals);
	}, []);
	const otherKeyVals = keyValMap.unknownKeyVals ? keyValMap.unknownKeyVals.filter((keyVal) => {
		return !keyHexSet.has(toHex(keyVal.key));
	}) : [];
	return keyVals.concat(otherKeyVals).sort(sortKeyVals);
}
function psbtToKeyVals({ globalMap, inputs: inputs$1, outputs: outputs$1 }) {
	return {
		globalKeyVals: keyValsFromMap(globalMap, globals),
		inputKeyVals: inputs$1.map((i) => keyValsFromMap(i, inputs)),
		outputKeyVals: outputs$1.map((o) => keyValsFromMap(o, outputs))
	};
}
//#endregion
//#region node_modules/bip174/src/esm/lib/combiner/index.js
function combine(psbts) {
	const self = psbts[0];
	const selfKeyVals = psbtToKeyVals(self);
	const others = psbts.slice(1);
	if (others.length === 0) throw new Error("Combine: Nothing to combine");
	const selfTx = getTx(self);
	if (selfTx === void 0) throw new Error("Combine: Self missing transaction");
	const selfGlobalSet = getKeySet(selfKeyVals.globalKeyVals);
	const selfInputSets = selfKeyVals.inputKeyVals.map(getKeySet);
	const selfOutputSets = selfKeyVals.outputKeyVals.map(getKeySet);
	for (const other of others) {
		const otherTx = getTx(other);
		if (otherTx === void 0 || compare(otherTx.toBuffer(), selfTx.toBuffer()) !== 0) throw new Error("Combine: One of the Psbts does not have the same transaction.");
		const otherKeyVals = psbtToKeyVals(other);
		getKeySet(otherKeyVals.globalKeyVals).forEach(keyPusher(selfGlobalSet, selfKeyVals.globalKeyVals, otherKeyVals.globalKeyVals));
		otherKeyVals.inputKeyVals.map(getKeySet).forEach((inputSet, idx) => inputSet.forEach(keyPusher(selfInputSets[idx], selfKeyVals.inputKeyVals[idx], otherKeyVals.inputKeyVals[idx])));
		otherKeyVals.outputKeyVals.map(getKeySet).forEach((outputSet, idx) => outputSet.forEach(keyPusher(selfOutputSets[idx], selfKeyVals.outputKeyVals[idx], otherKeyVals.outputKeyVals[idx])));
	}
	return psbtFromKeyVals(selfTx, {
		globalMapKeyVals: selfKeyVals.globalKeyVals,
		inputKeyVals: selfKeyVals.inputKeyVals,
		outputKeyVals: selfKeyVals.outputKeyVals
	});
}
function keyPusher(selfSet, selfKeyVals, otherKeyVals) {
	return (key) => {
		if (selfSet.has(key)) return;
		const newKv = otherKeyVals.filter((kv) => toHex(kv.key) === key)[0];
		selfKeyVals.push(newKv);
		selfSet.add(key);
	};
}
function getTx(psbt) {
	return psbt.globalMap.unsignedTx;
}
function getKeySet(keyVals) {
	const set = /* @__PURE__ */ new Set();
	keyVals.forEach((keyVal) => {
		const hex = toHex(keyVal.key);
		if (set.has(hex)) throw new Error("Combine: KeyValue Map keys should be unique");
		set.add(hex);
	});
	return set;
}
//#endregion
//#region node_modules/bip174/src/esm/lib/utils.js
function checkForInput(inputs, inputIndex) {
	const input = inputs[inputIndex];
	if (input === void 0) throw new Error(`No input #${inputIndex}`);
	return input;
}
function checkForOutput(outputs, outputIndex) {
	const output = outputs[outputIndex];
	if (output === void 0) throw new Error(`No output #${outputIndex}`);
	return output;
}
function checkHasKey(checkKeyVal, keyVals, enumLength) {
	if (checkKeyVal.key[0] < enumLength) throw new Error(`Use the method for your specific key instead of addUnknownKeyVal*`);
	if (keyVals && keyVals.filter((kv) => compare(kv.key, checkKeyVal.key) === 0).length !== 0) throw new Error(`Duplicate Key: ${toHex(checkKeyVal.key)}`);
}
function getEnumLength(myenum) {
	let count = 0;
	Object.keys(myenum).forEach((val) => {
		if (Number(isNaN(Number(val)))) count++;
	});
	return count;
}
function inputCheckUncleanFinalized(inputIndex, input) {
	let result = false;
	if (input.nonWitnessUtxo || input.witnessUtxo) {
		const needScriptSig = !!input.redeemScript;
		const needWitnessScript = !!input.witnessScript;
		const scriptSigOK = !needScriptSig || !!input.finalScriptSig;
		const witnessScriptOK = !needWitnessScript || !!input.finalScriptWitness;
		const hasOneFinal = !!input.finalScriptSig || !!input.finalScriptWitness;
		result = scriptSigOK && witnessScriptOK && hasOneFinal;
	}
	if (result === false) throw new Error(`Input #${inputIndex} has too much or too little data to clean`);
}
function throwForUpdateMaker(typeName, name, expected, data) {
	throw new Error(`Data for ${typeName} key ${name} is incorrect: Expected ${expected} and got ${JSON.stringify(data)}`);
}
function updateMaker(typeName) {
	return (updateData, mainData) => {
		for (const name of Object.keys(updateData)) {
			const data = updateData[name];
			const { canAdd, canAddToArray, check, expected } = converter_exports[typeName + "s"][name] || {};
			const isArray = !!canAddToArray;
			if (check) if (isArray) {
				if (!Array.isArray(data) || mainData[name] && !Array.isArray(mainData[name])) throw new Error(`Key type ${name} must be an array`);
				if (!data.every(check)) throwForUpdateMaker(typeName, name, expected, data);
				const arr = mainData[name] || [];
				const dupeCheckSet = /* @__PURE__ */ new Set();
				if (!data.every((v) => canAddToArray(arr, v, dupeCheckSet))) throw new Error("Can not add duplicate data to array");
				mainData[name] = arr.concat(data);
			} else {
				if (!check(data)) throwForUpdateMaker(typeName, name, expected, data);
				if (!canAdd(mainData, data)) throw new Error(`Can not add duplicate data to ${typeName}`);
				mainData[name] = data;
			}
		}
	};
}
var updateGlobal = updateMaker("global");
var updateInput = updateMaker("input");
var updateOutput = updateMaker("output");
function addInputAttributes(inputs, data) {
	updateInput(data, checkForInput(inputs, inputs.length - 1));
}
function addOutputAttributes(outputs, data) {
	updateOutput(data, checkForOutput(outputs, outputs.length - 1));
}
//#endregion
//#region node_modules/bip174/src/esm/lib/psbt.js
var Psbt = class {
	constructor(tx) {
		this.inputs = [];
		this.outputs = [];
		this.globalMap = { unsignedTx: tx };
	}
	static fromBase64(data, txFromBuffer) {
		const buffer = fromBase64(data);
		return this.fromBuffer(buffer, txFromBuffer);
	}
	static fromHex(data, txFromBuffer) {
		const buffer = fromHex(data);
		return this.fromBuffer(buffer, txFromBuffer);
	}
	static fromBuffer(buffer, txFromBuffer) {
		const results = psbtFromBuffer(buffer, txFromBuffer);
		const psbt = new this(results.globalMap.unsignedTx);
		Object.assign(psbt, results);
		return psbt;
	}
	toBase64() {
		return toBase64(this.toBuffer());
	}
	toHex() {
		return toHex(this.toBuffer());
	}
	toBuffer() {
		return psbtToBuffer(this);
	}
	updateGlobal(updateData) {
		updateGlobal(updateData, this.globalMap);
		return this;
	}
	updateInput(inputIndex, updateData) {
		updateInput(updateData, checkForInput(this.inputs, inputIndex));
		return this;
	}
	updateOutput(outputIndex, updateData) {
		updateOutput(updateData, checkForOutput(this.outputs, outputIndex));
		return this;
	}
	addUnknownKeyValToGlobal(keyVal) {
		checkHasKey(keyVal, this.globalMap.unknownKeyVals, getEnumLength(GlobalTypes));
		if (!this.globalMap.unknownKeyVals) this.globalMap.unknownKeyVals = [];
		this.globalMap.unknownKeyVals.push(keyVal);
		return this;
	}
	addUnknownKeyValToInput(inputIndex, keyVal) {
		const input = checkForInput(this.inputs, inputIndex);
		checkHasKey(keyVal, input.unknownKeyVals, getEnumLength(InputTypes));
		if (!input.unknownKeyVals) input.unknownKeyVals = [];
		input.unknownKeyVals.push(keyVal);
		return this;
	}
	addUnknownKeyValToOutput(outputIndex, keyVal) {
		const output = checkForOutput(this.outputs, outputIndex);
		checkHasKey(keyVal, output.unknownKeyVals, getEnumLength(OutputTypes));
		if (!output.unknownKeyVals) output.unknownKeyVals = [];
		output.unknownKeyVals.push(keyVal);
		return this;
	}
	addInput(inputData) {
		this.globalMap.unsignedTx.addInput(inputData);
		this.inputs.push({ unknownKeyVals: [] });
		const addKeyVals = inputData.unknownKeyVals || [];
		const inputIndex = this.inputs.length - 1;
		if (!Array.isArray(addKeyVals)) throw new Error("unknownKeyVals must be an Array");
		addKeyVals.forEach((keyVal) => this.addUnknownKeyValToInput(inputIndex, keyVal));
		addInputAttributes(this.inputs, inputData);
		return this;
	}
	addOutput(outputData) {
		this.globalMap.unsignedTx.addOutput(outputData);
		this.outputs.push({ unknownKeyVals: [] });
		const addKeyVals = outputData.unknownKeyVals || [];
		const outputIndex = this.outputs.length - 1;
		if (!Array.isArray(addKeyVals)) throw new Error("unknownKeyVals must be an Array");
		addKeyVals.forEach((keyVal) => this.addUnknownKeyValToOutput(outputIndex, keyVal));
		addOutputAttributes(this.outputs, outputData);
		return this;
	}
	clearFinalizedInput(inputIndex) {
		const input = checkForInput(this.inputs, inputIndex);
		inputCheckUncleanFinalized(inputIndex, input);
		for (const key of Object.keys(input)) if (![
			"witnessUtxo",
			"nonWitnessUtxo",
			"finalScriptSig",
			"finalScriptWitness",
			"unknownKeyVals"
		].includes(key)) delete input[key];
		return this;
	}
	combine(...those) {
		const result = combine([this].concat(those));
		Object.assign(this, result);
		return this;
	}
	getTransaction() {
		return this.globalMap.unsignedTx.toBuffer();
	}
};
//#endregion
export { encode$14 as a, concat$1 as c, readUInt32$1 as d, writeUInt32$1 as f, decode$13 as i, fromHex$1 as l, checkForInput as n, encodingLength as o, writeUInt8 as p, checkForOutput as r, compare$1 as s, Psbt as t, fromUtf8$1 as u };
