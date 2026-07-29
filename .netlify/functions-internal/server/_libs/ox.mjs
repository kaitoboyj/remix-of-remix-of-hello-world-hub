import { Jo as init_sha3, Yo as keccak_256, h as secp256k1 } from "./@base-org/account+[...].mjs";
import { nn as init_exports } from "./@walletconnect/core+[...].mjs";
//#region node_modules/ox/_esm/core/version.js
/** @internal */
var version = "0.1.1";
//#endregion
//#region node_modules/ox/_esm/core/internal/errors.js
/** @internal */
function getVersion() {
	return version;
}
//#endregion
//#region node_modules/ox/_esm/core/Errors.js
/**
* Base error class inherited by all errors thrown by ox.
*
* @example
* ```ts
* import { Errors } from 'ox'
* throw new Errors.BaseError('An error occurred')
* ```
*/
var BaseError = class BaseError extends Error {
	constructor(shortMessage, options = {}) {
		const details = (() => {
			if (options.cause instanceof BaseError) {
				if (options.cause.details) return options.cause.details;
				if (options.cause.shortMessage) return options.cause.shortMessage;
			}
			if (options.cause && "details" in options.cause && typeof options.cause.details === "string") return options.cause.details;
			if (options.cause?.message) return options.cause.message;
			return options.details;
		})();
		const docsPath = (() => {
			if (options.cause instanceof BaseError) return options.cause.docsPath || options.docsPath;
			return options.docsPath;
		})();
		const docs = `https://oxlib.sh${docsPath ?? ""}`;
		const message = [
			shortMessage || "An error occurred.",
			...options.metaMessages ? ["", ...options.metaMessages] : [],
			...details || docsPath ? [
				"",
				details ? `Details: ${details}` : void 0,
				docsPath ? `See: ${docs}` : void 0
			] : []
		].filter((x) => typeof x === "string").join("\n");
		super(message, options.cause ? { cause: options.cause } : void 0);
		Object.defineProperty(this, "details", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "docs", {
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
		Object.defineProperty(this, "shortMessage", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "cause", {
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
		Object.defineProperty(this, "version", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: `ox@${getVersion()}`
		});
		this.cause = options.cause;
		this.details = details;
		this.docs = docs;
		this.docsPath = docsPath;
		this.shortMessage = shortMessage;
	}
	walk(fn) {
		return walk(this, fn);
	}
};
/** @internal */
function walk(err, fn) {
	if (fn?.(err)) return err;
	if (err && typeof err === "object" && "cause" in err && err.cause) return walk(err.cause, fn);
	return fn ? null : err;
}
//#endregion
//#region node_modules/ox/_esm/core/Json.js
var bigIntSuffix = "#__bigint";
/**
* Stringifies a value to its JSON representation, with support for `bigint`.
*
* @example
* ```ts twoslash
* import { Json } from 'ox'
*
* const json = Json.stringify({
*   foo: 'bar',
*   baz: 69420694206942069420694206942069420694206942069420n,
* })
* // @log: '{"foo":"bar","baz":"69420694206942069420694206942069420694206942069420#__bigint"}'
* ```
*
* @param value - The value to stringify.
* @param replacer - A function that transforms the results. It is passed the key and value of the property, and must return the value to be used in the JSON string. If this function returns `undefined`, the property is not included in the resulting JSON string.
* @param space - A string or number that determines the indentation of the JSON string. If it is a number, it indicates the number of spaces to use as indentation; if it is a string (e.g. `'\t'`), it uses the string as the indentation character.
* @returns The JSON string.
*/
function stringify(value, replacer, space) {
	return JSON.stringify(value, (key, value) => {
		if (typeof replacer === "function") return replacer(key, value);
		if (typeof value === "bigint") return value.toString() + bigIntSuffix;
		return value;
	}, space);
}
//#endregion
//#region node_modules/ox/_esm/core/internal/bytes.js
/** @internal */
function assertSize$1(bytes, size_) {
	if (size(bytes) > size_) throw new SizeOverflowError({
		givenSize: size(bytes),
		maxSize: size_
	});
}
/** @internal */
var charCodeMap = {
	zero: 48,
	nine: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
/** @internal */
function charCodeToBase16(char) {
	if (char >= charCodeMap.zero && char <= charCodeMap.nine) return char - charCodeMap.zero;
	if (char >= charCodeMap.A && char <= charCodeMap.F) return char - (charCodeMap.A - 10);
	if (char >= charCodeMap.a && char <= charCodeMap.f) return char - (charCodeMap.a - 10);
}
/** @internal */
function pad$1(bytes, options = {}) {
	const { dir, size = 32 } = options;
	if (size === 0) return bytes;
	if (bytes.length > size) throw new SizeExceedsPaddingSizeError({
		size: bytes.length,
		targetSize: size,
		type: "Bytes"
	});
	const paddedBytes = new Uint8Array(size);
	for (let i = 0; i < size; i++) {
		const padEnd = dir === "right";
		paddedBytes[padEnd ? i : size - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
	}
	return paddedBytes;
}
/** @internal */
function trim$1(value, options = {}) {
	const { dir = "left" } = options;
	let data = value;
	let sliceLength = 0;
	for (let i = 0; i < data.length - 1; i++) if (data[dir === "left" ? i : data.length - i - 1].toString() === "0") sliceLength++;
	else break;
	data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
	return data;
}
//#endregion
//#region node_modules/ox/_esm/core/internal/hex.js
/** @internal */
function assertSize(hex, size_) {
	if (size$1(hex) > size_) throw new SizeOverflowError$1({
		givenSize: size$1(hex),
		maxSize: size_
	});
}
/** @internal */
function assertStartOffset(value, start) {
	if (typeof start === "number" && start > 0 && start > size$1(value) - 1) throw new SliceOffsetOutOfBoundsError$1({
		offset: start,
		position: "start",
		size: size$1(value)
	});
}
/** @internal */
function assertEndOffset(value, start, end) {
	if (typeof start === "number" && typeof end === "number" && size$1(value) !== end - start) throw new SliceOffsetOutOfBoundsError$1({
		offset: end,
		position: "end",
		size: size$1(value)
	});
}
/** @internal */
function pad(hex_, options = {}) {
	const { dir, size = 32 } = options;
	if (size === 0) return hex_;
	const hex = hex_.replace("0x", "");
	if (hex.length > size * 2) throw new SizeExceedsPaddingSizeError$1({
		size: Math.ceil(hex.length / 2),
		targetSize: size,
		type: "Hex"
	});
	return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size * 2, "0")}`;
}
/** @internal */
function trim(value, options = {}) {
	const { dir = "left" } = options;
	let data = value.replace("0x", "");
	let sliceLength = 0;
	for (let i = 0; i < data.length - 1; i++) if (data[dir === "left" ? i : data.length - i - 1].toString() === "0") sliceLength++;
	else break;
	data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
	if (data === "0") return "0x";
	if (dir === "right" && data.length % 2 === 1) return `0x${data}0`;
	return `0x${data}`;
}
//#endregion
//#region node_modules/ox/_esm/core/Hex.js
var encoder$1 = /*#__PURE__*/ new TextEncoder();
var hexes = /*#__PURE__*/ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
/**
* Asserts if the given value is {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.assert('abc')
* // @error: InvalidHexValueTypeError:
* // @error: Value `"abc"` of type `string` is an invalid hex type.
* // @error: Hex types must be represented as `"0x\${string}"`.
* ```
*
* @param value - The value to assert.
* @param options - Options.
*/
function assert$7(value, options = {}) {
	const { strict = false } = options;
	if (!value) throw new InvalidHexTypeError(value);
	if (typeof value !== "string") throw new InvalidHexTypeError(value);
	if (strict) {
		if (!/^0x[0-9a-fA-F]*$/.test(value)) throw new InvalidHexValueError(value);
	}
	if (!value.startsWith("0x")) throw new InvalidHexValueError(value);
}
/**
* Concatenates two or more {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.concat('0x123', '0x456')
* // @log: '0x123456'
* ```
*
* @param values - The {@link ox#Hex.Hex} values to concatenate.
* @returns The concatenated {@link ox#Hex.Hex} value.
*/
function concat$1(...values) {
	return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
/**
* Instantiates a {@link ox#Hex.Hex} value from a hex string or {@link ox#Bytes.Bytes} value.
*
* :::tip
*
* To instantiate from a **Boolean**, **String**, or **Number**, use one of the following:
*
* - `Hex.fromBoolean`
*
* - `Hex.fromString`
*
* - `Hex.fromNumber`
*
* :::
*
* @example
* ```ts twoslash
* import { Bytes, Hex } from 'ox'
*
* Hex.from('0x48656c6c6f20576f726c6421')
* // @log: '0x48656c6c6f20576f726c6421'
*
* Hex.from(Bytes.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]))
* // @log: '0x48656c6c6f20576f726c6421'
* ```
*
* @param value - The {@link ox#Bytes.Bytes} value to encode.
* @returns The encoded {@link ox#Hex.Hex} value.
*/
function from$4(value) {
	if (value instanceof Uint8Array) return fromBytes$1(value);
	if (Array.isArray(value)) return fromBytes$1(new Uint8Array(value));
	return value;
}
/**
* Encodes a boolean into a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.fromBoolean(true)
* // @log: '0x1'
*
* Hex.fromBoolean(false)
* // @log: '0x0'
*
* Hex.fromBoolean(true, { size: 32 })
* // @log: '0x0000000000000000000000000000000000000000000000000000000000000001'
* ```
*
* @param value - The boolean value to encode.
* @param options - Options.
* @returns The encoded {@link ox#Hex.Hex} value.
*/
function fromBoolean$1(value, options = {}) {
	const hex = `0x${Number(value)}`;
	if (typeof options.size === "number") {
		assertSize(hex, options.size);
		return padLeft$1(hex, options.size);
	}
	return hex;
}
/**
* Encodes a {@link ox#Bytes.Bytes} value into a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { Bytes, Hex } from 'ox'
*
* Hex.fromBytes(Bytes.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]))
* // @log: '0x48656c6c6f20576f726c6421'
* ```
*
* @param value - The {@link ox#Bytes.Bytes} value to encode.
* @param options - Options.
* @returns The encoded {@link ox#Hex.Hex} value.
*/
function fromBytes$1(value, options = {}) {
	let string = "";
	for (let i = 0; i < value.length; i++) string += hexes[value[i]];
	const hex = `0x${string}`;
	if (typeof options.size === "number") {
		assertSize(hex, options.size);
		return padRight$1(hex, options.size);
	}
	return hex;
}
/**
* Encodes a number or bigint into a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.fromNumber(420)
* // @log: '0x1a4'
*
* Hex.fromNumber(420, { size: 32 })
* // @log: '0x00000000000000000000000000000000000000000000000000000000000001a4'
* ```
*
* @param value - The number or bigint value to encode.
* @param options - Options.
* @returns The encoded {@link ox#Hex.Hex} value.
*/
function fromNumber$1(value, options = {}) {
	const { signed, size } = options;
	const value_ = BigInt(value);
	let maxValue;
	if (size) if (signed) maxValue = (1n << BigInt(size) * 8n - 1n) - 1n;
	else maxValue = 2n ** (BigInt(size) * 8n) - 1n;
	else if (typeof value === "number") maxValue = BigInt(Number.MAX_SAFE_INTEGER);
	const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
	if (maxValue && value_ > maxValue || value_ < minValue) {
		const suffix = typeof value === "bigint" ? "n" : "";
		throw new IntegerOutOfRangeError({
			max: maxValue ? `${maxValue}${suffix}` : void 0,
			min: `${minValue}${suffix}`,
			signed,
			size,
			value: `${value}${suffix}`
		});
	}
	const hex = `0x${(signed && value_ < 0 ? (1n << BigInt(size * 8)) + BigInt(value_) : value_).toString(16)}`;
	if (size) return padLeft$1(hex, size);
	return hex;
}
/**
* Encodes a string into a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
* Hex.fromString('Hello World!')
* // '0x48656c6c6f20576f726c6421'
*
* Hex.fromString('Hello World!', { size: 32 })
* // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
* ```
*
* @param value - The string value to encode.
* @param options - Options.
* @returns The encoded {@link ox#Hex.Hex} value.
*/
function fromString$1(value, options = {}) {
	return fromBytes$1(encoder$1.encode(value), options);
}
/**
* Pads a {@link ox#Hex.Hex} value to the left with zero bytes until it reaches the given `size` (default: 32 bytes).
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.padLeft('0x1234', 4)
* // @log: '0x00001234'
* ```
*
* @param value - The {@link ox#Hex.Hex} value to pad.
* @param size - The size (in bytes) of the output hex value.
* @returns The padded {@link ox#Hex.Hex} value.
*/
function padLeft$1(value, size) {
	return pad(value, {
		dir: "left",
		size
	});
}
/**
* Pads a {@link ox#Hex.Hex} value to the right with zero bytes until it reaches the given `size` (default: 32 bytes).
*
* @example
* ```ts
* import { Hex } from 'ox'
*
* Hex.padRight('0x1234', 4)
* // @log: '0x12340000'
* ```
*
* @param value - The {@link ox#Hex.Hex} value to pad.
* @param size - The size (in bytes) of the output hex value.
* @returns The padded {@link ox#Hex.Hex} value.
*/
function padRight$1(value, size) {
	return pad(value, {
		dir: "right",
		size
	});
}
/**
* Returns a section of a {@link ox#Bytes.Bytes} value given a start/end bytes offset.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.slice('0x0123456789', 1, 4)
* // @log: '0x234567'
* ```
*
* @param value - The {@link ox#Hex.Hex} value to slice.
* @param start - The start offset (in bytes).
* @param end - The end offset (in bytes).
* @param options - Options.
* @returns The sliced {@link ox#Hex.Hex} value.
*/
function slice(value, start, end, options = {}) {
	const { strict } = options;
	assertStartOffset(value, start);
	const value_ = `0x${value.replace("0x", "").slice((start ?? 0) * 2, (end ?? value.length) * 2)}`;
	if (strict) assertEndOffset(value_, start, end);
	return value_;
}
/**
* Retrieves the size of a {@link ox#Hex.Hex} value (in bytes).
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.size('0xdeadbeef')
* // @log: 4
* ```
*
* @param value - The {@link ox#Hex.Hex} value to get the size of.
* @returns The size of the {@link ox#Hex.Hex} value (in bytes).
*/
function size$1(value) {
	return Math.ceil((value.length - 2) / 2);
}
/**
* Trims leading zeros from a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.trimLeft('0x00000000deadbeef')
* // @log: '0xdeadbeef'
* ```
*
* @param value - The {@link ox#Hex.Hex} value to trim.
* @returns The trimmed {@link ox#Hex.Hex} value.
*/
function trimLeft(value) {
	return trim(value, { dir: "left" });
}
/**
* Decodes a {@link ox#Hex.Hex} value into a BigInt.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.toBigInt('0x1a4')
* // @log: 420n
*
* Hex.toBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
* // @log: 420n
* ```
*
* @param hex - The {@link ox#Hex.Hex} value to decode.
* @param options - Options.
* @returns The decoded BigInt.
*/
function toBigInt(hex, options = {}) {
	const { signed } = options;
	if (options.size) assertSize(hex, options.size);
	const value = BigInt(hex);
	if (!signed) return value;
	const size = (hex.length - 2) / 2;
	const max_unsigned = (1n << BigInt(size) * 8n) - 1n;
	if (value <= max_unsigned >> 1n) return value;
	return value - max_unsigned - 1n;
}
/**
* Decodes a {@link ox#Hex.Hex} value into a {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* const data = Hex.toBytes('0x48656c6c6f20776f726c6421')
* // @log: Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
* ```
*
* @param hex - The {@link ox#Hex.Hex} value to decode.
* @param options - Options.
* @returns The decoded {@link ox#Bytes.Bytes}.
*/
function toBytes(hex, options = {}) {
	return fromHex$2(hex, options);
}
/**
* Decodes a {@link ox#Hex.Hex} value into a number.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.toNumber('0x1a4')
* // @log: 420
*
* Hex.toNumber('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
* // @log: 420
* ```
*
* @param hex - The {@link ox#Hex.Hex} value to decode.
* @param options - Options.
* @returns The decoded number.
*/
function toNumber(hex, options = {}) {
	const { signed, size } = options;
	if (!signed && !size) return Number(hex);
	return Number(toBigInt(hex, options));
}
/**
* Decodes a {@link ox#Hex.Hex} value into a string.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.toString('0x48656c6c6f20576f726c6421')
* // @log: 'Hello world!'
*
* Hex.toString('0x48656c6c6f20576f726c64210000000000000000000000000000000000000000', {
*  size: 32,
* })
* // @log: 'Hello world'
* ```
*
* @param hex - The {@link ox#Hex.Hex} value to decode.
* @param options - Options.
* @returns The decoded string.
*/
function toString(hex, options = {}) {
	const { size } = options;
	let bytes = fromHex$2(hex);
	if (size) {
		assertSize$1(bytes, size);
		bytes = trimRight(bytes);
	}
	return new TextDecoder().decode(bytes);
}
/**
* Checks if the given value is {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { Bytes, Hex } from 'ox'
*
* Hex.validate('0xdeadbeef')
* // @log: true
*
* Hex.validate(Bytes.from([1, 2, 3]))
* // @log: false
* ```
*
* @param value - The value to check.
* @param options - Options.
* @returns `true` if the value is a {@link ox#Hex.Hex}, `false` otherwise.
*/
function validate$2(value, options = {}) {
	const { strict = false } = options;
	try {
		assert$7(value, { strict });
		return true;
	} catch {
		return false;
	}
}
/**
* Thrown when the provided integer is out of range, and cannot be represented as a hex value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.fromNumber(420182738912731283712937129)
* // @error: Hex.IntegerOutOfRangeError: Number \`4.2018273891273126e+26\` is not in safe unsigned integer range (`0` to `9007199254740991`)
* ```
*/
var IntegerOutOfRangeError = class extends BaseError {
	constructor({ max, min, signed, size, value }) {
		super(`Number \`${value}\` is not in safe${size ? ` ${size * 8}-bit` : ""}${signed ? " signed" : " unsigned"} integer range ${max ? `(\`${min}\` to \`${max}\`)` : `(above \`${min}\`)`}`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.IntegerOutOfRangeError"
		});
	}
};
/**
* Thrown when the provided value is not a valid hex type.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.assert(1)
* // @error: Hex.InvalidHexTypeError: Value `1` of type `number` is an invalid hex type.
* ```
*/
var InvalidHexTypeError = class extends BaseError {
	constructor(value) {
		super(`Value \`${typeof value === "object" ? stringify(value) : value}\` of type \`${typeof value}\` is an invalid hex type.`, { metaMessages: ["Hex types must be represented as `\"0x${string}\"`."] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.InvalidHexTypeError"
		});
	}
};
/**
* Thrown when the provided hex value is invalid.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.assert('0x0123456789abcdefg')
* // @error: Hex.InvalidHexValueError: Value `0x0123456789abcdefg` is an invalid hex value.
* // @error: Hex values must start with `"0x"` and contain only hexadecimal characters (0-9, a-f, A-F).
* ```
*/
var InvalidHexValueError = class extends BaseError {
	constructor(value) {
		super(`Value \`${value}\` is an invalid hex value.`, { metaMessages: ["Hex values must start with `\"0x\"` and contain only hexadecimal characters (0-9, a-f, A-F)."] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.InvalidHexValueError"
		});
	}
};
/**
* Thrown when the size of the value exceeds the expected max size.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.fromString('Hello World!', { size: 8 })
* // @error: Hex.SizeOverflowError: Size cannot exceed `8` bytes. Given size: `12` bytes.
* ```
*/
var SizeOverflowError$1 = class extends BaseError {
	constructor({ givenSize, maxSize }) {
		super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.SizeOverflowError"
		});
	}
};
/**
* Thrown when the slice offset exceeds the bounds of the value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.slice('0x0123456789', 6)
* // @error: Hex.SliceOffsetOutOfBoundsError: Slice starting at offset `6` is out-of-bounds (size: `5`).
* ```
*/
var SliceOffsetOutOfBoundsError$1 = class extends BaseError {
	constructor({ offset, position, size }) {
		super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size}\`).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.SliceOffsetOutOfBoundsError"
		});
	}
};
/**
* Thrown when the size of the value exceeds the pad size.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.padLeft('0x1a4e12a45a21323123aaa87a897a897a898a6567a578a867a98778a667a85a875a87a6a787a65a675a6a9', 32)
* // @error: Hex.SizeExceedsPaddingSizeError: Hex size (`43`) exceeds padding size (`32`).
* ```
*/
var SizeExceedsPaddingSizeError$1 = class extends BaseError {
	constructor({ size, targetSize, type }) {
		super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size}\`) exceeds padding size (\`${targetSize}\`).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.SizeExceedsPaddingSizeError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/Bytes.js
var encoder = /*#__PURE__*/ new TextEncoder();
/**
* Concatenates two or more {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const bytes = Bytes.concat(
*   Bytes.from([1]),
*   Bytes.from([69]),
*   Bytes.from([420, 69]),
* )
* // @log: Uint8Array [ 1, 69, 420, 69 ]
* ```
*
* @param values - Values to concatenate.
* @returns Concatenated {@link ox#Bytes.Bytes}.
*/
function concat(...values) {
	let length = 0;
	for (const arr of values) length += arr.length;
	const result = new Uint8Array(length);
	for (let i = 0, index = 0; i < values.length; i++) {
		const arr = values[i];
		result.set(arr, index);
		index += arr.length;
	}
	return result;
}
/**
* Instantiates a {@link ox#Bytes.Bytes} value from a `Uint8Array`, a hex string, or an array of unsigned 8-bit integers.
*
* :::tip
*
* To instantiate from a **Boolean**, **String**, or **Number**, use one of the following:
*
* - `Bytes.fromBoolean`
*
* - `Bytes.fromString`
*
* - `Bytes.fromNumber`
*
* :::
*
* @example
* ```ts twoslash
* // @noErrors
* import { Bytes } from 'ox'
*
* const data = Bytes.from([255, 124, 5, 4])
* // @log: Uint8Array([255, 124, 5, 4])
*
* const data = Bytes.from('0xdeadbeef')
* // @log: Uint8Array([222, 173, 190, 239])
* ```
*
* @param value - Value to convert.
* @returns A {@link ox#Bytes.Bytes} instance.
*/
function from$3(value) {
	if (value instanceof Uint8Array) return value;
	if (typeof value === "string") return fromHex$2(value);
	return fromArray(value);
}
/**
* Converts an array of unsigned 8-bit integers into {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromArray([255, 124, 5, 4])
* // @log: Uint8Array([255, 124, 5, 4])
* ```
*
* @param value - Value to convert.
* @returns A {@link ox#Bytes.Bytes} instance.
*/
function fromArray(value) {
	return value instanceof Uint8Array ? value : new Uint8Array(value);
}
/**
* Encodes a boolean value into {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromBoolean(true)
* // @log: Uint8Array([1])
* ```
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromBoolean(true, { size: 32 })
* // @log: Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
* ```
*
* @param value - Boolean value to encode.
* @param options - Encoding options.
* @returns Encoded {@link ox#Bytes.Bytes}.
*/
function fromBoolean(value, options = {}) {
	const { size } = options;
	const bytes = new Uint8Array(1);
	bytes[0] = Number(value);
	if (typeof size === "number") {
		assertSize$1(bytes, size);
		return padLeft(bytes, size);
	}
	return bytes;
}
/**
* Encodes a {@link ox#Hex.Hex} value into {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromHex('0x48656c6c6f20776f726c6421')
* // @log: Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
* ```
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromHex('0x48656c6c6f20776f726c6421', { size: 32 })
* // @log: Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
* ```
*
* @param value - {@link ox#Hex.Hex} value to encode.
* @param options - Encoding options.
* @returns Encoded {@link ox#Bytes.Bytes}.
*/
function fromHex$2(value, options = {}) {
	const { size } = options;
	let hex = value;
	if (size) {
		assertSize(value, size);
		hex = padRight$1(value, size);
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
* Encodes a number value into {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromNumber(420)
* // @log: Uint8Array([1, 164])
* ```
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromNumber(420, { size: 4 })
* // @log: Uint8Array([0, 0, 1, 164])
* ```
*
* @param value - Number value to encode.
* @param options - Encoding options.
* @returns Encoded {@link ox#Bytes.Bytes}.
*/
function fromNumber(value, options) {
	return fromHex$2(fromNumber$1(value, options));
}
/**
* Encodes a string into {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromString('Hello world!')
* // @log: Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33])
* ```
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromString('Hello world!', { size: 32 })
* // @log: Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
* ```
*
* @param value - String to encode.
* @param options - Encoding options.
* @returns Encoded {@link ox#Bytes.Bytes}.
*/
function fromString(value, options = {}) {
	const { size } = options;
	const bytes = encoder.encode(value);
	if (typeof size === "number") {
		assertSize$1(bytes, size);
		return padRight(bytes, size);
	}
	return bytes;
}
/**
* Pads a {@link ox#Bytes.Bytes} value to the left with zero bytes until it reaches the given `size` (default: 32 bytes).
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.padLeft(Bytes.from([1]), 4)
* // @log: Uint8Array([0, 0, 0, 1])
* ```
*
* @param value - {@link ox#Bytes.Bytes} value to pad.
* @param size - Size to pad the {@link ox#Bytes.Bytes} value to.
* @returns Padded {@link ox#Bytes.Bytes} value.
*/
function padLeft(value, size) {
	return pad$1(value, {
		dir: "left",
		size
	});
}
/**
* Pads a {@link ox#Bytes.Bytes} value to the right with zero bytes until it reaches the given `size` (default: 32 bytes).
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.padRight(Bytes.from([1]), 4)
* // @log: Uint8Array([1, 0, 0, 0])
* ```
*
* @param value - {@link ox#Bytes.Bytes} value to pad.
* @param size - Size to pad the {@link ox#Bytes.Bytes} value to.
* @returns Padded {@link ox#Bytes.Bytes} value.
*/
function padRight(value, size) {
	return pad$1(value, {
		dir: "right",
		size
	});
}
/**
* Retrieves the size of a {@link ox#Bytes.Bytes} value.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.size(Bytes.from([1, 2, 3, 4]))
* // @log: 4
* ```
*
* @param value - {@link ox#Bytes.Bytes} value.
* @returns Size of the {@link ox#Bytes.Bytes} value.
*/
function size(value) {
	return value.length;
}
/**
* Trims trailing zeros from a {@link ox#Bytes.Bytes} value.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.trimRight(Bytes.from([1, 2, 3, 0, 0, 0, 0]))
* // @log: Uint8Array([1, 2, 3])
* ```
*
* @param value - {@link ox#Bytes.Bytes} value.
* @returns Trimmed {@link ox#Bytes.Bytes} value.
*/
function trimRight(value) {
	return trim$1(value, { dir: "right" });
}
/**
* Thrown when a size exceeds the maximum allowed size.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.fromString('Hello World!', { size: 8 })
* // @error: Bytes.SizeOverflowError: Size cannot exceed `8` bytes. Given size: `12` bytes.
* ```
*/
var SizeOverflowError = class extends BaseError {
	constructor({ givenSize, maxSize }) {
		super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Bytes.SizeOverflowError"
		});
	}
};
/**
* Thrown when a the padding size exceeds the maximum allowed size.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.padLeft(Bytes.fromString('Hello World!'), 8)
* // @error: [Bytes.SizeExceedsPaddingSizeError: Bytes size (`12`) exceeds padding size (`8`).
* ```
*/
var SizeExceedsPaddingSizeError = class extends BaseError {
	constructor({ size, targetSize, type }) {
		super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size}\`) exceeds padding size (\`${targetSize}\`).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Bytes.SizeExceedsPaddingSizeError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/Hash.js
init_sha3();
/**
* Calculates the [Keccak256](https://en.wikipedia.org/wiki/SHA-3) hash of a {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value.
*
* This function is a re-export of `keccak_256` from [`@noble/hashes`](https://github.com/paulmillr/noble-hashes), an audited & minimal JS hashing library.
*
* @example
* ```ts twoslash
* import { Hash } from 'ox'
*
* Hash.keccak256('0xdeadbeef')
* // @log: '0xd4fd4e189132273036449fc9e11198c739161b4c0116a9a2dccdfa1c492006f1'
* ```
*
* @example
* ### Calculate Hash of a String
*
* ```ts twoslash
* import { Hash, Hex } from 'ox'
*
* Hash.keccak256(Hex.fromString('hello world'))
* // @log: '0x3ea2f1d0abf3fc66cf29eebb70cbd4e7fe762ef8a09bcc06c8edf641230afec0'
* ```
*
* @example
* ### Configure Return Type
*
* ```ts twoslash
* import { Hash } from 'ox'
*
* Hash.keccak256('0xdeadbeef', { as: 'Bytes' })
* // @log: Uint8Array [...]
* ```
*
* @param value - {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value.
* @param options - Options.
* @returns Keccak256 hash.
*/
function keccak256(value, options = {}) {
	const { as = typeof value === "string" ? "Hex" : "Bytes" } = options;
	const bytes = keccak_256(from$3(value));
	if (as === "Bytes") return bytes;
	return fromBytes$1(bytes);
}
//#endregion
//#region node_modules/ox/_esm/core/internal/lru.js
/**
* @internal
*
* Map with a LRU (Least recently used) policy.
* @see https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
*/
var LruMap = class extends Map {
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
var checksum$1 = { checksum: /*#__PURE__*/ new LruMap(8192) }.checksum;
//#endregion
//#region node_modules/ox/_esm/core/Address.js
var addressRegex = /^0x[a-fA-F0-9]{40}$/;
/**
* Asserts that the given value is a valid {@link ox#Address.Address}.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.assert('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')
* ```
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.assert('0xdeadbeef')
* // @error: InvalidAddressError: Address "0xdeadbeef" is invalid.
* ```
*
* @param value - Value to assert if it is a valid address.
* @param options - Assertion options.
*/
function assert$6(value, options = {}) {
	const { strict = true } = options;
	if (!addressRegex.test(value)) throw new InvalidAddressError({
		address: value,
		cause: new InvalidInputError()
	});
	if (strict) {
		if (value.toLowerCase() === value) return;
		if (checksum(value) !== value) throw new InvalidAddressError({
			address: value,
			cause: new InvalidChecksumError()
		});
	}
}
/**
* Computes the checksum address for the given {@link ox#Address.Address}.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.checksum('0xa0cf798816d4b9b9866b5330eea46a18382f251e')
* // @log: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'
* ```
*
* @param address - The address to compute the checksum for.
* @returns The checksummed address.
*/
function checksum(address) {
	if (checksum$1.has(address)) return checksum$1.get(address);
	assert$6(address, { strict: false });
	const hexAddress = address.substring(2).toLowerCase();
	const hash = keccak256(fromString(hexAddress), { as: "Bytes" });
	const characters = hexAddress.split("");
	for (let i = 0; i < 40; i += 2) {
		if (hash[i >> 1] >> 4 >= 8 && characters[i]) characters[i] = characters[i].toUpperCase();
		if ((hash[i >> 1] & 15) >= 8 && characters[i + 1]) characters[i + 1] = characters[i + 1].toUpperCase();
	}
	const result = `0x${characters.join("")}`;
	checksum$1.set(address, result);
	return result;
}
/**
* Checks if the given address is a valid {@link ox#Address.Address}.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.validate('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')
* // @log: true
* ```
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.validate('0xdeadbeef')
* // @log: false
* ```
*
* @param address - Value to check if it is a valid address.
* @param options - Check options.
* @returns Whether the address is a valid address.
*/
function validate$1(address, options = {}) {
	const { strict = true } = options ?? {};
	try {
		assert$6(address, { strict });
		return true;
	} catch {
		return false;
	}
}
/**
* Thrown when an address is invalid.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.from('0x123')
* // @error: Address.InvalidAddressError: Address `0x123` is invalid.
* ```
*/
var InvalidAddressError = class extends BaseError {
	constructor({ address, cause }) {
		super(`Address "${address}" is invalid.`, { cause });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Address.InvalidAddressError"
		});
	}
};
/** Thrown when an address is not a 20 byte (40 hexadecimal character) value. */
var InvalidInputError = class extends BaseError {
	constructor() {
		super("Address is not a 20 byte (40 hexadecimal character) value.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Address.InvalidInputError"
		});
	}
};
/** Thrown when an address does not match its checksum counterpart. */
var InvalidChecksumError = class extends BaseError {
	constructor() {
		super("Address does not match its checksum counterpart.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Address.InvalidChecksumError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/Solidity.js
var arrayRegex = /^(.*)\[([0-9]*)\]$/;
var bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
var integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
2n ** (8n - 1n) - 1n;
2n ** (16n - 1n) - 1n;
2n ** (24n - 1n) - 1n;
2n ** (32n - 1n) - 1n;
2n ** (40n - 1n) - 1n;
2n ** (48n - 1n) - 1n;
2n ** (56n - 1n) - 1n;
2n ** (64n - 1n) - 1n;
2n ** (72n - 1n) - 1n;
2n ** (80n - 1n) - 1n;
2n ** (88n - 1n) - 1n;
2n ** (96n - 1n) - 1n;
2n ** (104n - 1n) - 1n;
2n ** (112n - 1n) - 1n;
2n ** (120n - 1n) - 1n;
2n ** (128n - 1n) - 1n;
2n ** (136n - 1n) - 1n;
2n ** (144n - 1n) - 1n;
2n ** (152n - 1n) - 1n;
2n ** (160n - 1n) - 1n;
2n ** (168n - 1n) - 1n;
2n ** (176n - 1n) - 1n;
2n ** (184n - 1n) - 1n;
2n ** (192n - 1n) - 1n;
2n ** (200n - 1n) - 1n;
2n ** (208n - 1n) - 1n;
2n ** (216n - 1n) - 1n;
2n ** (224n - 1n) - 1n;
2n ** (232n - 1n) - 1n;
2n ** (240n - 1n) - 1n;
2n ** (248n - 1n) - 1n;
2n ** (256n - 1n) - 1n;
-(2n ** (8n - 1n));
-(2n ** (16n - 1n));
-(2n ** (24n - 1n));
-(2n ** (32n - 1n));
-(2n ** (40n - 1n));
-(2n ** (48n - 1n));
-(2n ** (56n - 1n));
-(2n ** (64n - 1n));
-(2n ** (72n - 1n));
-(2n ** (80n - 1n));
-(2n ** (88n - 1n));
-(2n ** (96n - 1n));
-(2n ** (104n - 1n));
-(2n ** (112n - 1n));
-(2n ** (120n - 1n));
-(2n ** (128n - 1n));
-(2n ** (136n - 1n));
-(2n ** (144n - 1n));
-(2n ** (152n - 1n));
-(2n ** (160n - 1n));
-(2n ** (168n - 1n));
-(2n ** (176n - 1n));
-(2n ** (184n - 1n));
-(2n ** (192n - 1n));
-(2n ** (200n - 1n));
-(2n ** (208n - 1n));
-(2n ** (216n - 1n));
-(2n ** (224n - 1n));
-(2n ** (232n - 1n));
-(2n ** (240n - 1n));
-(2n ** (248n - 1n));
-(2n ** (256n - 1n));
var maxUint96 = 2n ** 96n - 1n;
var maxUint256 = 2n ** 256n - 1n;
//#endregion
//#region node_modules/ox/_esm/core/internal/abiParameters.js
init_exports();
/** @internal */
function prepareParameters({ checksumAddress, parameters, values }) {
	const preparedParameters = [];
	for (let i = 0; i < parameters.length; i++) preparedParameters.push(prepareParameter({
		checksumAddress,
		parameter: parameters[i],
		value: values[i]
	}));
	return preparedParameters;
}
/** @internal */
function prepareParameter({ checksumAddress = false, parameter: parameter_, value }) {
	const parameter = parameter_;
	const arrayComponents = getArrayComponents(parameter.type);
	if (arrayComponents) {
		const [length, type] = arrayComponents;
		return encodeArray(value, {
			checksumAddress,
			length,
			parameter: {
				...parameter,
				type
			}
		});
	}
	if (parameter.type === "tuple") return encodeTuple(value, {
		checksumAddress,
		parameter
	});
	if (parameter.type === "address") return encodeAddress(value, { checksum: checksumAddress });
	if (parameter.type === "bool") return encodeBoolean(value);
	if (parameter.type.startsWith("uint") || parameter.type.startsWith("int")) {
		const signed = parameter.type.startsWith("int");
		const [, , size = "256"] = integerRegex.exec(parameter.type) ?? [];
		return encodeNumber(value, {
			signed,
			size: Number(size)
		});
	}
	if (parameter.type.startsWith("bytes")) return encodeBytes(value, { type: parameter.type });
	if (parameter.type === "string") return encodeString(value);
	throw new InvalidTypeError(parameter.type);
}
/** @internal */
function encode$3(preparedParameters) {
	let staticSize = 0;
	for (let i = 0; i < preparedParameters.length; i++) {
		const { dynamic, encoded } = preparedParameters[i];
		if (dynamic) staticSize += 32;
		else staticSize += size$1(encoded);
	}
	const staticParameters = [];
	const dynamicParameters = [];
	let dynamicSize = 0;
	for (let i = 0; i < preparedParameters.length; i++) {
		const { dynamic, encoded } = preparedParameters[i];
		if (dynamic) {
			staticParameters.push(fromNumber$1(staticSize + dynamicSize, { size: 32 }));
			dynamicParameters.push(encoded);
			dynamicSize += size$1(encoded);
		} else staticParameters.push(encoded);
	}
	return concat$1(...staticParameters, ...dynamicParameters);
}
/** @internal */
function encodeAddress(value, options) {
	const { checksum = false } = options;
	assert$6(value, { strict: checksum });
	return {
		dynamic: false,
		encoded: padLeft$1(value.toLowerCase())
	};
}
/** @internal */
function encodeArray(value, options) {
	const { checksumAddress, length, parameter } = options;
	const dynamic = length === null;
	if (!Array.isArray(value)) throw new InvalidArrayError(value);
	if (!dynamic && value.length !== length) throw new ArrayLengthMismatchError({
		expectedLength: length,
		givenLength: value.length,
		type: `${parameter.type}[${length}]`
	});
	let dynamicChild = false;
	const preparedParameters = [];
	for (let i = 0; i < value.length; i++) {
		const preparedParam = prepareParameter({
			checksumAddress,
			parameter,
			value: value[i]
		});
		if (preparedParam.dynamic) dynamicChild = true;
		preparedParameters.push(preparedParam);
	}
	if (dynamic || dynamicChild) {
		const data = encode$3(preparedParameters);
		if (dynamic) {
			const length = fromNumber$1(preparedParameters.length, { size: 32 });
			return {
				dynamic: true,
				encoded: preparedParameters.length > 0 ? concat$1(length, data) : length
			};
		}
		if (dynamicChild) return {
			dynamic: true,
			encoded: data
		};
	}
	return {
		dynamic: false,
		encoded: concat$1(...preparedParameters.map(({ encoded }) => encoded))
	};
}
/** @internal */
function encodeBytes(value, { type }) {
	const [, parametersize] = type.split("bytes");
	const bytesSize = size$1(value);
	if (!parametersize) {
		let value_ = value;
		if (bytesSize % 32 !== 0) value_ = padRight$1(value_, Math.ceil((value.length - 2) / 2 / 32) * 32);
		return {
			dynamic: true,
			encoded: concat$1(padLeft$1(fromNumber$1(bytesSize, { size: 32 })), value_)
		};
	}
	if (bytesSize !== Number.parseInt(parametersize)) throw new BytesSizeMismatchError$1({
		expectedSize: Number.parseInt(parametersize),
		value
	});
	return {
		dynamic: false,
		encoded: padRight$1(value)
	};
}
/** @internal */
function encodeBoolean(value) {
	if (typeof value !== "boolean") throw new BaseError(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
	return {
		dynamic: false,
		encoded: padLeft$1(fromBoolean$1(value))
	};
}
/** @internal */
function encodeNumber(value, { signed, size }) {
	if (typeof size === "number") {
		const max = 2n ** (BigInt(size) - (signed ? 1n : 0n)) - 1n;
		const min = signed ? -max - 1n : 0n;
		if (value > max || value < min) throw new IntegerOutOfRangeError({
			max: max.toString(),
			min: min.toString(),
			signed,
			size: size / 8,
			value: value.toString()
		});
	}
	return {
		dynamic: false,
		encoded: fromNumber$1(value, {
			size: 32,
			signed
		})
	};
}
/** @internal */
function encodeString(value) {
	const hexValue = fromString$1(value);
	const partsLength = Math.ceil(size$1(hexValue) / 32);
	const parts = [];
	for (let i = 0; i < partsLength; i++) parts.push(padRight$1(slice(hexValue, i * 32, (i + 1) * 32)));
	return {
		dynamic: true,
		encoded: concat$1(padRight$1(fromNumber$1(size$1(hexValue), { size: 32 })), ...parts)
	};
}
/** @internal */
function encodeTuple(value, options) {
	const { checksumAddress, parameter } = options;
	let dynamic = false;
	const preparedParameters = [];
	for (let i = 0; i < parameter.components.length; i++) {
		const param_ = parameter.components[i];
		const preparedParam = prepareParameter({
			checksumAddress,
			parameter: param_,
			value: value[Array.isArray(value) ? i : param_.name]
		});
		preparedParameters.push(preparedParam);
		if (preparedParam.dynamic) dynamic = true;
	}
	return {
		dynamic,
		encoded: dynamic ? encode$3(preparedParameters) : concat$1(...preparedParameters.map(({ encoded }) => encoded))
	};
}
/** @internal */
function getArrayComponents(type) {
	const matches = type.match(/^(.*)\[(\d+)?\]$/);
	return matches ? [matches[2] ? Number(matches[2]) : null, matches[1]] : void 0;
}
//#endregion
//#region node_modules/ox/_esm/core/internal/cursor.js
var staticCursor = (/*#__PURE__*/ {
	bytes: new Uint8Array(),
	dataView: /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(0)),
	position: 0,
	positionReadCount: /* @__PURE__ */ new Map(),
	recursiveReadCount: 0,
	recursiveReadLimit: Number.POSITIVE_INFINITY,
	assertReadLimit() {
		if (this.recursiveReadCount >= this.recursiveReadLimit) throw new RecursiveReadLimitExceededError({
			count: this.recursiveReadCount + 1,
			limit: this.recursiveReadLimit
		});
	},
	assertPosition(position) {
		if (position < 0 || position > this.bytes.length - 1) throw new PositionOutOfBoundsError({
			length: this.bytes.length,
			position
		});
	},
	decrementPosition(offset) {
		if (offset < 0) throw new NegativeOffsetError({ offset });
		const position = this.position - offset;
		this.assertPosition(position);
		this.position = position;
	},
	getReadCount(position) {
		return this.positionReadCount.get(position || this.position) || 0;
	},
	incrementPosition(offset) {
		if (offset < 0) throw new NegativeOffsetError({ offset });
		const position = this.position + offset;
		this.assertPosition(position);
		this.position = position;
	},
	inspectByte(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position);
		return this.bytes[position];
	},
	inspectBytes(length, position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + length - 1);
		return this.bytes.subarray(position, position + length);
	},
	inspectUint8(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position);
		return this.bytes[position];
	},
	inspectUint16(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + 1);
		return this.dataView.getUint16(position);
	},
	inspectUint24(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + 2);
		return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
	},
	inspectUint32(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + 3);
		return this.dataView.getUint32(position);
	},
	pushByte(byte) {
		this.assertPosition(this.position);
		this.bytes[this.position] = byte;
		this.position++;
	},
	pushBytes(bytes) {
		this.assertPosition(this.position + bytes.length - 1);
		this.bytes.set(bytes, this.position);
		this.position += bytes.length;
	},
	pushUint8(value) {
		this.assertPosition(this.position);
		this.bytes[this.position] = value;
		this.position++;
	},
	pushUint16(value) {
		this.assertPosition(this.position + 1);
		this.dataView.setUint16(this.position, value);
		this.position += 2;
	},
	pushUint24(value) {
		this.assertPosition(this.position + 2);
		this.dataView.setUint16(this.position, value >> 8);
		this.dataView.setUint8(this.position + 2, value & 255);
		this.position += 3;
	},
	pushUint32(value) {
		this.assertPosition(this.position + 3);
		this.dataView.setUint32(this.position, value);
		this.position += 4;
	},
	readByte() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectByte();
		this.position++;
		return value;
	},
	readBytes(length, size) {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectBytes(length);
		this.position += size ?? length;
		return value;
	},
	readUint8() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint8();
		this.position += 1;
		return value;
	},
	readUint16() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint16();
		this.position += 2;
		return value;
	},
	readUint24() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint24();
		this.position += 3;
		return value;
	},
	readUint32() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint32();
		this.position += 4;
		return value;
	},
	get remaining() {
		return this.bytes.length - this.position;
	},
	setPosition(position) {
		const oldPosition = this.position;
		this.assertPosition(position);
		this.position = position;
		return () => this.position = oldPosition;
	},
	_touch() {
		if (this.recursiveReadLimit === Number.POSITIVE_INFINITY) return;
		const count = this.getReadCount();
		this.positionReadCount.set(this.position, count + 1);
		if (count > 0) this.recursiveReadCount++;
	}
});
/** @internal */
function create(bytes, { recursiveReadLimit = 8192 } = {}) {
	const cursor = Object.create(staticCursor);
	cursor.bytes = bytes;
	cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	cursor.positionReadCount = /* @__PURE__ */ new Map();
	cursor.recursiveReadLimit = recursiveReadLimit;
	return cursor;
}
/** @internal */
var NegativeOffsetError = class extends BaseError {
	constructor({ offset }) {
		super(`Offset \`${offset}\` cannot be negative.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Cursor.NegativeOffsetError"
		});
	}
};
/** @internal */
var PositionOutOfBoundsError = class extends BaseError {
	constructor({ length, position }) {
		super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Cursor.PositionOutOfBoundsError"
		});
	}
};
/** @internal */
var RecursiveReadLimitExceededError = class extends BaseError {
	constructor({ count, limit }) {
		super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Cursor.RecursiveReadLimitExceededError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/AbiParameters.js
/**
* Encodes primitive values into ABI encoded data as per the [Application Binary Interface (ABI) Specification](https://docs.soliditylang.org/en/latest/abi-spec).
*
* @example
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* const data = AbiParameters.encode(
*   AbiParameters.from(['string', 'uint', 'bool']),
*   ['wagmi', 420n, true],
* )
* ```
*
* @example
* ### JSON Parameters
*
* Specify **JSON ABI** Parameters as schema:
*
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* const data = AbiParameters.encode(
*   [
*     { type: 'string', name: 'name' },
*     { type: 'uint', name: 'age' },
*     { type: 'bool', name: 'isOwner' },
*   ],
*   ['wagmi', 420n, true],
* )
* ```
*
* @param parameters - The set of ABI parameters to encode, in the shape of the `inputs` or `outputs` attribute of an ABI Item. These parameters must include valid [ABI types](https://docs.soliditylang.org/en/latest/types.html).
* @param values - The set of primitive values that correspond to the ABI types defined in `parameters`.
* @returns ABI encoded data.
*/
function encode$2(parameters, values, options) {
	const { checksumAddress = false } = options ?? {};
	if (parameters.length !== values.length) throw new LengthMismatchError({
		expectedLength: parameters.length,
		givenLength: values.length
	});
	const data = encode$3(prepareParameters({
		checksumAddress,
		parameters,
		values
	}));
	if (data.length === 0) return "0x";
	return data;
}
/**
* Encodes an array of primitive values to a [packed ABI encoding](https://docs.soliditylang.org/en/latest/abi-spec.html#non-standard-packed-mode).
*
* @example
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* const encoded = AbiParameters.encodePacked(
*   ['address', 'string'],
*   ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 'hello world'],
* )
* // @log: '0xd8da6bf26964af9d7eed9e03e53415d37aa9604568656c6c6f20776f726c64'
* ```
*
* @param types - Set of ABI types to pack encode.
* @param values - The set of primitive values that correspond to the ABI types defined in `types`.
* @returns The encoded packed data.
*/
function encodePacked(types, values) {
	if (types.length !== values.length) throw new LengthMismatchError({
		expectedLength: types.length,
		givenLength: values.length
	});
	const data = [];
	for (let i = 0; i < types.length; i++) {
		const type = types[i];
		const value = values[i];
		data.push(encodePacked.encode(type, value));
	}
	return concat$1(...data);
}
(function(encodePacked) {
	function encode(type, value, isArray = false) {
		if (type === "address") {
			const address = value;
			assert$6(address);
			return padLeft$1(address.toLowerCase(), isArray ? 32 : 0);
		}
		if (type === "string") return fromString$1(value);
		if (type === "bytes") return value;
		if (type === "bool") return padLeft$1(fromBoolean$1(value), isArray ? 32 : 1);
		const intMatch = type.match(integerRegex);
		if (intMatch) {
			const [_type, baseType, bits = "256"] = intMatch;
			const size = Number.parseInt(bits) / 8;
			return fromNumber$1(value, {
				size: isArray ? 32 : size,
				signed: baseType === "int"
			});
		}
		const bytesMatch = type.match(bytesRegex);
		if (bytesMatch) {
			const [_type, size] = bytesMatch;
			if (Number.parseInt(size) !== (value.length - 2) / 2) throw new BytesSizeMismatchError$1({
				expectedSize: Number.parseInt(size),
				value
			});
			return padRight$1(value, isArray ? 32 : 0);
		}
		const arrayMatch = type.match(arrayRegex);
		if (arrayMatch && Array.isArray(value)) {
			const [_type, childType] = arrayMatch;
			const data = [];
			for (let i = 0; i < value.length; i++) data.push(encode(childType, value[i], true));
			if (data.length === 0) return "0x";
			return concat$1(...data);
		}
		throw new InvalidTypeError(type);
	}
	encodePacked.encode = encode;
})(encodePacked || (encodePacked = {}));
/**
* The length of the array value does not match the length specified in the corresponding ABI parameter.
*
* ### Example
*
* ```ts twoslash
* // @noErrors
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from('uint256[3]'), [[69n, 420n]])
* //                                               ↑ expected: 3  ↑ ❌ length: 2
* // @error: AbiParameters.ArrayLengthMismatchError: ABI encoding array length mismatch
* // @error: for type `uint256[3]`. Expected: `3`. Given: `2`.
* ```
*
* ### Solution
*
* Pass an array of the correct length.
*
* ```ts twoslash
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from(['uint256[3]']), [[69n, 420n, 69n]])
* //                                                         ↑ ✅ length: 3
* ```
*/
var ArrayLengthMismatchError = class extends BaseError {
	constructor({ expectedLength, givenLength, type }) {
		super(`Array length mismatch for type \`${type}\`. Expected: \`${expectedLength}\`. Given: \`${givenLength}\`.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.ArrayLengthMismatchError"
		});
	}
};
/**
* The size of the bytes value does not match the size specified in the corresponding ABI parameter.
*
* ### Example
*
* ```ts twoslash
* // @noErrors
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from('bytes8'), [['0xdeadbeefdeadbeefdeadbeef']])
* //                                            ↑ expected: 8 bytes  ↑ ❌ size: 12 bytes
* // @error: BytesSizeMismatchError: Size of bytes "0xdeadbeefdeadbeefdeadbeef"
* // @error: (bytes12) does not match expected size (bytes8).
* ```
*
* ### Solution
*
* Pass a bytes value of the correct size.
*
* ```ts twoslash
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from(['bytes8']), ['0xdeadbeefdeadbeef'])
* //                                                       ↑ ✅ size: 8 bytes
* ```
*/
var BytesSizeMismatchError$1 = class extends BaseError {
	constructor({ expectedSize, value }) {
		super(`Size of bytes "${value}" (bytes${size$1(value)}) does not match expected size (bytes${expectedSize}).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.BytesSizeMismatchError"
		});
	}
};
/**
* The length of the values to encode does not match the length of the ABI parameters.
*
* ### Example
*
* ```ts twoslash
* // @noErrors
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from(['string', 'uint256']), ['hello'])
* // @error: LengthMismatchError: ABI encoding params/values length mismatch.
* // @error: Expected length (params): 2
* // @error: Given length (values): 1
* ```
*
* ### Solution
*
* Pass the correct number of values to encode.
*
* ### Solution
*
* Pass a [valid ABI type](https://docs.soliditylang.org/en/develop/abi-spec.html#types).
*/
var LengthMismatchError = class extends BaseError {
	constructor({ expectedLength, givenLength }) {
		super([
			"ABI encoding parameters/values length mismatch.",
			`Expected length (parameters): ${expectedLength}`,
			`Given length (values): ${givenLength}`
		].join("\n"));
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.LengthMismatchError"
		});
	}
};
/**
* The value provided is not a valid array as specified in the corresponding ABI parameter.
*
* ### Example
*
* ```ts twoslash
* // @noErrors
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from(['uint256[3]']), [69])
* ```
*
* ### Solution
*
* Pass an array value.
*/
var InvalidArrayError = class extends BaseError {
	constructor(value) {
		super(`Value \`${value}\` is not a valid array.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.InvalidArrayError"
		});
	}
};
/**
* Throws when the ABI parameter type is invalid.
*
* @example
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* AbiParameters.decode([{ type: 'lol' }], '0x00000000000000000000000000000000000000000000000000000000000010f')
* //                             ↑ ❌ invalid type
* // @error: AbiParameters.InvalidTypeError: Type `lol` is not a valid ABI Type.
* ```
*/
var InvalidTypeError = class extends BaseError {
	constructor(type) {
		super(`Type \`${type}\` is not a valid ABI Type.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.InvalidTypeError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/AccessList.js
/**
* Converts a structured Access List into a list of tuples.
*
* @example
* ```ts twoslash
* import { AccessList } from 'ox'
*
* const accessList = AccessList.toTupleList([
*   {
*     address: '0x0000000000000000000000000000000000000000',
*     storageKeys: [
*       '0x0000000000000000000000000000000000000000000000000000000000000001',
*       '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe'],
*   },
* ])
* // @log: [
* // @log:   [
* // @log:     '0x0000000000000000000000000000000000000000',
* // @log:     [
* // @log:       '0x0000000000000000000000000000000000000000000000000000000000000001',
* // @log:       '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe',
* // @log:     ],
* // @log:   ],
* // @log: ]
* ```
*
* @param accessList - Access list.
* @returns List of tuples.
*/
function toTupleList$1(accessList) {
	if (!accessList || accessList.length === 0) return [];
	const tuple = [];
	for (const { address, storageKeys } of accessList) {
		for (let j = 0; j < storageKeys.length; j++) if (size$1(storageKeys[j]) !== 32) throw new InvalidStorageKeySizeError({ storageKey: storageKeys[j] });
		if (address) assert$6(address, { strict: false });
		tuple.push([address, storageKeys]);
	}
	return tuple;
}
/** Thrown when the size of a storage key is invalid. */
var InvalidStorageKeySizeError = class extends BaseError {
	constructor({ storageKey }) {
		super(`Size for storage key "${storageKey}" is invalid. Expected 32 bytes. Got ${size$1(storageKey)} bytes.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AccessList.InvalidStorageKeySizeError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/Rlp.js
/**
* Encodes a {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value into a Recursive-Length Prefix (RLP) value.
*
* @example
* ```ts twoslash
* import { Bytes, Rlp } from 'ox'
*
* Rlp.from('0x68656c6c6f20776f726c64', { as: 'Hex' })
* // @log: 0x8b68656c6c6f20776f726c64
*
* Rlp.from(Bytes.from([139, 104, 101, 108, 108, 111,  32, 119, 111, 114, 108, 100]), { as: 'Bytes' })
* // @log: Uint8Array([104, 101, 108, 108, 111,  32, 119, 111, 114, 108, 100])
* ```
*
* @param value - The {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value to encode.
* @param options - Options.
* @returns The RLP value.
*/
function from$2(value, options) {
	const { as } = options;
	const encodable = getEncodable(value);
	const cursor = create(new Uint8Array(encodable.length));
	encodable.encode(cursor);
	if (as === "Hex") return fromBytes$1(cursor.bytes);
	return cursor.bytes;
}
/**
* Encodes a {@link ox#Hex.Hex} value into a Recursive-Length Prefix (RLP) value.
*
* @example
* ```ts twoslash
* import { Rlp } from 'ox'
*
* Rlp.fromHex('0x68656c6c6f20776f726c64')
* // @log: 0x8b68656c6c6f20776f726c64
* ```
*
* @param hex - The {@link ox#Hex.Hex} value to encode.
* @param options - Options.
* @returns The RLP value.
*/
function fromHex$1(hex, options = {}) {
	const { as = "Hex" } = options;
	return from$2(hex, { as });
}
function getEncodable(bytes) {
	if (Array.isArray(bytes)) return getEncodableList(bytes.map((x) => getEncodable(x)));
	return getEncodableBytes(bytes);
}
function getEncodableList(list) {
	const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
	const sizeOfBodyLength = getSizeOfLength(bodyLength);
	return {
		length: (() => {
			if (bodyLength <= 55) return 1 + bodyLength;
			return 1 + sizeOfBodyLength + bodyLength;
		})(),
		encode(cursor) {
			if (bodyLength <= 55) cursor.pushByte(192 + bodyLength);
			else {
				cursor.pushByte(247 + sizeOfBodyLength);
				if (sizeOfBodyLength === 1) cursor.pushUint8(bodyLength);
				else if (sizeOfBodyLength === 2) cursor.pushUint16(bodyLength);
				else if (sizeOfBodyLength === 3) cursor.pushUint24(bodyLength);
				else cursor.pushUint32(bodyLength);
			}
			for (const { encode } of list) encode(cursor);
		}
	};
}
function getEncodableBytes(bytesOrHex) {
	const bytes = typeof bytesOrHex === "string" ? fromHex$2(bytesOrHex) : bytesOrHex;
	const sizeOfBytesLength = getSizeOfLength(bytes.length);
	return {
		length: (() => {
			if (bytes.length === 1 && bytes[0] < 128) return 1;
			if (bytes.length <= 55) return 1 + bytes.length;
			return 1 + sizeOfBytesLength + bytes.length;
		})(),
		encode(cursor) {
			if (bytes.length === 1 && bytes[0] < 128) cursor.pushBytes(bytes);
			else if (bytes.length <= 55) {
				cursor.pushByte(128 + bytes.length);
				cursor.pushBytes(bytes);
			} else {
				cursor.pushByte(183 + sizeOfBytesLength);
				if (sizeOfBytesLength === 1) cursor.pushUint8(bytes.length);
				else if (sizeOfBytesLength === 2) cursor.pushUint16(bytes.length);
				else if (sizeOfBytesLength === 3) cursor.pushUint24(bytes.length);
				else cursor.pushUint32(bytes.length);
				cursor.pushBytes(bytes);
			}
		}
	};
}
function getSizeOfLength(length) {
	if (length < 2 ** 8) return 1;
	if (length < 2 ** 16) return 2;
	if (length < 2 ** 24) return 3;
	if (length < 2 ** 32) return 4;
	throw new BaseError("Length is too large.");
}
//#endregion
//#region node_modules/ox/_esm/core/Signature.js
/**
* Asserts that a Signature is valid.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* Signature.assert({
*   r: -49782753348462494199823712700004552394425719014458918871452329774910450607807n,
*   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
*   yParity: 1,
* })
* // @error: InvalidSignatureRError:
* // @error: Value `-549...n` is an invalid r value.
* // @error: r must be a positive integer less than 2^256.
* ```
*
* @param signature - The signature object to assert.
*/
function assert$5(signature, options = {}) {
	const { recovered } = options;
	if (typeof signature.r === "undefined") throw new MissingPropertiesError({ signature });
	if (typeof signature.s === "undefined") throw new MissingPropertiesError({ signature });
	if (recovered && typeof signature.yParity === "undefined") throw new MissingPropertiesError({ signature });
	if (signature.r < 0n || signature.r > maxUint256) throw new InvalidRError({ value: signature.r });
	if (signature.s < 0n || signature.s > maxUint256) throw new InvalidSError({ value: signature.s });
	if (typeof signature.yParity === "number" && signature.yParity !== 0 && signature.yParity !== 1) throw new InvalidYParityError({ value: signature.yParity });
}
/**
* Deserializes a {@link ox#Bytes.Bytes} signature into a structured {@link ox#Signature.Signature}.
*
* @example
* ```ts twoslash
* // @noErrors
* import { Signature } from 'ox'
*
* Signature.fromBytes(new Uint8Array([128, 3, 131, ...]))
* // @log: { r: 5231...n, s: 3522...n, yParity: 0 }
* ```
*
* @param signature - The serialized signature.
* @returns The deserialized {@link ox#Signature.Signature}.
*/
function fromBytes(signature) {
	return fromHex(fromBytes$1(signature));
}
/**
* Deserializes a {@link ox#Hex.Hex} signature into a structured {@link ox#Signature.Signature}.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* Signature.fromHex('0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db81c')
* // @log: { r: 5231...n, s: 3522...n, yParity: 0 }
* ```
*
* @param serialized - The serialized signature.
* @returns The deserialized {@link ox#Signature.Signature}.
*/
function fromHex(signature) {
	if (signature.length !== 130 && signature.length !== 132) throw new InvalidSerializedSizeError({ signature });
	const r = BigInt(slice(signature, 0, 32));
	const s = BigInt(slice(signature, 32, 64));
	const yParity = (() => {
		const yParity = Number(`0x${signature.slice(130)}`);
		if (Number.isNaN(yParity)) return void 0;
		try {
			return vToYParity(yParity);
		} catch {
			throw new InvalidYParityError({ value: yParity });
		}
	})();
	if (typeof yParity === "undefined") return {
		r,
		s
	};
	return {
		r,
		s,
		yParity
	};
}
/**
* Extracts a {@link ox#Signature.Signature} from an arbitrary object that may include signature properties.
*
* @example
* ```ts twoslash
* // @noErrors
* import { Signature } from 'ox'
*
* Signature.extract({
*   baz: 'barry',
*   foo: 'bar',
*   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
*   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
*   yParity: 1,
*   zebra: 'stripes',
* })
* // @log: {
* // @log:   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
* // @log:   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
* // @log:   yParity: 1
* // @log: }
* ```
*
* @param value - The arbitrary object to extract the signature from.
* @returns The extracted {@link ox#Signature.Signature}.
*/
function extract(value) {
	if (typeof value.r === "undefined") return void 0;
	if (typeof value.s === "undefined") return void 0;
	return from$1(value);
}
/**
* Instantiates a typed {@link ox#Signature.Signature} object from a {@link ox#Signature.Signature}, {@link ox#Signature.Legacy}, {@link ox#Bytes.Bytes}, or {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* Signature.from({
*   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
*   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
*   yParity: 1,
* })
* // @log: {
* // @log:   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
* // @log:   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
* // @log:   yParity: 1
* // @log: }
* ```
*
* @example
* ### From Serialized
*
* ```ts twoslash
* import { Signature } from 'ox'
*
* Signature.from('0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db801')
* // @log: {
* // @log:   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
* // @log:   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
* // @log:   yParity: 1,
* // @log: }
* ```
*
* @example
* ### From Legacy
*
* ```ts twoslash
* import { Signature } from 'ox'
*
* Signature.from({
*   r: 47323457007453657207889730243826965761922296599680473886588287015755652701072n,
*   s: 57228803202727131502949358313456071280488184270258293674242124340113824882788n,
*   v: 27,
* })
* // @log: {
* // @log:   r: 47323457007453657207889730243826965761922296599680473886588287015755652701072n,
* // @log:   s: 57228803202727131502949358313456071280488184270258293674242124340113824882788n,
* // @log:   yParity: 0
* // @log: }
* ```
*
* @param signature - The signature value to instantiate.
* @returns The instantiated {@link ox#Signature.Signature}.
*/
function from$1(signature) {
	const signature_ = (() => {
		if (typeof signature === "string") return fromHex(signature);
		if (signature instanceof Uint8Array) return fromBytes(signature);
		if (typeof signature.r === "string") return fromRpc$1(signature);
		if (signature.v) return fromLegacy(signature);
		return {
			r: signature.r,
			s: signature.s,
			...typeof signature.yParity !== "undefined" ? { yParity: signature.yParity } : {}
		};
	})();
	assert$5(signature_);
	return signature_;
}
/**
* Converts a {@link ox#Signature.Legacy} into a {@link ox#Signature.Signature}.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const legacy = Signature.fromLegacy({ r: 1n, s: 2n, v: 28 })
* // @log: { r: 1n, s: 2n, yParity: 1 }
* ```
*
* @param signature - The {@link ox#Signature.Legacy} to convert.
* @returns The converted {@link ox#Signature.Signature}.
*/
function fromLegacy(signature) {
	return {
		r: signature.r,
		s: signature.s,
		yParity: vToYParity(signature.v)
	};
}
/**
* Converts a {@link ox#Signature.Rpc} into a {@link ox#Signature.Signature}.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const signature = Signature.fromRpc({
*   r: '0x635dc2033e60185bb36709c29c75d64ea51dfbd91c32ef4be198e4ceb169fb4d',
*   s: '0x50c2667ac4c771072746acfdcf1f1483336dcca8bd2df47cd83175dbe60f0540',
*   yParity: '0x0',
* })
* ```
*
* @param signature - The {@link ox#Signature.Rpc} to convert.
* @returns The converted {@link ox#Signature.Signature}.
*/
function fromRpc$1(signature) {
	const yParity = (() => {
		const v = signature.v ? Number(signature.v) : void 0;
		let yParity = signature.yParity ? Number(signature.yParity) : void 0;
		if (typeof v === "number" && typeof yParity !== "number") yParity = vToYParity(v);
		if (typeof yParity !== "number") throw new InvalidYParityError({ value: signature.yParity });
		return yParity;
	})();
	return {
		r: BigInt(signature.r),
		s: BigInt(signature.s),
		yParity
	};
}
/**
* Serializes a {@link ox#Signature.Signature} to {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const signature = Signature.toHex({
*   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
*   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
*   yParity: 1
* })
* // @log: '0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db81c'
* ```
*
* @param signature - The signature to serialize.
* @returns The serialized signature.
*/
function toHex(signature) {
	assert$5(signature);
	const r = signature.r;
	const s = signature.s;
	return concat$1(fromNumber$1(r, { size: 32 }), fromNumber$1(s, { size: 32 }), typeof signature.yParity === "number" ? fromNumber$1(yParityToV(signature.yParity), { size: 1 }) : "0x");
}
/**
* Converts a {@link ox#Signature.Signature} into a {@link ox#Signature.Rpc}.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const signature = Signature.toRpc({
*   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
*   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
*   yParity: 1
* })
* ```
*
* @param signature - The {@link ox#Signature.Signature} to convert.
* @returns The converted {@link ox#Signature.Rpc}.
*/
function toRpc$1(signature) {
	const { r, s, yParity } = signature;
	return {
		r: fromNumber$1(r, { size: 32 }),
		s: fromNumber$1(s, { size: 32 }),
		yParity: yParity === 0 ? "0x0" : "0x1"
	};
}
/**
* Converts a {@link ox#Signature.Signature} to a serialized {@link ox#Signature.Tuple} to be used for signatures in Transaction Envelopes, EIP-7702 Authorization Lists, etc.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const signatureTuple = Signature.toTuple({
*   r: 123n,
*   s: 456n,
*   yParity: 1,
* })
* // @log: [yParity: '0x01', r: '0x7b', s: '0x1c8']
* ```
*
* @param signature - The {@link ox#Signature.Signature} to convert.
* @returns The {@link ox#Signature.Tuple}.
*/
function toTuple$1(signature) {
	const { r, s, yParity } = signature;
	return [
		yParity ? "0x01" : "0x",
		r === 0n ? "0x" : trimLeft(fromNumber$1(r)),
		s === 0n ? "0x" : trimLeft(fromNumber$1(s))
	];
}
/**
* Converts a ECDSA `v` value to a `yParity` value.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const yParity = Signature.vToYParity(28)
* // @log: 1
* ```
*
* @param v - The ECDSA `v` value to convert.
* @returns The `yParity` value.
*/
function vToYParity(v) {
	if (v === 0 || v === 27) return 0;
	if (v === 1 || v === 28) return 1;
	if (v >= 35) return v % 2 === 0 ? 1 : 0;
	throw new InvalidVError({ value: v });
}
/**
* Converts a ECDSA `v` value to a `yParity` value.
*
* @example
* ```ts twoslash
* import { Signature } from 'ox'
*
* const v = Signature.yParityToV(1)
* // @log: 28
* ```
*
* @param yParity - The ECDSA `yParity` value to convert.
* @returns The `v` value.
*/
function yParityToV(yParity) {
	if (yParity === 0) return 27;
	if (yParity === 1) return 28;
	throw new InvalidYParityError({ value: yParity });
}
/** Thrown when the serialized signature is of an invalid size. */
var InvalidSerializedSizeError = class extends BaseError {
	constructor({ signature }) {
		super(`Value \`${signature}\` is an invalid signature size.`, { metaMessages: ["Expected: 64 bytes or 65 bytes.", `Received ${size$1(from$4(signature))} bytes.`] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Signature.InvalidSerializedSizeError"
		});
	}
};
/** Thrown when the signature is missing either an `r`, `s`, or `yParity` property. */
var MissingPropertiesError = class extends BaseError {
	constructor({ signature }) {
		super(`Signature \`${stringify(signature)}\` is missing either an \`r\`, \`s\`, or \`yParity\` property.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Signature.MissingPropertiesError"
		});
	}
};
/** Thrown when the signature has an invalid `r` value. */
var InvalidRError = class extends BaseError {
	constructor({ value }) {
		super(`Value \`${value}\` is an invalid r value. r must be a positive integer less than 2^256.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Signature.InvalidRError"
		});
	}
};
/** Thrown when the signature has an invalid `s` value. */
var InvalidSError = class extends BaseError {
	constructor({ value }) {
		super(`Value \`${value}\` is an invalid s value. s must be a positive integer less than 2^256.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Signature.InvalidSError"
		});
	}
};
/** Thrown when the signature has an invalid `yParity` value. */
var InvalidYParityError = class extends BaseError {
	constructor({ value }) {
		super(`Value \`${value}\` is an invalid y-parity value. Y-parity must be 0 or 1.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Signature.InvalidYParityError"
		});
	}
};
/** Thrown when the signature has an invalid `v` value. */
var InvalidVError = class extends BaseError {
	constructor({ value }) {
		super(`Value \`${value}\` is an invalid v value. v must be 27, 28 or >=35.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Signature.InvalidVError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/Authorization.js
/**
* Converts an [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) Authorization object into a typed {@link ox#Authorization.Authorization}.
*
* @example
* An Authorization can be instantiated from an [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) Authorization tuple in object format.
*
* ```ts twoslash
* import { Authorization } from 'ox'
*
* const authorization = Authorization.from({
*   address: '0x1234567890abcdef1234567890abcdef12345678',
*   chainId: 1,
*   nonce: 69n,
* })
* ```
*
* @example
* ### Attaching Signatures
*
* A {@link ox#Signature.Signature} can be attached with the `signature` option. The example below demonstrates signing
* an Authorization with {@link ox#Secp256k1.(sign:function)}.
*
* ```ts twoslash
* import { Authorization, Secp256k1 } from 'ox'
*
* const authorization = Authorization.from({
*   address: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
*   chainId: 1,
*   nonce: 40n,
* })
*
* const signature = Secp256k1.sign({
*   payload: Authorization.getSignPayload(authorization),
*   privateKey: '0x...',
* })
*
* const authorization_signed = Authorization.from(authorization, { signature }) // [!code focus]
* ```
*
* @param authorization - An [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) Authorization tuple in object format.
* @param options - Authorization options.
* @returns The {@link ox#Authorization.Authorization}.
*/
function from(authorization, options = {}) {
	if (typeof authorization.chainId === "string") return fromRpc(authorization);
	return {
		...authorization,
		...options.signature
	};
}
/**
* Converts an {@link ox#Authorization.Rpc} to an {@link ox#Authorization.Authorization}.
*
* @example
* ```ts twoslash
* import { Authorization } from 'ox'
*
* const authorization = Authorization.fromRpc({
*   address: '0x0000000000000000000000000000000000000000',
*   chainId: '0x1',
*   nonce: '0x1',
*   r: '0x635dc2033e60185bb36709c29c75d64ea51dfbd91c32ef4be198e4ceb169fb4d',
*   s: '0x50c2667ac4c771072746acfdcf1f1483336dcca8bd2df47cd83175dbe60f0540',
*   yParity: '0x0',
* })
* ```
*
* @param authorization - The RPC-formatted Authorization.
* @returns A signed {@link ox#Authorization.Authorization}.
*/
function fromRpc(authorization) {
	const { address, chainId, nonce } = authorization;
	const signature = extract(authorization);
	return {
		address,
		chainId: Number(chainId),
		nonce: BigInt(nonce),
		...signature
	};
}
/**
* Computes the sign payload for an {@link ox#Authorization.Authorization} in [EIP-7702 format](https://eips.ethereum.org/EIPS/eip-7702): `keccak256('0x05' || rlp([chain_id, address, nonce]))`.
*
* @example
* The example below demonstrates computing the sign payload for an {@link ox#Authorization.Authorization}. This payload
* can then be passed to signing functions like {@link ox#Secp256k1.(sign:function)}.
*
* ```ts twoslash
* import { Authorization, Secp256k1 } from 'ox'
*
* const authorization = Authorization.from({
*   address: '0x1234567890abcdef1234567890abcdef12345678',
*   chainId: 1,
*   nonce: 69n,
* })
*
* const payload = Authorization.getSignPayload(authorization) // [!code focus]
*
* const signature = Secp256k1.sign({
*   payload,
*   privateKey: '0x...',
* })
* ```
*
* @param authorization - The {@link ox#Authorization.Authorization}.
* @returns The sign payload.
*/
function getSignPayload$2(authorization) {
	return hash(authorization);
}
/**
* Computes the hash for an {@link ox#Authorization.Authorization} in [EIP-7702 format](https://eips.ethereum.org/EIPS/eip-7702): `keccak256('0x05' || rlp([chain_id, address, nonce]))`.
*
* @example
* ```ts twoslash
* import { Authorization } from 'ox'
*
* const authorization = Authorization.from({
*   address: '0x1234567890abcdef1234567890abcdef12345678',
*   chainId: 1,
*   nonce: 69n,
* })
*
* const hash = Authorization.hash(authorization) // [!code focus]
* ```
*
* @param authorization - The {@link ox#Authorization.Authorization}.
* @returns The hash.
*/
function hash(authorization) {
	return keccak256(concat$1("0x05", fromHex$1(toTuple(authorization))));
}
/**
* Converts an {@link ox#Authorization.Authorization} to an {@link ox#Authorization.Rpc}.
*
* @example
* ```ts twoslash
* import { Authorization } from 'ox'
*
* const authorization = Authorization.toRpc({
*   address: '0x0000000000000000000000000000000000000000',
*   chainId: 1,
*   nonce: 1n,
*   r: 44944627813007772897391531230081695102703289123332187696115181104739239197517n,
*   s: 36528503505192438307355164441104001310566505351980369085208178712678799181120n,
*   yParity: 0,
* })
* ```
*
* @param authorization - An Authorization.
* @returns An RPC-formatted Authorization.
*/
function toRpc(authorization) {
	const { address, chainId, nonce, ...signature } = authorization;
	return {
		address,
		chainId: fromNumber$1(chainId),
		nonce: fromNumber$1(nonce),
		...toRpc$1(signature)
	};
}
/**
* Converts an {@link ox#Authorization.List} to an {@link ox#Authorization.ListRpc}.
*
* @example
* ```ts twoslash
* import { Authorization } from 'ox'
*
* const authorization = Authorization.toRpcList([{
*   address: '0x0000000000000000000000000000000000000000',
*   chainId: 1,
*   nonce: 1n,
*   r: 44944627813007772897391531230081695102703289123332187696115181104739239197517n,
*   s: 36528503505192438307355164441104001310566505351980369085208178712678799181120n,
*   yParity: 0,
* }])
* ```
*
* @param authorizationList - An Authorization List.
* @returns An RPC-formatted Authorization List.
*/
function toRpcList(authorizationList) {
	return authorizationList.map(toRpc);
}
/**
* Converts an {@link ox#Authorization.Authorization} to an {@link ox#Authorization.Tuple}.
*
* @example
* ```ts twoslash
* import { Authorization } from 'ox'
*
* const authorization = Authorization.from({
*   address: '0x1234567890abcdef1234567890abcdef12345678',
*   chainId: 1,
*   nonce: 69n,
* })
*
* const tuple = Authorization.toTuple(authorization) // [!code focus]
* // @log: [
* // @log:   address: '0x1234567890abcdef1234567890abcdef12345678',
* // @log:   chainId: 1,
* // @log:   nonce: 69n,
* // @log: ]
* ```
*
* @param authorization - The {@link ox#Authorization.Authorization}.
* @returns An [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) Authorization tuple.
*/
function toTuple(authorization) {
	const { address, chainId, nonce } = authorization;
	const signature = extract(authorization);
	return [
		chainId ? fromNumber$1(chainId) : "0x",
		address,
		nonce ? fromNumber$1(nonce) : "0x",
		...signature ? toTuple$1(signature) : []
	];
}
/**
* Converts an {@link ox#Authorization.List} to an {@link ox#Authorization.TupleList}.
*
* @example
* ```ts twoslash
* import { Authorization } from 'ox'
*
* const authorization_1 = Authorization.from({
*   address: '0x1234567890abcdef1234567890abcdef12345678',
*   chainId: 1,
*   nonce: 69n,
* })
* const authorization_2 = Authorization.from({
*   address: '0x1234567890abcdef1234567890abcdef12345678',
*   chainId: 3,
*   nonce: 20n,
* })
*
* const tuple = Authorization.toTupleList([authorization_1, authorization_2]) // [!code focus]
* // @log: [
* // @log:   [
* // @log:     address: '0x1234567890abcdef1234567890abcdef12345678',
* // @log:     chainId: 1,
* // @log:     nonce: 69n,
* // @log:   ],
* // @log:   [
* // @log:     address: '0x1234567890abcdef1234567890abcdef12345678',
* // @log:     chainId: 3,
* // @log:     nonce: 20n,
* // @log:   ],
* // @log: ]
* ```
*
* @param list - An {@link ox#Authorization.List}.
* @returns An [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) Authorization tuple list.
*/
function toTupleList(list) {
	if (!list || list.length === 0) return [];
	const tupleList = [];
	for (const authorization of list) tupleList.push(toTuple(authorization));
	return tupleList;
}
//#endregion
//#region node_modules/ox/_esm/core/internal/entropy.js
var extraEntropy = false;
//#endregion
//#region node_modules/ox/_esm/core/Secp256k1.js
/**
* Signs the payload with the provided private key.
*
* @example
* ```ts twoslash
* import { Secp256k1 } from 'ox'
*
* const signature = Secp256k1.sign({ // [!code focus]
*   payload: '0xdeadbeef', // [!code focus]
*   privateKey: '0x...' // [!code focus]
* }) // [!code focus]
* ```
*
* @param options - The signing options.
* @returns The ECDSA {@link ox#Signature.Signature}.
*/
function sign(options) {
	const { extraEntropy: extraEntropy$1 = extraEntropy, hash, payload, privateKey } = options;
	const { r, s, recovery } = secp256k1.sign(from$3(payload), from$3(privateKey), {
		extraEntropy: typeof extraEntropy$1 === "boolean" ? extraEntropy$1 : from$4(extraEntropy$1).slice(2),
		lowS: true,
		...hash ? { prehash: true } : {}
	});
	return {
		r,
		s,
		yParity: recovery
	};
}
//#endregion
//#region node_modules/ox/_esm/core/PersonalMessage.js
/**
* Encodes a personal sign message in [ERC-191 format](https://eips.ethereum.org/EIPS/eip-191#version-0x45-e): `0x19 ‖ "Ethereum Signed Message:\n" + message.length ‖ message`.
*
* @example
* ```ts twoslash
* import { Hex, PersonalMessage } from 'ox'
*
* const data = PersonalMessage.encode(Hex.fromString('hello world'))
* // @log: '0x19457468657265756d205369676e6564204d6573736167653a0a313168656c6c6f20776f726c64'
* // @log: (0x19 ‖ 'Ethereum Signed Message:\n11' ‖ 'hello world')
* ```
*
* @param data - The data to encode.
* @returns The encoded personal sign message.
*/
function encode$1(data) {
	const message = from$4(data);
	return concat$1("0x19", fromString$1("Ethereum Signed Message:\n" + size$1(message)), message);
}
/**
* Gets the payload to use for signing an [ERC-191 formatted](https://eips.ethereum.org/EIPS/eip-191#version-0x45-e) personal message.
*
* @example
* ```ts twoslash
* import { Hex, PersonalMessage, Secp256k1 } from 'ox'
*
* const payload = PersonalMessage.getSignPayload(Hex.fromString('hello world')) // [!code focus]
*
* const signature = Secp256k1.sign({ payload, privateKey: '0x...' })
* ```
*
* @param data - The data to get the sign payload for.
* @returns The payload to use for signing.
*/
function getSignPayload$1(data) {
	return keccak256(encode$1(data));
}
//#endregion
//#region node_modules/ox/_esm/core/Value.js
/** @see https://ethereum.github.io/yellowpaper/paper.pdf */
var exponents = {
	wei: 0,
	gwei: 9,
	szabo: 12,
	finney: 15,
	ether: 18
};
/**
* Formats a `bigint` Value to its string representation (divided by the given exponent).
*
* @example
* ```ts twoslash
* import { Value } from 'ox'
*
* Value.format(420_000_000_000n, 9)
* // @log: '420'
* ```
*
* @param value - The `bigint` Value to format.
* @param decimals - The exponent to divide the `bigint` Value by.
* @returns The string representation of the Value.
*/
function format(value, decimals = 0) {
	let display = value.toString();
	const negative = display.startsWith("-");
	if (negative) display = display.slice(1);
	display = display.padStart(decimals, "0");
	let [integer, fraction] = [display.slice(0, display.length - decimals), display.slice(display.length - decimals)];
	fraction = fraction.replace(/(0+)$/, "");
	return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
}
/**
* Formats a `bigint` Value (default: wei) to a string representation of Gwei.
*
* @example
* ```ts twoslash
* import { Value } from 'ox'
*
* Value.formatGwei(1_000_000_000n)
* // @log: '1'
* ```
*
* @param wei - The Value to format.
* @param unit - The unit to format the Value in. @default 'wei'.
* @returns The Gwei string representation of the Value.
*/
function formatGwei(wei, unit = "wei") {
	return format(wei, exponents.gwei - exponents[unit]);
}
//#endregion
//#region node_modules/ox/_esm/core/TransactionEnvelope.js
/**
* Thrown when a fee cap is too high.
*
* @example
* ```ts twoslash
* import { TransactionEnvelopeEip1559 } from 'ox'
*
* TransactionEnvelopeEip1559.assert({
*   maxFeePerGas: 2n ** 256n - 1n + 1n,
*   chainId: 1,
* })
* // @error: TransactionEnvelope.FeeCapTooHighError: The fee cap (`maxFeePerGas`/`maxPriorityFeePerGas` = 115792089237316195423570985008687907853269984665640564039457584007913.129639936 gwei) cannot be higher than the maximum allowed value (2^256-1).
* ```
*/
var FeeCapTooHighError = class extends BaseError {
	constructor({ feeCap } = {}) {
		super(`The fee cap (\`maxFeePerGas\`/\`maxPriorityFeePerGas\`${feeCap ? ` = ${formatGwei(feeCap)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "TransactionEnvelope.FeeCapTooHighError"
		});
	}
};
/**
* Thrown when a gas price is too high.
*
* @example
* ```ts twoslash
* import { TransactionEnvelopeLegacy } from 'ox'
*
* TransactionEnvelopeLegacy.assert({
*   gasPrice: 2n ** 256n - 1n + 1n,
*   chainId: 1,
* })
* // @error: TransactionEnvelope.GasPriceTooHighError: The gas price (`gasPrice` = 115792089237316195423570985008687907853269984665640564039457584007913.129639936 gwei) cannot be higher than the maximum allowed value (2^256-1).
* ```
*/
var GasPriceTooHighError = class extends BaseError {
	constructor({ gasPrice } = {}) {
		super(`The gas price (\`gasPrice\`${gasPrice ? ` = ${formatGwei(gasPrice)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "TransactionEnvelope.GasPriceTooHighError"
		});
	}
};
/**
* Thrown when a chain ID is invalid.
*
* @example
* ```ts twoslash
* import { TransactionEnvelopeEip1559 } from 'ox'
*
* TransactionEnvelopeEip1559.assert({ chainId: 0 })
* // @error: TransactionEnvelope.InvalidChainIdError: Chain ID "0" is invalid.
* ```
*/
var InvalidChainIdError = class extends BaseError {
	constructor({ chainId }) {
		super(typeof chainId !== "undefined" ? `Chain ID "${chainId}" is invalid.` : "Chain ID is invalid.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "TransactionEnvelope.InvalidChainIdError"
		});
	}
};
/**
* Thrown when a tip is higher than a fee cap.
*
* @example
* ```ts twoslash
* import { TransactionEnvelopeEip1559 } from 'ox'
*
* TransactionEnvelopeEip1559.assert({
*   chainId: 1,
*   maxFeePerGas: 10n,
*   maxPriorityFeePerGas: 11n,
* })
* // @error: TransactionEnvelope.TipAboveFeeCapError: The provided tip (`maxPriorityFeePerGas` = 11 gwei) cannot be higher than the fee cap (`maxFeePerGas` = 10 gwei).
* ```
*/
var TipAboveFeeCapError = class extends BaseError {
	constructor({ maxPriorityFeePerGas, maxFeePerGas } = {}) {
		super([`The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}).`].join("\n"));
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "TransactionEnvelope.TipAboveFeeCapError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/TransactionEnvelopeLegacy.js
/**
* Asserts a {@link ox#TransactionEnvelopeLegacy.TransactionEnvelopeLegacy} is valid.
*
* @example
* ```ts twoslash
* import { TransactionEnvelopeLegacy, Value } from 'ox'
*
* TransactionEnvelopeLegacy.assert({
*   gasPrice: 2n ** 256n - 1n + 1n,
*   chainId: 1,
*   to: '0x0000000000000000000000000000000000000000',
*   value: Value.fromEther('1'),
* })
* // @error: GasPriceTooHighError:
* // @error: The gas price (`gasPrice` = 115792089237316195423570985008687907853269984665640564039457584007913 gwei) cannot be
* // @error: higher than the maximum allowed value (2^256-1).
* ```
*
* @param envelope - The transaction envelope to assert.
*/
function assert$4(envelope) {
	const { chainId, gasPrice, to } = envelope;
	if (to) assert$6(to, { strict: false });
	if (typeof chainId !== "undefined" && chainId <= 0) throw new InvalidChainIdError({ chainId });
	if (gasPrice && BigInt(gasPrice) > 2n ** 256n - 1n) throw new GasPriceTooHighError({ gasPrice });
}
/**
* Serializes a {@link ox#TransactionEnvelopeLegacy.TransactionEnvelopeLegacy}.
*
* @example
* ```ts twoslash
* // @noErrors
* import { TransactionEnvelopeLegacy } from 'ox'
*
* const envelope = TransactionEnvelopeLegacy.from({
*   chainId: 1,
*   gasPrice: Value.fromGwei('10'),
*   to: '0x0000000000000000000000000000000000000000',
*   value: Value.fromEther('1'),
* })
*
* const serialized = TransactionEnvelopeLegacy.serialize(envelope) // [!code focus]
* ```
*
* @example
* ### Attaching Signatures
*
* It is possible to attach a `signature` to the serialized Transaction Envelope.
*
* ```ts twoslash
* // @noErrors
* import { Secp256k1, TransactionEnvelopeLegacy, Value } from 'ox'
*
* const envelope = TransactionEnvelopeLegacy.from({
*   chainId: 1,
*   gasPrice: Value.fromGwei('10'),
*   to: '0x0000000000000000000000000000000000000000',
*   value: Value.fromEther('1'),
* })
*
* const signature = Secp256k1.sign({
*   payload: TransactionEnvelopeLegacy.getSignPayload(envelope),
*   privateKey: '0x...',
* })
*
* const serialized = TransactionEnvelopeLegacy.serialize(envelope, { // [!code focus]
*   signature, // [!code focus]
* }) // [!code focus]
*
* // ... send `serialized` transaction to JSON-RPC `eth_sendRawTransaction`
* ```
*
* @param envelope - The Transaction Envelope to serialize.
* @param options - Options.
* @returns The serialized Transaction Envelope.
*/
function serialize$4(envelope, options = {}) {
	const { chainId = 0, gas, data, input, nonce, to, value, gasPrice } = envelope;
	assert$4(envelope);
	let serialized = [
		nonce ? fromNumber$1(nonce) : "0x",
		gasPrice ? fromNumber$1(gasPrice) : "0x",
		gas ? fromNumber$1(gas) : "0x",
		to ?? "0x",
		value ? fromNumber$1(value) : "0x",
		data ?? input ?? "0x"
	];
	const signature = (() => {
		if (options.signature) return {
			r: options.signature.r,
			s: options.signature.s,
			v: yParityToV(options.signature.yParity)
		};
		if (typeof envelope.r === "undefined" || typeof envelope.s === "undefined") return void 0;
		return {
			r: envelope.r,
			s: envelope.s,
			v: envelope.v
		};
	})();
	if (signature) {
		const v = (() => {
			if (signature.v >= 35) {
				if (Math.floor((signature.v - 35) / 2) > 0) return signature.v;
				return 27 + (signature.v === 35 ? 0 : 1);
			}
			if (chainId > 0) return chainId * 2 + 35 + signature.v - 27;
			const v = 27 + (signature.v === 27 ? 0 : 1);
			if (signature.v !== v) throw new InvalidVError({ value: signature.v });
			return v;
		})();
		serialized = [
			...serialized,
			fromNumber$1(v),
			signature.r === 0n ? "0x" : trimLeft(fromNumber$1(signature.r)),
			signature.s === 0n ? "0x" : trimLeft(fromNumber$1(signature.s))
		];
	} else if (chainId > 0) serialized = [
		...serialized,
		fromNumber$1(chainId),
		"0x",
		"0x"
	];
	return fromHex$1(serialized);
}
//#endregion
//#region node_modules/ox/_esm/core/TransactionEnvelopeEip1559.js
var serializedType$1 = "0x02";
/**
* Asserts a {@link ox#TransactionEnvelopeEip1559.TransactionEnvelopeEip1559} is valid.
*
* @example
* ```ts twoslash
* import { TransactionEnvelopeEip1559, Value } from 'ox'
*
* TransactionEnvelopeEip1559.assert({
*   maxFeePerGas: 2n ** 256n - 1n + 1n,
*   chainId: 1,
*   to: '0x0000000000000000000000000000000000000000',
*   value: Value.fromEther('1'),
* })
* // @error: FeeCapTooHighError:
* // @error: The fee cap (`masFeePerGas` = 115792089237316195423570985008687907853269984665640564039457584007913 gwei) cannot be
* // @error: higher than the maximum allowed value (2^256-1).
* ```
*
* @param envelope - The transaction envelope to assert.
*/
function assert$3(envelope) {
	const { chainId, maxPriorityFeePerGas, maxFeePerGas, to } = envelope;
	if (chainId <= 0) throw new InvalidChainIdError({ chainId });
	if (to) assert$6(to, { strict: false });
	if (maxFeePerGas && BigInt(maxFeePerGas) > 2n ** 256n - 1n) throw new FeeCapTooHighError({ feeCap: maxFeePerGas });
	if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas) throw new TipAboveFeeCapError({
		maxFeePerGas,
		maxPriorityFeePerGas
	});
}
/**
* Serializes a {@link ox#TransactionEnvelopeEip1559.TransactionEnvelopeEip1559}.
*
* @example
* ```ts twoslash
* import { TransactionEnvelopeEip1559, Value } from 'ox'
*
* const envelope = TransactionEnvelopeEip1559.from({
*   chainId: 1,
*   maxFeePerGas: Value.fromGwei('10'),
*   maxPriorityFeePerGas: Value.fromGwei('1'),
*   to: '0x0000000000000000000000000000000000000000',
*   value: Value.fromEther('1'),
* })
*
* const serialized = TransactionEnvelopeEip1559.serialize(envelope) // [!code focus]
* ```
*
* @example
* ### Attaching Signatures
*
* It is possible to attach a `signature` to the serialized Transaction Envelope.
*
* ```ts twoslash
* import { Secp256k1, TransactionEnvelopeEip1559, Value } from 'ox'
*
* const envelope = TransactionEnvelopeEip1559.from({
*   chainId: 1,
*   maxFeePerGas: Value.fromGwei('10'),
*   maxPriorityFeePerGas: Value.fromGwei('1'),
*   to: '0x0000000000000000000000000000000000000000',
*   value: Value.fromEther('1'),
* })
*
* const signature = Secp256k1.sign({
*   payload: TransactionEnvelopeEip1559.getSignPayload(envelope),
*   privateKey: '0x...',
* })
*
* const serialized = TransactionEnvelopeEip1559.serialize(envelope, { // [!code focus]
*   signature, // [!code focus]
* }) // [!code focus]
*
* // ... send `serialized` transaction to JSON-RPC `eth_sendRawTransaction`
* ```
*
* @param envelope - The Transaction Envelope to serialize.
* @param options - Options.
* @returns The serialized Transaction Envelope.
*/
function serialize$3(envelope, options = {}) {
	const { chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data, input } = envelope;
	assert$3(envelope);
	const accessTupleList = toTupleList$1(accessList);
	const signature = extract(options.signature || envelope);
	return concat$1(serializedType$1, fromHex$1([
		fromNumber$1(chainId),
		nonce ? fromNumber$1(nonce) : "0x",
		maxPriorityFeePerGas ? fromNumber$1(maxPriorityFeePerGas) : "0x",
		maxFeePerGas ? fromNumber$1(maxFeePerGas) : "0x",
		gas ? fromNumber$1(gas) : "0x",
		to ?? "0x",
		value ? fromNumber$1(value) : "0x",
		data ?? input ?? "0x",
		accessTupleList,
		...signature ? toTuple$1(signature) : []
	]));
}
//#endregion
//#region node_modules/ox/_esm/core/TransactionEnvelopeEip2930.js
/**
* Asserts a {@link ox#TransactionEnvelopeEip2930.TransactionEnvelopeEip2930} is valid.
*
* @example
* ```ts twoslash
* import { TransactionEnvelopeEip2930, Value } from 'ox'
*
* TransactionEnvelopeEip2930.assert({
*   gasPrice: 2n ** 256n - 1n + 1n,
*   chainId: 1,
*   to: '0x0000000000000000000000000000000000000000',
*   value: Value.fromEther('1'),
* })
* // @error: GasPriceTooHighError:
* // @error: The gas price (`gasPrice` = 115792089237316195423570985008687907853269984665640564039457584007913 gwei) cannot be
* // @error: higher than the maximum allowed value (2^256-1).
* ```
*
* @param envelope - The transaction envelope to assert.
*/
function assert$2(envelope) {
	const { chainId, gasPrice, to } = envelope;
	if (chainId <= 0) throw new InvalidChainIdError({ chainId });
	if (to) assert$6(to, { strict: false });
	if (gasPrice && BigInt(gasPrice) > 2n ** 256n - 1n) throw new GasPriceTooHighError({ gasPrice });
}
/**
* Serializes a {@link ox#TransactionEnvelopeEip2930.TransactionEnvelopeEip2930}.
*
* @example
* ```ts twoslash
* import { TransactionEnvelopeEip2930, Value } from 'ox'
*
* const envelope = TransactionEnvelopeEip2930.from({
*   chainId: 1,
*   gasPrice: Value.fromGwei('10'),
*   to: '0x0000000000000000000000000000000000000000',
*   value: Value.fromEther('1'),
* })
*
* const serialized = TransactionEnvelopeEip2930.serialize(envelope) // [!code focus]
* ```
*
* @example
* ### Attaching Signatures
*
* It is possible to attach a `signature` to the serialized Transaction Envelope.
*
* ```ts twoslash
* import { Secp256k1, TransactionEnvelopeEip2930, Value } from 'ox'
*
* const envelope = TransactionEnvelopeEip2930.from({
*   chainId: 1,
*   gasPrice: Value.fromGwei('10'),
*   to: '0x0000000000000000000000000000000000000000',
*   value: Value.fromEther('1'),
* })
*
* const signature = Secp256k1.sign({
*   payload: TransactionEnvelopeEip2930.getSignPayload(envelope),
*   privateKey: '0x...',
* })
*
* const serialized = TransactionEnvelopeEip2930.serialize(envelope, { // [!code focus]
*   signature, // [!code focus]
* }) // [!code focus]
*
* // ... send `serialized` transaction to JSON-RPC `eth_sendRawTransaction`
* ```
*
* @param envelope - The Transaction Envelope to serialize.
* @param options - Options.
* @returns The serialized Transaction Envelope.
*/
function serialize$2(envelope, options = {}) {
	const { chainId, gas, data, input, nonce, to, value, accessList, gasPrice } = envelope;
	assert$2(envelope);
	const accessTupleList = toTupleList$1(accessList);
	const signature = extract(options.signature || envelope);
	return concat$1("0x01", fromHex$1([
		fromNumber$1(chainId),
		nonce ? fromNumber$1(nonce) : "0x",
		gasPrice ? fromNumber$1(gasPrice) : "0x",
		gas ? fromNumber$1(gas) : "0x",
		to ?? "0x",
		value ? fromNumber$1(value) : "0x",
		data ?? input ?? "0x",
		accessTupleList,
		...signature ? toTuple$1(signature) : []
	]));
}
//#endregion
//#region node_modules/ox/_esm/core/TransactionEnvelopeEip7702.js
var serializedType = "0x04";
/**
* Asserts a {@link ox#TransactionEnvelopeEip7702.TransactionEnvelopeEip7702} is valid.
*
* @example
* ```ts twoslash
* import { TransactionEnvelopeEip7702, Value } from 'ox'
*
* TransactionEnvelopeEip7702.assert({
*   authorizationList: [],
*   maxFeePerGas: 2n ** 256n - 1n + 1n,
*   chainId: 1,
*   to: '0x0000000000000000000000000000000000000000',
*   value: Value.fromEther('1'),
* })
* // @error: FeeCapTooHighError:
* // @error: The fee cap (`masFeePerGas` = 115792089237316195423570985008687907853269984665640564039457584007913 gwei) cannot be
* // @error: higher than the maximum allowed value (2^256-1).
* ```
*
* @param envelope - The transaction envelope to assert.
*/
function assert$1(envelope) {
	const { authorizationList } = envelope;
	if (authorizationList) for (const authorization of authorizationList) {
		const { address, chainId } = authorization;
		if (address) assert$6(address, { strict: false });
		if (Number(chainId) < 0) throw new InvalidChainIdError({ chainId });
	}
	assert$3(envelope);
}
/**
* Serializes a {@link ox#TransactionEnvelopeEip7702.TransactionEnvelopeEip7702}.
*
* @example
* ```ts twoslash
* // @noErrors
* import { Authorization, Secp256k1, TransactionEnvelopeEip7702, Value } from 'ox'
*
* const authorization = Authorization.from({
*   address: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*   chainId: 1,
*   nonce: 0n,
* })
*
* const signature = Secp256k1.sign({
*   payload: Authorization.getSignPayload(authorization),
*   privateKey: '0x...',
* })
*
* const authorizationList = [Authorization.from(authorization, { signature })]
*
* const envelope = TransactionEnvelopeEip7702.from({
*   authorizationList,
*   chainId: 1,
*   maxFeePerGas: Value.fromGwei('10'),
*   to: '0x0000000000000000000000000000000000000000',
*   value: Value.fromEther('1'),
* })
*
* const serialized = TransactionEnvelopeEip7702.serialize(envelope) // [!code focus]
* ```
*
* @example
* ### Attaching Signatures
*
* It is possible to attach a `signature` to the serialized Transaction Envelope.
*
* ```ts twoslash
* // @noErrors
* import { Secp256k1, TransactionEnvelopeEip7702, Value } from 'ox'
*
* const envelope = TransactionEnvelopeEip7702.from({
*   authorizationList: [...],
*   chainId: 1,
*   maxFeePerGas: Value.fromGwei('10'),
*   to: '0x0000000000000000000000000000000000000000',
*   value: Value.fromEther('1'),
* })
*
* const signature = Secp256k1.sign({
*   payload: TransactionEnvelopeEip7702.getSignPayload(envelope),
*   privateKey: '0x...',
* })
*
* const serialized = TransactionEnvelopeEip7702.serialize(envelope, { // [!code focus]
*   signature, // [!code focus]
* }) // [!code focus]
*
* // ... send `serialized` transaction to JSON-RPC `eth_sendRawTransaction`
* ```
*
* @param envelope - The Transaction Envelope to serialize.
* @param options - Options.
* @returns The serialized Transaction Envelope.
*/
function serialize$1(envelope, options = {}) {
	const { authorizationList, chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data, input } = envelope;
	assert$1(envelope);
	const accessTupleList = toTupleList$1(accessList);
	const authorizationTupleList = toTupleList(authorizationList);
	const signature = extract(options.signature || envelope);
	return concat$1(serializedType, fromHex$1([
		fromNumber$1(chainId),
		nonce ? fromNumber$1(nonce) : "0x",
		maxPriorityFeePerGas ? fromNumber$1(maxPriorityFeePerGas) : "0x",
		maxFeePerGas ? fromNumber$1(maxFeePerGas) : "0x",
		gas ? fromNumber$1(gas) : "0x",
		to ?? "0x",
		value ? fromNumber$1(value) : "0x",
		data ?? input ?? "0x",
		accessTupleList,
		authorizationTupleList,
		...signature ? toTuple$1(signature) : []
	]));
}
//#endregion
//#region node_modules/ox/_esm/core/TypedData.js
/**
* Asserts that [EIP-712 Typed Data](https://eips.ethereum.org/EIPS/eip-712) is valid.
*
* @example
* ```ts twoslash
* import { TypedData } from 'ox'
*
* TypedData.assert({
*   domain: {
*     name: 'Ether!',
*     version: '1',
*     chainId: 1,
*     verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
*   },
*   primaryType: 'Foo',
*   types: {
*     Foo: [
*       { name: 'address', type: 'address' },
*       { name: 'name', type: 'string' },
*       { name: 'foo', type: 'string' },
*     ],
*   },
*   message: {
*     address: '0xb9CAB4F0E46F7F6b1024b5A7463734fa68E633f9',
*     name: 'jxom',
*     foo: '0xb9CAB4F0E46F7F6b1024b5A7463734fa68E633f9',
*   },
* })
* ```
*
* @param value - The Typed Data to validate.
*/
function assert(value) {
	const { domain, message, primaryType, types } = value;
	const validateData = (struct, data) => {
		for (const param of struct) {
			const { name, type } = param;
			const value = data[name];
			const integerMatch = type.match(integerRegex);
			if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
				const [, base, size_] = integerMatch;
				fromNumber$1(value, {
					signed: base === "int",
					size: Number.parseInt(size_ ?? "") / 8
				});
			}
			if (type === "address" && typeof value === "string" && !validate$1(value)) throw new InvalidAddressError({
				address: value,
				cause: new InvalidInputError()
			});
			const bytesMatch = type.match(bytesRegex);
			if (bytesMatch) {
				const [, size] = bytesMatch;
				if (size && size$1(value) !== Number.parseInt(size)) throw new BytesSizeMismatchError({
					expectedSize: Number.parseInt(size),
					givenSize: size$1(value)
				});
			}
			const struct = types[type];
			if (struct) {
				validateReference(type);
				validateData(struct, value);
			}
		}
	};
	if (types.EIP712Domain && domain) {
		if (typeof domain !== "object") throw new InvalidDomainError({ domain });
		validateData(types.EIP712Domain, domain);
	}
	if (primaryType !== "EIP712Domain") if (types[primaryType]) validateData(types[primaryType], message);
	else throw new InvalidPrimaryTypeError({
		primaryType,
		types
	});
}
/**
* Encodes typed data in [EIP-712 format](https://eips.ethereum.org/EIPS/eip-712): `0x19 ‖ 0x01 ‖ domainSeparator ‖ hashStruct(message)`.
*
* @example
* ```ts twoslash
* import { TypedData, Hash } from 'ox'
*
* const data = TypedData.encode({ // [!code focus:33]
*   domain: {
*     name: 'Ether Mail',
*     version: '1',
*     chainId: 1,
*     verifyingContract: '0x0000000000000000000000000000000000000000',
*   },
*   types: {
*     Person: [
*       { name: 'name', type: 'string' },
*       { name: 'wallet', type: 'address' },
*     ],
*     Mail: [
*       { name: 'from', type: 'Person' },
*       { name: 'to', type: 'Person' },
*       { name: 'contents', type: 'string' },
*     ],
*   },
*   primaryType: 'Mail',
*   message: {
*     from: {
*       name: 'Cow',
*       wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
*     },
*     to: {
*       name: 'Bob',
*       wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
*     },
*     contents: 'Hello, Bob!',
*   },
* })
* // @log: '0x19012fdf3441fcaf4f30c7e16292b258a5d7054a4e2e00dbd7b7d2f467f2b8fb9413c52c0ee5d84264471806290a3f2c4cecfc5490626bf912d01f240d7a274b371e'
* // @log: (0x19 ‖ 0x01 ‖ domainSeparator ‖ hashStruct(message))
*
* const hash = Hash.keccak256(data)
* ```
*
* @param value - The Typed Data to encode.
* @returns The encoded Typed Data.
*/
function encode(value) {
	const { domain = {}, message, primaryType } = value;
	const types = {
		EIP712Domain: extractEip712DomainTypes(domain),
		...value.types
	};
	assert({
		domain,
		message,
		primaryType,
		types
	});
	const parts = ["0x19", "0x01"];
	if (domain) parts.push(hashDomain({
		domain,
		types
	}));
	if (primaryType !== "EIP712Domain") parts.push(hashStruct({
		data: message,
		primaryType,
		types
	}));
	return concat$1(...parts);
}
/**
* Encodes [EIP-712 Typed Data](https://eips.ethereum.org/EIPS/eip-712) schema for the provided primaryType.
*
* @example
* ```ts twoslash
* import { TypedData } from 'ox'
*
* TypedData.encodeType({
*   types: {
*     Foo: [
*       { name: 'address', type: 'address' },
*       { name: 'name', type: 'string' },
*       { name: 'foo', type: 'string' },
*     ],
*   },
*   primaryType: 'Foo',
* })
* // @log: 'Foo(address address,string name,string foo)'
* ```
*
* @param value - The Typed Data schema.
* @returns The encoded type.
*/
function encodeType(value) {
	const { primaryType, types } = value;
	let result = "";
	const unsortedDeps = findTypeDependencies({
		primaryType,
		types
	});
	unsortedDeps.delete(primaryType);
	const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
	for (const type of deps) result += `${type}(${(types[type] ?? []).map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
	return result;
}
/**
* Gets [EIP-712 Typed Data](https://eips.ethereum.org/EIPS/eip-712) schema for EIP-721 domain.
*
* @example
* ```ts twoslash
* import { TypedData } from 'ox'
*
* TypedData.extractEip712DomainTypes({
*   name: 'Ether!',
*   version: '1',
*   chainId: 1,
*   verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
* })
* // @log: [
* // @log:   { 'name': 'name', 'type': 'string' },
* // @log:   { 'name': 'version', 'type': 'string' },
* // @log:   { 'name': 'chainId', 'type': 'uint256' },
* // @log:   { 'name': 'verifyingContract', 'type': 'address' },
* // @log: ]
* ```
*
* @param domain - The EIP-712 domain.
* @returns The EIP-712 domain schema.
*/
function extractEip712DomainTypes(domain) {
	return [
		typeof domain?.name === "string" && {
			name: "name",
			type: "string"
		},
		domain?.version && {
			name: "version",
			type: "string"
		},
		typeof domain?.chainId === "number" && {
			name: "chainId",
			type: "uint256"
		},
		domain?.verifyingContract && {
			name: "verifyingContract",
			type: "address"
		},
		domain?.salt && {
			name: "salt",
			type: "bytes32"
		}
	].filter(Boolean);
}
/**
* Gets the payload to use for signing typed data in [EIP-712 format](https://eips.ethereum.org/EIPS/eip-712).
*
* @example
* ```ts twoslash
* import { Secp256k1, TypedData, Hash } from 'ox'
*
* const payload = TypedData.getSignPayload({ // [!code focus:99]
*   domain: {
*     name: 'Ether Mail',
*     version: '1',
*     chainId: 1,
*     verifyingContract: '0x0000000000000000000000000000000000000000',
*   },
*   types: {
*     Person: [
*       { name: 'name', type: 'string' },
*       { name: 'wallet', type: 'address' },
*     ],
*     Mail: [
*       { name: 'from', type: 'Person' },
*       { name: 'to', type: 'Person' },
*       { name: 'contents', type: 'string' },
*     ],
*   },
*   primaryType: 'Mail',
*   message: {
*     from: {
*       name: 'Cow',
*       wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
*     },
*     to: {
*       name: 'Bob',
*       wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
*     },
*     contents: 'Hello, Bob!',
*   },
* })
*
* const signature = Secp256k1.sign({ payload, privateKey: '0x...' })
* ```
*
* @param value - The typed data to get the sign payload for.
* @returns The payload to use for signing.
*/
function getSignPayload(value) {
	return keccak256(encode(value));
}
/**
* Hashes [EIP-712 Typed Data](https://eips.ethereum.org/EIPS/eip-712) domain.
*
* @example
* ```ts twoslash
* import { TypedData } from 'ox'
*
* TypedData.hashDomain({
*   domain: {
*     name: 'Ether Mail',
*     version: '1',
*     chainId: 1,
*     verifyingContract: '0x0000000000000000000000000000000000000000',
*   },
* })
* // @log: '0x6192106f129ce05c9075d319c1fa6ea9b3ae37cbd0c1ef92e2be7137bb07baa1'
* ```
*
* @param value - The Typed Data domain and types.
* @returns The hashed domain.
*/
function hashDomain(value) {
	const { domain, types } = value;
	return hashStruct({
		data: domain,
		primaryType: "EIP712Domain",
		types: {
			...types,
			EIP712Domain: types?.EIP712Domain || extractEip712DomainTypes(domain)
		}
	});
}
/**
* Hashes [EIP-712 Typed Data](https://eips.ethereum.org/EIPS/eip-712) struct.
*
* @example
* ```ts twoslash
* import { TypedData } from 'ox'
*
* TypedData.hashStruct({
*   types: {
*     Foo: [
*       { name: 'address', type: 'address' },
*       { name: 'name', type: 'string' },
*       { name: 'foo', type: 'string' },
*     ],
*   },
*   primaryType: 'Foo',
*   data: {
*     address: '0xb9CAB4F0E46F7F6b1024b5A7463734fa68E633f9',
*     name: 'jxom',
*     foo: '0xb9CAB4F0E46F7F6b1024b5A7463734fa68E633f9',
*   },
* })
* // @log: '0x996fb3b6d48c50312d69abdd4c1b6fb02057c85aa86bb8d04c6f023326a168ce'
* ```
*
* @param value - The Typed Data struct to hash.
* @returns The hashed Typed Data struct.
*/
function hashStruct(value) {
	const { data, primaryType, types } = value;
	return keccak256(encodeData({
		data,
		primaryType,
		types
	}));
}
/**
* Serializes [EIP-712 Typed Data](https://eips.ethereum.org/EIPS/eip-712) schema into string.
*
* @example
* ```ts twoslash
* import { TypedData } from 'ox'
*
* TypedData.serialize({
*   domain: {
*     name: 'Ether!',
*     version: '1',
*     chainId: 1,
*     verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
*   },
*   primaryType: 'Foo',
*   types: {
*     Foo: [
*       { name: 'address', type: 'address' },
*       { name: 'name', type: 'string' },
*       { name: 'foo', type: 'string' },
*     ],
*   },
*   message: {
*     address: '0xb9CAB4F0E46F7F6b1024b5A7463734fa68E633f9',
*     name: 'jxom',
*     foo: '0xb9CAB4F0E46F7F6b1024b5A7463734fa68E633f9',
*   },
* })
* // @log: "{"domain":{},"message":{"address":"0xb9cab4f0e46f7f6b1024b5a7463734fa68e633f9","name":"jxom","foo":"0xb9CAB4F0E46F7F6b1024b5A7463734fa68E633f9"},"primaryType":"Foo","types":{"Foo":[{"name":"address","type":"address"},{"name":"name","type":"string"},{"name":"foo","type":"string"}]}}"
* ```
*
* @param value - The Typed Data schema to serialize.
* @returns The serialized Typed Data schema. w
*/
function serialize(value) {
	const { domain: domain_, message: message_, primaryType, types } = value;
	const normalizeData = (struct, value) => {
		const data = { ...value };
		for (const param of struct) {
			const { name, type } = param;
			if (type === "address") data[name] = data[name].toLowerCase();
		}
		return data;
	};
	return stringify({
		domain: (() => {
			if (!domain_) return {};
			return normalizeData(types.EIP712Domain ?? extractEip712DomainTypes(domain_), domain_);
		})(),
		message: (() => {
			if (primaryType === "EIP712Domain") return void 0;
			if (!types[primaryType]) return {};
			return normalizeData(types[primaryType], message_);
		})(),
		primaryType,
		types
	}, (_, value) => {
		if (typeof value === "bigint") return value.toString();
		return value;
	});
}
/**
* Checks if [EIP-712 Typed Data](https://eips.ethereum.org/EIPS/eip-712) is valid.
*
* @example
* ```ts twoslash
* import { TypedData } from 'ox'
*
* const valid = TypedData.validate({
*   domain: {
*     name: 'Ether!',
*     version: '1',
*     chainId: 1,
*     verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
*   },
*   primaryType: 'Foo',
*   types: {
*     Foo: [
*       { name: 'address', type: 'address' },
*       { name: 'name', type: 'string' },
*       { name: 'foo', type: 'string' },
*     ],
*   },
*   message: {
*     address: '0xb9CAB4F0E46F7F6b1024b5A7463734fa68E633f9',
*     name: 'jxom',
*     foo: '0xb9CAB4F0E46F7F6b1024b5A7463734fa68E633f9',
*   },
* })
* // @log: true
* ```
*
* @param value - The Typed Data to validate.
*/
function validate(value) {
	try {
		assert(value);
		return true;
	} catch {
		return false;
	}
}
/** Thrown when the bytes size of a typed data value does not match the expected size. */
var BytesSizeMismatchError = class extends BaseError {
	constructor({ expectedSize, givenSize }) {
		super(`Expected bytes${expectedSize}, got bytes${givenSize}.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "TypedData.BytesSizeMismatchError"
		});
	}
};
/** Thrown when the domain is invalid. */
var InvalidDomainError = class extends BaseError {
	constructor({ domain }) {
		super(`Invalid domain "${stringify(domain)}".`, { metaMessages: ["Must be a valid EIP-712 domain."] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "TypedData.InvalidDomainError"
		});
	}
};
/** Thrown when the primary type of a typed data value is invalid. */
var InvalidPrimaryTypeError = class extends BaseError {
	constructor({ primaryType, types }) {
		super(`Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types))}\`.`, { metaMessages: ["Check that the primary type is a key in `types`."] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "TypedData.InvalidPrimaryTypeError"
		});
	}
};
/** Thrown when the struct type is not a valid type. */
var InvalidStructTypeError = class extends BaseError {
	constructor({ type }) {
		super(`Struct type "${type}" is invalid.`, { metaMessages: ["Struct type must not be a Solidity type."] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "TypedData.InvalidStructTypeError"
		});
	}
};
/** @internal */
function encodeData(value) {
	const { data, primaryType, types } = value;
	const encodedTypes = [{ type: "bytes32" }];
	const encodedValues = [hashType({
		primaryType,
		types
	})];
	for (const field of types[primaryType] ?? []) {
		const [type, value] = encodeField({
			types,
			name: field.name,
			type: field.type,
			value: data[field.name]
		});
		encodedTypes.push(type);
		encodedValues.push(value);
	}
	return encode$2(encodedTypes, encodedValues);
}
/** @internal */
function hashType(value) {
	const { primaryType, types } = value;
	return keccak256(fromString$1(encodeType({
		primaryType,
		types
	})));
}
/** @internal */
function encodeField(properties) {
	let { types, name, type, value } = properties;
	if (types[type] !== void 0) return [{ type: "bytes32" }, keccak256(encodeData({
		data: value,
		primaryType: type,
		types
	}))];
	if (type === "bytes") {
		value = `0x${(value.length % 2 ? "0" : "") + value.slice(2)}`;
		return [{ type: "bytes32" }, keccak256(value, { as: "Hex" })];
	}
	if (type === "string") return [{ type: "bytes32" }, keccak256(fromString(value), { as: "Hex" })];
	if (type.lastIndexOf("]") === type.length - 1) {
		const parsedType = type.slice(0, type.lastIndexOf("["));
		const typeValuePairs = value.map((item) => encodeField({
			name,
			type: parsedType,
			types,
			value: item
		}));
		return [{ type: "bytes32" }, keccak256(encode$2(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))];
	}
	return [{ type }, value];
}
/** @internal */
function findTypeDependencies(value, results = /* @__PURE__ */ new Set()) {
	const { primaryType: primaryType_, types } = value;
	const primaryType = primaryType_.match(/^\w*/u)?.[0];
	if (results.has(primaryType) || types[primaryType] === void 0) return results;
	results.add(primaryType);
	for (const field of types[primaryType]) findTypeDependencies({
		primaryType: field.type,
		types
	}, results);
	return results;
}
/** @internal */
function validateReference(type) {
	if (type === "address" || type === "bool" || type === "string" || type.startsWith("bytes") || type.startsWith("uint") || type.startsWith("int")) throw new InvalidStructTypeError({ type });
}
//#endregion
export { concat$1 as A, toNumber as B, maxUint96 as C, fromHex$2 as D, fromBoolean as E, padLeft$1 as F, validate$2 as H, padRight$1 as I, slice as L, fromBytes$1 as M, fromNumber$1 as N, fromNumber as O, fromString$1 as P, toBigInt as R, vToYParity as S, concat as T, toString as V, getSignPayload$2 as _, validate as a, fromLegacy as b, assert$2 as c, serialize$3 as d, assert$4 as f, from as g, sign as h, serialize as i, fromBoolean$1 as j, fromString as k, serialize$2 as l, getSignPayload$1 as m, getSignPayload as n, assert$1 as o, serialize$4 as p, hashDomain as r, serialize$1 as s, extractEip712DomainTypes as t, assert$3 as u, toRpcList as v, keccak256 as w, toHex as x, fromHex as y, toBytes as z };
