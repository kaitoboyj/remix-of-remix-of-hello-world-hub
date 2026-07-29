import { a as __require, i as __reExport, n as __esmMin, o as __toCommonJS, r as __exportAll, s as __toESM, t as __commonJSMin } from "../../_runtime.mjs";
import { Jo as init_sha3, Yo as keccak_256, c as clear, d as get, f as init_dist$2, l as createStore, m as set, p as keys, u as del } from "../@base-org/account+[...].mjs";
import { r as init_esm$5, t as base32$1 } from "../scure__base.mjs";
import { i as encode$4, n as decode$3, t as init_dist_esm } from "../msgpack__msgpack.mjs";
import ys, { EventEmitter } from "events";
import crypto$1 from "crypto";
//#region node_modules/abitype/dist/esm/version.js
var version$2;
var init_version$1 = __esmMin((() => {
	version$2 = "1.0.8";
}));
//#endregion
//#region node_modules/abitype/dist/esm/errors.js
var BaseError$1;
var init_errors = __esmMin((() => {
	init_version$1();
	BaseError$1 = class BaseError$1 extends Error {
		constructor(shortMessage, args = {}) {
			const details = args.cause instanceof BaseError$1 ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
			const docsPath = args.cause instanceof BaseError$1 ? args.cause.docsPath || args.docsPath : args.docsPath;
			const message = [
				shortMessage || "An error occurred.",
				"",
				...args.metaMessages ? [...args.metaMessages, ""] : [],
				...docsPath ? [`Docs: https://abitype.dev${docsPath}`] : [],
				...details ? [`Details: ${details}`] : [],
				`Version: abitype@${version$2}`
			].join("\n");
			super(message);
			Object.defineProperty(this, "details", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "docsPath", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "metaMessages", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "shortMessage", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "AbiTypeError"
			});
			if (args.cause) this.cause = args.cause;
			this.details = details;
			this.docsPath = docsPath;
			this.metaMessages = args.metaMessages;
			this.shortMessage = shortMessage;
		}
	};
}));
//#endregion
//#region node_modules/abitype/dist/esm/regex.js
function execTyped(regex, string) {
	return regex.exec(string)?.groups;
}
var bytesRegex, integerRegex, isTupleRegex;
var init_regex = __esmMin((() => {
	bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
	integerRegex = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
	isTupleRegex = /^\(.+?\).*?$/;
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
/**
* Formats {@link AbiParameter} to human-readable ABI parameter.
*
* @param abiParameter - ABI parameter
* @returns Human-readable ABI parameter
*
* @example
* const result = formatAbiParameter({ type: 'address', name: 'from' })
* //    ^? const result: 'address from'
*/
function formatAbiParameter(abiParameter) {
	let type = abiParameter.type;
	if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
		type = "(";
		const length = abiParameter.components.length;
		for (let i = 0; i < length; i++) {
			const component = abiParameter.components[i];
			type += formatAbiParameter(component);
			if (i < length - 1) type += ", ";
		}
		const result = execTyped(tupleRegex, abiParameter.type);
		type += `)${result?.array ?? ""}`;
		return formatAbiParameter({
			...abiParameter,
			type
		});
	}
	if ("indexed" in abiParameter && abiParameter.indexed) type = `${type} indexed`;
	if (abiParameter.name) return `${type} ${abiParameter.name}`;
	return type;
}
var tupleRegex;
var init_formatAbiParameter = __esmMin((() => {
	init_regex();
	tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
/**
* Formats {@link AbiParameter}s to human-readable ABI parameters.
*
* @param abiParameters - ABI parameters
* @returns Human-readable ABI parameters
*
* @example
* const result = formatAbiParameters([
*   //  ^? const result: 'address from, uint256 tokenId'
*   { type: 'address', name: 'from' },
*   { type: 'uint256', name: 'tokenId' },
* ])
*/
function formatAbiParameters(abiParameters) {
	let params = "";
	const length = abiParameters.length;
	for (let i = 0; i < length; i++) {
		const abiParameter = abiParameters[i];
		params += formatAbiParameter(abiParameter);
		if (i !== length - 1) params += ", ";
	}
	return params;
}
var init_formatAbiParameters = __esmMin((() => {
	init_formatAbiParameter();
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
/**
* Formats ABI item (e.g. error, event, function) into human-readable ABI item
*
* @param abiItem - ABI item
* @returns Human-readable ABI item
*/
function formatAbiItem(abiItem) {
	if (abiItem.type === "function") return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs?.length ? ` returns (${formatAbiParameters(abiItem.outputs)})` : ""}`;
	if (abiItem.type === "event") return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
	if (abiItem.type === "error") return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
	if (abiItem.type === "constructor") return `constructor(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
	if (abiItem.type === "fallback") return `fallback() external${abiItem.stateMutability === "payable" ? " payable" : ""}`;
	return "receive() external payable";
}
var init_formatAbiItem = __esmMin((() => {
	init_formatAbiParameters();
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/formatAbi.js
/**
* Parses JSON ABI into human-readable ABI
*
* @param abi - ABI
* @returns Human-readable ABI
*/
function formatAbi(abi) {
	const signatures = [];
	const length = abi.length;
	for (let i = 0; i < length; i++) {
		const abiItem = abi[i];
		const signature = formatAbiItem(abiItem);
		signatures.push(signature);
	}
	return signatures;
}
var init_formatAbi = __esmMin((() => {
	init_formatAbiItem();
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
function isErrorSignature(signature) {
	return errorSignatureRegex.test(signature);
}
function execErrorSignature(signature) {
	return execTyped(errorSignatureRegex, signature);
}
function isEventSignature(signature) {
	return eventSignatureRegex.test(signature);
}
function execEventSignature(signature) {
	return execTyped(eventSignatureRegex, signature);
}
function isFunctionSignature(signature) {
	return functionSignatureRegex.test(signature);
}
function execFunctionSignature(signature) {
	return execTyped(functionSignatureRegex, signature);
}
function isStructSignature(signature) {
	return structSignatureRegex.test(signature);
}
function execStructSignature(signature) {
	return execTyped(structSignatureRegex, signature);
}
function isConstructorSignature(signature) {
	return constructorSignatureRegex.test(signature);
}
function execConstructorSignature(signature) {
	return execTyped(constructorSignatureRegex, signature);
}
function isFallbackSignature(signature) {
	return fallbackSignatureRegex.test(signature);
}
function execFallbackSignature(signature) {
	return execTyped(fallbackSignatureRegex, signature);
}
function isReceiveSignature(signature) {
	return receiveSignatureRegex.test(signature);
}
var errorSignatureRegex, eventSignatureRegex, functionSignatureRegex, structSignatureRegex, constructorSignatureRegex, fallbackSignatureRegex, receiveSignatureRegex, eventModifiers, functionModifiers;
var init_signatures = __esmMin((() => {
	init_regex();
	errorSignatureRegex = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
	eventSignatureRegex = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
	functionSignatureRegex = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
	structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
	constructorSignatureRegex = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
	fallbackSignatureRegex = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
	receiveSignatureRegex = /^receive\(\) external payable$/;
	eventModifiers = new Set(["indexed"]);
	functionModifiers = new Set([
		"calldata",
		"memory",
		"storage"
	]);
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/errors/abiItem.js
var InvalidAbiItemError, UnknownTypeError, UnknownSolidityTypeError;
var init_abiItem = __esmMin((() => {
	init_errors();
	InvalidAbiItemError = class extends BaseError$1 {
		constructor({ signature }) {
			super("Failed to parse ABI item.", {
				details: `parseAbiItem(${JSON.stringify(signature, null, 2)})`,
				docsPath: "/api/human#parseabiitem-1"
			});
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "InvalidAbiItemError"
			});
		}
	};
	UnknownTypeError = class extends BaseError$1 {
		constructor({ type }) {
			super("Unknown type.", { metaMessages: [`Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`] });
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "UnknownTypeError"
			});
		}
	};
	UnknownSolidityTypeError = class extends BaseError$1 {
		constructor({ type }) {
			super("Unknown type.", { metaMessages: [`Type "${type}" is not a valid ABI type.`] });
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "UnknownSolidityTypeError"
			});
		}
	};
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js
var InvalidParameterError, SolidityProtectedKeywordError, InvalidModifierError, InvalidFunctionModifierError, InvalidAbiTypeParameterError;
var init_abiParameter = __esmMin((() => {
	init_errors();
	InvalidParameterError = class extends BaseError$1 {
		constructor({ param }) {
			super("Invalid ABI parameter.", { details: param });
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "InvalidParameterError"
			});
		}
	};
	SolidityProtectedKeywordError = class extends BaseError$1 {
		constructor({ param, name }) {
			super("Invalid ABI parameter.", {
				details: param,
				metaMessages: [`"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`]
			});
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "SolidityProtectedKeywordError"
			});
		}
	};
	InvalidModifierError = class extends BaseError$1 {
		constructor({ param, type, modifier }) {
			super("Invalid ABI parameter.", {
				details: param,
				metaMessages: [`Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`]
			});
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "InvalidModifierError"
			});
		}
	};
	InvalidFunctionModifierError = class extends BaseError$1 {
		constructor({ param, type, modifier }) {
			super("Invalid ABI parameter.", {
				details: param,
				metaMessages: [`Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`, `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`]
			});
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "InvalidFunctionModifierError"
			});
		}
	};
	InvalidAbiTypeParameterError = class extends BaseError$1 {
		constructor({ abiParameter }) {
			super("Invalid ABI parameter.", {
				details: JSON.stringify(abiParameter, null, 2),
				metaMessages: ["ABI parameter type is invalid."]
			});
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "InvalidAbiTypeParameterError"
			});
		}
	};
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/errors/signature.js
var InvalidSignatureError, UnknownSignatureError, InvalidStructSignatureError;
var init_signature = __esmMin((() => {
	init_errors();
	InvalidSignatureError = class extends BaseError$1 {
		constructor({ signature, type }) {
			super(`Invalid ${type} signature.`, { details: signature });
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "InvalidSignatureError"
			});
		}
	};
	UnknownSignatureError = class extends BaseError$1 {
		constructor({ signature }) {
			super("Unknown signature.", { details: signature });
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "UnknownSignatureError"
			});
		}
	};
	InvalidStructSignatureError = class extends BaseError$1 {
		constructor({ signature }) {
			super("Invalid struct signature.", {
				details: signature,
				metaMessages: ["No properties exist."]
			});
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "InvalidStructSignatureError"
			});
		}
	};
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/errors/struct.js
var CircularReferenceError;
var init_struct = __esmMin((() => {
	init_errors();
	CircularReferenceError = class extends BaseError$1 {
		constructor({ type }) {
			super("Circular reference detected.", { metaMessages: [`Struct "${type}" is a circular reference.`] });
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "CircularReferenceError"
			});
		}
	};
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js
var InvalidParenthesisError;
var init_splitParameters = __esmMin((() => {
	init_errors();
	InvalidParenthesisError = class extends BaseError$1 {
		constructor({ current, depth }) {
			super("Unbalanced parentheses.", {
				metaMessages: [`"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`],
				details: `Depth "${depth}"`
			});
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "InvalidParenthesisError"
			});
		}
	};
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/runtime/cache.js
/**
* Gets {@link parameterCache} cache key namespaced by {@link type}. This prevents parameters from being accessible to types that don't allow them (e.g. `string indexed foo` not allowed outside of `type: 'event'`).
* @param param ABI parameter string
* @param type ABI parameter type
* @returns Cache key for {@link parameterCache}
*/
function getParameterCacheKey(param, type, structs) {
	let structKey = "";
	if (structs) for (const struct of Object.entries(structs)) {
		if (!struct) continue;
		let propertyKey = "";
		for (const property of struct[1]) propertyKey += `[${property.type}${property.name ? `:${property.name}` : ""}]`;
		structKey += `(${struct[0]}{${propertyKey}})`;
	}
	if (type) return `${type}:${param}${structKey}`;
	return param;
}
var parameterCache;
var init_cache = __esmMin((() => {
	parameterCache = new Map([
		["address", { type: "address" }],
		["bool", { type: "bool" }],
		["bytes", { type: "bytes" }],
		["bytes32", { type: "bytes32" }],
		["int", { type: "int256" }],
		["int256", { type: "int256" }],
		["string", { type: "string" }],
		["uint", { type: "uint256" }],
		["uint8", { type: "uint8" }],
		["uint16", { type: "uint16" }],
		["uint24", { type: "uint24" }],
		["uint32", { type: "uint32" }],
		["uint64", { type: "uint64" }],
		["uint96", { type: "uint96" }],
		["uint112", { type: "uint112" }],
		["uint160", { type: "uint160" }],
		["uint192", { type: "uint192" }],
		["uint256", { type: "uint256" }],
		["address owner", {
			type: "address",
			name: "owner"
		}],
		["address to", {
			type: "address",
			name: "to"
		}],
		["bool approved", {
			type: "bool",
			name: "approved"
		}],
		["bytes _data", {
			type: "bytes",
			name: "_data"
		}],
		["bytes data", {
			type: "bytes",
			name: "data"
		}],
		["bytes signature", {
			type: "bytes",
			name: "signature"
		}],
		["bytes32 hash", {
			type: "bytes32",
			name: "hash"
		}],
		["bytes32 r", {
			type: "bytes32",
			name: "r"
		}],
		["bytes32 root", {
			type: "bytes32",
			name: "root"
		}],
		["bytes32 s", {
			type: "bytes32",
			name: "s"
		}],
		["string name", {
			type: "string",
			name: "name"
		}],
		["string symbol", {
			type: "string",
			name: "symbol"
		}],
		["string tokenURI", {
			type: "string",
			name: "tokenURI"
		}],
		["uint tokenId", {
			type: "uint256",
			name: "tokenId"
		}],
		["uint8 v", {
			type: "uint8",
			name: "v"
		}],
		["uint256 balance", {
			type: "uint256",
			name: "balance"
		}],
		["uint256 tokenId", {
			type: "uint256",
			name: "tokenId"
		}],
		["uint256 value", {
			type: "uint256",
			name: "value"
		}],
		["event:address indexed from", {
			type: "address",
			name: "from",
			indexed: true
		}],
		["event:address indexed to", {
			type: "address",
			name: "to",
			indexed: true
		}],
		["event:uint indexed tokenId", {
			type: "uint256",
			name: "tokenId",
			indexed: true
		}],
		["event:uint256 indexed tokenId", {
			type: "uint256",
			name: "tokenId",
			indexed: true
		}]
	]);
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/runtime/utils.js
function parseSignature(signature, structs = {}) {
	if (isFunctionSignature(signature)) return parseFunctionSignature(signature, structs);
	if (isEventSignature(signature)) return parseEventSignature(signature, structs);
	if (isErrorSignature(signature)) return parseErrorSignature(signature, structs);
	if (isConstructorSignature(signature)) return parseConstructorSignature(signature, structs);
	if (isFallbackSignature(signature)) return parseFallbackSignature(signature);
	if (isReceiveSignature(signature)) return {
		type: "receive",
		stateMutability: "payable"
	};
	throw new UnknownSignatureError({ signature });
}
function parseFunctionSignature(signature, structs = {}) {
	const match = execFunctionSignature(signature);
	if (!match) throw new InvalidSignatureError({
		signature,
		type: "function"
	});
	const inputParams = splitParameters(match.parameters);
	const inputs = [];
	const inputLength = inputParams.length;
	for (let i = 0; i < inputLength; i++) inputs.push(parseAbiParameter(inputParams[i], {
		modifiers: functionModifiers,
		structs,
		type: "function"
	}));
	const outputs = [];
	if (match.returns) {
		const outputParams = splitParameters(match.returns);
		const outputLength = outputParams.length;
		for (let i = 0; i < outputLength; i++) outputs.push(parseAbiParameter(outputParams[i], {
			modifiers: functionModifiers,
			structs,
			type: "function"
		}));
	}
	return {
		name: match.name,
		type: "function",
		stateMutability: match.stateMutability ?? "nonpayable",
		inputs,
		outputs
	};
}
function parseEventSignature(signature, structs = {}) {
	const match = execEventSignature(signature);
	if (!match) throw new InvalidSignatureError({
		signature,
		type: "event"
	});
	const params = splitParameters(match.parameters);
	const abiParameters = [];
	const length = params.length;
	for (let i = 0; i < length; i++) abiParameters.push(parseAbiParameter(params[i], {
		modifiers: eventModifiers,
		structs,
		type: "event"
	}));
	return {
		name: match.name,
		type: "event",
		inputs: abiParameters
	};
}
function parseErrorSignature(signature, structs = {}) {
	const match = execErrorSignature(signature);
	if (!match) throw new InvalidSignatureError({
		signature,
		type: "error"
	});
	const params = splitParameters(match.parameters);
	const abiParameters = [];
	const length = params.length;
	for (let i = 0; i < length; i++) abiParameters.push(parseAbiParameter(params[i], {
		structs,
		type: "error"
	}));
	return {
		name: match.name,
		type: "error",
		inputs: abiParameters
	};
}
function parseConstructorSignature(signature, structs = {}) {
	const match = execConstructorSignature(signature);
	if (!match) throw new InvalidSignatureError({
		signature,
		type: "constructor"
	});
	const params = splitParameters(match.parameters);
	const abiParameters = [];
	const length = params.length;
	for (let i = 0; i < length; i++) abiParameters.push(parseAbiParameter(params[i], {
		structs,
		type: "constructor"
	}));
	return {
		type: "constructor",
		stateMutability: match.stateMutability ?? "nonpayable",
		inputs: abiParameters
	};
}
function parseFallbackSignature(signature) {
	const match = execFallbackSignature(signature);
	if (!match) throw new InvalidSignatureError({
		signature,
		type: "fallback"
	});
	return {
		type: "fallback",
		stateMutability: match.stateMutability ?? "nonpayable"
	};
}
function parseAbiParameter(param, options) {
	const parameterCacheKey = getParameterCacheKey(param, options?.type, options?.structs);
	if (parameterCache.has(parameterCacheKey)) return parameterCache.get(parameterCacheKey);
	const isTuple = isTupleRegex.test(param);
	const match = execTyped(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
	if (!match) throw new InvalidParameterError({ param });
	if (match.name && isSolidityKeyword(match.name)) throw new SolidityProtectedKeywordError({
		param,
		name: match.name
	});
	const name = match.name ? { name: match.name } : {};
	const indexed = match.modifier === "indexed" ? { indexed: true } : {};
	const structs = options?.structs ?? {};
	let type;
	let components = {};
	if (isTuple) {
		type = "tuple";
		const params = splitParameters(match.type);
		const components_ = [];
		const length = params.length;
		for (let i = 0; i < length; i++) components_.push(parseAbiParameter(params[i], { structs }));
		components = { components: components_ };
	} else if (match.type in structs) {
		type = "tuple";
		components = { components: structs[match.type] };
	} else if (dynamicIntegerRegex.test(match.type)) type = `${match.type}256`;
	else {
		type = match.type;
		if (!(options?.type === "struct") && !isSolidityType(type)) throw new UnknownSolidityTypeError({ type });
	}
	if (match.modifier) {
		if (!options?.modifiers?.has?.(match.modifier)) throw new InvalidModifierError({
			param,
			type: options?.type,
			modifier: match.modifier
		});
		if (functionModifiers.has(match.modifier) && !isValidDataLocation(type, !!match.array)) throw new InvalidFunctionModifierError({
			param,
			type: options?.type,
			modifier: match.modifier
		});
	}
	const abiParameter = {
		type: `${type}${match.array ?? ""}`,
		...name,
		...indexed,
		...components
	};
	parameterCache.set(parameterCacheKey, abiParameter);
	return abiParameter;
}
function splitParameters(params, result = [], current = "", depth = 0) {
	const length = params.trim().length;
	for (let i = 0; i < length; i++) {
		const char = params[i];
		const tail = params.slice(i + 1);
		switch (char) {
			case ",": return depth === 0 ? splitParameters(tail, [...result, current.trim()]) : splitParameters(tail, result, `${current}${char}`, depth);
			case "(": return splitParameters(tail, result, `${current}${char}`, depth + 1);
			case ")": return splitParameters(tail, result, `${current}${char}`, depth - 1);
			default: return splitParameters(tail, result, `${current}${char}`, depth);
		}
	}
	if (current === "") return result;
	if (depth !== 0) throw new InvalidParenthesisError({
		current,
		depth
	});
	result.push(current.trim());
	return result;
}
function isSolidityType(type) {
	return type === "address" || type === "bool" || type === "function" || type === "string" || bytesRegex.test(type) || integerRegex.test(type);
}
/** @internal */
function isSolidityKeyword(name) {
	return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex.test(name) || integerRegex.test(name) || protectedKeywordsRegex.test(name);
}
/** @internal */
function isValidDataLocation(type, isArray) {
	return isArray || type === "bytes" || type === "string" || type === "tuple";
}
var abiParameterWithoutTupleRegex, abiParameterWithTupleRegex, dynamicIntegerRegex, protectedKeywordsRegex;
var init_utils = __esmMin((() => {
	init_regex();
	init_abiItem();
	init_abiParameter();
	init_signature();
	init_splitParameters();
	init_cache();
	init_signatures();
	abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
	abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
	dynamicIntegerRegex = /^u?int$/;
	protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/runtime/structs.js
function parseStructs(signatures) {
	const shallowStructs = {};
	const signaturesLength = signatures.length;
	for (let i = 0; i < signaturesLength; i++) {
		const signature = signatures[i];
		if (!isStructSignature(signature)) continue;
		const match = execStructSignature(signature);
		if (!match) throw new InvalidSignatureError({
			signature,
			type: "struct"
		});
		const properties = match.properties.split(";");
		const components = [];
		const propertiesLength = properties.length;
		for (let k = 0; k < propertiesLength; k++) {
			const trimmed = properties[k].trim();
			if (!trimmed) continue;
			const abiParameter = parseAbiParameter(trimmed, { type: "struct" });
			components.push(abiParameter);
		}
		if (!components.length) throw new InvalidStructSignatureError({ signature });
		shallowStructs[match.name] = components;
	}
	const resolvedStructs = {};
	const entries = Object.entries(shallowStructs);
	const entriesLength = entries.length;
	for (let i = 0; i < entriesLength; i++) {
		const [name, parameters] = entries[i];
		resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
	}
	return resolvedStructs;
}
function resolveStructs(abiParameters, structs, ancestors = /* @__PURE__ */ new Set()) {
	const components = [];
	const length = abiParameters.length;
	for (let i = 0; i < length; i++) {
		const abiParameter = abiParameters[i];
		if (isTupleRegex.test(abiParameter.type)) components.push(abiParameter);
		else {
			const match = execTyped(typeWithoutTupleRegex, abiParameter.type);
			if (!match?.type) throw new InvalidAbiTypeParameterError({ abiParameter });
			const { array, type } = match;
			if (type in structs) {
				if (ancestors.has(type)) throw new CircularReferenceError({ type });
				components.push({
					...abiParameter,
					type: `tuple${array ?? ""}`,
					components: resolveStructs(structs[type] ?? [], structs, new Set([...ancestors, type]))
				});
			} else if (isSolidityType(type)) components.push(abiParameter);
			else throw new UnknownTypeError({ type });
		}
	}
	return components;
}
var typeWithoutTupleRegex;
var init_structs = __esmMin((() => {
	init_regex();
	init_abiItem();
	init_abiParameter();
	init_signature();
	init_struct();
	init_signatures();
	init_utils();
	typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/parseAbi.js
/**
* Parses human-readable ABI into JSON {@link Abi}
*
* @param signatures - Human-Readable ABI
* @returns Parsed {@link Abi}
*
* @example
* const abi = parseAbi([
*   //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
*   'function balanceOf(address owner) view returns (uint256)',
*   'event Transfer(address indexed from, address indexed to, uint256 amount)',
* ])
*/
function parseAbi(signatures) {
	const structs = parseStructs(signatures);
	const abi = [];
	const length = signatures.length;
	for (let i = 0; i < length; i++) {
		const signature = signatures[i];
		if (isStructSignature(signature)) continue;
		abi.push(parseSignature(signature, structs));
	}
	return abi;
}
var init_parseAbi = __esmMin((() => {
	init_signatures();
	init_structs();
	init_utils();
}));
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/parseAbiItem.js
/**
* Parses human-readable ABI item (e.g. error, event, function) into {@link Abi} item
*
* @param signature - Human-readable ABI item
* @returns Parsed {@link Abi} item
*
* @example
* const abiItem = parseAbiItem('function balanceOf(address owner) view returns (uint256)')
* //    ^? const abiItem: { name: "balanceOf"; type: "function"; stateMutability: "view";...
*
* @example
* const abiItem = parseAbiItem([
*   //  ^? const abiItem: { name: "foo"; type: "function"; stateMutability: "view"; inputs:...
*   'function foo(Baz bar) view returns (string)',
*   'struct Baz { string name; }',
* ])
*/
function parseAbiItem(signature) {
	let abiItem;
	if (typeof signature === "string") abiItem = parseSignature(signature);
	else {
		const structs = parseStructs(signature);
		const length = signature.length;
		for (let i = 0; i < length; i++) {
			const signature_ = signature[i];
			if (isStructSignature(signature_)) continue;
			abiItem = parseSignature(signature_, structs);
			break;
		}
	}
	if (!abiItem) throw new InvalidAbiItemError({ signature });
	return abiItem;
}
var init_parseAbiItem = __esmMin((() => {
	init_abiItem();
	init_signatures();
	init_structs();
	init_utils();
}));
//#endregion
//#region node_modules/abitype/dist/esm/exports/index.js
var init_exports = __esmMin((() => {
	init_errors();
	init_formatAbi();
	init_formatAbiItem();
	init_formatAbiParameter();
	init_formatAbiParameters();
	init_parseAbi();
	init_parseAbiItem();
	init_abiParameter();
	init_signatures();
	init_structs();
	init_utils();
	init_abiItem();
	init_signature();
	init_splitParameters();
	init_struct();
}));
//#endregion
//#region node_modules/@walletconnect/time/dist/cjs/utils/delay.js
var require_delay = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.delay = void 0;
	function delay(timeout) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(true);
			}, timeout);
		});
	}
	exports.delay = delay;
}));
//#endregion
//#region node_modules/@walletconnect/time/dist/cjs/constants/misc.js
var require_misc = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ONE_THOUSAND = exports.ONE_HUNDRED = void 0;
	exports.ONE_HUNDRED = 100;
	exports.ONE_THOUSAND = 1e3;
}));
//#endregion
//#region node_modules/@walletconnect/time/dist/cjs/constants/time.js
var require_time$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ONE_YEAR = exports.FOUR_WEEKS = exports.THREE_WEEKS = exports.TWO_WEEKS = exports.ONE_WEEK = exports.THIRTY_DAYS = exports.SEVEN_DAYS = exports.FIVE_DAYS = exports.THREE_DAYS = exports.ONE_DAY = exports.TWENTY_FOUR_HOURS = exports.TWELVE_HOURS = exports.SIX_HOURS = exports.THREE_HOURS = exports.ONE_HOUR = exports.SIXTY_MINUTES = exports.THIRTY_MINUTES = exports.TEN_MINUTES = exports.FIVE_MINUTES = exports.ONE_MINUTE = exports.SIXTY_SECONDS = exports.THIRTY_SECONDS = exports.TEN_SECONDS = exports.FIVE_SECONDS = exports.ONE_SECOND = void 0;
	exports.ONE_SECOND = 1;
	exports.FIVE_SECONDS = 5;
	exports.TEN_SECONDS = 10;
	exports.THIRTY_SECONDS = 30;
	exports.SIXTY_SECONDS = 60;
	exports.ONE_MINUTE = exports.SIXTY_SECONDS;
	exports.FIVE_MINUTES = exports.ONE_MINUTE * 5;
	exports.TEN_MINUTES = exports.ONE_MINUTE * 10;
	exports.THIRTY_MINUTES = exports.ONE_MINUTE * 30;
	exports.SIXTY_MINUTES = exports.ONE_MINUTE * 60;
	exports.ONE_HOUR = exports.SIXTY_MINUTES;
	exports.THREE_HOURS = exports.ONE_HOUR * 3;
	exports.SIX_HOURS = exports.ONE_HOUR * 6;
	exports.TWELVE_HOURS = exports.ONE_HOUR * 12;
	exports.TWENTY_FOUR_HOURS = exports.ONE_HOUR * 24;
	exports.ONE_DAY = exports.TWENTY_FOUR_HOURS;
	exports.THREE_DAYS = exports.ONE_DAY * 3;
	exports.FIVE_DAYS = exports.ONE_DAY * 5;
	exports.SEVEN_DAYS = exports.ONE_DAY * 7;
	exports.THIRTY_DAYS = exports.ONE_DAY * 30;
	exports.ONE_WEEK = exports.SEVEN_DAYS;
	exports.TWO_WEEKS = exports.ONE_WEEK * 2;
	exports.THREE_WEEKS = exports.ONE_WEEK * 3;
	exports.FOUR_WEEKS = exports.ONE_WEEK * 4;
	exports.ONE_YEAR = exports.ONE_DAY * 365;
}));
//#endregion
//#region node_modules/@walletconnect/time/dist/cjs/constants/index.js
var require_constants$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var tslib_1$3 = __require("tslib");
	tslib_1$3.__exportStar(require_misc(), exports);
	tslib_1$3.__exportStar(require_time$1(), exports);
}));
//#endregion
//#region node_modules/@walletconnect/time/dist/cjs/utils/convert.js
var require_convert = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fromMiliseconds = exports.toMiliseconds = void 0;
	var constants_1 = require_constants$1();
	function toMiliseconds(seconds) {
		return seconds * constants_1.ONE_THOUSAND;
	}
	exports.toMiliseconds = toMiliseconds;
	function fromMiliseconds(miliseconds) {
		return Math.floor(miliseconds / constants_1.ONE_THOUSAND);
	}
	exports.fromMiliseconds = fromMiliseconds;
}));
//#endregion
//#region node_modules/@walletconnect/time/dist/cjs/utils/index.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var tslib_1$2 = __require("tslib");
	tslib_1$2.__exportStar(require_delay(), exports);
	tslib_1$2.__exportStar(require_convert(), exports);
}));
//#endregion
//#region node_modules/@walletconnect/time/dist/cjs/watch.js
var require_watch$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Watch = void 0;
	var Watch = class {
		constructor() {
			this.timestamps = /* @__PURE__ */ new Map();
		}
		start(label) {
			if (this.timestamps.has(label)) throw new Error(`Watch already started for label: ${label}`);
			this.timestamps.set(label, { started: Date.now() });
		}
		stop(label) {
			const timestamp = this.get(label);
			if (typeof timestamp.elapsed !== "undefined") throw new Error(`Watch already stopped for label: ${label}`);
			const elapsed = Date.now() - timestamp.started;
			this.timestamps.set(label, {
				started: timestamp.started,
				elapsed
			});
		}
		get(label) {
			const timestamp = this.timestamps.get(label);
			if (typeof timestamp === "undefined") throw new Error(`No timestamp found for label: ${label}`);
			return timestamp;
		}
		elapsed(label) {
			const timestamp = this.get(label);
			return timestamp.elapsed || Date.now() - timestamp.started;
		}
	};
	exports.Watch = Watch;
	exports.default = Watch;
}));
//#endregion
//#region node_modules/@walletconnect/time/dist/cjs/types/watch.js
var require_watch = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.IWatch = void 0;
	var IWatch = class {};
	exports.IWatch = IWatch;
}));
//#endregion
//#region node_modules/@walletconnect/time/dist/cjs/types/index.js
var require_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	__require("tslib").__exportStar(require_watch(), exports);
}));
//#endregion
//#region node_modules/@walletconnect/time/dist/cjs/index.js
var require_cjs$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var tslib_1$1 = __require("tslib");
	tslib_1$1.__exportStar(require_utils(), exports);
	tslib_1$1.__exportStar(require_watch$1(), exports);
	tslib_1$1.__exportStar(require_types(), exports);
	tslib_1$1.__exportStar(require_constants$1(), exports);
}));
//#endregion
//#region node_modules/@walletconnect/events/dist/esm/events.js
var IEvents;
var init_events = __esmMin((() => {
	IEvents = class {};
}));
//#endregion
//#region node_modules/@walletconnect/events/dist/esm/index.js
var init_esm$4 = __esmMin((() => {
	init_events();
}));
//#endregion
//#region node_modules/@walletconnect/heartbeat/dist/index.es.js
var import_cjs$7, n$2, s$1, r$1, i$2;
var init_index_es$10 = __esmMin((() => {
	import_cjs$7 = require_cjs$3();
	init_esm$4();
	n$2 = class extends IEvents {
		constructor(e) {
			super();
		}
	};
	s$1 = import_cjs$7.FIVE_SECONDS, r$1 = { pulse: "heartbeat_pulse" };
	i$2 = class i$2 extends n$2 {
		constructor(e) {
			super(e), this.events = new EventEmitter(), this.interval = s$1, this.interval = e?.interval || s$1;
		}
		static async init(e) {
			const t = new i$2(e);
			return await t.init(), t;
		}
		async init() {
			await this.initialize();
		}
		stop() {
			clearInterval(this.intervalRef);
		}
		on(e, t) {
			this.events.on(e, t);
		}
		once(e, t) {
			this.events.once(e, t);
		}
		off(e, t) {
			this.events.off(e, t);
		}
		removeListener(e, t) {
			this.events.removeListener(e, t);
		}
		async initialize() {
			this.intervalRef = setInterval(() => this.pulse(), (0, import_cjs$7.toMiliseconds)(this.interval));
		}
		pulse() {
			this.events.emit(r$1.pulse);
		}
	};
}));
//#endregion
//#region node_modules/destr/dist/index.mjs
function jsonParseTransform(key, value) {
	if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
		warnKeyDropped(key);
		return;
	}
	return value;
}
function warnKeyDropped(key) {
	console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
	if (typeof value !== "string") return value;
	if (value[0] === "\"" && value[value.length - 1] === "\"" && value.indexOf("\\") === -1) return value.slice(1, -1);
	const _value = value.trim();
	if (_value.length <= 9) switch (_value.toLowerCase()) {
		case "true": return true;
		case "false": return false;
		case "undefined": return;
		case "null": return null;
		case "nan": return NaN;
		case "infinity": return Number.POSITIVE_INFINITY;
		case "-infinity": return Number.NEGATIVE_INFINITY;
	}
	if (!JsonSigRx.test(value)) {
		if (options.strict) throw new SyntaxError("[destr] Invalid JSON");
		return value;
	}
	try {
		if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
			if (options.strict) throw new Error("[destr] Possible prototype pollution");
			return JSON.parse(value, jsonParseTransform);
		}
		return JSON.parse(value);
	} catch (error) {
		if (options.strict) throw error;
		return value;
	}
}
var suspectProtoRx, suspectConstructorRx, JsonSigRx;
var init_dist$1 = __esmMin((() => {
	suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
	suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
	JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
}));
//#endregion
//#region node_modules/@walletconnect/keyvaluestorage/node_modules/unstorage/dist/shared/unstorage.zVDD2mZo.mjs
function wrapToPromise(value) {
	if (!value || typeof value.then !== "function") return Promise.resolve(value);
	return value;
}
function asyncCall(function_, ...arguments_) {
	try {
		return wrapToPromise(function_(...arguments_));
	} catch (error) {
		return Promise.reject(error);
	}
}
function isPrimitive(value) {
	const type = typeof value;
	return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
	const proto = Object.getPrototypeOf(value);
	return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
	if (isPrimitive(value)) return String(value);
	if (isPureObject(value) || Array.isArray(value)) return JSON.stringify(value);
	if (typeof value.toJSON === "function") return stringify(value.toJSON());
	throw new Error("[unstorage] Cannot stringify value!");
}
function serializeRaw(value) {
	if (typeof value === "string") return value;
	return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
	if (typeof value !== "string") return value;
	if (!value.startsWith(BASE64_PREFIX)) return value;
	return base64Decode(value.slice(7));
}
function base64Decode(input) {
	if (globalThis.Buffer) return Buffer.from(input, "base64");
	return Uint8Array.from(globalThis.atob(input), (c) => c.codePointAt(0));
}
function base64Encode(input) {
	if (globalThis.Buffer) return Buffer.from(input).toString("base64");
	return globalThis.btoa(String.fromCodePoint(...input));
}
function normalizeKey(key) {
	if (!key) return "";
	return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
	return normalizeKey(keys.join(":"));
}
function normalizeBaseKey(base) {
	base = normalizeKey(base);
	return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
	if (depth === void 0) return true;
	let substrCount = 0;
	let index = key.indexOf(":");
	while (index > -1) {
		substrCount++;
		index = key.indexOf(":", index + 1);
	}
	return substrCount <= depth;
}
function filterKeyByBase(key, base) {
	if (base) return key.startsWith(base) && key[key.length - 1] !== "$";
	return key[key.length - 1] !== "$";
}
var BASE64_PREFIX;
var init_unstorage_zVDD2mZo = __esmMin((() => {
	BASE64_PREFIX = "base64:";
}));
//#endregion
//#region node_modules/@walletconnect/keyvaluestorage/node_modules/unstorage/dist/index.mjs
function defineDriver(factory) {
	return factory;
}
function createStorage(options = {}) {
	const context = {
		mounts: { "": options.driver || memory() },
		mountpoints: [""],
		watching: false,
		watchListeners: [],
		unwatch: {}
	};
	const getMount = (key) => {
		for (const base of context.mountpoints) if (key.startsWith(base)) return {
			base,
			relativeKey: key.slice(base.length),
			driver: context.mounts[base]
		};
		return {
			base: "",
			relativeKey: key,
			driver: context.mounts[""]
		};
	};
	const getMounts = (base, includeParent) => {
		return context.mountpoints.filter((mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)).map((mountpoint) => ({
			relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
			mountpoint,
			driver: context.mounts[mountpoint]
		}));
	};
	const onChange = (event, key) => {
		if (!context.watching) return;
		key = normalizeKey(key);
		for (const listener of context.watchListeners) listener(event, key);
	};
	const startWatch = async () => {
		if (context.watching) return;
		context.watching = true;
		for (const mountpoint in context.mounts) context.unwatch[mountpoint] = await watch(context.mounts[mountpoint], onChange, mountpoint);
	};
	const stopWatch = async () => {
		if (!context.watching) return;
		for (const mountpoint in context.unwatch) await context.unwatch[mountpoint]();
		context.unwatch = {};
		context.watching = false;
	};
	const runBatch = (items, commonOptions, cb) => {
		const batches = /* @__PURE__ */ new Map();
		const getBatch = (mount) => {
			let batch = batches.get(mount.base);
			if (!batch) {
				batch = {
					driver: mount.driver,
					base: mount.base,
					items: []
				};
				batches.set(mount.base, batch);
			}
			return batch;
		};
		for (const item of items) {
			const isStringItem = typeof item === "string";
			const key = normalizeKey(isStringItem ? item : item.key);
			const value = isStringItem ? void 0 : item.value;
			const options2 = isStringItem || !item.options ? commonOptions : {
				...commonOptions,
				...item.options
			};
			const mount = getMount(key);
			getBatch(mount).items.push({
				key,
				value,
				relativeKey: mount.relativeKey,
				options: options2
			});
		}
		return Promise.all([...batches.values()].map((batch) => cb(batch))).then((r) => r.flat());
	};
	const storage = {
		hasItem(key, opts = {}) {
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			return asyncCall(driver.hasItem, relativeKey, opts);
		},
		getItem(key, opts = {}) {
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			return asyncCall(driver.getItem, relativeKey, opts).then((value) => destr(value));
		},
		getItems(items, commonOptions = {}) {
			return runBatch(items, commonOptions, (batch) => {
				if (batch.driver.getItems) return asyncCall(batch.driver.getItems, batch.items.map((item) => ({
					key: item.relativeKey,
					options: item.options
				})), commonOptions).then((r) => r.map((item) => ({
					key: joinKeys(batch.base, item.key),
					value: destr(item.value)
				})));
				return Promise.all(batch.items.map((item) => {
					return asyncCall(batch.driver.getItem, item.relativeKey, item.options).then((value) => ({
						key: item.key,
						value: destr(value)
					}));
				}));
			});
		},
		getItemRaw(key, opts = {}) {
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			if (driver.getItemRaw) return asyncCall(driver.getItemRaw, relativeKey, opts);
			return asyncCall(driver.getItem, relativeKey, opts).then((value) => deserializeRaw(value));
		},
		async setItem(key, value, opts = {}) {
			if (value === void 0) return storage.removeItem(key);
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			if (!driver.setItem) return;
			await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
			if (!driver.watch) onChange("update", key);
		},
		async setItems(items, commonOptions) {
			await runBatch(items, commonOptions, async (batch) => {
				if (batch.driver.setItems) return asyncCall(batch.driver.setItems, batch.items.map((item) => ({
					key: item.relativeKey,
					value: stringify(item.value),
					options: item.options
				})), commonOptions);
				if (!batch.driver.setItem) return;
				await Promise.all(batch.items.map((item) => {
					return asyncCall(batch.driver.setItem, item.relativeKey, stringify(item.value), item.options);
				}));
			});
		},
		async setItemRaw(key, value, opts = {}) {
			if (value === void 0) return storage.removeItem(key, opts);
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			if (driver.setItemRaw) await asyncCall(driver.setItemRaw, relativeKey, value, opts);
			else if (driver.setItem) await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
			else return;
			if (!driver.watch) onChange("update", key);
		},
		async removeItem(key, opts = {}) {
			if (typeof opts === "boolean") opts = { removeMeta: opts };
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			if (!driver.removeItem) return;
			await asyncCall(driver.removeItem, relativeKey, opts);
			if (opts.removeMeta || opts.removeMata) await asyncCall(driver.removeItem, relativeKey + "$", opts);
			if (!driver.watch) onChange("remove", key);
		},
		async getMeta(key, opts = {}) {
			if (typeof opts === "boolean") opts = { nativeOnly: opts };
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			const meta = /* @__PURE__ */ Object.create(null);
			if (driver.getMeta) Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
			if (!opts.nativeOnly) {
				const value = await asyncCall(driver.getItem, relativeKey + "$", opts).then((value_) => destr(value_));
				if (value && typeof value === "object") {
					if (typeof value.atime === "string") value.atime = new Date(value.atime);
					if (typeof value.mtime === "string") value.mtime = new Date(value.mtime);
					Object.assign(meta, value);
				}
			}
			return meta;
		},
		setMeta(key, value, opts = {}) {
			return this.setItem(key + "$", value, opts);
		},
		removeMeta(key, opts = {}) {
			return this.removeItem(key + "$", opts);
		},
		async getKeys(base, opts = {}) {
			base = normalizeBaseKey(base);
			const mounts = getMounts(base, true);
			let maskedMounts = [];
			const allKeys = [];
			let allMountsSupportMaxDepth = true;
			for (const mount of mounts) {
				if (!mount.driver.flags?.maxDepth) allMountsSupportMaxDepth = false;
				const rawKeys = await asyncCall(mount.driver.getKeys, mount.relativeBase, opts);
				for (const key of rawKeys) {
					const fullKey = mount.mountpoint + normalizeKey(key);
					if (!maskedMounts.some((p) => fullKey.startsWith(p))) allKeys.push(fullKey);
				}
				maskedMounts = [mount.mountpoint, ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))];
			}
			const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
			return allKeys.filter((key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base));
		},
		async clear(base, opts = {}) {
			base = normalizeBaseKey(base);
			await Promise.all(getMounts(base, false).map(async (m) => {
				if (m.driver.clear) return asyncCall(m.driver.clear, m.relativeBase, opts);
				if (m.driver.removeItem) {
					const keys = await m.driver.getKeys(m.relativeBase || "", opts);
					return Promise.all(keys.map((key) => m.driver.removeItem(key, opts)));
				}
			}));
		},
		async dispose() {
			await Promise.all(Object.values(context.mounts).map((driver) => dispose(driver)));
		},
		async watch(callback) {
			await startWatch();
			context.watchListeners.push(callback);
			return async () => {
				context.watchListeners = context.watchListeners.filter((listener) => listener !== callback);
				if (context.watchListeners.length === 0) await stopWatch();
			};
		},
		async unwatch() {
			context.watchListeners = [];
			await stopWatch();
		},
		mount(base, driver) {
			base = normalizeBaseKey(base);
			if (base && context.mounts[base]) throw new Error(`already mounted at ${base}`);
			if (base) {
				context.mountpoints.push(base);
				context.mountpoints.sort((a, b) => b.length - a.length);
			}
			context.mounts[base] = driver;
			if (context.watching) Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
				context.unwatch[base] = unwatcher;
			}).catch(console.error);
			return storage;
		},
		async unmount(base, _dispose = true) {
			base = normalizeBaseKey(base);
			if (!base || !context.mounts[base]) return;
			if (context.watching && base in context.unwatch) {
				context.unwatch[base]?.();
				delete context.unwatch[base];
			}
			if (_dispose) await dispose(context.mounts[base]);
			context.mountpoints = context.mountpoints.filter((key) => key !== base);
			delete context.mounts[base];
		},
		getMount(key = "") {
			key = normalizeKey(key) + ":";
			const m = getMount(key);
			return {
				driver: m.driver,
				base: m.base
			};
		},
		getMounts(base = "", opts = {}) {
			base = normalizeKey(base);
			return getMounts(base, opts.parents).map((m) => ({
				driver: m.driver,
				base: m.mountpoint
			}));
		},
		keys: (base, opts = {}) => storage.getKeys(base, opts),
		get: (key, opts = {}) => storage.getItem(key, opts),
		set: (key, value, opts = {}) => storage.setItem(key, value, opts),
		has: (key, opts = {}) => storage.hasItem(key, opts),
		del: (key, opts = {}) => storage.removeItem(key, opts),
		remove: (key, opts = {}) => storage.removeItem(key, opts)
	};
	return storage;
}
function watch(driver, onChange, base) {
	return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {};
}
async function dispose(driver) {
	if (typeof driver.dispose === "function") await asyncCall(driver.dispose);
}
var DRIVER_NAME, memory;
var init_dist = __esmMin((() => {
	init_dist$1();
	init_unstorage_zVDD2mZo();
	DRIVER_NAME = "memory";
	memory = defineDriver(() => {
		const data = /* @__PURE__ */ new Map();
		return {
			name: DRIVER_NAME,
			getInstance: () => data,
			hasItem(key) {
				return data.has(key);
			},
			getItem(key) {
				return data.get(key) ?? null;
			},
			getItemRaw(key) {
				return data.get(key) ?? null;
			},
			setItem(key, value) {
				data.set(key, value);
			},
			setItemRaw(key, value) {
				data.set(key, value);
			},
			removeItem(key) {
				data.delete(key);
			},
			getKeys() {
				return [...data.keys()];
			},
			clear() {
				data.clear();
			},
			dispose() {
				data.clear();
			}
		};
	});
}));
//#endregion
//#region node_modules/@walletconnect/safe-json/dist/esm/index.js
function safeJsonParse(value) {
	if (typeof value !== "string") throw new Error(`Cannot safe json parse value of type ${typeof value}`);
	try {
		return JSONParse(value);
	} catch (_a) {
		return value;
	}
}
function safeJsonStringify(value) {
	return typeof value === "string" ? value : JSONStringify(value) || "";
}
var JSONStringify, JSONParse;
var init_esm$3 = __esmMin((() => {
	JSONStringify = (data) => JSON.stringify(data, (_, value) => typeof value === "bigint" ? value.toString() + "n" : value);
	JSONParse = (json) => {
		const serializedData = json.replace(/([\[:])?(\d{17,}|(?:[9](?:[1-9]07199254740991|0[1-9]7199254740991|00[8-9]199254740991|007[2-9]99254740991|007199[3-9]54740991|0071992[6-9]4740991|00719925[5-9]740991|007199254[8-9]40991|0071992547[5-9]0991|00719925474[1-9]991|00719925474099[2-9])))([,\}\]])/g, "$1\"$2n\"$3");
		return JSON.parse(serializedData, (_, value) => {
			if (typeof value === "string" && value.match(/^\d+n$/)) return BigInt(value.substring(0, value.length - 1));
			return value;
		});
	};
}));
//#endregion
//#region node_modules/@walletconnect/keyvaluestorage/dist/index.es.js
function k$3(i) {
	var t;
	return [i[0], safeJsonParse((t = i[1]) != null ? t : "")];
}
var x$3, z$2, D$1, E$1, _$1, l$1, c$2, K$2, N$3, y$2, O$2, j$1, h$3;
var init_index_es$9 = __esmMin((() => {
	init_dist();
	init_dist$2();
	init_esm$3();
	x$3 = "idb-keyval";
	z$2 = (i = {}) => {
		const t = i.base && i.base.length > 0 ? `${i.base}:` : "", e = (s) => t + s;
		let n;
		return i.dbName && i.storeName && (n = createStore(i.dbName, i.storeName)), {
			name: x$3,
			options: i,
			async hasItem(s) {
				return !(typeof await get(e(s), n) > "u");
			},
			async getItem(s) {
				return await get(e(s), n) ?? null;
			},
			setItem(s, a) {
				return set(e(s), a, n);
			},
			removeItem(s) {
				return del(e(s), n);
			},
			getKeys() {
				return keys(n);
			},
			clear() {
				return clear(n);
			}
		};
	};
	D$1 = "WALLET_CONNECT_V2_INDEXED_DB", E$1 = "keyvaluestorage";
	_$1 = class {
		constructor() {
			this.indexedDb = createStorage({ driver: z$2({
				dbName: D$1,
				storeName: E$1
			}) });
		}
		async getKeys() {
			return this.indexedDb.getKeys();
		}
		async getEntries() {
			return (await this.indexedDb.getItems(await this.indexedDb.getKeys())).map((t) => [t.key, t.value]);
		}
		async getItem(t) {
			const e = await this.indexedDb.getItem(t);
			if (e !== null) return e;
		}
		async setItem(t, e) {
			await this.indexedDb.setItem(t, safeJsonStringify(e));
		}
		async removeItem(t) {
			await this.indexedDb.removeItem(t);
		}
	};
	l$1 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, c$2 = { exports: {} };
	(function() {
		let i;
		function t() {}
		i = t, i.prototype.getItem = function(e) {
			return this.hasOwnProperty(e) ? String(this[e]) : null;
		}, i.prototype.setItem = function(e, n) {
			this[e] = String(n);
		}, i.prototype.removeItem = function(e) {
			delete this[e];
		}, i.prototype.clear = function() {
			const e = this;
			Object.keys(e).forEach(function(n) {
				e[n] = void 0, delete e[n];
			});
		}, i.prototype.key = function(e) {
			return e = e || 0, Object.keys(this)[e];
		}, i.prototype.__defineGetter__("length", function() {
			return Object.keys(this).length;
		}), typeof l$1 < "u" && l$1.localStorage ? c$2.exports = l$1.localStorage : typeof window < "u" && window.localStorage ? c$2.exports = window.localStorage : c$2.exports = new t();
	})();
	K$2 = class {
		constructor() {
			this.localStorage = c$2.exports;
		}
		async getKeys() {
			return Object.keys(this.localStorage);
		}
		async getEntries() {
			return Object.entries(this.localStorage).map(k$3);
		}
		async getItem(t) {
			const e = this.localStorage.getItem(t);
			if (e !== null) return safeJsonParse(e);
		}
		async setItem(t, e) {
			this.localStorage.setItem(t, safeJsonStringify(e));
		}
		async removeItem(t) {
			this.localStorage.removeItem(t);
		}
	};
	N$3 = "wc_storage_version", y$2 = 1, O$2 = async (i, t, e) => {
		const n = N$3, s = await t.getItem(n);
		if (s && s >= y$2) {
			e(t);
			return;
		}
		const a = await i.getKeys();
		if (!a.length) {
			e(t);
			return;
		}
		const m = [];
		for (; a.length;) {
			const r = a.shift();
			if (!r) continue;
			const o = r.toLowerCase();
			if (o.includes("wc@") || o.includes("walletconnect") || o.includes("wc_") || o.includes("wallet_connect")) {
				const f = await i.getItem(r);
				await t.setItem(r, f), m.push(r);
			}
		}
		await t.setItem(n, y$2), e(t), j$1(i, m);
	}, j$1 = async (i, t) => {
		t.length && t.forEach(async (e) => {
			await i.removeItem(e);
		});
	};
	h$3 = class {
		constructor() {
			this.initialized = !1, this.setInitialized = (e) => {
				this.storage = e, this.initialized = !0;
			};
			const t = new K$2();
			this.storage = t;
			try {
				O$2(t, new _$1(), this.setInitialized);
			} catch {
				this.initialized = !0;
			}
		}
		async getKeys() {
			return await this.initialize(), this.storage.getKeys();
		}
		async getEntries() {
			return await this.initialize(), this.storage.getEntries();
		}
		async getItem(t) {
			return await this.initialize(), this.storage.getItem(t);
		}
		async setItem(t, e) {
			return await this.initialize(), this.storage.setItem(t, e);
		}
		async removeItem(t) {
			return await this.initialize(), this.storage.removeItem(t);
		}
		async initialize() {
			this.initialized || await new Promise((t) => {
				const e = setInterval(() => {
					this.initialized && (clearInterval(e), t());
				}, 20);
			});
		}
	};
}));
//#endregion
//#region node_modules/pino-std-serializers/lib/err.js
var require_err = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = errSerializer;
	var { toString } = Object.prototype;
	var seen = Symbol("circular-ref-tag");
	var rawSymbol = Symbol("pino-raw-err-ref");
	var pinoErrProto = Object.create({}, {
		type: {
			enumerable: true,
			writable: true,
			value: void 0
		},
		message: {
			enumerable: true,
			writable: true,
			value: void 0
		},
		stack: {
			enumerable: true,
			writable: true,
			value: void 0
		},
		raw: {
			enumerable: false,
			get: function() {
				return this[rawSymbol];
			},
			set: function(val) {
				this[rawSymbol] = val;
			}
		}
	});
	Object.defineProperty(pinoErrProto, rawSymbol, {
		writable: true,
		value: {}
	});
	function errSerializer(err) {
		if (!(err instanceof Error)) return err;
		err[seen] = void 0;
		const _err = Object.create(pinoErrProto);
		_err.type = toString.call(err.constructor) === "[object Function]" ? err.constructor.name : err.name;
		_err.message = err.message;
		_err.stack = err.stack;
		for (const key in err) if (_err[key] === void 0) {
			const val = err[key];
			if (val instanceof Error) {
				if (!val.hasOwnProperty(seen)) _err[key] = errSerializer(val);
			} else _err[key] = val;
		}
		delete err[seen];
		_err.raw = err;
		return _err;
	}
}));
//#endregion
//#region node_modules/pino-std-serializers/lib/req.js
var require_req = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		mapHttpRequest,
		reqSerializer
	};
	var rawSymbol = Symbol("pino-raw-req-ref");
	var pinoReqProto = Object.create({}, {
		id: {
			enumerable: true,
			writable: true,
			value: ""
		},
		method: {
			enumerable: true,
			writable: true,
			value: ""
		},
		url: {
			enumerable: true,
			writable: true,
			value: ""
		},
		query: {
			enumerable: true,
			writable: true,
			value: ""
		},
		params: {
			enumerable: true,
			writable: true,
			value: ""
		},
		headers: {
			enumerable: true,
			writable: true,
			value: {}
		},
		remoteAddress: {
			enumerable: true,
			writable: true,
			value: ""
		},
		remotePort: {
			enumerable: true,
			writable: true,
			value: ""
		},
		raw: {
			enumerable: false,
			get: function() {
				return this[rawSymbol];
			},
			set: function(val) {
				this[rawSymbol] = val;
			}
		}
	});
	Object.defineProperty(pinoReqProto, rawSymbol, {
		writable: true,
		value: {}
	});
	function reqSerializer(req) {
		const connection = req.info || req.socket;
		const _req = Object.create(pinoReqProto);
		_req.id = typeof req.id === "function" ? req.id() : req.id || (req.info ? req.info.id : void 0);
		_req.method = req.method;
		if (req.originalUrl) {
			_req.url = req.originalUrl;
			_req.query = req.query;
			_req.params = req.params;
		} else _req.url = req.path || (req.url ? req.url.path || req.url : void 0);
		_req.headers = req.headers;
		_req.remoteAddress = connection && connection.remoteAddress;
		_req.remotePort = connection && connection.remotePort;
		_req.raw = req.raw || req;
		return _req;
	}
	function mapHttpRequest(req) {
		return { req: reqSerializer(req) };
	}
}));
//#endregion
//#region node_modules/pino-std-serializers/lib/res.js
var require_res = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		mapHttpResponse,
		resSerializer
	};
	var rawSymbol = Symbol("pino-raw-res-ref");
	var pinoResProto = Object.create({}, {
		statusCode: {
			enumerable: true,
			writable: true,
			value: 0
		},
		headers: {
			enumerable: true,
			writable: true,
			value: ""
		},
		raw: {
			enumerable: false,
			get: function() {
				return this[rawSymbol];
			},
			set: function(val) {
				this[rawSymbol] = val;
			}
		}
	});
	Object.defineProperty(pinoResProto, rawSymbol, {
		writable: true,
		value: {}
	});
	function resSerializer(res) {
		const _res = Object.create(pinoResProto);
		_res.statusCode = res.statusCode;
		_res.headers = res.getHeaders ? res.getHeaders() : res._headers;
		_res.raw = res;
		return _res;
	}
	function mapHttpResponse(res) {
		return { res: resSerializer(res) };
	}
}));
//#endregion
//#region node_modules/pino-std-serializers/index.js
var require_pino_std_serializers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var errSerializer = require_err();
	var reqSerializers = require_req();
	var resSerializers = require_res();
	module.exports = {
		err: errSerializer,
		mapHttpRequest: reqSerializers.mapHttpRequest,
		mapHttpResponse: resSerializers.mapHttpResponse,
		req: reqSerializers.reqSerializer,
		res: resSerializers.resSerializer,
		wrapErrorSerializer: function wrapErrorSerializer(customSerializer) {
			if (customSerializer === errSerializer) return customSerializer;
			return function wrapErrSerializer(err) {
				return customSerializer(errSerializer(err));
			};
		},
		wrapRequestSerializer: function wrapRequestSerializer(customSerializer) {
			if (customSerializer === reqSerializers.reqSerializer) return customSerializer;
			return function wrappedReqSerializer(req) {
				return customSerializer(reqSerializers.reqSerializer(req));
			};
		},
		wrapResponseSerializer: function wrapResponseSerializer(customSerializer) {
			if (customSerializer === resSerializers.resSerializer) return customSerializer;
			return function wrappedResSerializer(res) {
				return customSerializer(resSerializers.resSerializer(res));
			};
		}
	};
}));
//#endregion
//#region node_modules/pino/lib/caller.js
var require_caller = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function noOpPrepareStackTrace(_, stack) {
		return stack;
	}
	module.exports = function getCallers() {
		const originalPrepare = Error.prepareStackTrace;
		Error.prepareStackTrace = noOpPrepareStackTrace;
		const stack = (/* @__PURE__ */ new Error()).stack;
		Error.prepareStackTrace = originalPrepare;
		if (!Array.isArray(stack)) return;
		const entries = stack.slice(2);
		const fileNames = [];
		for (const entry of entries) {
			if (!entry) continue;
			fileNames.push(entry.getFileName());
		}
		return fileNames;
	};
}));
//#endregion
//#region node_modules/fast-redact/lib/validator.js
var require_validator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = validator;
	function validator(opts = {}) {
		const { ERR_PATHS_MUST_BE_STRINGS = () => "fast-redact - Paths must be (non-empty) strings", ERR_INVALID_PATH = (s) => `fast-redact – Invalid path (${s})` } = opts;
		return function validate({ paths }) {
			paths.forEach((s) => {
				if (typeof s !== "string") throw Error(ERR_PATHS_MUST_BE_STRINGS());
				try {
					if (/〇/.test(s)) throw Error();
					const expr = (s[0] === "[" ? "" : ".") + s.replace(/^\*/, "〇").replace(/\.\*/g, ".〇").replace(/\[\*\]/g, "[〇]");
					if (/\n|\r|;/.test(expr)) throw Error();
					if (/\/\*/.test(expr)) throw Error();
					Function(`
            'use strict'
            const o = new Proxy({}, { get: () => o, set: () => { throw Error() } });
            const 〇 = null;
            o${expr}
            if ([o${expr}].length !== 1) throw Error()`)();
				} catch (e) {
					throw Error(ERR_INVALID_PATH(s));
				}
			});
		};
	}
}));
//#endregion
//#region node_modules/fast-redact/lib/rx.js
var require_rx = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = /[^.[\]]+|\[((?:.)*?)\]/g;
}));
//#endregion
//#region node_modules/fast-redact/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var rx = require_rx();
	module.exports = parse;
	function parse({ paths }) {
		const wildcards = [];
		var wcLen = 0;
		const secret = paths.reduce(function(o, strPath, ix) {
			var path = strPath.match(rx).map((p) => p.replace(/'|"|`/g, ""));
			const leadingBracket = strPath[0] === "[";
			path = path.map((p) => {
				if (p[0] === "[") return p.substr(1, p.length - 2);
				else return p;
			});
			const star = path.indexOf("*");
			if (star > -1) {
				const before = path.slice(0, star);
				const beforeStr = before.join(".");
				const after = path.slice(star + 1, path.length);
				const nested = after.length > 0;
				wcLen++;
				wildcards.push({
					before,
					beforeStr,
					after,
					nested
				});
			} else o[strPath] = {
				path,
				val: void 0,
				precensored: false,
				circle: "",
				escPath: JSON.stringify(strPath),
				leadingBracket
			};
			return o;
		}, {});
		return {
			wildcards,
			wcLen,
			secret
		};
	}
}));
//#endregion
//#region node_modules/fast-redact/lib/redactor.js
var require_redactor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var rx = require_rx();
	module.exports = redactor;
	function redactor({ secret, serialize, wcLen, strict, isCensorFct, censorFctTakesPath }, state) {
		const redact = Function("o", `
    if (typeof o !== 'object' || o == null) {
      ${strictImpl(strict, serialize)}
    }
    const { censor, secret } = this
    const originalSecret = {}
    const secretKeys = Object.keys(secret)
    for (var i = 0; i < secretKeys.length; i++) {
      originalSecret[secretKeys[i]] = secret[secretKeys[i]]
    }

    ${redactTmpl(secret, isCensorFct, censorFctTakesPath)}
    this.compileRestore()
    ${dynamicRedactTmpl(wcLen > 0, isCensorFct, censorFctTakesPath)}
    this.secret = originalSecret
    ${resultTmpl(serialize)}
  `).bind(state);
		redact.state = state;
		if (serialize === false) redact.restore = (o) => state.restore(o);
		return redact;
	}
	function redactTmpl(secret, isCensorFct, censorFctTakesPath) {
		return Object.keys(secret).map((path) => {
			const { escPath, leadingBracket, path: arrPath } = secret[path];
			const skip = leadingBracket ? 1 : 0;
			const delim = leadingBracket ? "" : ".";
			const hops = [];
			var match;
			while ((match = rx.exec(path)) !== null) {
				const [, ix] = match;
				const { index, input } = match;
				if (index > skip) hops.push(input.substring(0, index - (ix ? 0 : 1)));
			}
			var existence = hops.map((p) => `o${delim}${p}`).join(" && ");
			if (existence.length === 0) existence += `o${delim}${path} != null`;
			else existence += ` && o${delim}${path} != null`;
			const circularDetection = `
      switch (true) {
        ${hops.reverse().map((p) => `
          case o${delim}${p} === censor:
            secret[${escPath}].circle = ${JSON.stringify(p)}
            break
        `).join("\n")}
      }
    `;
			const censorArgs = censorFctTakesPath ? `val, ${JSON.stringify(arrPath)}` : `val`;
			return `
      if (${existence}) {
        const val = o${delim}${path}
        if (val === censor) {
          secret[${escPath}].precensored = true
        } else {
          secret[${escPath}].val = val
          o${delim}${path} = ${isCensorFct ? `censor(${censorArgs})` : "censor"}
          ${circularDetection}
        }
      }
    `;
		}).join("\n");
	}
	function dynamicRedactTmpl(hasWildcards, isCensorFct, censorFctTakesPath) {
		return hasWildcards === true ? `
    {
      const { wildcards, wcLen, groupRedact, nestedRedact } = this
      for (var i = 0; i < wcLen; i++) {
        const { before, beforeStr, after, nested } = wildcards[i]
        if (nested === true) {
          secret[beforeStr] = secret[beforeStr] || []
          nestedRedact(secret[beforeStr], o, before, after, censor, ${isCensorFct}, ${censorFctTakesPath})
        } else secret[beforeStr] = groupRedact(o, before, censor, ${isCensorFct}, ${censorFctTakesPath})
      }
    }
  ` : "";
	}
	function resultTmpl(serialize) {
		return serialize === false ? `return o` : `
    var s = this.serialize(o)
    this.restore(o)
    return s
  `;
	}
	function strictImpl(strict, serialize) {
		return strict === true ? `throw Error('fast-redact: primitives cannot be redacted')` : serialize === false ? `return o` : `return this.serialize(o)`;
	}
}));
//#endregion
//#region node_modules/fast-redact/lib/modifiers.js
var require_modifiers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		groupRedact,
		groupRestore,
		nestedRedact,
		nestedRestore
	};
	function groupRestore({ keys, values, target }) {
		if (target == null || typeof target === "string") return;
		const length = keys.length;
		for (var i = 0; i < length; i++) {
			const k = keys[i];
			target[k] = values[i];
		}
	}
	function groupRedact(o, path, censor, isCensorFct, censorFctTakesPath) {
		const target = get(o, path);
		if (target == null || typeof target === "string") return {
			keys: null,
			values: null,
			target,
			flat: true
		};
		const keys = Object.keys(target);
		const keysLength = keys.length;
		const pathLength = path.length;
		const pathWithKey = censorFctTakesPath ? [...path] : void 0;
		const values = new Array(keysLength);
		for (var i = 0; i < keysLength; i++) {
			const key = keys[i];
			values[i] = target[key];
			if (censorFctTakesPath) {
				pathWithKey[pathLength] = key;
				target[key] = censor(target[key], pathWithKey);
			} else if (isCensorFct) target[key] = censor(target[key]);
			else target[key] = censor;
		}
		return {
			keys,
			values,
			target,
			flat: true
		};
	}
	/**
	* @param {RestoreInstruction[]} instructions a set of instructions for restoring values to objects
	*/
	function nestedRestore(instructions) {
		for (let i = 0; i < instructions.length; i++) {
			const { target, path, value } = instructions[i];
			let current = target;
			for (let i = path.length - 1; i > 0; i--) current = current[path[i]];
			current[path[0]] = value;
		}
	}
	function nestedRedact(store, o, path, ns, censor, isCensorFct, censorFctTakesPath) {
		const target = get(o, path);
		if (target == null) return;
		const keys = Object.keys(target);
		const keysLength = keys.length;
		for (var i = 0; i < keysLength; i++) {
			const key = keys[i];
			specialSet(store, target, key, path, ns, censor, isCensorFct, censorFctTakesPath);
		}
		return store;
	}
	function has(obj, prop) {
		return obj !== void 0 && obj !== null ? "hasOwn" in Object ? Object.hasOwn(obj, prop) : Object.prototype.hasOwnProperty.call(obj, prop) : false;
	}
	function specialSet(store, o, k, path, afterPath, censor, isCensorFct, censorFctTakesPath) {
		const afterPathLen = afterPath.length;
		const lastPathIndex = afterPathLen - 1;
		const originalKey = k;
		var i = -1;
		var n;
		var nv;
		var ov;
		var oov = null;
		var wc = null;
		var kIsWc;
		var wcov;
		var consecutive = false;
		var level = 0;
		var depth = 0;
		var redactPathCurrent = tree();
		ov = n = o[k];
		if (typeof n !== "object") return;
		while (n != null && ++i < afterPathLen) {
			depth += 1;
			k = afterPath[i];
			oov = ov;
			if (k !== "*" && !wc && !(typeof n === "object" && k in n)) break;
			if (k === "*") {
				if (wc === "*") consecutive = true;
				wc = k;
				if (i !== lastPathIndex) continue;
			}
			if (wc) {
				const wcKeys = Object.keys(n);
				for (var j = 0; j < wcKeys.length; j++) {
					const wck = wcKeys[j];
					wcov = n[wck];
					kIsWc = k === "*";
					if (consecutive) {
						redactPathCurrent = node(redactPathCurrent, wck, depth);
						level = i;
						ov = iterateNthLevel(wcov, level - 1, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, o[originalKey], depth + 1);
					} else if (kIsWc || typeof wcov === "object" && wcov !== null && k in wcov) {
						if (kIsWc) ov = wcov;
						else ov = wcov[k];
						nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [
							...path,
							originalKey,
							...afterPath
						]) : censor(ov) : censor;
						if (kIsWc) {
							const rv = restoreInstr(node(redactPathCurrent, wck, depth), ov, o[originalKey]);
							store.push(rv);
							n[wck] = nv;
						} else if (wcov[k] === nv) {} else if (nv === void 0 && censor !== void 0 || has(wcov, k) && nv === ov) redactPathCurrent = node(redactPathCurrent, wck, depth);
						else {
							redactPathCurrent = node(redactPathCurrent, wck, depth);
							const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, o[originalKey]);
							store.push(rv);
							wcov[k] = nv;
						}
					}
				}
				wc = null;
			} else {
				ov = n[k];
				redactPathCurrent = node(redactPathCurrent, k, depth);
				nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [
					...path,
					originalKey,
					...afterPath
				]) : censor(ov) : censor;
				if (has(n, k) && nv === ov || nv === void 0 && censor !== void 0) {} else {
					const rv = restoreInstr(redactPathCurrent, ov, o[originalKey]);
					store.push(rv);
					n[k] = nv;
				}
				n = n[k];
			}
			if (typeof n !== "object") break;
			if (ov === oov || typeof ov === "undefined") {}
		}
	}
	function get(o, p) {
		var i = -1;
		var l = p.length;
		var n = o;
		while (n != null && ++i < l) n = n[p[i]];
		return n;
	}
	function iterateNthLevel(wcov, level, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth) {
		if (level === 0) {
			if (kIsWc || typeof wcov === "object" && wcov !== null && k in wcov) {
				if (kIsWc) ov = wcov;
				else ov = wcov[k];
				nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [
					...path,
					originalKey,
					...afterPath
				]) : censor(ov) : censor;
				if (kIsWc) {
					const rv = restoreInstr(redactPathCurrent, ov, parent);
					store.push(rv);
					n[wck] = nv;
				} else if (wcov[k] === nv) {} else if (nv === void 0 && censor !== void 0 || has(wcov, k) && nv === ov) {} else {
					const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, parent);
					store.push(rv);
					wcov[k] = nv;
				}
			}
		}
		for (const key in wcov) if (typeof wcov[key] === "object") {
			redactPathCurrent = node(redactPathCurrent, key, depth);
			iterateNthLevel(wcov[key], level - 1, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth + 1);
		}
	}
	/**
	* @typedef {object} TreeNode
	* @prop {TreeNode} [parent] reference to the parent of this node in the tree, or `null` if there is no parent
	* @prop {string} key the key that this node represents (key here being part of the path being redacted
	* @prop {TreeNode[]} children the child nodes of this node
	* @prop {number} depth the depth of this node in the tree
	*/
	/**
	* instantiate a new, empty tree
	* @returns {TreeNode}
	*/
	function tree() {
		return {
			parent: null,
			key: null,
			children: [],
			depth: 0
		};
	}
	/**
	* creates a new node in the tree, attaching it as a child of the provided parent node
	* if the specified depth matches the parent depth, adds the new node as a _sibling_ of the parent instead
	* @param {TreeNode} parent the parent node to add a new node to (if the parent depth matches the provided `depth` value, will instead add as a sibling of this
	* @param {string} key the key that the new node represents (key here being part of the path being redacted)
	* @param {number} depth the depth of the new node in the tree - used to determing whether to add the new node as a child or sibling of the provided `parent` node
	* @returns {TreeNode} a reference to the newly created node in the tree
	*/
	function node(parent, key, depth) {
		if (parent.depth === depth) return node(parent.parent, key, depth);
		var child = {
			parent,
			key,
			depth,
			children: []
		};
		parent.children.push(child);
		return child;
	}
	/**
	* @typedef {object} RestoreInstruction
	* @prop {string[]} path a reverse-order path that can be used to find the correct insertion point to restore a `value` for the given `parent` object
	* @prop {*} value the value to restore
	* @prop {object} target the object to restore the `value` in
	*/
	/**
	* create a restore instruction for the given redactPath node
	* generates a path in reverse order by walking up the redactPath tree
	* @param {TreeNode} node a tree node that should be at the bottom of the redact path (i.e. have no children) - this will be used to walk up the redact path tree to construct the path needed to restore
	* @param {*} value the value to restore
	* @param {object} target a reference to the parent object to apply the restore instruction to
	* @returns {RestoreInstruction} an instruction used to restore a nested value for a specific object
	*/
	function restoreInstr(node, value, target) {
		let current = node;
		const path = [];
		do {
			path.push(current.key);
			current = current.parent;
		} while (current.parent != null);
		return {
			path,
			value,
			target
		};
	}
}));
//#endregion
//#region node_modules/fast-redact/lib/restorer.js
var require_restorer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { groupRestore, nestedRestore } = require_modifiers();
	module.exports = restorer;
	function restorer() {
		return function compileRestore() {
			if (this.restore) {
				this.restore.state.secret = this.secret;
				return;
			}
			const { secret, wcLen } = this;
			const paths = Object.keys(secret);
			const resetters = resetTmpl(secret, paths);
			const hasWildcards = wcLen > 0;
			const state = hasWildcards ? {
				secret,
				groupRestore,
				nestedRestore
			} : { secret };
			this.restore = Function("o", restoreTmpl(resetters, paths, hasWildcards)).bind(state);
			this.restore.state = state;
		};
	}
	/**
	* Mutates the original object to be censored by restoring its original values
	* prior to censoring.
	*
	* @param {object} secret Compiled object describing which target fields should
	* be censored and the field states.
	* @param {string[]} paths The list of paths to censor as provided at
	* initialization time.
	*
	* @returns {string} String of JavaScript to be used by `Function()`. The
	* string compiles to the function that does the work in the description.
	*/
	function resetTmpl(secret, paths) {
		return paths.map((path) => {
			const { circle, escPath, leadingBracket } = secret[path];
			return `
      if (secret[${escPath}].val !== undefined) {
        try { ${circle ? `o.${circle} = secret[${escPath}].val` : `o${leadingBracket ? "" : "."}${path} = secret[${escPath}].val`} } catch (e) {}
        ${`secret[${escPath}].val = undefined`}
      }
    `;
		}).join("");
	}
	/**
	* Creates the body of the restore function
	*
	* Restoration of the redacted object happens
	* backwards, in reverse order of redactions,
	* so that repeated redactions on the same object
	* property can be eventually rolled back to the
	* original value.
	*
	* This way dynamic redactions are restored first,
	* starting from the last one working backwards and
	* followed by the static ones.
	*
	* @returns {string} the body of the restore function
	*/
	function restoreTmpl(resetters, paths, hasWildcards) {
		return `
    const secret = this.secret
    ${hasWildcards === true ? `
    const keys = Object.keys(secret)
    const len = keys.length
    for (var i = len - 1; i >= ${paths.length}; i--) {
      const k = keys[i]
      const o = secret[k]
      if (o) {
        if (o.flat === true) this.groupRestore(o)
        else this.nestedRestore(o)
        secret[k] = null
      }
    }
  ` : ""}
    ${resetters}
    return o
  `;
	}
}));
//#endregion
//#region node_modules/fast-redact/lib/state.js
var require_state = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = state;
	function state(o) {
		const { secret, censor, compileRestore, serialize, groupRedact, nestedRedact, wildcards, wcLen } = o;
		const builder = [{
			secret,
			censor,
			compileRestore
		}];
		if (serialize !== false) builder.push({ serialize });
		if (wcLen > 0) builder.push({
			groupRedact,
			nestedRedact,
			wildcards,
			wcLen
		});
		return Object.assign(...builder);
	}
}));
//#endregion
//#region node_modules/fast-redact/index.js
var require_fast_redact = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var validator = require_validator();
	var parse = require_parse();
	var redactor = require_redactor();
	var restorer = require_restorer();
	var { groupRedact, nestedRedact } = require_modifiers();
	var state = require_state();
	var rx = require_rx();
	var validate = validator();
	var noop = (o) => o;
	noop.restore = noop;
	var DEFAULT_CENSOR = "[REDACTED]";
	fastRedact.rx = rx;
	fastRedact.validator = validator;
	module.exports = fastRedact;
	function fastRedact(opts = {}) {
		const paths = Array.from(new Set(opts.paths || []));
		const serialize = "serialize" in opts ? opts.serialize === false ? opts.serialize : typeof opts.serialize === "function" ? opts.serialize : JSON.stringify : JSON.stringify;
		const remove = opts.remove;
		if (remove === true && serialize !== JSON.stringify) throw Error("fast-redact – remove option may only be set when serializer is JSON.stringify");
		const censor = remove === true ? void 0 : "censor" in opts ? opts.censor : DEFAULT_CENSOR;
		const isCensorFct = typeof censor === "function";
		const censorFctTakesPath = isCensorFct && censor.length > 1;
		if (paths.length === 0) return serialize || noop;
		validate({
			paths,
			serialize,
			censor
		});
		const { wildcards, wcLen, secret } = parse({
			paths,
			censor
		});
		const compileRestore = restorer();
		return redactor({
			secret,
			wcLen,
			serialize,
			strict: "strict" in opts ? opts.strict : true,
			isCensorFct,
			censorFctTakesPath
		}, state({
			secret,
			censor,
			compileRestore,
			serialize,
			groupRedact,
			nestedRedact,
			wildcards,
			wcLen
		}));
	}
}));
//#endregion
//#region node_modules/pino/lib/symbols.js
var require_symbols = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var setLevelSym = Symbol("pino.setLevel");
	var getLevelSym = Symbol("pino.getLevel");
	var levelValSym = Symbol("pino.levelVal");
	var useLevelLabelsSym = Symbol("pino.useLevelLabels");
	var useOnlyCustomLevelsSym = Symbol("pino.useOnlyCustomLevels");
	var mixinSym = Symbol("pino.mixin");
	var lsCacheSym = Symbol("pino.lsCache");
	var chindingsSym = Symbol("pino.chindings");
	var parsedChindingsSym = Symbol("pino.parsedChindings");
	var asJsonSym = Symbol("pino.asJson");
	var writeSym = Symbol("pino.write");
	var redactFmtSym = Symbol("pino.redactFmt");
	var timeSym = Symbol("pino.time");
	var timeSliceIndexSym = Symbol("pino.timeSliceIndex");
	var streamSym = Symbol("pino.stream");
	var stringifySym = Symbol("pino.stringify");
	var stringifySafeSym = Symbol("pino.stringifySafe");
	var stringifiersSym = Symbol("pino.stringifiers");
	var endSym = Symbol("pino.end");
	var formatOptsSym = Symbol("pino.formatOpts");
	var messageKeySym = Symbol("pino.messageKey");
	var nestedKeySym = Symbol("pino.nestedKey");
	var nestedKeyStrSym = Symbol("pino.nestedKeyStr");
	var mixinMergeStrategySym = Symbol("pino.mixinMergeStrategy");
	var wildcardFirstSym = Symbol("pino.wildcardFirst");
	var serializersSym = Symbol.for("pino.serializers");
	var formattersSym = Symbol.for("pino.formatters");
	var hooksSym = Symbol.for("pino.hooks");
	module.exports = {
		setLevelSym,
		getLevelSym,
		levelValSym,
		useLevelLabelsSym,
		mixinSym,
		lsCacheSym,
		chindingsSym,
		parsedChindingsSym,
		asJsonSym,
		writeSym,
		serializersSym,
		redactFmtSym,
		timeSym,
		timeSliceIndexSym,
		streamSym,
		stringifySym,
		stringifySafeSym,
		stringifiersSym,
		endSym,
		formatOptsSym,
		messageKeySym,
		nestedKeySym,
		wildcardFirstSym,
		needsMetadataGsym: Symbol.for("pino.metadata"),
		useOnlyCustomLevelsSym,
		formattersSym,
		hooksSym,
		nestedKeyStrSym,
		mixinMergeStrategySym
	};
}));
//#endregion
//#region node_modules/pino/lib/redaction.js
var require_redaction = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fastRedact = require_fast_redact();
	var { redactFmtSym, wildcardFirstSym } = require_symbols();
	var { rx, validator } = fastRedact;
	var validate = validator({
		ERR_PATHS_MUST_BE_STRINGS: () => "pino – redacted paths must be strings",
		ERR_INVALID_PATH: (s) => `pino – redact paths array contains an invalid path (${s})`
	});
	var CENSOR = "[Redacted]";
	var strict = false;
	function redaction(opts, serialize) {
		const { paths, censor } = handle(opts);
		const shape = paths.reduce((o, str) => {
			rx.lastIndex = 0;
			const first = rx.exec(str);
			const next = rx.exec(str);
			let ns = first[1] !== void 0 ? first[1].replace(/^(?:"|'|`)(.*)(?:"|'|`)$/, "$1") : first[0];
			if (ns === "*") ns = wildcardFirstSym;
			if (next === null) {
				o[ns] = null;
				return o;
			}
			if (o[ns] === null) return o;
			const { index } = next;
			const nextPath = `${str.substr(index, str.length - 1)}`;
			o[ns] = o[ns] || [];
			if (ns !== wildcardFirstSym && o[ns].length === 0) o[ns].push(...o[wildcardFirstSym] || []);
			if (ns === wildcardFirstSym) Object.keys(o).forEach(function(k) {
				if (o[k]) o[k].push(nextPath);
			});
			o[ns].push(nextPath);
			return o;
		}, {});
		const result = { [redactFmtSym]: fastRedact({
			paths,
			censor,
			serialize,
			strict
		}) };
		const topCensor = (...args) => {
			return typeof censor === "function" ? serialize(censor(...args)) : serialize(censor);
		};
		return [...Object.keys(shape), ...Object.getOwnPropertySymbols(shape)].reduce((o, k) => {
			if (shape[k] === null) o[k] = (value) => topCensor(value, [k]);
			else {
				const wrappedCensor = typeof censor === "function" ? (value, path) => {
					return censor(value, [k, ...path]);
				} : censor;
				o[k] = fastRedact({
					paths: shape[k],
					censor: wrappedCensor,
					serialize,
					strict
				});
			}
			return o;
		}, result);
	}
	function handle(opts) {
		if (Array.isArray(opts)) {
			opts = {
				paths: opts,
				censor: CENSOR
			};
			validate(opts);
			return opts;
		}
		let { paths, censor = CENSOR, remove } = opts;
		if (Array.isArray(paths) === false) throw Error("pino – redact must contain an array of strings");
		if (remove === true) censor = void 0;
		validate({
			paths,
			censor
		});
		return {
			paths,
			censor
		};
	}
	module.exports = redaction;
}));
//#endregion
//#region node_modules/pino/lib/time.js
var require_time = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nullTime = () => "";
	var epochTime = () => `,"time":${Date.now()}`;
	var unixTime = () => `,"time":${Math.round(Date.now() / 1e3)}`;
	var isoTime = () => `,"time":"${new Date(Date.now()).toISOString()}"`;
	module.exports = {
		nullTime,
		epochTime,
		unixTime,
		isoTime
	};
}));
//#endregion
//#region node_modules/quick-format-unescaped/index.js
var require_quick_format_unescaped = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function tryStringify(o) {
		try {
			return JSON.stringify(o);
		} catch (e) {
			return "\"[Circular]\"";
		}
	}
	module.exports = format;
	function format(f, args, opts) {
		var ss = opts && opts.stringify || tryStringify;
		var offset = 1;
		if (typeof f === "object" && f !== null) {
			var len = args.length + offset;
			if (len === 1) return f;
			var objects = new Array(len);
			objects[0] = ss(f);
			for (var index = 1; index < len; index++) objects[index] = ss(args[index]);
			return objects.join(" ");
		}
		if (typeof f !== "string") return f;
		var argLen = args.length;
		if (argLen === 0) return f;
		var str = "";
		var a = 1 - offset;
		var lastPos = -1;
		var flen = f && f.length || 0;
		for (var i = 0; i < flen;) {
			if (f.charCodeAt(i) === 37 && i + 1 < flen) {
				lastPos = lastPos > -1 ? lastPos : 0;
				switch (f.charCodeAt(i + 1)) {
					case 100:
					case 102:
						if (a >= argLen) break;
						if (args[a] == null) break;
						if (lastPos < i) str += f.slice(lastPos, i);
						str += Number(args[a]);
						lastPos = i + 2;
						i++;
						break;
					case 105:
						if (a >= argLen) break;
						if (args[a] == null) break;
						if (lastPos < i) str += f.slice(lastPos, i);
						str += Math.floor(Number(args[a]));
						lastPos = i + 2;
						i++;
						break;
					case 79:
					case 111:
					case 106:
						if (a >= argLen) break;
						if (args[a] === void 0) break;
						if (lastPos < i) str += f.slice(lastPos, i);
						var type = typeof args[a];
						if (type === "string") {
							str += "'" + args[a] + "'";
							lastPos = i + 2;
							i++;
							break;
						}
						if (type === "function") {
							str += args[a].name || "<anonymous>";
							lastPos = i + 2;
							i++;
							break;
						}
						str += ss(args[a]);
						lastPos = i + 2;
						i++;
						break;
					case 115:
						if (a >= argLen) break;
						if (lastPos < i) str += f.slice(lastPos, i);
						str += String(args[a]);
						lastPos = i + 2;
						i++;
						break;
					case 37:
						if (lastPos < i) str += f.slice(lastPos, i);
						str += "%";
						lastPos = i + 2;
						i++;
						a--;
						break;
				}
				++a;
			}
			++i;
		}
		if (lastPos === -1) return f;
		else if (lastPos < flen) str += f.slice(lastPos);
		return str;
	}
}));
//#endregion
//#region node_modules/atomic-sleep/index.js
var require_atomic_sleep = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	if (typeof SharedArrayBuffer !== "undefined" && typeof Atomics !== "undefined") {
		const nil = new Int32Array(new SharedArrayBuffer(4));
		function sleep(ms) {
			if ((ms > 0 && ms < Infinity) === false) {
				if (typeof ms !== "number" && typeof ms !== "bigint") throw TypeError("sleep: ms must be a number");
				throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
			}
			Atomics.wait(nil, 0, 0, Number(ms));
		}
		module.exports = sleep;
	} else {
		function sleep(ms) {
			if ((ms > 0 && ms < Infinity) === false) {
				if (typeof ms !== "number" && typeof ms !== "bigint") throw TypeError("sleep: ms must be a number");
				throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
			}
			const target = Date.now() + Number(ms);
			while (target > Date.now());
		}
		module.exports = sleep;
	}
}));
//#endregion
//#region node_modules/sonic-boom/index.js
var require_sonic_boom = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs$1 = __require("fs");
	var EventEmitter$5 = __require("events");
	var inherits = __require("util").inherits;
	var path = __require("path");
	var sleep = require_atomic_sleep();
	var BUSY_WRITE_TIMEOUT = 100;
	var MAX_WRITE = 16 * 1024;
	function openFile(file, sonic) {
		sonic._opening = true;
		sonic._writing = true;
		sonic._asyncDrainScheduled = false;
		function fileOpened(err, fd) {
			if (err) {
				sonic._reopening = false;
				sonic._writing = false;
				sonic._opening = false;
				if (sonic.sync) process.nextTick(() => {
					if (sonic.listenerCount("error") > 0) sonic.emit("error", err);
				});
				else sonic.emit("error", err);
				return;
			}
			sonic.fd = fd;
			sonic.file = file;
			sonic._reopening = false;
			sonic._opening = false;
			sonic._writing = false;
			if (sonic.sync) process.nextTick(() => sonic.emit("ready"));
			else sonic.emit("ready");
			if (sonic._reopening) return;
			if (!sonic._writing && sonic._len > sonic.minLength && !sonic.destroyed) actualWrite(sonic);
		}
		const flags = sonic.append ? "a" : "w";
		const mode = sonic.mode;
		if (sonic.sync) try {
			if (sonic.mkdir) fs$1.mkdirSync(path.dirname(file), { recursive: true });
			fileOpened(null, fs$1.openSync(file, flags, mode));
		} catch (err) {
			fileOpened(err);
			throw err;
		}
		else if (sonic.mkdir) fs$1.mkdir(path.dirname(file), { recursive: true }, (err) => {
			if (err) return fileOpened(err);
			fs$1.open(file, flags, mode, fileOpened);
		});
		else fs$1.open(file, flags, mode, fileOpened);
	}
	function SonicBoom(opts) {
		if (!(this instanceof SonicBoom)) return new SonicBoom(opts);
		let { fd, dest, minLength, maxLength, maxWrite, sync, append = true, mode, mkdir, retryEAGAIN } = opts || {};
		fd = fd || dest;
		this._bufs = [];
		this._len = 0;
		this.fd = -1;
		this._writing = false;
		this._writingBuf = "";
		this._ending = false;
		this._reopening = false;
		this._asyncDrainScheduled = false;
		this._hwm = Math.max(minLength || 0, 16387);
		this.file = null;
		this.destroyed = false;
		this.minLength = minLength || 0;
		this.maxLength = maxLength || 0;
		this.maxWrite = maxWrite || MAX_WRITE;
		this.sync = sync || false;
		this.append = append || false;
		this.mode = mode;
		this.retryEAGAIN = retryEAGAIN || (() => true);
		this.mkdir = mkdir || false;
		if (typeof fd === "number") {
			this.fd = fd;
			process.nextTick(() => this.emit("ready"));
		} else if (typeof fd === "string") openFile(fd, this);
		else throw new Error("SonicBoom supports only file descriptors and files");
		if (this.minLength >= this.maxWrite) throw new Error(`minLength should be smaller than maxWrite (${this.maxWrite})`);
		this.release = (err, n) => {
			if (err) {
				if (err.code === "EAGAIN" && this.retryEAGAIN(err, this._writingBuf.length, this._len - this._writingBuf.length)) if (this.sync) try {
					sleep(BUSY_WRITE_TIMEOUT);
					this.release(void 0, 0);
				} catch (err) {
					this.release(err);
				}
				else setTimeout(() => {
					fs$1.write(this.fd, this._writingBuf, "utf8", this.release);
				}, BUSY_WRITE_TIMEOUT);
				else {
					this._writing = false;
					this.emit("error", err);
				}
				return;
			}
			this.emit("write", n);
			this._len -= n;
			this._writingBuf = this._writingBuf.slice(n);
			if (this._writingBuf.length) {
				if (!this.sync) {
					fs$1.write(this.fd, this._writingBuf, "utf8", this.release);
					return;
				}
				try {
					do {
						const n = fs$1.writeSync(this.fd, this._writingBuf, "utf8");
						this._len -= n;
						this._writingBuf = this._writingBuf.slice(n);
					} while (this._writingBuf);
				} catch (err) {
					this.release(err);
					return;
				}
			}
			const len = this._len;
			if (this._reopening) {
				this._writing = false;
				this._reopening = false;
				this.reopen();
			} else if (len > this.minLength) actualWrite(this);
			else if (this._ending) if (len > 0) actualWrite(this);
			else {
				this._writing = false;
				actualClose(this);
			}
			else {
				this._writing = false;
				if (this.sync) {
					if (!this._asyncDrainScheduled) {
						this._asyncDrainScheduled = true;
						process.nextTick(emitDrain, this);
					}
				} else this.emit("drain");
			}
		};
		this.on("newListener", function(name) {
			if (name === "drain") this._asyncDrainScheduled = false;
		});
	}
	function emitDrain(sonic) {
		if (!(sonic.listenerCount("drain") > 0)) return;
		sonic._asyncDrainScheduled = false;
		sonic.emit("drain");
	}
	inherits(SonicBoom, EventEmitter$5);
	SonicBoom.prototype.write = function(data) {
		if (this.destroyed) throw new Error("SonicBoom destroyed");
		const len = this._len + data.length;
		const bufs = this._bufs;
		if (this.maxLength && len > this.maxLength) {
			this.emit("drop", data);
			return this._len < this._hwm;
		}
		if (bufs.length === 0 || bufs[bufs.length - 1].length + data.length > this.maxWrite) bufs.push("" + data);
		else bufs[bufs.length - 1] += data;
		this._len = len;
		if (!this._writing && this._len >= this.minLength) actualWrite(this);
		return this._len < this._hwm;
	};
	SonicBoom.prototype.flush = function() {
		if (this.destroyed) throw new Error("SonicBoom destroyed");
		if (this._writing || this.minLength <= 0) return;
		if (this._bufs.length === 0) this._bufs.push("");
		actualWrite(this);
	};
	SonicBoom.prototype.reopen = function(file) {
		if (this.destroyed) throw new Error("SonicBoom destroyed");
		if (this._opening) {
			this.once("ready", () => {
				this.reopen(file);
			});
			return;
		}
		if (this._ending) return;
		if (!this.file) throw new Error("Unable to reopen a file descriptor, you must pass a file to SonicBoom");
		this._reopening = true;
		if (this._writing) return;
		const fd = this.fd;
		this.once("ready", () => {
			if (fd !== this.fd) fs$1.close(fd, (err) => {
				if (err) return this.emit("error", err);
			});
		});
		openFile(file || this.file, this);
	};
	SonicBoom.prototype.end = function() {
		if (this.destroyed) throw new Error("SonicBoom destroyed");
		if (this._opening) {
			this.once("ready", () => {
				this.end();
			});
			return;
		}
		if (this._ending) return;
		this._ending = true;
		if (this._writing) return;
		if (this._len > 0 && this.fd >= 0) actualWrite(this);
		else actualClose(this);
	};
	SonicBoom.prototype.flushSync = function() {
		if (this.destroyed) throw new Error("SonicBoom destroyed");
		if (this.fd < 0) throw new Error("sonic boom is not ready yet");
		if (!this._writing && this._writingBuf.length > 0) {
			this._bufs.unshift(this._writingBuf);
			this._writingBuf = "";
		}
		while (this._bufs.length) {
			const buf = this._bufs[0];
			try {
				this._len -= fs$1.writeSync(this.fd, buf, "utf8");
				this._bufs.shift();
			} catch (err) {
				if (err.code !== "EAGAIN" || !this.retryEAGAIN(err, buf.length, this._len - buf.length)) throw err;
				sleep(BUSY_WRITE_TIMEOUT);
			}
		}
	};
	SonicBoom.prototype.destroy = function() {
		if (this.destroyed) return;
		actualClose(this);
	};
	function actualWrite(sonic) {
		const release = sonic.release;
		sonic._writing = true;
		sonic._writingBuf = sonic._writingBuf || sonic._bufs.shift() || "";
		if (sonic.sync) try {
			release(null, fs$1.writeSync(sonic.fd, sonic._writingBuf, "utf8"));
		} catch (err) {
			release(err);
		}
		else fs$1.write(sonic.fd, sonic._writingBuf, "utf8", release);
	}
	function actualClose(sonic) {
		if (sonic.fd === -1) {
			sonic.once("ready", actualClose.bind(null, sonic));
			return;
		}
		sonic.destroyed = true;
		sonic._bufs = [];
		if (sonic.fd !== 1 && sonic.fd !== 2) fs$1.close(sonic.fd, done);
		else setImmediate(done);
		function done(err) {
			if (err) {
				sonic.emit("error", err);
				return;
			}
			if (sonic._ending && !sonic._writing) sonic.emit("finish");
			sonic.emit("close");
		}
	}
	/**
	* These export configurations enable JS and TS developers
	* to consumer SonicBoom in whatever way best suits their needs.
	* Some examples of supported import syntax includes:
	* - `const SonicBoom = require('SonicBoom')`
	* - `const { SonicBoom } = require('SonicBoom')`
	* - `import * as SonicBoom from 'SonicBoom'`
	* - `import { SonicBoom } from 'SonicBoom'`
	* - `import SonicBoom from 'SonicBoom'`
	*/
	SonicBoom.SonicBoom = SonicBoom;
	SonicBoom.default = SonicBoom;
	module.exports = SonicBoom;
}));
//#endregion
//#region node_modules/process-warning/index.js
var require_process_warning = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { format } = __require("util");
	function build() {
		const codes = {};
		const emitted = /* @__PURE__ */ new Map();
		function create(name, code, message) {
			if (!name) throw new Error("Warning name must not be empty");
			if (!code) throw new Error("Warning code must not be empty");
			if (!message) throw new Error("Warning message must not be empty");
			code = code.toUpperCase();
			if (codes[code] !== void 0) throw new Error(`The code '${code}' already exist`);
			function buildWarnOpts(a, b, c) {
				let formatted;
				if (a && b && c) formatted = format(message, a, b, c);
				else if (a && b) formatted = format(message, a, b);
				else if (a) formatted = format(message, a);
				else formatted = message;
				return {
					code,
					name,
					message: formatted
				};
			}
			emitted.set(code, false);
			codes[code] = buildWarnOpts;
			return codes[code];
		}
		function emit(code, a, b, c) {
			if (codes[code] === void 0) throw new Error(`The code '${code}' does not exist`);
			if (emitted.get(code) === true) return;
			emitted.set(code, true);
			const warning = codes[code](a, b, c);
			process.emitWarning(warning.message, warning.name, warning.code);
		}
		return {
			create,
			emit,
			emitted
		};
	}
	module.exports = build;
}));
//#endregion
//#region node_modules/pino/lib/deprecations.js
var require_deprecations = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var warning = require_process_warning()();
	module.exports = warning;
	var warnName = "PinoWarning";
	warning.create(warnName, "PINODEP008", "prettyPrint is deprecated, look at https://github.com/pinojs/pino-pretty for alternatives.");
	warning.create(warnName, "PINODEP009", "The use of pino.final is discouraged in Node.js v14+ and not required. It will be removed in the next major version");
}));
//#endregion
//#region node_modules/on-exit-leak-free/index.js
var require_on_exit_leak_free = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function genWrap(wraps, ref, fn, event) {
		function wrap() {
			const obj = ref.deref();
			/* istanbul ignore else */
			if (obj !== void 0) fn(obj, event);
		}
		wraps[event] = wrap;
		process.once(event, wrap);
	}
	var registry = new FinalizationRegistry(clear);
	var map = /* @__PURE__ */ new WeakMap();
	function clear(wraps) {
		process.removeListener("exit", wraps.exit);
		process.removeListener("beforeExit", wraps.beforeExit);
	}
	function register(obj, fn) {
		if (obj === void 0) throw new Error("the object can't be undefined");
		const ref = new WeakRef(obj);
		const wraps = {};
		map.set(obj, wraps);
		registry.register(obj, wraps);
		genWrap(wraps, ref, fn, "exit");
		genWrap(wraps, ref, fn, "beforeExit");
	}
	function unregister(obj) {
		const wraps = map.get(obj);
		map.delete(obj);
		if (wraps) clear(wraps);
		registry.unregister(obj);
	}
	module.exports = {
		register,
		unregister
	};
}));
//#endregion
//#region node_modules/thread-stream/lib/wait.js
var require_wait = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var MAX_TIMEOUT = 1e3;
	function wait(state, index, expected, timeout, done) {
		const max = Date.now() + timeout;
		let current = Atomics.load(state, index);
		if (current === expected) {
			done(null, "ok");
			return;
		}
		let prior = current;
		const check = (backoff) => {
			if (Date.now() > max) done(null, "timed-out");
			else setTimeout(() => {
				prior = current;
				current = Atomics.load(state, index);
				if (current === prior) check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2);
				else if (current === expected) done(null, "ok");
				else done(null, "not-equal");
			}, backoff);
		};
		check(1);
	}
	function waitDiff(state, index, expected, timeout, done) {
		const max = Date.now() + timeout;
		let current = Atomics.load(state, index);
		if (current !== expected) {
			done(null, "ok");
			return;
		}
		const check = (backoff) => {
			if (Date.now() > max) done(null, "timed-out");
			else setTimeout(() => {
				current = Atomics.load(state, index);
				if (current !== expected) done(null, "ok");
				else check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2);
			}, backoff);
		};
		check(1);
	}
	module.exports = {
		wait,
		waitDiff
	};
}));
//#endregion
//#region node_modules/thread-stream/lib/indexes.js
var require_indexes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		WRITE_INDEX: 4,
		READ_INDEX: 8
	};
}));
//#endregion
//#region node_modules/thread-stream/index.js
var require_thread_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { EventEmitter: EventEmitter$4 } = __require("events");
	var { Worker } = __require("worker_threads");
	var { join: join$1 } = __require("path");
	var { pathToFileURL } = __require("url");
	var { wait } = require_wait();
	var { WRITE_INDEX, READ_INDEX } = require_indexes();
	var buffer = __require("buffer");
	var assert = __require("assert");
	var kImpl = Symbol("kImpl");
	var MAX_STRING = buffer.constants.MAX_STRING_LENGTH;
	var FakeWeakRef = class {
		constructor(value) {
			this._value = value;
		}
		deref() {
			return this._value;
		}
	};
	var FinalizationRegistry = global.FinalizationRegistry || class FakeFinalizationRegistry {
		register() {}
		unregister() {}
	};
	var WeakRef = global.WeakRef || FakeWeakRef;
	var registry = new FinalizationRegistry((worker) => {
		if (worker.exited) return;
		worker.terminate();
	});
	function createWorker(stream, opts) {
		const { filename, workerData } = opts;
		const worker = new Worker(("__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {})["thread-stream-worker"] || join$1(__dirname, "lib", "worker.js"), {
			...opts.workerOpts,
			workerData: {
				filename: filename.indexOf("file://") === 0 ? filename : pathToFileURL(filename).href,
				dataBuf: stream[kImpl].dataBuf,
				stateBuf: stream[kImpl].stateBuf,
				workerData
			}
		});
		worker.stream = new FakeWeakRef(stream);
		worker.on("message", onWorkerMessage);
		worker.on("exit", onWorkerExit);
		registry.register(stream, worker);
		return worker;
	}
	function drain(stream) {
		assert(!stream[kImpl].sync);
		if (stream[kImpl].needDrain) {
			stream[kImpl].needDrain = false;
			stream.emit("drain");
		}
	}
	function nextFlush(stream) {
		const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
		let leftover = stream[kImpl].data.length - writeIndex;
		if (leftover > 0) {
			if (stream[kImpl].buf.length === 0) {
				stream[kImpl].flushing = false;
				if (stream[kImpl].ending) end(stream);
				else if (stream[kImpl].needDrain) process.nextTick(drain, stream);
				return;
			}
			let toWrite = stream[kImpl].buf.slice(0, leftover);
			let toWriteBytes = Buffer.byteLength(toWrite);
			if (toWriteBytes <= leftover) {
				stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
				write(stream, toWrite, nextFlush.bind(null, stream));
			} else stream.flush(() => {
				if (stream.destroyed) return;
				Atomics.store(stream[kImpl].state, READ_INDEX, 0);
				Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
				while (toWriteBytes > stream[kImpl].data.length) {
					leftover = leftover / 2;
					toWrite = stream[kImpl].buf.slice(0, leftover);
					toWriteBytes = Buffer.byteLength(toWrite);
				}
				stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
				write(stream, toWrite, nextFlush.bind(null, stream));
			});
		} else if (leftover === 0) {
			if (writeIndex === 0 && stream[kImpl].buf.length === 0) return;
			stream.flush(() => {
				Atomics.store(stream[kImpl].state, READ_INDEX, 0);
				Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
				nextFlush(stream);
			});
		} else throw new Error("overwritten");
	}
	function onWorkerMessage(msg) {
		const stream = this.stream.deref();
		if (stream === void 0) {
			this.exited = true;
			this.terminate();
			return;
		}
		switch (msg.code) {
			case "READY":
				this.stream = new WeakRef(stream);
				stream.flush(() => {
					stream[kImpl].ready = true;
					stream.emit("ready");
				});
				break;
			case "ERROR":
				destroy(stream, msg.err);
				break;
			default: throw new Error("this should not happen: " + msg.code);
		}
	}
	function onWorkerExit(code) {
		const stream = this.stream.deref();
		if (stream === void 0) return;
		registry.unregister(stream);
		stream.worker.exited = true;
		stream.worker.off("exit", onWorkerExit);
		destroy(stream, code !== 0 ? /* @__PURE__ */ new Error("The worker thread exited") : null);
	}
	var ThreadStream = class extends EventEmitter$4 {
		constructor(opts = {}) {
			super();
			if (opts.bufferSize < 4) throw new Error("bufferSize must at least fit a 4-byte utf-8 char");
			this[kImpl] = {};
			this[kImpl].stateBuf = new SharedArrayBuffer(128);
			this[kImpl].state = new Int32Array(this[kImpl].stateBuf);
			this[kImpl].dataBuf = new SharedArrayBuffer(opts.bufferSize || 4 * 1024 * 1024);
			this[kImpl].data = Buffer.from(this[kImpl].dataBuf);
			this[kImpl].sync = opts.sync || false;
			this[kImpl].ending = false;
			this[kImpl].ended = false;
			this[kImpl].needDrain = false;
			this[kImpl].destroyed = false;
			this[kImpl].flushing = false;
			this[kImpl].ready = false;
			this[kImpl].finished = false;
			this[kImpl].errored = null;
			this[kImpl].closed = false;
			this[kImpl].buf = "";
			this.worker = createWorker(this, opts);
		}
		write(data) {
			if (this[kImpl].destroyed) throw new Error("the worker has exited");
			if (this[kImpl].ending) throw new Error("the worker is ending");
			if (this[kImpl].flushing && this[kImpl].buf.length + data.length >= MAX_STRING) try {
				writeSync(this);
				this[kImpl].flushing = true;
			} catch (err) {
				destroy(this, err);
				return false;
			}
			this[kImpl].buf += data;
			if (this[kImpl].sync) try {
				writeSync(this);
				return true;
			} catch (err) {
				destroy(this, err);
				return false;
			}
			if (!this[kImpl].flushing) {
				this[kImpl].flushing = true;
				setImmediate(nextFlush, this);
			}
			this[kImpl].needDrain = this[kImpl].data.length - this[kImpl].buf.length - Atomics.load(this[kImpl].state, WRITE_INDEX) <= 0;
			return !this[kImpl].needDrain;
		}
		end() {
			if (this[kImpl].destroyed) return;
			this[kImpl].ending = true;
			end(this);
		}
		flush(cb) {
			if (this[kImpl].destroyed) {
				if (typeof cb === "function") process.nextTick(cb, /* @__PURE__ */ new Error("the worker has exited"));
				return;
			}
			const writeIndex = Atomics.load(this[kImpl].state, WRITE_INDEX);
			wait(this[kImpl].state, READ_INDEX, writeIndex, Infinity, (err, res) => {
				if (err) {
					destroy(this, err);
					process.nextTick(cb, err);
					return;
				}
				if (res === "not-equal") {
					this.flush(cb);
					return;
				}
				process.nextTick(cb);
			});
		}
		flushSync() {
			if (this[kImpl].destroyed) return;
			writeSync(this);
			flushSync(this);
		}
		unref() {
			this.worker.unref();
		}
		ref() {
			this.worker.ref();
		}
		get ready() {
			return this[kImpl].ready;
		}
		get destroyed() {
			return this[kImpl].destroyed;
		}
		get closed() {
			return this[kImpl].closed;
		}
		get writable() {
			return !this[kImpl].destroyed && !this[kImpl].ending;
		}
		get writableEnded() {
			return this[kImpl].ending;
		}
		get writableFinished() {
			return this[kImpl].finished;
		}
		get writableNeedDrain() {
			return this[kImpl].needDrain;
		}
		get writableObjectMode() {
			return false;
		}
		get writableErrored() {
			return this[kImpl].errored;
		}
	};
	function destroy(stream, err) {
		if (stream[kImpl].destroyed) return;
		stream[kImpl].destroyed = true;
		if (err) {
			stream[kImpl].errored = err;
			stream.emit("error", err);
		}
		if (!stream.worker.exited) stream.worker.terminate().catch(() => {}).then(() => {
			stream[kImpl].closed = true;
			stream.emit("close");
		});
		else setImmediate(() => {
			stream[kImpl].closed = true;
			stream.emit("close");
		});
	}
	function write(stream, data, cb) {
		const current = Atomics.load(stream[kImpl].state, WRITE_INDEX);
		const length = Buffer.byteLength(data);
		stream[kImpl].data.write(data, current);
		Atomics.store(stream[kImpl].state, WRITE_INDEX, current + length);
		Atomics.notify(stream[kImpl].state, WRITE_INDEX);
		cb();
		return true;
	}
	function end(stream) {
		if (stream[kImpl].ended || !stream[kImpl].ending || stream[kImpl].flushing) return;
		stream[kImpl].ended = true;
		try {
			stream.flushSync();
			let readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
			Atomics.store(stream[kImpl].state, WRITE_INDEX, -1);
			Atomics.notify(stream[kImpl].state, WRITE_INDEX);
			let spins = 0;
			while (readIndex !== -1) {
				Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
				readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
				if (readIndex === -2) throw new Error("end() failed");
				if (++spins === 10) throw new Error("end() took too long (10s)");
			}
			process.nextTick(() => {
				stream[kImpl].finished = true;
				stream.emit("finish");
			});
		} catch (err) {
			destroy(stream, err);
		}
	}
	function writeSync(stream) {
		const cb = () => {
			if (stream[kImpl].ending) end(stream);
			else if (stream[kImpl].needDrain) process.nextTick(drain, stream);
		};
		stream[kImpl].flushing = false;
		while (stream[kImpl].buf.length !== 0) {
			const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
			let leftover = stream[kImpl].data.length - writeIndex;
			if (leftover === 0) {
				flushSync(stream);
				Atomics.store(stream[kImpl].state, READ_INDEX, 0);
				Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
				continue;
			} else if (leftover < 0) throw new Error("overwritten");
			let toWrite = stream[kImpl].buf.slice(0, leftover);
			let toWriteBytes = Buffer.byteLength(toWrite);
			if (toWriteBytes <= leftover) {
				stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
				write(stream, toWrite, cb);
			} else {
				flushSync(stream);
				Atomics.store(stream[kImpl].state, READ_INDEX, 0);
				Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
				while (toWriteBytes > stream[kImpl].buf.length) {
					leftover = leftover / 2;
					toWrite = stream[kImpl].buf.slice(0, leftover);
					toWriteBytes = Buffer.byteLength(toWrite);
				}
				stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
				write(stream, toWrite, cb);
			}
		}
	}
	function flushSync(stream) {
		if (stream[kImpl].flushing) throw new Error("unable to flush while flushing");
		const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
		let spins = 0;
		while (true) {
			const readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
			if (readIndex === -2) throw new Error("_flushSync failed");
			if (readIndex !== writeIndex) Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
			else break;
			if (++spins === 10) throw new Error("_flushSync took too long (10s)");
		}
	}
	module.exports = ThreadStream;
}));
//#endregion
//#region node_modules/pino/lib/transport.js
var require_transport = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { createRequire } = __require("module");
	var getCallers = require_caller();
	var { join, isAbsolute } = __require("path");
	var sleep = require_atomic_sleep();
	var onExit;
	if (global.WeakRef && global.WeakMap && global.FinalizationRegistry) onExit = require_on_exit_leak_free();
	var ThreadStream = require_thread_stream();
	function setupOnExit(stream) {
		/* istanbul ignore next */
		if (onExit) {
			onExit.register(stream, autoEnd);
			stream.on("close", function() {
				onExit.unregister(stream);
			});
		} else {
			const fn = autoEnd.bind(null, stream);
			process.once("beforeExit", fn);
			process.once("exit", fn);
			stream.on("close", function() {
				process.removeListener("beforeExit", fn);
				process.removeListener("exit", fn);
			});
		}
	}
	function buildStream(filename, workerData, workerOpts) {
		const stream = new ThreadStream({
			filename,
			workerData,
			workerOpts
		});
		stream.on("ready", onReady);
		stream.on("close", function() {
			process.removeListener("exit", onExit);
		});
		process.on("exit", onExit);
		function onReady() {
			process.removeListener("exit", onExit);
			stream.unref();
			if (workerOpts.autoEnd !== false) setupOnExit(stream);
		}
		function onExit() {
			if (stream.closed) return;
			stream.flushSync();
			sleep(100);
			stream.end();
		}
		return stream;
	}
	function autoEnd(stream) {
		stream.ref();
		stream.flushSync();
		stream.end();
		stream.once("close", function() {
			stream.unref();
		});
	}
	function transport(fullOptions) {
		const { pipeline, targets, levels, options = {}, worker = {}, caller = getCallers() } = fullOptions;
		const callers = typeof caller === "string" ? [caller] : caller;
		const bundlerOverrides = "__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {};
		let target = fullOptions.target;
		if (target && targets) throw new Error("only one of target or targets can be specified");
		if (targets) {
			target = bundlerOverrides["pino-worker"] || join(__dirname, "worker.js");
			options.targets = targets.map((dest) => {
				return {
					...dest,
					target: fixTarget(dest.target)
				};
			});
		} else if (pipeline) {
			target = bundlerOverrides["pino-pipeline-worker"] || join(__dirname, "worker-pipeline.js");
			options.targets = pipeline.map((dest) => {
				return {
					...dest,
					target: fixTarget(dest.target)
				};
			});
		}
		if (levels) options.levels = levels;
		return buildStream(fixTarget(target), options, worker);
		function fixTarget(origin) {
			origin = bundlerOverrides[origin] || origin;
			if (isAbsolute(origin) || origin.indexOf("file://") === 0) return origin;
			if (origin === "pino/file") return join(__dirname, "..", "file.js");
			let fixTarget;
			for (const filePath of callers) try {
				fixTarget = createRequire(filePath).resolve(origin);
				break;
			} catch (err) {
				continue;
			}
			if (!fixTarget) throw new Error(`unable to determine transport target for "${origin}"`);
			return fixTarget;
		}
	}
	module.exports = transport;
}));
//#endregion
//#region node_modules/pino/lib/tools.js
var require_tools = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var format = require_quick_format_unescaped();
	var { mapHttpRequest, mapHttpResponse } = require_pino_std_serializers();
	var SonicBoom = require_sonic_boom();
	var warning = require_deprecations();
	var { lsCacheSym, chindingsSym, parsedChindingsSym, writeSym, serializersSym, formatOptsSym, endSym, stringifiersSym, stringifySym, stringifySafeSym, wildcardFirstSym, needsMetadataGsym, redactFmtSym, streamSym, nestedKeySym, formattersSym, messageKeySym, nestedKeyStrSym } = require_symbols();
	var { isMainThread } = __require("worker_threads");
	var transport = require_transport();
	function noop() {}
	function genLog(level, hook) {
		if (!hook) return LOG;
		return function hookWrappedLog(...args) {
			hook.call(this, args, LOG, level);
		};
		function LOG(o, ...n) {
			if (typeof o === "object") {
				let msg = o;
				if (o !== null) {
					if (o.method && o.headers && o.socket) o = mapHttpRequest(o);
					else if (typeof o.setHeader === "function") o = mapHttpResponse(o);
				}
				let formatParams;
				if (msg === null && n.length === 0) formatParams = [null];
				else {
					msg = n.shift();
					formatParams = n;
				}
				this[writeSym](o, format(msg, formatParams, this[formatOptsSym]), level);
			} else this[writeSym](null, format(o, n, this[formatOptsSym]), level);
		}
	}
	function asString(str) {
		let result = "";
		let last = 0;
		let found = false;
		let point = 255;
		const l = str.length;
		if (l > 100) return JSON.stringify(str);
		for (var i = 0; i < l && point >= 32; i++) {
			point = str.charCodeAt(i);
			if (point === 34 || point === 92) {
				result += str.slice(last, i) + "\\";
				last = i;
				found = true;
			}
		}
		if (!found) result = str;
		else result += str.slice(last);
		return point < 32 ? JSON.stringify(str) : "\"" + result + "\"";
	}
	function asJson(obj, msg, num, time) {
		const stringify = this[stringifySym];
		const stringifySafe = this[stringifySafeSym];
		const stringifiers = this[stringifiersSym];
		const end = this[endSym];
		const chindings = this[chindingsSym];
		const serializers = this[serializersSym];
		const formatters = this[formattersSym];
		const messageKey = this[messageKeySym];
		let data = this[lsCacheSym][num] + time;
		data = data + chindings;
		let value;
		if (formatters.log) obj = formatters.log(obj);
		const wildcardStringifier = stringifiers[wildcardFirstSym];
		let propStr = "";
		for (const key in obj) {
			value = obj[key];
			if (Object.prototype.hasOwnProperty.call(obj, key) && value !== void 0) {
				value = serializers[key] ? serializers[key](value) : value;
				const stringifier = stringifiers[key] || wildcardStringifier;
				switch (typeof value) {
					case "undefined":
					case "function": continue;
					case "number": if (Number.isFinite(value) === false) value = null;
					case "boolean":
						if (stringifier) value = stringifier(value);
						break;
					case "string":
						value = (stringifier || asString)(value);
						break;
					default: value = (stringifier || stringify)(value, stringifySafe);
				}
				if (value === void 0) continue;
				propStr += ",\"" + key + "\":" + value;
			}
		}
		let msgStr = "";
		if (msg !== void 0) {
			value = serializers[messageKey] ? serializers[messageKey](msg) : msg;
			const stringifier = stringifiers[messageKey] || wildcardStringifier;
			switch (typeof value) {
				case "function": break;
				case "number": if (Number.isFinite(value) === false) value = null;
				case "boolean":
					if (stringifier) value = stringifier(value);
					msgStr = ",\"" + messageKey + "\":" + value;
					break;
				case "string":
					value = (stringifier || asString)(value);
					msgStr = ",\"" + messageKey + "\":" + value;
					break;
				default:
					value = (stringifier || stringify)(value, stringifySafe);
					msgStr = ",\"" + messageKey + "\":" + value;
			}
		}
		if (this[nestedKeySym] && propStr) return data + this[nestedKeyStrSym] + propStr.slice(1) + "}" + msgStr + end;
		else return data + propStr + msgStr + end;
	}
	function asChindings(instance, bindings) {
		let value;
		let data = instance[chindingsSym];
		const stringify = instance[stringifySym];
		const stringifySafe = instance[stringifySafeSym];
		const stringifiers = instance[stringifiersSym];
		const wildcardStringifier = stringifiers[wildcardFirstSym];
		const serializers = instance[serializersSym];
		const formatter = instance[formattersSym].bindings;
		bindings = formatter(bindings);
		for (const key in bindings) {
			value = bindings[key];
			if ((key !== "level" && key !== "serializers" && key !== "formatters" && key !== "customLevels" && bindings.hasOwnProperty(key) && value !== void 0) === true) {
				value = serializers[key] ? serializers[key](value) : value;
				value = (stringifiers[key] || wildcardStringifier || stringify)(value, stringifySafe);
				if (value === void 0) continue;
				data += ",\"" + key + "\":" + value;
			}
		}
		return data;
	}
	function getPrettyStream(opts, prettifier, dest, instance) {
		if (prettifier && typeof prettifier === "function") {
			prettifier = prettifier.bind(instance);
			return prettifierMetaWrapper(prettifier(opts), dest, opts);
		}
		try {
			const prettyFactory = __require("pino-pretty").prettyFactory;
			prettyFactory.asMetaWrapper = prettifierMetaWrapper;
			return prettifierMetaWrapper(prettyFactory(opts), dest, opts);
		} catch (e) {
			if (e.message.startsWith("Cannot find module 'pino-pretty'")) throw Error("Missing `pino-pretty` module: `pino-pretty` must be installed separately");
			throw e;
		}
	}
	function prettifierMetaWrapper(pretty, dest, opts) {
		opts = Object.assign({ suppressFlushSyncWarning: false }, opts);
		let warned = false;
		return {
			[needsMetadataGsym]: true,
			lastLevel: 0,
			lastMsg: null,
			lastObj: null,
			lastLogger: null,
			flushSync() {
				if (opts.suppressFlushSyncWarning || warned) return;
				warned = true;
				setMetadataProps(dest, this);
				dest.write(pretty(Object.assign({
					level: 40,
					msg: "pino.final with prettyPrint does not support flushing",
					time: Date.now()
				}, this.chindings())));
			},
			chindings() {
				const lastLogger = this.lastLogger;
				let chindings = null;
				if (!lastLogger) return null;
				if (lastLogger.hasOwnProperty(parsedChindingsSym)) chindings = lastLogger[parsedChindingsSym];
				else {
					chindings = JSON.parse("{" + lastLogger[chindingsSym].substr(1) + "}");
					lastLogger[parsedChindingsSym] = chindings;
				}
				return chindings;
			},
			write(chunk) {
				const lastLogger = this.lastLogger;
				const chindings = this.chindings();
				let time = this.lastTime;
				/* istanbul ignore next */
				if (typeof time === "number") {} else if (time.match(/^\d+/)) time = parseInt(time);
				else time = time.slice(1, -1);
				const lastObj = this.lastObj;
				const lastMsg = this.lastMsg;
				const errorProps = null;
				const formatters = lastLogger[formattersSym];
				const formattedObj = formatters.log ? formatters.log(lastObj) : lastObj;
				const messageKey = lastLogger[messageKeySym];
				if (lastMsg && formattedObj && !Object.prototype.hasOwnProperty.call(formattedObj, messageKey)) formattedObj[messageKey] = lastMsg;
				const obj = Object.assign({
					level: this.lastLevel,
					time
				}, formattedObj, errorProps);
				const serializers = lastLogger[serializersSym];
				const keys = Object.keys(serializers);
				for (var i = 0; i < keys.length; i++) {
					const key = keys[i];
					if (obj[key] !== void 0) obj[key] = serializers[key](obj[key]);
				}
				for (const key in chindings) if (!obj.hasOwnProperty(key)) obj[key] = chindings[key];
				const redact = lastLogger[stringifiersSym][redactFmtSym];
				const formatted = pretty(typeof redact === "function" ? redact(obj) : obj);
				if (formatted === void 0) return;
				setMetadataProps(dest, this);
				dest.write(formatted);
			}
		};
	}
	function hasBeenTampered(stream) {
		return stream.write !== stream.constructor.prototype.write;
	}
	function buildSafeSonicBoom(opts) {
		const stream = new SonicBoom(opts);
		stream.on("error", filterBrokenPipe);
		if (!opts.sync && isMainThread) setupOnExit(stream);
		return stream;
		function filterBrokenPipe(err) {
			if (err.code === "EPIPE") {
				stream.write = noop;
				stream.end = noop;
				stream.flushSync = noop;
				stream.destroy = noop;
				return;
			}
			stream.removeListener("error", filterBrokenPipe);
			stream.emit("error", err);
		}
	}
	function setupOnExit(stream) {
		/* istanbul ignore next */
		if (global.WeakRef && global.WeakMap && global.FinalizationRegistry) {
			const onExit = require_on_exit_leak_free();
			onExit.register(stream, autoEnd);
			stream.on("close", function() {
				onExit.unregister(stream);
			});
		}
	}
	function autoEnd(stream, eventName) {
		/* istanbul ignore next */
		if (stream.destroyed) return;
		if (eventName === "beforeExit") {
			stream.flush();
			stream.on("drain", function() {
				stream.end();
			});
		} else stream.flushSync();
	}
	function createArgsNormalizer(defaultOptions) {
		return function normalizeArgs(instance, caller, opts = {}, stream) {
			if (typeof opts === "string") {
				stream = buildSafeSonicBoom({
					dest: opts,
					sync: true
				});
				opts = {};
			} else if (typeof stream === "string") {
				if (opts && opts.transport) throw Error("only one of option.transport or stream can be specified");
				stream = buildSafeSonicBoom({
					dest: stream,
					sync: true
				});
			} else if (opts instanceof SonicBoom || opts.writable || opts._writableState) {
				stream = opts;
				opts = {};
			} else if (opts.transport) {
				if (opts.transport instanceof SonicBoom || opts.transport.writable || opts.transport._writableState) throw Error("option.transport do not allow stream, please pass to option directly. e.g. pino(transport)");
				if (opts.transport.targets && opts.transport.targets.length && opts.formatters && typeof opts.formatters.level === "function") throw Error("option.transport.targets do not allow custom level formatters");
				let customLevels;
				if (opts.customLevels) customLevels = opts.useOnlyCustomLevels ? opts.customLevels : Object.assign({}, opts.levels, opts.customLevels);
				stream = transport({
					caller,
					...opts.transport,
					levels: customLevels
				});
			}
			opts = Object.assign({}, defaultOptions, opts);
			opts.serializers = Object.assign({}, defaultOptions.serializers, opts.serializers);
			opts.formatters = Object.assign({}, defaultOptions.formatters, opts.formatters);
			if ("onTerminated" in opts) throw Error("The onTerminated option has been removed, use pino.final instead");
			if ("changeLevelName" in opts) {
				process.emitWarning("The changeLevelName option is deprecated and will be removed in v7. Use levelKey instead.", { code: "changeLevelName_deprecation" });
				opts.levelKey = opts.changeLevelName;
				delete opts.changeLevelName;
			}
			const { enabled, prettyPrint, prettifier, messageKey } = opts;
			if (enabled === false) opts.level = "silent";
			stream = stream || process.stdout;
			if (stream === process.stdout && stream.fd >= 0 && !hasBeenTampered(stream)) stream = buildSafeSonicBoom({
				fd: stream.fd,
				sync: true
			});
			if (prettyPrint) {
				warning.emit("PINODEP008");
				stream = getPrettyStream(Object.assign({ messageKey }, prettyPrint), prettifier, stream, instance);
			}
			return {
				opts,
				stream
			};
		};
	}
	function final(logger, handler) {
		if (Number(process.versions.node.split(".")[0]) >= 14) warning.emit("PINODEP009");
		if (typeof logger === "undefined" || typeof logger.child !== "function") throw Error("expected a pino logger instance");
		const hasHandler = typeof handler !== "undefined";
		if (hasHandler && typeof handler !== "function") throw Error("if supplied, the handler parameter should be a function");
		const stream = logger[streamSym];
		if (typeof stream.flushSync !== "function") throw Error("final requires a stream that has a flushSync method, such as pino.destination");
		const finalLogger = new Proxy(logger, { get: (logger, key) => {
			if (key in logger.levels.values) return (...args) => {
				logger[key](...args);
				stream.flushSync();
			};
			return logger[key];
		} });
		if (!hasHandler) {
			try {
				stream.flushSync();
			} catch {}
			return finalLogger;
		}
		return (err = null, ...args) => {
			try {
				stream.flushSync();
			} catch (e) {}
			return handler(err, finalLogger, ...args);
		};
	}
	function stringify(obj, stringifySafeFn) {
		try {
			return JSON.stringify(obj);
		} catch (_) {
			try {
				return (stringifySafeFn || this[stringifySafeSym])(obj);
			} catch (_) {
				return "\"[unable to serialize, circular reference is too complex to analyze]\"";
			}
		}
	}
	function buildFormatters(level, bindings, log) {
		return {
			level,
			bindings,
			log
		};
	}
	function setMetadataProps(dest, that) {
		if (dest[needsMetadataGsym] === true) {
			dest.lastLevel = that.lastLevel;
			dest.lastMsg = that.lastMsg;
			dest.lastObj = that.lastObj;
			dest.lastTime = that.lastTime;
			dest.lastLogger = that.lastLogger;
		}
	}
	/**
	* Convert a string integer file descriptor to a proper native integer
	* file descriptor.
	*
	* @param {string} destination The file descriptor string to attempt to convert.
	*
	* @returns {Number}
	*/
	function normalizeDestFileDescriptor(destination) {
		const fd = Number(destination);
		if (typeof destination === "string" && Number.isFinite(fd)) return fd;
		return destination;
	}
	module.exports = {
		noop,
		buildSafeSonicBoom,
		getPrettyStream,
		asChindings,
		asJson,
		genLog,
		createArgsNormalizer,
		final,
		stringify,
		buildFormatters,
		normalizeDestFileDescriptor
	};
}));
//#endregion
//#region node_modules/pino/lib/levels.js
var require_levels = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { lsCacheSym, levelValSym, useOnlyCustomLevelsSym, streamSym, formattersSym, hooksSym } = require_symbols();
	var { noop, genLog } = require_tools();
	var levels = {
		trace: 10,
		debug: 20,
		info: 30,
		warn: 40,
		error: 50,
		fatal: 60
	};
	var levelMethods = {
		fatal: (hook) => {
			const logFatal = genLog(levels.fatal, hook);
			return function(...args) {
				const stream = this[streamSym];
				logFatal.call(this, ...args);
				if (typeof stream.flushSync === "function") try {
					stream.flushSync();
				} catch (e) {}
			};
		},
		error: (hook) => genLog(levels.error, hook),
		warn: (hook) => genLog(levels.warn, hook),
		info: (hook) => genLog(levels.info, hook),
		debug: (hook) => genLog(levels.debug, hook),
		trace: (hook) => genLog(levels.trace, hook)
	};
	var nums = Object.keys(levels).reduce((o, k) => {
		o[levels[k]] = k;
		return o;
	}, {});
	var initialLsCache = Object.keys(nums).reduce((o, k) => {
		o[k] = "{\"level\":" + Number(k);
		return o;
	}, {});
	function genLsCache(instance) {
		const formatter = instance[formattersSym].level;
		const { labels } = instance.levels;
		const cache = {};
		for (const label in labels) {
			const level = formatter(labels[label], Number(label));
			cache[label] = JSON.stringify(level).slice(0, -1);
		}
		instance[lsCacheSym] = cache;
		return instance;
	}
	function isStandardLevel(level, useOnlyCustomLevels) {
		if (useOnlyCustomLevels) return false;
		switch (level) {
			case "fatal":
			case "error":
			case "warn":
			case "info":
			case "debug":
			case "trace": return true;
			default: return false;
		}
	}
	function setLevel(level) {
		const { labels, values } = this.levels;
		if (typeof level === "number") {
			if (labels[level] === void 0) throw Error("unknown level value" + level);
			level = labels[level];
		}
		if (values[level] === void 0) throw Error("unknown level " + level);
		const preLevelVal = this[levelValSym];
		const levelVal = this[levelValSym] = values[level];
		const useOnlyCustomLevelsVal = this[useOnlyCustomLevelsSym];
		const hook = this[hooksSym].logMethod;
		for (const key in values) {
			if (levelVal > values[key]) {
				this[key] = noop;
				continue;
			}
			this[key] = isStandardLevel(key, useOnlyCustomLevelsVal) ? levelMethods[key](hook) : genLog(values[key], hook);
		}
		this.emit("level-change", level, levelVal, labels[preLevelVal], preLevelVal);
	}
	function getLevel(level) {
		const { levels, levelVal } = this;
		return levels && levels.labels ? levels.labels[levelVal] : "";
	}
	function isLevelEnabled(logLevel) {
		const { values } = this.levels;
		const logLevelVal = values[logLevel];
		return logLevelVal !== void 0 && logLevelVal >= this[levelValSym];
	}
	function mappings(customLevels = null, useOnlyCustomLevels = false) {
		const customNums = customLevels ? Object.keys(customLevels).reduce((o, k) => {
			o[customLevels[k]] = k;
			return o;
		}, {}) : null;
		return {
			labels: Object.assign(Object.create(Object.prototype, { Infinity: { value: "silent" } }), useOnlyCustomLevels ? null : nums, customNums),
			values: Object.assign(Object.create(Object.prototype, { silent: { value: Infinity } }), useOnlyCustomLevels ? null : levels, customLevels)
		};
	}
	function assertDefaultLevelFound(defaultLevel, customLevels, useOnlyCustomLevels) {
		if (typeof defaultLevel === "number") {
			if (![].concat(Object.keys(customLevels || {}).map((key) => customLevels[key]), useOnlyCustomLevels ? [] : Object.keys(nums).map((level) => +level), Infinity).includes(defaultLevel)) throw Error(`default level:${defaultLevel} must be included in custom levels`);
			return;
		}
		if (!(defaultLevel in Object.assign(Object.create(Object.prototype, { silent: { value: Infinity } }), useOnlyCustomLevels ? null : levels, customLevels))) throw Error(`default level:${defaultLevel} must be included in custom levels`);
	}
	function assertNoLevelCollisions(levels, customLevels) {
		const { labels, values } = levels;
		for (const k in customLevels) {
			if (k in values) throw Error("levels cannot be overridden");
			if (customLevels[k] in labels) throw Error("pre-existing level values cannot be used for new levels");
		}
	}
	module.exports = {
		initialLsCache,
		genLsCache,
		levelMethods,
		getLevel,
		setLevel,
		isLevelEnabled,
		mappings,
		levels,
		assertNoLevelCollisions,
		assertDefaultLevelFound
	};
}));
//#endregion
//#region node_modules/pino/package.json
var package_exports = /* @__PURE__ */ __exportAll({
	author: () => author,
	bin: () => bin,
	browser: () => browser,
	bugs: () => bugs,
	contributors: () => contributors,
	default: () => package_default,
	dependencies: () => dependencies,
	description: () => description,
	devDependencies: () => devDependencies,
	files: () => files,
	homepage: () => homepage,
	keywords: () => keywords,
	license: () => "MIT",
	main: () => main,
	name: () => name$1,
	precommit: () => precommit,
	repository: () => repository,
	scripts: () => scripts,
	tsd: () => tsd,
	type: () => type,
	types: () => types,
	version: () => version$1
}), name$1, version$1, description, main, type, types, browser, files, scripts, bin, precommit, repository, keywords, author, contributors, bugs, homepage, devDependencies, dependencies, tsd, package_default;
var init_package = __esmMin((() => {
	name$1 = "pino";
	version$1 = "7.11.0";
	description = "super fast, all natural json logger";
	main = "pino.js";
	type = "commonjs";
	types = "pino.d.ts";
	browser = "./browser.js";
	files = [
		"pino.js",
		"file.js",
		"pino.d.ts",
		"bin.js",
		"browser.js",
		"pretty.js",
		"usage.txt",
		"test",
		"docs",
		"example.js",
		"lib"
	];
	scripts = {
		"docs": "docsify serve",
		"browser-test": "airtap --local 8080 test/browser*test.js",
		"lint": "eslint .",
		"test": "npm run lint && npm run transpile && tap --ts && jest test/jest && npm run test-types",
		"test-ci": "npm run lint && npm run transpile && tap --ts --no-check-coverage --coverage-report=lcovonly && npm run test-types",
		"test-ci-pnpm": "pnpm run lint && npm run transpile && tap --ts --no-coverage --no-check-coverage && pnpm run test-types",
		"test-ci-yarn-pnp": "yarn run lint && npm run transpile && tap --ts --no-check-coverage --coverage-report=lcovonly",
		"test-types": "tsc && tsd && ts-node test/types/pino.ts",
		"transpile": "node ./test/fixtures/ts/transpile.cjs",
		"cov-ui": "tap --ts --coverage-report=html",
		"bench": "node benchmarks/utils/runbench all",
		"bench-basic": "node benchmarks/utils/runbench basic",
		"bench-object": "node benchmarks/utils/runbench object",
		"bench-deep-object": "node benchmarks/utils/runbench deep-object",
		"bench-multi-arg": "node benchmarks/utils/runbench multi-arg",
		"bench-longs-tring": "node benchmarks/utils/runbench long-string",
		"bench-child": "node benchmarks/utils/runbench child",
		"bench-child-child": "node benchmarks/utils/runbench child-child",
		"bench-child-creation": "node benchmarks/utils/runbench child-creation",
		"bench-formatters": "node benchmarks/utils/runbench formatters",
		"update-bench-doc": "node benchmarks/utils/generate-benchmark-doc > docs/benchmarks.md"
	};
	bin = { "pino": "./bin.js" };
	precommit = "test";
	repository = {
		"type": "git",
		"url": "git+https://github.com/pinojs/pino.git"
	};
	keywords = [
		"fast",
		"logger",
		"stream",
		"json"
	];
	author = "Matteo Collina <hello@matteocollina.com>";
	contributors = [
		"David Mark Clements <huperekchuno@googlemail.com>",
		"James Sumners <james.sumners@gmail.com>",
		"Thomas Watson Steen <w@tson.dk> (https://twitter.com/wa7son)"
	];
	bugs = { "url": "https://github.com/pinojs/pino/issues" };
	homepage = "http://getpino.io";
	devDependencies = {
		"@types/flush-write-stream": "^1.0.0",
		"@types/node": "^17.0.0",
		"@types/tap": "^15.0.6",
		"airtap": "4.0.4",
		"benchmark": "^2.1.4",
		"bole": "^4.0.0",
		"bunyan": "^1.8.14",
		"docsify-cli": "^4.4.1",
		"eslint": "^7.17.0",
		"eslint-config-standard": "^16.0.3",
		"eslint-plugin-import": "^2.22.1",
		"eslint-plugin-node": "^11.1.0",
		"eslint-plugin-promise": "^5.1.0",
		"execa": "^5.0.0",
		"fastbench": "^1.0.1",
		"flush-write-stream": "^2.0.0",
		"import-fresh": "^3.2.1",
		"jest": "^27.3.1",
		"log": "^6.0.0",
		"loglevel": "^1.6.7",
		"pino-pretty": "^v7.6.0",
		"pre-commit": "^1.2.2",
		"proxyquire": "^2.1.3",
		"pump": "^3.0.0",
		"rimraf": "^3.0.2",
		"semver": "^7.0.0",
		"split2": "^4.0.0",
		"steed": "^1.1.3",
		"strip-ansi": "^6.0.0",
		"tap": "^16.0.0",
		"tape": "^5.0.0",
		"through2": "^4.0.0",
		"ts-node": "^10.7.0",
		"tsd": "^0.20.0",
		"typescript": "^4.4.4",
		"winston": "^3.3.3"
	};
	dependencies = {
		"atomic-sleep": "^1.0.0",
		"fast-redact": "^3.0.0",
		"on-exit-leak-free": "^0.2.0",
		"pino-abstract-transport": "v0.5.0",
		"pino-std-serializers": "^4.0.0",
		"process-warning": "^1.0.0",
		"quick-format-unescaped": "^4.0.3",
		"real-require": "^0.1.0",
		"safe-stable-stringify": "^2.1.0",
		"sonic-boom": "^2.2.1",
		"thread-stream": "^0.15.1"
	};
	tsd = { "directory": "test/types" };
	package_default = {
		name: name$1,
		version: version$1,
		description,
		main,
		type,
		types,
		browser,
		files,
		scripts,
		bin,
		precommit,
		repository,
		keywords,
		author,
		contributors,
		license: "MIT",
		bugs,
		homepage,
		devDependencies,
		dependencies,
		tsd
	};
}));
//#endregion
//#region node_modules/pino/lib/meta.js
var require_meta = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { version } = (init_package(), __toCommonJS(package_exports).default);
	module.exports = { version };
}));
//#endregion
//#region node_modules/pino/lib/proto.js
var require_proto = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { EventEmitter: EventEmitter$3 } = __require("events");
	var { lsCacheSym, levelValSym, setLevelSym, getLevelSym, chindingsSym, parsedChindingsSym, mixinSym, asJsonSym, writeSym, mixinMergeStrategySym, timeSym, timeSliceIndexSym, streamSym, serializersSym, formattersSym, useOnlyCustomLevelsSym, needsMetadataGsym, redactFmtSym, stringifySym, formatOptsSym, stringifiersSym } = require_symbols();
	var { getLevel, setLevel, isLevelEnabled, mappings, initialLsCache, genLsCache, assertNoLevelCollisions } = require_levels();
	var { asChindings, asJson, buildFormatters, stringify } = require_tools();
	var { version } = require_meta();
	var redaction = require_redaction();
	var prototype = {
		constructor: class Pino {},
		child,
		bindings,
		setBindings,
		flush,
		isLevelEnabled,
		version,
		get level() {
			return this[getLevelSym]();
		},
		set level(lvl) {
			this[setLevelSym](lvl);
		},
		get levelVal() {
			return this[levelValSym];
		},
		set levelVal(n) {
			throw Error("levelVal is read-only");
		},
		[lsCacheSym]: initialLsCache,
		[writeSym]: write,
		[asJsonSym]: asJson,
		[getLevelSym]: getLevel,
		[setLevelSym]: setLevel
	};
	Object.setPrototypeOf(prototype, EventEmitter$3.prototype);
	module.exports = function() {
		return Object.create(prototype);
	};
	var resetChildingsFormatter = (bindings) => bindings;
	function child(bindings, options) {
		if (!bindings) throw Error("missing bindings for child Pino");
		options = options || {};
		const serializers = this[serializersSym];
		const formatters = this[formattersSym];
		const instance = Object.create(this);
		if (options.hasOwnProperty("serializers") === true) {
			instance[serializersSym] = Object.create(null);
			for (const k in serializers) instance[serializersSym][k] = serializers[k];
			const parentSymbols = Object.getOwnPropertySymbols(serializers);
			for (var i = 0; i < parentSymbols.length; i++) {
				const ks = parentSymbols[i];
				instance[serializersSym][ks] = serializers[ks];
			}
			for (const bk in options.serializers) instance[serializersSym][bk] = options.serializers[bk];
			const bindingsSymbols = Object.getOwnPropertySymbols(options.serializers);
			for (var bi = 0; bi < bindingsSymbols.length; bi++) {
				const bks = bindingsSymbols[bi];
				instance[serializersSym][bks] = options.serializers[bks];
			}
		} else instance[serializersSym] = serializers;
		if (options.hasOwnProperty("formatters")) {
			const { level, bindings: chindings, log } = options.formatters;
			instance[formattersSym] = buildFormatters(level || formatters.level, chindings || resetChildingsFormatter, log || formatters.log);
		} else instance[formattersSym] = buildFormatters(formatters.level, resetChildingsFormatter, formatters.log);
		if (options.hasOwnProperty("customLevels") === true) {
			assertNoLevelCollisions(this.levels, options.customLevels);
			instance.levels = mappings(options.customLevels, instance[useOnlyCustomLevelsSym]);
			genLsCache(instance);
		}
		if (typeof options.redact === "object" && options.redact !== null || Array.isArray(options.redact)) {
			instance.redact = options.redact;
			const stringifiers = redaction(instance.redact, stringify);
			const formatOpts = { stringify: stringifiers[redactFmtSym] };
			instance[stringifySym] = stringify;
			instance[stringifiersSym] = stringifiers;
			instance[formatOptsSym] = formatOpts;
		}
		instance[chindingsSym] = asChindings(instance, bindings);
		const childLevel = options.level || this.level;
		instance[setLevelSym](childLevel);
		return instance;
	}
	function bindings() {
		const chindingsJson = `{${this[chindingsSym].substr(1)}}`;
		const bindingsFromJson = JSON.parse(chindingsJson);
		delete bindingsFromJson.pid;
		delete bindingsFromJson.hostname;
		return bindingsFromJson;
	}
	function setBindings(newBindings) {
		const chindings = asChindings(this, newBindings);
		this[chindingsSym] = chindings;
		delete this[parsedChindingsSym];
	}
	/**
	* Default strategy for creating `mergeObject` from arguments and the result from `mixin()`.
	* Fields from `mergeObject` have higher priority in this strategy.
	*
	* @param {Object} mergeObject The object a user has supplied to the logging function.
	* @param {Object} mixinObject The result of the `mixin` method.
	* @return {Object}
	*/
	function defaultMixinMergeStrategy(mergeObject, mixinObject) {
		return Object.assign(mixinObject, mergeObject);
	}
	function write(_obj, msg, num) {
		const t = this[timeSym]();
		const mixin = this[mixinSym];
		const mixinMergeStrategy = this[mixinMergeStrategySym] || defaultMixinMergeStrategy;
		let obj;
		if (_obj === void 0 || _obj === null) obj = {};
		else if (_obj instanceof Error) {
			obj = { err: _obj };
			if (msg === void 0) msg = _obj.message;
		} else {
			obj = _obj;
			if (msg === void 0 && _obj.err) msg = _obj.err.message;
		}
		if (mixin) obj = mixinMergeStrategy(obj, mixin(obj, num));
		const s = this[asJsonSym](obj, msg, num, t);
		const stream = this[streamSym];
		if (stream[needsMetadataGsym] === true) {
			stream.lastLevel = num;
			stream.lastObj = obj;
			stream.lastMsg = msg;
			stream.lastTime = t.slice(this[timeSliceIndexSym]);
			stream.lastLogger = this;
		}
		stream.write(s);
	}
	function noop() {}
	function flush() {
		const stream = this[streamSym];
		if ("flush" in stream) stream.flush(noop);
	}
}));
//#endregion
//#region node_modules/safe-stable-stringify/index.js
var require_safe_stable_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { hasOwnProperty } = Object.prototype;
	var stringify = configure();
	stringify.configure = configure;
	stringify.stringify = stringify;
	stringify.default = stringify;
	exports.stringify = stringify;
	exports.configure = configure;
	module.exports = stringify;
	var strEscapeSequencesRegExp = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]/;
	function strEscape(str) {
		if (str.length < 5e3 && !strEscapeSequencesRegExp.test(str)) return `"${str}"`;
		return JSON.stringify(str);
	}
	function sort(array, comparator) {
		if (array.length > 200 || comparator) return array.sort(comparator);
		for (let i = 1; i < array.length; i++) {
			const currentValue = array[i];
			let position = i;
			while (position !== 0 && array[position - 1] > currentValue) {
				array[position] = array[position - 1];
				position--;
			}
			array[position] = currentValue;
		}
		return array;
	}
	var typedArrayPrototypeGetSymbolToStringTag = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Object.getPrototypeOf(new Int8Array())), Symbol.toStringTag).get;
	function isTypedArrayWithEntries(value) {
		return typedArrayPrototypeGetSymbolToStringTag.call(value) !== void 0 && value.length !== 0;
	}
	function stringifyTypedArray(array, separator, maximumBreadth) {
		if (array.length < maximumBreadth) maximumBreadth = array.length;
		const whitespace = separator === "," ? "" : " ";
		let res = `"0":${whitespace}${array[0]}`;
		for (let i = 1; i < maximumBreadth; i++) res += `${separator}"${i}":${whitespace}${array[i]}`;
		return res;
	}
	function getCircularValueOption(options) {
		if (hasOwnProperty.call(options, "circularValue")) {
			const circularValue = options.circularValue;
			if (typeof circularValue === "string") return `"${circularValue}"`;
			if (circularValue == null) return circularValue;
			if (circularValue === Error || circularValue === TypeError) return { toString() {
				throw new TypeError("Converting circular structure to JSON");
			} };
			throw new TypeError("The \"circularValue\" argument must be of type string or the value null or undefined");
		}
		return "\"[Circular]\"";
	}
	function getDeterministicOption(options) {
		let value;
		if (hasOwnProperty.call(options, "deterministic")) {
			value = options.deterministic;
			if (typeof value !== "boolean" && typeof value !== "function") throw new TypeError("The \"deterministic\" argument must be of type boolean or comparator function");
		}
		return value === void 0 ? true : value;
	}
	function getBooleanOption(options, key) {
		let value;
		if (hasOwnProperty.call(options, key)) {
			value = options[key];
			if (typeof value !== "boolean") throw new TypeError(`The "${key}" argument must be of type boolean`);
		}
		return value === void 0 ? true : value;
	}
	function getPositiveIntegerOption(options, key) {
		let value;
		if (hasOwnProperty.call(options, key)) {
			value = options[key];
			if (typeof value !== "number") throw new TypeError(`The "${key}" argument must be of type number`);
			if (!Number.isInteger(value)) throw new TypeError(`The "${key}" argument must be an integer`);
			if (value < 1) throw new RangeError(`The "${key}" argument must be >= 1`);
		}
		return value === void 0 ? Infinity : value;
	}
	function getItemCount(number) {
		if (number === 1) return "1 item";
		return `${number} items`;
	}
	function getUniqueReplacerSet(replacerArray) {
		const replacerSet = /* @__PURE__ */ new Set();
		for (const value of replacerArray) if (typeof value === "string" || typeof value === "number") replacerSet.add(String(value));
		return replacerSet;
	}
	function getStrictOption(options) {
		if (hasOwnProperty.call(options, "strict")) {
			const value = options.strict;
			if (typeof value !== "boolean") throw new TypeError("The \"strict\" argument must be of type boolean");
			if (value) return (value) => {
				let message = `Object can not safely be stringified. Received type ${typeof value}`;
				if (typeof value !== "function") message += ` (${value.toString()})`;
				throw new Error(message);
			};
		}
	}
	function configure(options) {
		options = { ...options };
		const fail = getStrictOption(options);
		if (fail) {
			if (options.bigint === void 0) options.bigint = false;
			if (!("circularValue" in options)) options.circularValue = Error;
		}
		const circularValue = getCircularValueOption(options);
		const bigint = getBooleanOption(options, "bigint");
		const deterministic = getDeterministicOption(options);
		const comparator = typeof deterministic === "function" ? deterministic : void 0;
		const maximumDepth = getPositiveIntegerOption(options, "maximumDepth");
		const maximumBreadth = getPositiveIntegerOption(options, "maximumBreadth");
		function stringifyFnReplacer(key, parent, stack, replacer, spacer, indentation) {
			let value = parent[key];
			if (typeof value === "object" && value !== null && typeof value.toJSON === "function") value = value.toJSON(key);
			value = replacer.call(parent, key, value);
			switch (typeof value) {
				case "string": return strEscape(value);
				case "object": {
					if (value === null) return "null";
					if (stack.indexOf(value) !== -1) return circularValue;
					let res = "";
					let join = ",";
					const originalIndentation = indentation;
					if (Array.isArray(value)) {
						if (value.length === 0) return "[]";
						if (maximumDepth < stack.length + 1) return "\"[Array]\"";
						stack.push(value);
						if (spacer !== "") {
							indentation += spacer;
							res += `\n${indentation}`;
							join = `,\n${indentation}`;
						}
						const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
						let i = 0;
						for (; i < maximumValuesToStringify - 1; i++) {
							const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
							res += tmp !== void 0 ? tmp : "null";
							res += join;
						}
						const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
						res += tmp !== void 0 ? tmp : "null";
						if (value.length - 1 > maximumBreadth) {
							const removedKeys = value.length - maximumBreadth - 1;
							res += `${join}"... ${getItemCount(removedKeys)} not stringified"`;
						}
						if (spacer !== "") res += `\n${originalIndentation}`;
						stack.pop();
						return `[${res}]`;
					}
					let keys = Object.keys(value);
					const keyLength = keys.length;
					if (keyLength === 0) return "{}";
					if (maximumDepth < stack.length + 1) return "\"[Object]\"";
					let whitespace = "";
					let separator = "";
					if (spacer !== "") {
						indentation += spacer;
						join = `,\n${indentation}`;
						whitespace = " ";
					}
					const maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
					if (deterministic && !isTypedArrayWithEntries(value)) keys = sort(keys, comparator);
					stack.push(value);
					for (let i = 0; i < maximumPropertiesToStringify; i++) {
						const key = keys[i];
						const tmp = stringifyFnReplacer(key, value, stack, replacer, spacer, indentation);
						if (tmp !== void 0) {
							res += `${separator}${strEscape(key)}:${whitespace}${tmp}`;
							separator = join;
						}
					}
					if (keyLength > maximumBreadth) {
						const removedKeys = keyLength - maximumBreadth;
						res += `${separator}"...":${whitespace}"${getItemCount(removedKeys)} not stringified"`;
						separator = join;
					}
					if (spacer !== "" && separator.length > 1) res = `\n${indentation}${res}\n${originalIndentation}`;
					stack.pop();
					return `{${res}}`;
				}
				case "number": return isFinite(value) ? String(value) : fail ? fail(value) : "null";
				case "boolean": return value === true ? "true" : "false";
				case "undefined": return;
				case "bigint": if (bigint) return String(value);
				default: return fail ? fail(value) : void 0;
			}
		}
		function stringifyArrayReplacer(key, value, stack, replacer, spacer, indentation) {
			if (typeof value === "object" && value !== null && typeof value.toJSON === "function") value = value.toJSON(key);
			switch (typeof value) {
				case "string": return strEscape(value);
				case "object": {
					if (value === null) return "null";
					if (stack.indexOf(value) !== -1) return circularValue;
					const originalIndentation = indentation;
					let res = "";
					let join = ",";
					if (Array.isArray(value)) {
						if (value.length === 0) return "[]";
						if (maximumDepth < stack.length + 1) return "\"[Array]\"";
						stack.push(value);
						if (spacer !== "") {
							indentation += spacer;
							res += `\n${indentation}`;
							join = `,\n${indentation}`;
						}
						const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
						let i = 0;
						for (; i < maximumValuesToStringify - 1; i++) {
							const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
							res += tmp !== void 0 ? tmp : "null";
							res += join;
						}
						const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
						res += tmp !== void 0 ? tmp : "null";
						if (value.length - 1 > maximumBreadth) {
							const removedKeys = value.length - maximumBreadth - 1;
							res += `${join}"... ${getItemCount(removedKeys)} not stringified"`;
						}
						if (spacer !== "") res += `\n${originalIndentation}`;
						stack.pop();
						return `[${res}]`;
					}
					stack.push(value);
					let whitespace = "";
					if (spacer !== "") {
						indentation += spacer;
						join = `,\n${indentation}`;
						whitespace = " ";
					}
					let separator = "";
					for (const key of replacer) {
						const tmp = stringifyArrayReplacer(key, value[key], stack, replacer, spacer, indentation);
						if (tmp !== void 0) {
							res += `${separator}${strEscape(key)}:${whitespace}${tmp}`;
							separator = join;
						}
					}
					if (spacer !== "" && separator.length > 1) res = `\n${indentation}${res}\n${originalIndentation}`;
					stack.pop();
					return `{${res}}`;
				}
				case "number": return isFinite(value) ? String(value) : fail ? fail(value) : "null";
				case "boolean": return value === true ? "true" : "false";
				case "undefined": return;
				case "bigint": if (bigint) return String(value);
				default: return fail ? fail(value) : void 0;
			}
		}
		function stringifyIndent(key, value, stack, spacer, indentation) {
			switch (typeof value) {
				case "string": return strEscape(value);
				case "object": {
					if (value === null) return "null";
					if (typeof value.toJSON === "function") {
						value = value.toJSON(key);
						if (typeof value !== "object") return stringifyIndent(key, value, stack, spacer, indentation);
						if (value === null) return "null";
					}
					if (stack.indexOf(value) !== -1) return circularValue;
					const originalIndentation = indentation;
					if (Array.isArray(value)) {
						if (value.length === 0) return "[]";
						if (maximumDepth < stack.length + 1) return "\"[Array]\"";
						stack.push(value);
						indentation += spacer;
						let res = `\n${indentation}`;
						const join = `,\n${indentation}`;
						const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
						let i = 0;
						for (; i < maximumValuesToStringify - 1; i++) {
							const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation);
							res += tmp !== void 0 ? tmp : "null";
							res += join;
						}
						const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation);
						res += tmp !== void 0 ? tmp : "null";
						if (value.length - 1 > maximumBreadth) {
							const removedKeys = value.length - maximumBreadth - 1;
							res += `${join}"... ${getItemCount(removedKeys)} not stringified"`;
						}
						res += `\n${originalIndentation}`;
						stack.pop();
						return `[${res}]`;
					}
					let keys = Object.keys(value);
					const keyLength = keys.length;
					if (keyLength === 0) return "{}";
					if (maximumDepth < stack.length + 1) return "\"[Object]\"";
					indentation += spacer;
					const join = `,\n${indentation}`;
					let res = "";
					let separator = "";
					let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
					if (isTypedArrayWithEntries(value)) {
						res += stringifyTypedArray(value, join, maximumBreadth);
						keys = keys.slice(value.length);
						maximumPropertiesToStringify -= value.length;
						separator = join;
					}
					if (deterministic) keys = sort(keys, comparator);
					stack.push(value);
					for (let i = 0; i < maximumPropertiesToStringify; i++) {
						const key = keys[i];
						const tmp = stringifyIndent(key, value[key], stack, spacer, indentation);
						if (tmp !== void 0) {
							res += `${separator}${strEscape(key)}: ${tmp}`;
							separator = join;
						}
					}
					if (keyLength > maximumBreadth) {
						const removedKeys = keyLength - maximumBreadth;
						res += `${separator}"...": "${getItemCount(removedKeys)} not stringified"`;
						separator = join;
					}
					if (separator !== "") res = `\n${indentation}${res}\n${originalIndentation}`;
					stack.pop();
					return `{${res}}`;
				}
				case "number": return isFinite(value) ? String(value) : fail ? fail(value) : "null";
				case "boolean": return value === true ? "true" : "false";
				case "undefined": return;
				case "bigint": if (bigint) return String(value);
				default: return fail ? fail(value) : void 0;
			}
		}
		function stringifySimple(key, value, stack) {
			switch (typeof value) {
				case "string": return strEscape(value);
				case "object": {
					if (value === null) return "null";
					if (typeof value.toJSON === "function") {
						value = value.toJSON(key);
						if (typeof value !== "object") return stringifySimple(key, value, stack);
						if (value === null) return "null";
					}
					if (stack.indexOf(value) !== -1) return circularValue;
					let res = "";
					const hasLength = value.length !== void 0;
					if (hasLength && Array.isArray(value)) {
						if (value.length === 0) return "[]";
						if (maximumDepth < stack.length + 1) return "\"[Array]\"";
						stack.push(value);
						const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
						let i = 0;
						for (; i < maximumValuesToStringify - 1; i++) {
							const tmp = stringifySimple(String(i), value[i], stack);
							res += tmp !== void 0 ? tmp : "null";
							res += ",";
						}
						const tmp = stringifySimple(String(i), value[i], stack);
						res += tmp !== void 0 ? tmp : "null";
						if (value.length - 1 > maximumBreadth) {
							const removedKeys = value.length - maximumBreadth - 1;
							res += `,"... ${getItemCount(removedKeys)} not stringified"`;
						}
						stack.pop();
						return `[${res}]`;
					}
					let keys = Object.keys(value);
					const keyLength = keys.length;
					if (keyLength === 0) return "{}";
					if (maximumDepth < stack.length + 1) return "\"[Object]\"";
					let separator = "";
					let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
					if (hasLength && isTypedArrayWithEntries(value)) {
						res += stringifyTypedArray(value, ",", maximumBreadth);
						keys = keys.slice(value.length);
						maximumPropertiesToStringify -= value.length;
						separator = ",";
					}
					if (deterministic) keys = sort(keys, comparator);
					stack.push(value);
					for (let i = 0; i < maximumPropertiesToStringify; i++) {
						const key = keys[i];
						const tmp = stringifySimple(key, value[key], stack);
						if (tmp !== void 0) {
							res += `${separator}${strEscape(key)}:${tmp}`;
							separator = ",";
						}
					}
					if (keyLength > maximumBreadth) {
						const removedKeys = keyLength - maximumBreadth;
						res += `${separator}"...":"${getItemCount(removedKeys)} not stringified"`;
					}
					stack.pop();
					return `{${res}}`;
				}
				case "number": return isFinite(value) ? String(value) : fail ? fail(value) : "null";
				case "boolean": return value === true ? "true" : "false";
				case "undefined": return;
				case "bigint": if (bigint) return String(value);
				default: return fail ? fail(value) : void 0;
			}
		}
		function stringify(value, replacer, space) {
			if (arguments.length > 1) {
				let spacer = "";
				if (typeof space === "number") spacer = " ".repeat(Math.min(space, 10));
				else if (typeof space === "string") spacer = space.slice(0, 10);
				if (replacer != null) {
					if (typeof replacer === "function") return stringifyFnReplacer("", { "": value }, [], replacer, spacer, "");
					if (Array.isArray(replacer)) return stringifyArrayReplacer("", value, [], getUniqueReplacerSet(replacer), spacer, "");
				}
				if (spacer.length !== 0) return stringifyIndent("", value, [], spacer, "");
			}
			return stringifySimple("", value, []);
		}
		return stringify;
	}
}));
//#endregion
//#region node_modules/pino/lib/multistream.js
var require_multistream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var metadata = Symbol.for("pino.metadata");
	var { levels } = require_levels();
	var defaultLevels = Object.create(levels);
	defaultLevels.silent = Infinity;
	var DEFAULT_INFO_LEVEL = levels.info;
	function multistream(streamsArray, opts) {
		let counter = 0;
		streamsArray = streamsArray || [];
		opts = opts || { dedupe: false };
		let levels = defaultLevels;
		if (opts.levels && typeof opts.levels === "object") levels = opts.levels;
		const res = {
			write,
			add,
			flushSync,
			end,
			minLevel: 0,
			streams: [],
			clone,
			[metadata]: true
		};
		if (Array.isArray(streamsArray)) streamsArray.forEach(add, res);
		else add.call(res, streamsArray);
		streamsArray = null;
		return res;
		function write(data) {
			let dest;
			const level = this.lastLevel;
			const { streams } = this;
			let stream;
			for (let i = 0; i < streams.length; i++) {
				dest = streams[i];
				if (dest.level <= level) {
					stream = dest.stream;
					if (stream[metadata]) {
						const { lastTime, lastMsg, lastObj, lastLogger } = this;
						stream.lastLevel = level;
						stream.lastTime = lastTime;
						stream.lastMsg = lastMsg;
						stream.lastObj = lastObj;
						stream.lastLogger = lastLogger;
					}
					if (!opts.dedupe || dest.level === level) stream.write(data);
				} else break;
			}
		}
		function flushSync() {
			for (const { stream } of this.streams) if (typeof stream.flushSync === "function") stream.flushSync();
		}
		function add(dest) {
			if (!dest) return res;
			const isStream = typeof dest.write === "function" || dest.stream;
			const stream_ = dest.write ? dest : dest.stream;
			if (!isStream) throw Error("stream object needs to implement either StreamEntry or DestinationStream interface");
			const { streams } = this;
			let level;
			if (typeof dest.levelVal === "number") level = dest.levelVal;
			else if (typeof dest.level === "string") level = levels[dest.level];
			else if (typeof dest.level === "number") level = dest.level;
			else level = DEFAULT_INFO_LEVEL;
			const dest_ = {
				stream: stream_,
				level,
				levelVal: void 0,
				id: counter++
			};
			streams.unshift(dest_);
			streams.sort(compareByLevel);
			this.minLevel = streams[0].level;
			return res;
		}
		function end() {
			for (const { stream } of this.streams) {
				if (typeof stream.flushSync === "function") stream.flushSync();
				stream.end();
			}
		}
		function clone(level) {
			const streams = new Array(this.streams.length);
			for (let i = 0; i < streams.length; i++) streams[i] = {
				level,
				stream: this.streams[i].stream
			};
			return {
				write,
				add,
				minLevel: level,
				streams,
				clone,
				flushSync,
				[metadata]: true
			};
		}
	}
	function compareByLevel(a, b) {
		return a.level - b.level;
	}
	module.exports = multistream;
}));
//#endregion
//#region node_modules/pino/pino.js
var require_pino = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var os$1 = __require("os");
	var stdSerializers = require_pino_std_serializers();
	var caller = require_caller();
	var redaction = require_redaction();
	var time = require_time();
	var proto = require_proto();
	var symbols = require_symbols();
	var { configure } = require_safe_stable_stringify();
	var { assertDefaultLevelFound, mappings, genLsCache, levels } = require_levels();
	var { createArgsNormalizer, asChindings, final, buildSafeSonicBoom, buildFormatters, stringify, normalizeDestFileDescriptor, noop } = require_tools();
	var { version } = require_meta();
	var { chindingsSym, redactFmtSym, serializersSym, timeSym, timeSliceIndexSym, streamSym, stringifySym, stringifySafeSym, stringifiersSym, setLevelSym, endSym, formatOptsSym, messageKeySym, nestedKeySym, mixinSym, useOnlyCustomLevelsSym, formattersSym, hooksSym, nestedKeyStrSym, mixinMergeStrategySym } = symbols;
	var { epochTime, nullTime } = time;
	var { pid } = process;
	var hostname = os$1.hostname();
	var defaultErrorSerializer = stdSerializers.err;
	var normalize = createArgsNormalizer({
		level: "info",
		levels,
		messageKey: "msg",
		nestedKey: null,
		enabled: true,
		prettyPrint: false,
		base: {
			pid,
			hostname
		},
		serializers: Object.assign(Object.create(null), { err: defaultErrorSerializer }),
		formatters: Object.assign(Object.create(null), {
			bindings(bindings) {
				return bindings;
			},
			level(label, number) {
				return { level: number };
			}
		}),
		hooks: { logMethod: void 0 },
		timestamp: epochTime,
		name: void 0,
		redact: null,
		customLevels: null,
		useOnlyCustomLevels: false,
		depthLimit: 5,
		edgeLimit: 100
	});
	var serializers = Object.assign(Object.create(null), stdSerializers);
	function pino(...args) {
		const instance = {};
		const { opts, stream } = normalize(instance, caller(), ...args);
		const { redact, crlf, serializers, timestamp, messageKey, nestedKey, base, name, level, customLevels, mixin, mixinMergeStrategy, useOnlyCustomLevels, formatters, hooks, depthLimit, edgeLimit } = opts;
		const stringifySafe = configure({
			maximumDepth: depthLimit,
			maximumBreadth: edgeLimit
		});
		const allFormatters = buildFormatters(formatters.level, formatters.bindings, formatters.log);
		const stringifiers = redact ? redaction(redact, stringify) : {};
		const stringifyFn = stringify.bind({ [stringifySafeSym]: stringifySafe });
		const formatOpts = redact ? { stringify: stringifiers[redactFmtSym] } : { stringify: stringifyFn };
		const end = "}" + (crlf ? "\r\n" : "\n");
		const coreChindings = asChindings.bind(null, {
			[chindingsSym]: "",
			[serializersSym]: serializers,
			[stringifiersSym]: stringifiers,
			[stringifySym]: stringify,
			[stringifySafeSym]: stringifySafe,
			[formattersSym]: allFormatters
		});
		let chindings = "";
		if (base !== null) if (name === void 0) chindings = coreChindings(base);
		else chindings = coreChindings(Object.assign({}, base, { name }));
		const time = timestamp instanceof Function ? timestamp : timestamp ? epochTime : nullTime;
		const timeSliceIndex = time().indexOf(":") + 1;
		if (useOnlyCustomLevels && !customLevels) throw Error("customLevels is required if useOnlyCustomLevels is set true");
		if (mixin && typeof mixin !== "function") throw Error(`Unknown mixin type "${typeof mixin}" - expected "function"`);
		assertDefaultLevelFound(level, customLevels, useOnlyCustomLevels);
		const levels = mappings(customLevels, useOnlyCustomLevels);
		Object.assign(instance, {
			levels,
			[useOnlyCustomLevelsSym]: useOnlyCustomLevels,
			[streamSym]: stream,
			[timeSym]: time,
			[timeSliceIndexSym]: timeSliceIndex,
			[stringifySym]: stringify,
			[stringifySafeSym]: stringifySafe,
			[stringifiersSym]: stringifiers,
			[endSym]: end,
			[formatOptsSym]: formatOpts,
			[messageKeySym]: messageKey,
			[nestedKeySym]: nestedKey,
			[nestedKeyStrSym]: nestedKey ? `,${JSON.stringify(nestedKey)}:{` : "",
			[serializersSym]: serializers,
			[mixinSym]: mixin,
			[mixinMergeStrategySym]: mixinMergeStrategy,
			[chindingsSym]: chindings,
			[formattersSym]: allFormatters,
			[hooksSym]: hooks,
			silent: noop
		});
		Object.setPrototypeOf(instance, proto());
		genLsCache(instance);
		instance[setLevelSym](level);
		return instance;
	}
	module.exports = pino;
	module.exports.destination = (dest = process.stdout.fd) => {
		if (typeof dest === "object") {
			dest.dest = normalizeDestFileDescriptor(dest.dest || process.stdout.fd);
			return buildSafeSonicBoom(dest);
		} else return buildSafeSonicBoom({
			dest: normalizeDestFileDescriptor(dest),
			minLength: 0,
			sync: true
		});
	};
	module.exports.transport = require_transport();
	module.exports.multistream = require_multistream();
	module.exports.final = final;
	module.exports.levels = mappings();
	module.exports.stdSerializers = serializers;
	module.exports.stdTimeFunctions = Object.assign({}, time);
	module.exports.symbols = symbols;
	module.exports.version = version;
	module.exports.default = pino;
	module.exports.pino = pino;
}));
//#endregion
//#region node_modules/@walletconnect/logger/dist/index.es.js
var index_es_exports$2 = /* @__PURE__ */ __exportAll({
	MAX_LOG_SIZE_IN_BYTES_DEFAULT: () => l,
	PINO_CUSTOM_CONTEXT_KEY: () => n$1,
	PINO_LOGGER_DEFAULTS: () => c$1,
	formatChildLoggerContext: () => w$1,
	generateChildLogger: () => E,
	generateClientLogger: () => C$2,
	generatePlatformLogger: () => A$1,
	generateServerLogger: () => I$1,
	getBrowserLoggerContext: () => v$3,
	getDefaultLoggerOptions: () => k$2,
	getLoggerContext: () => y$1,
	pino: () => import_pino$1.default,
	setBrowserLoggerContext: () => b$2
});
function k$2(r) {
	return g$2(i$1({}, r), { level: r?.level || c$1.level });
}
function v$3(r, e = n$1) {
	return r[e] || "";
}
function b$2(r, e, t = n$1) {
	return r[t] = e, r;
}
function y$1(r, e = n$1) {
	let t = "";
	return typeof r.bindings > "u" ? t = v$3(r, e) : t = r.bindings().context || "", t;
}
function w$1(r, e, t = n$1) {
	const o = y$1(r, t);
	return o.trim() ? `${o}/${e}` : e;
}
function E(r, e, t = n$1) {
	const o = w$1(r, e, t);
	return b$2(r.child({ context: o }), o, t);
}
function C$2(r) {
	var e, t;
	const o = new m$1((e = r.opts) == null ? void 0 : e.level, r.maxSizeInBytes);
	return {
		logger: (0, import_pino.default)(g$2(i$1({}, r.opts), {
			level: "trace",
			browser: g$2(i$1({}, (t = r.opts) == null ? void 0 : t.browser), { write: (a) => o.write(a) })
		})),
		chunkLoggerController: o
	};
}
function I$1(r) {
	var e;
	const t = new B((e = r.opts) == null ? void 0 : e.level, r.maxSizeInBytes);
	return {
		logger: (0, import_pino.default)(g$2(i$1({}, r.opts), { level: "trace" }), t),
		chunkLoggerController: t
	};
}
function A$1(r) {
	return typeof r.loggerOverride < "u" && typeof r.loggerOverride != "string" ? {
		logger: r.loggerOverride,
		chunkLoggerController: null
	} : typeof window < "u" ? C$2(r) : I$1(r);
}
var import_pino, import_pino$1, c$1, n$1, l, O$1, d$3, L, m$1, B, x$2, S$1, _, p$1, T$1, z$1, f$3, i$1, g$2;
var init_index_es$8 = __esmMin((() => {
	import_pino = /* @__PURE__ */ __toESM(require_pino());
	import_pino$1 = /* @__PURE__ */ __toESM(require_pino());
	init_esm$3();
	c$1 = { level: "info" }, n$1 = "custom_context", l = 1e3 * 1024;
	O$1 = class {
		constructor(e) {
			this.nodeValue = e, this.sizeInBytes = new TextEncoder().encode(this.nodeValue).length, this.next = null;
		}
		get value() {
			return this.nodeValue;
		}
		get size() {
			return this.sizeInBytes;
		}
	};
	d$3 = class {
		constructor(e) {
			this.head = null, this.tail = null, this.lengthInNodes = 0, this.maxSizeInBytes = e, this.sizeInBytes = 0;
		}
		append(e) {
			const t = new O$1(e);
			if (t.size > this.maxSizeInBytes) throw new Error(`[LinkedList] Value too big to insert into list: ${e} with size ${t.size}`);
			for (; this.size + t.size > this.maxSizeInBytes;) this.shift();
			this.head ? (this.tail && (this.tail.next = t), this.tail = t) : (this.head = t, this.tail = t), this.lengthInNodes++, this.sizeInBytes += t.size;
		}
		shift() {
			if (!this.head) return;
			const e = this.head;
			this.head = this.head.next, this.head || (this.tail = null), this.lengthInNodes--, this.sizeInBytes -= e.size;
		}
		toArray() {
			const e = [];
			let t = this.head;
			for (; t !== null;) e.push(t.value), t = t.next;
			return e;
		}
		get length() {
			return this.lengthInNodes;
		}
		get size() {
			return this.sizeInBytes;
		}
		toOrderedArray() {
			return Array.from(this);
		}
		[Symbol.iterator]() {
			let e = this.head;
			return { next: () => {
				if (!e) return {
					done: !0,
					value: null
				};
				const t = e.value;
				return e = e.next, {
					done: !1,
					value: t
				};
			} };
		}
	};
	L = class {
		constructor(e, t = l) {
			this.level = e ?? "error", this.levelValue = import_pino.levels.values[this.level], this.MAX_LOG_SIZE_IN_BYTES = t, this.logs = new d$3(this.MAX_LOG_SIZE_IN_BYTES);
		}
		forwardToConsole(e, t) {
			t === import_pino.levels.values.error ? console.error(e) : t === import_pino.levels.values.warn ? console.warn(e) : t === import_pino.levels.values.debug ? console.debug(e) : t === import_pino.levels.values.trace ? console.trace(e) : console.log(e);
		}
		appendToLogs(e) {
			this.logs.append(safeJsonStringify({
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				log: e
			}));
			const t = typeof e == "string" ? JSON.parse(e).level : e.level;
			t >= this.levelValue && this.forwardToConsole(e, t);
		}
		getLogs() {
			return this.logs;
		}
		clearLogs() {
			this.logs = new d$3(this.MAX_LOG_SIZE_IN_BYTES);
		}
		getLogArray() {
			return Array.from(this.logs);
		}
		logsToBlob(e) {
			const t = this.getLogArray();
			return t.push(safeJsonStringify({ extraMetadata: e })), new Blob(t, { type: "application/json" });
		}
	};
	m$1 = class {
		constructor(e, t = l) {
			this.baseChunkLogger = new L(e, t);
		}
		write(e) {
			this.baseChunkLogger.appendToLogs(e);
		}
		getLogs() {
			return this.baseChunkLogger.getLogs();
		}
		clearLogs() {
			this.baseChunkLogger.clearLogs();
		}
		getLogArray() {
			return this.baseChunkLogger.getLogArray();
		}
		logsToBlob(e) {
			return this.baseChunkLogger.logsToBlob(e);
		}
		downloadLogsBlobInBrowser(e) {
			const t = URL.createObjectURL(this.logsToBlob(e)), o = document.createElement("a");
			o.href = t, o.download = `walletconnect-logs-${(/* @__PURE__ */ new Date()).toISOString()}.txt`, document.body.appendChild(o), o.click(), document.body.removeChild(o), URL.revokeObjectURL(t);
		}
	};
	B = class {
		constructor(e, t = l) {
			this.baseChunkLogger = new L(e, t);
		}
		write(e) {
			this.baseChunkLogger.appendToLogs(e);
		}
		getLogs() {
			return this.baseChunkLogger.getLogs();
		}
		clearLogs() {
			this.baseChunkLogger.clearLogs();
		}
		getLogArray() {
			return this.baseChunkLogger.getLogArray();
		}
		logsToBlob(e) {
			return this.baseChunkLogger.logsToBlob(e);
		}
	};
	x$2 = Object.defineProperty, S$1 = Object.defineProperties, _ = Object.getOwnPropertyDescriptors, p$1 = Object.getOwnPropertySymbols, T$1 = Object.prototype.hasOwnProperty, z$1 = Object.prototype.propertyIsEnumerable, f$3 = (r, e, t) => e in r ? x$2(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, i$1 = (r, e) => {
		for (var t in e || (e = {})) T$1.call(e, t) && f$3(r, t, e[t]);
		if (p$1) for (var t of p$1(e)) z$1.call(e, t) && f$3(r, t, e[t]);
		return r;
	}, g$2 = (r, e) => S$1(r, _(e));
}));
//#endregion
//#region node_modules/@walletconnect/types/dist/index.es.js
var a, u, c, h$1, p, b$1, v$2, I, y, m, d$2, f$2, P$2, S, M$2, O, R$1, T, k$1, i, J$3, V$1;
var init_index_es$7 = __esmMin((() => {
	init_esm$4();
	a = Object.defineProperty, u = (e, s, r) => s in e ? a(e, s, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: r
	}) : e[s] = r, c = (e, s, r) => u(e, typeof s != "symbol" ? s + "" : s, r);
	h$1 = class extends IEvents {
		constructor(s) {
			super(), this.opts = s, c(this, "protocol", "wc"), c(this, "version", 2);
		}
	};
	p = Object.defineProperty, b$1 = (e, s, r) => s in e ? p(e, s, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: r
	}) : e[s] = r, v$2 = (e, s, r) => b$1(e, typeof s != "symbol" ? s + "" : s, r);
	I = class extends IEvents {
		constructor(s, r) {
			super(), this.core = s, this.logger = r, v$2(this, "records", /* @__PURE__ */ new Map());
		}
	};
	y = class {
		constructor(s, r) {
			this.logger = s, this.core = r;
		}
	};
	m = class extends IEvents {
		constructor(s, r) {
			super(), this.relayer = s, this.logger = r;
		}
	};
	d$2 = class extends IEvents {
		constructor(s) {
			super();
		}
	};
	f$2 = class {
		constructor(s, r, t, q) {
			this.core = s, this.logger = r, this.name = t;
		}
	};
	P$2 = class extends IEvents {
		constructor(s, r) {
			super(), this.relayer = s, this.logger = r;
		}
	};
	S = class extends IEvents {
		constructor(s, r) {
			super(), this.core = s, this.logger = r;
		}
	};
	M$2 = class {
		constructor(s, r, t) {
			this.core = s, this.logger = r, this.store = t;
		}
	};
	O = class {
		constructor(s, r) {
			this.projectId = s, this.logger = r;
		}
	};
	R$1 = class {
		constructor(s, r, t) {
			this.core = s, this.logger = r, this.telemetryEnabled = t;
		}
	};
	T = Object.defineProperty, k$1 = (e, s, r) => s in e ? T(e, s, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: r
	}) : e[s] = r, i = (e, s, r) => k$1(e, typeof s != "symbol" ? s + "" : s, r);
	J$3 = class {
		constructor(s) {
			this.opts = s, i(this, "protocol", "wc"), i(this, "version", 2);
		}
	};
	V$1 = class {
		constructor(s) {
			this.client = s;
		}
	};
}));
//#endregion
//#region node_modules/@walletconnect/relay-auth/dist/index.es.js
function En$2(t) {
	return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function fe$2(t, ...e) {
	if (!En$2(t)) throw new Error("Uint8Array expected");
	if (e.length > 0 && !e.includes(t.length)) throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function De$2(t, e = !0) {
	if (t.destroyed) throw new Error("Hash instance has been destroyed");
	if (e && t.finished) throw new Error("Hash#digest() has already been called");
}
function gn$2(t, e) {
	fe$2(t);
	const n = e.outputLen;
	if (t.length < n) throw new Error("digestInto() expects output buffer of length at least " + n);
}
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function yn$2(t) {
	if (typeof t != "string") throw new Error("utf8ToBytes expected string, got " + typeof t);
	return new Uint8Array(new TextEncoder().encode(t));
}
function de$1(t) {
	return typeof t == "string" && (t = yn$2(t)), fe$2(t), t;
}
function Bn$2(t) {
	const e = (r) => t().update(de$1(r)).digest(), n = t();
	return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function he$2(t = 32) {
	if (it$1 && typeof it$1.getRandomValues == "function") return it$1.getRandomValues(new Uint8Array(t));
	if (it$1 && typeof it$1.randomBytes == "function") return it$1.randomBytes(t);
	throw new Error("crypto.getRandomValues must be defined");
}
function Cn$2(t, e, n, r) {
	if (typeof t.setBigUint64 == "function") return t.setBigUint64(e, n, r);
	const o = BigInt(32), s = BigInt(4294967295), a = Number(n >> o & s), u = Number(n & s), i = r ? 4 : 0, D = r ? 0 : 4;
	t.setUint32(e + i, a, r), t.setUint32(e + D, u, r);
}
function le$2(t, e = !1) {
	return e ? {
		h: Number(t & wt$1),
		l: Number(t >> St$2 & wt$1)
	} : {
		h: Number(t >> St$2 & wt$1) | 0,
		l: Number(t & wt$1) | 0
	};
}
function mn$2(t, e = !1) {
	let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
	for (let o = 0; o < t.length; o++) {
		const { h: s, l: a } = le$2(t[o], e);
		[n[o], r[o]] = [s, a];
	}
	return [n, r];
}
function qn$2(t, e, n, r) {
	const o = (e >>> 0) + (r >>> 0);
	return {
		h: t + n + (o / 2 ** 32 | 0) | 0,
		l: o | 0
	};
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function It$2(t) {
	return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Ut$2(t) {
	if (!It$2(t)) throw new Error("Uint8Array expected");
}
function Tt$2(t, e) {
	if (typeof e != "boolean") throw new Error(t + " boolean expected, got " + e);
}
function Ft$1(t) {
	Ut$2(t);
	let e = "";
	for (let n = 0; n < t.length; n++) e += Xn$2[t[n]];
	return e;
}
function pe$2(t) {
	if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
	return t === "" ? vt$1 : BigInt("0x" + t);
}
function we$2(t) {
	if (t >= K$1._0 && t <= K$1._9) return t - K$1._0;
	if (t >= K$1.A && t <= K$1.F) return t - (K$1.A - 10);
	if (t >= K$1.a && t <= K$1.f) return t - (K$1.a - 10);
}
function Ee$1(t) {
	if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
	const e = t.length, n = e / 2;
	if (e % 2) throw new Error("hex string expected, got unpadded hex of length " + e);
	const r = new Uint8Array(n);
	for (let o = 0, s = 0; o < n; o++, s += 2) {
		const a = we$2(t.charCodeAt(s)), u = we$2(t.charCodeAt(s + 1));
		if (a === void 0 || u === void 0) {
			const i = t[s] + t[s + 1];
			throw new Error("hex string expected, got non-hex character \"" + i + "\" at index " + s);
		}
		r[o] = a * 16 + u;
	}
	return r;
}
function Pn$2(t) {
	return pe$2(Ft$1(t));
}
function Et$1(t) {
	return Ut$2(t), pe$2(Ft$1(Uint8Array.from(t).reverse()));
}
function ge$1(t, e) {
	return Ee$1(t.toString(16).padStart(e * 2, "0"));
}
function Nt$2(t, e) {
	return ge$1(t, e).reverse();
}
function W$2(t, e, n) {
	let r;
	if (typeof e == "string") try {
		r = Ee$1(e);
	} catch (s) {
		throw new Error(t + " must be hex string or Uint8Array, cause: " + s);
	}
	else if (It$2(e)) r = Uint8Array.from(e);
	else throw new Error(t + " must be hex string or Uint8Array");
	const o = r.length;
	if (typeof n == "number" && o !== n) throw new Error(t + " of length " + n + " expected, got " + o);
	return r;
}
function ye$2(...t) {
	let e = 0;
	for (let r = 0; r < t.length; r++) {
		const o = t[r];
		Ut$2(o), e += o.length;
	}
	const n = new Uint8Array(e);
	for (let r = 0, o = 0; r < t.length; r++) {
		const s = t[r];
		n.set(s, o), o += s.length;
	}
	return n;
}
function Qn$2(t, e, n) {
	return Lt$2(t) && Lt$2(e) && Lt$2(n) && e <= t && t < n;
}
function ft(t, e, n, r) {
	if (!Qn$2(e, n, r)) throw new Error("expected valid " + t + ": " + n + " <= n < " + r + ", got " + e);
}
function tr$2(t) {
	let e;
	for (e = 0; t > vt$1; t >>= be$2, e += 1);
	return e;
}
function Ot$2(t, e, n = {}) {
	const r = (o, s, a) => {
		const u = nr$2[s];
		if (typeof u != "function") throw new Error("invalid validator function");
		const i = t[o];
		if (!(a && i === void 0) && !u(i, t)) throw new Error("param " + String(o) + " is invalid. Expected " + s + ", got " + i);
	};
	for (const [o, s] of Object.entries(e)) r(o, s, !1);
	for (const [o, s] of Object.entries(n)) r(o, s, !0);
	return t;
}
function xe$2(t) {
	const e = /* @__PURE__ */ new WeakMap();
	return (n, ...r) => {
		const o = e.get(n);
		if (o !== void 0) return o;
		const s = t(n, ...r);
		return e.set(n, s), s;
	};
}
function H(t, e) {
	const n = t % e;
	return n >= M$1 ? n : e + n;
}
function or$3(t, e, n) {
	if (e < M$1) throw new Error("invalid exponent, negatives unsupported");
	if (n <= M$1) throw new Error("invalid modulus");
	if (n === N$2) return M$1;
	let r = N$2;
	for (; e > M$1;) e & N$2 && (r = r * t % n), t = t * t % n, e >>= N$2;
	return r;
}
function J$2(t, e, n) {
	let r = t;
	for (; e-- > M$1;) r *= r, r %= n;
	return r;
}
function Ae$2(t, e) {
	if (t === M$1) throw new Error("invert: expected non-zero number");
	if (e <= M$1) throw new Error("invert: expected positive modulus, got " + e);
	let n = H(t, e), r = e, o = M$1, s = N$2;
	for (; n !== M$1;) {
		const u = r / n, i = r % n, D = o - s * u;
		r = n, n = i, o = s, s = D;
	}
	if (r !== N$2) throw new Error("invert: does not exist");
	return H(o, e);
}
function sr$2(t) {
	const e = (t - N$2) / nt$1;
	let n, r, o;
	for (n = t - N$2, r = 0; n % nt$1 === M$1; n /= nt$1, r++);
	for (o = nt$1; o < t && or$3(o, e, t) !== t - N$2; o++) if (o > 1e3) throw new Error("Cannot find square root: likely non-prime P");
	if (r === 1) {
		const a = (t + N$2) / Ht$2;
		return function(i, D) {
			const c = i.pow(D, a);
			if (!i.eql(i.sqr(c), D)) throw new Error("Cannot find square root");
			return c;
		};
	}
	const s = (n + N$2) / nt$1;
	return function(u, i) {
		if (u.pow(i, e) === u.neg(u.ONE)) throw new Error("Cannot find square root");
		let D = r, c = u.pow(u.mul(u.ONE, o), n), l = u.pow(i, s), p = u.pow(i, n);
		for (; !u.eql(p, u.ONE);) {
			if (u.eql(p, u.ZERO)) return u.ZERO;
			let w = 1;
			for (let g = u.sqr(p); w < D && !u.eql(g, u.ONE); w++) g = u.sqr(g);
			const h = u.pow(c, N$2 << BigInt(D - w - 1));
			c = u.sqr(h), l = u.mul(l, h), p = u.mul(p, c), D = w;
		}
		return l;
	};
}
function ir$2(t) {
	if (t % Ht$2 === rr$2) {
		const e = (t + N$2) / Ht$2;
		return function(r, o) {
			const s = r.pow(o, e);
			if (!r.eql(r.sqr(s), o)) throw new Error("Cannot find square root");
			return s;
		};
	}
	if (t % Ce$1 === Be$2) {
		const e = (t - Be$2) / Ce$1;
		return function(r, o) {
			const s = r.mul(o, nt$1), a = r.pow(s, e), u = r.mul(o, a), i = r.mul(r.mul(u, nt$1), a), D = r.mul(u, r.sub(i, r.ONE));
			if (!r.eql(r.sqr(D), o)) throw new Error("Cannot find square root");
			return D;
		};
	}
	return sr$2(t);
}
function ar$2(t) {
	return Ot$2(t, cr$2.reduce((r, o) => (r[o] = "function", r), {
		ORDER: "bigint",
		MASK: "bigint",
		BYTES: "isSafeInteger",
		BITS: "isSafeInteger"
	}));
}
function fr$2(t, e, n) {
	if (n < M$1) throw new Error("invalid exponent, negatives unsupported");
	if (n === M$1) return t.ONE;
	if (n === N$2) return e;
	let r = t.ONE, o = e;
	for (; n > M$1;) n & N$2 && (r = t.mul(r, o)), o = t.sqr(o), n >>= N$2;
	return r;
}
function Dr$2(t, e) {
	const n = new Array(e.length), r = e.reduce((s, a, u) => t.is0(a) ? s : (n[u] = s, t.mul(s, a)), t.ONE), o = t.inv(r);
	return e.reduceRight((s, a, u) => t.is0(a) ? s : (n[u] = t.mul(s, n[u]), t.mul(s, a)), o), n;
}
function me$2(t, e) {
	const n = e !== void 0 ? e : t.toString(2).length;
	return {
		nBitLength: n,
		nByteLength: Math.ceil(n / 8)
	};
}
function _e$1(t, e, n = !1, r = {}) {
	if (t <= M$1) throw new Error("invalid field: expected ORDER > 0, got " + t);
	const { nBitLength: o, nByteLength: s } = me$2(t, e);
	if (s > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
	let a;
	const u = Object.freeze({
		ORDER: t,
		isLE: n,
		BITS: o,
		BYTES: s,
		MASK: er$2(o),
		ZERO: M$1,
		ONE: N$2,
		create: (i) => H(i, t),
		isValid: (i) => {
			if (typeof i != "bigint") throw new Error("invalid field element: expected bigint, got " + typeof i);
			return M$1 <= i && i < t;
		},
		is0: (i) => i === M$1,
		isOdd: (i) => (i & N$2) === N$2,
		neg: (i) => H(-i, t),
		eql: (i, D) => i === D,
		sqr: (i) => H(i * i, t),
		add: (i, D) => H(i + D, t),
		sub: (i, D) => H(i - D, t),
		mul: (i, D) => H(i * D, t),
		pow: (i, D) => fr$2(u, i, D),
		div: (i, D) => H(i * Ae$2(D, t), t),
		sqrN: (i) => i * i,
		addN: (i, D) => i + D,
		subN: (i, D) => i - D,
		mulN: (i, D) => i * D,
		inv: (i) => Ae$2(i, t),
		sqrt: r.sqrt || ((i) => (a || (a = ir$2(t)), a(u, i))),
		invertBatch: (i) => Dr$2(u, i),
		cmov: (i, D, c) => c ? D : i,
		toBytes: (i) => n ? Nt$2(i, s) : ge$1(i, s),
		fromBytes: (i) => {
			if (i.length !== s) throw new Error("Field.fromBytes: expected " + s + " bytes, got " + i.length);
			return n ? Et$1(i) : Pn$2(i);
		}
	});
	return Object.freeze(u);
}
function zt$2(t, e) {
	const n = e.negate();
	return t ? n : e;
}
function ve$2(t, e) {
	if (!Number.isSafeInteger(t) || t <= 0 || t > e) throw new Error("invalid window size, expected [1.." + e + "], got W=" + t);
}
function Mt$2(t, e) {
	ve$2(t, e);
	return {
		windows: Math.ceil(e / t) + 1,
		windowSize: 2 ** (t - 1)
	};
}
function dr$2(t, e) {
	if (!Array.isArray(t)) throw new Error("array expected");
	t.forEach((n, r) => {
		if (!(n instanceof e)) throw new Error("invalid point at index " + r);
	});
}
function hr$1(t, e) {
	if (!Array.isArray(t)) throw new Error("array of scalars expected");
	t.forEach((n, r) => {
		if (!e.isValid(n)) throw new Error("invalid scalar at index " + r);
	});
}
function $t$2(t) {
	return Ie$1.get(t) || 1;
}
function lr$2(t, e) {
	return {
		constTimeNegate: zt$2,
		hasPrecomputes(n) {
			return $t$2(n) !== 1;
		},
		unsafeLadder(n, r, o = t.ZERO) {
			let s = n;
			for (; r > Se$2;) r & gt$1 && (o = o.add(s)), s = s.double(), r >>= gt$1;
			return o;
		},
		precomputeWindow(n, r) {
			const { windows: o, windowSize: s } = Mt$2(r, e), a = [];
			let u = n, i = u;
			for (let D = 0; D < o; D++) {
				i = u, a.push(i);
				for (let c = 1; c < s; c++) i = i.add(u), a.push(i);
				u = i.double();
			}
			return a;
		},
		wNAF(n, r, o) {
			const { windows: s, windowSize: a } = Mt$2(n, e);
			let u = t.ZERO, i = t.BASE;
			const D = BigInt(2 ** n - 1), c = 2 ** n, l = BigInt(n);
			for (let p = 0; p < s; p++) {
				const w = p * a;
				let h = Number(o & D);
				o >>= l, h > a && (h -= c, o += gt$1);
				const g = w, S = w + Math.abs(h) - 1, v = p % 2 !== 0, L = h < 0;
				h === 0 ? i = i.add(zt$2(v, r[g])) : u = u.add(zt$2(L, r[S]));
			}
			return {
				p: u,
				f: i
			};
		},
		wNAFUnsafe(n, r, o, s = t.ZERO) {
			const { windows: a, windowSize: u } = Mt$2(n, e), i = BigInt(2 ** n - 1), D = 2 ** n, c = BigInt(n);
			for (let l = 0; l < a; l++) {
				const p = l * u;
				if (o === Se$2) break;
				let w = Number(o & i);
				if (o >>= c, w > u && (w -= D, o += gt$1), w === 0) continue;
				let h = r[p + Math.abs(w) - 1];
				w < 0 && (h = h.negate()), s = s.add(h);
			}
			return s;
		},
		getPrecomputes(n, r, o) {
			let s = qt$2.get(r);
			return s || (s = this.precomputeWindow(r, n), n !== 1 && qt$2.set(r, o(s))), s;
		},
		wNAFCached(n, r, o) {
			const s = $t$2(n);
			return this.wNAF(s, this.getPrecomputes(s, n, o), r);
		},
		wNAFCachedUnsafe(n, r, o, s) {
			const a = $t$2(n);
			return a === 1 ? this.unsafeLadder(n, r, s) : this.wNAFUnsafe(a, this.getPrecomputes(a, n, o), r, s);
		},
		setWindowSize(n, r) {
			ve$2(r, e), Ie$1.set(n, r), qt$2.delete(n);
		}
	};
}
function br$2(t, e, n, r) {
	if (dr$2(n, t), hr$1(r, e), n.length !== r.length) throw new Error("arrays of points and scalars must have equal length");
	const o = t.ZERO, s = tr$2(BigInt(n.length)), a = s > 12 ? s - 3 : s > 4 ? s - 2 : s ? 2 : 1, u = (1 << a) - 1, i = new Array(u + 1).fill(o), D = Math.floor((e.BITS - 1) / a) * a;
	let c = o;
	for (let l = D; l >= 0; l -= a) {
		i.fill(o);
		for (let w = 0; w < r.length; w++) {
			const h = r[w], g = Number(h >> BigInt(l) & BigInt(u));
			i[g] = i[g].add(n[w]);
		}
		let p = o;
		for (let w = i.length - 1, h = o; w > 0; w--) h = h.add(i[w]), p = p.add(h);
		if (c = c.add(p), l !== 0) for (let w = 0; w < a; w++) c = c.double();
	}
	return c;
}
function pr$2(t) {
	return ar$2(t.Fp), Ot$2(t, {
		n: "bigint",
		h: "bigint",
		Gx: "field",
		Gy: "field"
	}, {
		nBitLength: "isSafeInteger",
		nByteLength: "isSafeInteger"
	}), Object.freeze({
		...me$2(t.n, t.nBitLength),
		...t,
		p: t.Fp.ORDER
	});
}
function gr$2(t) {
	const e = pr$2(t);
	return Ot$2(t, {
		hash: "function",
		a: "bigint",
		d: "bigint",
		randomBytes: "function"
	}, {
		adjustScalarBytes: "function",
		domain: "function",
		uvRatio: "function",
		mapToCurve: "function"
	}), Object.freeze({ ...e });
}
function yr$2(t) {
	const e = gr$2(t), { Fp: n, n: r, prehash: o, hash: s, randomBytes: a, nByteLength: u, h: i } = e, D = yt << BigInt(u * 8) - j, c = n.create, l = _e$1(e.n, e.nBitLength), p = e.uvRatio || ((y, f) => {
		try {
			return {
				isValid: !0,
				value: n.sqrt(y * n.inv(f))
			};
		} catch {
			return {
				isValid: !1,
				value: G$2
			};
		}
	}), w = e.adjustScalarBytes || ((y) => y), h = e.domain || ((y, f, b) => {
		if (Tt$2("phflag", b), f.length || b) throw new Error("Contexts/pre-hash are not supported");
		return y;
	});
	function g(y, f) {
		ft("coordinate " + y, f, G$2, D);
	}
	function S(y) {
		if (!(y instanceof d)) throw new Error("ExtendedPoint expected");
	}
	const v = xe$2((y, f) => {
		const { ex: b, ey: E, ez: B } = y, C = y.is0();
		f ??= C ? wr$2 : n.inv(B);
		const A = c(b * f), U = c(E * f), _ = c(B * f);
		if (C) return {
			x: G$2,
			y: j
		};
		if (_ !== j) throw new Error("invZ was invalid");
		return {
			x: A,
			y: U
		};
	}), L = xe$2((y) => {
		const { a: f, d: b } = e;
		if (y.is0()) throw new Error("bad point: ZERO");
		const { ex: E, ey: B, ez: C, et: A } = y, U = c(E * E), _ = c(B * B), T = c(C * C), $ = c(T * T);
		if (c(T * c(c(U * f) + _)) !== c($ + c(b * c(U * _)))) throw new Error("bad point: equation left != right (1)");
		if (c(E * B) !== c(C * A)) throw new Error("bad point: equation left != right (2)");
		return !0;
	});
	class d {
		constructor(f, b, E, B) {
			this.ex = f, this.ey = b, this.ez = E, this.et = B, g("x", f), g("y", b), g("z", E), g("t", B), Object.freeze(this);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		static fromAffine(f) {
			if (f instanceof d) throw new Error("extended point not allowed");
			const { x: b, y: E } = f || {};
			return g("x", b), g("y", E), new d(b, E, j, c(b * E));
		}
		static normalizeZ(f) {
			const b = n.invertBatch(f.map((E) => E.ez));
			return f.map((E, B) => E.toAffine(b[B])).map(d.fromAffine);
		}
		static msm(f, b) {
			return br$2(d, l, f, b);
		}
		_setWindowSize(f) {
			q.setWindowSize(this, f);
		}
		assertValidity() {
			L(this);
		}
		equals(f) {
			S(f);
			const { ex: b, ey: E, ez: B } = this, { ex: C, ey: A, ez: U } = f, _ = c(b * U), T = c(C * B), $ = c(E * U), R = c(A * B);
			return _ === T && $ === R;
		}
		is0() {
			return this.equals(d.ZERO);
		}
		negate() {
			return new d(c(-this.ex), this.ey, this.ez, c(-this.et));
		}
		double() {
			const { a: f } = e, { ex: b, ey: E, ez: B } = this, C = c(b * b), A = c(E * E), U = c(yt * c(B * B)), _ = c(f * C), T = b + E, $ = c(c(T * T) - C - A), R = _ + A, V = R - U, Y = _ - A, Z = c($ * V), X = c(R * Y), et = c($ * Y);
			return new d(Z, X, c(V * R), et);
		}
		add(f) {
			S(f);
			const { a: b, d: E } = e, { ex: B, ey: C, ez: A, et: U } = this, { ex: _, ey: T, ez: $, et: R } = f;
			if (b === BigInt(-1)) {
				const re = c((C - B) * (T + _)), oe = c((C + B) * (T - _)), mt = c(oe - re);
				if (mt === G$2) return this.double();
				const se = c(A * yt * R), ie = c(U * yt * $), ue = ie + se, ce = oe + re, ae = ie - se, Dn = c(ue * mt), dn = c(ce * ae), hn = c(ue * ae);
				return new d(Dn, dn, c(mt * ce), hn);
			}
			const V = c(B * _), Y = c(C * T), Z = c(U * E * R), X = c(A * $), et = c((B + C) * (_ + T) - V - Y), pt = X - Z, ee = X + Z, ne = c(Y - b * V), un = c(et * pt), cn = c(ee * ne), an = c(et * ne);
			return new d(un, cn, c(pt * ee), an);
		}
		subtract(f) {
			return this.add(f.negate());
		}
		wNAF(f) {
			return q.wNAFCached(this, f, d.normalizeZ);
		}
		multiply(f) {
			const b = f;
			ft("scalar", b, j, r);
			const { p: E, f: B } = this.wNAF(b);
			return d.normalizeZ([E, B])[0];
		}
		multiplyUnsafe(f, b = d.ZERO) {
			const E = f;
			return ft("scalar", E, G$2, r), E === G$2 ? F : this.is0() || E === j ? this : q.wNAFCachedUnsafe(this, E, d.normalizeZ, b);
		}
		isSmallOrder() {
			return this.multiplyUnsafe(i).is0();
		}
		isTorsionFree() {
			return q.unsafeLadder(this, r).is0();
		}
		toAffine(f) {
			return v(this, f);
		}
		clearCofactor() {
			const { h: f } = e;
			return f === j ? this : this.multiplyUnsafe(f);
		}
		static fromHex(f, b = !1) {
			const { d: E, a: B } = e, C = n.BYTES;
			f = W$2("pointHex", f, C), Tt$2("zip215", b);
			const A = f.slice(), U = f[C - 1];
			A[C - 1] = U & -129;
			const _ = Et$1(A);
			ft("pointHex.y", _, G$2, b ? D : n.ORDER);
			const $ = c(_ * _);
			let { isValid: Y, value: Z } = p(c($ - j), c(E * $ - B));
			if (!Y) throw new Error("Point.fromHex: invalid y coordinate");
			const X = (Z & j) === j, et = (U & 128) !== 0;
			if (!b && Z === G$2 && et) throw new Error("Point.fromHex: x=0 and x_0=1");
			return et !== X && (Z = c(-Z)), d.fromAffine({
				x: Z,
				y: _
			});
		}
		static fromPrivateKey(f) {
			return O(f).point;
		}
		toRawBytes() {
			const { x: f, y: b } = this.toAffine(), E = Nt$2(b, n.BYTES);
			return E[E.length - 1] |= f & j ? 128 : 0, E;
		}
		toHex() {
			return Ft$1(this.toRawBytes());
		}
	}
	d.BASE = new d(e.Gx, e.Gy, j, c(e.Gx * e.Gy)), d.ZERO = new d(G$2, j, j, G$2);
	const { BASE: m, ZERO: F } = d, q = lr$2(d, u * 8);
	function z(y) {
		return H(y, r);
	}
	function I(y) {
		return z(Et$1(y));
	}
	function O(y) {
		const f = n.BYTES;
		y = W$2("private key", y, f);
		const b = W$2("hashed private key", s(y), 2 * f), E = w(b.slice(0, f)), B = b.slice(f, 2 * f), C = I(E), A = m.multiply(C);
		return {
			head: E,
			prefix: B,
			scalar: C,
			point: A,
			pointBytes: A.toRawBytes()
		};
	}
	function ot(y) {
		return O(y).pointBytes;
	}
	function tt(y = new Uint8Array(), ...f) {
		return I(s(h(ye$2(...f), W$2("context", y), !!o)));
	}
	function st(y, f, b = {}) {
		y = W$2("message", y), o && (y = o(y));
		const { prefix: E, scalar: B, pointBytes: C } = O(f), A = tt(b.context, E, y), U = m.multiply(A).toRawBytes(), T = z(A + tt(b.context, U, C, y) * B);
		ft("signature.s", T, G$2, r);
		return W$2("result", ye$2(U, Nt$2(T, n.BYTES)), n.BYTES * 2);
	}
	const at = Er$2;
	function Ct(y, f, b, E = at) {
		const { context: B, zip215: C } = E, A = n.BYTES;
		y = W$2("signature", y, 2 * A), f = W$2("message", f), b = W$2("publicKey", b, A), C !== void 0 && Tt$2("zip215", C), o && (f = o(f));
		const U = Et$1(y.slice(A, 2 * A));
		let _, T, $;
		try {
			_ = d.fromHex(b, C), T = d.fromHex(y.slice(0, A), C), $ = m.multiplyUnsafe(U);
		} catch {
			return !1;
		}
		if (!C && _.isSmallOrder()) return !1;
		const R = tt(B, T.toRawBytes(), _.toRawBytes(), f);
		return T.add(_.multiplyUnsafe(R)).subtract($).clearCofactor().equals(d.ZERO);
	}
	return m._setWindowSize(8), {
		CURVE: e,
		getPublicKey: ot,
		sign: st,
		verify: Ct,
		ExtendedPoint: d,
		utils: {
			getExtendedPublicKey: O,
			randomPrivateKey: () => a(n.BYTES),
			precompute(y = 8, f = d.BASE) {
				return f._setWindowSize(y), f.multiply(BigInt(3)), f;
			}
		}
	};
}
function Ar$2(t) {
	const e = BigInt(10), n = BigInt(20), r = BigInt(40), o = BigInt(80), s = kt$2, u = t * t % s * t % s, D = J$2(J$2(u, Te$1, s) * u % s, xr$2, s) * t % s, c = J$2(D, Br$2, s) * D % s, l = J$2(c, e, s) * c % s, p = J$2(l, n, s) * l % s, w = J$2(p, r, s) * p % s;
	return {
		pow_p_5_8: J$2(J$2(J$2(J$2(w, o, s) * w % s, o, s) * w % s, e, s) * c % s, Te$1, s) * t % s,
		b2: u
	};
}
function mr$2(t) {
	return t[0] &= 248, t[31] &= 127, t[31] |= 64, t;
}
function _r$2(t, e) {
	const n = kt$2, r = H(e * e * e, n), s = Ar$2(t * H(r * r * e, n)).pow_p_5_8;
	let a = H(t * r * s, n);
	const u = H(e * a * a, n), i = a, D = H(a * Ue$2, n), c = u === t, l = u === H(-t, n), p = u === H(-t * Ue$2, n);
	return c && (a = i), (l || p) && (a = D), ur$2(a, n) && (a = H(-a, n)), {
		isValid: c || l,
		value: a
	};
}
function Xt$2(t) {
	return globalThis.Buffer != null ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : t;
}
function Le$1(t = 0) {
	return globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null ? Xt$2(globalThis.Buffer.allocUnsafe(t)) : new Uint8Array(t);
}
function Oe$2(t, e) {
	e || (e = t.reduce((o, s) => o + s.length, 0));
	const n = Le$1(e);
	let r = 0;
	for (const o of t) n.set(o, r), r += o.length;
	return Xt$2(n);
}
function Ir$2(t, e) {
	if (t.length >= 255) throw new TypeError("Alphabet too long");
	for (var n = new Uint8Array(256), r = 0; r < n.length; r++) n[r] = 255;
	for (var o = 0; o < t.length; o++) {
		var s = t.charAt(o), a = s.charCodeAt(0);
		if (n[a] !== 255) throw new TypeError(s + " is ambiguous");
		n[a] = o;
	}
	var u = t.length, i = t.charAt(0), D = Math.log(u) / Math.log(256), c = Math.log(256) / Math.log(u);
	function l(h) {
		if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
		if (h.length === 0) return "";
		for (var g = 0, S = 0, v = 0, L = h.length; v !== L && h[v] === 0;) v++, g++;
		for (var d = (L - v) * c + 1 >>> 0, m = new Uint8Array(d); v !== L;) {
			for (var F = h[v], q = 0, z = d - 1; (F !== 0 || q < S) && z !== -1; z--, q++) F += 256 * m[z] >>> 0, m[z] = F % u >>> 0, F = F / u >>> 0;
			if (F !== 0) throw new Error("Non-zero carry");
			S = q, v++;
		}
		for (var I = d - S; I !== d && m[I] === 0;) I++;
		for (var O = i.repeat(g); I < d; ++I) O += t.charAt(m[I]);
		return O;
	}
	function p(h) {
		if (typeof h != "string") throw new TypeError("Expected String");
		if (h.length === 0) return new Uint8Array();
		var g = 0;
		if (h[g] !== " ") {
			for (var S = 0, v = 0; h[g] === i;) S++, g++;
			for (var L = (h.length - g) * D + 1 >>> 0, d = new Uint8Array(L); h[g];) {
				var m = n[h.charCodeAt(g)];
				if (m === 255) return;
				for (var F = 0, q = L - 1; (m !== 0 || F < v) && q !== -1; q--, F++) m += u * d[q] >>> 0, d[q] = m % 256 >>> 0, m = m / 256 >>> 0;
				if (m !== 0) throw new Error("Non-zero carry");
				v = F, g++;
			}
			if (h[g] !== " ") {
				for (var z = L - v; z !== L && d[z] === 0;) z++;
				for (var I = new Uint8Array(S + (L - z)), O = S; z !== L;) I[O++] = d[z++];
				return I;
			}
		}
	}
	function w(h) {
		var g = p(h);
		if (g) return g;
		throw new Error(`Non-${e} character`);
	}
	return {
		encode: l,
		decodeUnsafe: p,
		decode: w
	};
}
function xo$2(t) {
	return t.reduce((e, n) => (e += go$2[n], e), "");
}
function Bo$2(t) {
	const e = [];
	for (const n of t) {
		const r = yo$2[n.codePointAt(0)];
		if (r === void 0) throw new Error(`Non-base256emoji character: ${n}`);
		e.push(r);
	}
	return new Uint8Array(e);
}
function $e$1(t, e, n) {
	e = e || [], n = n || 0;
	for (var r = n; t >= vo$2;) e[n++] = t & 255 | qe$2, t /= 128;
	for (; t & So$2;) e[n++] = t & 255 | qe$2, t >>>= 7;
	return e[n] = t | 0, $e$1.bytes = n - r + 1, e;
}
function Pt$2(t, r) {
	var n = 0, r = r || 0, o = 0, s = r, a, u = t.length;
	do {
		if (s >= u) throw Pt$2.bytes = 0, /* @__PURE__ */ new RangeError("Could not decode varint");
		a = t[s++], n += o < 28 ? (a & ke$1) << o : (a & ke$1) * Math.pow(2, o), o += 7;
	} while (a >= Uo$2);
	return Pt$2.bytes = s - r, n;
}
function We$2(t, e, n, r) {
	return {
		name: t,
		prefix: e,
		encoder: {
			name: t,
			prefix: e,
			encode: n
		},
		decoder: { decode: r }
	};
}
function ct$1(t, e = "utf8") {
	const n = Pe$2[e];
	if (!n) throw new Error(`Unsupported encoding "${e}"`);
	return (e === "utf8" || e === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? globalThis.Buffer.from(t.buffer, t.byteOffset, t.byteLength).toString("utf8") : n.encoder.encode(t).substring(1);
}
function rt$2(t, e = "utf8") {
	const n = Pe$2[e];
	if (!n) throw new Error(`Unsupported encoding "${e}"`);
	return (e === "utf8" || e === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? Xt$2(globalThis.Buffer.from(t, "utf-8")) : n.decoder.decode(`${n.prefix}${t}`);
}
function lt$1(t) {
	return safeJsonParse(ct$1(rt$2(t, Dt$1), Gt$2));
}
function bt$1(t) {
	return ct$1(rt$2(safeJsonStringify(t), Gt$2), Dt$1);
}
function Qe$2(t) {
	return [
		"did",
		"key",
		"z" + ct$1(Oe$2([rt$2("K36", dt$1), t]), dt$1)
	].join(":");
}
function en$2(t) {
	return ct$1(t, Dt$1);
}
function nn$1(t) {
	return rt$2(t, Dt$1);
}
function rn$2(t) {
	return rt$2([bt$1(t.header), bt$1(t.payload)].join("."), xt$2);
}
function on$2(t) {
	return [
		bt$1(t.header),
		bt$1(t.payload),
		en$2(t.signature)
	].join(".");
}
function sn$2(t) {
	const e = t.split(".");
	return {
		header: lt$1(e[0]),
		payload: lt$1(e[1]),
		signature: nn$1(e[2]),
		data: rt$2(e.slice(0, 2).join("."), xt$2)
	};
}
function Po$2(t = he$2(32)) {
	const e = Rt$2.getPublicKey(t);
	return {
		secretKey: Oe$2([t, e]),
		publicKey: e
	};
}
async function Qo$2(t, e, n, r, o = (0, import_cjs$6.fromMiliseconds)(Date.now())) {
	const s = {
		alg: jt$2,
		typ: "JWT"
	}, i = {
		iss: Qe$2(r.publicKey),
		sub: t,
		aud: e,
		iat: o,
		exp: o + n
	}, D = rn$2({
		header: s,
		payload: i
	});
	return on$2({
		header: s,
		payload: i,
		signature: Rt$2.sign(D, r.secretKey.slice(0, 32))
	});
}
var import_cjs$6, it$1, _t$1, xn$2, An$2, wt$1, St$2, _n$2, Sn$1, vn$1, In$2, Un$2, Tn$2, Fn$2, Nn$2, Ln$2, On$2, Hn$2, zn$2, Mn$2, $n$2, kn$2, Rn$2, jn$2, Zn$2, Gn$2, x$1, Vn$2, Yn$2, P$1, Q$2, Jn$2, Kn$2, vt$1, be$2, Wn$2, Xn$2, K$1, Lt$2, er$2, nr$2, M$1, N$2, nt$1, rr$2, Ht$2, Be$2, Ce$1, ur$2, cr$2, Se$2, gt$1, qt$2, Ie$1, G$2, j, yt, wr$2, Er$2, kt$2, Ue$2, xr$2, Te$1, Br$2, Cr$2, Sr$2, vr$2, Rt$2, jt$2, Dt$1, Gt$2, xt$2, dt$1, Tr$2, He$2, Fr$2, Nr$2, Lr$2, Or$2, Hr$2, ze$1, zr$2, Bt$2, ht$1, Mr$2, qr$2, k, $r$2, kr$2, Rr$2, jr$2, Zr$2, Gr$2, Vr$2, Yr$2, Jr$2, Kr$2, Wr$2, Xr$2, Pr$2, Qr$2, to$2, eo$2, no$2, ro$2, oo$2, so$2, io$2, uo$2, co$2, ao$2, fo$2, Do$2, ho$2, lo$2, bo$2, po$2, wo$2, Eo$2, Me$2, go$2, yo$2, Co$2, Ao$2, mo$2, qe$2, So$2, vo$2, Io$2, Uo$2, ke$1, To$2, Fo$2, No$2, Lo$2, Oo$2, Ho$2, zo$2, Mo$2, qo$2, $o$2, Re$2, je$1, Ze$2, Qt$2, Ro$2, Ge$2, jo$2, Ve$2, Zo$2, Go$2, Vo$2, Ye$2, Yo$2, Je$2, Jo$2, Wo$2, Ke$2, Xe$2, te$1, Pe$2;
var init_index_es$6 = __esmMin((() => {
	import_cjs$6 = require_cjs$3();
	init_esm$3();
	it$1 = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
	_t$1 = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength);
	xn$2 = class {
		clone() {
			return this._cloneInto();
		}
	};
	An$2 = class extends xn$2 {
		constructor(e, n, r, o) {
			super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = _t$1(this.buffer);
		}
		update(e) {
			De$2(this);
			const { view: n, buffer: r, blockLen: o } = this;
			e = de$1(e);
			const s = e.length;
			for (let a = 0; a < s;) {
				const u = Math.min(o - this.pos, s - a);
				if (u === o) {
					const i = _t$1(e);
					for (; o <= s - a; a += o) this.process(i, a);
					continue;
				}
				r.set(e.subarray(a, a + u), this.pos), this.pos += u, a += u, this.pos === o && (this.process(n, 0), this.pos = 0);
			}
			return this.length += e.length, this.roundClean(), this;
		}
		digestInto(e) {
			De$2(this), gn$2(e, this), this.finished = !0;
			const { buffer: n, view: r, blockLen: o, isLE: s } = this;
			let { pos: a } = this;
			n[a++] = 128, this.buffer.subarray(a).fill(0), this.padOffset > o - a && (this.process(r, 0), a = 0);
			for (let l = a; l < o; l++) n[l] = 0;
			Cn$2(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
			const u = _t$1(e), i = this.outputLen;
			if (i % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
			const D = i / 4, c = this.get();
			if (D > c.length) throw new Error("_sha2: outputLen bigger than state");
			for (let l = 0; l < D; l++) u.setUint32(4 * l, c[l], s);
		}
		digest() {
			const { buffer: e, outputLen: n } = this;
			this.digestInto(e);
			const r = e.slice(0, n);
			return this.destroy(), r;
		}
		_cloneInto(e) {
			e || (e = new this.constructor()), e.set(...this.get());
			const { blockLen: n, buffer: r, length: o, finished: s, destroyed: a, pos: u } = this;
			return e.length = o, e.pos = u, e.finished = s, e.destroyed = a, o % n && e.buffer.set(r), e;
		}
	};
	wt$1 = BigInt(2 ** 32 - 1), St$2 = BigInt(32);
	_n$2 = (t, e) => BigInt(t >>> 0) << St$2 | BigInt(e >>> 0), Sn$1 = (t, e, n) => t >>> n, vn$1 = (t, e, n) => t << 32 - n | e >>> n, In$2 = (t, e, n) => t >>> n | e << 32 - n, Un$2 = (t, e, n) => t << 32 - n | e >>> n, Tn$2 = (t, e, n) => t << 64 - n | e >>> n - 32, Fn$2 = (t, e, n) => t >>> n - 32 | e << 64 - n, Nn$2 = (t, e) => e, Ln$2 = (t, e) => t, On$2 = (t, e, n) => t << n | e >>> 32 - n, Hn$2 = (t, e, n) => e << n | t >>> 32 - n, zn$2 = (t, e, n) => e << n - 32 | t >>> 64 - n, Mn$2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
	$n$2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), kn$2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Rn$2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), jn$2 = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, Zn$2 = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), Gn$2 = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, x$1 = {
		fromBig: le$2,
		split: mn$2,
		toBig: _n$2,
		shrSH: Sn$1,
		shrSL: vn$1,
		rotrSH: In$2,
		rotrSL: Un$2,
		rotrBH: Tn$2,
		rotrBL: Fn$2,
		rotr32H: Nn$2,
		rotr32L: Ln$2,
		rotlSH: On$2,
		rotlSL: Hn$2,
		rotlBH: zn$2,
		rotlBL: Mn$2,
		add: qn$2,
		add3L: $n$2,
		add3H: kn$2,
		add4L: Rn$2,
		add4H: jn$2,
		add5H: Gn$2,
		add5L: Zn$2
	}, [Vn$2, Yn$2] = (() => x$1.split([
		"0x428a2f98d728ae22",
		"0x7137449123ef65cd",
		"0xb5c0fbcfec4d3b2f",
		"0xe9b5dba58189dbbc",
		"0x3956c25bf348b538",
		"0x59f111f1b605d019",
		"0x923f82a4af194f9b",
		"0xab1c5ed5da6d8118",
		"0xd807aa98a3030242",
		"0x12835b0145706fbe",
		"0x243185be4ee4b28c",
		"0x550c7dc3d5ffb4e2",
		"0x72be5d74f27b896f",
		"0x80deb1fe3b1696b1",
		"0x9bdc06a725c71235",
		"0xc19bf174cf692694",
		"0xe49b69c19ef14ad2",
		"0xefbe4786384f25e3",
		"0x0fc19dc68b8cd5b5",
		"0x240ca1cc77ac9c65",
		"0x2de92c6f592b0275",
		"0x4a7484aa6ea6e483",
		"0x5cb0a9dcbd41fbd4",
		"0x76f988da831153b5",
		"0x983e5152ee66dfab",
		"0xa831c66d2db43210",
		"0xb00327c898fb213f",
		"0xbf597fc7beef0ee4",
		"0xc6e00bf33da88fc2",
		"0xd5a79147930aa725",
		"0x06ca6351e003826f",
		"0x142929670a0e6e70",
		"0x27b70a8546d22ffc",
		"0x2e1b21385c26c926",
		"0x4d2c6dfc5ac42aed",
		"0x53380d139d95b3df",
		"0x650a73548baf63de",
		"0x766a0abb3c77b2a8",
		"0x81c2c92e47edaee6",
		"0x92722c851482353b",
		"0xa2bfe8a14cf10364",
		"0xa81a664bbc423001",
		"0xc24b8b70d0f89791",
		"0xc76c51a30654be30",
		"0xd192e819d6ef5218",
		"0xd69906245565a910",
		"0xf40e35855771202a",
		"0x106aa07032bbd1b8",
		"0x19a4c116b8d2d0c8",
		"0x1e376c085141ab53",
		"0x2748774cdf8eeb99",
		"0x34b0bcb5e19b48a8",
		"0x391c0cb3c5c95a63",
		"0x4ed8aa4ae3418acb",
		"0x5b9cca4f7763e373",
		"0x682e6ff3d6b2b8a3",
		"0x748f82ee5defb2fc",
		"0x78a5636f43172f60",
		"0x84c87814a1f0ab72",
		"0x8cc702081a6439ec",
		"0x90befffa23631e28",
		"0xa4506cebde82bde9",
		"0xbef9a3f7b2c67915",
		"0xc67178f2e372532b",
		"0xca273eceea26619c",
		"0xd186b8c721c0c207",
		"0xeada7dd6cde0eb1e",
		"0xf57d4f7fee6ed178",
		"0x06f067aa72176fba",
		"0x0a637dc5a2c898a6",
		"0x113f9804bef90dae",
		"0x1b710b35131c471b",
		"0x28db77f523047d84",
		"0x32caab7b40c72493",
		"0x3c9ebe0a15c9bebc",
		"0x431d67c49c100d4c",
		"0x4cc5d4becb3e42b6",
		"0x597f299cfc657e2a",
		"0x5fcb6fab3ad6faec",
		"0x6c44198c4a475817"
	].map((t) => BigInt(t))))(), P$1 = new Uint32Array(80), Q$2 = new Uint32Array(80);
	Jn$2 = class extends An$2 {
		constructor() {
			super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
		}
		get() {
			const { Ah: e, Al: n, Bh: r, Bl: o, Ch: s, Cl: a, Dh: u, Dl: i, Eh: D, El: c, Fh: l, Fl: p, Gh: w, Gl: h, Hh: g, Hl: S } = this;
			return [
				e,
				n,
				r,
				o,
				s,
				a,
				u,
				i,
				D,
				c,
				l,
				p,
				w,
				h,
				g,
				S
			];
		}
		set(e, n, r, o, s, a, u, i, D, c, l, p, w, h, g, S) {
			this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = a | 0, this.Dh = u | 0, this.Dl = i | 0, this.Eh = D | 0, this.El = c | 0, this.Fh = l | 0, this.Fl = p | 0, this.Gh = w | 0, this.Gl = h | 0, this.Hh = g | 0, this.Hl = S | 0;
		}
		process(e, n) {
			for (let d = 0; d < 16; d++, n += 4) P$1[d] = e.getUint32(n), Q$2[d] = e.getUint32(n += 4);
			for (let d = 16; d < 80; d++) {
				const m = P$1[d - 15] | 0, F = Q$2[d - 15] | 0, q = x$1.rotrSH(m, F, 1) ^ x$1.rotrSH(m, F, 8) ^ x$1.shrSH(m, F, 7), z = x$1.rotrSL(m, F, 1) ^ x$1.rotrSL(m, F, 8) ^ x$1.shrSL(m, F, 7), I = P$1[d - 2] | 0, O = Q$2[d - 2] | 0, ot = x$1.rotrSH(I, O, 19) ^ x$1.rotrBH(I, O, 61) ^ x$1.shrSH(I, O, 6), tt = x$1.rotrSL(I, O, 19) ^ x$1.rotrBL(I, O, 61) ^ x$1.shrSL(I, O, 6), st = x$1.add4L(z, tt, Q$2[d - 7], Q$2[d - 16]);
				P$1[d] = x$1.add4H(st, q, ot, P$1[d - 7], P$1[d - 16]) | 0, Q$2[d] = st | 0;
			}
			let { Ah: r, Al: o, Bh: s, Bl: a, Ch: u, Cl: i, Dh: D, Dl: c, Eh: l, El: p, Fh: w, Fl: h, Gh: g, Gl: S, Hh: v, Hl: L } = this;
			for (let d = 0; d < 80; d++) {
				const m = x$1.rotrSH(l, p, 14) ^ x$1.rotrSH(l, p, 18) ^ x$1.rotrBH(l, p, 41), F = x$1.rotrSL(l, p, 14) ^ x$1.rotrSL(l, p, 18) ^ x$1.rotrBL(l, p, 41), q = l & w ^ ~l & g, z = p & h ^ ~p & S, I = x$1.add5L(L, F, z, Yn$2[d], Q$2[d]), O = x$1.add5H(I, v, m, q, Vn$2[d], P$1[d]), ot = I | 0, tt = x$1.rotrSH(r, o, 28) ^ x$1.rotrBH(r, o, 34) ^ x$1.rotrBH(r, o, 39), st = x$1.rotrSL(r, o, 28) ^ x$1.rotrBL(r, o, 34) ^ x$1.rotrBL(r, o, 39), at = r & s ^ r & u ^ s & u, Ct = o & a ^ o & i ^ a & i;
				v = g | 0, L = S | 0, g = w | 0, S = h | 0, w = l | 0, h = p | 0, {h: l, l: p} = x$1.add(D | 0, c | 0, O | 0, ot | 0), D = u | 0, c = i | 0, u = s | 0, i = a | 0, s = r | 0, a = o | 0;
				const At = x$1.add3L(ot, st, Ct);
				r = x$1.add3H(At, O, tt, at), o = At | 0;
			}
			({h: r, l: o} = x$1.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), {h: s, l: a} = x$1.add(this.Bh | 0, this.Bl | 0, s | 0, a | 0), {h: u, l: i} = x$1.add(this.Ch | 0, this.Cl | 0, u | 0, i | 0), {h: D, l: c} = x$1.add(this.Dh | 0, this.Dl | 0, D | 0, c | 0), {h: l, l: p} = x$1.add(this.Eh | 0, this.El | 0, l | 0, p | 0), {h: w, l: h} = x$1.add(this.Fh | 0, this.Fl | 0, w | 0, h | 0), {h: g, l: S} = x$1.add(this.Gh | 0, this.Gl | 0, g | 0, S | 0), {h: v, l: L} = x$1.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, o, s, a, u, i, D, c, l, p, w, h, g, S, v, L);
		}
		roundClean() {
			P$1.fill(0), Q$2.fill(0);
		}
		destroy() {
			this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		}
	};
	Kn$2 = Bn$2(() => new Jn$2());
	vt$1 = BigInt(0), be$2 = BigInt(1), Wn$2 = BigInt(2);
	Xn$2 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
	K$1 = {
		_0: 48,
		_9: 57,
		A: 65,
		F: 70,
		a: 97,
		f: 102
	};
	Lt$2 = (t) => typeof t == "bigint" && vt$1 <= t;
	er$2 = (t) => (Wn$2 << BigInt(t - 1)) - be$2, nr$2 = {
		bigint: (t) => typeof t == "bigint",
		function: (t) => typeof t == "function",
		boolean: (t) => typeof t == "boolean",
		string: (t) => typeof t == "string",
		stringOrUint8Array: (t) => typeof t == "string" || It$2(t),
		isSafeInteger: (t) => Number.isSafeInteger(t),
		array: (t) => Array.isArray(t),
		field: (t, e) => e.Fp.isValid(t),
		hash: (t) => typeof t == "function" && Number.isSafeInteger(t.outputLen)
	};
	M$1 = BigInt(0), N$2 = BigInt(1), nt$1 = BigInt(2), rr$2 = BigInt(3), Ht$2 = BigInt(4), Be$2 = BigInt(5), Ce$1 = BigInt(8);
	ur$2 = (t, e) => (H(t, e) & N$2) === N$2, cr$2 = [
		"create",
		"isValid",
		"is0",
		"neg",
		"inv",
		"sqrt",
		"sqr",
		"eql",
		"add",
		"sub",
		"mul",
		"pow",
		"div",
		"addN",
		"subN",
		"mulN",
		"sqrN"
	];
	Se$2 = BigInt(0), gt$1 = BigInt(1);
	qt$2 = /* @__PURE__ */ new WeakMap(), Ie$1 = /* @__PURE__ */ new WeakMap();
	G$2 = BigInt(0), j = BigInt(1), yt = BigInt(2), wr$2 = BigInt(8), Er$2 = { zip215: !0 };
	kt$2 = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949"), Ue$2 = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
	xr$2 = BigInt(1), Te$1 = BigInt(2);
	Br$2 = BigInt(5), Cr$2 = BigInt(8);
	Sr$2 = (() => _e$1(kt$2, void 0, !0))(), vr$2 = (() => ({
		a: BigInt(-1),
		d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
		Fp: Sr$2,
		n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
		h: Cr$2,
		Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
		Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
		hash: Kn$2,
		randomBytes: he$2,
		adjustScalarBytes: mr$2,
		uvRatio: _r$2
	}))(), Rt$2 = (() => yr$2(vr$2))(), jt$2 = "EdDSA", Dt$1 = "base64url", Gt$2 = "utf8", xt$2 = "utf8", dt$1 = "base58btc";
	Tr$2 = Ir$2;
	He$2 = (t) => {
		if (t instanceof Uint8Array && t.constructor.name === "Uint8Array") return t;
		if (t instanceof ArrayBuffer) return new Uint8Array(t);
		if (ArrayBuffer.isView(t)) return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
		throw new Error("Unknown type, must be binary type");
	}, Fr$2 = (t) => new TextEncoder().encode(t), Nr$2 = (t) => new TextDecoder().decode(t);
	Lr$2 = class {
		constructor(e, n, r) {
			this.name = e, this.prefix = n, this.baseEncode = r;
		}
		encode(e) {
			if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
			throw Error("Unknown type, must be binary type");
		}
	};
	Or$2 = class {
		constructor(e, n, r) {
			if (this.name = e, this.prefix = n, n.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
			this.prefixCodePoint = n.codePointAt(0), this.baseDecode = r;
		}
		decode(e) {
			if (typeof e == "string") {
				if (e.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
				return this.baseDecode(e.slice(this.prefix.length));
			} else throw Error("Can only multibase decode strings");
		}
		or(e) {
			return ze$1(this, e);
		}
	};
	Hr$2 = class {
		constructor(e) {
			this.decoders = e;
		}
		or(e) {
			return ze$1(this, e);
		}
		decode(e) {
			const n = e[0], r = this.decoders[n];
			if (r) return r.decode(e);
			throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
		}
	};
	ze$1 = (t, e) => new Hr$2({
		...t.decoders || { [t.prefix]: t },
		...e.decoders || { [e.prefix]: e }
	});
	zr$2 = class {
		constructor(e, n, r, o) {
			this.name = e, this.prefix = n, this.baseEncode = r, this.baseDecode = o, this.encoder = new Lr$2(e, n, r), this.decoder = new Or$2(e, n, o);
		}
		encode(e) {
			return this.encoder.encode(e);
		}
		decode(e) {
			return this.decoder.decode(e);
		}
	};
	Bt$2 = ({ name: t, prefix: e, encode: n, decode: r }) => new zr$2(t, e, n, r), ht$1 = ({ prefix: t, name: e, alphabet: n }) => {
		const { encode: r, decode: o } = Tr$2(n, e);
		return Bt$2({
			prefix: t,
			name: e,
			encode: r,
			decode: (s) => He$2(o(s))
		});
	}, Mr$2 = (t, e, n, r) => {
		const o = {};
		for (let c = 0; c < e.length; ++c) o[e[c]] = c;
		let s = t.length;
		for (; t[s - 1] === "=";) --s;
		const a = new Uint8Array(s * n / 8 | 0);
		let u = 0, i = 0, D = 0;
		for (let c = 0; c < s; ++c) {
			const l = o[t[c]];
			if (l === void 0) throw new SyntaxError(`Non-${r} character`);
			i = i << n | l, u += n, u >= 8 && (u -= 8, a[D++] = 255 & i >> u);
		}
		if (u >= n || 255 & i << 8 - u) throw new SyntaxError("Unexpected end of data");
		return a;
	}, qr$2 = (t, e, n) => {
		const r = e[e.length - 1] === "=", o = (1 << n) - 1;
		let s = "", a = 0, u = 0;
		for (let i = 0; i < t.length; ++i) for (u = u << 8 | t[i], a += 8; a > n;) a -= n, s += e[o & u >> a];
		if (a && (s += e[o & u << n - a]), r) for (; s.length * n & 7;) s += "=";
		return s;
	}, k = ({ name: t, prefix: e, bitsPerChar: n, alphabet: r }) => Bt$2({
		prefix: e,
		name: t,
		encode(o) {
			return qr$2(o, r, n);
		},
		decode(o) {
			return Mr$2(o, r, n, t);
		}
	}), $r$2 = Bt$2({
		prefix: "\0",
		name: "identity",
		encode: (t) => Nr$2(t),
		decode: (t) => Fr$2(t)
	});
	kr$2 = Object.freeze({
		__proto__: null,
		identity: $r$2
	});
	Rr$2 = k({
		prefix: "0",
		name: "base2",
		alphabet: "01",
		bitsPerChar: 1
	});
	jr$2 = Object.freeze({
		__proto__: null,
		base2: Rr$2
	});
	Zr$2 = k({
		prefix: "7",
		name: "base8",
		alphabet: "01234567",
		bitsPerChar: 3
	});
	Gr$2 = Object.freeze({
		__proto__: null,
		base8: Zr$2
	});
	Vr$2 = ht$1({
		prefix: "9",
		name: "base10",
		alphabet: "0123456789"
	});
	Yr$2 = Object.freeze({
		__proto__: null,
		base10: Vr$2
	});
	Jr$2 = k({
		prefix: "f",
		name: "base16",
		alphabet: "0123456789abcdef",
		bitsPerChar: 4
	}), Kr$2 = k({
		prefix: "F",
		name: "base16upper",
		alphabet: "0123456789ABCDEF",
		bitsPerChar: 4
	});
	Wr$2 = Object.freeze({
		__proto__: null,
		base16: Jr$2,
		base16upper: Kr$2
	});
	Xr$2 = k({
		prefix: "b",
		name: "base32",
		alphabet: "abcdefghijklmnopqrstuvwxyz234567",
		bitsPerChar: 5
	}), Pr$2 = k({
		prefix: "B",
		name: "base32upper",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
		bitsPerChar: 5
	}), Qr$2 = k({
		prefix: "c",
		name: "base32pad",
		alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
		bitsPerChar: 5
	}), to$2 = k({
		prefix: "C",
		name: "base32padupper",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
		bitsPerChar: 5
	}), eo$2 = k({
		prefix: "v",
		name: "base32hex",
		alphabet: "0123456789abcdefghijklmnopqrstuv",
		bitsPerChar: 5
	}), no$2 = k({
		prefix: "V",
		name: "base32hexupper",
		alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
		bitsPerChar: 5
	}), ro$2 = k({
		prefix: "t",
		name: "base32hexpad",
		alphabet: "0123456789abcdefghijklmnopqrstuv=",
		bitsPerChar: 5
	}), oo$2 = k({
		prefix: "T",
		name: "base32hexpadupper",
		alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
		bitsPerChar: 5
	}), so$2 = k({
		prefix: "h",
		name: "base32z",
		alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
		bitsPerChar: 5
	});
	io$2 = Object.freeze({
		__proto__: null,
		base32: Xr$2,
		base32upper: Pr$2,
		base32pad: Qr$2,
		base32padupper: to$2,
		base32hex: eo$2,
		base32hexupper: no$2,
		base32hexpad: ro$2,
		base32hexpadupper: oo$2,
		base32z: so$2
	});
	uo$2 = ht$1({
		prefix: "k",
		name: "base36",
		alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
	}), co$2 = ht$1({
		prefix: "K",
		name: "base36upper",
		alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	});
	ao$2 = Object.freeze({
		__proto__: null,
		base36: uo$2,
		base36upper: co$2
	});
	fo$2 = ht$1({
		name: "base58btc",
		prefix: "z",
		alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
	}), Do$2 = ht$1({
		name: "base58flickr",
		prefix: "Z",
		alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
	});
	ho$2 = Object.freeze({
		__proto__: null,
		base58btc: fo$2,
		base58flickr: Do$2
	});
	lo$2 = k({
		prefix: "m",
		name: "base64",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
		bitsPerChar: 6
	}), bo$2 = k({
		prefix: "M",
		name: "base64pad",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		bitsPerChar: 6
	}), po$2 = k({
		prefix: "u",
		name: "base64url",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
		bitsPerChar: 6
	}), wo$2 = k({
		prefix: "U",
		name: "base64urlpad",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
		bitsPerChar: 6
	});
	Eo$2 = Object.freeze({
		__proto__: null,
		base64: lo$2,
		base64pad: bo$2,
		base64url: po$2,
		base64urlpad: wo$2
	});
	Me$2 = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), go$2 = Me$2.reduce((t, e, n) => (t[n] = e, t), []), yo$2 = Me$2.reduce((t, e, n) => (t[e.codePointAt(0)] = n, t), []);
	Co$2 = Bt$2({
		prefix: "🚀",
		name: "base256emoji",
		encode: xo$2,
		decode: Bo$2
	});
	Ao$2 = Object.freeze({
		__proto__: null,
		base256emoji: Co$2
	}), mo$2 = $e$1, qe$2 = 128, So$2 = -128, vo$2 = Math.pow(2, 31);
	Io$2 = Pt$2, Uo$2 = 128, ke$1 = 127;
	To$2 = Math.pow(2, 7), Fo$2 = Math.pow(2, 14), No$2 = Math.pow(2, 21), Lo$2 = Math.pow(2, 28), Oo$2 = Math.pow(2, 35), Ho$2 = Math.pow(2, 42), zo$2 = Math.pow(2, 49), Mo$2 = Math.pow(2, 56), qo$2 = Math.pow(2, 63), $o$2 = function(t) {
		return t < To$2 ? 1 : t < Fo$2 ? 2 : t < No$2 ? 3 : t < Lo$2 ? 4 : t < Oo$2 ? 5 : t < Ho$2 ? 6 : t < zo$2 ? 7 : t < Mo$2 ? 8 : t < qo$2 ? 9 : 10;
	}, Re$2 = {
		encode: mo$2,
		decode: Io$2,
		encodingLength: $o$2
	};
	je$1 = (t, e, n = 0) => (Re$2.encode(t, e, n), e), Ze$2 = (t) => Re$2.encodingLength(t), Qt$2 = (t, e) => {
		const n = e.byteLength, r = Ze$2(t), o = r + Ze$2(n), s = new Uint8Array(o + n);
		return je$1(t, s, 0), je$1(n, s, r), s.set(e, o), new Ro$2(t, n, e, s);
	};
	Ro$2 = class {
		constructor(e, n, r, o) {
			this.code = e, this.size = n, this.digest = r, this.bytes = o;
		}
	};
	Ge$2 = ({ name: t, code: e, encode: n }) => new jo$2(t, e, n);
	jo$2 = class {
		constructor(e, n, r) {
			this.name = e, this.code = n, this.encode = r;
		}
		digest(e) {
			if (e instanceof Uint8Array) {
				const n = this.encode(e);
				return n instanceof Uint8Array ? Qt$2(this.code, n) : n.then((r) => Qt$2(this.code, r));
			} else throw Error("Unknown type, must be binary type");
		}
	};
	Ve$2 = (t) => async (e) => new Uint8Array(await crypto.subtle.digest(t, e)), Zo$2 = Ge$2({
		name: "sha2-256",
		code: 18,
		encode: Ve$2("SHA-256")
	}), Go$2 = Ge$2({
		name: "sha2-512",
		code: 19,
		encode: Ve$2("SHA-512")
	});
	Vo$2 = Object.freeze({
		__proto__: null,
		sha256: Zo$2,
		sha512: Go$2
	});
	Ye$2 = 0, Yo$2 = "identity", Je$2 = He$2, Jo$2 = (t) => Qt$2(Ye$2, Je$2(t));
	Wo$2 = Object.freeze({
		__proto__: null,
		identity: {
			code: Ye$2,
			name: Yo$2,
			encode: Je$2,
			digest: Jo$2
		}
	});
	new TextEncoder(), new TextDecoder();
	Ke$2 = {
		...kr$2,
		...jr$2,
		...Gr$2,
		...Yr$2,
		...Wr$2,
		...io$2,
		...ao$2,
		...ho$2,
		...Eo$2,
		...Ao$2
	};
	({
		...Vo$2,
		...Wo$2
	});
	Xe$2 = We$2("utf8", "u", (t) => "u" + new TextDecoder("utf8").decode(t), (t) => new TextEncoder().encode(t.substring(1))), te$1 = We$2("ascii", "a", (t) => {
		let e = "a";
		for (let n = 0; n < t.length; n++) e += String.fromCharCode(t[n]);
		return e;
	}, (t) => {
		t = t.substring(1);
		const e = Le$1(t.length);
		for (let n = 0; n < t.length; n++) e[n] = t.charCodeAt(n);
		return e;
	}), Pe$2 = {
		utf8: Xe$2,
		"utf-8": Xe$2,
		hex: Ke$2.base16,
		latin1: te$1,
		ascii: te$1,
		binary: te$1,
		...Ke$2
	};
}));
//#endregion
//#region node_modules/detect-browser/es/index.js
function detect(userAgent) {
	if (!!userAgent) return parseUserAgent(userAgent);
	if (typeof document === "undefined" && typeof navigator !== "undefined" && navigator.product === "ReactNative") return new ReactNativeInfo();
	if (typeof navigator !== "undefined") return parseUserAgent(navigator.userAgent);
	return getNodeVersion();
}
function matchUserAgent(ua) {
	return ua !== "" && userAgentRules.reduce(function(matched, _a) {
		var browser = _a[0], regex = _a[1];
		if (matched) return matched;
		var uaMatch = regex.exec(ua);
		return !!uaMatch && [browser, uaMatch];
	}, false);
}
function parseUserAgent(ua) {
	var matchedRule = matchUserAgent(ua);
	if (!matchedRule) return null;
	var name = matchedRule[0], match = matchedRule[1];
	if (name === "searchbot") return new BotInfo();
	var versionParts = match[1] && match[1].split(".").join("_").split("_").slice(0, 3);
	if (versionParts) {
		if (versionParts.length < REQUIRED_VERSION_PARTS) versionParts = __spreadArray(__spreadArray([], versionParts, true), createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length), true);
	} else versionParts = [];
	var version = versionParts.join(".");
	var os = detectOS(ua);
	var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);
	if (searchBotMatch && searchBotMatch[1]) return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
	return new BrowserInfo(name, version, os);
}
function detectOS(ua) {
	for (var ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
		var _a = operatingSystemRules[ii], os = _a[0];
		if (_a[1].exec(ua)) return os;
	}
	return null;
}
function getNodeVersion() {
	return typeof process !== "undefined" && process.version ? new NodeInfo(process.version.slice(1)) : null;
}
function createVersionParts(count) {
	var output = [];
	for (var ii = 0; ii < count; ii++) output.push("0");
	return output;
}
var __spreadArray, BrowserInfo, NodeInfo, SearchBotDeviceInfo, BotInfo, ReactNativeInfo, SEARCHBOX_UA_REGEX, SEARCHBOT_OS_REGEX, REQUIRED_VERSION_PARTS, userAgentRules, operatingSystemRules;
var init_es = __esmMin((() => {
	__spreadArray = function(to, from, pack) {
		if (pack || arguments.length === 2) {
			for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
				if (!ar) ar = Array.prototype.slice.call(from, 0, i);
				ar[i] = from[i];
			}
		}
		return to.concat(ar || Array.prototype.slice.call(from));
	};
	BrowserInfo = function() {
		function BrowserInfo(name, version, os) {
			this.name = name;
			this.version = version;
			this.os = os;
			this.type = "browser";
		}
		return BrowserInfo;
	}();
	NodeInfo = function() {
		function NodeInfo(version) {
			this.version = version;
			this.type = "node";
			this.name = "node";
			this.os = process.platform;
		}
		return NodeInfo;
	}();
	SearchBotDeviceInfo = function() {
		function SearchBotDeviceInfo(name, version, os, bot) {
			this.name = name;
			this.version = version;
			this.os = os;
			this.bot = bot;
			this.type = "bot-device";
		}
		return SearchBotDeviceInfo;
	}();
	BotInfo = function() {
		function BotInfo() {
			this.type = "bot";
			this.bot = true;
			this.name = "bot";
			this.version = null;
			this.os = null;
		}
		return BotInfo;
	}();
	ReactNativeInfo = function() {
		function ReactNativeInfo() {
			this.type = "react-native";
			this.name = "react-native";
			this.version = null;
			this.os = null;
		}
		return ReactNativeInfo;
	}();
	SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
	SEARCHBOT_OS_REGEX = /(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
	REQUIRED_VERSION_PARTS = 3;
	userAgentRules = [
		["aol", /AOLShield\/([0-9\._]+)/],
		["edge", /Edge\/([0-9\._]+)/],
		["edge-ios", /EdgiOS\/([0-9\._]+)/],
		["yandexbrowser", /YaBrowser\/([0-9\._]+)/],
		["kakaotalk", /KAKAOTALK\s([0-9\.]+)/],
		["samsung", /SamsungBrowser\/([0-9\.]+)/],
		["silk", /\bSilk\/([0-9._-]+)\b/],
		["miui", /MiuiBrowser\/([0-9\.]+)$/],
		["beaker", /BeakerBrowser\/([0-9\.]+)/],
		["edge-chromium", /EdgA?\/([0-9\.]+)/],
		["chromium-webview", /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
		["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
		["phantomjs", /PhantomJS\/([0-9\.]+)(:?\s|$)/],
		["crios", /CriOS\/([0-9\.]+)(:?\s|$)/],
		["firefox", /Firefox\/([0-9\.]+)(?:\s|$)/],
		["fxios", /FxiOS\/([0-9\.]+)/],
		["opera-mini", /Opera Mini.*Version\/([0-9\.]+)/],
		["opera", /Opera\/([0-9\.]+)(?:\s|$)/],
		["opera", /OPR\/([0-9\.]+)(:?\s|$)/],
		["pie", /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
		["pie", /^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],
		["netfront", /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
		["ie", /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
		["ie", /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
		["ie", /MSIE\s(7\.0)/],
		["bb10", /BB10;\sTouch.*Version\/([0-9\.]+)/],
		["android", /Android\s([0-9\.]+)/],
		["ios", /Version\/([0-9\._]+).*Mobile.*Safari.*/],
		["safari", /Version\/([0-9\._]+).*Safari/],
		["facebook", /FB[AS]V\/([0-9\.]+)/],
		["instagram", /Instagram\s([0-9\.]+)/],
		["ios-webview", /AppleWebKit\/([0-9\.]+).*Mobile/],
		["ios-webview", /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
		["curl", /^curl\/([0-9\.]+)$/],
		["searchbot", SEARCHBOX_UA_REGEX]
	];
	operatingSystemRules = [
		["iOS", /iP(hone|od|ad)/],
		["Android OS", /Android/],
		["BlackBerry OS", /BlackBerry|BB10/],
		["Windows Mobile", /IEMobile/],
		["Amazon OS", /Kindle/],
		["Windows 3.11", /Win16/],
		["Windows 95", /(Windows 95)|(Win95)|(Windows_95)/],
		["Windows 98", /(Windows 98)|(Win98)/],
		["Windows 2000", /(Windows NT 5.0)|(Windows 2000)/],
		["Windows XP", /(Windows NT 5.1)|(Windows XP)/],
		["Windows Server 2003", /(Windows NT 5.2)/],
		["Windows Vista", /(Windows NT 6.0)/],
		["Windows 7", /(Windows NT 6.1)/],
		["Windows 8", /(Windows NT 6.2)/],
		["Windows 8.1", /(Windows NT 6.3)/],
		["Windows 10", /(Windows NT 10.0)/],
		["Windows ME", /Windows ME/],
		["Windows CE", /Windows CE|WinCE|Microsoft Pocket Internet Explorer/],
		["Open BSD", /OpenBSD/],
		["Sun OS", /SunOS/],
		["Chrome OS", /CrOS/],
		["Linux", /(Linux)|(X11)/],
		["Mac OS", /(Mac_PowerPC)|(Macintosh)/],
		["QNX", /QNX/],
		["BeOS", /BeOS/],
		["OS/2", /OS\/2/]
	];
}));
//#endregion
//#region node_modules/@walletconnect/window-getters/dist/cjs/index.js
var require_cjs$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getLocalStorage = exports.getLocalStorageOrThrow = exports.getCrypto = exports.getCryptoOrThrow = exports.getLocation = exports.getLocationOrThrow = exports.getNavigator = exports.getNavigatorOrThrow = exports.getDocument = exports.getDocumentOrThrow = exports.getFromWindowOrThrow = exports.getFromWindow = void 0;
	function getFromWindow(name) {
		let res = void 0;
		if (typeof window !== "undefined" && typeof window[name] !== "undefined") res = window[name];
		return res;
	}
	exports.getFromWindow = getFromWindow;
	function getFromWindowOrThrow(name) {
		const res = getFromWindow(name);
		if (!res) throw new Error(`${name} is not defined in Window`);
		return res;
	}
	exports.getFromWindowOrThrow = getFromWindowOrThrow;
	function getDocumentOrThrow() {
		return getFromWindowOrThrow("document");
	}
	exports.getDocumentOrThrow = getDocumentOrThrow;
	function getDocument() {
		return getFromWindow("document");
	}
	exports.getDocument = getDocument;
	function getNavigatorOrThrow() {
		return getFromWindowOrThrow("navigator");
	}
	exports.getNavigatorOrThrow = getNavigatorOrThrow;
	function getNavigator() {
		return getFromWindow("navigator");
	}
	exports.getNavigator = getNavigator;
	function getLocationOrThrow() {
		return getFromWindowOrThrow("location");
	}
	exports.getLocationOrThrow = getLocationOrThrow;
	function getLocation() {
		return getFromWindow("location");
	}
	exports.getLocation = getLocation;
	function getCryptoOrThrow() {
		return getFromWindowOrThrow("crypto");
	}
	exports.getCryptoOrThrow = getCryptoOrThrow;
	function getCrypto() {
		return getFromWindow("crypto");
	}
	exports.getCrypto = getCrypto;
	function getLocalStorageOrThrow() {
		return getFromWindowOrThrow("localStorage");
	}
	exports.getLocalStorageOrThrow = getLocalStorageOrThrow;
	function getLocalStorage() {
		return getFromWindow("localStorage");
	}
	exports.getLocalStorage = getLocalStorage;
}));
//#endregion
//#region node_modules/@walletconnect/window-metadata/dist/cjs/index.js
var require_cjs$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getWindowMetadata = void 0;
	var window_getters_1 = require_cjs$2();
	function getWindowMetadata() {
		let doc;
		let loc;
		try {
			doc = window_getters_1.getDocumentOrThrow();
			loc = window_getters_1.getLocationOrThrow();
		} catch (e) {
			return null;
		}
		function getIcons() {
			const links = doc.getElementsByTagName("link");
			const icons = [];
			for (let i = 0; i < links.length; i++) {
				const link = links[i];
				const rel = link.getAttribute("rel");
				if (rel) {
					if (rel.toLowerCase().indexOf("icon") > -1) {
						const href = link.getAttribute("href");
						if (href) if (href.toLowerCase().indexOf("https:") === -1 && href.toLowerCase().indexOf("http:") === -1 && href.indexOf("//") !== 0) {
							let absoluteHref = loc.protocol + "//" + loc.host;
							if (href.indexOf("/") === 0) absoluteHref += href;
							else {
								const path = loc.pathname.split("/");
								path.pop();
								const finalPath = path.join("/");
								absoluteHref += finalPath + "/" + href;
							}
							icons.push(absoluteHref);
						} else if (href.indexOf("//") === 0) {
							const absoluteUrl = loc.protocol + href;
							icons.push(absoluteUrl);
						} else icons.push(href);
					}
				}
			}
			return icons;
		}
		function getWindowMetadataOfAny(...args) {
			const metaTags = doc.getElementsByTagName("meta");
			for (let i = 0; i < metaTags.length; i++) {
				const tag = metaTags[i];
				const attributes = [
					"itemprop",
					"property",
					"name"
				].map((target) => tag.getAttribute(target)).filter((attr) => {
					if (attr) return args.includes(attr);
					return false;
				});
				if (attributes.length && attributes) {
					const content = tag.getAttribute("content");
					if (content) return content;
				}
			}
			return "";
		}
		function getName() {
			let name = getWindowMetadataOfAny("name", "og:site_name", "og:title", "twitter:title");
			if (!name) name = doc.title;
			return name;
		}
		function getDescription() {
			return getWindowMetadataOfAny("description", "og:description", "twitter:description", "keywords");
		}
		const name = getName();
		return {
			description: getDescription(),
			url: loc.origin,
			icons: getIcons(),
			name
		};
	}
	exports.getWindowMetadata = getWindowMetadata;
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/utils/data/isHex.js
function isHex(value, { strict = true } = {}) {
	if (!value) return false;
	if (typeof value !== "string") return false;
	return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
var init_isHex = __esmMin((() => {}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/utils/data/size.js
/**
* @description Retrieves the size of the value (in bytes).
*
* @param value The value (hex or byte array) to retrieve the size of.
* @returns The size of the value (in bytes).
*/
function size(value) {
	if (isHex(value, { strict: false })) return Math.ceil((value.length - 2) / 2);
	return value.length;
}
var init_size = __esmMin((() => {
	init_isHex();
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/errors/version.js
var version;
var init_version = __esmMin((() => {
	version = "2.31.0";
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/errors/base.js
function walk(err, fn) {
	if (fn?.(err)) return err;
	if (err && typeof err === "object" && "cause" in err && err.cause !== void 0) return walk(err.cause, fn);
	return fn ? null : err;
}
var errorConfig, BaseError;
var init_base$1 = __esmMin((() => {
	init_version();
	errorConfig = {
		getDocsUrl: ({ docsBaseUrl, docsPath = "", docsSlug }) => docsPath ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
		version: `viem@${version}`
	};
	BaseError = class BaseError extends Error {
		constructor(shortMessage, args = {}) {
			const details = (() => {
				if (args.cause instanceof BaseError) return args.cause.details;
				if (args.cause?.message) return args.cause.message;
				return args.details;
			})();
			const docsPath = (() => {
				if (args.cause instanceof BaseError) return args.cause.docsPath || args.docsPath;
				return args.docsPath;
			})();
			const docsUrl = errorConfig.getDocsUrl?.({
				...args,
				docsPath
			});
			const message = [
				shortMessage || "An error occurred.",
				"",
				...args.metaMessages ? [...args.metaMessages, ""] : [],
				...docsUrl ? [`Docs: ${docsUrl}`] : [],
				...details ? [`Details: ${details}`] : [],
				...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
			].join("\n");
			super(message, args.cause ? { cause: args.cause } : void 0);
			Object.defineProperty(this, "details", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "docsPath", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "metaMessages", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "shortMessage", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "version", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "BaseError"
			});
			this.details = details;
			this.docsPath = docsPath;
			this.metaMessages = args.metaMessages;
			this.name = args.name ?? this.name;
			this.shortMessage = shortMessage;
			this.version = version;
		}
		walk(fn) {
			return walk(this, fn);
		}
	};
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/errors/data.js
var SizeExceedsPaddingSizeError;
var init_data = __esmMin((() => {
	init_base$1();
	SizeExceedsPaddingSizeError = class extends BaseError {
		constructor({ size, targetSize, type }) {
			super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
		}
	};
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/utils/data/pad.js
function pad(hexOrBytes, { dir, size = 32 } = {}) {
	if (typeof hexOrBytes === "string") return padHex(hexOrBytes, {
		dir,
		size
	});
	return padBytes(hexOrBytes, {
		dir,
		size
	});
}
function padHex(hex_, { dir, size = 32 } = {}) {
	if (size === null) return hex_;
	const hex = hex_.replace("0x", "");
	if (hex.length > size * 2) throw new SizeExceedsPaddingSizeError({
		size: Math.ceil(hex.length / 2),
		targetSize: size,
		type: "hex"
	});
	return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size * 2, "0")}`;
}
function padBytes(bytes, { dir, size = 32 } = {}) {
	if (size === null) return bytes;
	if (bytes.length > size) throw new SizeExceedsPaddingSizeError({
		size: bytes.length,
		targetSize: size,
		type: "bytes"
	});
	const paddedBytes = new Uint8Array(size);
	for (let i = 0; i < size; i++) {
		const padEnd = dir === "right";
		paddedBytes[padEnd ? i : size - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
	}
	return paddedBytes;
}
var init_pad = __esmMin((() => {
	init_data();
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/errors/encoding.js
var IntegerOutOfRangeError, SizeOverflowError;
var init_encoding = __esmMin((() => {
	init_base$1();
	IntegerOutOfRangeError = class extends BaseError {
		constructor({ max, min, signed, size, value }) {
			super(`Number "${value}" is not in safe ${size ? `${size * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
		}
	};
	SizeOverflowError = class extends BaseError {
		constructor({ givenSize, maxSize }) {
			super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
		}
	};
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/utils/encoding/fromHex.js
function assertSize(hexOrBytes, { size: size$1 }) {
	if (size(hexOrBytes) > size$1) throw new SizeOverflowError({
		givenSize: size(hexOrBytes),
		maxSize: size$1
	});
}
/**
* Decodes a hex value into a bigint.
*
* - Docs: https://viem.sh/docs/utilities/fromHex#hextobigint
*
* @param hex Hex value to decode.
* @param opts Options.
* @returns BigInt value.
*
* @example
* import { hexToBigInt } from 'viem'
* const data = hexToBigInt('0x1a4', { signed: true })
* // 420n
*
* @example
* import { hexToBigInt } from 'viem'
* const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
* // 420n
*/
function hexToBigInt(hex, opts = {}) {
	const { signed } = opts;
	if (opts.size) assertSize(hex, { size: opts.size });
	const value = BigInt(hex);
	if (!signed) return value;
	const size = (hex.length - 2) / 2;
	if (value <= (1n << BigInt(size) * 8n - 1n) - 1n) return value;
	return value - BigInt(`0x${"f".padStart(size * 2, "f")}`) - 1n;
}
/**
* Decodes a hex string into a number.
*
* - Docs: https://viem.sh/docs/utilities/fromHex#hextonumber
*
* @param hex Hex value to decode.
* @param opts Options.
* @returns Number value.
*
* @example
* import { hexToNumber } from 'viem'
* const data = hexToNumber('0x1a4')
* // 420
*
* @example
* import { hexToNumber } from 'viem'
* const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
* // 420
*/
function hexToNumber(hex, opts = {}) {
	return Number(hexToBigInt(hex, opts));
}
var init_fromHex = __esmMin((() => {
	init_encoding();
	init_size();
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/utils/encoding/toHex.js
/**
* Encodes a string, number, bigint, or ByteArray into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex
* - Example: https://viem.sh/docs/utilities/toHex#usage
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { toHex } from 'viem'
* const data = toHex('Hello world')
* // '0x48656c6c6f20776f726c6421'
*
* @example
* import { toHex } from 'viem'
* const data = toHex(420)
* // '0x1a4'
*
* @example
* import { toHex } from 'viem'
* const data = toHex('Hello world', { size: 32 })
* // '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
*/
function toHex(value, opts = {}) {
	if (typeof value === "number" || typeof value === "bigint") return numberToHex(value, opts);
	if (typeof value === "string") return stringToHex(value, opts);
	if (typeof value === "boolean") return boolToHex(value, opts);
	return bytesToHex(value, opts);
}
/**
* Encodes a boolean into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#booltohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { boolToHex } from 'viem'
* const data = boolToHex(true)
* // '0x1'
*
* @example
* import { boolToHex } from 'viem'
* const data = boolToHex(false)
* // '0x0'
*
* @example
* import { boolToHex } from 'viem'
* const data = boolToHex(true, { size: 32 })
* // '0x0000000000000000000000000000000000000000000000000000000000000001'
*/
function boolToHex(value, opts = {}) {
	const hex = `0x${Number(value)}`;
	if (typeof opts.size === "number") {
		assertSize(hex, { size: opts.size });
		return pad(hex, { size: opts.size });
	}
	return hex;
}
/**
* Encodes a bytes array into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#bytestohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { bytesToHex } from 'viem'
* const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
* // '0x48656c6c6f20576f726c6421'
*
* @example
* import { bytesToHex } from 'viem'
* const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
* // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
*/
function bytesToHex(value, opts = {}) {
	let string = "";
	for (let i = 0; i < value.length; i++) string += hexes[value[i]];
	const hex = `0x${string}`;
	if (typeof opts.size === "number") {
		assertSize(hex, { size: opts.size });
		return pad(hex, {
			dir: "right",
			size: opts.size
		});
	}
	return hex;
}
/**
* Encodes a number or bigint into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#numbertohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { numberToHex } from 'viem'
* const data = numberToHex(420)
* // '0x1a4'
*
* @example
* import { numberToHex } from 'viem'
* const data = numberToHex(420, { size: 32 })
* // '0x00000000000000000000000000000000000000000000000000000000000001a4'
*/
function numberToHex(value_, opts = {}) {
	const { signed, size } = opts;
	const value = BigInt(value_);
	let maxValue;
	if (size) if (signed) maxValue = (1n << BigInt(size) * 8n - 1n) - 1n;
	else maxValue = 2n ** (BigInt(size) * 8n) - 1n;
	else if (typeof value_ === "number") maxValue = BigInt(Number.MAX_SAFE_INTEGER);
	const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
	if (maxValue && value > maxValue || value < minValue) {
		const suffix = typeof value_ === "bigint" ? "n" : "";
		throw new IntegerOutOfRangeError({
			max: maxValue ? `${maxValue}${suffix}` : void 0,
			min: `${minValue}${suffix}`,
			signed,
			size,
			value: `${value_}${suffix}`
		});
	}
	const hex = `0x${(signed && value < 0 ? (1n << BigInt(size * 8)) + BigInt(value) : value).toString(16)}`;
	if (size) return pad(hex, { size });
	return hex;
}
/**
* Encodes a UTF-8 string into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#stringtohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { stringToHex } from 'viem'
* const data = stringToHex('Hello World!')
* // '0x48656c6c6f20576f726c6421'
*
* @example
* import { stringToHex } from 'viem'
* const data = stringToHex('Hello World!', { size: 32 })
* // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
*/
function stringToHex(value_, opts = {}) {
	return bytesToHex(encoder$1.encode(value_), opts);
}
var hexes, encoder$1;
var init_toHex = __esmMin((() => {
	init_encoding();
	init_pad();
	init_fromHex();
	hexes = /*#__PURE__*/ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
	encoder$1 = /*#__PURE__*/ new TextEncoder();
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/utils/encoding/toBytes.js
/**
* Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes
* - Example: https://viem.sh/docs/utilities/toBytes#usage
*
* @param value Value to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { toBytes } from 'viem'
* const data = toBytes('Hello world')
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
*
* @example
* import { toBytes } from 'viem'
* const data = toBytes(420)
* // Uint8Array([1, 164])
*
* @example
* import { toBytes } from 'viem'
* const data = toBytes(420, { size: 4 })
* // Uint8Array([0, 0, 1, 164])
*/
function toBytes(value, opts = {}) {
	if (typeof value === "number" || typeof value === "bigint") return numberToBytes(value, opts);
	if (typeof value === "boolean") return boolToBytes(value, opts);
	if (isHex(value)) return hexToBytes(value, opts);
	return stringToBytes(value, opts);
}
/**
* Encodes a boolean into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#booltobytes
*
* @param value Boolean value to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { boolToBytes } from 'viem'
* const data = boolToBytes(true)
* // Uint8Array([1])
*
* @example
* import { boolToBytes } from 'viem'
* const data = boolToBytes(true, { size: 32 })
* // Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
*/
function boolToBytes(value, opts = {}) {
	const bytes = new Uint8Array(1);
	bytes[0] = Number(value);
	if (typeof opts.size === "number") {
		assertSize(bytes, { size: opts.size });
		return pad(bytes, { size: opts.size });
	}
	return bytes;
}
function charCodeToBase16(char) {
	if (char >= charCodeMap.zero && char <= charCodeMap.nine) return char - charCodeMap.zero;
	if (char >= charCodeMap.A && char <= charCodeMap.F) return char - (charCodeMap.A - 10);
	if (char >= charCodeMap.a && char <= charCodeMap.f) return char - (charCodeMap.a - 10);
}
/**
* Encodes a hex string into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#hextobytes
*
* @param hex Hex string to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { hexToBytes } from 'viem'
* const data = hexToBytes('0x48656c6c6f20776f726c6421')
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
*
* @example
* import { hexToBytes } from 'viem'
* const data = hexToBytes('0x48656c6c6f20776f726c6421', { size: 32 })
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
*/
function hexToBytes(hex_, opts = {}) {
	let hex = hex_;
	if (opts.size) {
		assertSize(hex, { size: opts.size });
		hex = pad(hex, {
			dir: "right",
			size: opts.size
		});
	}
	let hexString = hex.slice(2);
	if (hexString.length % 2) hexString = `0${hexString}`;
	const length = hexString.length / 2;
	const bytes = new Uint8Array(length);
	for (let index = 0, j = 0; index < length; index++) {
		const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
		const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
		if (nibbleLeft === void 0 || nibbleRight === void 0) throw new BaseError(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
		bytes[index] = nibbleLeft * 16 + nibbleRight;
	}
	return bytes;
}
/**
* Encodes a number into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#numbertobytes
*
* @param value Number to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { numberToBytes } from 'viem'
* const data = numberToBytes(420)
* // Uint8Array([1, 164])
*
* @example
* import { numberToBytes } from 'viem'
* const data = numberToBytes(420, { size: 4 })
* // Uint8Array([0, 0, 1, 164])
*/
function numberToBytes(value, opts) {
	return hexToBytes(numberToHex(value, opts));
}
/**
* Encodes a UTF-8 string into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#stringtobytes
*
* @param value String to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { stringToBytes } from 'viem'
* const data = stringToBytes('Hello world!')
* // Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33])
*
* @example
* import { stringToBytes } from 'viem'
* const data = stringToBytes('Hello world!', { size: 32 })
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
*/
function stringToBytes(value, opts = {}) {
	const bytes = encoder.encode(value);
	if (typeof opts.size === "number") {
		assertSize(bytes, { size: opts.size });
		return pad(bytes, {
			dir: "right",
			size: opts.size
		});
	}
	return bytes;
}
var encoder, charCodeMap;
var init_toBytes = __esmMin((() => {
	init_base$1();
	init_isHex();
	init_pad();
	init_fromHex();
	init_toHex();
	encoder = /*#__PURE__*/ new TextEncoder();
	charCodeMap = {
		zero: 48,
		nine: 57,
		A: 65,
		F: 70,
		a: 97,
		f: 102
	};
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/utils/hash/keccak256.js
function keccak256(value, to_) {
	const to = to_ || "hex";
	const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes(value) : value);
	if (to === "bytes") return bytes;
	return toHex(bytes);
}
var init_keccak256 = __esmMin((() => {
	init_sha3();
	init_isHex();
	init_toBytes();
	init_toHex();
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/utils/lru.js
var LruMap;
var init_lru = __esmMin((() => {
	LruMap = class extends Map {
		constructor(size) {
			super();
			Object.defineProperty(this, "maxSize", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			this.maxSize = size;
		}
		get(key) {
			const value = super.get(key);
			if (super.has(key) && value !== void 0) {
				this.delete(key);
				super.set(key, value);
			}
			return value;
		}
		set(key, value) {
			super.set(key, value);
			if (this.maxSize && this.size > this.maxSize) {
				const firstKey = this.keys().next().value;
				if (firstKey) this.delete(firstKey);
			}
			return this;
		}
	};
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/utils/address/getAddress.js
function checksumAddress(address_, chainId) {
	if (checksumAddressCache.has(`${address_}.${chainId}`)) return checksumAddressCache.get(`${address_}.${chainId}`);
	const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
	const hash = keccak256(stringToBytes(hexAddress), "bytes");
	const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
	for (let i = 0; i < 40; i += 2) {
		if (hash[i >> 1] >> 4 >= 8 && address[i]) address[i] = address[i].toUpperCase();
		if ((hash[i >> 1] & 15) >= 8 && address[i + 1]) address[i + 1] = address[i + 1].toUpperCase();
	}
	const result = `0x${address.join("")}`;
	checksumAddressCache.set(`${address_}.${chainId}`, result);
	return result;
}
var checksumAddressCache;
var init_getAddress = __esmMin((() => {
	init_toBytes();
	init_keccak256();
	init_lru();
	checksumAddressCache = /*#__PURE__*/ new LruMap(8192);
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/accounts/utils/publicKeyToAddress.js
/**
* @description Converts an ECDSA public key to an address.
*
* @param publicKey The public key to convert.
*
* @returns The address.
*/
function publicKeyToAddress(publicKey) {
	return checksumAddress(`0x${keccak256(`0x${publicKey.substring(4)}`).substring(26)}`);
}
var init_publicKeyToAddress = __esmMin((() => {
	init_getAddress();
	init_keccak256();
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/utils/signature/recoverPublicKey.js
async function recoverPublicKey({ hash, signature }) {
	const hashHex = isHex(hash) ? hash : toHex(hash);
	const { secp256k1 } = await import("../_44.mjs");
	return `0x${(() => {
		if (typeof signature === "object" && "r" in signature && "s" in signature) {
			const { r, s, v, yParity } = signature;
			const recoveryBit = toRecoveryBit(Number(yParity ?? v));
			return new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit);
		}
		const signatureHex = isHex(signature) ? signature : toHex(signature);
		if (size(signatureHex) !== 65) throw new Error("invalid signature length");
		const recoveryBit = toRecoveryBit(hexToNumber(`0x${signatureHex.slice(130)}`));
		return secp256k1.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
	})().recoverPublicKey(hashHex.substring(2)).toHex(false)}`;
}
function toRecoveryBit(yParityOrV) {
	if (yParityOrV === 0 || yParityOrV === 1) return yParityOrV;
	if (yParityOrV === 27) return 0;
	if (yParityOrV === 28) return 1;
	throw new Error("Invalid yParityOrV value");
}
var init_recoverPublicKey = __esmMin((() => {
	init_isHex();
	init_size();
	init_fromHex();
	init_toHex();
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/utils/signature/recoverAddress.js
async function recoverAddress({ hash, signature }) {
	return publicKeyToAddress(await recoverPublicKey({
		hash,
		signature
	}));
}
var init_recoverAddress = __esmMin((() => {
	init_publicKeyToAddress();
	init_recoverPublicKey();
}));
//#endregion
//#region node_modules/@walletconnect/utils/node_modules/viem/_esm/index.js
var init__esm = __esmMin((() => {
	init_exports();
	init_size();
	init_base$1();
	init_toBytes();
	init_keccak256();
	init_encoding();
	init_lru();
	init_getAddress();
	init_pad();
	init_data();
	init_isHex();
	init_toHex();
	init_fromHex();
	init_recoverAddress();
	init_publicKeyToAddress();
	init_recoverPublicKey();
}));
//#endregion
//#region node_modules/base-x/src/esm/index.js
function base$1(ALPHABET) {
	if (ALPHABET.length >= 255) throw new TypeError("Alphabet too long");
	const BASE_MAP = new Uint8Array(256);
	for (let j = 0; j < BASE_MAP.length; j++) BASE_MAP[j] = 255;
	for (let i = 0; i < ALPHABET.length; i++) {
		const x = ALPHABET.charAt(i);
		const xc = x.charCodeAt(0);
		if (BASE_MAP[xc] !== 255) throw new TypeError(x + " is ambiguous");
		BASE_MAP[xc] = i;
	}
	const BASE = ALPHABET.length;
	const LEADER = ALPHABET.charAt(0);
	const FACTOR = Math.log(BASE) / Math.log(256);
	const iFACTOR = Math.log(256) / Math.log(BASE);
	function encode(source) {
		if (source instanceof Uint8Array) {} else if (ArrayBuffer.isView(source)) source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
		else if (Array.isArray(source)) source = Uint8Array.from(source);
		if (!(source instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
		if (source.length === 0) return "";
		let zeroes = 0;
		let length = 0;
		let pbegin = 0;
		const pend = source.length;
		while (pbegin !== pend && source[pbegin] === 0) {
			pbegin++;
			zeroes++;
		}
		const size = (pend - pbegin) * iFACTOR + 1 >>> 0;
		const b58 = new Uint8Array(size);
		while (pbegin !== pend) {
			let carry = source[pbegin];
			let i = 0;
			for (let it1 = size - 1; (carry !== 0 || i < length) && it1 !== -1; it1--, i++) {
				carry += 256 * b58[it1] >>> 0;
				b58[it1] = carry % BASE >>> 0;
				carry = carry / BASE >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i;
			pbegin++;
		}
		let it2 = size - length;
		while (it2 !== size && b58[it2] === 0) it2++;
		let str = LEADER.repeat(zeroes);
		for (; it2 < size; ++it2) str += ALPHABET.charAt(b58[it2]);
		return str;
	}
	function decodeUnsafe(source) {
		if (typeof source !== "string") throw new TypeError("Expected String");
		if (source.length === 0) return new Uint8Array();
		let psz = 0;
		let zeroes = 0;
		let length = 0;
		while (source[psz] === LEADER) {
			zeroes++;
			psz++;
		}
		const size = (source.length - psz) * FACTOR + 1 >>> 0;
		const b256 = new Uint8Array(size);
		while (psz < source.length) {
			const charCode = source.charCodeAt(psz);
			if (charCode > 255) return;
			let carry = BASE_MAP[charCode];
			if (carry === 255) return;
			let i = 0;
			for (let it3 = size - 1; (carry !== 0 || i < length) && it3 !== -1; it3--, i++) {
				carry += BASE * b256[it3] >>> 0;
				b256[it3] = carry % 256 >>> 0;
				carry = carry / 256 >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i;
			psz++;
		}
		let it4 = size - length;
		while (it4 !== size && b256[it4] === 0) it4++;
		const vch = new Uint8Array(zeroes + (size - it4));
		let j = zeroes;
		while (it4 !== size) vch[j++] = b256[it4++];
		return vch;
	}
	function decode(string) {
		const buffer = decodeUnsafe(string);
		if (buffer) return buffer;
		throw new Error("Non-base" + BASE + " character");
	}
	return {
		encode,
		decodeUnsafe,
		decode
	};
}
var init_esm$2 = __esmMin((() => {}));
//#endregion
//#region node_modules/bs58/src/esm/index.js
var ALPHABET, esm_default;
var init_esm$1 = __esmMin((() => {
	init_esm$2();
	ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
	esm_default = base$1(ALPHABET);
}));
//#endregion
//#region node_modules/uint8arrays/esm/src/util/as-uint8array.js
function asUint8Array(buf) {
	if (globalThis.Buffer != null) return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
	return buf;
}
var init_as_uint8array = __esmMin((() => {}));
//#endregion
//#region node_modules/uint8arrays/esm/src/alloc.js
function allocUnsafe(size = 0) {
	if (globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null) return asUint8Array(globalThis.Buffer.allocUnsafe(size));
	return new Uint8Array(size);
}
var init_alloc = __esmMin((() => {
	init_as_uint8array();
}));
//#endregion
//#region node_modules/uint8arrays/esm/src/concat.js
function concat(arrays, length) {
	if (!length) length = arrays.reduce((acc, curr) => acc + curr.length, 0);
	const output = allocUnsafe(length);
	let offset = 0;
	for (const arr of arrays) {
		output.set(arr, offset);
		offset += arr.length;
	}
	return asUint8Array(output);
}
var init_concat = __esmMin((() => {
	init_alloc();
	init_as_uint8array();
}));
//#endregion
//#region node_modules/multiformats/esm/vendor/base-x.js
function base(ALPHABET, name) {
	if (ALPHABET.length >= 255) throw new TypeError("Alphabet too long");
	var BASE_MAP = new Uint8Array(256);
	for (var j = 0; j < BASE_MAP.length; j++) BASE_MAP[j] = 255;
	for (var i = 0; i < ALPHABET.length; i++) {
		var x = ALPHABET.charAt(i);
		var xc = x.charCodeAt(0);
		if (BASE_MAP[xc] !== 255) throw new TypeError(x + " is ambiguous");
		BASE_MAP[xc] = i;
	}
	var BASE = ALPHABET.length;
	var LEADER = ALPHABET.charAt(0);
	var FACTOR = Math.log(BASE) / Math.log(256);
	var iFACTOR = Math.log(256) / Math.log(BASE);
	function encode(source) {
		if (source instanceof Uint8Array);
		else if (ArrayBuffer.isView(source)) source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
		else if (Array.isArray(source)) source = Uint8Array.from(source);
		if (!(source instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
		if (source.length === 0) return "";
		var zeroes = 0;
		var length = 0;
		var pbegin = 0;
		var pend = source.length;
		while (pbegin !== pend && source[pbegin] === 0) {
			pbegin++;
			zeroes++;
		}
		var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
		var b58 = new Uint8Array(size);
		while (pbegin !== pend) {
			var carry = source[pbegin];
			var i = 0;
			for (var it1 = size - 1; (carry !== 0 || i < length) && it1 !== -1; it1--, i++) {
				carry += 256 * b58[it1] >>> 0;
				b58[it1] = carry % BASE >>> 0;
				carry = carry / BASE >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i;
			pbegin++;
		}
		var it2 = size - length;
		while (it2 !== size && b58[it2] === 0) it2++;
		var str = LEADER.repeat(zeroes);
		for (; it2 < size; ++it2) str += ALPHABET.charAt(b58[it2]);
		return str;
	}
	function decodeUnsafe(source) {
		if (typeof source !== "string") throw new TypeError("Expected String");
		if (source.length === 0) return new Uint8Array();
		var psz = 0;
		if (source[psz] === " ") return;
		var zeroes = 0;
		var length = 0;
		while (source[psz] === LEADER) {
			zeroes++;
			psz++;
		}
		var size = (source.length - psz) * FACTOR + 1 >>> 0;
		var b256 = new Uint8Array(size);
		while (source[psz]) {
			var carry = BASE_MAP[source.charCodeAt(psz)];
			if (carry === 255) return;
			var i = 0;
			for (var it3 = size - 1; (carry !== 0 || i < length) && it3 !== -1; it3--, i++) {
				carry += BASE * b256[it3] >>> 0;
				b256[it3] = carry % 256 >>> 0;
				carry = carry / 256 >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i;
			psz++;
		}
		if (source[psz] === " ") return;
		var it4 = size - length;
		while (it4 !== size && b256[it4] === 0) it4++;
		var vch = new Uint8Array(zeroes + (size - it4));
		var j = zeroes;
		while (it4 !== size) vch[j++] = b256[it4++];
		return vch;
	}
	function decode(string) {
		var buffer = decodeUnsafe(string);
		if (buffer) return buffer;
		throw new Error(`Non-${name} character`);
	}
	return {
		encode,
		decodeUnsafe,
		decode
	};
}
var _brrp__multiformats_scope_baseX;
var init_base_x = __esmMin((() => {
	_brrp__multiformats_scope_baseX = base;
}));
//#endregion
//#region node_modules/multiformats/esm/src/bytes.js
var coerce, fromString$1, toString$1;
var init_bytes = __esmMin((() => {
	coerce = (o) => {
		if (o instanceof Uint8Array && o.constructor.name === "Uint8Array") return o;
		if (o instanceof ArrayBuffer) return new Uint8Array(o);
		if (ArrayBuffer.isView(o)) return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
		throw new Error("Unknown type, must be binary type");
	};
	fromString$1 = (str) => new TextEncoder().encode(str);
	toString$1 = (b) => new TextDecoder().decode(b);
}));
//#endregion
//#region node_modules/multiformats/esm/src/bases/base.js
var Encoder, Decoder, ComposedDecoder, or$2, Codec, from$1, baseX, decode$2, encode$3, rfc4648;
var init_base = __esmMin((() => {
	init_base_x();
	init_bytes();
	Encoder = class {
		constructor(name, prefix, baseEncode) {
			this.name = name;
			this.prefix = prefix;
			this.baseEncode = baseEncode;
		}
		encode(bytes) {
			if (bytes instanceof Uint8Array) return `${this.prefix}${this.baseEncode(bytes)}`;
			else throw Error("Unknown type, must be binary type");
		}
	};
	Decoder = class {
		constructor(name, prefix, baseDecode) {
			this.name = name;
			this.prefix = prefix;
			if (prefix.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
			this.prefixCodePoint = prefix.codePointAt(0);
			this.baseDecode = baseDecode;
		}
		decode(text) {
			if (typeof text === "string") {
				if (text.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
				return this.baseDecode(text.slice(this.prefix.length));
			} else throw Error("Can only multibase decode strings");
		}
		or(decoder) {
			return or$2(this, decoder);
		}
	};
	ComposedDecoder = class {
		constructor(decoders) {
			this.decoders = decoders;
		}
		or(decoder) {
			return or$2(this, decoder);
		}
		decode(input) {
			const prefix = input[0];
			const decoder = this.decoders[prefix];
			if (decoder) return decoder.decode(input);
			else throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
		}
	};
	or$2 = (left, right) => new ComposedDecoder({
		...left.decoders || { [left.prefix]: left },
		...right.decoders || { [right.prefix]: right }
	});
	Codec = class {
		constructor(name, prefix, baseEncode, baseDecode) {
			this.name = name;
			this.prefix = prefix;
			this.baseEncode = baseEncode;
			this.baseDecode = baseDecode;
			this.encoder = new Encoder(name, prefix, baseEncode);
			this.decoder = new Decoder(name, prefix, baseDecode);
		}
		encode(input) {
			return this.encoder.encode(input);
		}
		decode(input) {
			return this.decoder.decode(input);
		}
	};
	from$1 = ({ name, prefix, encode, decode }) => new Codec(name, prefix, encode, decode);
	baseX = ({ prefix, name, alphabet }) => {
		const { encode, decode } = _brrp__multiformats_scope_baseX(alphabet, name);
		return from$1({
			prefix,
			name,
			encode,
			decode: (text) => coerce(decode(text))
		});
	};
	decode$2 = (string, alphabet, bitsPerChar, name) => {
		const codes = {};
		for (let i = 0; i < alphabet.length; ++i) codes[alphabet[i]] = i;
		let end = string.length;
		while (string[end - 1] === "=") --end;
		const out = new Uint8Array(end * bitsPerChar / 8 | 0);
		let bits = 0;
		let buffer = 0;
		let written = 0;
		for (let i = 0; i < end; ++i) {
			const value = codes[string[i]];
			if (value === void 0) throw new SyntaxError(`Non-${name} character`);
			buffer = buffer << bitsPerChar | value;
			bits += bitsPerChar;
			if (bits >= 8) {
				bits -= 8;
				out[written++] = 255 & buffer >> bits;
			}
		}
		if (bits >= bitsPerChar || 255 & buffer << 8 - bits) throw new SyntaxError("Unexpected end of data");
		return out;
	};
	encode$3 = (data, alphabet, bitsPerChar) => {
		const pad = alphabet[alphabet.length - 1] === "=";
		const mask = (1 << bitsPerChar) - 1;
		let out = "";
		let bits = 0;
		let buffer = 0;
		for (let i = 0; i < data.length; ++i) {
			buffer = buffer << 8 | data[i];
			bits += 8;
			while (bits > bitsPerChar) {
				bits -= bitsPerChar;
				out += alphabet[mask & buffer >> bits];
			}
		}
		if (bits) out += alphabet[mask & buffer << bitsPerChar - bits];
		if (pad) while (out.length * bitsPerChar & 7) out += "=";
		return out;
	};
	rfc4648 = ({ name, prefix, bitsPerChar, alphabet }) => {
		return from$1({
			prefix,
			name,
			encode(input) {
				return encode$3(input, alphabet, bitsPerChar);
			},
			decode(input) {
				return decode$2(input, alphabet, bitsPerChar, name);
			}
		});
	};
}));
//#endregion
//#region node_modules/multiformats/esm/src/bases/identity.js
var identity_exports$1 = /* @__PURE__ */ __exportAll({ identity: () => identity$1 });
var identity$1;
var init_identity$1 = __esmMin((() => {
	init_base();
	init_bytes();
	identity$1 = from$1({
		prefix: "\0",
		name: "identity",
		encode: (buf) => toString$1(buf),
		decode: (str) => fromString$1(str)
	});
}));
//#endregion
//#region node_modules/multiformats/esm/src/bases/base2.js
var base2_exports = /* @__PURE__ */ __exportAll({ base2: () => base2 });
var base2;
var init_base2 = __esmMin((() => {
	init_base();
	base2 = rfc4648({
		prefix: "0",
		name: "base2",
		alphabet: "01",
		bitsPerChar: 1
	});
}));
//#endregion
//#region node_modules/multiformats/esm/src/bases/base8.js
var base8_exports = /* @__PURE__ */ __exportAll({ base8: () => base8 });
var base8;
var init_base8 = __esmMin((() => {
	init_base();
	base8 = rfc4648({
		prefix: "7",
		name: "base8",
		alphabet: "01234567",
		bitsPerChar: 3
	});
}));
//#endregion
//#region node_modules/multiformats/esm/src/bases/base10.js
var base10_exports = /* @__PURE__ */ __exportAll({ base10: () => base10 });
var base10;
var init_base10 = __esmMin((() => {
	init_base();
	base10 = baseX({
		prefix: "9",
		name: "base10",
		alphabet: "0123456789"
	});
}));
//#endregion
//#region node_modules/multiformats/esm/src/bases/base16.js
var base16_exports = /* @__PURE__ */ __exportAll({
	base16: () => base16,
	base16upper: () => base16upper
});
var base16, base16upper;
var init_base16 = __esmMin((() => {
	init_base();
	base16 = rfc4648({
		prefix: "f",
		name: "base16",
		alphabet: "0123456789abcdef",
		bitsPerChar: 4
	});
	base16upper = rfc4648({
		prefix: "F",
		name: "base16upper",
		alphabet: "0123456789ABCDEF",
		bitsPerChar: 4
	});
}));
//#endregion
//#region node_modules/multiformats/esm/src/bases/base32.js
var base32_exports = /* @__PURE__ */ __exportAll({
	base32: () => base32,
	base32hex: () => base32hex,
	base32hexpad: () => base32hexpad,
	base32hexpadupper: () => base32hexpadupper,
	base32hexupper: () => base32hexupper,
	base32pad: () => base32pad,
	base32padupper: () => base32padupper,
	base32upper: () => base32upper,
	base32z: () => base32z
});
var base32, base32upper, base32pad, base32padupper, base32hex, base32hexupper, base32hexpad, base32hexpadupper, base32z;
var init_base32 = __esmMin((() => {
	init_base();
	base32 = rfc4648({
		prefix: "b",
		name: "base32",
		alphabet: "abcdefghijklmnopqrstuvwxyz234567",
		bitsPerChar: 5
	});
	base32upper = rfc4648({
		prefix: "B",
		name: "base32upper",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
		bitsPerChar: 5
	});
	base32pad = rfc4648({
		prefix: "c",
		name: "base32pad",
		alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
		bitsPerChar: 5
	});
	base32padupper = rfc4648({
		prefix: "C",
		name: "base32padupper",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
		bitsPerChar: 5
	});
	base32hex = rfc4648({
		prefix: "v",
		name: "base32hex",
		alphabet: "0123456789abcdefghijklmnopqrstuv",
		bitsPerChar: 5
	});
	base32hexupper = rfc4648({
		prefix: "V",
		name: "base32hexupper",
		alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
		bitsPerChar: 5
	});
	base32hexpad = rfc4648({
		prefix: "t",
		name: "base32hexpad",
		alphabet: "0123456789abcdefghijklmnopqrstuv=",
		bitsPerChar: 5
	});
	base32hexpadupper = rfc4648({
		prefix: "T",
		name: "base32hexpadupper",
		alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
		bitsPerChar: 5
	});
	base32z = rfc4648({
		prefix: "h",
		name: "base32z",
		alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
		bitsPerChar: 5
	});
}));
//#endregion
//#region node_modules/multiformats/esm/src/bases/base36.js
var base36_exports = /* @__PURE__ */ __exportAll({
	base36: () => base36,
	base36upper: () => base36upper
});
var base36, base36upper;
var init_base36 = __esmMin((() => {
	init_base();
	base36 = baseX({
		prefix: "k",
		name: "base36",
		alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
	});
	base36upper = baseX({
		prefix: "K",
		name: "base36upper",
		alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	});
}));
//#endregion
//#region node_modules/multiformats/esm/src/bases/base58.js
var base58_exports = /* @__PURE__ */ __exportAll({
	base58btc: () => base58btc,
	base58flickr: () => base58flickr
});
var base58btc, base58flickr;
var init_base58 = __esmMin((() => {
	init_base();
	base58btc = baseX({
		name: "base58btc",
		prefix: "z",
		alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
	});
	base58flickr = baseX({
		name: "base58flickr",
		prefix: "Z",
		alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
	});
}));
//#endregion
//#region node_modules/multiformats/esm/src/bases/base64.js
var base64_exports = /* @__PURE__ */ __exportAll({
	base64: () => base64,
	base64pad: () => base64pad,
	base64url: () => base64url,
	base64urlpad: () => base64urlpad
});
var base64, base64pad, base64url, base64urlpad;
var init_base64 = __esmMin((() => {
	init_base();
	base64 = rfc4648({
		prefix: "m",
		name: "base64",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
		bitsPerChar: 6
	});
	base64pad = rfc4648({
		prefix: "M",
		name: "base64pad",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		bitsPerChar: 6
	});
	base64url = rfc4648({
		prefix: "u",
		name: "base64url",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
		bitsPerChar: 6
	});
	base64urlpad = rfc4648({
		prefix: "U",
		name: "base64urlpad",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
		bitsPerChar: 6
	});
}));
//#endregion
//#region node_modules/multiformats/esm/src/bases/base256emoji.js
var base256emoji_exports = /* @__PURE__ */ __exportAll({ base256emoji: () => base256emoji });
function encode$2(data) {
	return data.reduce((p, c) => {
		p += alphabetBytesToChars[c];
		return p;
	}, "");
}
function decode$1(str) {
	const byts = [];
	for (const char of str) {
		const byt = alphabetCharsToBytes[char.codePointAt(0)];
		if (byt === void 0) throw new Error(`Non-base256emoji character: ${char}`);
		byts.push(byt);
	}
	return new Uint8Array(byts);
}
var alphabet, alphabetBytesToChars, alphabetCharsToBytes, base256emoji;
var init_base256emoji = __esmMin((() => {
	init_base();
	alphabet = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂");
	alphabetBytesToChars = alphabet.reduce((p, c, i) => {
		p[i] = c;
		return p;
	}, []);
	alphabetCharsToBytes = alphabet.reduce((p, c, i) => {
		p[c.codePointAt(0)] = i;
		return p;
	}, []);
	base256emoji = from$1({
		prefix: "🚀",
		name: "base256emoji",
		encode: encode$2,
		decode: decode$1
	});
}));
//#endregion
//#region node_modules/multiformats/esm/vendor/varint.js
function encode$1(num, out, offset) {
	out = out || [];
	offset = offset || 0;
	var oldOffset = offset;
	while (num >= INT) {
		out[offset++] = num & 255 | MSB;
		num /= 128;
	}
	while (num & MSBALL) {
		out[offset++] = num & 255 | MSB;
		num >>>= 7;
	}
	out[offset] = num | 0;
	encode$1.bytes = offset - oldOffset + 1;
	return out;
}
function read(buf, offset) {
	var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf.length;
	do {
		if (counter >= l) {
			read.bytes = 0;
			throw new RangeError("Could not decode varint");
		}
		b = buf[counter++];
		res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
		shift += 7;
	} while (b >= MSB$1);
	read.bytes = counter - offset;
	return res;
}
var encode_1, MSB, MSBALL, INT, decode, MSB$1, REST$1, N1, N2, N3, N4, N5, N6, N7, N8, N9, length, _brrp_varint;
var init_varint$1 = __esmMin((() => {
	encode_1 = encode$1;
	MSB = 128, MSBALL = -128, INT = Math.pow(2, 31);
	decode = read;
	MSB$1 = 128, REST$1 = 127;
	N1 = Math.pow(2, 7);
	N2 = Math.pow(2, 14);
	N3 = Math.pow(2, 21);
	N4 = Math.pow(2, 28);
	N5 = Math.pow(2, 35);
	N6 = Math.pow(2, 42);
	N7 = Math.pow(2, 49);
	N8 = Math.pow(2, 56);
	N9 = Math.pow(2, 63);
	length = function(value) {
		return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
	};
	_brrp_varint = {
		encode: encode_1,
		decode,
		encodingLength: length
	};
}));
//#endregion
//#region node_modules/multiformats/esm/src/varint.js
var encodeTo, encodingLength;
var init_varint = __esmMin((() => {
	init_varint$1();
	encodeTo = (int, target, offset = 0) => {
		_brrp_varint.encode(int, target, offset);
		return target;
	};
	encodingLength = (int) => {
		return _brrp_varint.encodingLength(int);
	};
}));
//#endregion
//#region node_modules/multiformats/esm/src/hashes/digest.js
var create, Digest;
var init_digest = __esmMin((() => {
	init_varint();
	create = (code, digest) => {
		const size = digest.byteLength;
		const sizeOffset = encodingLength(code);
		const digestOffset = sizeOffset + encodingLength(size);
		const bytes = new Uint8Array(digestOffset + size);
		encodeTo(code, bytes, 0);
		encodeTo(size, bytes, sizeOffset);
		bytes.set(digest, digestOffset);
		return new Digest(code, size, digest, bytes);
	};
	Digest = class {
		constructor(code, size, digest, bytes) {
			this.code = code;
			this.size = size;
			this.digest = digest;
			this.bytes = bytes;
		}
	};
}));
//#endregion
//#region node_modules/multiformats/esm/src/hashes/hasher.js
var from, Hasher;
var init_hasher = __esmMin((() => {
	init_digest();
	from = ({ name, code, encode }) => new Hasher(name, code, encode);
	Hasher = class {
		constructor(name, code, encode) {
			this.name = name;
			this.code = code;
			this.encode = encode;
		}
		digest(input) {
			if (input instanceof Uint8Array) {
				const result = this.encode(input);
				return result instanceof Uint8Array ? create(this.code, result) : result.then((digest) => create(this.code, digest));
			} else throw Error("Unknown type, must be binary type");
		}
	};
}));
//#endregion
//#region node_modules/multiformats/esm/src/hashes/sha2.js
var sha2_exports = /* @__PURE__ */ __exportAll({
	sha256: () => sha256,
	sha512: () => sha512
});
var sha256, sha512;
var init_sha2 = __esmMin((() => {
	init_hasher();
	init_bytes();
	sha256 = from({
		name: "sha2-256",
		code: 18,
		encode: (input) => coerce(crypto$1.createHash("sha256").update(input).digest())
	});
	sha512 = from({
		name: "sha2-512",
		code: 19,
		encode: (input) => coerce(crypto$1.createHash("sha512").update(input).digest())
	});
}));
//#endregion
//#region node_modules/multiformats/esm/src/hashes/identity.js
var identity_exports = /* @__PURE__ */ __exportAll({ identity: () => identity });
var code, name, encode, digest, identity;
var init_identity = __esmMin((() => {
	init_bytes();
	init_digest();
	code = 0;
	name = "identity";
	encode = coerce;
	digest = (input) => create(code, encode(input));
	identity = {
		code,
		name,
		encode,
		digest
	};
}));
var init_json = __esmMin((() => {
	new TextEncoder();
	new TextDecoder();
}));
//#endregion
//#region node_modules/multiformats/esm/src/cid.js
var init_cid = __esmMin((() => {
	init_base58();
	init_base32();
}));
//#endregion
//#region node_modules/multiformats/esm/src/index.js
var init_src$1 = __esmMin((() => {
	init_cid();
})), bases;
var init_basics = __esmMin((() => {
	init_identity$1();
	init_base2();
	init_base8();
	init_base10();
	init_base16();
	init_base32();
	init_base36();
	init_base58();
	init_base64();
	init_base256emoji();
	init_sha2();
	init_identity();
	init_json();
	init_src$1();
	bases = {
		...identity_exports$1,
		...base2_exports,
		...base8_exports,
		...base10_exports,
		...base16_exports,
		...base32_exports,
		...base36_exports,
		...base58_exports,
		...base64_exports,
		...base256emoji_exports
	};
	({
		...sha2_exports,
		...identity_exports
	});
}));
//#endregion
//#region node_modules/uint8arrays/esm/src/util/bases.js
function createCodec(name, prefix, encode, decode) {
	return {
		name,
		prefix,
		encoder: {
			name,
			prefix,
			encode
		},
		decoder: { decode }
	};
}
var string, ascii, BASES;
var init_bases = __esmMin((() => {
	init_basics();
	init_alloc();
	string = createCodec("utf8", "u", (buf) => {
		return "u" + new TextDecoder("utf8").decode(buf);
	}, (str) => {
		return new TextEncoder().encode(str.substring(1));
	});
	ascii = createCodec("ascii", "a", (buf) => {
		let string = "a";
		for (let i = 0; i < buf.length; i++) string += String.fromCharCode(buf[i]);
		return string;
	}, (str) => {
		str = str.substring(1);
		const buf = allocUnsafe(str.length);
		for (let i = 0; i < str.length; i++) buf[i] = str.charCodeAt(i);
		return buf;
	});
	BASES = {
		utf8: string,
		"utf-8": string,
		hex: bases.base16,
		latin1: ascii,
		ascii,
		binary: ascii,
		...bases
	};
}));
//#endregion
//#region node_modules/uint8arrays/esm/src/from-string.js
function fromString(string, encoding = "utf8") {
	const base = BASES[encoding];
	if (!base) throw new Error(`Unsupported encoding "${encoding}"`);
	if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) return asUint8Array(globalThis.Buffer.from(string, "utf-8"));
	return base.decoder.decode(`${base.prefix}${string}`);
}
var init_from_string = __esmMin((() => {
	init_bases();
	init_as_uint8array();
}));
//#endregion
//#region node_modules/uint8arrays/esm/src/to-string.js
function toString(array, encoding = "utf8") {
	const base = BASES[encoding];
	if (!base) throw new Error(`Unsupported encoding "${encoding}"`);
	if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) return globalThis.Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString("utf8");
	return base.encoder.encode(array).substring(1);
}
var init_to_string = __esmMin((() => {
	init_bases();
}));
//#endregion
//#region node_modules/uint8arrays/esm/src/index.js
var init_src = __esmMin((() => {
	init_concat();
	init_from_string();
	init_to_string();
}));
//#endregion
//#region node_modules/@walletconnect/relay-api/dist/index.es.js
var C$1;
var init_index_es$5 = __esmMin((() => {
	C$1 = {
		waku: {
			publish: "waku_publish",
			batchPublish: "waku_batchPublish",
			subscribe: "waku_subscribe",
			batchSubscribe: "waku_batchSubscribe",
			subscription: "waku_subscription",
			unsubscribe: "waku_unsubscribe",
			batchUnsubscribe: "waku_batchUnsubscribe",
			batchFetchMessages: "waku_batchFetchMessages"
		},
		irn: {
			publish: "irn_publish",
			batchPublish: "irn_batchPublish",
			subscribe: "irn_subscribe",
			batchSubscribe: "irn_batchSubscribe",
			subscription: "irn_subscription",
			unsubscribe: "irn_unsubscribe",
			batchUnsubscribe: "irn_batchUnsubscribe",
			batchFetchMessages: "irn_batchFetchMessages"
		},
		iridium: {
			publish: "iridium_publish",
			batchPublish: "iridium_batchPublish",
			subscribe: "iridium_subscribe",
			batchSubscribe: "iridium_batchSubscribe",
			subscription: "iridium_subscription",
			unsubscribe: "iridium_unsubscribe",
			batchUnsubscribe: "iridium_batchUnsubscribe",
			batchFetchMessages: "iridium_batchFetchMessages"
		}
	};
}));
//#endregion
//#region node_modules/blakejs/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ERROR_MSG_INPUT = "Input must be an string, Buffer or Uint8Array";
	function normalizeInput(input) {
		let ret;
		if (input instanceof Uint8Array) ret = input;
		else if (typeof input === "string") ret = new TextEncoder().encode(input);
		else throw new Error(ERROR_MSG_INPUT);
		return ret;
	}
	function toHex(bytes) {
		return Array.prototype.map.call(bytes, function(n) {
			return (n < 16 ? "0" : "") + n.toString(16);
		}).join("");
	}
	function uint32ToHex(val) {
		return (4294967296 + val).toString(16).substring(1);
	}
	function debugPrint(label, arr, size) {
		let msg = "\n" + label + " = ";
		for (let i = 0; i < arr.length; i += 2) {
			if (size === 32) {
				msg += uint32ToHex(arr[i]).toUpperCase();
				msg += " ";
				msg += uint32ToHex(arr[i + 1]).toUpperCase();
			} else if (size === 64) {
				msg += uint32ToHex(arr[i + 1]).toUpperCase();
				msg += uint32ToHex(arr[i]).toUpperCase();
			} else throw new Error("Invalid size " + size);
			if (i % 6 === 4) msg += "\n" + new Array(label.length + 4).join(" ");
			else if (i < arr.length - 2) msg += " ";
		}
		console.log(msg);
	}
	function testSpeed(hashFn, N, M) {
		let startMs = (/* @__PURE__ */ new Date()).getTime();
		const input = new Uint8Array(N);
		for (let i = 0; i < N; i++) input[i] = i % 256;
		const genMs = (/* @__PURE__ */ new Date()).getTime();
		console.log("Generated random input in " + (genMs - startMs) + "ms");
		startMs = genMs;
		for (let i = 0; i < M; i++) {
			const hashHex = hashFn(input);
			const hashMs = (/* @__PURE__ */ new Date()).getTime();
			const ms = hashMs - startMs;
			startMs = hashMs;
			console.log("Hashed in " + ms + "ms: " + hashHex.substring(0, 20) + "...");
			console.log(Math.round(N / (1 << 20) / (ms / 1e3) * 100) / 100 + " MB PER SECOND");
		}
	}
	module.exports = {
		normalizeInput,
		toHex,
		debugPrint,
		testSpeed
	};
}));
//#endregion
//#region node_modules/blakejs/blake2b.js
var require_blake2b = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util = require_util();
	function ADD64AA(v, a, b) {
		const o0 = v[a] + v[b];
		let o1 = v[a + 1] + v[b + 1];
		if (o0 >= 4294967296) o1++;
		v[a] = o0;
		v[a + 1] = o1;
	}
	function ADD64AC(v, a, b0, b1) {
		let o0 = v[a] + b0;
		if (b0 < 0) o0 += 4294967296;
		let o1 = v[a + 1] + b1;
		if (o0 >= 4294967296) o1++;
		v[a] = o0;
		v[a + 1] = o1;
	}
	function B2B_GET32(arr, i) {
		return arr[i] ^ arr[i + 1] << 8 ^ arr[i + 2] << 16 ^ arr[i + 3] << 24;
	}
	function B2B_G(a, b, c, d, ix, iy) {
		const x0 = m[ix];
		const x1 = m[ix + 1];
		const y0 = m[iy];
		const y1 = m[iy + 1];
		ADD64AA(v, a, b);
		ADD64AC(v, a, x0, x1);
		let xor0 = v[d] ^ v[a];
		let xor1 = v[d + 1] ^ v[a + 1];
		v[d] = xor1;
		v[d + 1] = xor0;
		ADD64AA(v, c, d);
		xor0 = v[b] ^ v[c];
		xor1 = v[b + 1] ^ v[c + 1];
		v[b] = xor0 >>> 24 ^ xor1 << 8;
		v[b + 1] = xor1 >>> 24 ^ xor0 << 8;
		ADD64AA(v, a, b);
		ADD64AC(v, a, y0, y1);
		xor0 = v[d] ^ v[a];
		xor1 = v[d + 1] ^ v[a + 1];
		v[d] = xor0 >>> 16 ^ xor1 << 16;
		v[d + 1] = xor1 >>> 16 ^ xor0 << 16;
		ADD64AA(v, c, d);
		xor0 = v[b] ^ v[c];
		xor1 = v[b + 1] ^ v[c + 1];
		v[b] = xor1 >>> 31 ^ xor0 << 1;
		v[b + 1] = xor0 >>> 31 ^ xor1 << 1;
	}
	var BLAKE2B_IV32 = new Uint32Array([
		4089235720,
		1779033703,
		2227873595,
		3144134277,
		4271175723,
		1013904242,
		1595750129,
		2773480762,
		2917565137,
		1359893119,
		725511199,
		2600822924,
		4215389547,
		528734635,
		327033209,
		1541459225
	]);
	var SIGMA82 = new Uint8Array([
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		14,
		10,
		4,
		8,
		9,
		15,
		13,
		6,
		1,
		12,
		0,
		2,
		11,
		7,
		5,
		3,
		11,
		8,
		12,
		0,
		5,
		2,
		15,
		13,
		10,
		14,
		3,
		6,
		7,
		1,
		9,
		4,
		7,
		9,
		3,
		1,
		13,
		12,
		11,
		14,
		2,
		6,
		5,
		10,
		4,
		0,
		15,
		8,
		9,
		0,
		5,
		7,
		2,
		4,
		10,
		15,
		14,
		1,
		11,
		12,
		6,
		8,
		3,
		13,
		2,
		12,
		6,
		10,
		0,
		11,
		8,
		3,
		4,
		13,
		7,
		5,
		15,
		14,
		1,
		9,
		12,
		5,
		1,
		15,
		14,
		13,
		4,
		10,
		0,
		7,
		6,
		3,
		9,
		2,
		8,
		11,
		13,
		11,
		7,
		14,
		12,
		1,
		3,
		9,
		5,
		0,
		15,
		4,
		8,
		6,
		2,
		10,
		6,
		15,
		14,
		9,
		11,
		3,
		0,
		8,
		12,
		2,
		13,
		7,
		1,
		4,
		10,
		5,
		10,
		2,
		8,
		4,
		7,
		6,
		1,
		5,
		15,
		11,
		9,
		14,
		3,
		12,
		13,
		0,
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		14,
		10,
		4,
		8,
		9,
		15,
		13,
		6,
		1,
		12,
		0,
		2,
		11,
		7,
		5,
		3
	].map(function(x) {
		return x * 2;
	}));
	var v = new Uint32Array(32);
	var m = new Uint32Array(32);
	function blake2bCompress(ctx, last) {
		let i = 0;
		for (i = 0; i < 16; i++) {
			v[i] = ctx.h[i];
			v[i + 16] = BLAKE2B_IV32[i];
		}
		v[24] = v[24] ^ ctx.t;
		v[25] = v[25] ^ ctx.t / 4294967296;
		if (last) {
			v[28] = ~v[28];
			v[29] = ~v[29];
		}
		for (i = 0; i < 32; i++) m[i] = B2B_GET32(ctx.b, 4 * i);
		for (i = 0; i < 12; i++) {
			B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1]);
			B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3]);
			B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5]);
			B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7]);
			B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9]);
			B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11]);
			B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13]);
			B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15]);
		}
		for (i = 0; i < 16; i++) ctx.h[i] = ctx.h[i] ^ v[i] ^ v[i + 16];
	}
	var parameterBlock = new Uint8Array([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	]);
	function blake2bInit(outlen, key, salt, personal) {
		if (outlen === 0 || outlen > 64) throw new Error("Illegal output length, expected 0 < length <= 64");
		if (key && key.length > 64) throw new Error("Illegal key, expected Uint8Array with 0 < length <= 64");
		if (salt && salt.length !== 16) throw new Error("Illegal salt, expected Uint8Array with length is 16");
		if (personal && personal.length !== 16) throw new Error("Illegal personal, expected Uint8Array with length is 16");
		const ctx = {
			b: new Uint8Array(128),
			h: new Uint32Array(16),
			t: 0,
			c: 0,
			outlen
		};
		parameterBlock.fill(0);
		parameterBlock[0] = outlen;
		if (key) parameterBlock[1] = key.length;
		parameterBlock[2] = 1;
		parameterBlock[3] = 1;
		if (salt) parameterBlock.set(salt, 32);
		if (personal) parameterBlock.set(personal, 48);
		for (let i = 0; i < 16; i++) ctx.h[i] = BLAKE2B_IV32[i] ^ B2B_GET32(parameterBlock, i * 4);
		if (key) {
			blake2bUpdate(ctx, key);
			ctx.c = 128;
		}
		return ctx;
	}
	function blake2bUpdate(ctx, input) {
		for (let i = 0; i < input.length; i++) {
			if (ctx.c === 128) {
				ctx.t += ctx.c;
				blake2bCompress(ctx, false);
				ctx.c = 0;
			}
			ctx.b[ctx.c++] = input[i];
		}
	}
	function blake2bFinal(ctx) {
		ctx.t += ctx.c;
		while (ctx.c < 128) ctx.b[ctx.c++] = 0;
		blake2bCompress(ctx, true);
		const out = new Uint8Array(ctx.outlen);
		for (let i = 0; i < ctx.outlen; i++) out[i] = ctx.h[i >> 2] >> 8 * (i & 3);
		return out;
	}
	function blake2b(input, key, outlen, salt, personal) {
		outlen = outlen || 64;
		input = util.normalizeInput(input);
		if (salt) salt = util.normalizeInput(salt);
		if (personal) personal = util.normalizeInput(personal);
		const ctx = blake2bInit(outlen, key, salt, personal);
		blake2bUpdate(ctx, input);
		return blake2bFinal(ctx);
	}
	function blake2bHex(input, key, outlen, salt, personal) {
		const output = blake2b(input, key, outlen, salt, personal);
		return util.toHex(output);
	}
	module.exports = {
		blake2b,
		blake2bHex,
		blake2bInit,
		blake2bUpdate,
		blake2bFinal
	};
}));
//#endregion
//#region node_modules/blakejs/blake2s.js
var require_blake2s = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util = require_util();
	function B2S_GET32(v, i) {
		return v[i] ^ v[i + 1] << 8 ^ v[i + 2] << 16 ^ v[i + 3] << 24;
	}
	function B2S_G(a, b, c, d, x, y) {
		v[a] = v[a] + v[b] + x;
		v[d] = ROTR32(v[d] ^ v[a], 16);
		v[c] = v[c] + v[d];
		v[b] = ROTR32(v[b] ^ v[c], 12);
		v[a] = v[a] + v[b] + y;
		v[d] = ROTR32(v[d] ^ v[a], 8);
		v[c] = v[c] + v[d];
		v[b] = ROTR32(v[b] ^ v[c], 7);
	}
	function ROTR32(x, y) {
		return x >>> y ^ x << 32 - y;
	}
	var BLAKE2S_IV = new Uint32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]);
	var SIGMA = new Uint8Array([
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		14,
		10,
		4,
		8,
		9,
		15,
		13,
		6,
		1,
		12,
		0,
		2,
		11,
		7,
		5,
		3,
		11,
		8,
		12,
		0,
		5,
		2,
		15,
		13,
		10,
		14,
		3,
		6,
		7,
		1,
		9,
		4,
		7,
		9,
		3,
		1,
		13,
		12,
		11,
		14,
		2,
		6,
		5,
		10,
		4,
		0,
		15,
		8,
		9,
		0,
		5,
		7,
		2,
		4,
		10,
		15,
		14,
		1,
		11,
		12,
		6,
		8,
		3,
		13,
		2,
		12,
		6,
		10,
		0,
		11,
		8,
		3,
		4,
		13,
		7,
		5,
		15,
		14,
		1,
		9,
		12,
		5,
		1,
		15,
		14,
		13,
		4,
		10,
		0,
		7,
		6,
		3,
		9,
		2,
		8,
		11,
		13,
		11,
		7,
		14,
		12,
		1,
		3,
		9,
		5,
		0,
		15,
		4,
		8,
		6,
		2,
		10,
		6,
		15,
		14,
		9,
		11,
		3,
		0,
		8,
		12,
		2,
		13,
		7,
		1,
		4,
		10,
		5,
		10,
		2,
		8,
		4,
		7,
		6,
		1,
		5,
		15,
		11,
		9,
		14,
		3,
		12,
		13,
		0
	]);
	var v = new Uint32Array(16);
	var m = new Uint32Array(16);
	function blake2sCompress(ctx, last) {
		let i = 0;
		for (i = 0; i < 8; i++) {
			v[i] = ctx.h[i];
			v[i + 8] = BLAKE2S_IV[i];
		}
		v[12] ^= ctx.t;
		v[13] ^= ctx.t / 4294967296;
		if (last) v[14] = ~v[14];
		for (i = 0; i < 16; i++) m[i] = B2S_GET32(ctx.b, 4 * i);
		for (i = 0; i < 10; i++) {
			B2S_G(0, 4, 8, 12, m[SIGMA[i * 16 + 0]], m[SIGMA[i * 16 + 1]]);
			B2S_G(1, 5, 9, 13, m[SIGMA[i * 16 + 2]], m[SIGMA[i * 16 + 3]]);
			B2S_G(2, 6, 10, 14, m[SIGMA[i * 16 + 4]], m[SIGMA[i * 16 + 5]]);
			B2S_G(3, 7, 11, 15, m[SIGMA[i * 16 + 6]], m[SIGMA[i * 16 + 7]]);
			B2S_G(0, 5, 10, 15, m[SIGMA[i * 16 + 8]], m[SIGMA[i * 16 + 9]]);
			B2S_G(1, 6, 11, 12, m[SIGMA[i * 16 + 10]], m[SIGMA[i * 16 + 11]]);
			B2S_G(2, 7, 8, 13, m[SIGMA[i * 16 + 12]], m[SIGMA[i * 16 + 13]]);
			B2S_G(3, 4, 9, 14, m[SIGMA[i * 16 + 14]], m[SIGMA[i * 16 + 15]]);
		}
		for (i = 0; i < 8; i++) ctx.h[i] ^= v[i] ^ v[i + 8];
	}
	function blake2sInit(outlen, key) {
		if (!(outlen > 0 && outlen <= 32)) throw new Error("Incorrect output length, should be in [1, 32]");
		const keylen = key ? key.length : 0;
		if (key && !(keylen > 0 && keylen <= 32)) throw new Error("Incorrect key length, should be in [1, 32]");
		const ctx = {
			h: new Uint32Array(BLAKE2S_IV),
			b: new Uint8Array(64),
			c: 0,
			t: 0,
			outlen
		};
		ctx.h[0] ^= 16842752 ^ keylen << 8 ^ outlen;
		if (keylen > 0) {
			blake2sUpdate(ctx, key);
			ctx.c = 64;
		}
		return ctx;
	}
	function blake2sUpdate(ctx, input) {
		for (let i = 0; i < input.length; i++) {
			if (ctx.c === 64) {
				ctx.t += ctx.c;
				blake2sCompress(ctx, false);
				ctx.c = 0;
			}
			ctx.b[ctx.c++] = input[i];
		}
	}
	function blake2sFinal(ctx) {
		ctx.t += ctx.c;
		while (ctx.c < 64) ctx.b[ctx.c++] = 0;
		blake2sCompress(ctx, true);
		const out = new Uint8Array(ctx.outlen);
		for (let i = 0; i < ctx.outlen; i++) out[i] = ctx.h[i >> 2] >> 8 * (i & 3) & 255;
		return out;
	}
	function blake2s(input, key, outlen) {
		outlen = outlen || 32;
		input = util.normalizeInput(input);
		const ctx = blake2sInit(outlen, key);
		blake2sUpdate(ctx, input);
		return blake2sFinal(ctx);
	}
	function blake2sHex(input, key, outlen) {
		const output = blake2s(input, key, outlen);
		return util.toHex(output);
	}
	module.exports = {
		blake2s,
		blake2sHex,
		blake2sInit,
		blake2sUpdate,
		blake2sFinal
	};
}));
//#endregion
//#region node_modules/blakejs/index.js
var require_blakejs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var b2b = require_blake2b();
	var b2s = require_blake2s();
	module.exports = {
		blake2b: b2b.blake2b,
		blake2bHex: b2b.blake2bHex,
		blake2bInit: b2b.blake2bInit,
		blake2bUpdate: b2b.blake2bUpdate,
		blake2bFinal: b2b.blake2bFinal,
		blake2s: b2s.blake2s,
		blake2sHex: b2s.blake2sHex,
		blake2sInit: b2s.blake2sInit,
		blake2sUpdate: b2s.blake2sUpdate,
		blake2sFinal: b2s.blake2sFinal
	};
}));
//#endregion
//#region node_modules/@walletconnect/utils/dist/index.es.js
var index_es_exports$1 = /* @__PURE__ */ __exportAll({
	BASE10: () => $n$1,
	BASE16: () => tt$1,
	BASE64: () => Qt$1,
	BASE64URL: () => De$1,
	COLON: () => ":",
	DEFAULT_DEPTH: () => 2,
	EMPTY_SPACE: () => " ",
	ENV_MAP: () => J$1,
	INTERNAL_ERRORS: () => Qo$1,
	LimitedSet: () => gi$1,
	MemoryStore: () => Ha,
	ONE_THOUSAND: () => Ds,
	REACT_NATIVE_PRODUCT: () => er$1,
	RELAYER_DEFAULT_PROTOCOL: () => "irn",
	SDK_ERRORS: () => Jo$1,
	SDK_TYPE: () => "js",
	SLASH: () => "/",
	TYPE_0: () => 0,
	TYPE_1: () => 1,
	TYPE_2: () => 2,
	UTF8: () => te,
	addResourceToRecap: () => Yr$1,
	addSignatureToExtrinsic: () => bs,
	appendToQueryString: () => or$1,
	assertType: () => Zs$1,
	assignAbilityToActions: () => hn$1,
	base64Decode: () => Zr$1,
	base64Encode: () => Gr$1,
	buildApprovedNamespaces: () => pa,
	buildAuthObject: () => mf,
	buildNamespacesFromAuth: () => ga,
	buildRecapStatement: () => Jr$1,
	buildSignedExtrinsicHash: () => Ka,
	calcExpiry: () => ii$1,
	capitalize: () => ti$1,
	capitalizeWord: () => lr$1,
	createDelayedPromise: () => ei$1,
	createEncodedRecap: () => Ef,
	createExpiringPromise: () => ni$1,
	createRecap: () => Wr$1,
	decodeRecap: () => Lt$1,
	decodeTypeByte: () => Vt$1,
	decodeTypeTwoEnvelope: () => Yc,
	decrypt: () => Zc,
	deriveExtrinsicHash: () => ys$1,
	deriveSymKey: () => Kc,
	deserialize: () => Me$1,
	encodeRecap: () => Ne,
	encodeTypeByte: () => jn$1,
	encodeTypeTwoEnvelope: () => Wc,
	encrypt: () => Gc,
	engineEvent: () => ci$1,
	enumify: () => Qs$1,
	extractSolanaTransactionId: () => sf,
	formatAccountId: () => Zn$1,
	formatAccountWithChain: () => Os,
	formatChainId: () => Gn$1,
	formatDeeplinkUrl: () => dr$1,
	formatExpirerTarget: () => Xe$1,
	formatIdTarget: () => oi$1,
	formatMessage: () => qr$1,
	formatMessageContext: () => Ws,
	formatRelayParams: () => Ko$1,
	formatRelayRpcUrl: () => zs,
	formatStatementFromRecap: () => gn$1,
	formatTopicTarget: () => ri$1,
	formatUA: () => cr$1,
	formatUri: () => oa,
	fromBase64: () => Qe$1,
	generateKeyPair: () => Vc,
	generateRandomBytes32: () => qc,
	getAccountsChains: () => qt$1,
	getAccountsFromNamespaces: () => _s,
	getAddressFromAccount: () => Wn$1,
	getAddressesFromAccounts: () => Us,
	getAlgorandTransactionId: () => af,
	getAppId: () => qs,
	getAppMetadata: () => sr$1,
	getBrowserOnlineStatus: () => us,
	getChainFromAccount: () => Yn$1,
	getChainsFromAccounts: () => Xn$1,
	getChainsFromNamespace: () => ve$1,
	getChainsFromNamespaces: () => Ts,
	getChainsFromRecap: () => Af,
	getChainsFromRequiredNamespaces: () => Rs,
	getCommonValuesInArrays: () => Je$1,
	getCryptoKeyFromKeyData: () => Do$1,
	getDecodedRecapFromResources: () => Kr$1,
	getDeepLink: () => ui$1,
	getDidAddress: () => dn$1,
	getDidAddressSegments: () => Se$1,
	getDidChainId: () => Mr$1,
	getEnvironment: () => Pt$1,
	getHttpUrl: () => Gs,
	getInternalError: () => Et,
	getJavascriptID: () => fr$1,
	getJavascriptOS: () => ir$1,
	getLastItems: () => ur$1,
	getLinkModeURL: () => sa,
	getMethodsFromRecap: () => If,
	getNamespacedDidChainId: () => Vr$1,
	getNamespacesChains: () => Go$1,
	getNamespacesEventsForChainId: () => Wo$1,
	getNamespacesFromAccounts: () => Xo$1,
	getNamespacesMethodsForChainId: () => Zo$1,
	getNearTransactionIdFromSignedTransaction: () => cf,
	getNearUint8ArrayFromBytes: () => kr$1,
	getNodeOnlineStatus: () => ds$1,
	getReCapActions: () => zr$1,
	getReactNativeOnlineStatus: () => ls,
	getRecapAbilitiesFromResource: () => vf,
	getRecapFromResources: () => Oe$1,
	getRecapResource: () => Fr$1,
	getRelayClientMetadata: () => Fs,
	getRelayProtocolApi: () => na,
	getRelayProtocolName: () => ea$1,
	getRequiredNamespacesFromNamespaces: () => ha,
	getSdkError: () => Kt$1,
	getSearchParamFromURL: () => li$1,
	getSignDirectHash: () => uf,
	getSuiDigest: () => ff,
	getUniqueValues: () => Ge$1,
	handleDeeplinkRedirect: () => ai$1,
	hasOverlap: () => It$1,
	hashEthereumMessage: () => an$1,
	hashKey: () => Fc,
	hashMessage: () => zc,
	isAndroid: () => Ms,
	isAppVisible: () => Pa,
	isBrowser: () => zt$1,
	isCaipNamespace: () => Pn$1,
	isConformingNamespaces: () => cs,
	isExpired: () => fi$1,
	isIframe: () => gr$1,
	isIos: () => Vs,
	isNode: () => Ye$1,
	isOnline: () => ja,
	isProposalStruct: () => wa,
	isReactNative: () => Bt$1,
	isRecap: () => pn$1,
	isSessionCompatible: () => ya,
	isSessionStruct: () => xa,
	isTelegram: () => pr$1,
	isTestRun: () => hi$1,
	isTypeOneEnvelope: () => Jc,
	isTypeTwoEnvelope: () => Qc,
	isUndefined: () => kt$1,
	isValidAccountId: () => ts,
	isValidAccounts: () => rs,
	isValidActions: () => ss,
	isValidArray: () => me$1,
	isValidChainId: () => we$1,
	isValidChains: () => es,
	isValidController: () => va,
	isValidEip1271Signature: () => jr$1,
	isValidEip191Signature: () => Lr$1,
	isValidErrorReason: () => Sa,
	isValidEvent: () => Ua,
	isValidId: () => Ia,
	isValidNamespaceAccounts: () => os,
	isValidNamespaceActions: () => Dn$1,
	isValidNamespaceChains: () => ns,
	isValidNamespaceMethodsOrEvents: () => Hn$1,
	isValidNamespaces: () => is,
	isValidNamespacesChainId: () => _a,
	isValidNamespacesEvent: () => Ra,
	isValidNamespacesRequest: () => Ta,
	isValidNumber: () => qe$1,
	isValidObject: () => Ve$1,
	isValidParams: () => Aa,
	isValidRecap: () => bt,
	isValidRelay: () => fs,
	isValidRelays: () => Ba,
	isValidRequest: () => Na,
	isValidRequestExpiry: () => La,
	isValidRequiredNamespaces: () => Ea,
	isValidResponse: () => Oa,
	isValidString: () => it,
	isValidUrl: () => ma,
	mapEntries: () => Js$1,
	mapToObj: () => Ys$1,
	mergeArrays: () => ct,
	mergeEncodedRecaps: () => Bf,
	mergeRecaps: () => Xr$1,
	mergeRequiredAndOptionalNamespaces: () => ba,
	normalizeNamespaces: () => ye$1,
	objToMap: () => Xs$1,
	openDeeplink: () => hr,
	parseAccountId: () => ze,
	parseChainId: () => Fe$1,
	parseContextNames: () => ar$1,
	parseExpirerTarget: () => si$1,
	parseNamespaceKey: () => Yo$1,
	parseRelayParams: () => Vo$1,
	parseTopic: () => qo$1,
	parseUri: () => ra,
	populateAppMetadata: () => Ks,
	populateAuthPayload: () => wf,
	recapHasResource: () => xf,
	serialize: () => kn$1,
	sleep: () => pi$1,
	ss58AddressToPublicKey: () => gs,
	subscribeToBrowserNetworkChange: () => hs,
	subscribeToNetworkChange: () => ka,
	subscribeToReactNativeNetworkChange: () => ps,
	toBase64: () => br$1,
	uuidv4: () => di$1,
	validateDecoding: () => Xc,
	validateEncoding: () => Ho$1,
	validateSignedCacao: () => yf,
	verifyP256Jwt: () => ta$1,
	verifySignature: () => Cr$1
});
function Fe$1(t) {
	const [e, n] = t.split(xe$1);
	return {
		namespace: e,
		reference: n
	};
}
function Gn$1(t) {
	const { namespace: e, reference: n } = t;
	return [e, n].join(xe$1);
}
function ze(t) {
	const [e, n, r] = t.split(xe$1);
	return {
		namespace: e,
		reference: n,
		address: r
	};
}
function Zn$1(t) {
	const { namespace: e, reference: n, address: r } = t;
	return [
		e,
		n,
		r
	].join(xe$1);
}
function Ge$1(t, e) {
	const n = [];
	return t.forEach((r) => {
		const o = e(r);
		n.includes(o) || n.push(o);
	}), n;
}
function Wn$1(t) {
	const { address: e } = ze(t);
	return e;
}
function Yn$1(t) {
	const { namespace: e, reference: n } = ze(t);
	return Gn$1({
		namespace: e,
		reference: n
	});
}
function Os(t, e) {
	const { namespace: n, reference: r } = Fe$1(e);
	return Zn$1({
		namespace: n,
		reference: r,
		address: t
	});
}
function Us(t) {
	return Ge$1(t, Wn$1);
}
function Xn$1(t) {
	return Ge$1(t, Yn$1);
}
function _s(t, e = []) {
	const n = [];
	return Object.keys(t).forEach((r) => {
		if (e.length && !e.includes(r)) return;
		const o = t[r];
		n.push(...o.accounts);
	}), n;
}
function Ts(t, e = []) {
	const n = [];
	return Object.keys(t).forEach((r) => {
		if (e.length && !e.includes(r)) return;
		const o = t[r];
		n.push(...Xn$1(o.accounts));
	}), n;
}
function Rs(t, e = []) {
	const n = [];
	return Object.keys(t).forEach((r) => {
		if (e.length && !e.includes(r)) return;
		const o = t[r];
		n.push(...ve$1(r, o));
	}), n;
}
function ve$1(t, e) {
	return t.includes(":") ? [t] : e.chains || [];
}
function Ye$1() {
	return typeof process < "u" && typeof process.versions < "u" && typeof process.versions.node < "u";
}
function Bt$1() {
	return !(0, import_cjs$4.getDocument)() && !!(0, import_cjs$4.getNavigator)() && navigator.product === "ReactNative";
}
function Ms() {
	return Bt$1() && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u" && (global == null ? void 0 : global.Platform.OS) === "android";
}
function Vs() {
	return Bt$1() && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u" && (global == null ? void 0 : global.Platform.OS) === "ios";
}
function zt$1() {
	return !Ye$1() && !!(0, import_cjs$4.getNavigator)() && !!(0, import_cjs$4.getDocument)();
}
function Pt$1() {
	return Bt$1() ? J$1.reactNative : Ye$1() ? J$1.node : zt$1() ? J$1.browser : J$1.unknown;
}
function qs() {
	var t;
	try {
		return Bt$1() && typeof global < "u" && typeof (global == null ? void 0 : global.Application) < "u" ? (t = global.Application) == null ? void 0 : t.applicationId : void 0;
	} catch {
		return;
	}
}
function or$1(t, e) {
	const n = new URLSearchParams(t);
	for (const r of Object.keys(e).sort()) if (e.hasOwnProperty(r)) {
		const o = e[r];
		o !== void 0 && n.set(r, o);
	}
	return n.toString();
}
function Ks(t) {
	var e, n;
	const r = sr$1();
	try {
		return t != null && t.url && r.url && new URL(t.url).host !== new URL(r.url).host && (console.warn(`The configured WalletConnect 'metadata.url':${t.url} differs from the actual page url:${r.url}. This is probably unintended and can lead to issues.`), t.url = r.url), (e = t?.icons) != null && e.length && t.icons.length > 0 && (t.icons = t.icons.filter((o) => o !== "")), Ps(Qn$1(Qn$1({}, r), t), {
			url: t?.url || r.url,
			name: t?.name || r.name,
			description: t?.description || r.description,
			icons: (n = t?.icons) != null && n.length && t.icons.length > 0 ? t.icons : r.icons
		});
	} catch (o) {
		return console.warn("Error populating app metadata", o), t || r;
	}
}
function sr$1() {
	return (0, import_cjs$5.getWindowMetadata)() || {
		name: "",
		description: "",
		url: "",
		icons: [""]
	};
}
function Fs(t, e) {
	var n;
	const r = Pt$1(), o = {
		protocol: t,
		version: e,
		env: r
	};
	return r === "browser" && (o.host = ((n = (0, import_cjs$4.getLocation)()) == null ? void 0 : n.host) || "unknown"), o;
}
function ir$1() {
	if (Pt$1() === J$1.reactNative && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u") {
		const { OS: n, Version: r } = global.Platform;
		return [n, r].join("-");
	}
	const t = detect();
	if (t === null) return "unknown";
	const e = t.os ? t.os.replace(" ", "").toLowerCase() : "unknown";
	return t.type === "browser" ? [
		e,
		t.name,
		t.version
	].join("-") : [e, t.version].join("-");
}
function fr$1() {
	var t;
	const e = Pt$1();
	return e === J$1.browser ? [e, ((t = (0, import_cjs$4.getLocation)()) == null ? void 0 : t.host) || "unknown"].join(":") : e;
}
function cr$1(t, e, n) {
	const r = ir$1(), o = fr$1();
	return [
		[t, e].join("-"),
		["js", n].join("-"),
		r,
		o
	].join("/");
}
function zs({ protocol: t, version: e, relayUrl: n, sdkVersion: r, auth: o, projectId: s, useOnCloseEvent: i, bundleId: f, packageName: a }) {
	const l = n.split("?"), u = {
		auth: o,
		ua: cr$1(t, e, r),
		projectId: s,
		useOnCloseEvent: i || void 0,
		packageName: a || void 0,
		bundleId: f || void 0
	}, h = or$1(l[1] || "", u);
	return l[0] + "?" + h;
}
function Gs(t) {
	let e = (t.match(/^[^:]+(?=:\/\/)/gi) || [])[0];
	const n = typeof e < "u" ? t.split("://")[1] : t;
	return e = e === "wss" ? "https" : "http", [e, n].join("://");
}
function Zs$1(t, e, n) {
	if (!t[e] || typeof t[e] !== n) throw new Error(`Missing or invalid "${e}" param`);
}
function ar$1(t, e = 2) {
	return ur$1(t.split("/"), e);
}
function Ws(t) {
	return ar$1(t).join(" ");
}
function It$1(t, e) {
	return t.filter((n) => e.includes(n)).length === t.length;
}
function ur$1(t, e = 2) {
	return t.slice(Math.max(t.length - e, 0));
}
function Ys$1(t) {
	return Object.fromEntries(t.entries());
}
function Xs$1(t) {
	return new Map(Object.entries(t));
}
function Js$1(t, e) {
	const n = {};
	return Object.keys(t).forEach((r) => {
		n[r] = e(t[r]);
	}), n;
}
function lr$1(t) {
	return t.trim().replace(/^\w/, (e) => e.toUpperCase());
}
function ti$1(t) {
	return t.split(" ").map((e) => lr$1(e)).join(" ");
}
function ei$1(t = import_cjs$3.FIVE_MINUTES, e) {
	const n = (0, import_cjs$3.toMiliseconds)(t || import_cjs$3.FIVE_MINUTES);
	let r, o, s, i;
	return {
		resolve: (f) => {
			s && r && (clearTimeout(s), r(f), i = Promise.resolve(f));
		},
		reject: (f) => {
			s && o && (clearTimeout(s), o(f));
		},
		done: () => new Promise((f, a) => {
			if (i) return f(i);
			s = setTimeout(() => {
				const l = new Error(e);
				i = Promise.reject(l), a(l);
			}, n), r = f, o = a;
		})
	};
}
function ni$1(t, e, n) {
	return new Promise(async (r, o) => {
		const s = setTimeout(() => o(new Error(n)), e);
		try {
			r(await t);
		} catch (i) {
			o(i);
		}
		clearTimeout(s);
	});
}
function Xe$1(t, e) {
	if (typeof e == "string" && e.startsWith(`${t}:`)) return e;
	if (t.toLowerCase() === "topic") {
		if (typeof e != "string") throw new Error("Value must be \"string\" for expirer target type: topic");
		return `topic:${e}`;
	} else if (t.toLowerCase() === "id") {
		if (typeof e != "number") throw new Error("Value must be \"number\" for expirer target type: id");
		return `id:${e}`;
	}
	throw new Error(`Unknown expirer target type: ${t}`);
}
function ri$1(t) {
	return Xe$1("topic", t);
}
function oi$1(t) {
	return Xe$1("id", t);
}
function si$1(t) {
	const [e, n] = t.split(":"), r = {
		id: void 0,
		topic: void 0
	};
	if (e === "topic" && typeof n == "string") r.topic = n;
	else if (e === "id" && Number.isInteger(Number(n))) r.id = Number(n);
	else throw new Error(`Invalid target, expected id:number or topic:string, got ${e}:${n}`);
	return r;
}
function ii$1(t, e) {
	return (0, import_cjs$3.fromMiliseconds)((e || Date.now()) + (0, import_cjs$3.toMiliseconds)(t));
}
function fi$1(t) {
	return Date.now() >= (0, import_cjs$3.toMiliseconds)(t);
}
function ci$1(t, e) {
	return `${t}${e ? `:${e}` : ""}`;
}
function ct(t = [], e = []) {
	return [...new Set([...t, ...e])];
}
async function ai$1({ id: t, topic: e, wcDeepLink: n }) {
	var r;
	try {
		if (!n) return;
		const s = (typeof n == "string" ? JSON.parse(n) : n)?.href;
		if (typeof s != "string") return;
		const i = dr$1(s, t, e), f = Pt$1();
		if (f === J$1.browser) {
			if (!((r = (0, import_cjs$4.getDocument)()) != null && r.hasFocus())) {
				console.warn("Document does not have focus, skipping deeplink.");
				return;
			}
			hr(i);
		} else f === J$1.reactNative && typeof (global == null ? void 0 : global.Linking) < "u" && await global.Linking.openURL(i);
	} catch (o) {
		console.error(o);
	}
}
function dr$1(t, e, n) {
	const r = `requestId=${e}&sessionTopic=${n}`;
	t.endsWith("/") && (t = t.slice(0, -1));
	let o = `${t}`;
	if (t.startsWith("https://t.me")) {
		const s = t.includes("?") ? "&startapp=" : "?startapp=";
		o = `${o}${s}${br$1(r, !0)}`;
	} else o = `${o}/wc?${r}`;
	return o;
}
function hr(t) {
	let e = "_self";
	gr$1() ? e = "_top" : (pr$1() || t.startsWith("https://") || t.startsWith("http://")) && (e = "_blank"), window.open(t, e, "noreferrer noopener");
}
async function ui$1(t, e) {
	let n = "";
	try {
		if (zt$1() && (n = localStorage.getItem(e), n)) return n;
		n = await t.getItem(e);
	} catch (r) {
		console.error(r);
	}
	return n;
}
function Je$1(t, e) {
	return t.filter((n) => e.includes(n));
}
function li$1(t, e) {
	if (!t.includes(e)) return null;
	const n = t.split(/([&,?,=])/);
	return n[n.indexOf(e) + 2];
}
function di$1() {
	return typeof crypto < "u" && crypto != null && crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu, (t) => {
		const e = Math.random() * 16 | 0;
		return (t === "x" ? e : e & 3 | 8).toString(16);
	});
}
function hi$1() {
	return typeof process < "u" && process.env.IS_VITEST === "true";
}
function pr$1() {
	return typeof window < "u" && (!!window.TelegramWebviewProxy || !!window.Telegram || !!window.TelegramWebviewProxyProto);
}
function gr$1() {
	try {
		return window.self !== window.top;
	} catch {
		return !1;
	}
}
function br$1(t, e = !1) {
	const n = Buffer.from(t).toString("base64");
	return e ? n.replace(/[=]/g, "") : n;
}
function Qe$1(t) {
	return Buffer.from(t, "base64").toString("utf-8");
}
function pi$1(t) {
	return new Promise((e) => setTimeout(e, t));
}
function mr$1(t, e = !1) {
	return e ? {
		h: Number(t & Be$1),
		l: Number(t >> yr$1 & Be$1)
	} : {
		h: Number(t >> yr$1 & Be$1) | 0,
		l: Number(t & Be$1) | 0
	};
}
function wr$1(t, e = !1) {
	const n = t.length;
	let r = new Uint32Array(n), o = new Uint32Array(n);
	for (let s = 0; s < n; s++) {
		const { h: i, l: f } = mr$1(t[s], e);
		[r[s], o[s]] = [i, f];
	}
	return [r, o];
}
function dt(t, e, n, r) {
	const o = (e >>> 0) + (r >>> 0);
	return {
		h: t + n + (o / 2 ** 32 | 0) | 0,
		l: o | 0
	};
}
function nn(t) {
	return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function mt(t) {
	if (!Number.isSafeInteger(t) || t < 0) throw new Error("positive integer expected, got " + t);
}
function at(t, ...e) {
	if (!nn(t)) throw new Error("Uint8Array expected");
	if (e.length > 0 && !e.includes(t.length)) throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function rn$1(t) {
	if (typeof t != "function" || typeof t.create != "function") throw new Error("Hash should be wrapped by utils.createHasher");
	mt(t.outputLen), mt(t.blockLen);
}
function Nt$1(t, e = !0) {
	if (t.destroyed) throw new Error("Hash instance has been destroyed");
	if (e && t.finished) throw new Error("Hash#digest() has already been called");
}
function on$1(t, e) {
	at(t);
	const n = e.outputLen;
	if (t.length < n) throw new Error("digestInto() expects output buffer of length at least " + n);
}
function fe$1(t) {
	return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function ut(...t) {
	for (let e = 0; e < t.length; e++) t[e].fill(0);
}
function sn$1(t) {
	return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function gt(t, e) {
	return t << 32 - e | t >>> e;
}
function Br$1(t) {
	return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
function Si$1(t) {
	for (let e = 0; e < t.length; e++) t[e] = Br$1(t[e]);
	return t;
}
function ce$1(t) {
	if (at(t), Ir$1) return t.toHex();
	let e = "";
	for (let n = 0; n < t.length; n++) e += Ni$1[t[n]];
	return e;
}
function Ar$1(t) {
	if (t >= xt$1._0 && t <= xt$1._9) return t - xt$1._0;
	if (t >= xt$1.A && t <= xt$1.F) return t - (xt$1.A - 10);
	if (t >= xt$1.a && t <= xt$1.f) return t - (xt$1.a - 10);
}
function fn$1(t) {
	if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
	if (Ir$1) return Uint8Array.fromHex(t);
	const e = t.length, n = e / 2;
	if (e % 2) throw new Error("hex string expected, got unpadded hex of length " + e);
	const r = new Uint8Array(n);
	for (let o = 0, s = 0; o < n; o++, s += 2) {
		const i = Ar$1(t.charCodeAt(s)), f = Ar$1(t.charCodeAt(s + 1));
		if (i === void 0 || f === void 0) {
			const a = t[s] + t[s + 1];
			throw new Error("hex string expected, got non-hex character \"" + a + "\" at index " + s);
		}
		r[o] = i * 16 + f;
	}
	return r;
}
function Oi$1(t) {
	if (typeof t != "string") throw new Error("string expected");
	return new Uint8Array(new TextEncoder().encode(t));
}
function ht(t) {
	return typeof t == "string" && (t = Oi$1(t)), at(t), t;
}
function Ht$1(...t) {
	let e = 0;
	for (let r = 0; r < t.length; r++) {
		const o = t[r];
		at(o), e += o.length;
	}
	const n = new Uint8Array(e);
	for (let r = 0, o = 0; r < t.length; r++) {
		const s = t[r];
		n.set(s, o), o += s.length;
	}
	return n;
}
function ae$1(t) {
	const e = (r) => t().update(ht(r)).digest(), n = t();
	return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Ui$1(t) {
	const e = (r, o) => t(o).update(ht(r)).digest(), n = t({});
	return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Zt$1(t = 32) {
	if (Gt$1 && typeof Gt$1.getRandomValues == "function") return Gt$1.getRandomValues(new Uint8Array(t));
	if (Gt$1 && typeof Gt$1.randomBytes == "function") return Uint8Array.from(Gt$1.randomBytes(t));
	throw new Error("crypto.getRandomValues must be defined");
}
function ki$1(t, e = 24) {
	const n = new Uint32Array(10);
	for (let r = 24 - e; r < 24; r++) {
		for (let i = 0; i < 10; i++) n[i] = t[i] ^ t[i + 10] ^ t[i + 20] ^ t[i + 30] ^ t[i + 40];
		for (let i = 0; i < 10; i += 2) {
			const f = (i + 8) % 10, a = (i + 2) % 10, l = n[a], c = n[a + 1], u = _r$1(l, c, 1) ^ n[f], h = Tr$1(l, c, 1) ^ n[f + 1];
			for (let g = 0; g < 50; g += 10) t[i + g] ^= u, t[i + g + 1] ^= h;
		}
		let o = t[2], s = t[3];
		for (let i = 0; i < 24; i++) {
			const f = Nr$1[i], a = _r$1(o, s, f), l = Tr$1(o, s, f), c = Sr$1[i];
			o = t[c], s = t[c + 1], t[c] = a, t[c + 1] = l;
		}
		for (let i = 0; i < 50; i += 10) {
			for (let f = 0; f < 10; f++) n[f] = t[i + f];
			for (let f = 0; f < 10; f++) t[i + f] ^= ~n[(f + 2) % 10] & n[(f + 4) % 10];
		}
		t[0] ^= Li$1[r], t[1] ^= ji$1[r];
	}
	ut(n);
}
function Di$1(t, e, n, r) {
	if (typeof t.setBigUint64 == "function") return t.setBigUint64(e, n, r);
	const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), f = Number(n & s), a = r ? 4 : 0, l = r ? 0 : 4;
	t.setUint32(e + a, i, r), t.setUint32(e + l, f, r);
}
function Mi$1(t, e, n) {
	return t & e ^ ~t & n;
}
function Vi$1(t, e, n) {
	return t & e ^ t & n ^ e & n;
}
function $t$1(t, e, n, r, o, s) {
	const i = o[s], f = o[s + 1];
	let a = N$1[2 * t], l = N$1[2 * t + 1], c = N$1[2 * e], u = N$1[2 * e + 1], h = N$1[2 * n], g = N$1[2 * n + 1], w = N$1[2 * r], y = N$1[2 * r + 1], x = tn$1(a, c, i);
	l = en$1(x, l, u, f), a = x | 0, {Dh: y, Dl: w} = {
		Dh: y ^ l,
		Dl: w ^ a
	}, {Dh: y, Dl: w} = {
		Dh: bi$1(y, w),
		Dl: yi$1(y)
	}, {h: g, l: h} = dt(g, h, y, w), {Bh: u, Bl: c} = {
		Bh: u ^ g,
		Bl: c ^ h
	}, {Bh: u, Bl: c} = {
		Bh: At$1(u, c, 24),
		Bl: St$1(u, c, 24)
	}, N$1[2 * t] = a, N$1[2 * t + 1] = l, N$1[2 * e] = c, N$1[2 * e + 1] = u, N$1[2 * n] = h, N$1[2 * n + 1] = g, N$1[2 * r] = w, N$1[2 * r + 1] = y;
}
function Ct$1(t, e, n, r, o, s) {
	const i = o[s], f = o[s + 1];
	let a = N$1[2 * t], l = N$1[2 * t + 1], c = N$1[2 * e], u = N$1[2 * e + 1], h = N$1[2 * n], g = N$1[2 * n + 1], w = N$1[2 * r], y = N$1[2 * r + 1], x = tn$1(a, c, i);
	l = en$1(x, l, u, f), a = x | 0, {Dh: y, Dl: w} = {
		Dh: y ^ l,
		Dl: w ^ a
	}, {Dh: y, Dl: w} = {
		Dh: At$1(y, w, 16),
		Dl: St$1(y, w, 16)
	}, {h: g, l: h} = dt(g, h, y, w), {Bh: u, Bl: c} = {
		Bh: u ^ g,
		Bl: c ^ h
	}, {Bh: u, Bl: c} = {
		Bh: se(u, c, 63),
		Bl: ie(u, c, 63)
	}, N$1[2 * t] = a, N$1[2 * t + 1] = l, N$1[2 * e] = c, N$1[2 * e + 1] = u, N$1[2 * n] = h, N$1[2 * n + 1] = g, N$1[2 * r] = w, N$1[2 * r + 1] = y;
}
function Qi$1(t, e = {}, n, r, o) {
	if (mt(n), t < 0 || t > n) throw new Error("outputLen bigger than keyLen");
	const { key: s, salt: i, personalization: f } = e;
	if (s !== void 0 && (s.length < 1 || s.length > n)) throw new Error("key length must be undefined or 1.." + n);
	if (i !== void 0 && i.length !== r) throw new Error("salt must be undefined or " + r);
	if (f !== void 0 && f.length !== o) throw new Error("personalization must be undefined or " + o);
}
function an$1(t) {
	const e = `Ethereum Signed Message:
${t.length}`, n = new TextEncoder().encode(e + t);
	return "0x" + Buffer.from(Hi$1(n)).toString("hex");
}
async function Cr$1(t, e, n, r, o, s) {
	switch (n.t) {
		case "eip191": return await Lr$1(t, e, n.s);
		case "eip1271": return await jr$1(t, e, n.s, r, o, s);
		default: throw new Error(`verifySignature failed: Attempted to verify CacaoSignature with unknown type: ${n.t}`);
	}
}
async function Lr$1(t, e, n) {
	return (await recoverAddress({
		hash: an$1(e),
		signature: n
	})).toLowerCase() === t.toLowerCase();
}
async function jr$1(t, e, n, r, o, s) {
	const i = Fe$1(r);
	if (!i.namespace || !i.reference) throw new Error(`isValidEip1271Signature failed: chainId must be in CAIP-2 format, received: ${r}`);
	try {
		const f = "0x1626ba7e", a = "0000000000000000000000000000000000000000000000000000000000000040", l = n.substring(2), c = (l.length / 2).toString(16).padStart(64, "0"), h = f + (e.startsWith("0x") ? e : an$1(e)).substring(2) + a + c + l, { result: w } = await (await fetch(`${s || rf}/?chainId=${r}&projectId=${o}`, {
			headers: { "Content-Type": "application/json" },
			method: "POST",
			body: JSON.stringify({
				id: of(),
				jsonrpc: "2.0",
				method: "eth_call",
				params: [{
					to: t,
					data: h
				}, "latest"]
			})
		})).json();
		return w ? w.slice(0, 10).toLowerCase() === f.toLowerCase() : !1;
	} catch (f) {
		return console.error("isValidEip1271Signature: ", f), !1;
	}
}
function of() {
	return Date.now() + Math.floor(Math.random() * 1e3);
}
function sf(t) {
	const e = atob(t), n = new Uint8Array(e.length);
	for (let i = 0; i < e.length; i++) n[i] = e.charCodeAt(i);
	const r = n[0];
	if (r === 0) throw new Error("No signatures found");
	const o = 1 + r * 64;
	if (n.length < o) throw new Error("Transaction data too short for claimed signature count");
	if (n.length < 100) throw new Error("Transaction too short");
	const s = Buffer.from(t, "base64").slice(1, 65);
	return esm_default.encode(s);
}
function ff(t) {
	const e = new Uint8Array(Buffer.from(t, "base64")), n = Array.from("TransactionData::").map((s) => s.charCodeAt(0)), r = new Uint8Array(n.length + e.length);
	r.set(n), r.set(e, n.length);
	const o = nf(r, { dkLen: 32 });
	return esm_default.encode(o);
}
function cf(t) {
	const e = new Uint8Array(Ae$1(kr$1(t)));
	return esm_default.encode(e);
}
function kr$1(t) {
	if (t instanceof Uint8Array) return t;
	if (Array.isArray(t)) return new Uint8Array(t);
	if (typeof t == "object" && t != null && t.data) return new Uint8Array(Object.values(t.data));
	if (typeof t == "object" && t) return new Uint8Array(Object.values(t));
	throw new Error("getNearUint8ArrayFromBytes: Unexpected result type from bytes array");
}
function af(t) {
	const n = decode$3(Buffer.from(t, "base64")).txn;
	if (!n) throw new Error("Invalid signed transaction: missing 'txn' field");
	const r = encode$4(n), o = Buffer.from("TX"), i = Xi(Buffer.concat([o, Buffer.from(r)]));
	return base32$1.encode(i).replace(/=+$/, "");
}
function un$1(t) {
	const e = [];
	let n = BigInt(t);
	for (; n >= BigInt(128);) e.push(Number(n & BigInt(127) | BigInt(128))), n >>= BigInt(7);
	return e.push(Number(n)), Buffer.from(e);
}
function uf(t) {
	const e = Buffer.from(t.signed.bodyBytes, "base64"), n = Buffer.from(t.signed.authInfoBytes, "base64"), r = Buffer.from(t.signature.signature, "base64"), o = [];
	o.push(Buffer.from([10])), o.push(un$1(e.length)), o.push(e), o.push(Buffer.from([18])), o.push(un$1(n.length)), o.push(n), o.push(Buffer.from([26])), o.push(un$1(r.length)), o.push(r);
	const i = Ae$1(Buffer.concat(o));
	return Buffer.from(i).toString("hex").toUpperCase();
}
async function yf(t) {
	const { cacao: e, projectId: n } = t, { s: r, p: o } = e, s = qr$1(o, o.iss);
	return await Cr$1(dn$1(o.iss), s, r, Vr$1(o.iss), n);
}
function mf(t, e, n) {
	return n.includes("did:pkh:") || (n = `did:pkh:${n}`), {
		h: { t: "caip122" },
		p: {
			iss: n,
			domain: t.domain,
			aud: t.aud,
			version: t.version,
			nonce: t.nonce,
			iat: t.iat,
			statement: t.statement,
			requestId: t.requestId,
			resources: t.resources,
			nbf: t.nbf,
			exp: t.exp
		},
		s: e
	};
}
function wf(t) {
	var e;
	const { authPayload: n, chains: r, methods: o } = t, s = n.statement || "";
	if (!(r != null && r.length)) return n;
	const i = n.chains, f = Je$1(i, r);
	if (!(f != null && f.length)) throw new Error("No supported chains");
	const a = Kr$1(n.resources);
	if (!a) return n;
	bt(a);
	const l = Fr$1(a, "eip155");
	let c = n?.resources || [];
	if (l != null && l.length) {
		const u = zr$1(l), h = Je$1(u, o);
		if (!(h != null && h.length)) throw new Error(`Supported methods don't satisfy the requested: ${JSON.stringify(u)}, supported: ${JSON.stringify(o)}`);
		const w = Yr$1(a, "eip155", hn$1("request", h, { chains: f }));
		c = ((e = n?.resources) == null ? void 0 : e.slice(0, -1)) || [], c.push(Ne(w));
	}
	return Dr$1(ln$1({}, n), {
		statement: Jr$1(s, Oe$1(c)),
		chains: f,
		resources: n != null && n.resources || c.length > 0 ? c : void 0
	});
}
function Kr$1(t) {
	const e = Oe$1(t);
	if (e && pn$1(e)) return Lt$1(e);
}
function xf(t, e) {
	var n;
	return (n = t?.att) == null ? void 0 : n.hasOwnProperty(e);
}
function Fr$1(t, e) {
	var n, r;
	return (n = t?.att) != null && n[e] ? Object.keys((r = t?.att) == null ? void 0 : r[e]) : [];
}
function vf(t) {
	return t?.map((e) => Object.keys(e)) || [];
}
function zr$1(t) {
	return t?.map((e) => {
		var n;
		return (n = e.split("/")) == null ? void 0 : n[1];
	}) || [];
}
function Gr$1(t) {
	return Buffer.from(JSON.stringify(t)).toString("base64");
}
function Zr$1(t) {
	return JSON.parse(Buffer.from(t, "base64").toString("utf-8"));
}
function bt(t) {
	if (!t) throw new Error("No recap provided, value is undefined");
	if (!t.att) throw new Error("No `att` property found");
	const e = Object.keys(t.att);
	if (!(e != null && e.length)) throw new Error("No resources found in `att` property");
	e.forEach((n) => {
		const r = t.att[n];
		if (Array.isArray(r)) throw new Error(`Resource must be an object: ${n}`);
		if (typeof r != "object") throw new Error(`Resource must be an object: ${n}`);
		if (!Object.keys(r).length) throw new Error(`Resource object is empty: ${n}`);
		Object.keys(r).forEach((o) => {
			const s = r[o];
			if (!Array.isArray(s)) throw new Error(`Ability limits ${o} must be an array of objects, found: ${s}`);
			if (!s.length) throw new Error(`Value of ${o} is empty array, must be an array with objects`);
			s.forEach((i) => {
				if (typeof i != "object") throw new Error(`Ability limits (${o}) must be an array of objects, found: ${i}`);
			});
		});
	});
}
function Wr$1(t, e, n, r = {}) {
	return n?.sort((o, s) => o.localeCompare(s)), { att: { [t]: hn$1(e, n, r) } };
}
function Yr$1(t, e, n) {
	var r;
	t.att[e] = ln$1({}, n);
	return ((r = Object.keys(t.att)) == null ? void 0 : r.sort((i, f) => i.localeCompare(f))).reduce((i, f) => (i.att[f] = t.att[f], i), { att: {} });
}
function hn$1(t, e, n = {}) {
	e = e?.sort((o, s) => o.localeCompare(s));
	const r = e.map((o) => ({ [`${t}/${o}`]: [n] }));
	return Object.assign({}, ...r);
}
function Ne(t) {
	return bt(t), `urn:recap:${Gr$1(t).replace(/=/g, "")}`;
}
function Lt$1(t) {
	const e = Zr$1(t.replace("urn:recap:", ""));
	return bt(e), e;
}
function Ef(t, e, n) {
	return Ne(Wr$1(t, e, n));
}
function pn$1(t) {
	return t && t.includes("urn:recap:");
}
function Bf(t, e) {
	return Ne(Xr$1(Lt$1(t), Lt$1(e)));
}
function Xr$1(t, e) {
	bt(t), bt(e);
	const n = Object.keys(t.att).concat(Object.keys(e.att)).sort((o, s) => o.localeCompare(s)), r = { att: {} };
	return n.forEach((o) => {
		var s, i;
		Object.keys(((s = t.att) == null ? void 0 : s[o]) || {}).concat(Object.keys(((i = e.att) == null ? void 0 : i[o]) || {})).sort((f, a) => f.localeCompare(a)).forEach((f) => {
			var a, l;
			r.att[o] = Dr$1(ln$1({}, r.att[o]), { [f]: ((a = t.att[o]) == null ? void 0 : a[f]) || ((l = e.att[o]) == null ? void 0 : l[f]) });
		});
	}), r;
}
function gn$1(t = "", e) {
	bt(e);
	const n = "I further authorize the stated URI to perform the following actions on my behalf: ";
	if (t.includes(n)) return t;
	const r = [];
	let o = 0;
	Object.keys(e.att).forEach((f) => {
		const a = Object.keys(e.att[f]).map((u) => ({
			ability: u.split("/")[0],
			action: u.split("/")[1]
		}));
		a.sort((u, h) => u.action.localeCompare(h.action));
		const l = {};
		a.forEach((u) => {
			l[u.ability] || (l[u.ability] = []), l[u.ability].push(u.action);
		});
		const c = Object.keys(l).map((u) => (o++, `(${o}) '${u}': '${l[u].join("', '")}' for '${f}'.`));
		r.push(c.join(", ").replace(".,", "."));
	});
	const i = `${n}${r.join(" ")}`;
	return `${t ? t + " " : ""}${i}`;
}
function If(t) {
	var e;
	const n = Lt$1(t);
	bt(n);
	const r = (e = n.att) == null ? void 0 : e.eip155;
	return r ? Object.keys(r).map((o) => o.split("/")[1]) : [];
}
function Af(t) {
	const e = Lt$1(t);
	bt(e);
	const n = [];
	return Object.values(e.att).forEach((r) => {
		Object.values(r).forEach((o) => {
			var s;
			(s = o?.[0]) != null && s.chains && n.push(o[0].chains);
		});
	}), [...new Set(n.flat())];
}
function Jr$1(t, e) {
	if (!e) return t;
	const n = Lt$1(e);
	return bt(n), gn$1(t, n);
}
function Oe$1(t) {
	if (!t) return;
	const e = t?.[t.length - 1];
	return pn$1(e) ? e : void 0;
}
/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */ function Qr$1(t) {
	return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function bn$1(t) {
	if (typeof t != "boolean") throw new Error(`boolean expected, not ${t}`);
}
function yn$1(t) {
	if (!Number.isSafeInteger(t) || t < 0) throw new Error("positive integer expected, got " + t);
}
function nt(t, ...e) {
	if (!Qr$1(t)) throw new Error("Uint8Array expected");
	if (e.length > 0 && !e.includes(t.length)) throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function to$1(t, e = !0) {
	if (t.destroyed) throw new Error("Hash instance has been destroyed");
	if (e && t.finished) throw new Error("Hash#digest() has already been called");
}
function Sf(t, e) {
	nt(t);
	const n = e.outputLen;
	if (t.length < n) throw new Error("digestInto() expects output buffer of length at least " + n);
}
function jt$1(t) {
	return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Wt$1(...t) {
	for (let e = 0; e < t.length; e++) t[e].fill(0);
}
function Nf(t) {
	return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Uf(t) {
	if (typeof t != "string") throw new Error("string expected");
	return new Uint8Array(new TextEncoder().encode(t));
}
function mn$1(t) {
	if (typeof t == "string") t = Uf(t);
	else if (Qr$1(t)) t = wn$1(t);
	else throw new Error("Uint8Array expected, got " + typeof t);
	return t;
}
function _f(t, e) {
	if (e == null || typeof e != "object") throw new Error("options must be defined");
	return Object.assign(t, e);
}
function Tf(t, e) {
	if (t.length !== e.length) return !1;
	let n = 0;
	for (let r = 0; r < t.length; r++) n |= t[r] ^ e[r];
	return n === 0;
}
function eo$1(t, e, n = !0) {
	if (e === void 0) return new Uint8Array(t);
	if (e.length !== t) throw new Error("invalid output length, expected " + t + ", got: " + e.length);
	if (n && !Cf(e)) throw new Error("invalid output, must be aligned");
	return e;
}
function no$1(t, e, n, r) {
	if (typeof t.setBigUint64 == "function") return t.setBigUint64(e, n, r);
	const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), f = Number(n & s), a = r ? 4 : 0, l = r ? 0 : 4;
	t.setUint32(e + a, i, r), t.setUint32(e + l, f, r);
}
function $f(t, e, n) {
	bn$1(n);
	const r = new Uint8Array(16), o = Nf(r);
	return no$1(o, 0, BigInt(e), n), no$1(o, 8, BigInt(t), n), r;
}
function Cf(t) {
	return t.byteOffset % 4 === 0;
}
function wn$1(t) {
	return Uint8Array.from(t);
}
function D(t, e) {
	return t << e | t >>> 32 - e;
}
function xn$1(t) {
	return t.byteOffset % 4 === 0;
}
function Df(t, e, n, r, o, s, i, f) {
	const a = o.length, l = new Uint8Array(Ue$1), c = jt$1(l), u = xn$1(o) && xn$1(s), h = u ? jt$1(o) : so$1, g = u ? jt$1(s) : so$1;
	for (let w = 0; w < a; i++) {
		if (t(e, n, r, c, i, f), i >= oo$1) throw new Error("arx: counter overflow");
		const y = Math.min(Ue$1, a - w);
		if (u && y === Ue$1) {
			const x = w / 4;
			if (w % 4 !== 0) throw new Error("arx: invalid block position");
			for (let R = 0, M; R < Hf; R++) M = x + R, g[M] = h[M] ^ c[R];
			w += Ue$1;
			continue;
		}
		for (let x = 0, R; x < y; x++) R = w + x, s[R] = o[R] ^ l[x];
		w += y;
	}
}
function Mf(t, e) {
	const { allowShortKeys: n, extendNonceFn: r, counterLength: o, counterRight: s, rounds: i } = _f({
		allowShortKeys: !1,
		counterLength: 8,
		counterRight: !1,
		rounds: 20
	}, e);
	if (typeof t != "function") throw new Error("core must be a function");
	return yn$1(o), yn$1(i), bn$1(s), bn$1(n), (f, a, l, c, u = 0) => {
		nt(f), nt(a), nt(l);
		const h = l.length;
		if (c === void 0 && (c = new Uint8Array(h)), nt(c), yn$1(u), u < 0 || u >= oo$1) throw new Error("arx: counter overflow");
		if (c.length < h) throw new Error(`arx: output (${c.length}) is shorter than data (${h})`);
		const g = [];
		let w = f.length, y, x;
		if (w === 32) g.push(y = wn$1(f)), x = Pf;
		else if (w === 16 && n) y = new Uint8Array(32), y.set(f), y.set(f, 16), x = kf, g.push(y);
		else throw new Error(`arx: invalid 32-byte key, got length=${w}`);
		xn$1(a) || g.push(a = wn$1(a));
		const R = jt$1(y);
		if (r) {
			if (a.length !== 24) throw new Error("arx: extended nonce must be 24 bytes");
			r(x, R, jt$1(a.subarray(0, 16)), R), a = a.subarray(16);
		}
		const M = 16 - o;
		if (M !== a.length) throw new Error(`arx: nonce must be ${M} or 16 bytes`);
		if (M !== 12) {
			const V = new Uint8Array(12);
			V.set(a, s ? 0 : 12 - a.length), a = V, g.push(a);
		}
		const L = jt$1(a);
		return Df(t, x, R, L, l, c, u, i), Wt$1(...g), c;
	};
}
function qf(t) {
	const e = (r, o) => t(o).update(mn$1(r)).digest(), n = t(new Uint8Array(32));
	return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Ff(t, e, n, r, o, s = 20) {
	let i = t[0], f = t[1], a = t[2], l = t[3], c = e[0], u = e[1], h = e[2], g = e[3], w = e[4], y = e[5], x = e[6], R = e[7], M = o, L = n[0], V = n[1], _ = n[2], k = i, j = f, $ = a, d = l, m = c, p = u, b = h, v = g, B = w, E = y, I = x, S = R, O = M, A = L, T = V, U = _;
	for (let H = 0; H < s; H += 2) k = k + m | 0, O = D(O ^ k, 16), B = B + O | 0, m = D(m ^ B, 12), k = k + m | 0, O = D(O ^ k, 8), B = B + O | 0, m = D(m ^ B, 7), j = j + p | 0, A = D(A ^ j, 16), E = E + A | 0, p = D(p ^ E, 12), j = j + p | 0, A = D(A ^ j, 8), E = E + A | 0, p = D(p ^ E, 7), $ = $ + b | 0, T = D(T ^ $, 16), I = I + T | 0, b = D(b ^ I, 12), $ = $ + b | 0, T = D(T ^ $, 8), I = I + T | 0, b = D(b ^ I, 7), d = d + v | 0, U = D(U ^ d, 16), S = S + U | 0, v = D(v ^ S, 12), d = d + v | 0, U = D(U ^ d, 8), S = S + U | 0, v = D(v ^ S, 7), k = k + p | 0, U = D(U ^ k, 16), I = I + U | 0, p = D(p ^ I, 12), k = k + p | 0, U = D(U ^ k, 8), I = I + U | 0, p = D(p ^ I, 7), j = j + b | 0, O = D(O ^ j, 16), S = S + O | 0, b = D(b ^ S, 12), j = j + b | 0, O = D(O ^ j, 8), S = S + O | 0, b = D(b ^ S, 7), $ = $ + v | 0, A = D(A ^ $, 16), B = B + A | 0, v = D(v ^ B, 12), $ = $ + v | 0, A = D(A ^ $, 8), B = B + A | 0, v = D(v ^ B, 7), d = d + m | 0, T = D(T ^ d, 16), E = E + T | 0, m = D(m ^ E, 12), d = d + m | 0, T = D(T ^ d, 8), E = E + T | 0, m = D(m ^ E, 7);
	let C = 0;
	r[C++] = i + k | 0, r[C++] = f + j | 0, r[C++] = a + $ | 0, r[C++] = l + d | 0, r[C++] = c + m | 0, r[C++] = u + p | 0, r[C++] = h + b | 0, r[C++] = g + v | 0, r[C++] = w + B | 0, r[C++] = y + E | 0, r[C++] = x + I | 0, r[C++] = R + S | 0, r[C++] = M + O | 0, r[C++] = L + A | 0, r[C++] = V + T | 0, r[C++] = _ + U | 0;
}
function fo$1(t, e, n, r, o) {
	const s = t(e, n, Zf), i = Kf.create(s);
	o && io$1(i, o), io$1(i, r);
	const f = $f(r.length, o ? o.length : 0, !0);
	i.update(f);
	const a = i.digest();
	return Wt$1(s, f), a;
}
function Yf(t, e, n) {
	return rn$1(t), n === void 0 && (n = new Uint8Array(t.outputLen)), _e(t, ht(n), ht(e));
}
function Xf(t, e, n, r = 32) {
	rn$1(t), mt(r);
	const o = t.outputLen;
	if (r > 255 * o) throw new Error("Length should be <= 255*HashLen");
	const s = Math.ceil(r / o);
	n === void 0 && (n = uo$1);
	const i = new Uint8Array(s * o), f = _e.create(t, e), a = f._cloneInto(), l = new Uint8Array(f.outputLen);
	for (let c = 0; c < s; c++) vn[0] = c + 1, a.update(c === 0 ? uo$1 : l).update(n).update(vn).digestInto(l), i.set(l, o * c), f._cloneInto(a);
	return f.destroy(), a.destroy(), ut(l, vn), i.slice(0, r);
}
function Re$1(t, e) {
	if (typeof e != "boolean") throw new Error(t + " boolean expected, got " + e);
}
function $e(t) {
	const e = t.toString(16);
	return e.length & 1 ? "0" + e : e;
}
function lo$1(t) {
	if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
	return t === "" ? En$1 : BigInt("0x" + t);
}
function Ce(t) {
	return lo$1(ce$1(t));
}
function Le(t) {
	return at(t), lo$1(ce$1(Uint8Array.from(t).reverse()));
}
function In$1(t, e) {
	return fn$1(t.toString(16).padStart(e * 2, "0"));
}
function An$1(t, e) {
	return In$1(t, e).reverse();
}
function rt$1(t, e, n) {
	let r;
	if (typeof e == "string") try {
		r = fn$1(e);
	} catch (s) {
		throw new Error(t + " must be hex string or Uint8Array, cause: " + s);
	}
	else if (nn(e)) r = Uint8Array.from(e);
	else throw new Error(t + " must be hex string or Uint8Array");
	const o = r.length;
	if (typeof n == "number" && o !== n) throw new Error(t + " of length " + n + " expected, got " + o);
	return r;
}
function Qf(t, e, n) {
	return Sn(t) && Sn(e) && Sn(n) && e <= t && t < n;
}
function Nn$1(t, e, n, r) {
	if (!Qf(e, n, r)) throw new Error("expected valid " + t + ": " + n + " <= n < " + r + ", got " + e);
}
function tc(t) {
	let e;
	for (e = 0; t > En$1; t >>= Bn$1, e += 1);
	return e;
}
function ec(t, e, n) {
	if (typeof t != "number" || t < 2) throw new Error("hashLen must be a number");
	if (typeof e != "number" || e < 2) throw new Error("qByteLen must be a number");
	if (typeof n != "function") throw new Error("hmacFn must be a function");
	const r = (g) => new Uint8Array(g), o = (g) => Uint8Array.of(g);
	let s = r(t), i = r(t), f = 0;
	const a = () => {
		s.fill(1), i.fill(0), f = 0;
	}, l = (...g) => n(i, s, ...g), c = (g = r(0)) => {
		i = l(o(0), g), s = l(), g.length !== 0 && (i = l(o(1), g), s = l());
	}, u = () => {
		if (f++ >= 1e3) throw new Error("drbg: tried 1000 values");
		let g = 0;
		const w = [];
		for (; g < e;) {
			s = l();
			const y = s.slice();
			w.push(y), g += s.length;
		}
		return Ht$1(...w);
	};
	return (g, w) => {
		a(), c(g);
		let y;
		for (; !(y = w(u()));) c();
		return a(), y;
	};
}
function ke(t, e, n = {}) {
	if (!t || typeof t != "object") throw new Error("expected valid options object");
	function r(o, s, i) {
		const f = t[o];
		if (i && f === void 0) return;
		const a = typeof f;
		if (a !== s || f === null) throw new Error(`param "${o}" is invalid: expected ${s}, got ${a}`);
	}
	Object.entries(e).forEach(([o, s]) => r(o, s, !1)), Object.entries(n).forEach(([o, s]) => r(o, s, !0));
}
function ho$1(t) {
	const e = /* @__PURE__ */ new WeakMap();
	return (n, ...r) => {
		const o = e.get(n);
		if (o !== void 0) return o;
		const s = t(n, ...r);
		return e.set(n, s), s;
	};
}
function lt(t, e) {
	const n = t % e;
	return n >= ot ? n : e + n;
}
function pt(t, e, n) {
	let r = t;
	for (; e-- > ot;) r *= r, r %= n;
	return r;
}
function yo$1(t, e) {
	if (t === ot) throw new Error("invert: expected non-zero number");
	if (e <= ot) throw new Error("invert: expected positive modulus, got " + e);
	let n = lt(t, e), r = e, o = ot, s = Q$1;
	for (; n !== ot;) {
		const f = r / n, a = r % n, l = o - s * f;
		r = n, n = a, o = s, s = l;
	}
	if (r !== Q$1) throw new Error("invert: does not exist");
	return lt(o, e);
}
function mo$1(t, e) {
	const n = (t.ORDER + Q$1) / po$1, r = t.pow(e, n);
	if (!t.eql(t.sqr(r), e)) throw new Error("Cannot find square root");
	return r;
}
function rc(t, e) {
	const n = (t.ORDER - go$1) / bo$1, r = t.mul(e, Dt), o = t.pow(r, n), s = t.mul(e, o), i = t.mul(t.mul(s, Dt), o), f = t.mul(s, t.sub(i, t.ONE));
	if (!t.eql(t.sqr(f), e)) throw new Error("Cannot find square root");
	return f;
}
function oc(t) {
	if (t < BigInt(3)) throw new Error("sqrt is not defined for small field");
	let e = t - Q$1, n = 0;
	for (; e % Dt === ot;) e /= Dt, n++;
	let r = Dt;
	const o = Yt$1(t);
	for (; xo$1(o, r) === 1;) if (r++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
	if (n === 1) return mo$1;
	let s = o.pow(r, e);
	const i = (e + Q$1) / Dt;
	return function(a, l) {
		if (a.is0(l)) return l;
		if (xo$1(a, l) !== 1) throw new Error("Cannot find square root");
		let c = n, u = a.mul(a.ONE, s), h = a.pow(l, e), g = a.pow(l, i);
		for (; !a.eql(h, a.ONE);) {
			if (a.is0(h)) return a.ZERO;
			let w = 1, y = a.sqr(h);
			for (; !a.eql(y, a.ONE);) if (w++, y = a.sqr(y), w === c) throw new Error("Cannot find square root");
			const x = Q$1 << BigInt(c - w - 1), R = a.pow(u, x);
			c = w, u = a.sqr(R), h = a.mul(h, u), g = a.mul(g, R);
		}
		return g;
	};
}
function sc(t) {
	return t % po$1 === nc ? mo$1 : t % bo$1 === go$1 ? rc : oc(t);
}
function fc(t) {
	return ke(t, ic.reduce((r, o) => (r[o] = "function", r), {
		ORDER: "bigint",
		MASK: "bigint",
		BYTES: "number",
		BITS: "number"
	})), t;
}
function cc(t, e, n) {
	if (n < ot) throw new Error("invalid exponent, negatives unsupported");
	if (n === ot) return t.ONE;
	if (n === Q$1) return e;
	let r = t.ONE, o = e;
	for (; n > ot;) n & Q$1 && (r = t.mul(r, o)), o = t.sqr(o), n >>= Q$1;
	return r;
}
function wo$1(t, e, n = !1) {
	const r = new Array(e.length).fill(n ? t.ZERO : void 0), o = e.reduce((i, f, a) => t.is0(f) ? i : (r[a] = i, t.mul(i, f)), t.ONE), s = t.inv(o);
	return e.reduceRight((i, f, a) => t.is0(f) ? i : (r[a] = t.mul(i, r[a]), t.mul(i, f)), s), r;
}
function xo$1(t, e) {
	const n = (t.ORDER - Q$1) / Dt, r = t.pow(e, n), o = t.eql(r, t.ONE), s = t.eql(r, t.ZERO), i = t.eql(r, t.neg(t.ONE));
	if (!o && !s && !i) throw new Error("invalid Legendre symbol result");
	return o ? 1 : s ? 0 : -1;
}
function ac(t, e) {
	e !== void 0 && mt(e);
	const n = e !== void 0 ? e : t.toString(2).length;
	return {
		nBitLength: n,
		nByteLength: Math.ceil(n / 8)
	};
}
function Yt$1(t, e, n = !1, r = {}) {
	if (t <= ot) throw new Error("invalid field: expected ORDER > 0, got " + t);
	let o, s;
	if (typeof e == "object" && e != null) {
		if (r.sqrt || n) throw new Error("cannot specify opts in two arguments");
		const c = e;
		c.BITS && (o = c.BITS), c.sqrt && (s = c.sqrt), typeof c.isLE == "boolean" && (n = c.isLE);
	} else typeof e == "number" && (o = e), r.sqrt && (s = r.sqrt);
	const { nBitLength: i, nByteLength: f } = ac(t, o);
	if (f > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
	let a;
	const l = Object.freeze({
		ORDER: t,
		isLE: n,
		BITS: i,
		BYTES: f,
		MASK: je(i),
		ZERO: ot,
		ONE: Q$1,
		create: (c) => lt(c, t),
		isValid: (c) => {
			if (typeof c != "bigint") throw new Error("invalid field element: expected bigint, got " + typeof c);
			return ot <= c && c < t;
		},
		is0: (c) => c === ot,
		isValidNot0: (c) => !l.is0(c) && l.isValid(c),
		isOdd: (c) => (c & Q$1) === Q$1,
		neg: (c) => lt(-c, t),
		eql: (c, u) => c === u,
		sqr: (c) => lt(c * c, t),
		add: (c, u) => lt(c + u, t),
		sub: (c, u) => lt(c - u, t),
		mul: (c, u) => lt(c * u, t),
		pow: (c, u) => cc(l, c, u),
		div: (c, u) => lt(c * yo$1(u, t), t),
		sqrN: (c) => c * c,
		addN: (c, u) => c + u,
		subN: (c, u) => c - u,
		mulN: (c, u) => c * u,
		inv: (c) => yo$1(c, t),
		sqrt: s || ((c) => (a || (a = sc(t)), a(l, c))),
		toBytes: (c) => n ? An$1(c, f) : In$1(c, f),
		fromBytes: (c) => {
			if (c.length !== f) throw new Error("Field.fromBytes: expected " + f + " bytes, got " + c.length);
			return n ? Le(c) : Ce(c);
		},
		invertBatch: (c) => wo$1(l, c),
		cmov: (c, u, h) => h ? u : c
	});
	return Object.freeze(l);
}
function vo$1(t) {
	if (typeof t != "bigint") throw new Error("field order must be bigint");
	const e = t.toString(2).length;
	return Math.ceil(e / 8);
}
function Eo$1(t) {
	const e = vo$1(t);
	return e + Math.ceil(e / 2);
}
function uc(t, e, n = !1) {
	const r = t.length, o = vo$1(e), s = Eo$1(e);
	if (r < 16 || r < s || r > 1024) throw new Error("expected " + s + "-1024 bytes of input, got " + r);
	const f = lt(n ? Le(t) : Ce(t), e - Q$1) + Q$1;
	return n ? An$1(f, o) : In$1(f, o);
}
function le$1(t, e) {
	const n = e.negate();
	return t ? n : e;
}
function lc(t, e, n) {
	const r = e === "pz" ? (i) => i.pz : (i) => i.ez, o = wo$1(t.Fp, n.map(r));
	return n.map((i, f) => i.toAffine(o[f])).map(t.fromAffine);
}
function Bo$1(t, e) {
	if (!Number.isSafeInteger(t) || t <= 0 || t > e) throw new Error("invalid window size, expected [1.." + e + "], got W=" + t);
}
function On$1(t, e) {
	Bo$1(t, e);
	const n = Math.ceil(e / t) + 1, r = 2 ** (t - 1), o = 2 ** t;
	return {
		windows: n,
		windowSize: r,
		mask: je(t),
		maxNumber: o,
		shiftBy: BigInt(t)
	};
}
function Io$1(t, e, n) {
	const { windowSize: r, mask: o, maxNumber: s, shiftBy: i } = n;
	let f = Number(t & o), a = t >> i;
	f > r && (f -= s, a += Mt$1);
	const l = e * r, c = l + Math.abs(f) - 1, u = f === 0, h = f < 0, g = e % 2 !== 0;
	return {
		nextN: a,
		offset: c,
		isZero: u,
		isNeg: h,
		isNegF: g,
		offsetF: l
	};
}
function dc(t, e) {
	if (!Array.isArray(t)) throw new Error("array expected");
	t.forEach((n, r) => {
		if (!(n instanceof e)) throw new Error("invalid point at index " + r);
	});
}
function hc(t, e) {
	if (!Array.isArray(t)) throw new Error("array of scalars expected");
	t.forEach((n, r) => {
		if (!e.isValid(n)) throw new Error("invalid scalar at index " + r);
	});
}
function _n$1(t) {
	return Ao$1.get(t) || 1;
}
function So$1(t) {
	if (t !== Xt$1) throw new Error("invalid wNAF");
}
function pc(t, e) {
	return {
		constTimeNegate: le$1,
		hasPrecomputes(n) {
			return _n$1(n) !== 1;
		},
		unsafeLadder(n, r, o = t.ZERO) {
			let s = n;
			for (; r > Xt$1;) r & Mt$1 && (o = o.add(s)), s = s.double(), r >>= Mt$1;
			return o;
		},
		precomputeWindow(n, r) {
			const { windows: o, windowSize: s } = On$1(r, e), i = [];
			let f = n, a = f;
			for (let l = 0; l < o; l++) {
				a = f, i.push(a);
				for (let c = 1; c < s; c++) a = a.add(f), i.push(a);
				f = a.double();
			}
			return i;
		},
		wNAF(n, r, o) {
			let s = t.ZERO, i = t.BASE;
			const f = On$1(n, e);
			for (let a = 0; a < f.windows; a++) {
				const { nextN: l, offset: c, isZero: u, isNeg: h, isNegF: g, offsetF: w } = Io$1(o, a, f);
				o = l, u ? i = i.add(le$1(g, r[w])) : s = s.add(le$1(h, r[c]));
			}
			return So$1(o), {
				p: s,
				f: i
			};
		},
		wNAFUnsafe(n, r, o, s = t.ZERO) {
			const i = On$1(n, e);
			for (let f = 0; f < i.windows && o !== Xt$1; f++) {
				const { nextN: a, offset: l, isZero: c, isNeg: u } = Io$1(o, f, i);
				if (o = a, !c) {
					const h = r[l];
					s = s.add(u ? h.negate() : h);
				}
			}
			return So$1(o), s;
		},
		getPrecomputes(n, r, o) {
			let s = Un$1.get(r);
			return s || (s = this.precomputeWindow(r, n), n !== 1 && (typeof o == "function" && (s = o(s)), Un$1.set(r, s))), s;
		},
		wNAFCached(n, r, o) {
			const s = _n$1(n);
			return this.wNAF(s, this.getPrecomputes(s, n, o), r);
		},
		wNAFCachedUnsafe(n, r, o, s) {
			const i = _n$1(n);
			return i === 1 ? this.unsafeLadder(n, r, s) : this.wNAFUnsafe(i, this.getPrecomputes(i, n, o), r, s);
		},
		setWindowSize(n, r) {
			Bo$1(r, e), Ao$1.set(n, r), Un$1.delete(n);
		}
	};
}
function gc(t, e, n, r) {
	let o = e, s = t.ZERO, i = t.ZERO;
	for (; n > Xt$1 || r > Xt$1;) n & Mt$1 && (s = s.add(o)), r & Mt$1 && (i = i.add(o)), o = o.double(), n >>= Mt$1, r >>= Mt$1;
	return {
		p1: s,
		p2: i
	};
}
function bc(t, e, n, r) {
	dc(n, t), hc(r, e);
	const o = n.length, s = r.length;
	if (o !== s) throw new Error("arrays of points and scalars must have equal length");
	const i = t.ZERO, f = tc(BigInt(o));
	let a = 1;
	f > 12 ? a = f - 3 : f > 4 ? a = f - 2 : f > 0 && (a = 2);
	const l = je(a), c = new Array(Number(l) + 1).fill(i), u = Math.floor((e.BITS - 1) / a) * a;
	let h = i;
	for (let g = u; g >= 0; g -= a) {
		c.fill(i);
		for (let y = 0; y < s; y++) {
			const x = r[y], R = Number(x >> BigInt(g) & l);
			c[R] = c[R].add(n[y]);
		}
		let w = i;
		for (let y = c.length - 1, x = i; y > 0; y--) x = x.add(c[y]), w = w.add(x);
		if (h = h.add(w), g !== 0) for (let y = 0; y < a; y++) h = h.double();
	}
	return h;
}
function No$1(t, e) {
	if (e) {
		if (e.ORDER !== t) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
		return fc(e), e;
	} else return Yt$1(t);
}
function yc(t, e, n = {}) {
	if (!e || typeof e != "object") throw new Error(`expected valid ${t} CURVE object`);
	for (const f of [
		"p",
		"n",
		"h"
	]) {
		const a = e[f];
		if (!(typeof a == "bigint" && a > Xt$1)) throw new Error(`CURVE.${f} must be positive bigint`);
	}
	const r = No$1(e.p, n.Fp), o = No$1(e.n, n.Fn), i = [
		"Gx",
		"Gy",
		"a",
		t === "weierstrass" ? "b" : "d"
	];
	for (const f of i) if (!r.isValid(e[f])) throw new Error(`CURVE.${f} must be valid field element of CURVE.Fp`);
	return {
		Fp: r,
		Fn: o
	};
}
function mc(t) {
	return ke(t, {
		adjustScalarBytes: "function",
		powPminus2: "function"
	}), Object.freeze({ ...t });
}
function wc(t) {
	const { P: n, type: r, adjustScalarBytes: o, powPminus2: s, randomBytes: i } = mc(t), f = r === "x25519";
	if (!f && r !== "x448") throw new Error("invalid type");
	const a = i || Zt$1, l = f ? 255 : 448, c = f ? 32 : 56, u = BigInt(f ? 9 : 5), h = BigInt(f ? 121665 : 39081), g = f ? Pe$1 ** BigInt(254) : Pe$1 ** BigInt(447), y = g + (f ? BigInt(8) * Pe$1 ** BigInt(251) - Jt$1 : BigInt(4) * Pe$1 ** BigInt(445) - Jt$1) + Jt$1, x = (d) => lt(d, n), R = M(u);
	function M(d) {
		return An$1(x(d), c);
	}
	function L(d) {
		const m = rt$1("u coordinate", d, c);
		return f && (m[31] &= 127), x(Le(m));
	}
	function V(d) {
		return Le(o(rt$1("scalar", d, c)));
	}
	function _(d, m) {
		const p = $(L(m), V(d));
		if (p === de) throw new Error("invalid private or public key received");
		return M(p);
	}
	function k(d) {
		return _(d, R);
	}
	function j(d, m, p) {
		const b = x(d * (m - p));
		return m = x(m - b), p = x(p + b), {
			x_2: m,
			x_3: p
		};
	}
	function $(d, m) {
		Nn$1("u", d, de, n), Nn$1("scalar", m, g, y);
		const p = m, b = d;
		let v = Jt$1, B = de, E = d, I = Jt$1, S = de;
		for (let A = BigInt(l - 1); A >= de; A--) {
			const T = p >> A & Jt$1;
			S ^= T, {x_2: v, x_3: E} = j(S, v, E), {x_2: B, x_3: I} = j(S, B, I), S = T;
			const U = v + B, C = x(U * U), H = v - B, q = x(H * H), P = C - q, K = E + I, Z = x((E - I) * U), z = x(K * H), Ft = Z + z, yt = Z - z;
			E = x(Ft * Ft), I = x(b * x(yt * yt)), v = x(C * q), B = x(P * (C + x(h * P)));
		}
		({x_2: v, x_3: E} = j(S, v, E)), {x_2: B, x_3: I} = j(S, B, I);
		const O = s(B);
		return x(v * O);
	}
	return {
		scalarMult: _,
		scalarMultBase: k,
		getSharedSecret: (d, m) => _(d, m),
		getPublicKey: (d) => k(d),
		utils: { randomPrivateKey: () => a(c) },
		GuBytes: R.slice()
	};
}
function Ic(t) {
	const e = BigInt(10), n = BigInt(20), r = BigInt(40), o = BigInt(80), s = Uo$1.p, f = t * t % s * t % s, l = pt(pt(f, Oo$1, s) * f % s, xc, s) * t % s, c = pt(l, Ec, s) * l % s, u = pt(c, e, s) * c % s, h = pt(u, n, s) * u % s, g = pt(h, r, s) * h % s;
	return {
		pow_p_5_8: pt(pt(pt(pt(g, o, s) * g % s, o, s) * g % s, e, s) * c % s, Oo$1, s) * t % s,
		b2: f
	};
}
function Ac(t) {
	return t[0] &= 248, t[31] &= 127, t[31] |= 64, t;
}
function _o$1(t) {
	t.lowS !== void 0 && Re$1("lowS", t.lowS), t.prehash !== void 0 && Re$1("prehash", t.prehash);
}
function Uc(t, e, n) {
	function r(o) {
		const s = t.sqr(o), i = t.mul(s, o);
		return t.add(t.add(i, t.mul(o, e)), n);
	}
	return r;
}
function To$1(t, e, n) {
	const { BYTES: r } = t;
	function o(s) {
		let i;
		if (typeof s == "bigint") i = s;
		else {
			let f = rt$1("private key", s);
			if (e) {
				if (!e.includes(f.length * 2)) throw new Error("invalid private key");
				const a = new Uint8Array(r);
				a.set(f, a.length - f.length), f = a;
			}
			try {
				i = t.fromBytes(f);
			} catch {
				throw new Error(`invalid private key: expected ui8a of size ${r}, got ${typeof s}`);
			}
		}
		if (n && (i = t.create(i)), !t.isValidNot0(i)) throw new Error("invalid private key: out of range [1..N-1]");
		return i;
	}
	return o;
}
function _c(t, e = {}) {
	const { Fp: n, Fn: r } = yc("weierstrass", t, e), { h: o, n: s } = t;
	ke(e, {}, {
		allowInfinityPoint: "boolean",
		clearCofactor: "function",
		isTorsionFree: "function",
		fromBytes: "function",
		toBytes: "function",
		endo: "object",
		wrapPrivateKey: "boolean"
	});
	const { endo: i } = e;
	if (i && (!n.is0(t.a) || typeof i.beta != "bigint" || typeof i.splitScalar != "function")) throw new Error("invalid endo: expected \"beta\": bigint and \"splitScalar\": function");
	function f() {
		if (!n.isOdd) throw new Error("compression is not supported: Field does not have .isOdd()");
	}
	function a($, d, m) {
		const { x: p, y: b } = d.toAffine(), v = n.toBytes(p);
		if (Re$1("isCompressed", m), m) {
			f();
			return Ht$1(Ro$1(!n.isOdd(b)), v);
		} else return Ht$1(Uint8Array.of(4), v, n.toBytes(b));
	}
	function l($) {
		at($);
		const d = n.BYTES, m = d + 1, p = 2 * d + 1, b = $.length, v = $[0], B = $.subarray(1);
		if (b === m && (v === 2 || v === 3)) {
			const E = n.fromBytes(B);
			if (!n.isValid(E)) throw new Error("bad point: is not on curve, wrong x");
			const I = h(E);
			let S;
			try {
				S = n.sqrt(I);
			} catch (T) {
				const U = T instanceof Error ? ": " + T.message : "";
				throw new Error("bad point: is not on curve, sqrt error" + U);
			}
			f();
			const O = n.isOdd(S);
			return (v & 1) === 1 !== O && (S = n.neg(S)), {
				x: E,
				y: S
			};
		} else if (b === p && v === 4) {
			const E = n.fromBytes(B.subarray(d * 0, d * 1)), I = n.fromBytes(B.subarray(d * 1, d * 2));
			if (!g(E, I)) throw new Error("bad point: is not on curve");
			return {
				x: E,
				y: I
			};
		} else throw new Error(`bad point: got length ${b}, expected compressed=${m} or uncompressed=${p}`);
	}
	const c = e.toBytes || a, u = e.fromBytes || l, h = Uc(n, t.a, t.b);
	function g($, d) {
		const m = n.sqr(d), p = h($);
		return n.eql(m, p);
	}
	if (!g(t.Gx, t.Gy)) throw new Error("bad curve params: generator point");
	const w = n.mul(n.pow(t.a, He$1), Oc), y = n.mul(n.sqr(t.b), BigInt(27));
	if (n.is0(n.add(w, y))) throw new Error("bad curve params: a or b");
	function x($, d, m = !1) {
		if (!n.isValid(d) || m && n.is0(d)) throw new Error(`bad point coordinate ${$}`);
		return d;
	}
	function R($) {
		if (!($ instanceof _)) throw new Error("ProjectivePoint expected");
	}
	const M = ho$1(($, d) => {
		const { px: m, py: p, pz: b } = $;
		if (n.eql(b, n.ONE)) return {
			x: m,
			y: p
		};
		const v = $.is0();
		d ??= v ? n.ONE : n.inv(b);
		const B = n.mul(m, d), E = n.mul(p, d), I = n.mul(b, d);
		if (v) return {
			x: n.ZERO,
			y: n.ZERO
		};
		if (!n.eql(I, n.ONE)) throw new Error("invZ was invalid");
		return {
			x: B,
			y: E
		};
	}), L = ho$1(($) => {
		if ($.is0()) {
			if (e.allowInfinityPoint && !n.is0($.py)) return;
			throw new Error("bad point: ZERO");
		}
		const { x: d, y: m } = $.toAffine();
		if (!n.isValid(d) || !n.isValid(m)) throw new Error("bad point: x or y not field elements");
		if (!g(d, m)) throw new Error("bad point: equation left != right");
		if (!$.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
		return !0;
	});
	function V($, d, m, p, b) {
		return m = new _(n.mul(m.px, $), m.py, m.pz), d = le$1(p, d), m = le$1(b, m), d.add(m);
	}
	class _ {
		constructor(d, m, p) {
			this.px = x("x", d), this.py = x("y", m, !0), this.pz = x("z", p), Object.freeze(this);
		}
		static fromAffine(d) {
			const { x: m, y: p } = d || {};
			if (!d || !n.isValid(m) || !n.isValid(p)) throw new Error("invalid affine point");
			if (d instanceof _) throw new Error("projective point not allowed");
			return n.is0(m) && n.is0(p) ? _.ZERO : new _(m, p, n.ONE);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		static normalizeZ(d) {
			return lc(_, "pz", d);
		}
		static fromBytes(d) {
			return at(d), _.fromHex(d);
		}
		static fromHex(d) {
			const m = _.fromAffine(u(rt$1("pointHex", d)));
			return m.assertValidity(), m;
		}
		static fromPrivateKey(d) {
			const m = To$1(r, e.allowedPrivateKeyLengths, e.wrapPrivateKey);
			return _.BASE.multiply(m(d));
		}
		static msm(d, m) {
			return bc(_, r, d, m);
		}
		precompute(d = 8, m = !0) {
			return j.setWindowSize(this, d), m || this.multiply(He$1), this;
		}
		_setWindowSize(d) {
			this.precompute(d);
		}
		assertValidity() {
			L(this);
		}
		hasEvenY() {
			const { y: d } = this.toAffine();
			if (!n.isOdd) throw new Error("Field doesn't support isOdd");
			return !n.isOdd(d);
		}
		equals(d) {
			R(d);
			const { px: m, py: p, pz: b } = this, { px: v, py: B, pz: E } = d, I = n.eql(n.mul(m, E), n.mul(v, b)), S = n.eql(n.mul(p, E), n.mul(B, b));
			return I && S;
		}
		negate() {
			return new _(this.px, n.neg(this.py), this.pz);
		}
		double() {
			const { a: d, b: m } = t, p = n.mul(m, He$1), { px: b, py: v, pz: B } = this;
			let E = n.ZERO, I = n.ZERO, S = n.ZERO, O = n.mul(b, b), A = n.mul(v, v), T = n.mul(B, B), U = n.mul(b, v);
			return U = n.add(U, U), S = n.mul(b, B), S = n.add(S, S), E = n.mul(d, S), I = n.mul(p, T), I = n.add(E, I), E = n.sub(A, I), I = n.add(A, I), I = n.mul(E, I), E = n.mul(U, E), S = n.mul(p, S), T = n.mul(d, T), U = n.sub(O, T), U = n.mul(d, U), U = n.add(U, S), S = n.add(O, O), O = n.add(S, O), O = n.add(O, T), O = n.mul(O, U), I = n.add(I, O), T = n.mul(v, B), T = n.add(T, T), O = n.mul(T, U), E = n.sub(E, O), S = n.mul(T, A), S = n.add(S, S), S = n.add(S, S), new _(E, I, S);
		}
		add(d) {
			R(d);
			const { px: m, py: p, pz: b } = this, { px: v, py: B, pz: E } = d;
			let I = n.ZERO, S = n.ZERO, O = n.ZERO;
			const A = t.a, T = n.mul(t.b, He$1);
			let U = n.mul(m, v), C = n.mul(p, B), H = n.mul(b, E), q = n.add(m, p), P = n.add(v, B);
			q = n.mul(q, P), P = n.add(U, C), q = n.sub(q, P), P = n.add(m, b);
			let K = n.add(v, E);
			return P = n.mul(P, K), K = n.add(U, H), P = n.sub(P, K), K = n.add(p, b), I = n.add(B, E), K = n.mul(K, I), I = n.add(C, H), K = n.sub(K, I), O = n.mul(A, P), I = n.mul(T, H), O = n.add(I, O), I = n.sub(C, O), O = n.add(C, O), S = n.mul(I, O), C = n.add(U, U), C = n.add(C, U), H = n.mul(A, H), P = n.mul(T, P), C = n.add(C, H), H = n.sub(U, H), H = n.mul(A, H), P = n.add(P, H), U = n.mul(C, P), S = n.add(S, U), U = n.mul(K, P), I = n.mul(q, I), I = n.sub(I, U), U = n.mul(q, C), O = n.mul(K, O), O = n.add(O, U), new _(I, S, O);
		}
		subtract(d) {
			return this.add(d.negate());
		}
		is0() {
			return this.equals(_.ZERO);
		}
		multiply(d) {
			const { endo: m } = e;
			if (!r.isValidNot0(d)) throw new Error("invalid scalar: out of range");
			let p, b;
			const v = (B) => j.wNAFCached(this, B, _.normalizeZ);
			if (m) {
				const { k1neg: B, k1: E, k2neg: I, k2: S } = m.splitScalar(d), { p: O, f: A } = v(E), { p: T, f: U } = v(S);
				b = A.add(U), p = V(m.beta, O, T, B, I);
			} else {
				const { p: B, f: E } = v(d);
				p = B, b = E;
			}
			return _.normalizeZ([p, b])[0];
		}
		multiplyUnsafe(d) {
			const { endo: m } = e, p = this;
			if (!r.isValid(d)) throw new Error("invalid scalar: out of range");
			if (d === he$1 || p.is0()) return _.ZERO;
			if (d === pe$1) return p;
			if (j.hasPrecomputes(this)) return this.multiply(d);
			if (m) {
				const { k1neg: b, k1: v, k2neg: B, k2: E } = m.splitScalar(d), { p1: I, p2: S } = gc(_, p, v, E);
				return V(m.beta, I, S, b, B);
			} else return j.wNAFCachedUnsafe(p, d);
		}
		multiplyAndAddUnsafe(d, m, p) {
			const b = this.multiplyUnsafe(m).add(d.multiplyUnsafe(p));
			return b.is0() ? void 0 : b;
		}
		toAffine(d) {
			return M(this, d);
		}
		isTorsionFree() {
			const { isTorsionFree: d } = e;
			return o === pe$1 ? !0 : d ? d(_, this) : j.wNAFCachedUnsafe(this, s).is0();
		}
		clearCofactor() {
			const { clearCofactor: d } = e;
			return o === pe$1 ? this : d ? d(_, this) : this.multiplyUnsafe(o);
		}
		toBytes(d = !0) {
			return Re$1("isCompressed", d), this.assertValidity(), c(_, this, d);
		}
		toRawBytes(d = !0) {
			return this.toBytes(d);
		}
		toHex(d = !0) {
			return ce$1(this.toBytes(d));
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
	}
	_.BASE = new _(t.Gx, t.Gy, n.ONE), _.ZERO = new _(n.ZERO, n.ONE, n.ZERO), _.Fp = n, _.Fn = r;
	const k = r.BITS, j = pc(_, e.endo ? Math.ceil(k / 2) : k);
	return _;
}
function Ro$1(t) {
	return Uint8Array.of(t ? 2 : 3);
}
function Tc(t, e, n = {}) {
	ke(e, { hash: "function" }, {
		hmac: "function",
		lowS: "boolean",
		randomBytes: "function",
		bits2int: "function",
		bits2int_modN: "function"
	});
	const r = e.randomBytes || Zt$1, o = e.hmac || ((p, ...b) => _e(e.hash, p, Ht$1(...b))), { Fp: s, Fn: i } = t, { ORDER: f, BITS: a } = i;
	function l(p) {
		return p > f >> pe$1;
	}
	function c(p) {
		return l(p) ? i.neg(p) : p;
	}
	function u(p, b) {
		if (!i.isValidNot0(b)) throw new Error(`invalid signature ${p}: out of range 1..CURVE.n`);
	}
	class h {
		constructor(b, v, B) {
			u("r", b), u("s", v), this.r = b, this.s = v, B != null && (this.recovery = B), Object.freeze(this);
		}
		static fromCompact(b) {
			const v = i.BYTES, B = rt$1("compactSignature", b, v * 2);
			return new h(i.fromBytes(B.subarray(0, v)), i.fromBytes(B.subarray(v, v * 2)));
		}
		static fromDER(b) {
			const { r: v, s: B } = vt.toSig(rt$1("DER", b));
			return new h(v, B);
		}
		assertValidity() {}
		addRecoveryBit(b) {
			return new h(this.r, this.s, b);
		}
		recoverPublicKey(b) {
			const v = s.ORDER, { r: B, s: E, recovery: I } = this;
			if (I == null || ![
				0,
				1,
				2,
				3
			].includes(I)) throw new Error("recovery id invalid");
			if (f * Nc < v && I > 1) throw new Error("recovery id is ambiguous for h>1 curve");
			const O = I === 2 || I === 3 ? B + f : B;
			if (!s.isValid(O)) throw new Error("recovery id 2 or 3 invalid");
			const A = s.toBytes(O), T = t.fromHex(Ht$1(Ro$1((I & 1) === 0), A)), U = i.inv(O), C = L(rt$1("msgHash", b)), H = i.create(-C * U), q = i.create(E * U), P = t.BASE.multiplyUnsafe(H).add(T.multiplyUnsafe(q));
			if (P.is0()) throw new Error("point at infinify");
			return P.assertValidity(), P;
		}
		hasHighS() {
			return l(this.s);
		}
		normalizeS() {
			return this.hasHighS() ? new h(this.r, i.neg(this.s), this.recovery) : this;
		}
		toBytes(b) {
			if (b === "compact") return Ht$1(i.toBytes(this.r), i.toBytes(this.s));
			if (b === "der") return fn$1(vt.hexFromSig(this));
			throw new Error("invalid format");
		}
		toDERRawBytes() {
			return this.toBytes("der");
		}
		toDERHex() {
			return ce$1(this.toBytes("der"));
		}
		toCompactRawBytes() {
			return this.toBytes("compact");
		}
		toCompactHex() {
			return ce$1(this.toBytes("compact"));
		}
	}
	const g = To$1(i, n.allowedPrivateKeyLengths, n.wrapPrivateKey), w = {
		isValidPrivateKey(p) {
			try {
				return g(p), !0;
			} catch {
				return !1;
			}
		},
		normPrivateKeyToScalar: g,
		randomPrivateKey: () => {
			const p = f;
			return uc(r(Eo$1(p)), p);
		},
		precompute(p = 8, b = t.BASE) {
			return b.precompute(p, !1);
		}
	};
	function y(p, b = !0) {
		return t.fromPrivateKey(p).toBytes(b);
	}
	function x(p) {
		if (typeof p == "bigint") return !1;
		if (p instanceof t) return !0;
		const v = rt$1("key", p).length, B = s.BYTES, E = B + 1, I = 2 * B + 1;
		if (!(n.allowedPrivateKeyLengths || i.BYTES === E)) return v === E || v === I;
	}
	function R(p, b, v = !0) {
		if (x(p) === !0) throw new Error("first arg must be private key");
		if (x(b) === !1) throw new Error("second arg must be public key");
		return t.fromHex(b).multiply(g(p)).toBytes(v);
	}
	const M = e.bits2int || function(p) {
		if (p.length > 8192) throw new Error("input is too large");
		const b = Ce(p), v = p.length * 8 - a;
		return v > 0 ? b >> BigInt(v) : b;
	}, L = e.bits2int_modN || function(p) {
		return i.create(M(p));
	}, V = je(a);
	function _(p) {
		return Nn$1("num < 2^" + a, p, he$1, V), i.toBytes(p);
	}
	function k(p, b, v = j) {
		if (["recovered", "canonical"].some((q) => q in v)) throw new Error("sign() legacy options not supported");
		const { hash: B } = e;
		let { lowS: E, prehash: I, extraEntropy: S } = v;
		E ??= !0, p = rt$1("msgHash", p), _o$1(v), I && (p = rt$1("prehashed msgHash", B(p)));
		const O = L(p), A = g(b), T = [_(A), _(O)];
		if (S != null && S !== !1) {
			const q = S === !0 ? r(s.BYTES) : S;
			T.push(rt$1("extraEntropy", q));
		}
		const U = Ht$1(...T), C = O;
		function H(q) {
			const P = M(q);
			if (!i.isValidNot0(P)) return;
			const K = i.inv(P), et = t.BASE.multiply(P).toAffine(), Z = i.create(et.x);
			if (Z === he$1) return;
			const z = i.create(K * i.create(C + Z * A));
			if (z === he$1) return;
			let Ft = (et.x === Z ? 0 : 2) | Number(et.y & pe$1), yt = z;
			return E && l(z) && (yt = c(z), Ft ^= 1), new h(Z, yt, Ft);
		}
		return {
			seed: U,
			k2sig: H
		};
	}
	const j = {
		lowS: e.lowS,
		prehash: !1
	}, $ = {
		lowS: e.lowS,
		prehash: !1
	};
	function d(p, b, v = j) {
		const { seed: B, k2sig: E } = k(p, b, v);
		return ec(e.hash.outputLen, i.BYTES, o)(B, E);
	}
	t.BASE.precompute(8);
	function m(p, b, v, B = $) {
		const E = p;
		b = rt$1("msgHash", b), v = rt$1("publicKey", v), _o$1(B);
		const { lowS: I, prehash: S, format: O } = B;
		if ("strict" in B) throw new Error("options.strict was renamed to lowS");
		if (O !== void 0 && ![
			"compact",
			"der",
			"js"
		].includes(O)) throw new Error("format must be \"compact\", \"der\" or \"js\"");
		const A = typeof E == "string" || nn(E), T = !A && !O && typeof E == "object" && E !== null && typeof E.r == "bigint" && typeof E.s == "bigint";
		if (!A && !T) throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
		let U, C;
		try {
			if (T) if (O === void 0 || O === "js") U = new h(E.r, E.s);
			else throw new Error("invalid format");
			if (A) {
				try {
					O !== "compact" && (U = h.fromDER(E));
				} catch (yt) {
					if (!(yt instanceof vt.Err)) throw yt;
				}
				!U && O !== "der" && (U = h.fromCompact(E));
			}
			C = t.fromHex(v);
		} catch {
			return !1;
		}
		if (!U || I && U.hasHighS()) return !1;
		S && (b = e.hash(b));
		const { r: H, s: q } = U, P = L(b), K = i.inv(q), et = i.create(P * K), Z = i.create(H * K), z = t.BASE.multiplyUnsafe(et).add(C.multiplyUnsafe(Z));
		return z.is0() ? !1 : i.create(z.x) === H;
	}
	return Object.freeze({
		getPublicKey: y,
		getSharedSecret: R,
		sign: d,
		verify: m,
		utils: w,
		Point: t,
		Signature: h
	});
}
function Rc(t) {
	const e = {
		a: t.a,
		b: t.b,
		p: t.Fp.ORDER,
		n: t.n,
		h: t.h,
		Gx: t.Gx,
		Gy: t.Gy
	};
	return {
		CURVE: e,
		curveOpts: {
			Fp: t.Fp,
			Fn: Yt$1(e.n, t.nBitLength),
			allowedPrivateKeyLengths: t.allowedPrivateKeyLengths,
			allowInfinityPoint: t.allowInfinityPoint,
			endo: t.endo,
			wrapPrivateKey: t.wrapPrivateKey,
			isTorsionFree: t.isTorsionFree,
			clearCofactor: t.clearCofactor,
			fromBytes: t.fromBytes,
			toBytes: t.toBytes
		}
	};
}
function $c(t) {
	const { CURVE: e, curveOpts: n } = Rc(t);
	return {
		CURVE: e,
		curveOpts: n,
		ecdsaOpts: {
			hash: t.hash,
			hmac: t.hmac,
			randomBytes: t.randomBytes,
			lowS: t.lowS,
			bits2int: t.bits2int,
			bits2int_modN: t.bits2int_modN
		}
	};
}
function Cc(t, e) {
	return Object.assign({}, e, {
		ProjectivePoint: e.Point,
		CURVE: t
	});
}
function Lc(t) {
	const { CURVE: e, curveOpts: n, ecdsaOpts: r } = $c(t);
	return Cc(t, Tc(_c(e, n), r, n));
}
function Rn$1(t, e) {
	const n = (r) => Lc({
		...t,
		hash: r
	});
	return {
		...n(e),
		create: n
	};
}
function Vc() {
	const t = Tn$1.utils.randomPrivateKey(), e = Tn$1.getPublicKey(t);
	return {
		privateKey: toString(t, tt$1),
		publicKey: toString(e, tt$1)
	};
}
function qc() {
	return toString(Zt$1(Ln$1), tt$1);
}
function Kc(t, e) {
	return toString(Jf(Te, Tn$1.getSharedSecret(fromString(t, tt$1), fromString(e, tt$1)), void 0, void 0, Ln$1), tt$1);
}
function Fc(t) {
	return toString(Te(fromString(t, tt$1)), tt$1);
}
function zc(t) {
	return toString(Te(fromString(t, te)), tt$1);
}
function jn$1(t) {
	return fromString(`${t}`, $n$1);
}
function Vt$1(t) {
	return Number(toString(t, $n$1));
}
function ko$1(t) {
	return t.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function Po$1(t) {
	const e = t.replace(/-/g, "+").replace(/_/g, "/"), n = (4 - e.length % 4) % 4;
	return e + "=".repeat(n);
}
function Gc(t) {
	const e = jn$1(typeof t.type < "u" ? t.type : 0);
	if (Vt$1(e) === 1 && typeof t.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
	const n = typeof t.senderPublicKey < "u" ? fromString(t.senderPublicKey, tt$1) : void 0, r = typeof t.iv < "u" ? fromString(t.iv, tt$1) : Zt$1(be$1), i = kn$1({
		type: e,
		sealed: co$1(fromString(t.symKey, tt$1), r).encrypt(fromString(t.message, te)),
		iv: r,
		senderPublicKey: n
	});
	return t.encoding === "base64url" ? ko$1(i) : i;
}
function Zc(t) {
	const e = fromString(t.symKey, tt$1), { sealed: n, iv: r } = Me$1({
		encoded: t.encoded,
		encoding: t.encoding
	}), o = co$1(e, r).decrypt(n);
	if (o === null) throw new Error("Failed to decrypt");
	return toString(o, te);
}
function Wc(t, e) {
	const n = jn$1(2), r = Zt$1(be$1), s = kn$1({
		type: n,
		sealed: fromString(t, te),
		iv: r
	});
	return e === "base64url" ? ko$1(s) : s;
}
function Yc(t, e) {
	const { sealed: n } = Me$1({
		encoded: t,
		encoding: e
	});
	return toString(n, te);
}
function kn$1(t) {
	if (Vt$1(t.type) === 2) return toString(concat([t.type, t.sealed]), Qt$1);
	if (Vt$1(t.type) === 1) {
		if (typeof t.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
		return toString(concat([
			t.type,
			t.senderPublicKey,
			t.iv,
			t.sealed
		]), Qt$1);
	}
	return toString(concat([
		t.type,
		t.iv,
		t.sealed
	]), Qt$1);
}
function Me$1(t) {
	const n = fromString((t.encoding || "base64pad") === "base64url" ? Po$1(t.encoded) : t.encoded, Qt$1), r = n.slice(Mc, jo$1), o = jo$1;
	if (Vt$1(r) === 1) {
		const a = 33, l = 45, c = n.slice(o, a), u = n.slice(a, l);
		return {
			type: r,
			sealed: n.slice(l),
			iv: u,
			senderPublicKey: c
		};
	}
	if (Vt$1(r) === 2) return {
		type: r,
		sealed: n.slice(o),
		iv: Zt$1(be$1)
	};
	const s = 13, i = n.slice(o, s);
	return {
		type: r,
		sealed: n.slice(s),
		iv: i
	};
}
function Xc(t, e) {
	const n = Me$1({
		encoded: t,
		encoding: e?.encoding
	});
	return Ho$1({
		type: Vt$1(n.type),
		senderPublicKey: typeof n.senderPublicKey < "u" ? toString(n.senderPublicKey, tt$1) : void 0,
		receiverPublicKey: e?.receiverPublicKey
	});
}
function Ho$1(t) {
	const e = t?.type || 0;
	if (e === 1) {
		if (typeof t?.senderPublicKey > "u") throw new Error("missing sender public key");
		if (typeof t?.receiverPublicKey > "u") throw new Error("missing receiver public key");
	}
	return {
		type: e,
		senderPublicKey: t?.senderPublicKey,
		receiverPublicKey: t?.receiverPublicKey
	};
}
function Jc(t) {
	return t.type === 1 && typeof t.senderPublicKey == "string" && typeof t.receiverPublicKey == "string";
}
function Qc(t) {
	return t.type === 2;
}
function Do$1(t) {
	const e = Buffer.from(t.x, "base64"), n = Buffer.from(t.y, "base64");
	return concat([
		new Uint8Array([4]),
		e,
		n
	]);
}
function ta$1(t, e) {
	const [n, r, o] = t.split("."), s = Buffer.from(Po$1(o), "base64");
	if (s.length !== 64) throw new Error("Invalid signature length");
	const i = s.slice(0, 32), f = s.slice(32, 64), l = Te(`${n}.${r}`), c = Do$1(e);
	if (!Dc.verify(concat([i, f]), l, c)) throw new Error("Invalid signature");
	return sn$2(t).payload;
}
function ea$1(t) {
	return t?.relay || { protocol: "irn" };
}
function na(t) {
	const e = C$1[t];
	if (typeof e > "u") throw new Error(`Relay Protocol not supported: ${t}`);
	return e;
}
function Vo$1(t, e = "-") {
	const n = {}, r = "relay" + e;
	return Object.keys(t).forEach((o) => {
		if (o.startsWith(r)) {
			const s = o.replace(r, "");
			n[s] = t[o];
		}
	}), n;
}
function ra(t) {
	if (!t.includes("wc:")) {
		const l = Qe$1(t);
		l != null && l.includes("wc:") && (t = l);
	}
	t = t.includes("wc://") ? t.replace("wc://", "") : t, t = t.includes("wc:") ? t.replace("wc:", "") : t;
	const e = t.indexOf(":"), n = t.indexOf("?") !== -1 ? t.indexOf("?") : void 0, r = t.substring(0, e), o = t.substring(e + 1, n).split("@"), s = typeof n < "u" ? t.substring(n) : "", i = new URLSearchParams(s), f = {};
	i.forEach((l, c) => {
		f[c] = l;
	});
	const a = typeof f.methods == "string" ? f.methods.split(",") : void 0;
	return {
		protocol: r,
		topic: qo$1(o[0]),
		version: parseInt(o[1], 10),
		symKey: f.symKey,
		relay: Vo$1(f),
		methods: a,
		expiryTimestamp: f.expiryTimestamp ? parseInt(f.expiryTimestamp, 10) : void 0
	};
}
function qo$1(t) {
	return t.startsWith("//") ? t.substring(2) : t;
}
function Ko$1(t, e = "-") {
	const n = "relay", r = {};
	return Object.keys(t).forEach((o) => {
		const s = o, i = n + e + s;
		t[s] && (r[i] = t[s]);
	}), r;
}
function oa(t) {
	const e = new URLSearchParams(), n = Ko$1(t.relay);
	Object.keys(n).sort().forEach((o) => {
		e.set(o, n[o]);
	}), e.set("symKey", t.symKey), t.expiryTimestamp && e.set("expiryTimestamp", t.expiryTimestamp.toString()), t.methods && e.set("methods", t.methods.join(","));
	const r = e.toString();
	return `${t.protocol}:${t.topic}@${t.version}?${r}`;
}
function sa(t, e, n) {
	return `${t}?wc_ev=${n}&topic=${e}`;
}
function qt$1(t) {
	const e = [];
	return t.forEach((n) => {
		const [r, o] = n.split(":");
		e.push(`${r}:${o}`);
	}), e;
}
function Go$1(t) {
	const e = [];
	return Object.values(t).forEach((n) => {
		e.push(...qt$1(n.accounts));
	}), e;
}
function Zo$1(t, e) {
	const n = [];
	return Object.values(t).forEach((r) => {
		qt$1(r.accounts).includes(e) && n.push(...r.methods);
	}), n;
}
function Wo$1(t, e) {
	const n = [];
	return Object.values(t).forEach((r) => {
		qt$1(r.accounts).includes(e) && n.push(...r.events);
	}), n;
}
function ha(t, e) {
	const n = is(t, e);
	if (n) throw new Error(n.message);
	const r = {};
	for (const [o, s] of Object.entries(t)) r[o] = {
		methods: s.methods,
		events: s.events,
		chains: s.accounts.map((i) => `${i.split(":")[0]}:${i.split(":")[1]}`)
	};
	return r;
}
function pa(t) {
	var e;
	const { proposal: { requiredNamespaces: n, optionalNamespaces: r = {} }, supportedNamespaces: o } = t, s = ye$1(n), i = ye$1(r), f = {};
	Object.keys(o).forEach((c) => {
		const u = o[c].chains, h = o[c].methods, g = o[c].events, w = o[c].accounts;
		u.forEach((y) => {
			if (!w.some((x) => x.includes(y))) throw new Error(`No accounts provided for chain ${y} in namespace ${c}`);
		}), f[c] = {
			chains: u,
			methods: h,
			events: g,
			accounts: w
		};
	});
	const a = cs(n, f, "approve()");
	if (a) throw new Error(a.message);
	const l = {};
	if (!Object.keys(n).length && !Object.keys(r).length) return f;
	Object.keys(s).forEach((c) => {
		const u = o[c].chains.filter((y) => {
			var x, R;
			return (R = (x = s[c]) == null ? void 0 : x.chains) == null ? void 0 : R.includes(y);
		});
		l[c] = {
			chains: u,
			methods: o[c].methods.filter((y) => {
				var x, R;
				return (R = (x = s[c]) == null ? void 0 : x.methods) == null ? void 0 : R.includes(y);
			}),
			events: o[c].events.filter((y) => {
				var x, R;
				return (R = (x = s[c]) == null ? void 0 : x.events) == null ? void 0 : R.includes(y);
			}),
			accounts: u.map((y) => o[c].accounts.filter((x) => x.includes(`${y}:`))).flat()
		};
	}), Object.keys(i).forEach((c) => {
		var u, h, g, w, y, x;
		if (!o[c]) return;
		const R = (h = (u = i[c]) == null ? void 0 : u.chains) == null ? void 0 : h.filter((_) => o[c].chains.includes(_)), M = o[c].methods.filter((_) => {
			var k, j;
			return (j = (k = i[c]) == null ? void 0 : k.methods) == null ? void 0 : j.includes(_);
		}), L = o[c].events.filter((_) => {
			var k, j;
			return (j = (k = i[c]) == null ? void 0 : k.events) == null ? void 0 : j.includes(_);
		}), V = R?.map((_) => o[c].accounts.filter((k) => k.includes(`${_}:`))).flat();
		l[c] = {
			chains: ct((g = l[c]) == null ? void 0 : g.chains, R),
			methods: ct((w = l[c]) == null ? void 0 : w.methods, M),
			events: ct((y = l[c]) == null ? void 0 : y.events, L),
			accounts: ct((x = l[c]) == null ? void 0 : x.accounts, V)
		};
	});
	for (const [c, u] of Object.entries(l)) (u.accounts.length === 0 || ((e = u?.chains) == null ? void 0 : e.length) === 0) && delete l[c];
	return l;
}
function Pn$1(t) {
	return t.includes(":");
}
function Yo$1(t) {
	return Pn$1(t) ? t.split(":")[0] : t;
}
function ye$1(t) {
	var e, n, r;
	const o = {};
	if (!Ve$1(t)) return o;
	for (const [s, i] of Object.entries(t)) {
		const f = Pn$1(s) ? [s] : i.chains, a = i.methods || [], l = i.events || [], c = Yo$1(s);
		o[c] = da(la({}, o[c]), {
			chains: ct(f, (e = o[c]) == null ? void 0 : e.chains),
			methods: ct(a, (n = o[c]) == null ? void 0 : n.methods),
			events: ct(l, (r = o[c]) == null ? void 0 : r.events)
		});
	}
	return o;
}
function Xo$1(t) {
	const e = {};
	return t?.forEach((n) => {
		var r;
		const [o, s] = n.split(":");
		e[o] || (e[o] = {
			accounts: [],
			chains: [],
			events: [],
			methods: []
		}), e[o].accounts.push(n), (r = e[o].chains) == null || r.push(`${o}:${s}`);
	}), e;
}
function ga(t, e) {
	e = e.map((r) => r.replace("did:pkh:", ""));
	const n = Xo$1(e);
	for (const [r, o] of Object.entries(n)) o.methods ? o.methods = ct(o.methods, t) : o.methods = t, o.events = ["chainChanged", "accountsChanged"];
	return n;
}
function ba(t, e) {
	var n, r, o, s, i, f;
	const a = ye$1(t), l = ye$1(e), c = {}, u = Object.keys(a).concat(Object.keys(l));
	for (const h of u) c[h] = {
		chains: ct((n = a[h]) == null ? void 0 : n.chains, (r = l[h]) == null ? void 0 : r.chains),
		methods: ct((o = a[h]) == null ? void 0 : o.methods, (s = l[h]) == null ? void 0 : s.methods),
		events: ct((i = a[h]) == null ? void 0 : i.events, (f = l[h]) == null ? void 0 : f.events)
	};
	return c;
}
function Et(t, e) {
	const { message: n, code: r } = Qo$1[t];
	return {
		message: e ? `${n} ${e}` : n,
		code: r
	};
}
function Kt$1(t, e) {
	const { message: n, code: r } = Jo$1[t];
	return {
		message: e ? `${n} ${e}` : n,
		code: r
	};
}
function me$1(t, e) {
	return Array.isArray(t) ? typeof e < "u" && t.length ? t.every(e) : !0 : !1;
}
function Ve$1(t) {
	return Object.getPrototypeOf(t) === Object.prototype && Object.keys(t).length;
}
function kt$1(t) {
	return typeof t > "u";
}
function it(t, e) {
	return e && kt$1(t) ? !0 : typeof t == "string" && !!t.trim().length;
}
function qe$1(t, e) {
	return e && kt$1(t) ? !0 : typeof t == "number" && !isNaN(t);
}
function ya(t, e) {
	const { requiredNamespaces: n } = e, r = Object.keys(t.namespaces), o = Object.keys(n);
	let s = !0;
	return It$1(o, r) ? (r.forEach((i) => {
		const { accounts: f, methods: a, events: l } = t.namespaces[i], c = qt$1(f), u = n[i];
		(!It$1(ve$1(i, u), c) || !It$1(u.methods, a) || !It$1(u.events, l)) && (s = !1);
	}), s) : !1;
}
function we$1(t) {
	return it(t, !1) && t.includes(":") ? t.split(":").length === 2 : !1;
}
function ts(t) {
	if (it(t, !1) && t.includes(":")) {
		const e = t.split(":");
		if (e.length === 3) {
			const n = e[0] + ":" + e[1];
			return !!e[2] && we$1(n);
		}
	}
	return !1;
}
function ma(t) {
	function e(n) {
		try {
			return typeof new URL(n) < "u";
		} catch {
			return !1;
		}
	}
	try {
		if (it(t, !1)) {
			if (e(t)) return !0;
			return e(Qe$1(t));
		}
	} catch {}
	return !1;
}
function wa(t) {
	var e;
	return (e = t?.proposer) == null ? void 0 : e.publicKey;
}
function xa(t) {
	return t?.topic;
}
function va(t, e) {
	let n = null;
	return it(t?.publicKey, !1) || (n = Et("MISSING_OR_INVALID", `${e} controller public key should be a string`)), n;
}
function Hn$1(t) {
	let e = !0;
	return me$1(t) ? t.length && (e = t.every((n) => it(n, !1))) : e = !1, e;
}
function es(t, e, n) {
	let r = null;
	return me$1(e) && e.length ? e.forEach((o) => {
		r || we$1(o) || (r = Kt$1("UNSUPPORTED_CHAINS", `${n}, chain ${o} should be a string and conform to "namespace:chainId" format`));
	}) : we$1(t) || (r = Kt$1("UNSUPPORTED_CHAINS", `${n}, chains must be defined as "namespace:chainId" e.g. "eip155:1": {...} in the namespace key OR as an array of CAIP-2 chainIds e.g. eip155: { chains: ["eip155:1", "eip155:5"] }`)), r;
}
function ns(t, e, n) {
	let r = null;
	return Object.entries(t).forEach(([o, s]) => {
		if (r) return;
		const i = es(o, ve$1(o, s), `${e} ${n}`);
		i && (r = i);
	}), r;
}
function rs(t, e) {
	let n = null;
	return me$1(t) ? t.forEach((r) => {
		n || ts(r) || (n = Kt$1("UNSUPPORTED_ACCOUNTS", `${e}, account ${r} should be a string and conform to "namespace:chainId:address" format`));
	}) : n = Kt$1("UNSUPPORTED_ACCOUNTS", `${e}, accounts should be an array of strings conforming to "namespace:chainId:address" format`), n;
}
function os(t, e) {
	let n = null;
	return Object.values(t).forEach((r) => {
		if (n) return;
		const o = rs(r?.accounts, `${e} namespace`);
		o && (n = o);
	}), n;
}
function ss(t, e) {
	let n = null;
	return Hn$1(t?.methods) ? Hn$1(t?.events) || (n = Kt$1("UNSUPPORTED_EVENTS", `${e}, events should be an array of strings or empty array for no events`)) : n = Kt$1("UNSUPPORTED_METHODS", `${e}, methods should be an array of strings or empty array for no methods`), n;
}
function Dn$1(t, e) {
	let n = null;
	return Object.values(t).forEach((r) => {
		if (n) return;
		const o = ss(r, `${e}, namespace`);
		o && (n = o);
	}), n;
}
function Ea(t, e, n) {
	let r = null;
	if (t && Ve$1(t)) {
		const o = Dn$1(t, e);
		o && (r = o);
		const s = ns(t, e, n);
		s && (r = s);
	} else r = Et("MISSING_OR_INVALID", `${e}, ${n} should be an object with data`);
	return r;
}
function is(t, e) {
	let n = null;
	if (t && Ve$1(t)) {
		const r = Dn$1(t, e);
		r && (n = r);
		const o = os(t, e);
		o && (n = o);
	} else n = Et("MISSING_OR_INVALID", `${e}, namespaces should be an object with data`);
	return n;
}
function fs(t) {
	return it(t.protocol, !0);
}
function Ba(t, e) {
	let n = !1;
	return e && !t ? n = !0 : t && me$1(t) && t.length && t.forEach((r) => {
		n = fs(r);
	}), n;
}
function Ia(t) {
	return typeof t == "number";
}
function Aa(t) {
	return typeof t < "u" && true;
}
function Sa(t) {
	return !(!t || typeof t != "object" || !t.code || !qe$1(t.code, !1) || !t.message || !it(t.message, !1));
}
function Na(t) {
	return !(kt$1(t) || !it(t.method, !1));
}
function Oa(t) {
	return !(kt$1(t) || kt$1(t.result) && kt$1(t.error) || !qe$1(t.id, !1) || !it(t.jsonrpc, !1));
}
function Ua(t) {
	return !(kt$1(t) || !it(t.name, !1));
}
function _a(t, e) {
	return !(!we$1(e) || !Go$1(t).includes(e));
}
function Ta(t, e, n) {
	return it(n, !1) ? Zo$1(t, e).includes(n) : !1;
}
function Ra(t, e, n) {
	return it(n, !1) ? Wo$1(t, e).includes(n) : !1;
}
function cs(t, e, n) {
	let r = null;
	const o = $a(t), s = Ca(e), i = Object.keys(o), f = Object.keys(s), a = as(Object.keys(t)), l = as(Object.keys(e)), c = a.filter((u) => !l.includes(u));
	return c.length && (r = Et("NON_CONFORMING_NAMESPACES", `${n} namespaces keys don't satisfy requiredNamespaces.
      Required: ${c.toString()}
      Received: ${Object.keys(e).toString()}`)), It$1(i, f) || (r = Et("NON_CONFORMING_NAMESPACES", `${n} namespaces chains don't satisfy required namespaces.
      Required: ${i.toString()}
      Approved: ${f.toString()}`)), Object.keys(e).forEach((u) => {
		if (!u.includes(":") || r) return;
		const h = qt$1(e[u].accounts);
		h.includes(u) || (r = Et("NON_CONFORMING_NAMESPACES", `${n} namespaces accounts don't satisfy namespace accounts for ${u}
        Required: ${u}
        Approved: ${h.toString()}`));
	}), i.forEach((u) => {
		r || (It$1(o[u].methods, s[u].methods) ? It$1(o[u].events, s[u].events) || (r = Et("NON_CONFORMING_NAMESPACES", `${n} namespaces events don't satisfy namespace events for ${u}`)) : r = Et("NON_CONFORMING_NAMESPACES", `${n} namespaces methods don't satisfy namespace methods for ${u}`));
	}), r;
}
function $a(t) {
	const e = {};
	return Object.keys(t).forEach((n) => {
		var r;
		n.includes(":") ? e[n] = t[n] : (r = t[n].chains) == null || r.forEach((o) => {
			e[o] = {
				methods: t[n].methods,
				events: t[n].events
			};
		});
	}), e;
}
function as(t) {
	return [...new Set(t.map((e) => e.includes(":") ? e.split(":")[0] : e))];
}
function Ca(t) {
	const e = {};
	return Object.keys(t).forEach((n) => {
		if (n.includes(":")) e[n] = t[n];
		else qt$1(t[n].accounts)?.forEach((o) => {
			e[o] = {
				accounts: t[n].accounts.filter((s) => s.includes(`${o}:`)),
				methods: t[n].methods,
				events: t[n].events
			};
		});
	}), e;
}
function La(t, e) {
	return qe$1(t, !1) && t <= e.max && t >= e.min;
}
function ja() {
	const t = Pt$1();
	return new Promise((e) => {
		switch (t) {
			case J$1.browser:
				e(us());
				break;
			case J$1.reactNative:
				e(ls());
				break;
			case J$1.node:
				e(ds$1());
				break;
			default: e(!0);
		}
	});
}
function us() {
	return zt$1() && navigator?.onLine;
}
async function ls() {
	if (Bt$1() && typeof global < "u" && global != null && global.NetInfo) return (await (global == null ? void 0 : global.NetInfo.fetch()))?.isConnected;
	return !0;
}
function ds$1() {
	return !0;
}
function ka(t) {
	switch (Pt$1()) {
		case J$1.browser:
			hs(t);
			break;
		case J$1.reactNative:
			ps(t);
			break;
		case J$1.node: break;
	}
}
function hs(t) {
	!Bt$1() && zt$1() && (window.addEventListener("online", () => t(!0)), window.addEventListener("offline", () => t(!1)));
}
function ps(t) {
	Bt$1() && typeof global < "u" && global != null && global.NetInfo && global?.NetInfo.addEventListener((e) => t(e?.isConnected));
}
function Pa() {
	var t;
	return zt$1() && (0, import_cjs$4.getDocument)() ? ((t = (0, import_cjs$4.getDocument)()) == null ? void 0 : t.visibilityState) === "visible" : !0;
}
function gs(t) {
	const e = esm_default.decode(t);
	if (e.length < 33) throw new Error("Too short to contain a public key");
	return e.slice(1, 33);
}
function bs({ publicKey: t, signature: e, payload: n }) {
	var r;
	const o = Vn$1(n.method), s = 128 | parseInt(((r = n.version) == null ? void 0 : r.toString()) || "4"), i = Ma(n.address), f = n.era === "00" ? new Uint8Array([0]) : Vn$1(n.era);
	if (f.length !== 1 && f.length !== 2) throw new Error("Invalid era length");
	const a = parseInt(n.nonce, 16), l = new Uint8Array([a & 255, a >> 8 & 255]), u = qa(BigInt(`0x${Da(n.tip)}`)), h = new Uint8Array([
		0,
		...t,
		i,
		...e,
		...f,
		...l,
		...u,
		...o
	]), g = Va(h.length + 1);
	return new Uint8Array([
		...g,
		s,
		...h
	]);
}
function ys$1(t) {
	const n = (0, import_blakejs.blake2b)(Vn$1(t), void 0, 32);
	return "0x" + Buffer.from(n).toString("hex");
}
function Vn$1(t) {
	return new Uint8Array(t.replace(/^0x/, "").match(/.{1,2}/g).map((e) => parseInt(e, 16)));
}
function Da(t) {
	return t.startsWith("0x") ? t.slice(2) : t;
}
function Ma(t) {
	const e = esm_default.decode(t)[0];
	return e === 42 ? 0 : e === 60 ? 2 : 1;
}
function Va(t) {
	if (t < 64) return new Uint8Array([t << 2]);
	if (t < 16384) {
		const e = t << 2 | 1;
		return new Uint8Array([e & 255, e >> 8 & 255]);
	} else if (t < 1 << 30) {
		const e = t << 2 | 2;
		return new Uint8Array([
			e & 255,
			e >> 8 & 255,
			e >> 16 & 255,
			e >> 24 & 255
		]);
	} else throw new Error("Compact encoding > 2^30 not supported");
}
function qa(t) {
	if (t < BigInt(1) << BigInt(6)) return new Uint8Array([Number(t << BigInt(2))]);
	if (t < BigInt(1) << BigInt(14)) {
		const e = t << BigInt(2) | BigInt(1);
		return new Uint8Array([Number(e & BigInt(255)), Number(e >> BigInt(8) & BigInt(255))]);
	} else if (t < BigInt(1) << BigInt(30)) {
		const e = t << BigInt(2) | BigInt(2);
		return new Uint8Array([
			Number(e & BigInt(255)),
			Number(e >> BigInt(8) & BigInt(255)),
			Number(e >> BigInt(16) & BigInt(255)),
			Number(e >> BigInt(24) & BigInt(255))
		]);
	} else throw new Error("BigInt compact encoding not supported > 2^30");
}
function Ka(t) {
	const e = Uint8Array.from(Buffer.from(t.signature, "hex")), r = bs({
		publicKey: gs(t.transaction.address),
		signature: e,
		payload: t.transaction
	});
	return ys$1(Buffer.from(r).toString("hex"));
}
var import_cjs$3, import_cjs$4, import_cjs$5, import_blakejs, xe$1, $s, Cs, Ls, Jn$1, js, ks, Ze$1, Qn$1, Ps, tr$1, er$1, J$1, Ds, Qs$1, gi$1, Be$1, yr$1, xr$1, vr$1, At$1, St$1, se, ie, bi$1, yi$1, mi$1, wi$1, xi$1, vi$1, tn$1, en$1, Ei$1, Bi$1, Ii$1, Ai$1, Gt$1, Er$1, wt, Ot$1, Ir$1, Ni$1, xt$1, Ie, _i$1, ue, Ti$1, Ri$1, $i$1, Ci$1, Sr$1, Nr$1, Or$1, Ur$1, Li$1, ji$1, _r$1, Tr$1, qn$1, Pi$1, Hi$1, Rr$1, Ut$1, W$1, Y$1, qi$1, _t, Ki$1, $r$1, Fi$1, zi$1, Tt$1, Rt$1, cn$1, Gi$1, X$1, Zi, Ae$1, Wi$1, Yi$1, Xi, Ji, F$1, N$1, tf, ef, nf, rf, lf, df, hf, Pr$1, pf, gf, Hr$1, ln$1, Dr$1, bf, Se$1, Mr$1, Vr$1, dn$1, qr$1, Of, Rf, ro$1, Lf, jf, kf, Pf, Ue$1, Hf, oo$1, so$1, G$1, Vf, Kf, zf, Gf, io$1, Zf, Wf, co$1, ao$1, _e, vn, uo$1, Jf, Te, En$1, Bn$1, Sn, je, ot, Q$1, Dt, nc, po$1, go$1, bo$1, ic, Xt$1, Mt$1, Un$1, Ao$1, de, Jt$1, Pe$1, xc, Oo$1, vc, Ec, Uo$1, Tn$1, Sc, vt, he$1, pe$1, Nc, He$1, Oc, $o$1, Co$1, Lo$1, jc, kc, Pc, Hc, Dc, $n$1, tt$1, Qt$1, De$1, te, Mc, jo$1, be$1, Ln$1, ia, fa, ca, Fo$1, aa, ua, zo$1, la, da, Jo$1, Qo$1, Mn$1, Ha;
var init_index_es$4 = __esmMin((() => {
	init_es();
	import_cjs$3 = require_cjs$3();
	import_cjs$4 = require_cjs$2();
	import_cjs$5 = require_cjs$1();
	init__esm();
	init_esm$1();
	init_dist_esm();
	init_esm$5();
	init_index_es$6();
	init_src();
	init_index_es$5();
	import_blakejs = require_blakejs();
	xe$1 = ":";
	$s = Object.defineProperty, Cs = Object.defineProperties, Ls = Object.getOwnPropertyDescriptors, Jn$1 = Object.getOwnPropertySymbols, js = Object.prototype.hasOwnProperty, ks = Object.prototype.propertyIsEnumerable, Ze$1 = (t, e, n) => e in t ? $s(t, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: n
	}) : t[e] = n, Qn$1 = (t, e) => {
		for (var n in e || (e = {})) js.call(e, n) && Ze$1(t, n, e[n]);
		if (Jn$1) for (var n of Jn$1(e)) ks.call(e, n) && Ze$1(t, n, e[n]);
		return t;
	}, Ps = (t, e) => Cs(t, Ls(e)), tr$1 = (t, e, n) => Ze$1(t, typeof e != "symbol" ? e + "" : e, n);
	er$1 = "ReactNative", J$1 = {
		reactNative: "react-native",
		node: "node",
		browser: "browser",
		unknown: "unknown"
	}, Ds = 1e3;
	Qs$1 = (t) => t;
	gi$1 = class {
		constructor({ limit: e }) {
			tr$1(this, "limit"), tr$1(this, "set"), this.limit = e, this.set = /* @__PURE__ */ new Set();
		}
		add(e) {
			if (!this.set.has(e)) {
				if (this.set.size >= this.limit) {
					const n = this.set.values().next().value;
					n && this.set.delete(n);
				}
				this.set.add(e);
			}
		}
		has(e) {
			return this.set.has(e);
		}
	};
	Be$1 = BigInt(2 ** 32 - 1), yr$1 = BigInt(32);
	xr$1 = (t, e, n) => t >>> n, vr$1 = (t, e, n) => t << 32 - n | e >>> n, At$1 = (t, e, n) => t >>> n | e << 32 - n, St$1 = (t, e, n) => t << 32 - n | e >>> n, se = (t, e, n) => t << 64 - n | e >>> n - 32, ie = (t, e, n) => t >>> n - 32 | e << 64 - n, bi$1 = (t, e) => e, yi$1 = (t, e) => t, mi$1 = (t, e, n) => t << n | e >>> 32 - n, wi$1 = (t, e, n) => e << n | t >>> 32 - n, xi$1 = (t, e, n) => e << n - 32 | t >>> 64 - n, vi$1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
	tn$1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), en$1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Ei$1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Bi$1 = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, Ii$1 = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), Ai$1 = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, Gt$1 = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
	Er$1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
	wt = Er$1 ? (t) => t : (t) => Br$1(t);
	Ot$1 = Er$1 ? (t) => t : Si$1, Ir$1 = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Ni$1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
	xt$1 = {
		_0: 48,
		_9: 57,
		A: 65,
		F: 70,
		a: 97,
		f: 102
	};
	Ie = class {};
	_i$1 = BigInt(0), ue = BigInt(1), Ti$1 = BigInt(2), Ri$1 = BigInt(7), $i$1 = BigInt(256), Ci$1 = BigInt(113), Sr$1 = [], Nr$1 = [], Or$1 = [];
	for (let t = 0, e = ue, n = 1, r = 0; t < 24; t++) {
		[n, r] = [r, (2 * n + 3 * r) % 5], Sr$1.push(2 * (5 * r + n)), Nr$1.push((t + 1) * (t + 2) / 2 % 64);
		let o = _i$1;
		for (let s = 0; s < 7; s++) e = (e << ue ^ (e >> Ri$1) * Ci$1) % $i$1, e & Ti$1 && (o ^= ue << (ue << BigInt(s)) - ue);
		Or$1.push(o);
	}
	Ur$1 = wr$1(Or$1, !0), Li$1 = Ur$1[0], ji$1 = Ur$1[1], _r$1 = (t, e, n) => n > 32 ? xi$1(t, e, n) : mi$1(t, e, n), Tr$1 = (t, e, n) => n > 32 ? vi$1(t, e, n) : wi$1(t, e, n);
	qn$1 = class qn$1 extends Ie {
		constructor(e, n, r, o = !1, s = 24) {
			if (super(), this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, this.enableXOF = !1, this.blockLen = e, this.suffix = n, this.outputLen = r, this.enableXOF = o, this.rounds = s, mt(r), !(0 < e && e < 200)) throw new Error("only keccak-f1600 function is supported");
			this.state = new Uint8Array(200), this.state32 = fe$1(this.state);
		}
		clone() {
			return this._cloneInto();
		}
		keccak() {
			Ot$1(this.state32), ki$1(this.state32, this.rounds), Ot$1(this.state32), this.posOut = 0, this.pos = 0;
		}
		update(e) {
			Nt$1(this), e = ht(e), at(e);
			const { blockLen: n, state: r } = this, o = e.length;
			for (let s = 0; s < o;) {
				const i = Math.min(n - this.pos, o - s);
				for (let f = 0; f < i; f++) r[this.pos++] ^= e[s++];
				this.pos === n && this.keccak();
			}
			return this;
		}
		finish() {
			if (this.finished) return;
			this.finished = !0;
			const { state: e, suffix: n, pos: r, blockLen: o } = this;
			e[r] ^= n, n & 128 && r === o - 1 && this.keccak(), e[o - 1] ^= 128, this.keccak();
		}
		writeInto(e) {
			Nt$1(this, !1), at(e), this.finish();
			const n = this.state, { blockLen: r } = this;
			for (let o = 0, s = e.length; o < s;) {
				this.posOut >= r && this.keccak();
				const i = Math.min(r - this.posOut, s - o);
				e.set(n.subarray(this.posOut, this.posOut + i), o), this.posOut += i, o += i;
			}
			return e;
		}
		xofInto(e) {
			if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
			return this.writeInto(e);
		}
		xof(e) {
			return mt(e), this.xofInto(new Uint8Array(e));
		}
		digestInto(e) {
			if (on$1(e, this), this.finished) throw new Error("digest() was already called");
			return this.writeInto(e), this.destroy(), e;
		}
		digest() {
			return this.digestInto(new Uint8Array(this.outputLen));
		}
		destroy() {
			this.destroyed = !0, ut(this.state);
		}
		_cloneInto(e) {
			const { blockLen: n, suffix: r, outputLen: o, rounds: s, enableXOF: i } = this;
			return e || (e = new qn$1(n, r, o, i, s)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = s, e.suffix = r, e.outputLen = o, e.enableXOF = i, e.destroyed = this.destroyed, e;
		}
	};
	Pi$1 = (t, e, n) => ae$1(() => new qn$1(e, t, n)), Hi$1 = Pi$1(1, 136, 256 / 8);
	Rr$1 = class extends Ie {
		constructor(e, n, r, o) {
			super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.buffer = new Uint8Array(e), this.view = sn$1(this.buffer);
		}
		update(e) {
			Nt$1(this), e = ht(e), at(e);
			const { view: n, buffer: r, blockLen: o } = this, s = e.length;
			for (let i = 0; i < s;) {
				const f = Math.min(o - this.pos, s - i);
				if (f === o) {
					const a = sn$1(e);
					for (; o <= s - i; i += o) this.process(a, i);
					continue;
				}
				r.set(e.subarray(i, i + f), this.pos), this.pos += f, i += f, this.pos === o && (this.process(n, 0), this.pos = 0);
			}
			return this.length += e.length, this.roundClean(), this;
		}
		digestInto(e) {
			Nt$1(this), on$1(e, this), this.finished = !0;
			const { buffer: n, view: r, blockLen: o, isLE: s } = this;
			let { pos: i } = this;
			n[i++] = 128, ut(this.buffer.subarray(i)), this.padOffset > o - i && (this.process(r, 0), i = 0);
			for (let u = i; u < o; u++) n[u] = 0;
			Di$1(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
			const f = sn$1(e), a = this.outputLen;
			if (a % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
			const l = a / 4, c = this.get();
			if (l > c.length) throw new Error("_sha2: outputLen bigger than state");
			for (let u = 0; u < l; u++) f.setUint32(4 * u, c[u], s);
		}
		digest() {
			const { buffer: e, outputLen: n } = this;
			this.digestInto(e);
			const r = e.slice(0, n);
			return this.destroy(), r;
		}
		_cloneInto(e) {
			e || (e = new this.constructor()), e.set(...this.get());
			const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: f } = this;
			return e.destroyed = i, e.finished = s, e.length = o, e.pos = f, o % n && e.buffer.set(r), e;
		}
		clone() {
			return this._cloneInto();
		}
	};
	Ut$1 = Uint32Array.from([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]), W$1 = Uint32Array.from([
		3418070365,
		3238371032,
		1654270250,
		914150663,
		2438529370,
		812702999,
		355462360,
		4144912697,
		1731405415,
		4290775857,
		2394180231,
		1750603025,
		3675008525,
		1694076839,
		1203062813,
		3204075428
	]), Y$1 = Uint32Array.from([
		1779033703,
		4089235720,
		3144134277,
		2227873595,
		1013904242,
		4271175723,
		2773480762,
		1595750129,
		1359893119,
		2917565137,
		2600822924,
		725511199,
		528734635,
		4215389547,
		1541459225,
		327033209
	]), qi$1 = Uint32Array.from([
		1116352408,
		1899447441,
		3049323471,
		3921009573,
		961987163,
		1508970993,
		2453635748,
		2870763221,
		3624381080,
		310598401,
		607225278,
		1426881987,
		1925078388,
		2162078206,
		2614888103,
		3248222580,
		3835390401,
		4022224774,
		264347078,
		604807628,
		770255983,
		1249150122,
		1555081692,
		1996064986,
		2554220882,
		2821834349,
		2952996808,
		3210313671,
		3336571891,
		3584528711,
		113926993,
		338241895,
		666307205,
		773529912,
		1294757372,
		1396182291,
		1695183700,
		1986661051,
		2177026350,
		2456956037,
		2730485921,
		2820302411,
		3259730800,
		3345764771,
		3516065817,
		3600352804,
		4094571909,
		275423344,
		430227734,
		506948616,
		659060556,
		883997877,
		958139571,
		1322822218,
		1537002063,
		1747873779,
		1955562222,
		2024104815,
		2227730452,
		2361852424,
		2428436474,
		2756734187,
		3204031479,
		3329325298
	]), _t = new Uint32Array(64);
	Ki$1 = class extends Rr$1 {
		constructor(e = 32) {
			super(64, e, 8, !1), this.A = Ut$1[0] | 0, this.B = Ut$1[1] | 0, this.C = Ut$1[2] | 0, this.D = Ut$1[3] | 0, this.E = Ut$1[4] | 0, this.F = Ut$1[5] | 0, this.G = Ut$1[6] | 0, this.H = Ut$1[7] | 0;
		}
		get() {
			const { A: e, B: n, C: r, D: o, E: s, F: i, G: f, H: a } = this;
			return [
				e,
				n,
				r,
				o,
				s,
				i,
				f,
				a
			];
		}
		set(e, n, r, o, s, i, f, a) {
			this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = f | 0, this.H = a | 0;
		}
		process(e, n) {
			for (let u = 0; u < 16; u++, n += 4) _t[u] = e.getUint32(n, !1);
			for (let u = 16; u < 64; u++) {
				const h = _t[u - 15], g = _t[u - 2], w = gt(h, 7) ^ gt(h, 18) ^ h >>> 3;
				_t[u] = (gt(g, 17) ^ gt(g, 19) ^ g >>> 10) + _t[u - 7] + w + _t[u - 16] | 0;
			}
			let { A: r, B: o, C: s, D: i, E: f, F: a, G: l, H: c } = this;
			for (let u = 0; u < 64; u++) {
				const h = gt(f, 6) ^ gt(f, 11) ^ gt(f, 25), g = c + h + Mi$1(f, a, l) + qi$1[u] + _t[u] | 0, y = (gt(r, 2) ^ gt(r, 13) ^ gt(r, 22)) + Vi$1(r, o, s) | 0;
				c = l, l = a, a = f, f = i + g | 0, i = s, s = o, o = r, r = g + y | 0;
			}
			r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, f = f + this.E | 0, a = a + this.F | 0, l = l + this.G | 0, c = c + this.H | 0, this.set(r, o, s, i, f, a, l, c);
		}
		roundClean() {
			ut(_t);
		}
		destroy() {
			this.set(0, 0, 0, 0, 0, 0, 0, 0), ut(this.buffer);
		}
	};
	$r$1 = wr$1([
		"0x428a2f98d728ae22",
		"0x7137449123ef65cd",
		"0xb5c0fbcfec4d3b2f",
		"0xe9b5dba58189dbbc",
		"0x3956c25bf348b538",
		"0x59f111f1b605d019",
		"0x923f82a4af194f9b",
		"0xab1c5ed5da6d8118",
		"0xd807aa98a3030242",
		"0x12835b0145706fbe",
		"0x243185be4ee4b28c",
		"0x550c7dc3d5ffb4e2",
		"0x72be5d74f27b896f",
		"0x80deb1fe3b1696b1",
		"0x9bdc06a725c71235",
		"0xc19bf174cf692694",
		"0xe49b69c19ef14ad2",
		"0xefbe4786384f25e3",
		"0x0fc19dc68b8cd5b5",
		"0x240ca1cc77ac9c65",
		"0x2de92c6f592b0275",
		"0x4a7484aa6ea6e483",
		"0x5cb0a9dcbd41fbd4",
		"0x76f988da831153b5",
		"0x983e5152ee66dfab",
		"0xa831c66d2db43210",
		"0xb00327c898fb213f",
		"0xbf597fc7beef0ee4",
		"0xc6e00bf33da88fc2",
		"0xd5a79147930aa725",
		"0x06ca6351e003826f",
		"0x142929670a0e6e70",
		"0x27b70a8546d22ffc",
		"0x2e1b21385c26c926",
		"0x4d2c6dfc5ac42aed",
		"0x53380d139d95b3df",
		"0x650a73548baf63de",
		"0x766a0abb3c77b2a8",
		"0x81c2c92e47edaee6",
		"0x92722c851482353b",
		"0xa2bfe8a14cf10364",
		"0xa81a664bbc423001",
		"0xc24b8b70d0f89791",
		"0xc76c51a30654be30",
		"0xd192e819d6ef5218",
		"0xd69906245565a910",
		"0xf40e35855771202a",
		"0x106aa07032bbd1b8",
		"0x19a4c116b8d2d0c8",
		"0x1e376c085141ab53",
		"0x2748774cdf8eeb99",
		"0x34b0bcb5e19b48a8",
		"0x391c0cb3c5c95a63",
		"0x4ed8aa4ae3418acb",
		"0x5b9cca4f7763e373",
		"0x682e6ff3d6b2b8a3",
		"0x748f82ee5defb2fc",
		"0x78a5636f43172f60",
		"0x84c87814a1f0ab72",
		"0x8cc702081a6439ec",
		"0x90befffa23631e28",
		"0xa4506cebde82bde9",
		"0xbef9a3f7b2c67915",
		"0xc67178f2e372532b",
		"0xca273eceea26619c",
		"0xd186b8c721c0c207",
		"0xeada7dd6cde0eb1e",
		"0xf57d4f7fee6ed178",
		"0x06f067aa72176fba",
		"0x0a637dc5a2c898a6",
		"0x113f9804bef90dae",
		"0x1b710b35131c471b",
		"0x28db77f523047d84",
		"0x32caab7b40c72493",
		"0x3c9ebe0a15c9bebc",
		"0x431d67c49c100d4c",
		"0x4cc5d4becb3e42b6",
		"0x597f299cfc657e2a",
		"0x5fcb6fab3ad6faec",
		"0x6c44198c4a475817"
	].map((t) => BigInt(t))), Fi$1 = $r$1[0], zi$1 = $r$1[1], Tt$1 = new Uint32Array(80), Rt$1 = new Uint32Array(80);
	cn$1 = class extends Rr$1 {
		constructor(e = 64) {
			super(128, e, 16, !1), this.Ah = Y$1[0] | 0, this.Al = Y$1[1] | 0, this.Bh = Y$1[2] | 0, this.Bl = Y$1[3] | 0, this.Ch = Y$1[4] | 0, this.Cl = Y$1[5] | 0, this.Dh = Y$1[6] | 0, this.Dl = Y$1[7] | 0, this.Eh = Y$1[8] | 0, this.El = Y$1[9] | 0, this.Fh = Y$1[10] | 0, this.Fl = Y$1[11] | 0, this.Gh = Y$1[12] | 0, this.Gl = Y$1[13] | 0, this.Hh = Y$1[14] | 0, this.Hl = Y$1[15] | 0;
		}
		get() {
			const { Ah: e, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: f, Dl: a, Eh: l, El: c, Fh: u, Fl: h, Gh: g, Gl: w, Hh: y, Hl: x } = this;
			return [
				e,
				n,
				r,
				o,
				s,
				i,
				f,
				a,
				l,
				c,
				u,
				h,
				g,
				w,
				y,
				x
			];
		}
		set(e, n, r, o, s, i, f, a, l, c, u, h, g, w, y, x) {
			this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = f | 0, this.Dl = a | 0, this.Eh = l | 0, this.El = c | 0, this.Fh = u | 0, this.Fl = h | 0, this.Gh = g | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = x | 0;
		}
		process(e, n) {
			for (let L = 0; L < 16; L++, n += 4) Tt$1[L] = e.getUint32(n), Rt$1[L] = e.getUint32(n += 4);
			for (let L = 16; L < 80; L++) {
				const V = Tt$1[L - 15] | 0, _ = Rt$1[L - 15] | 0, k = At$1(V, _, 1) ^ At$1(V, _, 8) ^ xr$1(V, _, 7), j = St$1(V, _, 1) ^ St$1(V, _, 8) ^ vr$1(V, _, 7), $ = Tt$1[L - 2] | 0, d = Rt$1[L - 2] | 0, m = At$1($, d, 19) ^ se($, d, 61) ^ xr$1($, d, 6), b = Ei$1(j, St$1($, d, 19) ^ ie($, d, 61) ^ vr$1($, d, 6), Rt$1[L - 7], Rt$1[L - 16]);
				Tt$1[L] = Bi$1(b, k, m, Tt$1[L - 7], Tt$1[L - 16]) | 0, Rt$1[L] = b | 0;
			}
			let { Ah: r, Al: o, Bh: s, Bl: i, Ch: f, Cl: a, Dh: l, Dl: c, Eh: u, El: h, Fh: g, Fl: w, Gh: y, Gl: x, Hh: R, Hl: M } = this;
			for (let L = 0; L < 80; L++) {
				const V = At$1(u, h, 14) ^ At$1(u, h, 18) ^ se(u, h, 41), _ = St$1(u, h, 14) ^ St$1(u, h, 18) ^ ie(u, h, 41), k = u & g ^ ~u & y, j = h & w ^ ~h & x, $ = Ii$1(M, _, j, zi$1[L], Rt$1[L]), d = Ai$1($, R, V, k, Fi$1[L], Tt$1[L]), m = $ | 0, p = At$1(r, o, 28) ^ se(r, o, 34) ^ se(r, o, 39), b = St$1(r, o, 28) ^ ie(r, o, 34) ^ ie(r, o, 39), v = r & s ^ r & f ^ s & f, B = o & i ^ o & a ^ i & a;
				R = y | 0, M = x | 0, y = g | 0, x = w | 0, g = u | 0, w = h | 0, {h: u, l: h} = dt(l | 0, c | 0, d | 0, m | 0), l = f | 0, c = a | 0, f = s | 0, a = i | 0, s = r | 0, i = o | 0;
				const E = tn$1(m, b, B);
				r = en$1(E, d, p, v), o = E | 0;
			}
			({h: r, l: o} = dt(this.Ah | 0, this.Al | 0, r | 0, o | 0)), {h: s, l: i} = dt(this.Bh | 0, this.Bl | 0, s | 0, i | 0), {h: f, l: a} = dt(this.Ch | 0, this.Cl | 0, f | 0, a | 0), {h: l, l: c} = dt(this.Dh | 0, this.Dl | 0, l | 0, c | 0), {h: u, l: h} = dt(this.Eh | 0, this.El | 0, u | 0, h | 0), {h: g, l: w} = dt(this.Fh | 0, this.Fl | 0, g | 0, w | 0), {h: y, l: x} = dt(this.Gh | 0, this.Gl | 0, y | 0, x | 0), {h: R, l: M} = dt(this.Hh | 0, this.Hl | 0, R | 0, M | 0), this.set(r, o, s, i, f, a, l, c, u, h, g, w, y, x, R, M);
		}
		roundClean() {
			ut(Tt$1, Rt$1);
		}
		destroy() {
			ut(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		}
	};
	Gi$1 = class extends cn$1 {
		constructor() {
			super(48), this.Ah = W$1[0] | 0, this.Al = W$1[1] | 0, this.Bh = W$1[2] | 0, this.Bl = W$1[3] | 0, this.Ch = W$1[4] | 0, this.Cl = W$1[5] | 0, this.Dh = W$1[6] | 0, this.Dl = W$1[7] | 0, this.Eh = W$1[8] | 0, this.El = W$1[9] | 0, this.Fh = W$1[10] | 0, this.Fl = W$1[11] | 0, this.Gh = W$1[12] | 0, this.Gl = W$1[13] | 0, this.Hh = W$1[14] | 0, this.Hl = W$1[15] | 0;
		}
	};
	X$1 = Uint32Array.from([
		573645204,
		4230739756,
		2673172387,
		3360449730,
		596883563,
		1867755857,
		2520282905,
		1497426621,
		2519219938,
		2827943907,
		3193839141,
		1401305490,
		721525244,
		746961066,
		246885852,
		2177182882
	]);
	Zi = class extends cn$1 {
		constructor() {
			super(32), this.Ah = X$1[0] | 0, this.Al = X$1[1] | 0, this.Bh = X$1[2] | 0, this.Bl = X$1[3] | 0, this.Ch = X$1[4] | 0, this.Cl = X$1[5] | 0, this.Dh = X$1[6] | 0, this.Dl = X$1[7] | 0, this.Eh = X$1[8] | 0, this.El = X$1[9] | 0, this.Fh = X$1[10] | 0, this.Fl = X$1[11] | 0, this.Gh = X$1[12] | 0, this.Gl = X$1[13] | 0, this.Hh = X$1[14] | 0, this.Hl = X$1[15] | 0;
		}
	};
	Ae$1 = ae$1(() => new Ki$1()), Wi$1 = ae$1(() => new cn$1()), Yi$1 = ae$1(() => new Gi$1()), Xi = ae$1(() => new Zi()), Ji = Uint8Array.from([
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		14,
		10,
		4,
		8,
		9,
		15,
		13,
		6,
		1,
		12,
		0,
		2,
		11,
		7,
		5,
		3,
		11,
		8,
		12,
		0,
		5,
		2,
		15,
		13,
		10,
		14,
		3,
		6,
		7,
		1,
		9,
		4,
		7,
		9,
		3,
		1,
		13,
		12,
		11,
		14,
		2,
		6,
		5,
		10,
		4,
		0,
		15,
		8,
		9,
		0,
		5,
		7,
		2,
		4,
		10,
		15,
		14,
		1,
		11,
		12,
		6,
		8,
		3,
		13,
		2,
		12,
		6,
		10,
		0,
		11,
		8,
		3,
		4,
		13,
		7,
		5,
		15,
		14,
		1,
		9,
		12,
		5,
		1,
		15,
		14,
		13,
		4,
		10,
		0,
		7,
		6,
		3,
		9,
		2,
		8,
		11,
		13,
		11,
		7,
		14,
		12,
		1,
		3,
		9,
		5,
		0,
		15,
		4,
		8,
		6,
		2,
		10,
		6,
		15,
		14,
		9,
		11,
		3,
		0,
		8,
		12,
		2,
		13,
		7,
		1,
		4,
		10,
		5,
		10,
		2,
		8,
		4,
		7,
		6,
		1,
		5,
		15,
		11,
		9,
		14,
		3,
		12,
		13,
		0,
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		14,
		10,
		4,
		8,
		9,
		15,
		13,
		6,
		1,
		12,
		0,
		2,
		11,
		7,
		5,
		3,
		11,
		8,
		12,
		0,
		5,
		2,
		15,
		13,
		10,
		14,
		3,
		6,
		7,
		1,
		9,
		4,
		7,
		9,
		3,
		1,
		13,
		12,
		11,
		14,
		2,
		6,
		5,
		10,
		4,
		0,
		15,
		8,
		9,
		0,
		5,
		7,
		2,
		4,
		10,
		15,
		14,
		1,
		11,
		12,
		6,
		8,
		3,
		13,
		2,
		12,
		6,
		10,
		0,
		11,
		8,
		3,
		4,
		13,
		7,
		5,
		15,
		14,
		1,
		9
	]), F$1 = Uint32Array.from([
		4089235720,
		1779033703,
		2227873595,
		3144134277,
		4271175723,
		1013904242,
		1595750129,
		2773480762,
		2917565137,
		1359893119,
		725511199,
		2600822924,
		4215389547,
		528734635,
		327033209,
		1541459225
	]), N$1 = new Uint32Array(32);
	tf = class extends Ie {
		constructor(e, n) {
			super(), this.finished = !1, this.destroyed = !1, this.length = 0, this.pos = 0, mt(e), mt(n), this.blockLen = e, this.outputLen = n, this.buffer = new Uint8Array(e), this.buffer32 = fe$1(this.buffer);
		}
		update(e) {
			Nt$1(this), e = ht(e), at(e);
			const { blockLen: n, buffer: r, buffer32: o } = this, s = e.length, i = e.byteOffset, f = e.buffer;
			for (let a = 0; a < s;) {
				this.pos === n && (Ot$1(o), this.compress(o, 0, !1), Ot$1(o), this.pos = 0);
				const l = Math.min(n - this.pos, s - a), c = i + a;
				if (l === n && !(c % 4) && a + l < s) {
					const u = new Uint32Array(f, c, Math.floor((s - a) / 4));
					Ot$1(u);
					for (let h = 0; a + n < s; h += o.length, a += n) this.length += n, this.compress(u, h, !1);
					Ot$1(u);
					continue;
				}
				r.set(e.subarray(a, a + l), this.pos), this.pos += l, this.length += l, a += l;
			}
			return this;
		}
		digestInto(e) {
			Nt$1(this), on$1(e, this);
			const { pos: n, buffer32: r } = this;
			this.finished = !0, ut(this.buffer.subarray(n)), Ot$1(r), this.compress(r, 0, !0), Ot$1(r);
			const o = fe$1(e);
			this.get().forEach((s, i) => o[i] = wt(s));
		}
		digest() {
			const { buffer: e, outputLen: n } = this;
			this.digestInto(e);
			const r = e.slice(0, n);
			return this.destroy(), r;
		}
		_cloneInto(e) {
			const { buffer: n, length: r, finished: o, destroyed: s, outputLen: i, pos: f } = this;
			return e || (e = new this.constructor({ dkLen: i })), e.set(...this.get()), e.buffer.set(n), e.destroyed = s, e.finished = o, e.length = r, e.pos = f, e.outputLen = i, e;
		}
		clone() {
			return this._cloneInto();
		}
	};
	ef = class extends tf {
		constructor(e = {}) {
			const n = e.dkLen === void 0 ? 64 : e.dkLen;
			super(128, n), this.v0l = F$1[0] | 0, this.v0h = F$1[1] | 0, this.v1l = F$1[2] | 0, this.v1h = F$1[3] | 0, this.v2l = F$1[4] | 0, this.v2h = F$1[5] | 0, this.v3l = F$1[6] | 0, this.v3h = F$1[7] | 0, this.v4l = F$1[8] | 0, this.v4h = F$1[9] | 0, this.v5l = F$1[10] | 0, this.v5h = F$1[11] | 0, this.v6l = F$1[12] | 0, this.v6h = F$1[13] | 0, this.v7l = F$1[14] | 0, this.v7h = F$1[15] | 0, Qi$1(n, e, 64, 16, 16);
			let { key: r, personalization: o, salt: s } = e, i = 0;
			if (r !== void 0 && (r = ht(r), i = r.length), this.v0l ^= this.outputLen | i << 8 | 16842752, s !== void 0) {
				s = ht(s);
				const f = fe$1(s);
				this.v4l ^= wt(f[0]), this.v4h ^= wt(f[1]), this.v5l ^= wt(f[2]), this.v5h ^= wt(f[3]);
			}
			if (o !== void 0) {
				o = ht(o);
				const f = fe$1(o);
				this.v6l ^= wt(f[0]), this.v6h ^= wt(f[1]), this.v7l ^= wt(f[2]), this.v7h ^= wt(f[3]);
			}
			if (r !== void 0) {
				const f = new Uint8Array(this.blockLen);
				f.set(r), this.update(f);
			}
		}
		get() {
			let { v0l: e, v0h: n, v1l: r, v1h: o, v2l: s, v2h: i, v3l: f, v3h: a, v4l: l, v4h: c, v5l: u, v5h: h, v6l: g, v6h: w, v7l: y, v7h: x } = this;
			return [
				e,
				n,
				r,
				o,
				s,
				i,
				f,
				a,
				l,
				c,
				u,
				h,
				g,
				w,
				y,
				x
			];
		}
		set(e, n, r, o, s, i, f, a, l, c, u, h, g, w, y, x) {
			this.v0l = e | 0, this.v0h = n | 0, this.v1l = r | 0, this.v1h = o | 0, this.v2l = s | 0, this.v2h = i | 0, this.v3l = f | 0, this.v3h = a | 0, this.v4l = l | 0, this.v4h = c | 0, this.v5l = u | 0, this.v5h = h | 0, this.v6l = g | 0, this.v6h = w | 0, this.v7l = y | 0, this.v7h = x | 0;
		}
		compress(e, n, r) {
			this.get().forEach((a, l) => N$1[l] = a), N$1.set(F$1, 16);
			let { h: o, l: s } = mr$1(BigInt(this.length));
			N$1[24] = F$1[8] ^ s, N$1[25] = F$1[9] ^ o, r && (N$1[28] = ~N$1[28], N$1[29] = ~N$1[29]);
			let i = 0;
			const f = Ji;
			for (let a = 0; a < 12; a++) $t$1(0, 4, 8, 12, e, n + 2 * f[i++]), Ct$1(0, 4, 8, 12, e, n + 2 * f[i++]), $t$1(1, 5, 9, 13, e, n + 2 * f[i++]), Ct$1(1, 5, 9, 13, e, n + 2 * f[i++]), $t$1(2, 6, 10, 14, e, n + 2 * f[i++]), Ct$1(2, 6, 10, 14, e, n + 2 * f[i++]), $t$1(3, 7, 11, 15, e, n + 2 * f[i++]), Ct$1(3, 7, 11, 15, e, n + 2 * f[i++]), $t$1(0, 5, 10, 15, e, n + 2 * f[i++]), Ct$1(0, 5, 10, 15, e, n + 2 * f[i++]), $t$1(1, 6, 11, 12, e, n + 2 * f[i++]), Ct$1(1, 6, 11, 12, e, n + 2 * f[i++]), $t$1(2, 7, 8, 13, e, n + 2 * f[i++]), Ct$1(2, 7, 8, 13, e, n + 2 * f[i++]), $t$1(3, 4, 9, 14, e, n + 2 * f[i++]), Ct$1(3, 4, 9, 14, e, n + 2 * f[i++]);
			this.v0l ^= N$1[0] ^ N$1[16], this.v0h ^= N$1[1] ^ N$1[17], this.v1l ^= N$1[2] ^ N$1[18], this.v1h ^= N$1[3] ^ N$1[19], this.v2l ^= N$1[4] ^ N$1[20], this.v2h ^= N$1[5] ^ N$1[21], this.v3l ^= N$1[6] ^ N$1[22], this.v3h ^= N$1[7] ^ N$1[23], this.v4l ^= N$1[8] ^ N$1[24], this.v4h ^= N$1[9] ^ N$1[25], this.v5l ^= N$1[10] ^ N$1[26], this.v5h ^= N$1[11] ^ N$1[27], this.v6l ^= N$1[12] ^ N$1[28], this.v6h ^= N$1[13] ^ N$1[29], this.v7l ^= N$1[14] ^ N$1[30], this.v7h ^= N$1[15] ^ N$1[31], ut(N$1);
		}
		destroy() {
			this.destroyed = !0, ut(this.buffer32), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		}
	};
	nf = Ui$1((t) => new ef(t)), rf = "https://rpc.walletconnect.org/v1";
	lf = Object.defineProperty, df = Object.defineProperties, hf = Object.getOwnPropertyDescriptors, Pr$1 = Object.getOwnPropertySymbols, pf = Object.prototype.hasOwnProperty, gf = Object.prototype.propertyIsEnumerable, Hr$1 = (t, e, n) => e in t ? lf(t, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: n
	}) : t[e] = n, ln$1 = (t, e) => {
		for (var n in e || (e = {})) pf.call(e, n) && Hr$1(t, n, e[n]);
		if (Pr$1) for (var n of Pr$1(e)) gf.call(e, n) && Hr$1(t, n, e[n]);
		return t;
	}, Dr$1 = (t, e) => df(t, hf(e));
	bf = "did:pkh:", Se$1 = (t) => t?.split(":"), Mr$1 = (t) => {
		const e = t && Se$1(t);
		if (e) return t.includes(bf) ? e[3] : e[1];
	}, Vr$1 = (t) => {
		const e = t && Se$1(t);
		if (e) return e[2] + ":" + e[3];
	}, dn$1 = (t) => {
		const e = t && Se$1(t);
		if (e) return e.pop();
	};
	qr$1 = (t, e) => {
		const n = `${t.domain} wants you to sign in with your Ethereum account:`, r = dn$1(e);
		if (!t.aud && !t.uri) throw new Error("Either `aud` or `uri` is required to construct the message");
		let o = t.statement || void 0;
		const s = `URI: ${t.aud || t.uri}`, i = `Version: ${t.version}`, f = `Chain ID: ${Mr$1(e)}`, a = `Nonce: ${t.nonce}`, l = `Issued At: ${t.iat}`, c = t.exp ? `Expiration Time: ${t.exp}` : void 0, u = t.nbf ? `Not Before: ${t.nbf}` : void 0, h = t.requestId ? `Request ID: ${t.requestId}` : void 0, g = t.resources ? `Resources:${t.resources.map((y) => `
- ${y}`).join("")}` : void 0, w = Oe$1(t.resources);
		if (w) {
			const y = Lt$1(w);
			o = gn$1(o, y);
		}
		return [
			n,
			r,
			"",
			o,
			"",
			s,
			i,
			f,
			a,
			l,
			c,
			u,
			h,
			g
		].filter((y) => y != null).join(`
`);
	};
	Of = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
	Rf = (t, e) => {
		function n(r, ...o) {
			if (nt(r), !Of) throw new Error("Non little-endian hardware is not yet supported");
			if (t.nonceLength !== void 0) {
				const c = o[0];
				if (!c) throw new Error("nonce / iv required");
				t.varSizeNonce ? nt(c) : nt(c, t.nonceLength);
			}
			const s = t.tagLength;
			s && o[1] !== void 0 && nt(o[1]);
			const i = e(r, ...o), f = (c, u) => {
				if (u !== void 0) {
					if (c !== 2) throw new Error("cipher output not supported");
					nt(u);
				}
			};
			let a = !1;
			return {
				encrypt(c, u) {
					if (a) throw new Error("cannot encrypt() twice with same key + nonce");
					return a = !0, nt(c), f(i.encrypt.length, u), i.encrypt(c, u);
				},
				decrypt(c, u) {
					if (nt(c), s && c.length < s) throw new Error("invalid ciphertext length: smaller than tagLength=" + s);
					return f(i.decrypt.length, u), i.decrypt(c, u);
				}
			};
		}
		return Object.assign(n, t), n;
	};
	ro$1 = (t) => Uint8Array.from(t.split("").map((e) => e.charCodeAt(0))), Lf = ro$1("expand 16-byte k"), jf = ro$1("expand 32-byte k"), kf = jt$1(Lf), Pf = jt$1(jf);
	Ue$1 = 64, Hf = 16, oo$1 = 2 ** 32 - 1, so$1 = new Uint32Array();
	G$1 = (t, e) => t[e++] & 255 | (t[e++] & 255) << 8;
	Vf = class {
		constructor(e) {
			this.blockLen = 16, this.outputLen = 16, this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.pos = 0, this.finished = !1, e = mn$1(e), nt(e, 32);
			const n = G$1(e, 0), r = G$1(e, 2), o = G$1(e, 4), s = G$1(e, 6), i = G$1(e, 8), f = G$1(e, 10), a = G$1(e, 12), l = G$1(e, 14);
			this.r[0] = n & 8191, this.r[1] = (n >>> 13 | r << 3) & 8191, this.r[2] = (r >>> 10 | o << 6) & 7939, this.r[3] = (o >>> 7 | s << 9) & 8191, this.r[4] = (s >>> 4 | i << 12) & 255, this.r[5] = i >>> 1 & 8190, this.r[6] = (i >>> 14 | f << 2) & 8191, this.r[7] = (f >>> 11 | a << 5) & 8065, this.r[8] = (a >>> 8 | l << 8) & 8191, this.r[9] = l >>> 5 & 127;
			for (let c = 0; c < 8; c++) this.pad[c] = G$1(e, 16 + 2 * c);
		}
		process(e, n, r = !1) {
			const o = r ? 0 : 2048, { h: s, r: i } = this, f = i[0], a = i[1], l = i[2], c = i[3], u = i[4], h = i[5], g = i[6], w = i[7], y = i[8], x = i[9], R = G$1(e, n + 0), M = G$1(e, n + 2), L = G$1(e, n + 4), V = G$1(e, n + 6), _ = G$1(e, n + 8), k = G$1(e, n + 10), j = G$1(e, n + 12), $ = G$1(e, n + 14);
			let d = s[0] + (R & 8191), m = s[1] + ((R >>> 13 | M << 3) & 8191), p = s[2] + ((M >>> 10 | L << 6) & 8191), b = s[3] + ((L >>> 7 | V << 9) & 8191), v = s[4] + ((V >>> 4 | _ << 12) & 8191), B = s[5] + (_ >>> 1 & 8191), E = s[6] + ((_ >>> 14 | k << 2) & 8191), I = s[7] + ((k >>> 11 | j << 5) & 8191), S = s[8] + ((j >>> 8 | $ << 8) & 8191), O = s[9] + ($ >>> 5 | o), A = 0, T = A + d * f + m * (5 * x) + p * (5 * y) + b * (5 * w) + v * (5 * g);
			A = T >>> 13, T &= 8191, T += B * (5 * h) + E * (5 * u) + I * (5 * c) + S * (5 * l) + O * (5 * a), A += T >>> 13, T &= 8191;
			let U = A + d * a + m * f + p * (5 * x) + b * (5 * y) + v * (5 * w);
			A = U >>> 13, U &= 8191, U += B * (5 * g) + E * (5 * h) + I * (5 * u) + S * (5 * c) + O * (5 * l), A += U >>> 13, U &= 8191;
			let C = A + d * l + m * a + p * f + b * (5 * x) + v * (5 * y);
			A = C >>> 13, C &= 8191, C += B * (5 * w) + E * (5 * g) + I * (5 * h) + S * (5 * u) + O * (5 * c), A += C >>> 13, C &= 8191;
			let H = A + d * c + m * l + p * a + b * f + v * (5 * x);
			A = H >>> 13, H &= 8191, H += B * (5 * y) + E * (5 * w) + I * (5 * g) + S * (5 * h) + O * (5 * u), A += H >>> 13, H &= 8191;
			let q = A + d * u + m * c + p * l + b * a + v * f;
			A = q >>> 13, q &= 8191, q += B * (5 * x) + E * (5 * y) + I * (5 * w) + S * (5 * g) + O * (5 * h), A += q >>> 13, q &= 8191;
			let P = A + d * h + m * u + p * c + b * l + v * a;
			A = P >>> 13, P &= 8191, P += B * f + E * (5 * x) + I * (5 * y) + S * (5 * w) + O * (5 * g), A += P >>> 13, P &= 8191;
			let K = A + d * g + m * h + p * u + b * c + v * l;
			A = K >>> 13, K &= 8191, K += B * a + E * f + I * (5 * x) + S * (5 * y) + O * (5 * w), A += K >>> 13, K &= 8191;
			let et = A + d * w + m * g + p * h + b * u + v * c;
			A = et >>> 13, et &= 8191, et += B * l + E * a + I * f + S * (5 * x) + O * (5 * y), A += et >>> 13, et &= 8191;
			let Z = A + d * y + m * w + p * g + b * h + v * u;
			A = Z >>> 13, Z &= 8191, Z += B * c + E * l + I * a + S * f + O * (5 * x), A += Z >>> 13, Z &= 8191;
			let z = A + d * x + m * y + p * w + b * g + v * h;
			A = z >>> 13, z &= 8191, z += B * u + E * c + I * l + S * a + O * f, A += z >>> 13, z &= 8191, A = (A << 2) + A | 0, A = A + T | 0, T = A & 8191, A = A >>> 13, U += A, s[0] = T, s[1] = U, s[2] = C, s[3] = H, s[4] = q, s[5] = P, s[6] = K, s[7] = et, s[8] = Z, s[9] = z;
		}
		finalize() {
			const { h: e, pad: n } = this, r = new Uint16Array(10);
			let o = e[1] >>> 13;
			e[1] &= 8191;
			for (let f = 2; f < 10; f++) e[f] += o, o = e[f] >>> 13, e[f] &= 8191;
			e[0] += o * 5, o = e[0] >>> 13, e[0] &= 8191, e[1] += o, o = e[1] >>> 13, e[1] &= 8191, e[2] += o, r[0] = e[0] + 5, o = r[0] >>> 13, r[0] &= 8191;
			for (let f = 1; f < 10; f++) r[f] = e[f] + o, o = r[f] >>> 13, r[f] &= 8191;
			r[9] -= 8192;
			let s = (o ^ 1) - 1;
			for (let f = 0; f < 10; f++) r[f] &= s;
			s = ~s;
			for (let f = 0; f < 10; f++) e[f] = e[f] & s | r[f];
			e[0] = (e[0] | e[1] << 13) & 65535, e[1] = (e[1] >>> 3 | e[2] << 10) & 65535, e[2] = (e[2] >>> 6 | e[3] << 7) & 65535, e[3] = (e[3] >>> 9 | e[4] << 4) & 65535, e[4] = (e[4] >>> 12 | e[5] << 1 | e[6] << 14) & 65535, e[5] = (e[6] >>> 2 | e[7] << 11) & 65535, e[6] = (e[7] >>> 5 | e[8] << 8) & 65535, e[7] = (e[8] >>> 8 | e[9] << 5) & 65535;
			let i = e[0] + n[0];
			e[0] = i & 65535;
			for (let f = 1; f < 8; f++) i = (e[f] + n[f] | 0) + (i >>> 16) | 0, e[f] = i & 65535;
			Wt$1(r);
		}
		update(e) {
			to$1(this), e = mn$1(e), nt(e);
			const { buffer: n, blockLen: r } = this, o = e.length;
			for (let s = 0; s < o;) {
				const i = Math.min(r - this.pos, o - s);
				if (i === r) {
					for (; r <= o - s; s += r) this.process(e, s);
					continue;
				}
				n.set(e.subarray(s, s + i), this.pos), this.pos += i, s += i, this.pos === r && (this.process(n, 0, !1), this.pos = 0);
			}
			return this;
		}
		destroy() {
			Wt$1(this.h, this.r, this.buffer, this.pad);
		}
		digestInto(e) {
			to$1(this), Sf(e, this), this.finished = !0;
			const { buffer: n, h: r } = this;
			let { pos: o } = this;
			if (o) {
				for (n[o++] = 1; o < 16; o++) n[o] = 0;
				this.process(n, 0, !0);
			}
			this.finalize();
			let s = 0;
			for (let i = 0; i < 8; i++) e[s++] = r[i] >>> 0, e[s++] = r[i] >>> 8;
			return e;
		}
		digest() {
			const { buffer: e, outputLen: n } = this;
			this.digestInto(e);
			const r = e.slice(0, n);
			return this.destroy(), r;
		}
	};
	Kf = qf((t) => new Vf(t));
	zf = Mf(Ff, {
		counterRight: !1,
		counterLength: 4,
		allowShortKeys: !1
	}), Gf = new Uint8Array(16), io$1 = (t, e) => {
		t.update(e);
		const n = e.length % 16;
		n && t.update(Gf.subarray(n));
	}, Zf = new Uint8Array(32);
	Wf = (t) => (e, n, r) => ({
		encrypt(s, i) {
			const f = s.length;
			i = eo$1(f + 16, i, !1), i.set(s);
			const a = i.subarray(0, -16);
			t(e, n, a, a, 1);
			const l = fo$1(t, e, n, a, r);
			return i.set(l, f), Wt$1(l), i;
		},
		decrypt(s, i) {
			i = eo$1(s.length - 16, i, !1);
			const f = s.subarray(0, -16), a = s.subarray(-16), l = fo$1(t, e, n, f, r);
			if (!Tf(a, l)) throw new Error("invalid tag");
			return i.set(s.subarray(0, -16)), t(e, n, i, i, 1), Wt$1(l), i;
		}
	}), co$1 = Rf({
		blockSize: 64,
		nonceLength: 12,
		tagLength: 16
	}, Wf(zf));
	ao$1 = class extends Ie {
		constructor(e, n) {
			super(), this.finished = !1, this.destroyed = !1, rn$1(e);
			const r = ht(n);
			if (this.iHash = e.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
			this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
			const o = this.blockLen, s = new Uint8Array(o);
			s.set(r.length > o ? e.create().update(r).digest() : r);
			for (let i = 0; i < s.length; i++) s[i] ^= 54;
			this.iHash.update(s), this.oHash = e.create();
			for (let i = 0; i < s.length; i++) s[i] ^= 106;
			this.oHash.update(s), ut(s);
		}
		update(e) {
			return Nt$1(this), this.iHash.update(e), this;
		}
		digestInto(e) {
			Nt$1(this), at(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
		}
		digest() {
			const e = new Uint8Array(this.oHash.outputLen);
			return this.digestInto(e), e;
		}
		_cloneInto(e) {
			e || (e = Object.create(Object.getPrototypeOf(this), {}));
			const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: f } = this;
			return e = e, e.finished = o, e.destroyed = s, e.blockLen = i, e.outputLen = f, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
		}
		clone() {
			return this._cloneInto();
		}
		destroy() {
			this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
		}
	};
	_e = (t, e, n) => new ao$1(t, e).update(n).digest();
	_e.create = (t, e) => new ao$1(t, e);
	vn = Uint8Array.from([0]), uo$1 = Uint8Array.of();
	Jf = (t, e, n, r, o) => Xf(t, Yf(t, e, n), r, o), Te = Ae$1, En$1 = BigInt(0), Bn$1 = BigInt(1);
	Sn = (t) => typeof t == "bigint" && En$1 <= t;
	je = (t) => (Bn$1 << BigInt(t)) - Bn$1;
	ot = BigInt(0), Q$1 = BigInt(1), Dt = BigInt(2), nc = BigInt(3), po$1 = BigInt(4), go$1 = BigInt(5), bo$1 = BigInt(8);
	ic = [
		"create",
		"isValid",
		"is0",
		"neg",
		"inv",
		"sqrt",
		"sqr",
		"eql",
		"add",
		"sub",
		"mul",
		"pow",
		"div",
		"addN",
		"subN",
		"mulN",
		"sqrN"
	];
	Xt$1 = BigInt(0), Mt$1 = BigInt(1);
	Un$1 = /* @__PURE__ */ new WeakMap(), Ao$1 = /* @__PURE__ */ new WeakMap();
	de = BigInt(0), Jt$1 = BigInt(1), Pe$1 = BigInt(2);
	xc = BigInt(1), Oo$1 = BigInt(2), vc = BigInt(3), Ec = BigInt(5), Uo$1 = {
		p: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed"),
		n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
		h: BigInt(8),
		a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
		d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
		Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
		Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
	};
	Tn$1 = (() => {
		const t = Uo$1.p;
		return wc({
			P: t,
			type: "x25519",
			powPminus2: (e) => {
				const { pow_p_5_8: n, b2: r } = Ic(e);
				return lt(pt(n, vc, t) * r, t);
			},
			adjustScalarBytes: Ac
		});
	})();
	Sc = class extends Error {
		constructor(e = "") {
			super(e);
		}
	};
	vt = {
		Err: Sc,
		_tlv: {
			encode: (t, e) => {
				const { Err: n } = vt;
				if (t < 0 || t > 256) throw new n("tlv.encode: wrong tag");
				if (e.length & 1) throw new n("tlv.encode: unpadded data");
				const r = e.length / 2, o = $e(r);
				if (o.length / 2 & 128) throw new n("tlv.encode: long form length too big");
				const s = r > 127 ? $e(o.length / 2 | 128) : "";
				return $e(t) + s + o + e;
			},
			decode(t, e) {
				const { Err: n } = vt;
				let r = 0;
				if (t < 0 || t > 256) throw new n("tlv.encode: wrong tag");
				if (e.length < 2 || e[r++] !== t) throw new n("tlv.decode: wrong tlv");
				const o = e[r++], s = !!(o & 128);
				let i = 0;
				if (!s) i = o;
				else {
					const a = o & 127;
					if (!a) throw new n("tlv.decode(long): indefinite length not supported");
					if (a > 4) throw new n("tlv.decode(long): byte length is too big");
					const l = e.subarray(r, r + a);
					if (l.length !== a) throw new n("tlv.decode: length bytes not complete");
					if (l[0] === 0) throw new n("tlv.decode(long): zero leftmost byte");
					for (const c of l) i = i << 8 | c;
					if (r += a, i < 128) throw new n("tlv.decode(long): not minimal encoding");
				}
				const f = e.subarray(r, r + i);
				if (f.length !== i) throw new n("tlv.decode: wrong value length");
				return {
					v: f,
					l: e.subarray(r + i)
				};
			}
		},
		_int: {
			encode(t) {
				const { Err: e } = vt;
				if (t < he$1) throw new e("integer: negative integers are not allowed");
				let n = $e(t);
				if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1) throw new e("unexpected DER parsing assertion: unpadded hex");
				return n;
			},
			decode(t) {
				const { Err: e } = vt;
				if (t[0] & 128) throw new e("invalid signature integer: negative");
				if (t[0] === 0 && !(t[1] & 128)) throw new e("invalid signature integer: unnecessary leading zero");
				return Ce(t);
			}
		},
		toSig(t) {
			const { Err: e, _int: n, _tlv: r } = vt, o = rt$1("signature", t), { v: s, l: i } = r.decode(48, o);
			if (i.length) throw new e("invalid signature: left bytes after parsing");
			const { v: f, l: a } = r.decode(2, s), { v: l, l: c } = r.decode(2, a);
			if (c.length) throw new e("invalid signature: left bytes after parsing");
			return {
				r: n.decode(f),
				s: n.decode(l)
			};
		},
		hexFromSig(t) {
			const { _tlv: e, _int: n } = vt, s = e.encode(2, n.encode(t.r)) + e.encode(2, n.encode(t.s));
			return e.encode(48, s);
		}
	}, he$1 = BigInt(0), pe$1 = BigInt(1), Nc = BigInt(2), He$1 = BigInt(3), Oc = BigInt(4);
	$o$1 = {
		p: BigInt("0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff"),
		n: BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551"),
		h: BigInt(1),
		a: BigInt("0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc"),
		b: BigInt("0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b"),
		Gx: BigInt("0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"),
		Gy: BigInt("0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5")
	}, Co$1 = {
		p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffff"),
		n: BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973"),
		h: BigInt(1),
		a: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000fffffffc"),
		b: BigInt("0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef"),
		Gx: BigInt("0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7"),
		Gy: BigInt("0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f")
	}, Lo$1 = {
		p: BigInt("0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
		n: BigInt("0x01fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409"),
		h: BigInt(1),
		a: BigInt("0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc"),
		b: BigInt("0x0051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00"),
		Gx: BigInt("0x00c6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66"),
		Gy: BigInt("0x011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650")
	}, jc = Yt$1($o$1.p), kc = Yt$1(Co$1.p), Pc = Yt$1(Lo$1.p), Hc = Rn$1({
		...$o$1,
		Fp: jc,
		lowS: !1
	}, Ae$1);
	Rn$1({
		...Co$1,
		Fp: kc,
		lowS: !1
	}, Yi$1), Rn$1({
		...Lo$1,
		Fp: Pc,
		lowS: !1,
		allowedPrivateKeyLengths: [
			130,
			131,
			132
		]
	}, Wi$1);
	Dc = Hc, $n$1 = "base10", tt$1 = "base16", Qt$1 = "base64pad", De$1 = "base64url", te = "utf8", Mc = 0, jo$1 = 1, be$1 = 12, Ln$1 = 32;
	ia = Object.defineProperty, fa = Object.defineProperties, ca = Object.getOwnPropertyDescriptors, Fo$1 = Object.getOwnPropertySymbols, aa = Object.prototype.hasOwnProperty, ua = Object.prototype.propertyIsEnumerable, zo$1 = (t, e, n) => e in t ? ia(t, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: n
	}) : t[e] = n, la = (t, e) => {
		for (var n in e || (e = {})) aa.call(e, n) && zo$1(t, n, e[n]);
		if (Fo$1) for (var n of Fo$1(e)) ua.call(e, n) && zo$1(t, n, e[n]);
		return t;
	}, da = (t, e) => fa(t, ca(e));
	Jo$1 = {
		INVALID_METHOD: {
			message: "Invalid method.",
			code: 1001
		},
		INVALID_EVENT: {
			message: "Invalid event.",
			code: 1002
		},
		INVALID_UPDATE_REQUEST: {
			message: "Invalid update request.",
			code: 1003
		},
		INVALID_EXTEND_REQUEST: {
			message: "Invalid extend request.",
			code: 1004
		},
		INVALID_SESSION_SETTLE_REQUEST: {
			message: "Invalid session settle request.",
			code: 1005
		},
		UNAUTHORIZED_METHOD: {
			message: "Unauthorized method.",
			code: 3001
		},
		UNAUTHORIZED_EVENT: {
			message: "Unauthorized event.",
			code: 3002
		},
		UNAUTHORIZED_UPDATE_REQUEST: {
			message: "Unauthorized update request.",
			code: 3003
		},
		UNAUTHORIZED_EXTEND_REQUEST: {
			message: "Unauthorized extend request.",
			code: 3004
		},
		USER_REJECTED: {
			message: "User rejected.",
			code: 5e3
		},
		USER_REJECTED_CHAINS: {
			message: "User rejected chains.",
			code: 5001
		},
		USER_REJECTED_METHODS: {
			message: "User rejected methods.",
			code: 5002
		},
		USER_REJECTED_EVENTS: {
			message: "User rejected events.",
			code: 5003
		},
		UNSUPPORTED_CHAINS: {
			message: "Unsupported chains.",
			code: 5100
		},
		UNSUPPORTED_METHODS: {
			message: "Unsupported methods.",
			code: 5101
		},
		UNSUPPORTED_EVENTS: {
			message: "Unsupported events.",
			code: 5102
		},
		UNSUPPORTED_ACCOUNTS: {
			message: "Unsupported accounts.",
			code: 5103
		},
		UNSUPPORTED_NAMESPACE_KEY: {
			message: "Unsupported namespace key.",
			code: 5104
		},
		USER_DISCONNECTED: {
			message: "User disconnected.",
			code: 6e3
		},
		SESSION_SETTLEMENT_FAILED: {
			message: "Session settlement failed.",
			code: 7e3
		},
		WC_METHOD_UNSUPPORTED: {
			message: "Unsupported wc_ method.",
			code: 10001
		}
	}, Qo$1 = {
		NOT_INITIALIZED: {
			message: "Not initialized.",
			code: 1
		},
		NO_MATCHING_KEY: {
			message: "No matching key.",
			code: 2
		},
		RESTORE_WILL_OVERRIDE: {
			message: "Restore will override.",
			code: 3
		},
		RESUBSCRIBED: {
			message: "Resubscribed.",
			code: 4
		},
		MISSING_OR_INVALID: {
			message: "Missing or invalid.",
			code: 5
		},
		EXPIRED: {
			message: "Expired.",
			code: 6
		},
		UNKNOWN_TYPE: {
			message: "Unknown type.",
			code: 7
		},
		MISMATCHED_TOPIC: {
			message: "Mismatched topic.",
			code: 8
		},
		NON_CONFORMING_NAMESPACES: {
			message: "Non conforming namespaces.",
			code: 9
		}
	};
	Mn$1 = {};
	Ha = class {
		static get(e) {
			return Mn$1[e];
		}
		static set(e, n) {
			Mn$1[e] = n;
		}
		static delete(e) {
			delete Mn$1[e];
		}
	};
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/constants.js
var PARSE_ERROR, INVALID_REQUEST, METHOD_NOT_FOUND, INVALID_PARAMS, INTERNAL_ERROR, SERVER_ERROR, RESERVED_ERROR_CODES, SERVER_ERROR_CODE_RANGE, STANDARD_ERROR_MAP, DEFAULT_ERROR;
var init_constants = __esmMin((() => {
	PARSE_ERROR = "PARSE_ERROR";
	INVALID_REQUEST = "INVALID_REQUEST";
	METHOD_NOT_FOUND = "METHOD_NOT_FOUND";
	INVALID_PARAMS = "INVALID_PARAMS";
	INTERNAL_ERROR = "INTERNAL_ERROR";
	SERVER_ERROR = "SERVER_ERROR";
	RESERVED_ERROR_CODES = [
		-32700,
		-32600,
		-32601,
		-32602,
		-32603
	];
	SERVER_ERROR_CODE_RANGE = [-32e3, -32099];
	STANDARD_ERROR_MAP = {
		[PARSE_ERROR]: {
			code: -32700,
			message: "Parse error"
		},
		[INVALID_REQUEST]: {
			code: -32600,
			message: "Invalid Request"
		},
		[METHOD_NOT_FOUND]: {
			code: -32601,
			message: "Method not found"
		},
		[INVALID_PARAMS]: {
			code: -32602,
			message: "Invalid params"
		},
		[INTERNAL_ERROR]: {
			code: -32603,
			message: "Internal error"
		},
		[SERVER_ERROR]: {
			code: -32e3,
			message: "Server error"
		}
	};
	DEFAULT_ERROR = SERVER_ERROR;
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/error.js
function isServerErrorCode(code) {
	return code <= SERVER_ERROR_CODE_RANGE[0] && code >= SERVER_ERROR_CODE_RANGE[1];
}
function isReservedErrorCode(code) {
	return RESERVED_ERROR_CODES.includes(code);
}
function isValidErrorCode(code) {
	return typeof code === "number";
}
function getError(type) {
	if (!Object.keys(STANDARD_ERROR_MAP).includes(type)) return STANDARD_ERROR_MAP[DEFAULT_ERROR];
	return STANDARD_ERROR_MAP[type];
}
function getErrorByCode(code) {
	const match = Object.values(STANDARD_ERROR_MAP).find((e) => e.code === code);
	if (!match) return STANDARD_ERROR_MAP[DEFAULT_ERROR];
	return match;
}
function validateJsonRpcError(response) {
	if (typeof response.error.code === "undefined") return {
		valid: false,
		error: "Missing code for JSON-RPC error"
	};
	if (typeof response.error.message === "undefined") return {
		valid: false,
		error: "Missing message for JSON-RPC error"
	};
	if (!isValidErrorCode(response.error.code)) return {
		valid: false,
		error: `Invalid error code type for JSON-RPC: ${response.error.code}`
	};
	if (isReservedErrorCode(response.error.code)) {
		const error = getErrorByCode(response.error.code);
		if (error.message !== STANDARD_ERROR_MAP["SERVER_ERROR"].message && response.error.message === error.message) return {
			valid: false,
			error: `Invalid error code message for JSON-RPC: ${response.error.code}`
		};
	}
	return { valid: true };
}
function parseConnectionError(e, url, type) {
	return e.message.includes("getaddrinfo ENOTFOUND") || e.message.includes("connect ECONNREFUSED") ? /* @__PURE__ */ new Error(`Unavailable ${type} RPC url at ${url}`) : e;
}
var init_error = __esmMin((() => {
	init_constants();
}));
//#endregion
//#region node_modules/@walletconnect/environment/dist/cjs/crypto.js
var require_crypto = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isBrowserCryptoAvailable = exports.getSubtleCrypto = exports.getBrowerCrypto = void 0;
	function getBrowerCrypto() {
		return (global === null || global === void 0 ? void 0 : global.crypto) || (global === null || global === void 0 ? void 0 : global.msCrypto) || {};
	}
	exports.getBrowerCrypto = getBrowerCrypto;
	function getSubtleCrypto() {
		const browserCrypto = getBrowerCrypto();
		return browserCrypto.subtle || browserCrypto.webkitSubtle;
	}
	exports.getSubtleCrypto = getSubtleCrypto;
	function isBrowserCryptoAvailable() {
		return !!getBrowerCrypto() && !!getSubtleCrypto();
	}
	exports.isBrowserCryptoAvailable = isBrowserCryptoAvailable;
}));
//#endregion
//#region node_modules/@walletconnect/environment/dist/cjs/env.js
var require_env = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isBrowser = exports.isNode = exports.isReactNative = void 0;
	function isReactNative() {
		return typeof document === "undefined" && typeof navigator !== "undefined" && navigator.product === "ReactNative";
	}
	exports.isReactNative = isReactNative;
	function isNode() {
		return typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined";
	}
	exports.isNode = isNode;
	function isBrowser() {
		return !isReactNative() && !isNode();
	}
	exports.isBrowser = isBrowser;
}));
//#endregion
//#region node_modules/@walletconnect/environment/dist/cjs/index.js
var require_cjs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var tslib_1 = __require("tslib");
	tslib_1.__exportStar(require_crypto(), exports);
	tslib_1.__exportStar(require_env(), exports);
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/env.js
var env_exports = /* @__PURE__ */ __exportAll({ isNodeJs: () => isNodeJs });
var import_cjs$2, isNodeJs;
var init_env = __esmMin((() => {
	import_cjs$2 = require_cjs();
	__reExport(env_exports, /* @__PURE__ */ __toESM(require_cjs()));
	isNodeJs = import_cjs$2.isNode;
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/format.js
function payloadId(entropy = 3) {
	return Date.now() * Math.pow(10, entropy) + Math.floor(Math.random() * Math.pow(10, entropy));
}
function getBigIntRpcId(entropy = 6) {
	return BigInt(payloadId(entropy));
}
function formatJsonRpcRequest(method, params, id) {
	return {
		id: id || payloadId(),
		jsonrpc: "2.0",
		method,
		params
	};
}
function formatJsonRpcResult(id, result) {
	return {
		id,
		jsonrpc: "2.0",
		result
	};
}
function formatJsonRpcError(id, error, data) {
	return {
		id,
		jsonrpc: "2.0",
		error: formatErrorMessage(error, data)
	};
}
function formatErrorMessage(error, data) {
	if (typeof error === "undefined") return getError(INTERNAL_ERROR);
	if (typeof error === "string") error = Object.assign(Object.assign({}, getError(SERVER_ERROR)), { message: error });
	if (typeof data !== "undefined") error.data = data;
	if (isReservedErrorCode(error.code)) error = getErrorByCode(error.code);
	return error;
}
var init_format = __esmMin((() => {
	init_error();
	init_constants();
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/routing.js
function isValidRoute(route) {
	if (route.includes("*")) return isValidWildcardRoute(route);
	if (/\W/g.test(route)) return false;
	return true;
}
function isValidDefaultRoute(route) {
	return route === "*";
}
function isValidWildcardRoute(route) {
	if (isValidDefaultRoute(route)) return true;
	if (!route.includes("*")) return false;
	if (route.split("*").length !== 2) return false;
	if (route.split("*").filter((x) => x.trim() === "").length !== 1) return false;
	return true;
}
function isValidLeadingWildcardRoute(route) {
	return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[0].trim();
}
function isValidTrailingWildcardRoute(route) {
	return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[1].trim();
}
var init_routing = __esmMin((() => {}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-types/dist/index.es.js
var e, o$1, n, r;
var init_index_es$3 = __esmMin((() => {
	e = class {};
	o$1 = class extends e {
		constructor(c) {
			super();
		}
	};
	n = class extends e {
		constructor() {
			super();
		}
	};
	r = class extends n {
		constructor(c) {
			super();
		}
	};
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/types.js
var init_types = __esmMin((() => {
	init_index_es$3();
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/url.js
function getUrlProtocol(url) {
	const matches = url.match(/* @__PURE__ */ new RegExp(/^\w+:/, "gi"));
	if (!matches || !matches.length) return;
	return matches[0];
}
function matchRegexProtocol(url, regex) {
	const protocol = getUrlProtocol(url);
	if (typeof protocol === "undefined") return false;
	return new RegExp(regex).test(protocol);
}
function isHttpUrl(url) {
	return matchRegexProtocol(url, HTTP_REGEX);
}
function isWsUrl(url) {
	return matchRegexProtocol(url, WS_REGEX);
}
function isLocalhostUrl(url) {
	return (/* @__PURE__ */ new RegExp("wss?://localhost(:d{2,5})?")).test(url);
}
var HTTP_REGEX, WS_REGEX;
var init_url = __esmMin((() => {
	HTTP_REGEX = "^https?:";
	WS_REGEX = "^wss?:";
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/validators.js
function isJsonRpcPayload(payload) {
	return typeof payload === "object" && "id" in payload && "jsonrpc" in payload && payload.jsonrpc === "2.0";
}
function isJsonRpcRequest(payload) {
	return isJsonRpcPayload(payload) && "method" in payload;
}
function isJsonRpcResponse(payload) {
	return isJsonRpcPayload(payload) && (isJsonRpcResult(payload) || isJsonRpcError(payload));
}
function isJsonRpcResult(payload) {
	return "result" in payload;
}
function isJsonRpcError(payload) {
	return "error" in payload;
}
function isJsonRpcValidationInvalid(validation) {
	return "error" in validation && validation.valid === false;
}
var init_validators = __esmMin((() => {}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/index.js
var esm_exports = /* @__PURE__ */ __exportAll({
	DEFAULT_ERROR: () => DEFAULT_ERROR,
	IBaseJsonRpcProvider: () => n,
	IEvents: () => e,
	IJsonRpcConnection: () => o$1,
	IJsonRpcProvider: () => r,
	INTERNAL_ERROR: () => INTERNAL_ERROR,
	INVALID_PARAMS: () => INVALID_PARAMS,
	INVALID_REQUEST: () => INVALID_REQUEST,
	METHOD_NOT_FOUND: () => METHOD_NOT_FOUND,
	PARSE_ERROR: () => PARSE_ERROR,
	RESERVED_ERROR_CODES: () => RESERVED_ERROR_CODES,
	SERVER_ERROR: () => SERVER_ERROR,
	SERVER_ERROR_CODE_RANGE: () => SERVER_ERROR_CODE_RANGE,
	STANDARD_ERROR_MAP: () => STANDARD_ERROR_MAP,
	formatErrorMessage: () => formatErrorMessage,
	formatJsonRpcError: () => formatJsonRpcError,
	formatJsonRpcRequest: () => formatJsonRpcRequest,
	formatJsonRpcResult: () => formatJsonRpcResult,
	getBigIntRpcId: () => getBigIntRpcId,
	getError: () => getError,
	getErrorByCode: () => getErrorByCode,
	isHttpUrl: () => isHttpUrl,
	isJsonRpcError: () => isJsonRpcError,
	isJsonRpcPayload: () => isJsonRpcPayload,
	isJsonRpcRequest: () => isJsonRpcRequest,
	isJsonRpcResponse: () => isJsonRpcResponse,
	isJsonRpcResult: () => isJsonRpcResult,
	isJsonRpcValidationInvalid: () => isJsonRpcValidationInvalid,
	isLocalhostUrl: () => isLocalhostUrl,
	isNodeJs: () => isNodeJs,
	isReservedErrorCode: () => isReservedErrorCode,
	isServerErrorCode: () => isServerErrorCode,
	isValidDefaultRoute: () => isValidDefaultRoute,
	isValidErrorCode: () => isValidErrorCode,
	isValidLeadingWildcardRoute: () => isValidLeadingWildcardRoute,
	isValidRoute: () => isValidRoute,
	isValidTrailingWildcardRoute: () => isValidTrailingWildcardRoute,
	isValidWildcardRoute: () => isValidWildcardRoute,
	isWsUrl: () => isWsUrl,
	parseConnectionError: () => parseConnectionError,
	payloadId: () => payloadId,
	validateJsonRpcError: () => validateJsonRpcError
});
var init_esm = __esmMin((() => {
	init_constants();
	init_error();
	init_env();
	__reExport(esm_exports, env_exports);
	init_format();
	init_routing();
	init_types();
	init_url();
	init_validators();
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-provider/dist/index.es.js
var index_es_exports = /* @__PURE__ */ __exportAll({
	JsonRpcProvider: () => o,
	default: () => o
});
var o;
var init_index_es$2 = __esmMin((() => {
	init_esm();
	o = class extends r {
		constructor(t) {
			super(t), this.events = new EventEmitter(), this.hasRegisteredEventListeners = !1, this.connection = this.setConnection(t), this.connection.connected && this.registerEventListeners();
		}
		async connect(t = this.connection) {
			await this.open(t);
		}
		async disconnect() {
			await this.close();
		}
		on(t, e) {
			this.events.on(t, e);
		}
		once(t, e) {
			this.events.once(t, e);
		}
		off(t, e) {
			this.events.off(t, e);
		}
		removeListener(t, e) {
			this.events.removeListener(t, e);
		}
		async request(t, e) {
			return this.requestStrict(formatJsonRpcRequest(t.method, t.params || [], t.id || getBigIntRpcId().toString()), e);
		}
		async requestStrict(t, e) {
			return new Promise(async (i, s) => {
				if (!this.connection.connected) try {
					await this.open();
				} catch (n) {
					s(n);
				}
				this.events.on(`${t.id}`, (n) => {
					isJsonRpcError(n) ? s(n.error) : i(n.result);
				});
				try {
					await this.connection.send(t, e);
				} catch (n) {
					s(n);
				}
			});
		}
		setConnection(t = this.connection) {
			return t;
		}
		onPayload(t) {
			this.events.emit("payload", t), isJsonRpcResponse(t) ? this.events.emit(`${t.id}`, t) : this.events.emit("message", {
				type: t.method,
				data: t.params
			});
		}
		onClose(t) {
			t && t.code === 3e3 && this.events.emit("error", /* @__PURE__ */ new Error(`WebSocket connection closed abnormally with code: ${t.code} ${t.reason ? `(${t.reason})` : ""}`)), this.events.emit("disconnect");
		}
		async open(t = this.connection) {
			this.connection === t && this.connection.connected || (this.connection.connected && this.close(), typeof t == "string" && (await this.connection.open(t), t = this.connection), this.connection = this.setConnection(t), await this.connection.open(), this.registerEventListeners(), this.events.emit("connect"));
		}
		async close() {
			await this.connection.close();
		}
		registerEventListeners() {
			this.hasRegisteredEventListeners || (this.connection.on("payload", (t) => this.onPayload(t)), this.connection.on("close", (t) => this.onClose(t)), this.connection.on("error", (t) => this.events.emit("error", t)), this.connection.on("register_error", (t) => this.onClose()), this.hasRegisteredEventListeners = !0);
		}
	};
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/lib/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		BINARY_TYPES: [
			"nodebuffer",
			"arraybuffer",
			"fragments"
		],
		GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
		kStatusCode: Symbol("status-code"),
		kWebSocket: Symbol("websocket"),
		EMPTY_BUFFER: Buffer.alloc(0),
		NOOP: () => {}
	};
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/lib/buffer-util.js
var require_buffer_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { EMPTY_BUFFER } = require_constants();
	/**
	* Merges an array of buffers into a new buffer.
	*
	* @param {Buffer[]} list The array of buffers to concat
	* @param {Number} totalLength The total length of buffers in the list
	* @return {Buffer} The resulting buffer
	* @public
	*/
	function concat(list, totalLength) {
		if (list.length === 0) return EMPTY_BUFFER;
		if (list.length === 1) return list[0];
		const target = Buffer.allocUnsafe(totalLength);
		let offset = 0;
		for (let i = 0; i < list.length; i++) {
			const buf = list[i];
			target.set(buf, offset);
			offset += buf.length;
		}
		if (offset < totalLength) return target.slice(0, offset);
		return target;
	}
	/**
	* Masks a buffer using the given mask.
	*
	* @param {Buffer} source The buffer to mask
	* @param {Buffer} mask The mask to use
	* @param {Buffer} output The buffer where to store the result
	* @param {Number} offset The offset at which to start writing
	* @param {Number} length The number of bytes to mask.
	* @public
	*/
	function _mask(source, mask, output, offset, length) {
		for (let i = 0; i < length; i++) output[offset + i] = source[i] ^ mask[i & 3];
	}
	/**
	* Unmasks a buffer using the given mask.
	*
	* @param {Buffer} buffer The buffer to unmask
	* @param {Buffer} mask The mask to use
	* @public
	*/
	function _unmask(buffer, mask) {
		const length = buffer.length;
		for (let i = 0; i < length; i++) buffer[i] ^= mask[i & 3];
	}
	/**
	* Converts a buffer to an `ArrayBuffer`.
	*
	* @param {Buffer} buf The buffer to convert
	* @return {ArrayBuffer} Converted buffer
	* @public
	*/
	function toArrayBuffer(buf) {
		if (buf.byteLength === buf.buffer.byteLength) return buf.buffer;
		return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
	}
	/**
	* Converts `data` to a `Buffer`.
	*
	* @param {*} data The data to convert
	* @return {Buffer} The buffer
	* @throws {TypeError}
	* @public
	*/
	function toBuffer(data) {
		toBuffer.readOnly = true;
		if (Buffer.isBuffer(data)) return data;
		let buf;
		if (data instanceof ArrayBuffer) buf = Buffer.from(data);
		else if (ArrayBuffer.isView(data)) buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
		else {
			buf = Buffer.from(data);
			toBuffer.readOnly = false;
		}
		return buf;
	}
	try {
		const bufferUtil = __require("bufferutil");
		const bu = bufferUtil.BufferUtil || bufferUtil;
		module.exports = {
			concat,
			mask(source, mask, output, offset, length) {
				if (length < 48) _mask(source, mask, output, offset, length);
				else bu.mask(source, mask, output, offset, length);
			},
			toArrayBuffer,
			toBuffer,
			unmask(buffer, mask) {
				if (buffer.length < 32) _unmask(buffer, mask);
				else bu.unmask(buffer, mask);
			}
		};
	} catch (e) 	/* istanbul ignore next */ {
		module.exports = {
			concat,
			mask: _mask,
			toArrayBuffer,
			toBuffer,
			unmask: _unmask
		};
	}
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/lib/limiter.js
var require_limiter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var kDone = Symbol("kDone");
	var kRun = Symbol("kRun");
	/**
	* A very simple job queue with adjustable concurrency. Adapted from
	* https://github.com/STRML/async-limiter
	*/
	var Limiter = class {
		/**
		* Creates a new `Limiter`.
		*
		* @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
		*     to run concurrently
		*/
		constructor(concurrency) {
			this[kDone] = () => {
				this.pending--;
				this[kRun]();
			};
			this.concurrency = concurrency || Infinity;
			this.jobs = [];
			this.pending = 0;
		}
		/**
		* Adds a job to the queue.
		*
		* @param {Function} job The job to run
		* @public
		*/
		add(job) {
			this.jobs.push(job);
			this[kRun]();
		}
		/**
		* Removes a job from the queue and runs it if possible.
		*
		* @private
		*/
		[kRun]() {
			if (this.pending === this.concurrency) return;
			if (this.jobs.length) {
				const job = this.jobs.shift();
				this.pending++;
				job(this[kDone]);
			}
		}
	};
	module.exports = Limiter;
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var zlib = __require("zlib");
	var bufferUtil = require_buffer_util();
	var Limiter = require_limiter();
	var { kStatusCode, NOOP } = require_constants();
	var TRAILER = Buffer.from([
		0,
		0,
		255,
		255
	]);
	var kPerMessageDeflate = Symbol("permessage-deflate");
	var kTotalLength = Symbol("total-length");
	var kCallback = Symbol("callback");
	var kBuffers = Symbol("buffers");
	var kError = Symbol("error");
	var zlibLimiter;
	/**
	* permessage-deflate implementation.
	*/
	var PerMessageDeflate = class {
		/**
		* Creates a PerMessageDeflate instance.
		*
		* @param {Object} [options] Configuration options
		* @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
		*     disabling of server context takeover
		* @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
		*     acknowledge disabling of client context takeover
		* @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
		*     use of a custom server window size
		* @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
		*     for, or request, a custom client window size
		* @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
		*     deflate
		* @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
		*     inflate
		* @param {Number} [options.threshold=1024] Size (in bytes) below which
		*     messages should not be compressed
		* @param {Number} [options.concurrencyLimit=10] The number of concurrent
		*     calls to zlib
		* @param {Boolean} [isServer=false] Create the instance in either server or
		*     client mode
		* @param {Number} [maxPayload=0] The maximum allowed message length
		*/
		constructor(options, isServer, maxPayload) {
			this._maxPayload = maxPayload | 0;
			this._options = options || {};
			this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
			this._isServer = !!isServer;
			this._deflate = null;
			this._inflate = null;
			this.params = null;
			if (!zlibLimiter) zlibLimiter = new Limiter(this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10);
		}
		/**
		* @type {String}
		*/
		static get extensionName() {
			return "permessage-deflate";
		}
		/**
		* Create an extension negotiation offer.
		*
		* @return {Object} Extension parameters
		* @public
		*/
		offer() {
			const params = {};
			if (this._options.serverNoContextTakeover) params.server_no_context_takeover = true;
			if (this._options.clientNoContextTakeover) params.client_no_context_takeover = true;
			if (this._options.serverMaxWindowBits) params.server_max_window_bits = this._options.serverMaxWindowBits;
			if (this._options.clientMaxWindowBits) params.client_max_window_bits = this._options.clientMaxWindowBits;
			else if (this._options.clientMaxWindowBits == null) params.client_max_window_bits = true;
			return params;
		}
		/**
		* Accept an extension negotiation offer/response.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Object} Accepted configuration
		* @public
		*/
		accept(configurations) {
			configurations = this.normalizeParams(configurations);
			this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
			return this.params;
		}
		/**
		* Releases all resources used by the extension.
		*
		* @public
		*/
		cleanup() {
			if (this._inflate) {
				this._inflate.close();
				this._inflate = null;
			}
			if (this._deflate) {
				const callback = this._deflate[kCallback];
				this._deflate.close();
				this._deflate = null;
				if (callback) callback(/* @__PURE__ */ new Error("The deflate stream was closed while data was being processed"));
			}
		}
		/**
		*  Accept an extension negotiation offer.
		*
		* @param {Array} offers The extension negotiation offers
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsServer(offers) {
			const opts = this._options;
			const accepted = offers.find((params) => {
				if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) return false;
				return true;
			});
			if (!accepted) throw new Error("None of the extension offers can be accepted");
			if (opts.serverNoContextTakeover) accepted.server_no_context_takeover = true;
			if (opts.clientNoContextTakeover) accepted.client_no_context_takeover = true;
			if (typeof opts.serverMaxWindowBits === "number") accepted.server_max_window_bits = opts.serverMaxWindowBits;
			if (typeof opts.clientMaxWindowBits === "number") accepted.client_max_window_bits = opts.clientMaxWindowBits;
			else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) delete accepted.client_max_window_bits;
			return accepted;
		}
		/**
		* Accept the extension negotiation response.
		*
		* @param {Array} response The extension negotiation response
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsClient(response) {
			const params = response[0];
			if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) throw new Error("Unexpected parameter \"client_no_context_takeover\"");
			if (!params.client_max_window_bits) {
				if (typeof this._options.clientMaxWindowBits === "number") params.client_max_window_bits = this._options.clientMaxWindowBits;
			} else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) throw new Error("Unexpected or invalid parameter \"client_max_window_bits\"");
			return params;
		}
		/**
		* Normalize parameters.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Array} The offers/response with normalized parameters
		* @private
		*/
		normalizeParams(configurations) {
			configurations.forEach((params) => {
				Object.keys(params).forEach((key) => {
					let value = params[key];
					if (value.length > 1) throw new Error(`Parameter "${key}" must have only a single value`);
					value = value[0];
					if (key === "client_max_window_bits") {
						if (value !== true) {
							const num = +value;
							if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
							value = num;
						} else if (!this._isServer) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else if (key === "server_max_window_bits") {
						const num = +value;
						if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
						value = num;
					} else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
						if (value !== true) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else throw new Error(`Unknown parameter "${key}"`);
					params[key] = value;
				});
			});
			return configurations;
		}
		/**
		* Decompress data. Concurrency limited.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		decompress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._decompress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Compress data. Concurrency limited.
		*
		* @param {Buffer} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		compress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._compress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Decompress data.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_decompress(data, fin, callback) {
			const endpoint = this._isServer ? "client" : "server";
			if (!this._inflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._inflate = zlib.createInflateRaw({
					...this._options.zlibInflateOptions,
					windowBits
				});
				this._inflate[kPerMessageDeflate] = this;
				this._inflate[kTotalLength] = 0;
				this._inflate[kBuffers] = [];
				this._inflate.on("error", inflateOnError);
				this._inflate.on("data", inflateOnData);
			}
			this._inflate[kCallback] = callback;
			this._inflate.write(data);
			if (fin) this._inflate.write(TRAILER);
			this._inflate.flush(() => {
				const err = this._inflate[kError];
				if (err) {
					this._inflate.close();
					this._inflate = null;
					callback(err);
					return;
				}
				const data = bufferUtil.concat(this._inflate[kBuffers], this._inflate[kTotalLength]);
				if (this._inflate._readableState.endEmitted) {
					this._inflate.close();
					this._inflate = null;
				} else {
					this._inflate[kTotalLength] = 0;
					this._inflate[kBuffers] = [];
					if (fin && this.params[`${endpoint}_no_context_takeover`]) this._inflate.reset();
				}
				callback(null, data);
			});
		}
		/**
		* Compress data.
		*
		* @param {Buffer} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_compress(data, fin, callback) {
			const endpoint = this._isServer ? "server" : "client";
			if (!this._deflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._deflate = zlib.createDeflateRaw({
					...this._options.zlibDeflateOptions,
					windowBits
				});
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				this._deflate.on("error", NOOP);
				this._deflate.on("data", deflateOnData);
			}
			this._deflate[kCallback] = callback;
			this._deflate.write(data);
			this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
				if (!this._deflate) return;
				let data = bufferUtil.concat(this._deflate[kBuffers], this._deflate[kTotalLength]);
				if (fin) data = data.slice(0, data.length - 4);
				this._deflate[kCallback] = null;
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				if (fin && this.params[`${endpoint}_no_context_takeover`]) this._deflate.reset();
				callback(null, data);
			});
		}
	};
	module.exports = PerMessageDeflate;
	/**
	* The listener of the `zlib.DeflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function deflateOnData(chunk) {
		this[kBuffers].push(chunk);
		this[kTotalLength] += chunk.length;
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function inflateOnData(chunk) {
		this[kTotalLength] += chunk.length;
		if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
			this[kBuffers].push(chunk);
			return;
		}
		this[kError] = /* @__PURE__ */ new RangeError("Max payload size exceeded");
		this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
		this[kError][kStatusCode] = 1009;
		this.removeListener("data", inflateOnData);
		this.reset();
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'error'` event.
	*
	* @param {Error} err The emitted error
	* @private
	*/
	function inflateOnError(err) {
		this[kPerMessageDeflate]._inflate = null;
		err[kStatusCode] = 1007;
		this[kCallback](err);
	}
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/lib/validation.js
var require_validation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if a status code is allowed in a close frame.
	*
	* @param {Number} code The status code
	* @return {Boolean} `true` if the status code is valid, else `false`
	* @public
	*/
	function isValidStatusCode(code) {
		return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
	}
	/**
	* Checks if a given buffer contains only correct UTF-8.
	* Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	* Markus Kuhn.
	*
	* @param {Buffer} buf The buffer to check
	* @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	* @public
	*/
	function _isValidUTF8(buf) {
		const len = buf.length;
		let i = 0;
		while (i < len) if ((buf[i] & 128) === 0) i++;
		else if ((buf[i] & 224) === 192) {
			if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) return false;
			i += 2;
		} else if ((buf[i] & 240) === 224) {
			if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || buf[i] === 237 && (buf[i + 1] & 224) === 160) return false;
			i += 3;
		} else if ((buf[i] & 248) === 240) {
			if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) return false;
			i += 4;
		} else return false;
		return true;
	}
	try {
		let isValidUTF8 = __require("utf-8-validate");
		/* istanbul ignore if */
		if (typeof isValidUTF8 === "object") isValidUTF8 = isValidUTF8.Validation.isValidUTF8;
		module.exports = {
			isValidStatusCode,
			isValidUTF8(buf) {
				return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
			}
		};
	} catch (e) 	/* istanbul ignore next */ {
		module.exports = {
			isValidStatusCode,
			isValidUTF8: _isValidUTF8
		};
	}
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/lib/receiver.js
var require_receiver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Writable } = __require("stream");
	var PerMessageDeflate = require_permessage_deflate();
	var { BINARY_TYPES, EMPTY_BUFFER, kStatusCode, kWebSocket } = require_constants();
	var { concat, toArrayBuffer, unmask } = require_buffer_util();
	var { isValidStatusCode, isValidUTF8 } = require_validation();
	var GET_INFO = 0;
	var GET_PAYLOAD_LENGTH_16 = 1;
	var GET_PAYLOAD_LENGTH_64 = 2;
	var GET_MASK = 3;
	var GET_DATA = 4;
	var INFLATING = 5;
	/**
	* HyBi Receiver implementation.
	*
	* @extends Writable
	*/
	var Receiver = class extends Writable {
		/**
		* Creates a Receiver instance.
		*
		* @param {String} [binaryType=nodebuffer] The type for binary data
		* @param {Object} [extensions] An object containing the negotiated extensions
		* @param {Boolean} [isServer=false] Specifies whether to operate in client or
		*     server mode
		* @param {Number} [maxPayload=0] The maximum allowed message length
		* @param {Number} [maxBufferedChunks=0] The maximum number of
		*     buffered data chunks
		* @param {Number} [maxFragments=0] The maximum number of message
		*     fragments
		*/
		constructor(binaryType, extensions, isServer, maxPayload, maxBufferedChunks, maxFragments) {
			super();
			this._binaryType = binaryType || BINARY_TYPES[0];
			this[kWebSocket] = void 0;
			this._extensions = extensions || {};
			this._isServer = !!isServer;
			this._maxBufferedChunks = maxBufferedChunks | 0;
			this._maxFragments = maxFragments | 0;
			this._maxPayload = maxPayload | 0;
			this._bufferedBytes = 0;
			this._buffers = [];
			this._compressed = false;
			this._payloadLength = 0;
			this._mask = void 0;
			this._fragmented = 0;
			this._masked = false;
			this._fin = false;
			this._opcode = 0;
			this._totalPayloadLength = 0;
			this._messageLength = 0;
			this._fragments = [];
			this._state = GET_INFO;
			this._loop = false;
		}
		/**
		* Implements `Writable.prototype._write()`.
		*
		* @param {Buffer} chunk The chunk of data to write
		* @param {String} encoding The character encoding of `chunk`
		* @param {Function} cb Callback
		* @private
		*/
		_write(chunk, encoding, cb) {
			if (this._opcode === 8 && this._state == GET_INFO) return cb();
			if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) return cb(error(RangeError, "Too many buffered chunks", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS"));
			this._bufferedBytes += chunk.length;
			this._buffers.push(chunk);
			this.startLoop(cb);
		}
		/**
		* Consumes `n` bytes from the buffered data.
		*
		* @param {Number} n The number of bytes to consume
		* @return {Buffer} The consumed bytes
		* @private
		*/
		consume(n) {
			this._bufferedBytes -= n;
			if (n === this._buffers[0].length) return this._buffers.shift();
			if (n < this._buffers[0].length) {
				const buf = this._buffers[0];
				this._buffers[0] = buf.slice(n);
				return buf.slice(0, n);
			}
			const dst = Buffer.allocUnsafe(n);
			do {
				const buf = this._buffers[0];
				const offset = dst.length - n;
				if (n >= buf.length) dst.set(this._buffers.shift(), offset);
				else {
					dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
					this._buffers[0] = buf.slice(n);
				}
				n -= buf.length;
			} while (n > 0);
			return dst;
		}
		/**
		* Starts the parsing loop.
		*
		* @param {Function} cb Callback
		* @private
		*/
		startLoop(cb) {
			let err;
			this._loop = true;
			do
				switch (this._state) {
					case GET_INFO:
						err = this.getInfo();
						break;
					case GET_PAYLOAD_LENGTH_16:
						err = this.getPayloadLength16();
						break;
					case GET_PAYLOAD_LENGTH_64:
						err = this.getPayloadLength64();
						break;
					case GET_MASK:
						this.getMask();
						break;
					case GET_DATA:
						err = this.getData(cb);
						break;
					default:
						this._loop = false;
						return;
				}
			while (this._loop);
			cb(err);
		}
		/**
		* Reads the first two bytes of a frame.
		*
		* @return {(RangeError|undefined)} A possible error
		* @private
		*/
		getInfo() {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			const buf = this.consume(2);
			if ((buf[0] & 48) !== 0) {
				this._loop = false;
				return error(RangeError, "RSV2 and RSV3 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
			}
			const compressed = (buf[0] & 64) === 64;
			if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
				this._loop = false;
				return error(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
			}
			this._fin = (buf[0] & 128) === 128;
			this._opcode = buf[0] & 15;
			this._payloadLength = buf[1] & 127;
			if (this._opcode === 0) {
				if (compressed) {
					this._loop = false;
					return error(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
				}
				if (!this._fragmented) {
					this._loop = false;
					return error(RangeError, "invalid opcode 0", true, 1002, "WS_ERR_INVALID_OPCODE");
				}
				this._opcode = this._fragmented;
			} else if (this._opcode === 1 || this._opcode === 2) {
				if (this._fragmented) {
					this._loop = false;
					return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
				}
				this._compressed = compressed;
			} else if (this._opcode > 7 && this._opcode < 11) {
				if (!this._fin) {
					this._loop = false;
					return error(RangeError, "FIN must be set", true, 1002, "WS_ERR_EXPECTED_FIN");
				}
				if (compressed) {
					this._loop = false;
					return error(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
				}
				if (this._payloadLength > 125) {
					this._loop = false;
					return error(RangeError, `invalid payload length ${this._payloadLength}`, true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
				}
			} else {
				this._loop = false;
				return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
			}
			if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
			this._masked = (buf[1] & 128) === 128;
			if (this._isServer) {
				if (!this._masked) {
					this._loop = false;
					return error(RangeError, "MASK must be set", true, 1002, "WS_ERR_EXPECTED_MASK");
				}
			} else if (this._masked) {
				this._loop = false;
				return error(RangeError, "MASK must be clear", true, 1002, "WS_ERR_UNEXPECTED_MASK");
			}
			if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
			else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
			else return this.haveLength();
		}
		/**
		* Gets extended payload length (7+16).
		*
		* @return {(RangeError|undefined)} A possible error
		* @private
		*/
		getPayloadLength16() {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			this._payloadLength = this.consume(2).readUInt16BE(0);
			return this.haveLength();
		}
		/**
		* Gets extended payload length (7+64).
		*
		* @return {(RangeError|undefined)} A possible error
		* @private
		*/
		getPayloadLength64() {
			if (this._bufferedBytes < 8) {
				this._loop = false;
				return;
			}
			const buf = this.consume(8);
			const num = buf.readUInt32BE(0);
			if (num > Math.pow(2, 21) - 1) {
				this._loop = false;
				return error(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", false, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");
			}
			this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
			return this.haveLength();
		}
		/**
		* Payload length has been read.
		*
		* @return {(RangeError|undefined)} A possible error
		* @private
		*/
		haveLength() {
			if (this._payloadLength && this._opcode < 8) {
				this._totalPayloadLength += this._payloadLength;
				if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
					this._loop = false;
					return error(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
				}
			}
			if (this._masked) this._state = GET_MASK;
			else this._state = GET_DATA;
		}
		/**
		* Reads mask bytes.
		*
		* @private
		*/
		getMask() {
			if (this._bufferedBytes < 4) {
				this._loop = false;
				return;
			}
			this._mask = this.consume(4);
			this._state = GET_DATA;
		}
		/**
		* Reads data bytes.
		*
		* @param {Function} cb Callback
		* @return {(Error|RangeError|undefined)} A possible error
		* @private
		*/
		getData(cb) {
			let data = EMPTY_BUFFER;
			if (this._payloadLength) {
				if (this._bufferedBytes < this._payloadLength) {
					this._loop = false;
					return;
				}
				data = this.consume(this._payloadLength);
				if (this._masked) unmask(data, this._mask);
			}
			if (this._opcode > 7) return this.controlMessage(data);
			if (this._compressed) {
				this._state = INFLATING;
				this.decompress(data, cb);
				return;
			}
			if (data.length) {
				if (this._maxFragments > 0 && this._fragments.length >= this._maxFragments) {
					this._loop = false;
					return error(RangeError, "Too many message fragments", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS");
				}
				this._messageLength = this._totalPayloadLength;
				this._fragments.push(data);
			}
			return this.dataMessage();
		}
		/**
		* Decompresses data.
		*
		* @param {Buffer} data Compressed data
		* @param {Function} cb Callback
		* @private
		*/
		decompress(data, cb) {
			this._extensions[PerMessageDeflate.extensionName].decompress(data, this._fin, (err, buf) => {
				if (err) return cb(err);
				if (buf.length) {
					this._messageLength += buf.length;
					if (this._messageLength > this._maxPayload && this._maxPayload > 0) return cb(error(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
					if (this._maxFragments > 0 && this._fragments.length >= this._maxFragments) return cb(error(RangeError, "Too many message fragments", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS"));
					this._fragments.push(buf);
				}
				const er = this.dataMessage();
				if (er) return cb(er);
				this.startLoop(cb);
			});
		}
		/**
		* Handles a data message.
		*
		* @return {(Error|undefined)} A possible error
		* @private
		*/
		dataMessage() {
			if (this._fin) {
				const messageLength = this._messageLength;
				const fragments = this._fragments;
				this._totalPayloadLength = 0;
				this._messageLength = 0;
				this._fragmented = 0;
				this._fragments = [];
				if (this._opcode === 2) {
					let data;
					if (this._binaryType === "nodebuffer") data = concat(fragments, messageLength);
					else if (this._binaryType === "arraybuffer") data = toArrayBuffer(concat(fragments, messageLength));
					else data = fragments;
					this.emit("message", data);
				} else {
					const buf = concat(fragments, messageLength);
					if (!isValidUTF8(buf)) {
						this._loop = false;
						return error(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
					}
					this.emit("message", buf.toString());
				}
			}
			this._state = GET_INFO;
		}
		/**
		* Handles a control message.
		*
		* @param {Buffer} data Data to handle
		* @return {(Error|RangeError|undefined)} A possible error
		* @private
		*/
		controlMessage(data) {
			if (this._opcode === 8) {
				this._loop = false;
				if (data.length === 0) {
					this.emit("conclude", 1005, "");
					this.end();
				} else if (data.length === 1) return error(RangeError, "invalid payload length 1", true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
				else {
					const code = data.readUInt16BE(0);
					if (!isValidStatusCode(code)) return error(RangeError, `invalid status code ${code}`, true, 1002, "WS_ERR_INVALID_CLOSE_CODE");
					const buf = data.slice(2);
					if (!isValidUTF8(buf)) return error(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
					this.emit("conclude", code, buf.toString());
					this.end();
				}
			} else if (this._opcode === 9) this.emit("ping", data);
			else this.emit("pong", data);
			this._state = GET_INFO;
		}
	};
	module.exports = Receiver;
	/**
	* Builds an error object.
	*
	* @param {function(new:Error|RangeError)} ErrorCtor The error constructor
	* @param {String} message The error message
	* @param {Boolean} prefix Specifies whether or not to add a default prefix to
	*     `message`
	* @param {Number} statusCode The status code
	* @param {String} errorCode The exposed error code
	* @return {(Error|RangeError)} The error
	* @private
	*/
	function error(ErrorCtor, message, prefix, statusCode, errorCode) {
		const err = new ErrorCtor(prefix ? `Invalid WebSocket frame: ${message}` : message);
		Error.captureStackTrace(err, error);
		err.code = errorCode;
		err[kStatusCode] = statusCode;
		return err;
	}
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/lib/sender.js
var require_sender = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	__require("net");
	__require("tls");
	var { randomFillSync } = __require("crypto");
	var PerMessageDeflate = require_permessage_deflate();
	var { EMPTY_BUFFER } = require_constants();
	var { isValidStatusCode } = require_validation();
	var { mask: applyMask, toBuffer } = require_buffer_util();
	var mask = Buffer.alloc(4);
	module.exports = class Sender {
		/**
		* Creates a Sender instance.
		*
		* @param {(net.Socket|tls.Socket)} socket The connection socket
		* @param {Object} [extensions] An object containing the negotiated extensions
		*/
		constructor(socket, extensions) {
			this._extensions = extensions || {};
			this._socket = socket;
			this._firstFragment = true;
			this._compress = false;
			this._bufferedBytes = 0;
			this._deflating = false;
			this._queue = [];
		}
		/**
		* Frames a piece of data according to the HyBi WebSocket protocol.
		*
		* @param {Buffer} data The data to frame
		* @param {Object} options Options object
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @return {Buffer[]} The framed data as a list of `Buffer` instances
		* @public
		*/
		static frame(data, options) {
			const merge = options.mask && options.readOnly;
			let offset = options.mask ? 6 : 2;
			let payloadLength = data.length;
			if (data.length >= 65536) {
				offset += 8;
				payloadLength = 127;
			} else if (data.length > 125) {
				offset += 2;
				payloadLength = 126;
			}
			const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);
			target[0] = options.fin ? options.opcode | 128 : options.opcode;
			if (options.rsv1) target[0] |= 64;
			target[1] = payloadLength;
			if (payloadLength === 126) target.writeUInt16BE(data.length, 2);
			else if (payloadLength === 127) {
				target.writeUInt32BE(0, 2);
				target.writeUInt32BE(data.length, 6);
			}
			if (!options.mask) return [target, data];
			randomFillSync(mask, 0, 4);
			target[1] |= 128;
			target[offset - 4] = mask[0];
			target[offset - 3] = mask[1];
			target[offset - 2] = mask[2];
			target[offset - 1] = mask[3];
			if (merge) {
				applyMask(data, mask, target, offset, data.length);
				return [target];
			}
			applyMask(data, mask, data, 0, data.length);
			return [target, data];
		}
		/**
		* Sends a close message to the other peer.
		*
		* @param {Number} [code] The status code component of the body
		* @param {String} [data] The message component of the body
		* @param {Boolean} [mask=false] Specifies whether or not to mask the message
		* @param {Function} [cb] Callback
		* @public
		*/
		close(code, data, mask, cb) {
			let buf;
			if (code === void 0) buf = EMPTY_BUFFER;
			else if (typeof code !== "number" || !isValidStatusCode(code)) throw new TypeError("First argument must be a valid error code number");
			else if (data === void 0 || data === "") {
				buf = Buffer.allocUnsafe(2);
				buf.writeUInt16BE(code, 0);
			} else {
				const length = Buffer.byteLength(data);
				if (length > 123) throw new RangeError("The message must not be greater than 123 bytes");
				buf = Buffer.allocUnsafe(2 + length);
				buf.writeUInt16BE(code, 0);
				buf.write(data, 2);
			}
			if (this._deflating) this.enqueue([
				this.doClose,
				buf,
				mask,
				cb
			]);
			else this.doClose(buf, mask, cb);
		}
		/**
		* Frames and sends a close message.
		*
		* @param {Buffer} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @private
		*/
		doClose(data, mask, cb) {
			this.sendFrame(Sender.frame(data, {
				fin: true,
				rsv1: false,
				opcode: 8,
				mask,
				readOnly: false
			}), cb);
		}
		/**
		* Sends a ping message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		ping(data, mask, cb) {
			const buf = toBuffer(data);
			if (buf.length > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			if (this._deflating) this.enqueue([
				this.doPing,
				buf,
				mask,
				toBuffer.readOnly,
				cb
			]);
			else this.doPing(buf, mask, toBuffer.readOnly, cb);
		}
		/**
		* Frames and sends a ping message.
		*
		* @param {Buffer} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
		* @param {Function} [cb] Callback
		* @private
		*/
		doPing(data, mask, readOnly, cb) {
			this.sendFrame(Sender.frame(data, {
				fin: true,
				rsv1: false,
				opcode: 9,
				mask,
				readOnly
			}), cb);
		}
		/**
		* Sends a pong message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		pong(data, mask, cb) {
			const buf = toBuffer(data);
			if (buf.length > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			if (this._deflating) this.enqueue([
				this.doPong,
				buf,
				mask,
				toBuffer.readOnly,
				cb
			]);
			else this.doPong(buf, mask, toBuffer.readOnly, cb);
		}
		/**
		* Frames and sends a pong message.
		*
		* @param {Buffer} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
		* @param {Function} [cb] Callback
		* @private
		*/
		doPong(data, mask, readOnly, cb) {
			this.sendFrame(Sender.frame(data, {
				fin: true,
				rsv1: false,
				opcode: 10,
				mask,
				readOnly
			}), cb);
		}
		/**
		* Sends a data message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Object} options Options object
		* @param {Boolean} [options.compress=false] Specifies whether or not to
		*     compress `data`
		* @param {Boolean} [options.binary=false] Specifies whether `data` is binary
		*     or text
		* @param {Boolean} [options.fin=false] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		send(data, options, cb) {
			const buf = toBuffer(data);
			const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
			let opcode = options.binary ? 2 : 1;
			let rsv1 = options.compress;
			if (this._firstFragment) {
				this._firstFragment = false;
				if (rsv1 && perMessageDeflate) rsv1 = buf.length >= perMessageDeflate._threshold;
				this._compress = rsv1;
			} else {
				rsv1 = false;
				opcode = 0;
			}
			if (options.fin) this._firstFragment = true;
			if (perMessageDeflate) {
				const opts = {
					fin: options.fin,
					rsv1,
					opcode,
					mask: options.mask,
					readOnly: toBuffer.readOnly
				};
				if (this._deflating) this.enqueue([
					this.dispatch,
					buf,
					this._compress,
					opts,
					cb
				]);
				else this.dispatch(buf, this._compress, opts, cb);
			} else this.sendFrame(Sender.frame(buf, {
				fin: options.fin,
				rsv1: false,
				opcode,
				mask: options.mask,
				readOnly: toBuffer.readOnly
			}), cb);
		}
		/**
		* Dispatches a data message.
		*
		* @param {Buffer} data The message to send
		* @param {Boolean} [compress=false] Specifies whether or not to compress
		*     `data`
		* @param {Object} options Options object
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @param {Function} [cb] Callback
		* @private
		*/
		dispatch(data, compress, options, cb) {
			if (!compress) {
				this.sendFrame(Sender.frame(data, options), cb);
				return;
			}
			const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
			this._bufferedBytes += data.length;
			this._deflating = true;
			perMessageDeflate.compress(data, options.fin, (_, buf) => {
				if (this._socket.destroyed) {
					const err = /* @__PURE__ */ new Error("The socket was closed while data was being compressed");
					if (typeof cb === "function") cb(err);
					for (let i = 0; i < this._queue.length; i++) {
						const callback = this._queue[i][4];
						if (typeof callback === "function") callback(err);
					}
					return;
				}
				this._bufferedBytes -= data.length;
				this._deflating = false;
				options.readOnly = false;
				this.sendFrame(Sender.frame(buf, options), cb);
				this.dequeue();
			});
		}
		/**
		* Executes queued send operations.
		*
		* @private
		*/
		dequeue() {
			while (!this._deflating && this._queue.length) {
				const params = this._queue.shift();
				this._bufferedBytes -= params[1].length;
				Reflect.apply(params[0], this, params.slice(1));
			}
		}
		/**
		* Enqueues a send operation.
		*
		* @param {Array} params Send operation parameters.
		* @private
		*/
		enqueue(params) {
			this._bufferedBytes += params[1].length;
			this._queue.push(params);
		}
		/**
		* Sends a frame.
		*
		* @param {Buffer[]} list The frame to send
		* @param {Function} [cb] Callback
		* @private
		*/
		sendFrame(list, cb) {
			if (list.length === 2) {
				this._socket.cork();
				this._socket.write(list[0]);
				this._socket.write(list[1], cb);
				this._socket.uncork();
			} else this._socket.write(list[0], cb);
		}
	};
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/lib/event-target.js
var require_event_target = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Class representing an event.
	*
	* @private
	*/
	var Event = class {
		/**
		* Create a new `Event`.
		*
		* @param {String} type The name of the event
		* @param {Object} target A reference to the target to which the event was
		*     dispatched
		*/
		constructor(type, target) {
			this.target = target;
			this.type = type;
		}
	};
	/**
	* Class representing a message event.
	*
	* @extends Event
	* @private
	*/
	var MessageEvent = class extends Event {
		/**
		* Create a new `MessageEvent`.
		*
		* @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
		* @param {WebSocket} target A reference to the target to which the event was
		*     dispatched
		*/
		constructor(data, target) {
			super("message", target);
			this.data = data;
		}
	};
	/**
	* Class representing a close event.
	*
	* @extends Event
	* @private
	*/
	var CloseEvent = class extends Event {
		/**
		* Create a new `CloseEvent`.
		*
		* @param {Number} code The status code explaining why the connection is being
		*     closed
		* @param {String} reason A human-readable string explaining why the
		*     connection is closing
		* @param {WebSocket} target A reference to the target to which the event was
		*     dispatched
		*/
		constructor(code, reason, target) {
			super("close", target);
			this.wasClean = target._closeFrameReceived && target._closeFrameSent;
			this.reason = reason;
			this.code = code;
		}
	};
	/**
	* Class representing an open event.
	*
	* @extends Event
	* @private
	*/
	var OpenEvent = class extends Event {
		/**
		* Create a new `OpenEvent`.
		*
		* @param {WebSocket} target A reference to the target to which the event was
		*     dispatched
		*/
		constructor(target) {
			super("open", target);
		}
	};
	/**
	* Class representing an error event.
	*
	* @extends Event
	* @private
	*/
	var ErrorEvent = class extends Event {
		/**
		* Create a new `ErrorEvent`.
		*
		* @param {Object} error The error that generated this event
		* @param {WebSocket} target A reference to the target to which the event was
		*     dispatched
		*/
		constructor(error, target) {
			super("error", target);
			this.message = error.message;
			this.error = error;
		}
	};
	module.exports = {
		/**
		* Register an event listener.
		*
		* @param {String} type A string representing the event type to listen for
		* @param {Function} listener The listener to add
		* @param {Object} [options] An options object specifies characteristics about
		*     the event listener
		* @param {Boolean} [options.once=false] A `Boolean`` indicating that the
		*     listener should be invoked at most once after being added. If `true`,
		*     the listener would be automatically removed when invoked.
		* @public
		*/
		addEventListener(type, listener, options) {
			if (typeof listener !== "function") return;
			function onMessage(data) {
				listener.call(this, new MessageEvent(data, this));
			}
			function onClose(code, message) {
				listener.call(this, new CloseEvent(code, message, this));
			}
			function onError(error) {
				listener.call(this, new ErrorEvent(error, this));
			}
			function onOpen() {
				listener.call(this, new OpenEvent(this));
			}
			const method = options && options.once ? "once" : "on";
			if (type === "message") {
				onMessage._listener = listener;
				this[method](type, onMessage);
			} else if (type === "close") {
				onClose._listener = listener;
				this[method](type, onClose);
			} else if (type === "error") {
				onError._listener = listener;
				this[method](type, onError);
			} else if (type === "open") {
				onOpen._listener = listener;
				this[method](type, onOpen);
			} else this[method](type, listener);
		},
		/**
		* Remove an event listener.
		*
		* @param {String} type A string representing the event type to remove
		* @param {Function} listener The listener to remove
		* @public
		*/
		removeEventListener(type, listener) {
			const listeners = this.listeners(type);
			for (let i = 0; i < listeners.length; i++) if (listeners[i] === listener || listeners[i]._listener === listener) this.removeListener(type, listeners[i]);
		}
	};
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/lib/extension.js
var require_extension = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var tokenChars = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		0,
		1,
		0
	];
	/**
	* Adds an offer to the map of extension offers or a parameter to the map of
	* parameters.
	*
	* @param {Object} dest The map of extension offers or parameters
	* @param {String} name The extension or parameter name
	* @param {(Object|Boolean|String)} elem The extension parameters or the
	*     parameter value
	* @private
	*/
	function push(dest, name, elem) {
		if (dest[name] === void 0) dest[name] = [elem];
		else dest[name].push(elem);
	}
	/**
	* Parses the `Sec-WebSocket-Extensions` header into an object.
	*
	* @param {String} header The field value of the header
	* @return {Object} The parsed object
	* @public
	*/
	function parse(header) {
		const offers = Object.create(null);
		if (header === void 0 || header === "") return offers;
		let params = Object.create(null);
		let mustUnescape = false;
		let isEscaping = false;
		let inQuotes = false;
		let extensionName;
		let paramName;
		let start = -1;
		let end = -1;
		let i = 0;
		for (; i < header.length; i++) {
			const code = header.charCodeAt(i);
			if (extensionName === void 0) if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (code === 32 || code === 9) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				const name = header.slice(start, end);
				if (code === 44) {
					push(offers, name, params);
					params = Object.create(null);
				} else extensionName = name;
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (paramName === void 0) if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (code === 32 || code === 9) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				push(params, header.slice(start, end), true);
				if (code === 44) {
					push(offers, extensionName, params);
					params = Object.create(null);
					extensionName = void 0;
				}
				start = end = -1;
			} else if (code === 61 && start !== -1 && end === -1) {
				paramName = header.slice(start, i);
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (isEscaping) {
				if (tokenChars[code] !== 1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (start === -1) start = i;
				else if (!mustUnescape) mustUnescape = true;
				isEscaping = false;
			} else if (inQuotes) if (tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (code === 34 && start !== -1) {
				inQuotes = false;
				end = i;
			} else if (code === 92) isEscaping = true;
			else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (code === 34 && header.charCodeAt(i - 1) === 61) inQuotes = true;
			else if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (start !== -1 && (code === 32 || code === 9)) {
				if (end === -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				let value = header.slice(start, end);
				if (mustUnescape) {
					value = value.replace(/\\/g, "");
					mustUnescape = false;
				}
				push(params, paramName, value);
				if (code === 44) {
					push(offers, extensionName, params);
					params = Object.create(null);
					extensionName = void 0;
				}
				paramName = void 0;
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
		}
		if (start === -1 || inQuotes) throw new SyntaxError("Unexpected end of input");
		if (end === -1) end = i;
		const token = header.slice(start, end);
		if (extensionName === void 0) push(offers, token, params);
		else {
			if (paramName === void 0) push(params, token, true);
			else if (mustUnescape) push(params, paramName, token.replace(/\\/g, ""));
			else push(params, paramName, token);
			push(offers, extensionName, params);
		}
		return offers;
	}
	/**
	* Builds the `Sec-WebSocket-Extensions` header field value.
	*
	* @param {Object} extensions The map of extensions and parameters to format
	* @return {String} A string representing the given object
	* @public
	*/
	function format(extensions) {
		return Object.keys(extensions).map((extension) => {
			let configurations = extensions[extension];
			if (!Array.isArray(configurations)) configurations = [configurations];
			return configurations.map((params) => {
				return [extension].concat(Object.keys(params).map((k) => {
					let values = params[k];
					if (!Array.isArray(values)) values = [values];
					return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
				})).join("; ");
			}).join(", ");
		}).join(", ");
	}
	module.exports = {
		format,
		parse
	};
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/lib/websocket.js
var require_websocket = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter$2 = __require("events");
	var https = __require("https");
	var http$1 = __require("http");
	var net = __require("net");
	var tls = __require("tls");
	var { randomBytes, createHash: createHash$1 } = __require("crypto");
	var { Readable } = __require("stream");
	var { URL: URL$1 } = __require("url");
	var PerMessageDeflate = require_permessage_deflate();
	var Receiver = require_receiver();
	var Sender = require_sender();
	var { BINARY_TYPES, EMPTY_BUFFER, GUID, kStatusCode, kWebSocket, NOOP } = require_constants();
	var { addEventListener, removeEventListener } = require_event_target();
	var { format, parse } = require_extension();
	var { toBuffer } = require_buffer_util();
	var readyStates = [
		"CONNECTING",
		"OPEN",
		"CLOSING",
		"CLOSED"
	];
	var protocolVersions = [8, 13];
	var closeTimeout = 30 * 1e3;
	/**
	* Class representing a WebSocket.
	*
	* @extends EventEmitter
	*/
	var WebSocket = class WebSocket extends EventEmitter$2 {
		/**
		* Create a new `WebSocket`.
		*
		* @param {(String|URL)} address The URL to which to connect
		* @param {(String|String[])} [protocols] The subprotocols
		* @param {Object} [options] Connection options
		*/
		constructor(address, protocols, options) {
			super();
			this._binaryType = BINARY_TYPES[0];
			this._closeCode = 1006;
			this._closeFrameReceived = false;
			this._closeFrameSent = false;
			this._closeMessage = "";
			this._closeTimer = null;
			this._extensions = {};
			this._protocol = "";
			this._readyState = WebSocket.CONNECTING;
			this._receiver = null;
			this._sender = null;
			this._socket = null;
			if (address !== null) {
				this._bufferedAmount = 0;
				this._isServer = false;
				this._redirects = 0;
				if (Array.isArray(protocols)) protocols = protocols.join(", ");
				else if (typeof protocols === "object" && protocols !== null) {
					options = protocols;
					protocols = void 0;
				}
				initAsClient(this, address, protocols, options);
			} else this._isServer = true;
		}
		/**
		* This deviates from the WHATWG interface since ws doesn't support the
		* required default "blob" type (instead we define a custom "nodebuffer"
		* type).
		*
		* @type {String}
		*/
		get binaryType() {
			return this._binaryType;
		}
		set binaryType(type) {
			if (!BINARY_TYPES.includes(type)) return;
			this._binaryType = type;
			if (this._receiver) this._receiver._binaryType = type;
		}
		/**
		* @type {Number}
		*/
		get bufferedAmount() {
			if (!this._socket) return this._bufferedAmount;
			return this._socket._writableState.length + this._sender._bufferedBytes;
		}
		/**
		* @type {String}
		*/
		get extensions() {
			return Object.keys(this._extensions).join();
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onclose() {}
		/* istanbul ignore next */
		set onclose(listener) {}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onerror() {}
		/* istanbul ignore next */
		set onerror(listener) {}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onopen() {}
		/* istanbul ignore next */
		set onopen(listener) {}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onmessage() {}
		/* istanbul ignore next */
		set onmessage(listener) {}
		/**
		* @type {String}
		*/
		get protocol() {
			return this._protocol;
		}
		/**
		* @type {Number}
		*/
		get readyState() {
			return this._readyState;
		}
		/**
		* @type {String}
		*/
		get url() {
			return this._url;
		}
		/**
		* Set up the socket and the internal resources.
		*
		* @param {(net.Socket|tls.Socket)} socket The network socket between the
		*     server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Number} [maxPayload=0] The maximum allowed message size
		* @param {Number} [maxBufferedChunks=0] The maximum number of
		*     buffered data chunks
		* @param {Number} [maxFragments=0] The maximum number of message
		*     fragments
		* @private
		*/
		setSocket(socket, head, maxPayload, maxBufferedChunks, maxFragments) {
			const receiver = new Receiver(this.binaryType, this._extensions, this._isServer, maxPayload, maxBufferedChunks, maxFragments);
			this._sender = new Sender(socket, this._extensions);
			this._receiver = receiver;
			this._socket = socket;
			receiver[kWebSocket] = this;
			socket[kWebSocket] = this;
			receiver.on("conclude", receiverOnConclude);
			receiver.on("drain", receiverOnDrain);
			receiver.on("error", receiverOnError);
			receiver.on("message", receiverOnMessage);
			receiver.on("ping", receiverOnPing);
			receiver.on("pong", receiverOnPong);
			socket.setTimeout(0);
			socket.setNoDelay();
			if (head.length > 0) socket.unshift(head);
			socket.on("close", socketOnClose);
			socket.on("data", socketOnData);
			socket.on("end", socketOnEnd);
			socket.on("error", socketOnError);
			this._readyState = WebSocket.OPEN;
			this.emit("open");
		}
		/**
		* Emit the `'close'` event.
		*
		* @private
		*/
		emitClose() {
			if (!this._socket) {
				this._readyState = WebSocket.CLOSED;
				this.emit("close", this._closeCode, this._closeMessage);
				return;
			}
			if (this._extensions[PerMessageDeflate.extensionName]) this._extensions[PerMessageDeflate.extensionName].cleanup();
			this._receiver.removeAllListeners();
			this._readyState = WebSocket.CLOSED;
			this.emit("close", this._closeCode, this._closeMessage);
		}
		/**
		* Start a closing handshake.
		*
		*          +----------+   +-----------+   +----------+
		*     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
		*    |     +----------+   +-----------+   +----------+     |
		*          +----------+   +-----------+         |
		* CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
		*          +----------+   +-----------+   |
		*    |           |                        |   +---+        |
		*                +------------------------+-->|fin| - - - -
		*    |         +---+                      |   +---+
		*     - - - - -|fin|<---------------------+
		*              +---+
		*
		* @param {Number} [code] Status code explaining why the connection is closing
		* @param {String} [data] A string explaining why the connection is closing
		* @public
		*/
		close(code, data) {
			if (this.readyState === WebSocket.CLOSED) return;
			if (this.readyState === WebSocket.CONNECTING) return abortHandshake(this, this._req, "WebSocket was closed before the connection was established");
			if (this.readyState === WebSocket.CLOSING) {
				if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) this._socket.end();
				return;
			}
			this._readyState = WebSocket.CLOSING;
			this._sender.close(code, data, !this._isServer, (err) => {
				if (err) return;
				this._closeFrameSent = true;
				if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) this._socket.end();
			});
			this._closeTimer = setTimeout(this._socket.destroy.bind(this._socket), closeTimeout);
		}
		/**
		* Send a ping.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the ping is sent
		* @public
		*/
		ping(data, mask, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.ping(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Send a pong.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the pong is sent
		* @public
		*/
		pong(data, mask, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.pong(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Send a data message.
		*
		* @param {*} data The message to send
		* @param {Object} [options] Options object
		* @param {Boolean} [options.compress] Specifies whether or not to compress
		*     `data`
		* @param {Boolean} [options.binary] Specifies whether `data` is binary or
		*     text
		* @param {Boolean} [options.fin=true] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when data is written out
		* @public
		*/
		send(data, options, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof options === "function") {
				cb = options;
				options = {};
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			const opts = {
				binary: typeof data !== "string",
				mask: !this._isServer,
				compress: true,
				fin: true,
				...options
			};
			if (!this._extensions[PerMessageDeflate.extensionName]) opts.compress = false;
			this._sender.send(data || EMPTY_BUFFER, opts, cb);
		}
		/**
		* Forcibly close the connection.
		*
		* @public
		*/
		terminate() {
			if (this.readyState === WebSocket.CLOSED) return;
			if (this.readyState === WebSocket.CONNECTING) return abortHandshake(this, this._req, "WebSocket was closed before the connection was established");
			if (this._socket) {
				this._readyState = WebSocket.CLOSING;
				this._socket.destroy();
			}
		}
	};
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	[
		"binaryType",
		"bufferedAmount",
		"extensions",
		"protocol",
		"readyState",
		"url"
	].forEach((property) => {
		Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
	});
	[
		"open",
		"error",
		"close",
		"message"
	].forEach((method) => {
		Object.defineProperty(WebSocket.prototype, `on${method}`, {
			enumerable: true,
			get() {
				const listeners = this.listeners(method);
				for (let i = 0; i < listeners.length; i++) if (listeners[i]._listener) return listeners[i]._listener;
			},
			set(listener) {
				const listeners = this.listeners(method);
				for (let i = 0; i < listeners.length; i++) if (listeners[i]._listener) this.removeListener(method, listeners[i]);
				this.addEventListener(method, listener);
			}
		});
	});
	WebSocket.prototype.addEventListener = addEventListener;
	WebSocket.prototype.removeEventListener = removeEventListener;
	module.exports = WebSocket;
	/**
	* Initialize a WebSocket client.
	*
	* @param {WebSocket} websocket The client to initialize
	* @param {(String|URL)} address The URL to which to connect
	* @param {String} [protocols] The subprotocols
	* @param {Object} [options] Connection options
	* @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	*     permessage-deflate
	* @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	*     handshake request
	* @param {Number} [options.protocolVersion=13] Value of the
	*     `Sec-WebSocket-Version` header
	* @param {String} [options.origin] Value of the `Origin` or
	*     `Sec-WebSocket-Origin` header
	* @param {Number} [options.maxBufferedChunks=1048576] The maximum number of
	*     buffered data chunks
	* @param {Number} [options.maxFragments=131072] The maximum number of message
	*     fragments
	* @param {Number} [options.maxPayload=104857600] The maximum allowed message
	*     size
	* @param {Boolean} [options.followRedirects=false] Whether or not to follow
	*     redirects
	* @param {Number} [options.maxRedirects=10] The maximum number of redirects
	*     allowed
	* @private
	*/
	function initAsClient(websocket, address, protocols, options) {
		const opts = {
			protocolVersion: protocolVersions[1],
			maxBufferedChunks: 1024 * 1024,
			maxFragments: 128 * 1024,
			maxPayload: 100 * 1024 * 1024,
			perMessageDeflate: true,
			followRedirects: false,
			maxRedirects: 10,
			...options,
			createConnection: void 0,
			socketPath: void 0,
			hostname: void 0,
			protocol: void 0,
			timeout: void 0,
			method: void 0,
			host: void 0,
			path: void 0,
			port: void 0
		};
		if (!protocolVersions.includes(opts.protocolVersion)) throw new RangeError(`Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`);
		let parsedUrl;
		if (address instanceof URL$1) {
			parsedUrl = address;
			websocket._url = address.href;
		} else {
			parsedUrl = new URL$1(address);
			websocket._url = address;
		}
		const isUnixSocket = parsedUrl.protocol === "ws+unix:";
		if (!parsedUrl.host && (!isUnixSocket || !parsedUrl.pathname)) {
			const err = /* @__PURE__ */ new Error(`Invalid URL: ${websocket.url}`);
			if (websocket._redirects === 0) throw err;
			else {
				emitErrorAndClose(websocket, err);
				return;
			}
		}
		const isSecure = parsedUrl.protocol === "wss:" || parsedUrl.protocol === "https:";
		const defaultPort = isSecure ? 443 : 80;
		const key = randomBytes(16).toString("base64");
		const get = isSecure ? https.get : http$1.get;
		let perMessageDeflate;
		opts.createConnection = isSecure ? tlsConnect : netConnect;
		opts.defaultPort = opts.defaultPort || defaultPort;
		opts.port = parsedUrl.port || defaultPort;
		opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
		opts.headers = {
			"Sec-WebSocket-Version": opts.protocolVersion,
			"Sec-WebSocket-Key": key,
			Connection: "Upgrade",
			Upgrade: "websocket",
			...opts.headers
		};
		opts.path = parsedUrl.pathname + parsedUrl.search;
		opts.timeout = opts.handshakeTimeout;
		if (opts.perMessageDeflate) {
			perMessageDeflate = new PerMessageDeflate(opts.perMessageDeflate !== true ? opts.perMessageDeflate : {}, false, opts.maxPayload);
			opts.headers["Sec-WebSocket-Extensions"] = format({ [PerMessageDeflate.extensionName]: perMessageDeflate.offer() });
		}
		if (protocols) opts.headers["Sec-WebSocket-Protocol"] = protocols;
		if (opts.origin) if (opts.protocolVersion < 13) opts.headers["Sec-WebSocket-Origin"] = opts.origin;
		else opts.headers.Origin = opts.origin;
		if (parsedUrl.username || parsedUrl.password) opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
		if (isUnixSocket) {
			const parts = opts.path.split(":");
			opts.socketPath = parts[0];
			opts.path = parts[1];
		}
		if (opts.followRedirects) {
			if (websocket._redirects === 0) {
				websocket._originalUnixSocket = isUnixSocket;
				websocket._originalSecure = isSecure;
				websocket._originalHostOrSocketPath = isUnixSocket ? opts.socketPath : parsedUrl.host;
				const headers = options && options.headers;
				options = {
					...options,
					headers: {}
				};
				if (headers) for (const [key, value] of Object.entries(headers)) options.headers[key.toLowerCase()] = value;
			} else {
				const isSameHost = isUnixSocket ? websocket._originalUnixSocket ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalUnixSocket ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
				if (!isSameHost || websocket._originalSecure && !isSecure) {
					delete opts.headers.authorization;
					delete opts.headers.cookie;
					if (!isSameHost) delete opts.headers.host;
					opts.auth = void 0;
				}
			}
			if (opts.auth && !options.headers.authorization) options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
		}
		let req = websocket._req = get(opts);
		if (opts.timeout) req.on("timeout", () => {
			abortHandshake(websocket, req, "Opening handshake has timed out");
		});
		req.on("error", (err) => {
			if (req === null || req.aborted) return;
			req = websocket._req = null;
			emitErrorAndClose(websocket, err);
		});
		req.on("response", (res) => {
			const location = res.headers.location;
			const statusCode = res.statusCode;
			if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
				if (++websocket._redirects > opts.maxRedirects) {
					abortHandshake(websocket, req, "Maximum redirects exceeded");
					return;
				}
				req.abort();
				let addr;
				try {
					addr = new URL$1(location, address);
				} catch (err) {
					emitErrorAndClose(websocket, err);
					return;
				}
				initAsClient(websocket, addr, protocols, options);
			} else if (!websocket.emit("unexpected-response", req, res)) abortHandshake(websocket, req, `Unexpected server response: ${res.statusCode}`);
		});
		req.on("upgrade", (res, socket, head) => {
			websocket.emit("upgrade", res);
			if (websocket.readyState !== WebSocket.CONNECTING) return;
			req = websocket._req = null;
			const upgrade = res.headers.upgrade;
			if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
				abortHandshake(websocket, socket, "Invalid Upgrade header");
				return;
			}
			const digest = createHash$1("sha1").update(key + GUID).digest("base64");
			if (res.headers["sec-websocket-accept"] !== digest) {
				abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
				return;
			}
			const serverProt = res.headers["sec-websocket-protocol"];
			const protList = (protocols || "").split(/, */);
			let protError;
			if (!protocols && serverProt) protError = "Server sent a subprotocol but none was requested";
			else if (protocols && !serverProt) protError = "Server sent no subprotocol";
			else if (serverProt && !protList.includes(serverProt)) protError = "Server sent an invalid subprotocol";
			if (protError) {
				abortHandshake(websocket, socket, protError);
				return;
			}
			if (serverProt) websocket._protocol = serverProt;
			const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
			if (secWebSocketExtensions !== void 0) {
				if (!perMessageDeflate) {
					abortHandshake(websocket, socket, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
					return;
				}
				let extensions;
				try {
					extensions = parse(secWebSocketExtensions);
				} catch (err) {
					abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Extensions header");
					return;
				}
				const extensionNames = Object.keys(extensions);
				if (extensionNames.length) {
					if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
						abortHandshake(websocket, socket, "Server indicated an extension that was not requested");
						return;
					}
					try {
						perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
					} catch (err) {
						abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Extensions header");
						return;
					}
					websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
				}
			}
			websocket.setSocket(socket, head, opts.maxPayload, opts.maxBufferedChunks, opts.maxFragments);
		});
	}
	/**
	* Emit the `'error'` and `'close'` event.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {Error} The error to emit
	* @private
	*/
	function emitErrorAndClose(websocket, err) {
		websocket._readyState = WebSocket.CLOSING;
		websocket.emit("error", err);
		websocket.emitClose();
	}
	/**
	* Create a `net.Socket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {net.Socket} The newly created socket used to start the connection
	* @private
	*/
	function netConnect(options) {
		options.path = options.socketPath;
		return net.connect(options);
	}
	/**
	* Create a `tls.TLSSocket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {tls.TLSSocket} The newly created socket used to start the connection
	* @private
	*/
	function tlsConnect(options) {
		options.path = void 0;
		if (!options.servername && options.servername !== "") options.servername = net.isIP(options.host) ? "" : options.host;
		return tls.connect(options);
	}
	/**
	* Abort the handshake and emit an error.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	*     abort or the socket to destroy
	* @param {String} message The error message
	* @private
	*/
	function abortHandshake(websocket, stream, message) {
		websocket._readyState = WebSocket.CLOSING;
		const err = new Error(message);
		Error.captureStackTrace(err, abortHandshake);
		if (stream.setHeader) {
			stream.abort();
			if (stream.socket && !stream.socket.destroyed) stream.socket.destroy();
			stream.once("abort", websocket.emitClose.bind(websocket));
			websocket.emit("error", err);
		} else {
			stream.destroy(err);
			stream.once("error", websocket.emit.bind(websocket, "error"));
			stream.once("close", websocket.emitClose.bind(websocket));
		}
	}
	/**
	* Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	* when the `readyState` attribute is `CLOSING` or `CLOSED`.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {*} [data] The data to send
	* @param {Function} [cb] Callback
	* @private
	*/
	function sendAfterClose(websocket, data, cb) {
		if (data) {
			const length = toBuffer(data).length;
			if (websocket._socket) websocket._sender._bufferedBytes += length;
			else websocket._bufferedAmount += length;
		}
		if (cb) cb(/* @__PURE__ */ new Error(`WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`));
	}
	/**
	* The listener of the `Receiver` `'conclude'` event.
	*
	* @param {Number} code The status code
	* @param {String} reason The reason for closing
	* @private
	*/
	function receiverOnConclude(code, reason) {
		const websocket = this[kWebSocket];
		websocket._closeFrameReceived = true;
		websocket._closeMessage = reason;
		websocket._closeCode = code;
		if (websocket._socket[kWebSocket] === void 0) return;
		websocket._socket.removeListener("data", socketOnData);
		process.nextTick(resume, websocket._socket);
		if (code === 1005) websocket.close();
		else websocket.close(code, reason);
	}
	/**
	* The listener of the `Receiver` `'drain'` event.
	*
	* @private
	*/
	function receiverOnDrain() {
		this[kWebSocket]._socket.resume();
	}
	/**
	* The listener of the `Receiver` `'error'` event.
	*
	* @param {(RangeError|Error)} err The emitted error
	* @private
	*/
	function receiverOnError(err) {
		const websocket = this[kWebSocket];
		if (websocket._socket[kWebSocket] !== void 0) {
			websocket._socket.removeListener("data", socketOnData);
			process.nextTick(resume, websocket._socket);
			websocket.close(err[kStatusCode]);
		}
		websocket.emit("error", err);
	}
	/**
	* The listener of the `Receiver` `'finish'` event.
	*
	* @private
	*/
	function receiverOnFinish() {
		this[kWebSocket].emitClose();
	}
	/**
	* The listener of the `Receiver` `'message'` event.
	*
	* @param {(String|Buffer|ArrayBuffer|Buffer[])} data The message
	* @private
	*/
	function receiverOnMessage(data) {
		this[kWebSocket].emit("message", data);
	}
	/**
	* The listener of the `Receiver` `'ping'` event.
	*
	* @param {Buffer} data The data included in the ping frame
	* @private
	*/
	function receiverOnPing(data) {
		const websocket = this[kWebSocket];
		websocket.pong(data, !websocket._isServer, NOOP);
		websocket.emit("ping", data);
	}
	/**
	* The listener of the `Receiver` `'pong'` event.
	*
	* @param {Buffer} data The data included in the pong frame
	* @private
	*/
	function receiverOnPong(data) {
		this[kWebSocket].emit("pong", data);
	}
	/**
	* Resume a readable stream
	*
	* @param {Readable} stream The readable stream
	* @private
	*/
	function resume(stream) {
		stream.resume();
	}
	/**
	* The listener of the `net.Socket` `'close'` event.
	*
	* @private
	*/
	function socketOnClose() {
		const websocket = this[kWebSocket];
		this.removeListener("close", socketOnClose);
		this.removeListener("data", socketOnData);
		this.removeListener("end", socketOnEnd);
		websocket._readyState = WebSocket.CLOSING;
		let chunk;
		if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && (chunk = websocket._socket.read()) !== null) websocket._receiver.write(chunk);
		websocket._receiver.end();
		this[kWebSocket] = void 0;
		clearTimeout(websocket._closeTimer);
		if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) websocket.emitClose();
		else {
			websocket._receiver.on("error", receiverOnFinish);
			websocket._receiver.on("finish", receiverOnFinish);
		}
	}
	/**
	* The listener of the `net.Socket` `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function socketOnData(chunk) {
		if (!this[kWebSocket]._receiver.write(chunk)) this.pause();
	}
	/**
	* The listener of the `net.Socket` `'end'` event.
	*
	* @private
	*/
	function socketOnEnd() {
		const websocket = this[kWebSocket];
		websocket._readyState = WebSocket.CLOSING;
		websocket._receiver.end();
		this.end();
	}
	/**
	* The listener of the `net.Socket` `'error'` event.
	*
	* @private
	*/
	function socketOnError() {
		const websocket = this[kWebSocket];
		this.removeListener("error", socketOnError);
		this.on("error", NOOP);
		if (websocket) {
			websocket._readyState = WebSocket.CLOSING;
			this.destroy();
		}
	}
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/lib/stream.js
var require_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Duplex } = __require("stream");
	/**
	* Emits the `'close'` event on a stream.
	*
	* @param {Duplex} stream The stream.
	* @private
	*/
	function emitClose(stream) {
		stream.emit("close");
	}
	/**
	* The listener of the `'end'` event.
	*
	* @private
	*/
	function duplexOnEnd() {
		if (!this.destroyed && this._writableState.finished) this.destroy();
	}
	/**
	* The listener of the `'error'` event.
	*
	* @param {Error} err The error
	* @private
	*/
	function duplexOnError(err) {
		this.removeListener("error", duplexOnError);
		this.destroy();
		if (this.listenerCount("error") === 0) this.emit("error", err);
	}
	/**
	* Wraps a `WebSocket` in a duplex stream.
	*
	* @param {WebSocket} ws The `WebSocket` to wrap
	* @param {Object} [options] The options for the `Duplex` constructor
	* @return {Duplex} The duplex stream
	* @public
	*/
	function createWebSocketStream(ws, options) {
		let resumeOnReceiverDrain = true;
		let terminateOnDestroy = true;
		function receiverOnDrain() {
			if (resumeOnReceiverDrain) ws._socket.resume();
		}
		if (ws.readyState === ws.CONNECTING) ws.once("open", function open() {
			ws._receiver.removeAllListeners("drain");
			ws._receiver.on("drain", receiverOnDrain);
		});
		else {
			ws._receiver.removeAllListeners("drain");
			ws._receiver.on("drain", receiverOnDrain);
		}
		const duplex = new Duplex({
			...options,
			autoDestroy: false,
			emitClose: false,
			objectMode: false,
			writableObjectMode: false
		});
		ws.on("message", function message(msg) {
			if (!duplex.push(msg)) {
				resumeOnReceiverDrain = false;
				ws._socket.pause();
			}
		});
		ws.once("error", function error(err) {
			if (duplex.destroyed) return;
			terminateOnDestroy = false;
			duplex.destroy(err);
		});
		ws.once("close", function close() {
			if (duplex.destroyed) return;
			duplex.push(null);
		});
		duplex._destroy = function(err, callback) {
			if (ws.readyState === ws.CLOSED) {
				callback(err);
				process.nextTick(emitClose, duplex);
				return;
			}
			let called = false;
			ws.once("error", function error(err) {
				called = true;
				callback(err);
			});
			ws.once("close", function close() {
				if (!called) callback(err);
				process.nextTick(emitClose, duplex);
			});
			if (terminateOnDestroy) ws.terminate();
		};
		duplex._final = function(callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._final(callback);
				});
				return;
			}
			if (ws._socket === null) return;
			if (ws._socket._writableState.finished) {
				callback();
				if (duplex._readableState.endEmitted) duplex.destroy();
			} else {
				ws._socket.once("finish", function finish() {
					callback();
				});
				ws.close();
			}
		};
		duplex._read = function() {
			if ((ws.readyState === ws.OPEN || ws.readyState === ws.CLOSING) && !resumeOnReceiverDrain) {
				resumeOnReceiverDrain = true;
				if (!ws._receiver._writableState.needDrain) ws._socket.resume();
			}
		};
		duplex._write = function(chunk, encoding, callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._write(chunk, encoding, callback);
				});
				return;
			}
			ws.send(chunk, callback);
		};
		duplex.on("end", duplexOnEnd);
		duplex.on("error", duplexOnError);
		return duplex;
	}
	module.exports = createWebSocketStream;
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/lib/websocket-server.js
var require_websocket_server = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter$1 = __require("events");
	var http = __require("http");
	__require("https");
	__require("net");
	__require("tls");
	var { createHash } = __require("crypto");
	var PerMessageDeflate = require_permessage_deflate();
	var WebSocket = require_websocket();
	var { format, parse } = require_extension();
	var { GUID, kWebSocket } = require_constants();
	var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
	var RUNNING = 0;
	var CLOSING = 1;
	var CLOSED = 2;
	/**
	* Class representing a WebSocket server.
	*
	* @extends EventEmitter
	*/
	var WebSocketServer = class extends EventEmitter$1 {
		/**
		* Create a `WebSocketServer` instance.
		*
		* @param {Object} options Configuration options
		* @param {Number} [options.backlog=511] The maximum length of the queue of
		*     pending connections
		* @param {Boolean} [options.clientTracking=true] Specifies whether or not to
		*     track clients
		* @param {Function} [options.handleProtocols] A hook to handle protocols
		* @param {String} [options.host] The hostname where to bind the server
		* @param {Number} [options.maxBufferedChunks=1048576] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=131072] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=104857600] The maximum allowed message
		*     size
		* @param {Boolean} [options.noServer=false] Enable no server mode
		* @param {String} [options.path] Accept only connections matching this path
		* @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
		*     permessage-deflate
		* @param {Number} [options.port] The port where to bind the server
		* @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
		*     server to use
		* @param {Function} [options.verifyClient] A hook to reject connections
		* @param {Function} [callback] A listener for the `listening` event
		*/
		constructor(options, callback) {
			super();
			options = {
				maxBufferedChunks: 1024 * 1024,
				maxFragments: 128 * 1024,
				maxPayload: 100 * 1024 * 1024,
				perMessageDeflate: false,
				handleProtocols: null,
				clientTracking: true,
				verifyClient: null,
				noServer: false,
				backlog: null,
				server: null,
				host: null,
				path: null,
				port: null,
				...options
			};
			if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) throw new TypeError("One and only one of the \"port\", \"server\", or \"noServer\" options must be specified");
			if (options.port != null) {
				this._server = http.createServer((req, res) => {
					const body = http.STATUS_CODES[426];
					res.writeHead(426, {
						"Content-Length": body.length,
						"Content-Type": "text/plain"
					});
					res.end(body);
				});
				this._server.listen(options.port, options.host, options.backlog, callback);
			} else if (options.server) this._server = options.server;
			if (this._server) {
				const emitConnection = this.emit.bind(this, "connection");
				this._removeListeners = addListeners(this._server, {
					listening: this.emit.bind(this, "listening"),
					error: this.emit.bind(this, "error"),
					upgrade: (req, socket, head) => {
						this.handleUpgrade(req, socket, head, emitConnection);
					}
				});
			}
			if (options.perMessageDeflate === true) options.perMessageDeflate = {};
			if (options.clientTracking) this.clients = /* @__PURE__ */ new Set();
			this.options = options;
			this._state = RUNNING;
		}
		/**
		* Returns the bound address, the address family name, and port of the server
		* as reported by the operating system if listening on an IP socket.
		* If the server is listening on a pipe or UNIX domain socket, the name is
		* returned as a string.
		*
		* @return {(Object|String|null)} The address of the server
		* @public
		*/
		address() {
			if (this.options.noServer) throw new Error("The server is operating in \"noServer\" mode");
			if (!this._server) return null;
			return this._server.address();
		}
		/**
		* Close the server.
		*
		* @param {Function} [cb] Callback
		* @public
		*/
		close(cb) {
			if (cb) this.once("close", cb);
			if (this._state === CLOSED) {
				process.nextTick(emitClose, this);
				return;
			}
			if (this._state === CLOSING) return;
			this._state = CLOSING;
			if (this.clients) for (const client of this.clients) client.terminate();
			const server = this._server;
			if (server) {
				this._removeListeners();
				this._removeListeners = this._server = null;
				if (this.options.port != null) {
					server.close(emitClose.bind(void 0, this));
					return;
				}
			}
			process.nextTick(emitClose, this);
		}
		/**
		* See if a given request should be handled by this server instance.
		*
		* @param {http.IncomingMessage} req Request object to inspect
		* @return {Boolean} `true` if the request is valid, else `false`
		* @public
		*/
		shouldHandle(req) {
			if (this.options.path) {
				const index = req.url.indexOf("?");
				if ((index !== -1 ? req.url.slice(0, index) : req.url) !== this.options.path) return false;
			}
			return true;
		}
		/**
		* Handle a HTTP Upgrade request.
		*
		* @param {http.IncomingMessage} req The request object
		* @param {(net.Socket|tls.Socket)} socket The network socket between the
		*     server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @public
		*/
		handleUpgrade(req, socket, head, cb) {
			socket.on("error", socketOnError);
			const key = req.headers["sec-websocket-key"] !== void 0 ? req.headers["sec-websocket-key"].trim() : false;
			const upgrade = req.headers.upgrade;
			const version = +req.headers["sec-websocket-version"];
			const extensions = {};
			if (req.method !== "GET" || upgrade === void 0 || upgrade.toLowerCase() !== "websocket" || !key || !keyRegex.test(key) || version !== 8 && version !== 13 || !this.shouldHandle(req)) return abortHandshake(socket, 400);
			if (this.options.perMessageDeflate) {
				const perMessageDeflate = new PerMessageDeflate(this.options.perMessageDeflate, true, this.options.maxPayload);
				try {
					const offers = parse(req.headers["sec-websocket-extensions"]);
					if (offers[PerMessageDeflate.extensionName]) {
						perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
						extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
					}
				} catch (err) {
					return abortHandshake(socket, 400);
				}
			}
			if (this.options.verifyClient) {
				const info = {
					origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
					secure: !!(req.socket.authorized || req.socket.encrypted),
					req
				};
				if (this.options.verifyClient.length === 2) {
					this.options.verifyClient(info, (verified, code, message, headers) => {
						if (!verified) return abortHandshake(socket, code || 401, message, headers);
						this.completeUpgrade(key, extensions, req, socket, head, cb);
					});
					return;
				}
				if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
			}
			this.completeUpgrade(key, extensions, req, socket, head, cb);
		}
		/**
		* Upgrade the connection to WebSocket.
		*
		* @param {String} key The value of the `Sec-WebSocket-Key` header
		* @param {Object} extensions The accepted extensions
		* @param {http.IncomingMessage} req The request object
		* @param {(net.Socket|tls.Socket)} socket The network socket between the
		*     server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @throws {Error} If called more than once with the same socket
		* @private
		*/
		completeUpgrade(key, extensions, req, socket, head, cb) {
			if (!socket.readable || !socket.writable) return socket.destroy();
			if (socket[kWebSocket]) throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
			if (this._state > RUNNING) return abortHandshake(socket, 503);
			const headers = [
				"HTTP/1.1 101 Switching Protocols",
				"Upgrade: websocket",
				"Connection: Upgrade",
				`Sec-WebSocket-Accept: ${createHash("sha1").update(key + GUID).digest("base64")}`
			];
			const ws = new WebSocket(null);
			let protocol = req.headers["sec-websocket-protocol"];
			if (protocol) {
				protocol = protocol.split(",").map(trim);
				if (this.options.handleProtocols) protocol = this.options.handleProtocols(protocol, req);
				else protocol = protocol[0];
				if (protocol) {
					headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
					ws._protocol = protocol;
				}
			}
			if (extensions[PerMessageDeflate.extensionName]) {
				const params = extensions[PerMessageDeflate.extensionName].params;
				const value = format({ [PerMessageDeflate.extensionName]: [params] });
				headers.push(`Sec-WebSocket-Extensions: ${value}`);
				ws._extensions = extensions;
			}
			this.emit("headers", headers, req);
			socket.write(headers.concat("\r\n").join("\r\n"));
			socket.removeListener("error", socketOnError);
			ws.setSocket(socket, head, this.options.maxPayload, this.options.maxBufferedChunks, this.options.maxFragments);
			if (this.clients) {
				this.clients.add(ws);
				ws.on("close", () => this.clients.delete(ws));
			}
			cb(ws, req);
		}
	};
	module.exports = WebSocketServer;
	/**
	* Add event listeners on an `EventEmitter` using a map of <event, listener>
	* pairs.
	*
	* @param {EventEmitter} server The event emitter
	* @param {Object.<String, Function>} map The listeners to add
	* @return {Function} A function that will remove the added listeners when
	*     called
	* @private
	*/
	function addListeners(server, map) {
		for (const event of Object.keys(map)) server.on(event, map[event]);
		return function removeListeners() {
			for (const event of Object.keys(map)) server.removeListener(event, map[event]);
		};
	}
	/**
	* Emit a `'close'` event on an `EventEmitter`.
	*
	* @param {EventEmitter} server The event emitter
	* @private
	*/
	function emitClose(server) {
		server._state = CLOSED;
		server.emit("close");
	}
	/**
	* Handle premature socket errors.
	*
	* @private
	*/
	function socketOnError() {
		this.destroy();
	}
	/**
	* Close the connection when preconditions are not fulfilled.
	*
	* @param {(net.Socket|tls.Socket)} socket The socket of the upgrade request
	* @param {Number} code The HTTP response status code
	* @param {String} [message] The HTTP response body
	* @param {Object} [headers] Additional HTTP response headers
	* @private
	*/
	function abortHandshake(socket, code, message, headers) {
		if (socket.writable) {
			message = message || http.STATUS_CODES[code];
			headers = {
				Connection: "close",
				"Content-Type": "text/html",
				"Content-Length": Buffer.byteLength(message),
				...headers
			};
			socket.write(`HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message);
		}
		socket.removeListener("error", socketOnError);
		socket.destroy();
	}
	/**
	* Remove whitespace characters from both ends of a string.
	*
	* @param {String} str The string
	* @return {String} A new string representing `str` stripped of whitespace
	*     characters from both its beginning and end
	* @private
	*/
	function trim(str) {
		return str.trim();
	}
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/index.js
var require_ws = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var WebSocket = require_websocket();
	WebSocket.createWebSocketStream = require_stream();
	WebSocket.Server = require_websocket_server();
	WebSocket.Receiver = require_receiver();
	WebSocket.Sender = require_sender();
	module.exports = WebSocket;
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-ws-connection/dist/index.es.js
var v$1, w, d$1, h, b, f$1;
var init_index_es$1 = __esmMin((() => {
	init_esm$3();
	init_esm();
	v$1 = () => typeof WebSocket < "u" ? WebSocket : typeof global < "u" && typeof global.WebSocket < "u" ? global.WebSocket : typeof window < "u" && typeof window.WebSocket < "u" ? window.WebSocket : typeof self < "u" && typeof self.WebSocket < "u" ? self.WebSocket : require_ws(), w = () => typeof WebSocket < "u" || typeof global < "u" && typeof global.WebSocket < "u" || typeof window < "u" && typeof window.WebSocket < "u" || typeof self < "u" && typeof self.WebSocket < "u", d$1 = (r) => r.split("?")[0], h = 10, b = v$1();
	f$1 = class {
		constructor(e) {
			if (this.url = e, this.events = new EventEmitter(), this.registering = !1, !isWsUrl(e)) throw new Error(`Provided URL is not compatible with WebSocket connection: ${e}`);
			this.url = e;
		}
		get connected() {
			return typeof this.socket < "u";
		}
		get connecting() {
			return this.registering;
		}
		on(e, t) {
			this.events.on(e, t);
		}
		once(e, t) {
			this.events.once(e, t);
		}
		off(e, t) {
			this.events.off(e, t);
		}
		removeListener(e, t) {
			this.events.removeListener(e, t);
		}
		async open(e = this.url) {
			await this.register(e);
		}
		async close() {
			return new Promise((e, t) => {
				if (typeof this.socket > "u") {
					t(/* @__PURE__ */ new Error("Connection already closed"));
					return;
				}
				this.socket.onclose = (n) => {
					this.onClose(n), e();
				}, this.socket.close();
			});
		}
		async send(e) {
			typeof this.socket > "u" && (this.socket = await this.register());
			try {
				this.socket.send(safeJsonStringify(e));
			} catch (t) {
				this.onError(e.id, t);
			}
		}
		register(e = this.url) {
			if (!isWsUrl(e)) throw new Error(`Provided URL is not compatible with WebSocket connection: ${e}`);
			if (this.registering) {
				const t = this.events.getMaxListeners();
				return (this.events.listenerCount("register_error") >= t || this.events.listenerCount("open") >= t) && this.events.setMaxListeners(t + 1), new Promise((n, s) => {
					this.events.once("register_error", (o) => {
						this.resetMaxListeners(), s(o);
					}), this.events.once("open", () => {
						if (this.resetMaxListeners(), typeof this.socket > "u") return s(/* @__PURE__ */ new Error("WebSocket connection is missing or invalid"));
						n(this.socket);
					});
				});
			}
			return this.url = e, this.registering = !0, new Promise((t, n) => {
				const o = new b(e, [], (0, esm_exports.isReactNative)() ? void 0 : { rejectUnauthorized: !isLocalhostUrl(e) });
				w() ? o.onerror = (i) => {
					const a = i;
					n(this.emitError(a.error));
				} : o.on("error", (i) => {
					n(this.emitError(i));
				}), o.onopen = () => {
					this.onOpen(o), t(o);
				};
			});
		}
		onOpen(e) {
			e.onmessage = (t) => this.onPayload(t), e.onclose = (t) => this.onClose(t), this.socket = e, this.registering = !1, this.events.emit("open");
		}
		onClose(e) {
			this.socket = void 0, this.registering = !1, this.events.emit("close", e);
		}
		onPayload(e) {
			if (typeof e.data > "u") return;
			const t = typeof e.data == "string" ? safeJsonParse(e.data) : e.data;
			this.events.emit("payload", t);
		}
		onError(e, t) {
			const n = this.parseError(t), o = formatJsonRpcError(e, n.message || n.toString());
			this.events.emit("payload", o);
		}
		parseError(e, t = this.url) {
			return parseConnectionError(e, d$1(t), "WS");
		}
		resetMaxListeners() {
			this.events.getMaxListeners() > h && this.events.setMaxListeners(h);
		}
		emitError(e) {
			const t = this.parseError(new Error(e?.message || `WebSocket connection failed for host: ${d$1(this.url)}`));
			return this.events.emit("register_error", t), t;
		}
	};
}));
//#endregion
//#region node_modules/@walletconnect/core/dist/index.es.js
function cr(r, e) {
	if (r.length >= 255) throw new TypeError("Alphabet too long");
	for (var t = new Uint8Array(256), i = 0; i < t.length; i++) t[i] = 255;
	for (var s = 0; s < r.length; s++) {
		var n = r.charAt(s), o = n.charCodeAt(0);
		if (t[o] !== 255) throw new TypeError(n + " is ambiguous");
		t[o] = s;
	}
	var a = r.length, c = r.charAt(0), h = Math.log(a) / Math.log(256), l = Math.log(256) / Math.log(a);
	function p(u) {
		if (u instanceof Uint8Array || (ArrayBuffer.isView(u) ? u = new Uint8Array(u.buffer, u.byteOffset, u.byteLength) : Array.isArray(u) && (u = Uint8Array.from(u))), !(u instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
		if (u.length === 0) return "";
		for (var m = 0, D = 0, _ = 0, E = u.length; _ !== E && u[_] === 0;) _++, m++;
		for (var L = (E - _) * l + 1 >>> 0, I = new Uint8Array(L); _ !== E;) {
			for (var k = u[_], T = 0, S = L - 1; (k !== 0 || T < D) && S !== -1; S--, T++) k += 256 * I[S] >>> 0, I[S] = k % a >>> 0, k = k / a >>> 0;
			if (k !== 0) throw new Error("Non-zero carry");
			D = T, _++;
		}
		for (var O = L - D; O !== L && I[O] === 0;) O++;
		for (var te = c.repeat(m); O < L; ++O) te += r.charAt(I[O]);
		return te;
	}
	function y(u) {
		if (typeof u != "string") throw new TypeError("Expected String");
		if (u.length === 0) return new Uint8Array();
		var m = 0;
		if (u[m] !== " ") {
			for (var D = 0, _ = 0; u[m] === c;) D++, m++;
			for (var E = (u.length - m) * h + 1 >>> 0, L = new Uint8Array(E); u[m];) {
				var I = t[u.charCodeAt(m)];
				if (I === 255) return;
				for (var k = 0, T = E - 1; (I !== 0 || k < _) && T !== -1; T--, k++) I += a * L[T] >>> 0, L[T] = I % 256 >>> 0, I = I / 256 >>> 0;
				if (I !== 0) throw new Error("Non-zero carry");
				_ = k, m++;
			}
			if (u[m] !== " ") {
				for (var S = E - _; S !== E && L[S] === 0;) S++;
				for (var O = new Uint8Array(D + (E - S)), te = D; S !== E;) O[te++] = L[S++];
				return O;
			}
		}
	}
	function w(u) {
		var m = y(u);
		if (m) return m;
		throw new Error(`Non-${e} character`);
	}
	return {
		encode: p,
		decodeUnsafe: y,
		decode: w
	};
}
function Qr(r) {
	return r.reduce((e, t) => (e += Xr[t], e), "");
}
function en(r) {
	const e = [];
	for (const t of r) {
		const i = Zr[t.codePointAt(0)];
		if (i === void 0) throw new Error(`Non-base256emoji character: ${t}`);
		e.push(i);
	}
	return new Uint8Array(e);
}
function hi(r, e, t) {
	e = e || [], t = t || 0;
	for (var i = t; r >= an;) e[t++] = r & 255 | ci, r /= 128;
	for (; r & on;) e[t++] = r & 255 | ci, r >>>= 7;
	return e[t] = r | 0, hi.bytes = t - i + 1, e;
}
function Ve(r, i) {
	var t = 0, i = i || 0, s = 0, n = i, o, a = r.length;
	do {
		if (n >= a) throw Ve.bytes = 0, /* @__PURE__ */ new RangeError("Could not decode varint");
		o = r[n++], t += s < 28 ? (o & li) << s : (o & li) * Math.pow(2, s), s += 7;
	} while (o >= hn);
	return Ve.bytes = n - i, t;
}
function Di(r) {
	return globalThis.Buffer != null ? new Uint8Array(r.buffer, r.byteOffset, r.byteLength) : r;
}
function Rn(r = 0) {
	return globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null ? Di(globalThis.Buffer.allocUnsafe(r)) : new Uint8Array(r);
}
function vi(r, e, t, i) {
	return {
		name: r,
		prefix: e,
		encoder: {
			name: r,
			prefix: e,
			encode: t
		},
		decoder: { decode: i }
	};
}
function xn(r, e = "utf8") {
	const t = An[e];
	if (!t) throw new Error(`Unsupported encoding "${e}"`);
	return (e === "utf8" || e === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? Di(globalThis.Buffer.from(r, "utf-8")) : t.decoder.decode(`${t.prefix}${r}`);
}
function ao(r, e) {
	return r === e || Number.isNaN(r) && Number.isNaN(e);
}
function Ni(r) {
	return Object.getOwnPropertySymbols(r).filter((e) => Object.prototype.propertyIsEnumerable.call(r, e));
}
function $i(r) {
	return r == null ? r === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(r);
}
function No() {}
function Li(r) {
	if (!r || typeof r != "object") return !1;
	const e = Object.getPrototypeOf(r);
	return e === null || e === Object.prototype || Object.getPrototypeOf(e) === null ? Object.prototype.toString.call(r) === "[object Object]" : !1;
}
function $o(r, e, t) {
	return De(r, e, void 0, void 0, void 0, void 0, t);
}
function De(r, e, t, i, s, n, o) {
	const a = o(r, e, t, i, s, n);
	if (a !== void 0) return a;
	if (typeof r == typeof e) switch (typeof r) {
		case "bigint":
		case "string":
		case "boolean":
		case "symbol":
		case "undefined": return r === e;
		case "number": return r === e || Object.is(r, e);
		case "function": return r === e;
		case "object": return ve(r, e, n, o);
	}
	return ve(r, e, n, o);
}
function ve(r, e, t, i) {
	if (Object.is(r, e)) return !0;
	let s = $i(r), n = $i(e);
	if (s === zi && (s = Ze), n === zi && (n = Ze), s !== n) return !1;
	switch (s) {
		case ho: return r.toString() === e.toString();
		case lo: return ao(r.valueOf(), e.valueOf());
		case uo:
		case po:
		case go: return Object.is(r.valueOf(), e.valueOf());
		case co: return r.source === e.source && r.flags === e.flags;
		case fo: return r === e;
	}
	t = t ?? /* @__PURE__ */ new Map();
	const o = t.get(r), a = t.get(e);
	if (o != null && a != null) return o === e;
	t.set(r, e), t.set(e, r);
	try {
		switch (s) {
			case yo:
				if (r.size !== e.size) return !1;
				for (const [c, h] of r.entries()) if (!e.has(c) || !De(h, e.get(c), c, r, e, t, i)) return !1;
				return !0;
			case bo: {
				if (r.size !== e.size) return !1;
				const c = Array.from(r.values()), h = Array.from(e.values());
				for (let l = 0; l < c.length; l++) {
					const p = c[l], y = h.findIndex((w) => De(p, w, void 0, r, e, t, i));
					if (y === -1) return !1;
					h.splice(y, 1);
				}
				return !0;
			}
			case mo:
			case _o:
			case Eo:
			case Io:
			case To:
			case Co:
			case Po:
			case So:
			case Oo:
			case Ro:
			case Ao:
			case xo:
				if (typeof Buffer < "u" && Buffer.isBuffer(r) !== Buffer.isBuffer(e) || r.length !== e.length) return !1;
				for (let c = 0; c < r.length; c++) if (!De(r[c], e[c], c, r, e, t, i)) return !1;
				return !0;
			case Do: return r.byteLength !== e.byteLength ? !1 : ve(new Uint8Array(r), new Uint8Array(e), t, i);
			case wo: return r.byteLength !== e.byteLength || r.byteOffset !== e.byteOffset ? !1 : ve(new Uint8Array(r), new Uint8Array(e), t, i);
			case vo: return r.name === e.name && r.message === e.message;
			case Ze: {
				if (!(ve(r.constructor, e.constructor, t, i) || Li(r) && Li(e))) return !1;
				const h = [...Object.keys(r), ...Ni(r)], l = [...Object.keys(e), ...Ni(e)];
				if (h.length !== l.length) return !1;
				for (let p = 0; p < h.length; p++) {
					const y = h[p], w = r[y];
					if (!Object.hasOwn(e, y)) return !1;
					const u = e[y];
					if (!De(w, u, y, r, e, t, i)) return !1;
				}
				return !0;
			}
			default: return !1;
		}
	} finally {
		t.delete(r), t.delete(e);
	}
}
function zo(r, e) {
	return $o(r, e, No);
}
var import_cjs, import_cjs$1, pe, W, It, Tt, Ct, Me, Pt, St, Rt, xt, Nt, Lt, C, M, Pe, ee, ye, Ft, U, Mt, Bt, oe, ae, V, qt, Wt, q, Yt, ir, Jt, be, Xt, Zt, Qt, ei, Y, X, rr, nr, or, ar, ti, ii, ri, lr, ni, ur, dr, gr, pr, yr, oi, br, Se, me, mr, fr, A, Dr, vr, wr, _r, Er, Ir, Tr, Cr, Pr, Sr, Or, Rr, Ar, xr, Nr, $r, zr, Lr, kr, jr, Ur, Fr, Mr, Kr, Br, Vr, qr, Gr, Wr, Hr, Yr, Jr, ai, Xr, Zr, tn, sn, rn, ci, on, an, cn, hn, li, ln, un, dn, gn, pn, yn, bn, mn, fn, Dn, ui, di, gi, qe, wn, pi, _n, yi, En, In, Tn, bi, Cn, mi, Pn, On, fi, wi, Ge, An, Nn, $n, J, _i, zn, Ln, x, Ei, kn, jn, Un, Ii, Fn, Mn, We, Kn, Bn, K, Ti, Vn, qn, Gn, Ci, Wn, Hn, He, ce, Pi, G, Yn, Jn, Xn, he, Zn, Qn, eo, to, Si, io, so, Ye, fe, Je, f, Oi, ro, Ri, no, oo, Xe, Ai, g, xi, co, ho, lo, uo, zi, go, po, yo, bo, mo, fo, Do, Ze, vo, wo, _o, Eo, Io, To, Co, Po, So, Oo, Ro, Ao, xo, Lo, ki, ko, jo, Qe, ji, F, Ui, Uo, Fo, d, Fi, Mo, Ko, N, Mi, Bo, Vo, z, Ki, qo, Go, P, Bi, Wo, Ho, Vi, qi, Yo, Gi, Jo, Xo, et, we, R, Wi, Zo, Hi, Qo, ea, tt, Yi, v, Oe, ta;
var init_index_es = __esmMin((() => {
	init_index_es$10();
	init_index_es$9();
	init_index_es$8();
	init_index_es$7();
	import_cjs = require_cjs$3();
	init_esm$3();
	init_index_es$6();
	init_index_es$4();
	init_src();
	init_index_es$2();
	init_esm();
	init_index_es$1();
	import_cjs$1 = require_cjs$2();
	pe = "core", W = `wc@2:${pe}:`, It = {
		name: pe,
		logger: "error"
	}, Tt = { database: ":memory:" }, Ct = "crypto", Me = "client_ed25519_seed", Pt = import_cjs.ONE_DAY, St = "keychain", Rt = "messages", xt = import_cjs.SIX_HOURS, Nt = "publisher", Lt = "relayer", C = {
		message: "relayer_message",
		message_ack: "relayer_message_ack",
		connect: "relayer_connect",
		disconnect: "relayer_disconnect",
		error: "relayer_error",
		connection_stalled: "relayer_connection_stalled",
		transport_closed: "relayer_transport_closed",
		publish: "relayer_publish"
	}, M = {
		payload: "payload",
		connect: "connect",
		disconnect: "disconnect",
		error: "error"
	}, Pe = "2.21.8", ee = {
		link_mode: "link_mode",
		relay: "relay"
	}, ye = {
		inbound: "inbound",
		outbound: "outbound"
	}, Ft = "WALLETCONNECT_CLIENT_ID", U = {
		created: "subscription_created",
		deleted: "subscription_deleted",
		expired: "subscription_expired",
		disabled: "subscription_disabled",
		sync: "subscription_sync",
		resubscribed: "subscription_resubscribed"
	}, import_cjs.THIRTY_DAYS, Mt = "subscription", import_cjs.FIVE_SECONDS * 1e3, Bt = "pairing", import_cjs.THIRTY_DAYS, oe = {
		wc_pairingDelete: {
			req: {
				ttl: import_cjs.ONE_DAY,
				prompt: !1,
				tag: 1e3
			},
			res: {
				ttl: import_cjs.ONE_DAY,
				prompt: !1,
				tag: 1001
			}
		},
		wc_pairingPing: {
			req: {
				ttl: import_cjs.THIRTY_SECONDS,
				prompt: !1,
				tag: 1002
			},
			res: {
				ttl: import_cjs.THIRTY_SECONDS,
				prompt: !1,
				tag: 1003
			}
		},
		unregistered_method: {
			req: {
				ttl: import_cjs.ONE_DAY,
				prompt: !1,
				tag: 0
			},
			res: {
				ttl: import_cjs.ONE_DAY,
				prompt: !1,
				tag: 0
			}
		}
	}, ae = {
		create: "pairing_create",
		expire: "pairing_expire",
		delete: "pairing_delete",
		ping: "pairing_ping"
	}, V = {
		created: "history_created",
		updated: "history_updated",
		deleted: "history_deleted",
		sync: "history_sync"
	}, qt = "history", Wt = "expirer", q = {
		created: "expirer_created",
		deleted: "expirer_deleted",
		expired: "expirer_expired",
		sync: "expirer_sync"
	}, import_cjs.ONE_DAY, Yt = "verify-api", ir = "https://verify.walletconnect.com", Jt = "https://verify.walletconnect.org", be = Jt, Xt = `${be}/v3`, Zt = [ir, Jt], Qt = "echo", ei = "https://echo.walletconnect.com", Y = {
		pairing_started: "pairing_started",
		pairing_uri_validation_success: "pairing_uri_validation_success",
		pairing_uri_not_expired: "pairing_uri_not_expired",
		store_new_pairing: "store_new_pairing",
		subscribing_pairing_topic: "subscribing_pairing_topic",
		subscribe_pairing_topic_success: "subscribe_pairing_topic_success",
		existing_pairing: "existing_pairing",
		pairing_not_expired: "pairing_not_expired",
		emit_inactive_pairing: "emit_inactive_pairing",
		emit_session_proposal: "emit_session_proposal",
		subscribing_to_pairing_topic: "subscribing_to_pairing_topic"
	}, X = {
		no_wss_connection: "no_wss_connection",
		no_internet_connection: "no_internet_connection",
		malformed_pairing_uri: "malformed_pairing_uri",
		active_pairing_already_exists: "active_pairing_already_exists",
		subscribe_pairing_topic_failure: "subscribe_pairing_topic_failure",
		pairing_expired: "pairing_expired",
		proposal_expired: "proposal_expired",
		proposal_listener_not_found: "proposal_listener_not_found"
	}, rr = {
		session_approve_started: "session_approve_started",
		proposal_not_expired: "proposal_not_expired",
		session_namespaces_validation_success: "session_namespaces_validation_success",
		create_session_topic: "create_session_topic",
		subscribing_session_topic: "subscribing_session_topic",
		subscribe_session_topic_success: "subscribe_session_topic_success",
		publishing_session_approve: "publishing_session_approve",
		session_approve_publish_success: "session_approve_publish_success",
		store_session: "store_session",
		publishing_session_settle: "publishing_session_settle",
		session_settle_publish_success: "session_settle_publish_success"
	}, nr = {
		no_internet_connection: "no_internet_connection",
		no_wss_connection: "no_wss_connection",
		proposal_expired: "proposal_expired",
		subscribe_session_topic_failure: "subscribe_session_topic_failure",
		session_approve_publish_failure: "session_approve_publish_failure",
		session_settle_publish_failure: "session_settle_publish_failure",
		session_approve_namespace_validation_failure: "session_approve_namespace_validation_failure",
		proposal_not_found: "proposal_not_found"
	}, or = {
		authenticated_session_approve_started: "authenticated_session_approve_started",
		authenticated_session_not_expired: "authenticated_session_not_expired",
		chains_caip2_compliant: "chains_caip2_compliant",
		chains_evm_compliant: "chains_evm_compliant",
		create_authenticated_session_topic: "create_authenticated_session_topic",
		cacaos_verified: "cacaos_verified",
		store_authenticated_session: "store_authenticated_session",
		subscribing_authenticated_session_topic: "subscribing_authenticated_session_topic",
		subscribe_authenticated_session_topic_success: "subscribe_authenticated_session_topic_success",
		publishing_authenticated_session_approve: "publishing_authenticated_session_approve",
		authenticated_session_approve_publish_success: "authenticated_session_approve_publish_success"
	}, ar = {
		no_internet_connection: "no_internet_connection",
		no_wss_connection: "no_wss_connection",
		missing_session_authenticate_request: "missing_session_authenticate_request",
		session_authenticate_request_expired: "session_authenticate_request_expired",
		chains_caip2_compliant_failure: "chains_caip2_compliant_failure",
		chains_evm_compliant_failure: "chains_evm_compliant_failure",
		invalid_cacao: "invalid_cacao",
		subscribe_authenticated_session_topic_failure: "subscribe_authenticated_session_topic_failure",
		authenticated_session_approve_publish_failure: "authenticated_session_approve_publish_failure",
		authenticated_session_pending_request_not_found: "authenticated_session_pending_request_not_found"
	}, ti = .1, ii = "event-client", ri = "https://pulse.walletconnect.org/batch";
	lr = cr;
	ni = (r) => {
		if (r instanceof Uint8Array && r.constructor.name === "Uint8Array") return r;
		if (r instanceof ArrayBuffer) return new Uint8Array(r);
		if (ArrayBuffer.isView(r)) return new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
		throw new Error("Unknown type, must be binary type");
	}, ur = (r) => new TextEncoder().encode(r), dr = (r) => new TextDecoder().decode(r);
	gr = class {
		constructor(e, t, i) {
			this.name = e, this.prefix = t, this.baseEncode = i;
		}
		encode(e) {
			if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
			throw Error("Unknown type, must be binary type");
		}
	};
	pr = class {
		constructor(e, t, i) {
			if (this.name = e, this.prefix = t, t.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
			this.prefixCodePoint = t.codePointAt(0), this.baseDecode = i;
		}
		decode(e) {
			if (typeof e == "string") {
				if (e.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
				return this.baseDecode(e.slice(this.prefix.length));
			} else throw Error("Can only multibase decode strings");
		}
		or(e) {
			return oi(this, e);
		}
	};
	yr = class {
		constructor(e) {
			this.decoders = e;
		}
		or(e) {
			return oi(this, e);
		}
		decode(e) {
			const t = e[0], i = this.decoders[t];
			if (i) return i.decode(e);
			throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
		}
	};
	oi = (r, e) => new yr({
		...r.decoders || { [r.prefix]: r },
		...e.decoders || { [e.prefix]: e }
	});
	br = class {
		constructor(e, t, i, s) {
			this.name = e, this.prefix = t, this.baseEncode = i, this.baseDecode = s, this.encoder = new gr(e, t, i), this.decoder = new pr(e, t, s);
		}
		encode(e) {
			return this.encoder.encode(e);
		}
		decode(e) {
			return this.decoder.decode(e);
		}
	};
	Se = ({ name: r, prefix: e, encode: t, decode: i }) => new br(r, e, t, i), me = ({ prefix: r, name: e, alphabet: t }) => {
		const { encode: i, decode: s } = lr(t, e);
		return Se({
			prefix: r,
			name: e,
			encode: i,
			decode: (n) => ni(s(n))
		});
	}, mr = (r, e, t, i) => {
		const s = {};
		for (let l = 0; l < e.length; ++l) s[e[l]] = l;
		let n = r.length;
		for (; r[n - 1] === "=";) --n;
		const o = new Uint8Array(n * t / 8 | 0);
		let a = 0, c = 0, h = 0;
		for (let l = 0; l < n; ++l) {
			const p = s[r[l]];
			if (p === void 0) throw new SyntaxError(`Non-${i} character`);
			c = c << t | p, a += t, a >= 8 && (a -= 8, o[h++] = 255 & c >> a);
		}
		if (a >= t || 255 & c << 8 - a) throw new SyntaxError("Unexpected end of data");
		return o;
	}, fr = (r, e, t) => {
		const i = e[e.length - 1] === "=", s = (1 << t) - 1;
		let n = "", o = 0, a = 0;
		for (let c = 0; c < r.length; ++c) for (a = a << 8 | r[c], o += 8; o > t;) o -= t, n += e[s & a >> o];
		if (o && (n += e[s & a << t - o]), i) for (; n.length * t & 7;) n += "=";
		return n;
	}, A = ({ name: r, prefix: e, bitsPerChar: t, alphabet: i }) => Se({
		prefix: e,
		name: r,
		encode(s) {
			return fr(s, i, t);
		},
		decode(s) {
			return mr(s, i, t, r);
		}
	}), Dr = Se({
		prefix: "\0",
		name: "identity",
		encode: (r) => dr(r),
		decode: (r) => ur(r)
	});
	vr = Object.freeze({
		__proto__: null,
		identity: Dr
	});
	wr = A({
		prefix: "0",
		name: "base2",
		alphabet: "01",
		bitsPerChar: 1
	});
	_r = Object.freeze({
		__proto__: null,
		base2: wr
	});
	Er = A({
		prefix: "7",
		name: "base8",
		alphabet: "01234567",
		bitsPerChar: 3
	});
	Ir = Object.freeze({
		__proto__: null,
		base8: Er
	});
	Tr = me({
		prefix: "9",
		name: "base10",
		alphabet: "0123456789"
	});
	Cr = Object.freeze({
		__proto__: null,
		base10: Tr
	});
	Pr = A({
		prefix: "f",
		name: "base16",
		alphabet: "0123456789abcdef",
		bitsPerChar: 4
	}), Sr = A({
		prefix: "F",
		name: "base16upper",
		alphabet: "0123456789ABCDEF",
		bitsPerChar: 4
	});
	Or = Object.freeze({
		__proto__: null,
		base16: Pr,
		base16upper: Sr
	});
	Rr = A({
		prefix: "b",
		name: "base32",
		alphabet: "abcdefghijklmnopqrstuvwxyz234567",
		bitsPerChar: 5
	}), Ar = A({
		prefix: "B",
		name: "base32upper",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
		bitsPerChar: 5
	}), xr = A({
		prefix: "c",
		name: "base32pad",
		alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
		bitsPerChar: 5
	}), Nr = A({
		prefix: "C",
		name: "base32padupper",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
		bitsPerChar: 5
	}), $r = A({
		prefix: "v",
		name: "base32hex",
		alphabet: "0123456789abcdefghijklmnopqrstuv",
		bitsPerChar: 5
	}), zr = A({
		prefix: "V",
		name: "base32hexupper",
		alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
		bitsPerChar: 5
	}), Lr = A({
		prefix: "t",
		name: "base32hexpad",
		alphabet: "0123456789abcdefghijklmnopqrstuv=",
		bitsPerChar: 5
	}), kr = A({
		prefix: "T",
		name: "base32hexpadupper",
		alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
		bitsPerChar: 5
	}), jr = A({
		prefix: "h",
		name: "base32z",
		alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
		bitsPerChar: 5
	});
	Ur = Object.freeze({
		__proto__: null,
		base32: Rr,
		base32upper: Ar,
		base32pad: xr,
		base32padupper: Nr,
		base32hex: $r,
		base32hexupper: zr,
		base32hexpad: Lr,
		base32hexpadupper: kr,
		base32z: jr
	});
	Fr = me({
		prefix: "k",
		name: "base36",
		alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
	}), Mr = me({
		prefix: "K",
		name: "base36upper",
		alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	});
	Kr = Object.freeze({
		__proto__: null,
		base36: Fr,
		base36upper: Mr
	});
	Br = me({
		name: "base58btc",
		prefix: "z",
		alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
	}), Vr = me({
		name: "base58flickr",
		prefix: "Z",
		alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
	});
	qr = Object.freeze({
		__proto__: null,
		base58btc: Br,
		base58flickr: Vr
	});
	Gr = A({
		prefix: "m",
		name: "base64",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
		bitsPerChar: 6
	}), Wr = A({
		prefix: "M",
		name: "base64pad",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		bitsPerChar: 6
	}), Hr = A({
		prefix: "u",
		name: "base64url",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
		bitsPerChar: 6
	}), Yr = A({
		prefix: "U",
		name: "base64urlpad",
		alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
		bitsPerChar: 6
	});
	Jr = Object.freeze({
		__proto__: null,
		base64: Gr,
		base64pad: Wr,
		base64url: Hr,
		base64urlpad: Yr
	});
	ai = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), Xr = ai.reduce((r, e, t) => (r[t] = e, r), []), Zr = ai.reduce((r, e, t) => (r[e.codePointAt(0)] = t, r), []);
	tn = Se({
		prefix: "🚀",
		name: "base256emoji",
		encode: Qr,
		decode: en
	});
	sn = Object.freeze({
		__proto__: null,
		base256emoji: tn
	}), rn = hi, ci = 128, on = -128, an = Math.pow(2, 31);
	cn = Ve, hn = 128, li = 127;
	ln = Math.pow(2, 7), un = Math.pow(2, 14), dn = Math.pow(2, 21), gn = Math.pow(2, 28), pn = Math.pow(2, 35), yn = Math.pow(2, 42), bn = Math.pow(2, 49), mn = Math.pow(2, 56), fn = Math.pow(2, 63), Dn = function(r) {
		return r < ln ? 1 : r < un ? 2 : r < dn ? 3 : r < gn ? 4 : r < pn ? 5 : r < yn ? 6 : r < bn ? 7 : r < mn ? 8 : r < fn ? 9 : 10;
	}, ui = {
		encode: rn,
		decode: cn,
		encodingLength: Dn
	};
	di = (r, e, t = 0) => (ui.encode(r, e, t), e), gi = (r) => ui.encodingLength(r), qe = (r, e) => {
		const t = e.byteLength, i = gi(r), s = i + gi(t), n = new Uint8Array(s + t);
		return di(r, n, 0), di(t, n, i), n.set(e, s), new wn(r, t, e, n);
	};
	wn = class {
		constructor(e, t, i, s) {
			this.code = e, this.size = t, this.digest = i, this.bytes = s;
		}
	};
	pi = ({ name: r, code: e, encode: t }) => new _n(r, e, t);
	_n = class {
		constructor(e, t, i) {
			this.name = e, this.code = t, this.encode = i;
		}
		digest(e) {
			if (e instanceof Uint8Array) {
				const t = this.encode(e);
				return t instanceof Uint8Array ? qe(this.code, t) : t.then((i) => qe(this.code, i));
			} else throw Error("Unknown type, must be binary type");
		}
	};
	yi = (r) => async (e) => new Uint8Array(await crypto.subtle.digest(r, e)), En = pi({
		name: "sha2-256",
		code: 18,
		encode: yi("SHA-256")
	}), In = pi({
		name: "sha2-512",
		code: 19,
		encode: yi("SHA-512")
	});
	Tn = Object.freeze({
		__proto__: null,
		sha256: En,
		sha512: In
	});
	bi = 0, Cn = "identity", mi = ni, Pn = (r) => qe(bi, mi(r));
	On = Object.freeze({
		__proto__: null,
		identity: {
			code: bi,
			name: Cn,
			encode: mi,
			digest: Pn
		}
	});
	new TextEncoder(), new TextDecoder();
	fi = {
		...vr,
		..._r,
		...Ir,
		...Cr,
		...Or,
		...Ur,
		...Kr,
		...qr,
		...Jr,
		...sn
	};
	({
		...Tn,
		...On
	});
	wi = vi("utf8", "u", (r) => "u" + new TextDecoder("utf8").decode(r), (r) => new TextEncoder().encode(r.substring(1))), Ge = vi("ascii", "a", (r) => {
		let e = "a";
		for (let t = 0; t < r.length; t++) e += String.fromCharCode(r[t]);
		return e;
	}, (r) => {
		r = r.substring(1);
		const e = Rn(r.length);
		for (let t = 0; t < r.length; t++) e[t] = r.charCodeAt(t);
		return e;
	}), An = {
		utf8: wi,
		"utf-8": wi,
		hex: fi.base16,
		latin1: Ge,
		ascii: Ge,
		binary: Ge,
		...fi
	};
	Nn = Object.defineProperty, $n = (r, e, t) => e in r ? Nn(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, J = (r, e, t) => $n(r, typeof e != "symbol" ? e + "" : e, t);
	_i = class {
		constructor(e, t) {
			this.core = e, this.logger = t, J(this, "keychain", /* @__PURE__ */ new Map()), J(this, "name", St), J(this, "version", "0.3"), J(this, "initialized", !1), J(this, "storagePrefix", W), J(this, "init", async () => {
				if (!this.initialized) {
					const i = await this.getKeyChain();
					typeof i < "u" && (this.keychain = i), this.initialized = !0;
				}
			}), J(this, "has", (i) => (this.isInitialized(), this.keychain.has(i))), J(this, "set", async (i, s) => {
				this.isInitialized(), this.keychain.set(i, s), await this.persist();
			}), J(this, "get", (i) => {
				this.isInitialized();
				const s = this.keychain.get(i);
				if (typeof s > "u") {
					const { message: n } = Et("NO_MATCHING_KEY", `${this.name}: ${i}`);
					throw new Error(n);
				}
				return s;
			}), J(this, "del", async (i) => {
				this.isInitialized(), this.keychain.delete(i), await this.persist();
			}), this.core = e, this.logger = E(t, this.name);
		}
		get context() {
			return y$1(this.logger);
		}
		get storageKey() {
			return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
		}
		async setKeyChain(e) {
			await this.core.storage.setItem(this.storageKey, Ys$1(e));
		}
		async getKeyChain() {
			const e = await this.core.storage.getItem(this.storageKey);
			return typeof e < "u" ? Xs$1(e) : void 0;
		}
		async persist() {
			await this.setKeyChain(this.keychain);
		}
		isInitialized() {
			if (!this.initialized) {
				const { message: e } = Et("NOT_INITIALIZED", this.name);
				throw new Error(e);
			}
		}
	};
	zn = Object.defineProperty, Ln = (r, e, t) => e in r ? zn(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, x = (r, e, t) => Ln(r, typeof e != "symbol" ? e + "" : e, t);
	Ei = class {
		constructor(e, t, i) {
			this.core = e, this.logger = t, x(this, "name", Ct), x(this, "keychain"), x(this, "randomSessionIdentifier", qc()), x(this, "initialized", !1), x(this, "init", async () => {
				this.initialized || (await this.keychain.init(), this.initialized = !0);
			}), x(this, "hasKeys", (s) => (this.isInitialized(), this.keychain.has(s))), x(this, "getClientId", async () => {
				this.isInitialized();
				return Qe$2(Po$2(await this.getClientSeed()).publicKey);
			}), x(this, "generateKeyPair", () => {
				this.isInitialized();
				const s = Vc();
				return this.setPrivateKey(s.publicKey, s.privateKey);
			}), x(this, "signJWT", async (s) => {
				this.isInitialized();
				const o = Po$2(await this.getClientSeed()), a = this.randomSessionIdentifier;
				return await Qo$2(a, s, Pt, o);
			}), x(this, "generateSharedKey", (s, n, o) => {
				this.isInitialized();
				const c = Kc(this.getPrivateKey(s), n);
				return this.setSymKey(c, o);
			}), x(this, "setSymKey", async (s, n) => {
				this.isInitialized();
				const o = n || Fc(s);
				return await this.keychain.set(o, s), o;
			}), x(this, "deleteKeyPair", async (s) => {
				this.isInitialized(), await this.keychain.del(s);
			}), x(this, "deleteSymKey", async (s) => {
				this.isInitialized(), await this.keychain.del(s);
			}), x(this, "encode", async (s, n, o) => {
				this.isInitialized();
				const a = Ho$1(o), c = safeJsonStringify(n);
				if (Qc(a)) return Wc(c, o?.encoding);
				if (Jc(a)) {
					const y = a.senderPublicKey, w = a.receiverPublicKey;
					s = await this.generateSharedKey(y, w);
				}
				const h = this.getSymKey(s), { type: l, senderPublicKey: p } = a;
				return Gc({
					type: l,
					symKey: h,
					message: c,
					senderPublicKey: p,
					encoding: o?.encoding
				});
			}), x(this, "decode", async (s, n, o) => {
				this.isInitialized();
				const a = Xc(n, o);
				if (Qc(a)) return safeJsonParse(Yc(n, o?.encoding));
				if (Jc(a)) {
					const c = a.receiverPublicKey, h = a.senderPublicKey;
					s = await this.generateSharedKey(c, h);
				}
				try {
					return safeJsonParse(Zc({
						symKey: this.getSymKey(s),
						encoded: n,
						encoding: o?.encoding
					}));
				} catch (c) {
					this.logger.error(`Failed to decode message from topic: '${s}', clientId: '${await this.getClientId()}'`), this.logger.error(c);
				}
			}), x(this, "getPayloadType", (s, n = Qt$1) => {
				return Vt$1(Me$1({
					encoded: s,
					encoding: n
				}).type);
			}), x(this, "getPayloadSenderPublicKey", (s, n = Qt$1) => {
				const o = Me$1({
					encoded: s,
					encoding: n
				});
				return o.senderPublicKey ? toString(o.senderPublicKey, tt$1) : void 0;
			}), this.core = e, this.logger = E(t, this.name), this.keychain = i || new _i(this.core, this.logger);
		}
		get context() {
			return y$1(this.logger);
		}
		async setPrivateKey(e, t) {
			return await this.keychain.set(e, t), e;
		}
		getPrivateKey(e) {
			return this.keychain.get(e);
		}
		async getClientSeed() {
			let e = "";
			try {
				e = this.keychain.get(Me);
			} catch {
				e = qc(), await this.keychain.set(Me, e);
			}
			return xn(e, "base16");
		}
		getSymKey(e) {
			return this.keychain.get(e);
		}
		isInitialized() {
			if (!this.initialized) {
				const { message: e } = Et("NOT_INITIALIZED", this.name);
				throw new Error(e);
			}
		}
	};
	kn = Object.defineProperty, jn = Object.defineProperties, Un = Object.getOwnPropertyDescriptors, Ii = Object.getOwnPropertySymbols, Fn = Object.prototype.hasOwnProperty, Mn = Object.prototype.propertyIsEnumerable, We = (r, e, t) => e in r ? kn(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, Kn = (r, e) => {
		for (var t in e || (e = {})) Fn.call(e, t) && We(r, t, e[t]);
		if (Ii) for (var t of Ii(e)) Mn.call(e, t) && We(r, t, e[t]);
		return r;
	}, Bn = (r, e) => jn(r, Un(e)), K = (r, e, t) => We(r, typeof e != "symbol" ? e + "" : e, t);
	Ti = class extends y {
		constructor(e, t) {
			super(e, t), this.logger = e, this.core = t, K(this, "messages", /* @__PURE__ */ new Map()), K(this, "messagesWithoutClientAck", /* @__PURE__ */ new Map()), K(this, "name", Rt), K(this, "version", "0.3"), K(this, "initialized", !1), K(this, "storagePrefix", W), K(this, "init", async () => {
				if (!this.initialized) {
					this.logger.trace("Initialized");
					try {
						const i = await this.getRelayerMessages();
						typeof i < "u" && (this.messages = i);
						const s = await this.getRelayerMessagesWithoutClientAck();
						typeof s < "u" && (this.messagesWithoutClientAck = s), this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({
							type: "method",
							method: "restore",
							size: this.messages.size
						});
					} catch (i) {
						this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(i);
					} finally {
						this.initialized = !0;
					}
				}
			}), K(this, "set", async (i, s, n) => {
				this.isInitialized();
				const o = zc(s);
				let a = this.messages.get(i);
				if (typeof a > "u" && (a = {}), typeof a[o] < "u") return o;
				if (a[o] = s, this.messages.set(i, a), n === ye.inbound) {
					const c = this.messagesWithoutClientAck.get(i) || {};
					this.messagesWithoutClientAck.set(i, Bn(Kn({}, c), { [o]: s }));
				}
				return await this.persist(), o;
			}), K(this, "get", (i) => {
				this.isInitialized();
				let s = this.messages.get(i);
				return typeof s > "u" && (s = {}), s;
			}), K(this, "getWithoutAck", (i) => {
				this.isInitialized();
				const s = {};
				for (const n of i) {
					const o = this.messagesWithoutClientAck.get(n) || {};
					s[n] = Object.values(o);
				}
				return s;
			}), K(this, "has", (i, s) => {
				this.isInitialized();
				return typeof this.get(i)[zc(s)] < "u";
			}), K(this, "ack", async (i, s) => {
				this.isInitialized();
				const n = this.messagesWithoutClientAck.get(i);
				if (typeof n > "u") return;
				const o = zc(s);
				delete n[o], Object.keys(n).length === 0 ? this.messagesWithoutClientAck.delete(i) : this.messagesWithoutClientAck.set(i, n), await this.persist();
			}), K(this, "del", async (i) => {
				this.isInitialized(), this.messages.delete(i), this.messagesWithoutClientAck.delete(i), await this.persist();
			}), this.logger = E(e, this.name), this.core = t;
		}
		get context() {
			return y$1(this.logger);
		}
		get storageKey() {
			return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
		}
		get storageKeyWithoutClientAck() {
			return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name + "_withoutClientAck";
		}
		async setRelayerMessages(e) {
			await this.core.storage.setItem(this.storageKey, Ys$1(e));
		}
		async setRelayerMessagesWithoutClientAck(e) {
			await this.core.storage.setItem(this.storageKeyWithoutClientAck, Ys$1(e));
		}
		async getRelayerMessages() {
			const e = await this.core.storage.getItem(this.storageKey);
			return typeof e < "u" ? Xs$1(e) : void 0;
		}
		async getRelayerMessagesWithoutClientAck() {
			const e = await this.core.storage.getItem(this.storageKeyWithoutClientAck);
			return typeof e < "u" ? Xs$1(e) : void 0;
		}
		async persist() {
			await this.setRelayerMessages(this.messages), await this.setRelayerMessagesWithoutClientAck(this.messagesWithoutClientAck);
		}
		isInitialized() {
			if (!this.initialized) {
				const { message: e } = Et("NOT_INITIALIZED", this.name);
				throw new Error(e);
			}
		}
	};
	Vn = Object.defineProperty, qn = Object.defineProperties, Gn = Object.getOwnPropertyDescriptors, Ci = Object.getOwnPropertySymbols, Wn = Object.prototype.hasOwnProperty, Hn = Object.prototype.propertyIsEnumerable, He = (r, e, t) => e in r ? Vn(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, ce = (r, e) => {
		for (var t in e || (e = {})) Wn.call(e, t) && He(r, t, e[t]);
		if (Ci) for (var t of Ci(e)) Hn.call(e, t) && He(r, t, e[t]);
		return r;
	}, Pi = (r, e) => qn(r, Gn(e)), G = (r, e, t) => He(r, typeof e != "symbol" ? e + "" : e, t);
	Yn = class extends m {
		constructor(e, t) {
			super(e, t), this.relayer = e, this.logger = t, G(this, "events", new EventEmitter()), G(this, "name", Nt), G(this, "queue", /* @__PURE__ */ new Map()), G(this, "publishTimeout", (0, import_cjs.toMiliseconds)(import_cjs.ONE_MINUTE)), G(this, "initialPublishTimeout", (0, import_cjs.toMiliseconds)(import_cjs.ONE_SECOND * 15)), G(this, "needsTransportRestart", !1), G(this, "publish", async (i, s, n) => {
				var o, a, c, h, l;
				this.logger.debug("Publishing Payload"), this.logger.trace({
					type: "method",
					method: "publish",
					params: {
						topic: i,
						message: s,
						opts: n
					}
				});
				const p = n?.ttl || xt, y = n?.prompt || !1, w = n?.tag || 0, u = n?.id || getBigIntRpcId().toString(), m = na(ea$1().protocol), D = {
					id: u,
					method: n?.publishMethod || m.publish,
					params: ce({
						topic: i,
						message: s,
						ttl: p,
						prompt: y,
						tag: w,
						attestation: n?.attestation
					}, n?.tvf && { tvf: n.tvf })
				}, _ = `Failed to publish payload, please try again. id:${u} tag:${w}`;
				try {
					kt$1((o = D.params) == null ? void 0 : o.prompt) && ((a = D.params) == null || delete a.prompt), kt$1((c = D.params) == null ? void 0 : c.tag) && ((h = D.params) == null || delete h.tag);
					const E = new Promise(async (L) => {
						const I = ({ id: T }) => {
							var S;
							((S = D.id) == null ? void 0 : S.toString()) === T.toString() && (this.removeRequestFromQueue(T), this.relayer.events.removeListener(C.publish, I), L());
						};
						this.relayer.events.on(C.publish, I);
						const k = ni$1(new Promise((T, S) => {
							this.rpcPublish(D, n).then(T).catch((O) => {
								this.logger.warn(O, O?.message), S(O);
							});
						}), this.initialPublishTimeout, `Failed initial publish, retrying.... id:${u} tag:${w}`);
						try {
							await k, this.events.removeListener(C.publish, I);
						} catch (T) {
							this.queue.set(u, {
								request: D,
								opts: n,
								attempt: 1
							}), this.logger.warn(T, T?.message);
						}
					});
					this.logger.trace({
						type: "method",
						method: "publish",
						params: {
							id: u,
							topic: i,
							message: s,
							opts: n
						}
					}), await ni$1(E, this.publishTimeout, _);
				} catch (E) {
					if (this.logger.debug("Failed to Publish Payload"), this.logger.error(E), (l = n?.internal) != null && l.throwOnFailedPublish) throw E;
				} finally {
					this.queue.delete(u);
				}
			}), G(this, "publishCustom", async (i) => {
				var s, n, o, a, c;
				this.logger.debug("Publishing custom payload"), this.logger.trace({
					type: "method",
					method: "publishCustom",
					params: i
				});
				const { payload: h, opts: l = {} } = i, { attestation: p, tvf: y, publishMethod: w, prompt: u, tag: m, ttl: D = import_cjs.FIVE_MINUTES } = l, _ = l.id || getBigIntRpcId().toString(), E = na(ea$1().protocol), L = w || E.publish, I = {
					id: _,
					method: L,
					params: ce(Pi(ce({}, h), {
						ttl: D,
						prompt: u,
						tag: m,
						attestation: p
					}), y)
				}, k = `Failed to publish custom payload, please try again. id:${_} tag:${m}`;
				try {
					kt$1((s = I.params) == null ? void 0 : s.prompt) && ((n = I.params) == null || delete n.prompt), kt$1((o = I.params) == null ? void 0 : o.tag) && ((a = I.params) == null || delete a.tag);
					const T = new Promise(async (S) => {
						const O = ({ id: Z }) => {
							var _e;
							((_e = I.id) == null ? void 0 : _e.toString()) === Z.toString() && (this.removeRequestFromQueue(Z), this.relayer.events.removeListener(C.publish, O), S());
						};
						this.relayer.events.on(C.publish, O);
						const te = ni$1(new Promise((Z, _e) => {
							this.rpcPublish(I, l).then(Z).catch((Ee) => {
								this.logger.warn(Ee, Ee?.message), _e(Ee);
							});
						}), this.initialPublishTimeout, `Failed initial custom payload publish, retrying.... method:${L} id:${_} tag:${m}`);
						try {
							await te, this.events.removeListener(C.publish, O);
						} catch (Z) {
							this.queue.set(_, {
								request: I,
								opts: l,
								attempt: 1
							}), this.logger.warn(Z, Z?.message);
						}
					});
					this.logger.trace({
						type: "method",
						method: "publish",
						params: {
							id: _,
							payload: h,
							opts: l
						}
					}), await ni$1(T, this.publishTimeout, k);
				} catch (T) {
					if (this.logger.debug("Failed to Publish Payload"), this.logger.error(T), (c = l?.internal) != null && c.throwOnFailedPublish) throw T;
				} finally {
					this.queue.delete(_);
				}
			}), G(this, "on", (i, s) => {
				this.events.on(i, s);
			}), G(this, "once", (i, s) => {
				this.events.once(i, s);
			}), G(this, "off", (i, s) => {
				this.events.off(i, s);
			}), G(this, "removeListener", (i, s) => {
				this.events.removeListener(i, s);
			}), this.relayer = e, this.logger = E(t, this.name), this.registerEventListeners();
		}
		get context() {
			return y$1(this.logger);
		}
		async rpcPublish(e, t) {
			this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
				type: "message",
				direction: "outgoing",
				request: e
			});
			const i = await this.relayer.request(e);
			return this.relayer.events.emit(C.publish, ce(ce({}, e), t)), this.logger.debug("Successfully Published Payload"), i;
		}
		removeRequestFromQueue(e) {
			this.queue.delete(e);
		}
		checkQueue() {
			this.queue.forEach(async (e, t) => {
				var i;
				const s = e.attempt + 1;
				this.queue.set(t, Pi(ce({}, e), { attempt: s })), this.logger.warn({}, `Publisher: queue->publishing: ${e.request.id}, tag: ${(i = e.request.params) == null ? void 0 : i.tag}, attempt: ${s}`), await this.rpcPublish(e.request, e.opts), this.logger.warn({}, `Publisher: queue->published: ${e.request.id}`);
			});
		}
		registerEventListeners() {
			this.relayer.core.heartbeat.on(r$1.pulse, () => {
				if (this.needsTransportRestart) {
					this.needsTransportRestart = !1, this.relayer.events.emit(C.connection_stalled);
					return;
				}
				this.checkQueue();
			}), this.relayer.on(C.message_ack, (e) => {
				this.removeRequestFromQueue(e.id.toString());
			});
		}
	};
	Jn = Object.defineProperty, Xn = (r, e, t) => e in r ? Jn(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, he = (r, e, t) => Xn(r, typeof e != "symbol" ? e + "" : e, t);
	Zn = class {
		constructor() {
			he(this, "map", /* @__PURE__ */ new Map()), he(this, "set", (e, t) => {
				const i = this.get(e);
				this.exists(e, t) || this.map.set(e, [...i, t]);
			}), he(this, "get", (e) => this.map.get(e) || []), he(this, "exists", (e, t) => this.get(e).includes(t)), he(this, "delete", (e, t) => {
				if (typeof t > "u") {
					this.map.delete(e);
					return;
				}
				if (!this.map.has(e)) return;
				const i = this.get(e);
				if (!this.exists(e, t)) return;
				const s = i.filter((n) => n !== t);
				if (!s.length) {
					this.map.delete(e);
					return;
				}
				this.map.set(e, s);
			}), he(this, "clear", () => {
				this.map.clear();
			});
		}
		get topics() {
			return Array.from(this.map.keys());
		}
	};
	Qn = Object.defineProperty, eo = Object.defineProperties, to = Object.getOwnPropertyDescriptors, Si = Object.getOwnPropertySymbols, io = Object.prototype.hasOwnProperty, so = Object.prototype.propertyIsEnumerable, Ye = (r, e, t) => e in r ? Qn(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, fe = (r, e) => {
		for (var t in e || (e = {})) io.call(e, t) && Ye(r, t, e[t]);
		if (Si) for (var t of Si(e)) so.call(e, t) && Ye(r, t, e[t]);
		return r;
	}, Je = (r, e) => eo(r, to(e)), f = (r, e, t) => Ye(r, typeof e != "symbol" ? e + "" : e, t);
	Oi = class extends P$2 {
		constructor(e, t) {
			super(e, t), this.relayer = e, this.logger = t, f(this, "subscriptions", /* @__PURE__ */ new Map()), f(this, "topicMap", new Zn()), f(this, "events", new EventEmitter()), f(this, "name", Mt), f(this, "version", "0.3"), f(this, "pending", /* @__PURE__ */ new Map()), f(this, "cached", []), f(this, "initialized", !1), f(this, "storagePrefix", W), f(this, "subscribeTimeout", (0, import_cjs.toMiliseconds)(import_cjs.ONE_MINUTE)), f(this, "initialSubscribeTimeout", (0, import_cjs.toMiliseconds)(import_cjs.ONE_SECOND * 15)), f(this, "clientId"), f(this, "batchSubscribeTopicsLimit", 500), f(this, "init", async () => {
				this.initialized || (this.logger.trace("Initialized"), this.registerEventListeners(), await this.restore()), this.initialized = !0;
			}), f(this, "subscribe", async (i, s) => {
				var n;
				this.isInitialized(), this.logger.debug("Subscribing Topic"), this.logger.trace({
					type: "method",
					method: "subscribe",
					params: {
						topic: i,
						opts: s
					}
				});
				try {
					const o = ea$1(s), a = {
						topic: i,
						relay: o,
						transportType: s?.transportType
					};
					(n = s?.internal) != null && n.skipSubscribe || this.pending.set(i, a);
					const c = await this.rpcSubscribe(i, o, s);
					return typeof c == "string" && (this.onSubscribe(c, a), this.logger.debug("Successfully Subscribed Topic"), this.logger.trace({
						type: "method",
						method: "subscribe",
						params: {
							topic: i,
							opts: s
						}
					})), c;
				} catch (o) {
					throw this.logger.debug("Failed to Subscribe Topic"), this.logger.error(o), o;
				}
			}), f(this, "unsubscribe", async (i, s) => {
				this.isInitialized(), typeof s?.id < "u" ? await this.unsubscribeById(i, s.id, s) : await this.unsubscribeByTopic(i, s);
			}), f(this, "isSubscribed", (i) => new Promise((s) => {
				s(this.topicMap.topics.includes(i));
			})), f(this, "isKnownTopic", (i) => new Promise((s) => {
				s(this.topicMap.topics.includes(i) || this.pending.has(i) || this.cached.some((n) => n.topic === i));
			})), f(this, "on", (i, s) => {
				this.events.on(i, s);
			}), f(this, "once", (i, s) => {
				this.events.once(i, s);
			}), f(this, "off", (i, s) => {
				this.events.off(i, s);
			}), f(this, "removeListener", (i, s) => {
				this.events.removeListener(i, s);
			}), f(this, "start", async () => {
				await this.onConnect();
			}), f(this, "stop", async () => {
				await this.onDisconnect();
			}), f(this, "restart", async () => {
				await this.restore(), await this.onRestart();
			}), f(this, "checkPending", async () => {
				if (this.pending.size === 0 && (!this.initialized || !this.relayer.connected)) return;
				const i = [];
				this.pending.forEach((s) => {
					i.push(s);
				}), await this.batchSubscribe(i);
			}), f(this, "registerEventListeners", () => {
				this.relayer.core.heartbeat.on(r$1.pulse, async () => {
					await this.checkPending();
				}), this.events.on(U.created, async (i) => {
					const s = U.created;
					this.logger.info(`Emitting ${s}`), this.logger.debug({
						type: "event",
						event: s,
						data: i
					}), await this.persist();
				}), this.events.on(U.deleted, async (i) => {
					const s = U.deleted;
					this.logger.info(`Emitting ${s}`), this.logger.debug({
						type: "event",
						event: s,
						data: i
					}), await this.persist();
				});
			}), this.relayer = e, this.logger = E(t, this.name), this.clientId = "";
		}
		get context() {
			return y$1(this.logger);
		}
		get storageKey() {
			return this.storagePrefix + this.version + this.relayer.core.customStoragePrefix + "//" + this.name;
		}
		get length() {
			return this.subscriptions.size;
		}
		get ids() {
			return Array.from(this.subscriptions.keys());
		}
		get values() {
			return Array.from(this.subscriptions.values());
		}
		get topics() {
			return this.topicMap.topics;
		}
		get hasAnyTopics() {
			return this.topicMap.topics.length > 0 || this.pending.size > 0 || this.cached.length > 0 || this.subscriptions.size > 0;
		}
		hasSubscription(e, t) {
			let i = !1;
			try {
				i = this.getSubscription(e).topic === t;
			} catch {}
			return i;
		}
		reset() {
			this.cached = [], this.initialized = !0;
		}
		onDisable() {
			this.values.length > 0 && (this.cached = this.values), this.subscriptions.clear(), this.topicMap.clear();
		}
		async unsubscribeByTopic(e, t) {
			const i = this.topicMap.get(e);
			await Promise.all(i.map(async (s) => await this.unsubscribeById(e, s, t)));
		}
		async unsubscribeById(e, t, i) {
			this.logger.debug("Unsubscribing Topic"), this.logger.trace({
				type: "method",
				method: "unsubscribe",
				params: {
					topic: e,
					id: t,
					opts: i
				}
			});
			try {
				const s = ea$1(i);
				await this.restartToComplete({
					topic: e,
					id: t,
					relay: s
				}), await this.rpcUnsubscribe(e, t, s);
				const n = Kt$1("USER_DISCONNECTED", `${this.name}, ${e}`);
				await this.onUnsubscribe(e, t, n), this.logger.debug("Successfully Unsubscribed Topic"), this.logger.trace({
					type: "method",
					method: "unsubscribe",
					params: {
						topic: e,
						id: t,
						opts: i
					}
				});
			} catch (s) {
				throw this.logger.debug("Failed to Unsubscribe Topic"), this.logger.error(s), s;
			}
		}
		async rpcSubscribe(e, t, i) {
			var s, n;
			const o = await this.getSubscriptionId(e);
			if ((s = i?.internal) != null && s.skipSubscribe) return o;
			(!i || i?.transportType === ee.relay) && await this.restartToComplete({
				topic: e,
				id: e,
				relay: t
			});
			const a = {
				method: na(t.protocol).subscribe,
				params: { topic: e }
			};
			this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
				type: "payload",
				direction: "outgoing",
				request: a
			});
			const c = (n = i?.internal) == null ? void 0 : n.throwOnFailedPublish;
			try {
				if (i?.transportType === ee.link_mode) return setTimeout(() => {
					(this.relayer.connected || this.relayer.connecting) && this.relayer.request(a).catch((p) => this.logger.warn(p));
				}, (0, import_cjs.toMiliseconds)(import_cjs.ONE_SECOND)), o;
				const l = await ni$1(new Promise(async (p) => {
					const y = (w) => {
						w.topic === e && (this.events.removeListener(U.created, y), p(w.id));
					};
					this.events.on(U.created, y);
					try {
						const w = await ni$1(new Promise((u, m) => {
							this.relayer.request(a).catch((D) => {
								this.logger.warn(D, D?.message), m(D);
							}).then(u);
						}), this.initialSubscribeTimeout, `Subscribing to ${e} failed, please try again`);
						this.events.removeListener(U.created, y), p(w);
					} catch {}
				}), this.subscribeTimeout, `Subscribing to ${e} failed, please try again`);
				if (!l && c) throw new Error(`Subscribing to ${e} failed, please try again`);
				return l ? o : null;
			} catch (h) {
				if (this.logger.debug("Outgoing Relay Subscribe Payload stalled"), this.relayer.events.emit(C.connection_stalled), c) throw h;
			}
			return null;
		}
		async rpcBatchSubscribe(e) {
			if (!e.length) return;
			const t = e[0].relay, i = {
				method: na(t.protocol).batchSubscribe,
				params: { topics: e.map((s) => s.topic) }
			};
			this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
				type: "payload",
				direction: "outgoing",
				request: i
			});
			try {
				await await ni$1(new Promise((s) => {
					this.relayer.request(i).catch((n) => this.logger.warn(n)).then(s);
				}), this.subscribeTimeout, "rpcBatchSubscribe failed, please try again");
			} catch {
				this.relayer.events.emit(C.connection_stalled);
			}
		}
		async rpcBatchFetchMessages(e) {
			if (!e.length) return;
			const t = e[0].relay, i = {
				method: na(t.protocol).batchFetchMessages,
				params: { topics: e.map((n) => n.topic) }
			};
			this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
				type: "payload",
				direction: "outgoing",
				request: i
			});
			let s;
			try {
				s = await await ni$1(new Promise((n, o) => {
					this.relayer.request(i).catch((a) => {
						this.logger.warn(a), o(a);
					}).then(n);
				}), this.subscribeTimeout, "rpcBatchFetchMessages failed, please try again");
			} catch {
				this.relayer.events.emit(C.connection_stalled);
			}
			return s;
		}
		rpcUnsubscribe(e, t, i) {
			const s = {
				method: na(i.protocol).unsubscribe,
				params: {
					topic: e,
					id: t
				}
			};
			return this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
				type: "payload",
				direction: "outgoing",
				request: s
			}), this.relayer.request(s);
		}
		onSubscribe(e, t) {
			this.setSubscription(e, Je(fe({}, t), { id: e })), this.pending.delete(t.topic);
		}
		onBatchSubscribe(e) {
			e.length && e.forEach((t) => {
				this.setSubscription(t.id, fe({}, t)), this.pending.delete(t.topic);
			});
		}
		async onUnsubscribe(e, t, i) {
			this.events.removeAllListeners(t), this.hasSubscription(t, e) && this.deleteSubscription(t, i), await this.relayer.messages.del(e);
		}
		async setRelayerSubscriptions(e) {
			await this.relayer.core.storage.setItem(this.storageKey, e);
		}
		async getRelayerSubscriptions() {
			return await this.relayer.core.storage.getItem(this.storageKey);
		}
		setSubscription(e, t) {
			this.logger.debug("Setting subscription"), this.logger.trace({
				type: "method",
				method: "setSubscription",
				id: e,
				subscription: t
			}), this.addSubscription(e, t);
		}
		addSubscription(e, t) {
			this.subscriptions.set(e, fe({}, t)), this.topicMap.set(t.topic, e), this.events.emit(U.created, t);
		}
		getSubscription(e) {
			this.logger.debug("Getting subscription"), this.logger.trace({
				type: "method",
				method: "getSubscription",
				id: e
			});
			const t = this.subscriptions.get(e);
			if (!t) {
				const { message: i } = Et("NO_MATCHING_KEY", `${this.name}: ${e}`);
				throw new Error(i);
			}
			return t;
		}
		deleteSubscription(e, t) {
			this.logger.debug("Deleting subscription"), this.logger.trace({
				type: "method",
				method: "deleteSubscription",
				id: e,
				reason: t
			});
			const i = this.getSubscription(e);
			this.subscriptions.delete(e), this.topicMap.delete(i.topic, e), this.events.emit(U.deleted, Je(fe({}, i), { reason: t }));
		}
		async persist() {
			await this.setRelayerSubscriptions(this.values), this.events.emit(U.sync);
		}
		async onRestart() {
			if (this.cached.length) {
				const e = [...this.cached], t = Math.ceil(this.cached.length / this.batchSubscribeTopicsLimit);
				for (let i = 0; i < t; i++) {
					const s = e.splice(0, this.batchSubscribeTopicsLimit);
					await this.batchSubscribe(s);
				}
			}
			this.events.emit(U.resubscribed);
		}
		async restore() {
			try {
				const e = await this.getRelayerSubscriptions();
				if (typeof e > "u" || !e.length) return;
				if (this.subscriptions.size && !e.every((t) => {
					var i;
					return t.topic === ((i = this.subscriptions.get(t.id)) == null ? void 0 : i.topic);
				})) {
					const { message: t } = Et("RESTORE_WILL_OVERRIDE", this.name);
					throw this.logger.error(t), this.logger.error(`${this.name}: ${JSON.stringify(this.values)}`), new Error(t);
				}
				this.cached = e, this.logger.debug(`Successfully Restored subscriptions for ${this.name}`), this.logger.trace({
					type: "method",
					method: "restore",
					subscriptions: this.values
				});
			} catch (e) {
				this.logger.debug(`Failed to Restore subscriptions for ${this.name}`), this.logger.error(e);
			}
		}
		async batchSubscribe(e) {
			e.length && (await this.rpcBatchSubscribe(e), this.onBatchSubscribe(await Promise.all(e.map(async (t) => Je(fe({}, t), { id: await this.getSubscriptionId(t.topic) })))));
		}
		async batchFetchMessages(e) {
			if (!e.length) return;
			this.logger.trace(`Fetching batch messages for ${e.length} subscriptions`);
			const t = await this.rpcBatchFetchMessages(e);
			t && t.messages && (await pi$1((0, import_cjs.toMiliseconds)(import_cjs.ONE_SECOND)), await this.relayer.handleBatchMessageEvents(t.messages));
		}
		async onConnect() {
			await this.restart(), this.reset();
		}
		onDisconnect() {
			this.onDisable();
		}
		isInitialized() {
			if (!this.initialized) {
				const { message: e } = Et("NOT_INITIALIZED", this.name);
				throw new Error(e);
			}
		}
		async restartToComplete(e) {
			!this.relayer.connected && !this.relayer.connecting && (this.cached.push(e), await this.relayer.transportOpen());
		}
		async getClientId() {
			return this.clientId || (this.clientId = await this.relayer.core.crypto.getClientId()), this.clientId;
		}
		async getSubscriptionId(e) {
			return zc(e + await this.getClientId());
		}
	};
	ro = Object.defineProperty, Ri = Object.getOwnPropertySymbols, no = Object.prototype.hasOwnProperty, oo = Object.prototype.propertyIsEnumerable, Xe = (r, e, t) => e in r ? ro(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, Ai = (r, e) => {
		for (var t in e || (e = {})) no.call(e, t) && Xe(r, t, e[t]);
		if (Ri) for (var t of Ri(e)) oo.call(e, t) && Xe(r, t, e[t]);
		return r;
	}, g = (r, e, t) => Xe(r, typeof e != "symbol" ? e + "" : e, t);
	xi = class extends d$2 {
		constructor(e) {
			super(e), g(this, "protocol", "wc"), g(this, "version", 2), g(this, "core"), g(this, "logger"), g(this, "events", new EventEmitter()), g(this, "provider"), g(this, "messages"), g(this, "subscriber"), g(this, "publisher"), g(this, "name", Lt), g(this, "transportExplicitlyClosed", !1), g(this, "initialized", !1), g(this, "connectionAttemptInProgress", !1), g(this, "relayUrl"), g(this, "projectId"), g(this, "packageName"), g(this, "bundleId"), g(this, "hasExperiencedNetworkDisruption", !1), g(this, "pingTimeout"), g(this, "heartBeatTimeout", (0, import_cjs.toMiliseconds)(import_cjs.THIRTY_SECONDS + import_cjs.FIVE_SECONDS)), g(this, "reconnectTimeout"), g(this, "connectPromise"), g(this, "reconnectInProgress", !1), g(this, "requestsInFlight", []), g(this, "connectTimeout", (0, import_cjs.toMiliseconds)(import_cjs.ONE_SECOND * 15)), g(this, "request", async (t) => {
				var i, s;
				this.logger.debug("Publishing Request Payload");
				const n = t.id || getBigIntRpcId().toString();
				await this.toEstablishConnection();
				try {
					this.logger.trace({
						id: n,
						method: t.method,
						topic: (i = t.params) == null ? void 0 : i.topic
					}, "relayer.request - publishing...");
					const o = `${n}:${((s = t.params) == null ? void 0 : s.tag) || ""}`;
					this.requestsInFlight.push(o);
					const a = await this.provider.request(t);
					return this.requestsInFlight = this.requestsInFlight.filter((c) => c !== o), a;
				} catch (o) {
					throw this.logger.debug(`Failed to Publish Request: ${n}`), o;
				}
			}), g(this, "resetPingTimeout", () => {
				Ye$1() && (clearTimeout(this.pingTimeout), this.pingTimeout = setTimeout(() => {
					var t, i, s, n;
					try {
						this.logger.debug({}, "pingTimeout: Connection stalled, terminating..."), (n = (s = (i = (t = this.provider) == null ? void 0 : t.connection) == null ? void 0 : i.socket) == null ? void 0 : s.terminate) == null || n.call(s);
					} catch (o) {
						this.logger.warn(o, o?.message);
					}
				}, this.heartBeatTimeout));
			}), g(this, "onPayloadHandler", (t) => {
				this.onProviderPayload(t), this.resetPingTimeout();
			}), g(this, "onConnectHandler", () => {
				this.logger.warn({}, "Relayer connected 🛜"), this.startPingTimeout(), this.events.emit(C.connect);
			}), g(this, "onDisconnectHandler", () => {
				this.logger.warn({}, "Relayer disconnected 🛑"), this.requestsInFlight = [], this.onProviderDisconnect();
			}), g(this, "onProviderErrorHandler", (t) => {
				this.logger.fatal(`Fatal socket error: ${t.message}`), this.events.emit(C.error, t), this.logger.fatal("Fatal socket error received, closing transport"), this.transportClose();
			}), g(this, "registerProviderListeners", () => {
				this.provider.on(M.payload, this.onPayloadHandler), this.provider.on(M.connect, this.onConnectHandler), this.provider.on(M.disconnect, this.onDisconnectHandler), this.provider.on(M.error, this.onProviderErrorHandler);
			}), this.core = e.core, this.logger = typeof e.logger < "u" && typeof e.logger != "string" ? E(e.logger, this.name) : (0, import_pino$1.default)(k$2({ level: e.logger || "error" })), this.messages = new Ti(this.logger, e.core), this.subscriber = new Oi(this, this.logger), this.publisher = new Yn(this, this.logger), this.projectId = e?.projectId, this.relayUrl = e?.relayUrl || "wss://relay.walletconnect.org", Ms() ? this.packageName = qs() : Vs() && (this.bundleId = qs()), this.provider = {};
		}
		async init() {
			this.logger.trace("Initialized"), this.registerEventListeners(), await Promise.all([this.messages.init(), this.subscriber.init()]), this.initialized = !0, this.transportOpen().catch((e) => this.logger.warn(e, e?.message));
		}
		get context() {
			return y$1(this.logger);
		}
		get connected() {
			var e, t, i;
			return ((i = (t = (e = this.provider) == null ? void 0 : e.connection) == null ? void 0 : t.socket) == null ? void 0 : i.readyState) === 1 || !1;
		}
		get connecting() {
			var e, t, i;
			return ((i = (t = (e = this.provider) == null ? void 0 : e.connection) == null ? void 0 : t.socket) == null ? void 0 : i.readyState) === 0 || this.connectPromise !== void 0 || !1;
		}
		async publish(e, t, i) {
			this.isInitialized(), await this.publisher.publish(e, t, i), await this.recordMessageEvent({
				topic: e,
				message: t,
				publishedAt: Date.now(),
				transportType: ee.relay
			}, ye.outbound);
		}
		async publishCustom(e) {
			this.isInitialized(), await this.publisher.publishCustom(e);
		}
		async subscribe(e, t) {
			var i, s, n;
			this.isInitialized(), (!(t != null && t.transportType) || t?.transportType === "relay") && await this.toEstablishConnection();
			const o = typeof ((i = t?.internal) == null ? void 0 : i.throwOnFailedPublish) > "u" ? !0 : (s = t?.internal) == null ? void 0 : s.throwOnFailedPublish;
			let a = ((n = this.subscriber.topicMap.get(e)) == null ? void 0 : n[0]) || "", c;
			const h = (l) => {
				l.topic === e && (this.subscriber.off(U.created, h), c());
			};
			return await Promise.all([new Promise((l) => {
				c = l, this.subscriber.on(U.created, h);
			}), new Promise(async (l, p) => {
				a = await this.subscriber.subscribe(e, Ai({ internal: { throwOnFailedPublish: o } }, t)).catch((y) => {
					o && p(y);
				}) || a, l();
			})]), a;
		}
		async unsubscribe(e, t) {
			this.isInitialized(), await this.subscriber.unsubscribe(e, t);
		}
		on(e, t) {
			this.events.on(e, t);
		}
		once(e, t) {
			this.events.once(e, t);
		}
		off(e, t) {
			this.events.off(e, t);
		}
		removeListener(e, t) {
			this.events.removeListener(e, t);
		}
		async transportDisconnect() {
			this.provider.disconnect && (this.hasExperiencedNetworkDisruption || this.connected) ? await ni$1(this.provider.disconnect(), 2e3, "provider.disconnect()").catch(() => this.onProviderDisconnect()) : this.onProviderDisconnect();
		}
		async transportClose() {
			this.transportExplicitlyClosed = !0, await this.transportDisconnect();
		}
		async transportOpen(e) {
			if (!this.subscriber.hasAnyTopics) {
				this.logger.info("Starting WS connection skipped because the client has no topics to work with.");
				return;
			}
			if (this.connectPromise ? (this.logger.debug({}, "Waiting for existing connection attempt to resolve..."), await this.connectPromise, this.logger.debug({}, "Existing connection attempt resolved")) : (this.connectPromise = new Promise(async (t, i) => {
				await this.connect(e).then(t).catch(i).finally(() => {
					this.connectPromise = void 0;
				});
			}), await this.connectPromise), !this.connected) throw new Error(`Couldn't establish socket connection to the relay server: ${this.relayUrl}`);
		}
		async restartTransport(e) {
			this.logger.debug({}, "Restarting transport..."), !this.connectionAttemptInProgress && (this.relayUrl = e || this.relayUrl, await this.confirmOnlineStateOrThrow(), await this.transportClose(), await this.transportOpen());
		}
		async confirmOnlineStateOrThrow() {
			if (!await ja()) throw new Error("No internet connection detected. Please restart your network and try again.");
		}
		async handleBatchMessageEvents(e) {
			if (e?.length === 0) {
				this.logger.trace("Batch message events is empty. Ignoring...");
				return;
			}
			const t = e.sort((i, s) => i.publishedAt - s.publishedAt);
			this.logger.debug(`Batch of ${t.length} message events sorted`);
			for (const i of t) try {
				await this.onMessageEvent(i);
			} catch (s) {
				this.logger.warn(s, "Error while processing batch message event: " + s?.message);
			}
			this.logger.trace(`Batch of ${t.length} message events processed`);
		}
		async onLinkMessageEvent(e, t) {
			const { topic: i } = e;
			if (!t.sessionExists) {
				const n = {
					topic: i,
					expiry: ii$1(import_cjs.FIVE_MINUTES),
					relay: { protocol: "irn" },
					active: !1
				};
				await this.core.pairing.pairings.set(i, n);
			}
			this.events.emit(C.message, e), await this.recordMessageEvent(e, ye.inbound);
		}
		async connect(e) {
			await this.confirmOnlineStateOrThrow(), e && e !== this.relayUrl && (this.relayUrl = e, await this.transportDisconnect()), this.connectionAttemptInProgress = !0, this.transportExplicitlyClosed = !1;
			let t = 1;
			for (; t < 6;) {
				try {
					if (this.transportExplicitlyClosed) break;
					this.logger.debug({}, `Connecting to ${this.relayUrl}, attempt: ${t}...`), await this.createProvider(), await new Promise(async (i, s) => {
						const n = () => {
							s(/* @__PURE__ */ new Error("Connection interrupted while trying to connect"));
						};
						this.provider.once(M.disconnect, n), await ni$1(new Promise((o, a) => {
							this.provider.connect().then(o).catch(a);
						}), this.connectTimeout, `Socket stalled when trying to connect to ${this.relayUrl}`).catch((o) => {
							s(o);
						}).finally(() => {
							this.provider.off(M.disconnect, n), clearTimeout(this.reconnectTimeout);
						}), await new Promise(async (o, a) => {
							const c = () => {
								s(/* @__PURE__ */ new Error("Connection interrupted while trying to subscribe"));
							};
							this.provider.once(M.disconnect, c), await this.subscriber.start().then(o).catch(a).finally(() => {
								this.provider.off(M.disconnect, c);
							});
						}), this.hasExperiencedNetworkDisruption = !1, i();
					});
				} catch (i) {
					await this.subscriber.stop();
					const s = i;
					this.logger.warn({}, s.message), this.hasExperiencedNetworkDisruption = !0;
				} finally {
					this.connectionAttemptInProgress = !1;
				}
				if (this.connected) {
					this.logger.debug({}, `Connected to ${this.relayUrl} successfully on attempt: ${t}`);
					break;
				}
				await new Promise((i) => setTimeout(i, (0, import_cjs.toMiliseconds)(t * 1))), t++;
			}
		}
		startPingTimeout() {
			var e, t, i, s, n;
			if (Ye$1()) try {
				(t = (e = this.provider) == null ? void 0 : e.connection) != null && t.socket && ((n = (s = (i = this.provider) == null ? void 0 : i.connection) == null ? void 0 : s.socket) == null || n.on("ping", () => {
					this.resetPingTimeout();
				})), this.resetPingTimeout();
			} catch (o) {
				this.logger.warn(o, o?.message);
			}
		}
		async createProvider() {
			this.provider.connection && this.unregisterProviderListeners();
			const e = await this.core.crypto.signJWT(this.relayUrl);
			this.provider = new o(new f$1(zs({
				sdkVersion: Pe,
				protocol: this.protocol,
				version: this.version,
				relayUrl: this.relayUrl,
				projectId: this.projectId,
				auth: e,
				useOnCloseEvent: !0,
				bundleId: this.bundleId,
				packageName: this.packageName
			}))), this.registerProviderListeners();
		}
		async recordMessageEvent(e, t) {
			const { topic: i, message: s } = e;
			await this.messages.set(i, s, t);
		}
		async shouldIgnoreMessageEvent(e) {
			const { topic: t, message: i } = e;
			if (!i || i.length === 0) return this.logger.warn(`Ignoring invalid/empty message: ${i}`), !0;
			if (!await this.subscriber.isKnownTopic(t)) return this.logger.warn(`Ignoring message for unknown topic ${t}`), !0;
			const s = this.messages.has(t, i);
			return s && this.logger.warn(`Ignoring duplicate message: ${i}`), s;
		}
		async onProviderPayload(e) {
			if (this.logger.debug("Incoming Relay Payload"), this.logger.trace({
				type: "payload",
				direction: "incoming",
				payload: e
			}), isJsonRpcRequest(e)) {
				if (!e.method.endsWith("_subscription")) return;
				const t = e.params, { topic: i, message: s, publishedAt: n, attestation: o } = t.data, a = {
					topic: i,
					message: s,
					publishedAt: n,
					transportType: ee.relay,
					attestation: o
				};
				this.logger.debug("Emitting Relayer Payload"), this.logger.trace(Ai({
					type: "event",
					event: t.id
				}, a)), this.events.emit(t.id, a), await this.acknowledgePayload(e), await this.onMessageEvent(a);
			} else isJsonRpcResponse(e) && this.events.emit(C.message_ack, e);
		}
		async onMessageEvent(e) {
			await this.shouldIgnoreMessageEvent(e) || (await this.recordMessageEvent(e, ye.inbound), this.events.emit(C.message, e));
		}
		async acknowledgePayload(e) {
			const t = formatJsonRpcResult(e.id, !0);
			await this.provider.connection.send(t);
		}
		unregisterProviderListeners() {
			this.provider.off(M.payload, this.onPayloadHandler), this.provider.off(M.connect, this.onConnectHandler), this.provider.off(M.disconnect, this.onDisconnectHandler), this.provider.off(M.error, this.onProviderErrorHandler), clearTimeout(this.pingTimeout);
		}
		async registerEventListeners() {
			let e = await ja();
			ka(async (t) => {
				e !== t && (e = t, t ? await this.transportOpen().catch((i) => this.logger.error(i, i?.message)) : (this.hasExperiencedNetworkDisruption = !0, await this.transportDisconnect(), this.transportExplicitlyClosed = !1));
			}), this.core.heartbeat.on(r$1.pulse, async () => {
				if (!this.transportExplicitlyClosed && !this.connected && Pa()) try {
					await this.confirmOnlineStateOrThrow(), await this.transportOpen();
				} catch (t) {
					this.logger.warn(t, t?.message);
				}
			});
		}
		async onProviderDisconnect() {
			clearTimeout(this.pingTimeout), this.events.emit(C.disconnect), this.connectionAttemptInProgress = !1, !this.reconnectInProgress && (this.reconnectInProgress = !0, await this.subscriber.stop(), this.subscriber.hasAnyTopics && (this.transportExplicitlyClosed || (this.reconnectTimeout = setTimeout(async () => {
				await this.transportOpen().catch((e) => this.logger.error(e, e?.message)), this.reconnectTimeout = void 0, this.reconnectInProgress = !1;
			}, (0, import_cjs.toMiliseconds)(.1)))));
		}
		isInitialized() {
			if (!this.initialized) {
				const { message: e } = Et("NOT_INITIALIZED", this.name);
				throw new Error(e);
			}
		}
		async toEstablishConnection() {
			if (await this.confirmOnlineStateOrThrow(), !this.connected) {
				if (this.connectPromise) {
					await this.connectPromise;
					return;
				}
				await this.connect();
			}
		}
	};
	co = "[object RegExp]", ho = "[object String]", lo = "[object Number]", uo = "[object Boolean]", zi = "[object Arguments]", go = "[object Symbol]", po = "[object Date]", yo = "[object Map]", bo = "[object Set]", mo = "[object Array]", fo = "[object Function]", Do = "[object ArrayBuffer]", Ze = "[object Object]", vo = "[object Error]", wo = "[object DataView]", _o = "[object Uint8Array]", Eo = "[object Uint8ClampedArray]", Io = "[object Uint16Array]", To = "[object Uint32Array]", Co = "[object BigUint64Array]", Po = "[object Int8Array]", So = "[object Int16Array]", Oo = "[object Int32Array]", Ro = "[object BigInt64Array]", Ao = "[object Float32Array]", xo = "[object Float64Array]";
	Lo = Object.defineProperty, ki = Object.getOwnPropertySymbols, ko = Object.prototype.hasOwnProperty, jo = Object.prototype.propertyIsEnumerable, Qe = (r, e, t) => e in r ? Lo(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, ji = (r, e) => {
		for (var t in e || (e = {})) ko.call(e, t) && Qe(r, t, e[t]);
		if (ki) for (var t of ki(e)) jo.call(e, t) && Qe(r, t, e[t]);
		return r;
	}, F = (r, e, t) => Qe(r, typeof e != "symbol" ? e + "" : e, t);
	Ui = class extends f$2 {
		constructor(e, t, i, s = W, n = void 0) {
			super(e, t, i, s), this.core = e, this.logger = t, this.name = i, F(this, "map", /* @__PURE__ */ new Map()), F(this, "version", "0.3"), F(this, "cached", []), F(this, "initialized", !1), F(this, "getKey"), F(this, "storagePrefix", W), F(this, "recentlyDeleted", []), F(this, "recentlyDeletedLimit", 200), F(this, "init", async () => {
				this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((o) => {
					this.getKey && o !== null && !kt$1(o) ? this.map.set(this.getKey(o), o) : wa(o) ? this.map.set(o.id, o) : xa(o) && this.map.set(o.topic, o);
				}), this.cached = [], this.initialized = !0);
			}), F(this, "set", async (o, a) => {
				this.isInitialized(), this.map.has(o) ? await this.update(o, a) : (this.logger.debug("Setting value"), this.logger.trace({
					type: "method",
					method: "set",
					key: o,
					value: a
				}), this.map.set(o, a), await this.persist());
			}), F(this, "get", (o) => (this.isInitialized(), this.logger.debug("Getting value"), this.logger.trace({
				type: "method",
				method: "get",
				key: o
			}), this.getData(o))), F(this, "getAll", (o) => (this.isInitialized(), o ? this.values.filter((a) => Object.keys(o).every((c) => zo(a[c], o[c]))) : this.values)), F(this, "update", async (o, a) => {
				this.isInitialized(), this.logger.debug("Updating value"), this.logger.trace({
					type: "method",
					method: "update",
					key: o,
					update: a
				});
				const c = ji(ji({}, this.getData(o)), a);
				this.map.set(o, c), await this.persist();
			}), F(this, "delete", async (o, a) => {
				this.isInitialized(), this.map.has(o) && (this.logger.debug("Deleting value"), this.logger.trace({
					type: "method",
					method: "delete",
					key: o,
					reason: a
				}), this.map.delete(o), this.addToRecentlyDeleted(o), await this.persist());
			}), this.logger = E(t, this.name), this.storagePrefix = s, this.getKey = n;
		}
		get context() {
			return y$1(this.logger);
		}
		get storageKey() {
			return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
		}
		get length() {
			return this.map.size;
		}
		get keys() {
			return Array.from(this.map.keys());
		}
		get values() {
			return Array.from(this.map.values());
		}
		addToRecentlyDeleted(e) {
			this.recentlyDeleted.push(e), this.recentlyDeleted.length >= this.recentlyDeletedLimit && this.recentlyDeleted.splice(0, this.recentlyDeletedLimit / 2);
		}
		async setDataStore(e) {
			await this.core.storage.setItem(this.storageKey, e);
		}
		async getDataStore() {
			return await this.core.storage.getItem(this.storageKey);
		}
		getData(e) {
			const t = this.map.get(e);
			if (!t) {
				if (this.recentlyDeleted.includes(e)) {
					const { message: s } = Et("MISSING_OR_INVALID", `Record was recently deleted - ${this.name}: ${e}`);
					throw this.logger.error(s), new Error(s);
				}
				const { message: i } = Et("NO_MATCHING_KEY", `${this.name}: ${e}`);
				throw this.logger.error(i), new Error(i);
			}
			return t;
		}
		async persist() {
			await this.setDataStore(this.values);
		}
		async restore() {
			try {
				const e = await this.getDataStore();
				if (typeof e > "u" || !e.length) return;
				if (this.map.size) {
					const { message: t } = Et("RESTORE_WILL_OVERRIDE", this.name);
					throw this.logger.error(t), new Error(t);
				}
				this.cached = e, this.logger.debug(`Successfully Restored value for ${this.name}`), this.logger.trace({
					type: "method",
					method: "restore",
					value: this.values
				});
			} catch (e) {
				this.logger.debug(`Failed to Restore value for ${this.name}`), this.logger.error(e);
			}
		}
		isInitialized() {
			if (!this.initialized) {
				const { message: e } = Et("NOT_INITIALIZED", this.name);
				throw new Error(e);
			}
		}
	};
	Uo = Object.defineProperty, Fo = (r, e, t) => e in r ? Uo(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, d = (r, e, t) => Fo(r, typeof e != "symbol" ? e + "" : e, t);
	Fi = class {
		constructor(e, t) {
			this.core = e, this.logger = t, d(this, "name", Bt), d(this, "version", "0.3"), d(this, "events", new ys()), d(this, "pairings"), d(this, "initialized", !1), d(this, "storagePrefix", W), d(this, "ignoredPayloadTypes", [1]), d(this, "registeredMethods", []), d(this, "init", async () => {
				this.initialized || (await this.pairings.init(), await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.initialized = !0, this.logger.trace("Initialized"));
			}), d(this, "register", ({ methods: i }) => {
				this.isInitialized(), this.registeredMethods = [...new Set([...this.registeredMethods, ...i])];
			}), d(this, "create", async (i) => {
				this.isInitialized();
				const s = qc(), n = await this.core.crypto.setSymKey(s), o = ii$1(import_cjs.FIVE_MINUTES), a = { protocol: "irn" }, c = {
					topic: n,
					expiry: o,
					relay: a,
					active: !1,
					methods: i?.methods
				}, h = oa({
					protocol: this.core.protocol,
					version: this.core.version,
					topic: n,
					symKey: s,
					relay: a,
					expiryTimestamp: o,
					methods: i?.methods
				});
				return this.events.emit(ae.create, c), this.core.expirer.set(n, o), await this.pairings.set(n, c), await this.core.relayer.subscribe(n, {
					transportType: i?.transportType,
					internal: i?.internal
				}), {
					topic: n,
					uri: h
				};
			}), d(this, "pair", async (i) => {
				this.isInitialized();
				const s = this.core.eventClient.createEvent({ properties: {
					topic: i?.uri,
					trace: [Y.pairing_started]
				} });
				this.isValidPair(i, s);
				const { topic: n, symKey: o, relay: a, expiryTimestamp: c, methods: h } = ra(i.uri);
				s.props.properties.topic = n, s.addTrace(Y.pairing_uri_validation_success), s.addTrace(Y.pairing_uri_not_expired);
				let l;
				if (this.pairings.keys.includes(n)) {
					if (l = this.pairings.get(n), s.addTrace(Y.existing_pairing), l.active) throw s.setError(X.active_pairing_already_exists), /* @__PURE__ */ new Error(`Pairing already exists: ${n}. Please try again with a new connection URI.`);
					s.addTrace(Y.pairing_not_expired);
				}
				const p = c || ii$1(import_cjs.FIVE_MINUTES), y = {
					topic: n,
					relay: a,
					expiry: p,
					active: !1,
					methods: h
				};
				this.core.expirer.set(n, p), await this.pairings.set(n, y), s.addTrace(Y.store_new_pairing), i.activatePairing && await this.activate({ topic: n }), this.events.emit(ae.create, y), s.addTrace(Y.emit_inactive_pairing), this.core.crypto.keychain.has(n) || await this.core.crypto.setSymKey(o, n), s.addTrace(Y.subscribing_pairing_topic);
				try {
					await this.core.relayer.confirmOnlineStateOrThrow();
				} catch {
					s.setError(X.no_internet_connection);
				}
				try {
					await this.core.relayer.subscribe(n, { relay: a });
				} catch (w) {
					throw s.setError(X.subscribe_pairing_topic_failure), w;
				}
				return s.addTrace(Y.subscribe_pairing_topic_success), y;
			}), d(this, "activate", async ({ topic: i }) => {
				this.isInitialized();
				const s = ii$1(import_cjs.FIVE_MINUTES);
				this.core.expirer.set(i, s), await this.pairings.update(i, {
					active: !0,
					expiry: s
				});
			}), d(this, "ping", async (i) => {
				this.isInitialized(), await this.isValidPing(i), this.logger.warn("ping() is deprecated and will be removed in the next major release.");
				const { topic: s } = i;
				if (this.pairings.keys.includes(s)) {
					const n = await this.sendRequest(s, "wc_pairingPing", {}), { done: o, resolve: a, reject: c } = ei$1();
					this.events.once(ci$1("pairing_ping", n), ({ error: h }) => {
						h ? c(h) : a();
					}), await o();
				}
			}), d(this, "updateExpiry", async ({ topic: i, expiry: s }) => {
				this.isInitialized(), await this.pairings.update(i, { expiry: s });
			}), d(this, "updateMetadata", async ({ topic: i, metadata: s }) => {
				this.isInitialized(), await this.pairings.update(i, { peerMetadata: s });
			}), d(this, "getPairings", () => (this.isInitialized(), this.pairings.values)), d(this, "disconnect", async (i) => {
				this.isInitialized(), await this.isValidDisconnect(i);
				const { topic: s } = i;
				this.pairings.keys.includes(s) && (await this.sendRequest(s, "wc_pairingDelete", Kt$1("USER_DISCONNECTED")), await this.deletePairing(s));
			}), d(this, "formatUriFromPairing", (i) => {
				this.isInitialized();
				const { topic: s, relay: n, expiry: o, methods: a } = i, c = this.core.crypto.keychain.get(s);
				return oa({
					protocol: this.core.protocol,
					version: this.core.version,
					topic: s,
					symKey: c,
					relay: n,
					expiryTimestamp: o,
					methods: a
				});
			}), d(this, "sendRequest", async (i, s, n) => {
				const o = formatJsonRpcRequest(s, n), a = await this.core.crypto.encode(i, o), c = oe[s].req;
				return this.core.history.set(i, o), this.core.relayer.publish(i, a, c), o.id;
			}), d(this, "sendResult", async (i, s, n) => {
				const o = formatJsonRpcResult(i, n), a = await this.core.crypto.encode(s, o), h = oe[(await this.core.history.get(s, i)).request.method].res;
				await this.core.relayer.publish(s, a, h), await this.core.history.resolve(o);
			}), d(this, "sendError", async (i, s, n) => {
				const o = formatJsonRpcError(i, n), a = await this.core.crypto.encode(s, o), c = (await this.core.history.get(s, i)).request.method, h = oe[c] ? oe[c].res : oe.unregistered_method.res;
				await this.core.relayer.publish(s, a, h), await this.core.history.resolve(o);
			}), d(this, "deletePairing", async (i, s) => {
				await this.core.relayer.unsubscribe(i), await Promise.all([
					this.pairings.delete(i, Kt$1("USER_DISCONNECTED")),
					this.core.crypto.deleteSymKey(i),
					s ? Promise.resolve() : this.core.expirer.del(i)
				]);
			}), d(this, "cleanup", async () => {
				const i = this.pairings.getAll().filter((s) => fi$1(s.expiry));
				await Promise.all(i.map((s) => this.deletePairing(s.topic)));
			}), d(this, "onRelayEventRequest", async (i) => {
				const { topic: s, payload: n } = i;
				switch (n.method) {
					case "wc_pairingPing": return await this.onPairingPingRequest(s, n);
					case "wc_pairingDelete": return await this.onPairingDeleteRequest(s, n);
					default: return await this.onUnknownRpcMethodRequest(s, n);
				}
			}), d(this, "onRelayEventResponse", async (i) => {
				const { topic: s, payload: n } = i, o = (await this.core.history.get(s, n.id)).request.method;
				switch (o) {
					case "wc_pairingPing": return this.onPairingPingResponse(s, n);
					default: return this.onUnknownRpcMethodResponse(o);
				}
			}), d(this, "onPairingPingRequest", async (i, s) => {
				const { id: n } = s;
				try {
					this.isValidPing({ topic: i }), await this.sendResult(n, i, !0), this.events.emit(ae.ping, {
						id: n,
						topic: i
					});
				} catch (o) {
					await this.sendError(n, i, o), this.logger.error(o);
				}
			}), d(this, "onPairingPingResponse", (i, s) => {
				const { id: n } = s;
				setTimeout(() => {
					isJsonRpcResult(s) ? this.events.emit(ci$1("pairing_ping", n), {}) : isJsonRpcError(s) && this.events.emit(ci$1("pairing_ping", n), { error: s.error });
				}, 500);
			}), d(this, "onPairingDeleteRequest", async (i, s) => {
				const { id: n } = s;
				try {
					this.isValidDisconnect({ topic: i }), await this.deletePairing(i), this.events.emit(ae.delete, {
						id: n,
						topic: i
					});
				} catch (o) {
					await this.sendError(n, i, o), this.logger.error(o);
				}
			}), d(this, "onUnknownRpcMethodRequest", async (i, s) => {
				const { id: n, method: o } = s;
				try {
					if (this.registeredMethods.includes(o)) return;
					const a = Kt$1("WC_METHOD_UNSUPPORTED", o);
					await this.sendError(n, i, a), this.logger.error(a);
				} catch (a) {
					await this.sendError(n, i, a), this.logger.error(a);
				}
			}), d(this, "onUnknownRpcMethodResponse", (i) => {
				this.registeredMethods.includes(i) || this.logger.error(Kt$1("WC_METHOD_UNSUPPORTED", i));
			}), d(this, "isValidPair", (i, s) => {
				var n;
				if (!Aa(i)) {
					const { message: a } = Et("MISSING_OR_INVALID", `pair() params: ${i}`);
					throw s.setError(X.malformed_pairing_uri), new Error(a);
				}
				if (!ma(i.uri)) {
					const { message: a } = Et("MISSING_OR_INVALID", `pair() uri: ${i.uri}`);
					throw s.setError(X.malformed_pairing_uri), new Error(a);
				}
				const o = ra(i?.uri);
				if (!((n = o?.relay) != null && n.protocol)) {
					const { message: a } = Et("MISSING_OR_INVALID", "pair() uri#relay-protocol");
					throw s.setError(X.malformed_pairing_uri), new Error(a);
				}
				if (!(o != null && o.symKey)) {
					const { message: a } = Et("MISSING_OR_INVALID", "pair() uri#symKey");
					throw s.setError(X.malformed_pairing_uri), new Error(a);
				}
				if (o != null && o.expiryTimestamp && (0, import_cjs.toMiliseconds)(o?.expiryTimestamp) < Date.now()) {
					s.setError(X.pairing_expired);
					const { message: a } = Et("EXPIRED", "pair() URI has expired. Please try again with a new connection URI.");
					throw new Error(a);
				}
			}), d(this, "isValidPing", async (i) => {
				if (!Aa(i)) {
					const { message: n } = Et("MISSING_OR_INVALID", `ping() params: ${i}`);
					throw new Error(n);
				}
				const { topic: s } = i;
				await this.isValidPairingTopic(s);
			}), d(this, "isValidDisconnect", async (i) => {
				if (!Aa(i)) {
					const { message: n } = Et("MISSING_OR_INVALID", `disconnect() params: ${i}`);
					throw new Error(n);
				}
				const { topic: s } = i;
				await this.isValidPairingTopic(s);
			}), d(this, "isValidPairingTopic", async (i) => {
				if (!it(i, !1)) {
					const { message: s } = Et("MISSING_OR_INVALID", `pairing topic should be a string: ${i}`);
					throw new Error(s);
				}
				if (!this.pairings.keys.includes(i)) {
					const { message: s } = Et("NO_MATCHING_KEY", `pairing topic doesn't exist: ${i}`);
					throw new Error(s);
				}
				if (fi$1(this.pairings.get(i).expiry)) {
					await this.deletePairing(i);
					const { message: s } = Et("EXPIRED", `pairing topic: ${i}`);
					throw new Error(s);
				}
			}), this.core = e, this.logger = E(t, this.name), this.pairings = new Ui(this.core, this.logger, this.name, this.storagePrefix);
		}
		get context() {
			return y$1(this.logger);
		}
		isInitialized() {
			if (!this.initialized) {
				const { message: e } = Et("NOT_INITIALIZED", this.name);
				throw new Error(e);
			}
		}
		registerRelayerEvents() {
			this.core.relayer.on(C.message, async (e) => {
				const { topic: t, message: i, transportType: s } = e;
				if (this.pairings.keys.includes(t) && s !== ee.link_mode && !this.ignoredPayloadTypes.includes(this.core.crypto.getPayloadType(i))) try {
					const n = await this.core.crypto.decode(t, i);
					isJsonRpcRequest(n) ? (this.core.history.set(t, n), await this.onRelayEventRequest({
						topic: t,
						payload: n
					})) : isJsonRpcResponse(n) && (await this.core.history.resolve(n), await this.onRelayEventResponse({
						topic: t,
						payload: n
					}), this.core.history.delete(t, n.id)), await this.core.relayer.messages.ack(t, i);
				} catch (n) {
					this.logger.error(n);
				}
			});
		}
		registerExpirerEvents() {
			this.core.expirer.on(q.expired, async (e) => {
				const { topic: t } = si$1(e.target);
				t && this.pairings.keys.includes(t) && (await this.deletePairing(t, !0), this.events.emit(ae.expire, { topic: t }));
			});
		}
	};
	Mo = Object.defineProperty, Ko = (r, e, t) => e in r ? Mo(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, N = (r, e, t) => Ko(r, typeof e != "symbol" ? e + "" : e, t);
	Mi = class extends I {
		constructor(e, t) {
			super(e, t), this.core = e, this.logger = t, N(this, "records", /* @__PURE__ */ new Map()), N(this, "events", new EventEmitter()), N(this, "name", qt), N(this, "version", "0.3"), N(this, "cached", []), N(this, "initialized", !1), N(this, "storagePrefix", W), N(this, "init", async () => {
				this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i) => this.records.set(i.id, i)), this.cached = [], this.registerEventListeners(), this.initialized = !0);
			}), N(this, "set", (i, s, n) => {
				if (this.isInitialized(), this.logger.debug("Setting JSON-RPC request history record"), this.logger.trace({
					type: "method",
					method: "set",
					topic: i,
					request: s,
					chainId: n
				}), this.records.has(s.id)) return;
				const o = {
					id: s.id,
					topic: i,
					request: {
						method: s.method,
						params: s.params || null
					},
					chainId: n,
					expiry: ii$1(import_cjs.THIRTY_DAYS)
				};
				this.records.set(o.id, o), this.persist(), this.events.emit(V.created, o);
			}), N(this, "resolve", async (i) => {
				if (this.isInitialized(), this.logger.debug("Updating JSON-RPC response history record"), this.logger.trace({
					type: "method",
					method: "update",
					response: i
				}), !this.records.has(i.id)) return;
				const s = await this.getRecord(i.id);
				typeof s.response > "u" && (s.response = isJsonRpcError(i) ? { error: i.error } : { result: i.result }, this.records.set(s.id, s), this.persist(), this.events.emit(V.updated, s));
			}), N(this, "get", async (i, s) => (this.isInitialized(), this.logger.debug("Getting record"), this.logger.trace({
				type: "method",
				method: "get",
				topic: i,
				id: s
			}), await this.getRecord(s))), N(this, "delete", (i, s) => {
				this.isInitialized(), this.logger.debug("Deleting record"), this.logger.trace({
					type: "method",
					method: "delete",
					id: s
				}), this.values.forEach((n) => {
					if (n.topic === i) {
						if (typeof s < "u" && n.id !== s) return;
						this.records.delete(n.id), this.events.emit(V.deleted, n);
					}
				}), this.persist();
			}), N(this, "exists", async (i, s) => (this.isInitialized(), this.records.has(s) ? (await this.getRecord(s)).topic === i : !1)), N(this, "on", (i, s) => {
				this.events.on(i, s);
			}), N(this, "once", (i, s) => {
				this.events.once(i, s);
			}), N(this, "off", (i, s) => {
				this.events.off(i, s);
			}), N(this, "removeListener", (i, s) => {
				this.events.removeListener(i, s);
			}), this.logger = E(t, this.name);
		}
		get context() {
			return y$1(this.logger);
		}
		get storageKey() {
			return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
		}
		get size() {
			return this.records.size;
		}
		get keys() {
			return Array.from(this.records.keys());
		}
		get values() {
			return Array.from(this.records.values());
		}
		get pending() {
			const e = [];
			return this.values.forEach((t) => {
				if (typeof t.response < "u") return;
				const i = {
					topic: t.topic,
					request: formatJsonRpcRequest(t.request.method, t.request.params, t.id),
					chainId: t.chainId
				};
				return e.push(i);
			}), e;
		}
		async setJsonRpcRecords(e) {
			await this.core.storage.setItem(this.storageKey, e);
		}
		async getJsonRpcRecords() {
			return await this.core.storage.getItem(this.storageKey);
		}
		getRecord(e) {
			this.isInitialized();
			const t = this.records.get(e);
			if (!t) {
				const { message: i } = Et("NO_MATCHING_KEY", `${this.name}: ${e}`);
				throw new Error(i);
			}
			return t;
		}
		async persist() {
			await this.setJsonRpcRecords(this.values), this.events.emit(V.sync);
		}
		async restore() {
			try {
				const e = await this.getJsonRpcRecords();
				if (typeof e > "u" || !e.length) return;
				if (this.records.size) {
					const { message: t } = Et("RESTORE_WILL_OVERRIDE", this.name);
					throw this.logger.error(t), new Error(t);
				}
				this.cached = e, this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({
					type: "method",
					method: "restore",
					records: this.values
				});
			} catch (e) {
				this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(e);
			}
		}
		registerEventListeners() {
			this.events.on(V.created, (e) => {
				const t = V.created;
				this.logger.info(`Emitting ${t}`), this.logger.debug({
					type: "event",
					event: t,
					record: e
				});
			}), this.events.on(V.updated, (e) => {
				const t = V.updated;
				this.logger.info(`Emitting ${t}`), this.logger.debug({
					type: "event",
					event: t,
					record: e
				});
			}), this.events.on(V.deleted, (e) => {
				const t = V.deleted;
				this.logger.info(`Emitting ${t}`), this.logger.debug({
					type: "event",
					event: t,
					record: e
				});
			}), this.core.heartbeat.on(r$1.pulse, () => {
				this.cleanup();
			});
		}
		cleanup() {
			try {
				this.isInitialized();
				let e = !1;
				this.records.forEach((t) => {
					(0, import_cjs.toMiliseconds)(t.expiry || 0) - Date.now() <= 0 && (this.logger.info(`Deleting expired history log: ${t.id}`), this.records.delete(t.id), this.events.emit(V.deleted, t, !1), e = !0);
				}), e && this.persist();
			} catch (e) {
				this.logger.warn(e);
			}
		}
		isInitialized() {
			if (!this.initialized) {
				const { message: e } = Et("NOT_INITIALIZED", this.name);
				throw new Error(e);
			}
		}
	};
	Bo = Object.defineProperty, Vo = (r, e, t) => e in r ? Bo(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, z = (r, e, t) => Vo(r, typeof e != "symbol" ? e + "" : e, t);
	Ki = class extends S {
		constructor(e, t) {
			super(e, t), this.core = e, this.logger = t, z(this, "expirations", /* @__PURE__ */ new Map()), z(this, "events", new EventEmitter()), z(this, "name", Wt), z(this, "version", "0.3"), z(this, "cached", []), z(this, "initialized", !1), z(this, "storagePrefix", W), z(this, "init", async () => {
				this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i) => this.expirations.set(i.target, i)), this.cached = [], this.registerEventListeners(), this.initialized = !0);
			}), z(this, "has", (i) => {
				try {
					const s = this.formatTarget(i);
					return typeof this.getExpiration(s) < "u";
				} catch {
					return !1;
				}
			}), z(this, "set", (i, s) => {
				this.isInitialized();
				const n = this.formatTarget(i), o = {
					target: n,
					expiry: s
				};
				this.expirations.set(n, o), this.checkExpiry(n, o), this.events.emit(q.created, {
					target: n,
					expiration: o
				});
			}), z(this, "get", (i) => {
				this.isInitialized();
				const s = this.formatTarget(i);
				return this.getExpiration(s);
			}), z(this, "del", (i) => {
				if (this.isInitialized(), this.has(i)) {
					const s = this.formatTarget(i), n = this.getExpiration(s);
					this.expirations.delete(s), this.events.emit(q.deleted, {
						target: s,
						expiration: n
					});
				}
			}), z(this, "on", (i, s) => {
				this.events.on(i, s);
			}), z(this, "once", (i, s) => {
				this.events.once(i, s);
			}), z(this, "off", (i, s) => {
				this.events.off(i, s);
			}), z(this, "removeListener", (i, s) => {
				this.events.removeListener(i, s);
			}), this.logger = E(t, this.name);
		}
		get context() {
			return y$1(this.logger);
		}
		get storageKey() {
			return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
		}
		get length() {
			return this.expirations.size;
		}
		get keys() {
			return Array.from(this.expirations.keys());
		}
		get values() {
			return Array.from(this.expirations.values());
		}
		formatTarget(e) {
			if (typeof e == "string") return ri$1(e);
			if (typeof e == "number") return oi$1(e);
			const { message: t } = Et("UNKNOWN_TYPE", `Target type: ${typeof e}`);
			throw new Error(t);
		}
		async setExpirations(e) {
			await this.core.storage.setItem(this.storageKey, e);
		}
		async getExpirations() {
			return await this.core.storage.getItem(this.storageKey);
		}
		async persist() {
			await this.setExpirations(this.values), this.events.emit(q.sync);
		}
		async restore() {
			try {
				const e = await this.getExpirations();
				if (typeof e > "u" || !e.length) return;
				if (this.expirations.size) {
					const { message: t } = Et("RESTORE_WILL_OVERRIDE", this.name);
					throw this.logger.error(t), new Error(t);
				}
				this.cached = e, this.logger.debug(`Successfully Restored expirations for ${this.name}`), this.logger.trace({
					type: "method",
					method: "restore",
					expirations: this.values
				});
			} catch (e) {
				this.logger.debug(`Failed to Restore expirations for ${this.name}`), this.logger.error(e);
			}
		}
		getExpiration(e) {
			const t = this.expirations.get(e);
			if (!t) {
				const { message: i } = Et("NO_MATCHING_KEY", `${this.name}: ${e}`);
				throw this.logger.warn(i), new Error(i);
			}
			return t;
		}
		checkExpiry(e, t) {
			const { expiry: i } = t;
			(0, import_cjs.toMiliseconds)(i) - Date.now() <= 0 && this.expire(e, t);
		}
		expire(e, t) {
			this.expirations.delete(e), this.events.emit(q.expired, {
				target: e,
				expiration: t
			});
		}
		checkExpirations() {
			this.core.relayer.connected && this.expirations.forEach((e, t) => this.checkExpiry(t, e));
		}
		registerEventListeners() {
			this.core.heartbeat.on(r$1.pulse, () => this.checkExpirations()), this.events.on(q.created, (e) => {
				const t = q.created;
				this.logger.info(`Emitting ${t}`), this.logger.debug({
					type: "event",
					event: t,
					data: e
				}), this.persist();
			}), this.events.on(q.expired, (e) => {
				const t = q.expired;
				this.logger.info(`Emitting ${t}`), this.logger.debug({
					type: "event",
					event: t,
					data: e
				}), this.persist();
			}), this.events.on(q.deleted, (e) => {
				const t = q.deleted;
				this.logger.info(`Emitting ${t}`), this.logger.debug({
					type: "event",
					event: t,
					data: e
				}), this.persist();
			});
		}
		isInitialized() {
			if (!this.initialized) {
				const { message: e } = Et("NOT_INITIALIZED", this.name);
				throw new Error(e);
			}
		}
	};
	qo = Object.defineProperty, Go = (r, e, t) => e in r ? qo(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, P = (r, e, t) => Go(r, typeof e != "symbol" ? e + "" : e, t);
	Bi = class extends M$2 {
		constructor(e, t, i) {
			super(e, t, i), this.core = e, this.logger = t, this.store = i, P(this, "name", Yt), P(this, "abortController"), P(this, "isDevEnv"), P(this, "verifyUrlV3", Xt), P(this, "storagePrefix", W), P(this, "version", 2), P(this, "publicKey"), P(this, "fetchPromise"), P(this, "init", async () => {
				var s;
				this.isDevEnv || (this.publicKey = await this.store.getItem(this.storeKey), this.publicKey && (0, import_cjs.toMiliseconds)((s = this.publicKey) == null ? void 0 : s.expiresAt) < Date.now() && (this.logger.debug("verify v2 public key expired"), await this.removePublicKey()));
			}), P(this, "register", async (s) => {
				if (!zt$1() || this.isDevEnv) return;
				const n = window.location.origin, { id: o, decryptedId: a } = s, c = `${this.verifyUrlV3}/attestation?projectId=${this.core.projectId}&origin=${n}&id=${o}&decryptedId=${a}`;
				try {
					const h = (0, import_cjs$1.getDocument)(), l = this.startAbortTimer(import_cjs.ONE_SECOND * 5), p = await new Promise((y, w) => {
						const u = () => {
							window.removeEventListener("message", D), h.body.removeChild(m), w("attestation aborted");
						};
						this.abortController.signal.addEventListener("abort", u);
						const m = h.createElement("iframe");
						m.src = c, m.style.display = "none", m.addEventListener("error", u, { signal: this.abortController.signal });
						const D = (_) => {
							if (_.data && typeof _.data == "string") try {
								const E = JSON.parse(_.data);
								if (E.type === "verify_attestation") {
									if (sn$2(E.attestation).payload.id !== o) return;
									clearInterval(l), h.body.removeChild(m), this.abortController.signal.removeEventListener("abort", u), window.removeEventListener("message", D), y(E.attestation === null ? "" : E.attestation);
								}
							} catch (E) {
								this.logger.warn(E);
							}
						};
						h.body.appendChild(m), window.addEventListener("message", D, { signal: this.abortController.signal });
					});
					return this.logger.debug("jwt attestation", p), p;
				} catch (h) {
					this.logger.warn(h);
				}
				return "";
			}), P(this, "resolve", async (s) => {
				if (this.isDevEnv) return "";
				const { attestationId: n, hash: o, encryptedId: a } = s;
				if (n === "") {
					this.logger.debug("resolve: attestationId is empty, skipping");
					return;
				}
				if (n) {
					if (sn$2(n).payload.id !== a) return;
					const h = await this.isValidJwtAttestation(n);
					if (h) {
						if (!h.isVerified) {
							this.logger.warn("resolve: jwt attestation: origin url not verified");
							return;
						}
						return h;
					}
				}
				if (!o) return;
				const c = this.getVerifyUrl(s?.verifyUrl);
				return this.fetchAttestation(o, c);
			}), P(this, "fetchAttestation", async (s, n) => {
				this.logger.debug(`resolving attestation: ${s} from url: ${n}`);
				const o = this.startAbortTimer(import_cjs.ONE_SECOND * 5), a = await fetch(`${n}/attestation/${s}?v2Supported=true`, { signal: this.abortController.signal });
				return clearTimeout(o), a.status === 200 ? await a.json() : void 0;
			}), P(this, "getVerifyUrl", (s) => {
				let n = s || "https://verify.walletconnect.org";
				return Zt.includes(n) || (this.logger.info(`verify url: ${n}, not included in trusted list, assigning default: https://verify.walletconnect.org`), n = "https://verify.walletconnect.org"), n;
			}), P(this, "fetchPublicKey", async () => {
				try {
					this.logger.debug(`fetching public key from: ${this.verifyUrlV3}`);
					const s = this.startAbortTimer(import_cjs.FIVE_SECONDS), n = await fetch(`${this.verifyUrlV3}/public-key`, { signal: this.abortController.signal });
					return clearTimeout(s), await n.json();
				} catch (s) {
					this.logger.warn(s);
				}
			}), P(this, "persistPublicKey", async (s) => {
				this.logger.debug("persisting public key to local storage", s), await this.store.setItem(this.storeKey, s), this.publicKey = s;
			}), P(this, "removePublicKey", async () => {
				this.logger.debug("removing verify v2 public key from storage"), await this.store.removeItem(this.storeKey), this.publicKey = void 0;
			}), P(this, "isValidJwtAttestation", async (s) => {
				const n = await this.getPublicKey();
				try {
					if (n) return this.validateAttestation(s, n);
				} catch (a) {
					this.logger.error(a), this.logger.warn("error validating attestation");
				}
				const o = await this.fetchAndPersistPublicKey();
				try {
					if (o) return this.validateAttestation(s, o);
				} catch (a) {
					this.logger.error(a), this.logger.warn("error validating attestation");
				}
			}), P(this, "getPublicKey", async () => this.publicKey ? this.publicKey : await this.fetchAndPersistPublicKey()), P(this, "fetchAndPersistPublicKey", async () => {
				if (this.fetchPromise) return await this.fetchPromise, this.publicKey;
				this.fetchPromise = new Promise(async (n) => {
					const o = await this.fetchPublicKey();
					o && (await this.persistPublicKey(o), n(o));
				});
				const s = await this.fetchPromise;
				return this.fetchPromise = void 0, s;
			}), P(this, "validateAttestation", (s, n) => {
				const o = ta$1(s, n.publicKey), a = {
					hasExpired: (0, import_cjs.toMiliseconds)(o.exp) < Date.now(),
					payload: o
				};
				if (a.hasExpired) throw this.logger.warn("resolve: jwt attestation expired"), /* @__PURE__ */ new Error("JWT attestation expired");
				return {
					origin: a.payload.origin,
					isScam: a.payload.isScam,
					isVerified: a.payload.isVerified
				};
			}), this.logger = E(t, this.name), this.abortController = new AbortController(), this.isDevEnv = hi$1(), this.init();
		}
		get storeKey() {
			return this.storagePrefix + this.version + this.core.customStoragePrefix + "//verify:public:key";
		}
		get context() {
			return y$1(this.logger);
		}
		startAbortTimer(e) {
			return this.abortController = new AbortController(), setTimeout(() => this.abortController.abort(), (0, import_cjs.toMiliseconds)(e));
		}
	};
	Wo = Object.defineProperty, Ho = (r, e, t) => e in r ? Wo(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, Vi = (r, e, t) => Ho(r, typeof e != "symbol" ? e + "" : e, t);
	qi = class extends O {
		constructor(e, t) {
			super(e, t), this.projectId = e, this.logger = t, Vi(this, "context", Qt), Vi(this, "registerDeviceToken", async (i) => {
				const { clientId: s, token: n, notificationType: o, enableEncrypted: a = !1 } = i, c = `${ei}/${this.projectId}/clients`;
				await fetch(c, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						client_id: s,
						type: o,
						token: n,
						always_raw: a
					})
				});
			}), this.logger = E(t, this.context);
		}
	};
	Yo = Object.defineProperty, Gi = Object.getOwnPropertySymbols, Jo = Object.prototype.hasOwnProperty, Xo = Object.prototype.propertyIsEnumerable, et = (r, e, t) => e in r ? Yo(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, we = (r, e) => {
		for (var t in e || (e = {})) Jo.call(e, t) && et(r, t, e[t]);
		if (Gi) for (var t of Gi(e)) Xo.call(e, t) && et(r, t, e[t]);
		return r;
	}, R = (r, e, t) => et(r, typeof e != "symbol" ? e + "" : e, t);
	Wi = class extends R$1 {
		constructor(e, t, i = !0) {
			super(e, t, i), this.core = e, this.logger = t, R(this, "context", ii), R(this, "storagePrefix", W), R(this, "storageVersion", ti), R(this, "events", /* @__PURE__ */ new Map()), R(this, "shouldPersist", !1), R(this, "init", async () => {
				if (!hi$1()) try {
					const s = {
						eventId: di$1(),
						timestamp: Date.now(),
						domain: this.getAppDomain(),
						props: {
							event: "INIT",
							type: "",
							properties: {
								client_id: await this.core.crypto.getClientId(),
								user_agent: cr$1(this.core.relayer.protocol, this.core.relayer.version, Pe)
							}
						}
					};
					await this.sendEvent([s]);
				} catch (s) {
					this.logger.warn(s);
				}
			}), R(this, "createEvent", (s) => {
				const { event: n = "ERROR", type: o = "", properties: { topic: a, trace: c } } = s, h = di$1(), l = this.core.projectId || "", y = we({
					eventId: h,
					timestamp: Date.now(),
					props: {
						event: n,
						type: o,
						properties: {
							topic: a,
							trace: c
						}
					},
					bundleId: l,
					domain: this.getAppDomain()
				}, this.setMethods(h));
				return this.telemetryEnabled && (this.events.set(h, y), this.shouldPersist = !0), y;
			}), R(this, "getEvent", (s) => {
				const { eventId: n, topic: o } = s;
				if (n) return this.events.get(n);
				const a = Array.from(this.events.values()).find((c) => c.props.properties.topic === o);
				if (a) return we(we({}, a), this.setMethods(a.eventId));
			}), R(this, "deleteEvent", (s) => {
				const { eventId: n } = s;
				this.events.delete(n), this.shouldPersist = !0;
			}), R(this, "setEventListeners", () => {
				this.core.heartbeat.on(r$1.pulse, async () => {
					this.shouldPersist && await this.persist(), this.events.forEach((s) => {
						(0, import_cjs.fromMiliseconds)(Date.now()) - (0, import_cjs.fromMiliseconds)(s.timestamp) > 86400 && (this.events.delete(s.eventId), this.shouldPersist = !0);
					});
				});
			}), R(this, "setMethods", (s) => ({
				addTrace: (n) => this.addTrace(s, n),
				setError: (n) => this.setError(s, n)
			})), R(this, "addTrace", (s, n) => {
				const o = this.events.get(s);
				o && (o.props.properties.trace.push(n), this.events.set(s, o), this.shouldPersist = !0);
			}), R(this, "setError", (s, n) => {
				const o = this.events.get(s);
				o && (o.props.type = n, o.timestamp = Date.now(), this.events.set(s, o), this.shouldPersist = !0);
			}), R(this, "persist", async () => {
				await this.core.storage.setItem(this.storageKey, Array.from(this.events.values())), this.shouldPersist = !1;
			}), R(this, "restore", async () => {
				try {
					const s = await this.core.storage.getItem(this.storageKey) || [];
					if (!s.length) return;
					s.forEach((n) => {
						this.events.set(n.eventId, we(we({}, n), this.setMethods(n.eventId)));
					});
				} catch (s) {
					this.logger.warn(s);
				}
			}), R(this, "submit", async () => {
				if (!this.telemetryEnabled || this.events.size === 0) return;
				const s = [];
				for (const [n, o] of this.events) o.props.type && s.push(o);
				if (s.length !== 0) try {
					if ((await this.sendEvent(s)).ok) for (const n of s) this.events.delete(n.eventId), this.shouldPersist = !0;
				} catch (n) {
					this.logger.warn(n);
				}
			}), R(this, "sendEvent", async (s) => {
				const n = this.getAppDomain() ? "" : "&sp=desktop";
				return await fetch(`${ri}?projectId=${this.core.projectId}&st=events_sdk&sv=js-${Pe}${n}`, {
					method: "POST",
					body: JSON.stringify(s)
				});
			}), R(this, "getAppDomain", () => sr$1().url), this.logger = E(t, this.context), this.telemetryEnabled = i, i ? this.restore().then(async () => {
				await this.submit(), this.setEventListeners();
			}) : this.persist();
		}
		get storageKey() {
			return this.storagePrefix + this.storageVersion + this.core.customStoragePrefix + "//" + this.context;
		}
	};
	Zo = Object.defineProperty, Hi = Object.getOwnPropertySymbols, Qo = Object.prototype.hasOwnProperty, ea = Object.prototype.propertyIsEnumerable, tt = (r, e, t) => e in r ? Zo(r, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : r[e] = t, Yi = (r, e) => {
		for (var t in e || (e = {})) Qo.call(e, t) && tt(r, t, e[t]);
		if (Hi) for (var t of Hi(e)) ea.call(e, t) && tt(r, t, e[t]);
		return r;
	}, v = (r, e, t) => tt(r, typeof e != "symbol" ? e + "" : e, t);
	Oe = class Oe extends h$1 {
		constructor(e) {
			var t;
			super(e), v(this, "protocol", "wc"), v(this, "version", 2), v(this, "name", pe), v(this, "relayUrl"), v(this, "projectId"), v(this, "customStoragePrefix"), v(this, "events", new EventEmitter()), v(this, "logger"), v(this, "heartbeat"), v(this, "relayer"), v(this, "crypto"), v(this, "storage"), v(this, "history"), v(this, "expirer"), v(this, "pairing"), v(this, "verify"), v(this, "echoClient"), v(this, "linkModeSupportedApps"), v(this, "eventClient"), v(this, "initialized", !1), v(this, "logChunkController"), v(this, "on", (a, c) => this.events.on(a, c)), v(this, "once", (a, c) => this.events.once(a, c)), v(this, "off", (a, c) => this.events.off(a, c)), v(this, "removeListener", (a, c) => this.events.removeListener(a, c)), v(this, "dispatchEnvelope", ({ topic: a, message: c, sessionExists: h }) => {
				if (!a || !c) return;
				const l = {
					topic: a,
					message: c,
					publishedAt: Date.now(),
					transportType: ee.link_mode
				};
				this.relayer.onLinkMessageEvent(l, { sessionExists: h });
			});
			const i = this.getGlobalCore(e?.customStoragePrefix);
			if (i) try {
				return this.customStoragePrefix = i.customStoragePrefix, this.logger = i.logger, this.heartbeat = i.heartbeat, this.crypto = i.crypto, this.history = i.history, this.expirer = i.expirer, this.storage = i.storage, this.relayer = i.relayer, this.pairing = i.pairing, this.verify = i.verify, this.echoClient = i.echoClient, this.linkModeSupportedApps = i.linkModeSupportedApps, this.eventClient = i.eventClient, this.initialized = i.initialized, this.logChunkController = i.logChunkController, i;
			} catch (a) {
				console.warn("Failed to copy global core", a);
			}
			this.projectId = e?.projectId, this.relayUrl = e?.relayUrl || "wss://relay.walletconnect.org", this.customStoragePrefix = e != null && e.customStoragePrefix ? `:${e.customStoragePrefix}` : "";
			const { logger: n, chunkLoggerController: o } = A$1({
				opts: k$2({
					level: typeof e?.logger == "string" && e.logger ? e.logger : It.logger,
					name: pe
				}),
				maxSizeInBytes: e?.maxLogBlobSizeInBytes,
				loggerOverride: e?.logger
			});
			this.logChunkController = o, (t = this.logChunkController) != null && t.downloadLogsBlobInBrowser && (window.downloadLogsBlobInBrowser = async () => {
				var a, c;
				(a = this.logChunkController) != null && a.downloadLogsBlobInBrowser && ((c = this.logChunkController) == null || c.downloadLogsBlobInBrowser({ clientId: await this.crypto.getClientId() }));
			}), this.logger = E(n, this.name), this.heartbeat = new i$2(), this.crypto = new Ei(this, this.logger, e?.keychain), this.history = new Mi(this, this.logger), this.expirer = new Ki(this, this.logger), this.storage = e != null && e.storage ? e.storage : new h$3(Yi(Yi({}, Tt), e?.storageOptions)), this.relayer = new xi({
				core: this,
				logger: this.logger,
				relayUrl: this.relayUrl,
				projectId: this.projectId
			}), this.pairing = new Fi(this, this.logger), this.verify = new Bi(this, this.logger, this.storage), this.echoClient = new qi(this.projectId || "", this.logger), this.linkModeSupportedApps = [], this.eventClient = new Wi(this, this.logger, e?.telemetryEnabled), this.setGlobalCore(this);
		}
		static async init(e) {
			const t = new Oe(e);
			await t.initialize();
			const i = await t.crypto.getClientId();
			return await t.storage.setItem(Ft, i), t;
		}
		get context() {
			return y$1(this.logger);
		}
		async start() {
			this.initialized || await this.initialize();
		}
		async getLogsBlob() {
			var e;
			return (e = this.logChunkController) == null ? void 0 : e.logsToBlob({ clientId: await this.crypto.getClientId() });
		}
		async addLinkModeSupportedApp(e) {
			this.linkModeSupportedApps.includes(e) || (this.linkModeSupportedApps.push(e), await this.storage.setItem("WALLETCONNECT_LINK_MODE_APPS", this.linkModeSupportedApps));
		}
		async initialize() {
			this.logger.trace("Initialized");
			try {
				await this.crypto.init(), await this.history.init(), await this.expirer.init(), await this.relayer.init(), await this.heartbeat.init(), await this.pairing.init(), this.linkModeSupportedApps = await this.storage.getItem("WALLETCONNECT_LINK_MODE_APPS") || [], this.initialized = !0, this.logger.info("Core Initialization Success");
			} catch (e) {
				throw this.logger.warn(`Core Initialization Failure at epoch ${Date.now()}`, e), this.logger.error(e.message), e;
			}
		}
		getGlobalCore(e = "") {
			try {
				if (this.isGlobalCoreDisabled()) return;
				const t = `_walletConnectCore_${e}`, i = `${t}_count`;
				return globalThis[i] = (globalThis[i] || 0) + 1, globalThis[i] > 1 && console.warn(`WalletConnect Core is already initialized. This is probably a mistake and can lead to unexpected behavior. Init() was called ${globalThis[i]} times.`), globalThis[t];
			} catch (t) {
				console.warn("Failed to get global WalletConnect core", t);
				return;
			}
		}
		setGlobalCore(e) {
			var t;
			try {
				if (this.isGlobalCoreDisabled()) return;
				const i = `_walletConnectCore_${((t = e.opts) == null ? void 0 : t.customStoragePrefix) || ""}`;
				globalThis[i] = e;
			} catch (i) {
				console.warn("Failed to set global WalletConnect core", i);
			}
		}
		isGlobalCoreDisabled() {
			try {
				return typeof process < "u" && process.env.DISABLE_GLOBAL_CORE === "true";
			} catch {
				return !0;
			}
		}
	};
	ta = Oe;
}));
//#endregion
export { Oa as $, safeJsonParse as $t, init_format as A, me$1 as At, Ea as B, zc as Bt, isJsonRpcResult as C, ii$1 as Ct, formatJsonRpcRequest as D, it as Dt, formatJsonRpcError as E, is as Et, Af as F, uf as Ft, Ha as G, init_index_es$7 as Gt, Et as H, init_esm$1 as Ht, Ba as I, ui$1 as It, Ka as J, index_es_exports$2 as Jt, Ia as K, E as Kt, Bf as L, va as Lt, init_error as M, sa as Mt, parseConnectionError as N, sf as Nt, formatJsonRpcResult as O, kt$1 as Ot, Aa as P, si$1 as Pt, Na as Q, init_esm$3 as Qt, Bt$1 as R, ya as Rt, isJsonRpcResponse as S, hi$1 as St, isHttpUrl as T, init_index_es$4 as Tt, Fc as U, J$3 as Ut, Ef as V, esm_default as Vt, Fe$1 as W, V$1 as Wt, Kt$1 as X, k$2 as Xt, Ks as Y, init_index_es$8 as Yt, La as Z, y$1 as Zt, esm_exports as _, ff as _t, ae as a, init_parseAbi as an, Ua as at, isJsonRpcError as b, ga as bt, ee as c, init_formatAbi as cn, _a as ct, or as d, ba as dt, safeJsonStringify as en, Oe$1 as et, q as f, cf as ft, init_index_es$2 as g, ei$1 as gt, index_es_exports as h, dn$1 as ht, Y as i, parseAbiItem as in, Ta as it, payloadId as j, qr$1 as jt, getBigIntRpcId as k, li$1 as kt, init_index_es as l, formatAbiParameters as ln, af as lt, ta as m, cs as mt, Ui as n, init_exports as nn, Ra as nt, ar as o, parseAbi as on, Ve$1 as ot, rr as p, ci$1 as pt, If as q, import_pino$1 as qt, X as r, init_parseAbiItem as rn, Sa as rt, be as s, formatAbi as sn, Vr$1 as st, C as t, require_cjs$3 as tn, Qt$1 as tt, nr as u, init_formatAbiParameters as un, ai$1 as ut, init_esm as v, fi$1 as vt, init_url as w, index_es_exports$1 as wt, isJsonRpcRequest as x, gi$1 as xt, init_validators as y, fs as yt, De$1 as z, yf as zt };
