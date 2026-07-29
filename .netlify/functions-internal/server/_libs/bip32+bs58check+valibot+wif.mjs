import { At as init_ripemd160, Un as init_sha256, Wn as sha256, jt as ripemd160, lt as hmac, ut as init_hmac } from "./@base-org/account+[...].mjs";
import { f as sha512 } from "./noble__hashes.mjs";
import { Ht as init_esm, Vt as esm_default$1 } from "./@walletconnect/core+[...].mjs";
import { n as base58check, r as init_esm$1 } from "./scure__base.mjs";
import { c as concat, d as readUInt32, f as writeUInt32, l as fromHex, p as writeUInt8, s as compare, u as fromUtf8 } from "./bip174+[...].mjs";
//#region node_modules/bip32/src/esm/crypto.js
init_hmac();
init_ripemd160();
init_sha256();
function hash160(buffer) {
	return ripemd160(sha256(buffer));
}
function hmacSHA512(key, data) {
	return hmac(sha512, key, data);
}
//#endregion
//#region node_modules/bip32/src/esm/testecc.js
var h = (hex) => fromHex(hex);
function testEcc(ecc) {
	assert(ecc.isPoint(h("0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798")));
	assert(!ecc.isPoint(h("030000000000000000000000000000000000000000000000000000000000000005")));
	assert(ecc.isPrivate(h("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798")));
	assert(ecc.isPrivate(h("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140")));
	assert(!ecc.isPrivate(h("0000000000000000000000000000000000000000000000000000000000000000")));
	assert(!ecc.isPrivate(h("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141")));
	assert(!ecc.isPrivate(h("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364142")));
	assert(compare(ecc.pointFromScalar(h("b1121e4088a66a28f5b6b0f5844943ecd9f610196d7bb83b25214b60452c09af")), h("02b07ba9dca9523b7ef4bd97703d43d20399eb698e194704791a25ce77a400df99")) === 0);
	if (ecc.xOnlyPointAddTweak) {
		assert(ecc.xOnlyPointAddTweak(h("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"), h("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140")) === null);
		let xOnlyRes = ecc.xOnlyPointAddTweak(h("1617d38ed8d8657da4d4761e8057bc396ea9e4b9d29776d4be096016dbd2509b"), h("a8397a935f0dfceba6ba9618f6451ef4d80637abf4e6af2669fbc9de6a8fd2ac"));
		assert(compare(xOnlyRes.xOnlyPubkey, h("e478f99dab91052ab39a33ea35fd5e6e4933f4d28023cd597c9a1f6760346adf")) === 0 && xOnlyRes.parity === 1);
		xOnlyRes = ecc.xOnlyPointAddTweak(h("2c0b7cf95324a07d05398b240174dc0c2be444d96b159aa6c7f7b1e668680991"), h("823c3cd2142744b075a87eade7e1b8678ba308d566226a0056ca2b7a76f86b47"));
	}
	assert(compare(ecc.pointAddScalar(h("0379be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"), h("0000000000000000000000000000000000000000000000000000000000000003")), h("02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5")) === 0);
	assert(compare(ecc.privateAdd(h("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd036413e"), h("0000000000000000000000000000000000000000000000000000000000000002")), h("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140")) === 0);
	if (ecc.privateNegate) {
		assert(compare(ecc.privateNegate(h("0000000000000000000000000000000000000000000000000000000000000001")), h("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140")) === 0);
		assert(compare(ecc.privateNegate(h("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd036413e")), h("0000000000000000000000000000000000000000000000000000000000000003")) === 0);
		assert(compare(ecc.privateNegate(h("b1121e4088a66a28f5b6b0f5844943ecd9f610196d7bb83b25214b60452c09af")), h("4eede1bf775995d70a494f0a7bb6bc11e0b8cccd41cce8009ab1132c8b0a3792")) === 0);
	}
	assert(compare(ecc.sign(h("5e9f0a0d593efdcf78ac923bc3313e4e7d408d574354ee2b3288c0da9fbba6ed"), h("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140")), h("54c4a33c6423d689378f160a7ff8b61330444abb58fb470f96ea16d99d4a2fed07082304410efa6b2943111b6a4e0aaa7b7db55a07e9861d1fb3cb1f421044a5")) === 0);
	assert(ecc.verify(h("5e9f0a0d593efdcf78ac923bc3313e4e7d408d574354ee2b3288c0da9fbba6ed"), h("0379be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"), h("54c4a33c6423d689378f160a7ff8b61330444abb58fb470f96ea16d99d4a2fed07082304410efa6b2943111b6a4e0aaa7b7db55a07e9861d1fb3cb1f421044a5")));
	if (ecc.signSchnorr) assert(compare(ecc.signSchnorr(h("7e2d58d8b3bcdf1abadec7829054f90dda9805aab56c77333024b9d0a508b75c"), h("c90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b14e5c9"), h("c87aa53824b4d7ae2eb035a2b5bbbccc080e76cdc6d1692c4b0b62d798e6d906")), h("5831aaeed7b44bb74e5eab94ba9d4294c49bcf2a60728d8b4c200f50dd313c1bab745879a5ad954a72c45a91c3a51d3c7adea98d82f8481e0e1e03674a6f3fb7")) === 0);
	if (ecc.verifySchnorr) assert(ecc.verifySchnorr(h("7e2d58d8b3bcdf1abadec7829054f90dda9805aab56c77333024b9d0a508b75c"), h("dd308afec5777e13121fa72b9cc1b7cc0139715309b086c960e18fd969774eb8"), h("5831aaeed7b44bb74e5eab94ba9d4294c49bcf2a60728d8b4c200f50dd313c1bab745879a5ad954a72c45a91c3a51d3c7adea98d82f8481e0e1e03674a6f3fb7")));
}
function assert(bool) {
	if (!bool) throw new Error("ecc library invalid");
}
//#endregion
//#region node_modules/valibot/dist/index.mjs
init_esm$1();
var store$4;
var DEFAULT_CONFIG = {
	lang: void 0,
	message: void 0,
	abortEarly: void 0,
	abortPipeEarly: void 0
};
/**
* Returns the global configuration.
*
* @param config The config to merge.
*
* @returns The configuration.
*/
/* @__NO_SIDE_EFFECTS__ */
function getGlobalConfig(config$1) {
	if (!config$1 && !store$4) return DEFAULT_CONFIG;
	return {
		lang: config$1?.lang ?? store$4?.lang,
		message: config$1?.message,
		abortEarly: config$1?.abortEarly ?? store$4?.abortEarly,
		abortPipeEarly: config$1?.abortPipeEarly ?? store$4?.abortPipeEarly
	};
}
var store$3;
/**
* Returns a global error message.
*
* @param lang The language of the message.
*
* @returns The error message.
*/
/* @__NO_SIDE_EFFECTS__ */
function getGlobalMessage(lang) {
	return store$3?.get(lang);
}
var store$2;
/**
* Returns a schema error message.
*
* @param lang The language of the message.
*
* @returns The error message.
*/
/* @__NO_SIDE_EFFECTS__ */
function getSchemaMessage(lang) {
	return store$2?.get(lang);
}
var store$1;
/**
* Returns a specific error message.
*
* @param reference The identifier reference.
* @param lang The language of the message.
*
* @returns The error message.
*/
/* @__NO_SIDE_EFFECTS__ */
function getSpecificMessage(reference, lang) {
	return store$1?.get(reference)?.get(lang);
}
/**
* Stringifies an unknown input to a literal or type string.
*
* @param input The unknown input.
*
* @returns A literal or type string.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _stringify(input) {
	const type = typeof input;
	if (type === "string") return `"${input}"`;
	if (type === "number" || type === "bigint" || type === "boolean") return `${input}`;
	if (type === "object" || type === "function") return (input && Object.getPrototypeOf(input)?.constructor?.name) ?? "null";
	return type;
}
/**
* Adds an issue to the dataset.
*
* @param context The issue context.
* @param label The issue label.
* @param dataset The input dataset.
* @param config The configuration.
* @param other The optional props.
*
* @internal
*/
function _addIssue(context, label, dataset, config$1, other) {
	const input = other && "input" in other ? other.input : dataset.value;
	const expected = other?.expected ?? context.expects ?? null;
	const received = other?.received ?? /* @__PURE__ */ _stringify(input);
	const issue = {
		kind: context.kind,
		type: context.type,
		input,
		expected,
		received,
		message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
		requirement: context.requirement,
		path: other?.path,
		issues: other?.issues,
		lang: config$1.lang,
		abortEarly: config$1.abortEarly,
		abortPipeEarly: config$1.abortPipeEarly
	};
	const isSchema = context.kind === "schema";
	const message$1 = other?.message ?? context.message ?? /* @__PURE__ */ getSpecificMessage(context.reference, issue.lang) ?? (isSchema ? /* @__PURE__ */ getSchemaMessage(issue.lang) : null) ?? config$1.message ?? /* @__PURE__ */ getGlobalMessage(issue.lang);
	if (message$1 !== void 0) issue.message = typeof message$1 === "function" ? message$1(issue) : message$1;
	if (isSchema) dataset.typed = false;
	if (dataset.issues) dataset.issues.push(issue);
	else dataset.issues = [issue];
}
var _standardCache = /* @__PURE__ */ new WeakMap();
/**
* Returns the Standard Schema properties.
*
* @param context The schema context.
*
* @returns The Standard Schema properties.
*/
/* @__NO_SIDE_EFFECTS__ */
function _getStandardProps(context) {
	let cached = _standardCache.get(context);
	if (!cached) {
		cached = {
			version: 1,
			vendor: "valibot",
			validate(value$1) {
				return context["~run"]({ value: value$1 }, /* @__PURE__ */ getGlobalConfig());
			}
		};
		_standardCache.set(context, cached);
	}
	return cached;
}
/**
* Joins multiple `expects` values with the given separator.
*
* @param values The `expects` values.
* @param separator The separator.
*
* @returns The joined `expects` property.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _joinExpects(values$1, separator) {
	const list = [...new Set(values$1)];
	if (list.length > 1) return `(${list.join(` ${separator} `)})`;
	return list[0] ?? "never";
}
/**
* A Valibot error with useful information.
*/
var ValiError = class extends Error {
	/**
	* Creates a Valibot error with useful information.
	*
	* @param issues The error issues.
	*/
	constructor(issues) {
		super(issues[0].message);
		this.name = "ValiError";
		this.issues = issues;
	}
};
/* @__NO_SIDE_EFFECTS__ */
function everyItem(requirement, message$1) {
	return {
		kind: "validation",
		type: "every_item",
		reference: everyItem,
		async: false,
		expects: null,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !dataset.value.every(this.requirement)) _addIssue(this, "item", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function integer(message$1) {
	return {
		kind: "validation",
		type: "integer",
		reference: integer,
		async: false,
		expects: null,
		requirement: Number.isInteger,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "integer", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function length(requirement, message$1) {
	return {
		kind: "validation",
		type: "length",
		reference: length,
		async: false,
		expects: `${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.length !== this.requirement) _addIssue(this, "length", dataset, config$1, { received: `${dataset.value.length}` });
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function maxValue(requirement, message$1) {
	return {
		kind: "validation",
		type: "max_value",
		reference: maxValue,
		async: false,
		expects: `<=${requirement instanceof Date ? requirement.toJSON() : /* @__PURE__ */ _stringify(requirement)}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !(dataset.value <= this.requirement)) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function minValue(requirement, message$1) {
	return {
		kind: "validation",
		type: "min_value",
		reference: minValue,
		async: false,
		expects: `>=${requirement instanceof Date ? requirement.toJSON() : /* @__PURE__ */ _stringify(requirement)}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !(dataset.value >= this.requirement)) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function regex(requirement, message$1) {
	return {
		kind: "validation",
		type: "regex",
		reference: regex,
		async: false,
		expects: `${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "format", dataset, config$1);
			return dataset;
		}
	};
}
var ABORT_EARLY_CONFIG = { abortEarly: true };
/**
* Returns the fallback value of the schema.
*
* @param schema The schema to get it from.
* @param dataset The output dataset if available.
* @param config The config if available.
*
* @returns The fallback value.
*/
/* @__NO_SIDE_EFFECTS__ */
function getFallback(schema, dataset, config$1) {
	return typeof schema.fallback === "function" ? schema.fallback(dataset, config$1) : schema.fallback;
}
/**
* Returns the default value of the schema.
*
* @param schema The schema to get it from.
* @param dataset The input dataset if available.
* @param config The config if available.
*
* @returns The default value.
*/
/* @__NO_SIDE_EFFECTS__ */
function getDefault(schema, dataset, config$1) {
	return typeof schema.default === "function" ? schema.default(dataset, config$1) : schema.default;
}
/**
* Checks if the input matches the schema. By using a type predicate, this
* function can be used as a type guard.
*
* @param schema The schema to be used.
* @param input The input to be tested.
*
* @returns Whether the input matches the schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function is(schema, input) {
	return !schema["~run"]({ value: input }, ABORT_EARLY_CONFIG).issues;
}
/**
* Creates an any schema.
*
* Hint: This schema function exists only for completeness and is not
* recommended in practice. Instead, `unknown` should be used to accept
* unknown data.
*
* @returns An any schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function any() {
	return {
		kind: "schema",
		type: "any",
		reference: any,
		expects: "any",
		async: false,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset) {
			dataset.typed = true;
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function array(item, message$1) {
	return {
		kind: "schema",
		type: "array",
		reference: array,
		expects: "Array",
		async: false,
		item,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < input.length; key++) {
					const value$1 = input[key];
					const itemDataset = this.item["~run"]({ value: value$1 }, config$1);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function bigint(message$1) {
	return {
		kind: "schema",
		type: "bigint",
		reference: bigint,
		expects: "bigint",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "bigint") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function custom(check$1, message$1) {
	return {
		kind: "schema",
		type: "custom",
		reference: custom,
		expects: "unknown",
		async: false,
		check: check$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (this.check(dataset.value)) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function function_(message$1) {
	return {
		kind: "schema",
		type: "function",
		reference: function_,
		expects: "Function",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "function") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function instance(class_, message$1) {
	return {
		kind: "schema",
		type: "instance",
		reference: instance,
		expects: class_.name,
		async: false,
		class: class_,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value instanceof this.class) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function nullable(wrapped, default_) {
	return {
		kind: "schema",
		type: "nullable",
		reference: nullable,
		expects: `(${wrapped.expects} | null)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === null) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === null) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function nullish(wrapped, default_) {
	return {
		kind: "schema",
		type: "nullish",
		reference: nullish,
		expects: `(${wrapped.expects} | null | undefined)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === null || dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === null || dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function number(message$1) {
	return {
		kind: "schema",
		type: "number",
		reference: number,
		expects: "number",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "number" && !isNaN(dataset.value)) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function object(entries$1, message$1) {
	return {
		kind: "schema",
		type: "object",
		reference: object,
		expects: "Object",
		async: false,
		entries: entries$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const key in this.entries) {
					const valueSchema = this.entries[key];
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value$1 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
						const valueDataset = valueSchema["~run"]({ value: value$1 }, config$1);
						if (valueDataset.issues) {
							const pathItem = {
								type: "object",
								origin: "value",
								input,
								key,
								value: value$1
							};
							for (const issue of valueDataset.issues) {
								if (issue.path) issue.path.unshift(pathItem);
								else issue.path = [pathItem];
								dataset.issues?.push(issue);
							}
							if (!dataset.issues) dataset.issues = valueDataset.issues;
							if (config$1.abortEarly) {
								dataset.typed = false;
								break;
							}
						}
						if (!valueDataset.typed) dataset.typed = false;
						dataset.value[key] = valueDataset.value;
					} else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
					else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
						_addIssue(this, "key", dataset, config$1, {
							input: void 0,
							expected: `"${key}"`,
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						if (config$1.abortEarly) break;
					}
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function optional(wrapped, default_) {
	return {
		kind: "schema",
		type: "optional",
		reference: optional,
		expects: `(${wrapped.expects} | undefined)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function string(message$1) {
	return {
		kind: "schema",
		type: "string",
		reference: string,
		expects: "string",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "string") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function tuple(items, message$1) {
	return {
		kind: "schema",
		type: "tuple",
		reference: tuple,
		expects: "Array",
		async: false,
		items,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < this.items.length; key++) {
					const value$1 = input[key];
					const itemDataset = this.items[key]["~run"]({ value: value$1 }, config$1);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/**
* Returns the sub issues of the provided datasets for the union issue.
*
* @param datasets The datasets.
*
* @returns The sub issues.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _subIssues(datasets) {
	let issues;
	if (datasets) for (const dataset of datasets) if (issues) for (const issue of dataset.issues) issues.push(issue);
	else issues = dataset.issues;
	return issues;
}
/* @__NO_SIDE_EFFECTS__ */
function union(options, message$1) {
	return {
		kind: "schema",
		type: "union",
		reference: union,
		expects: /* @__PURE__ */ _joinExpects(options.map((option) => option.expects), "|"),
		async: false,
		options,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			let validDataset;
			let typedDatasets;
			let untypedDatasets;
			for (const schema of this.options) {
				const optionDataset = schema["~run"]({ value: dataset.value }, config$1);
				if (optionDataset.typed) if (optionDataset.issues) if (typedDatasets) typedDatasets.push(optionDataset);
				else typedDatasets = [optionDataset];
				else {
					validDataset = optionDataset;
					break;
				}
				else if (untypedDatasets) untypedDatasets.push(optionDataset);
				else untypedDatasets = [optionDataset];
			}
			if (validDataset) return validDataset;
			if (typedDatasets) {
				if (typedDatasets.length === 1) return typedDatasets[0];
				_addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(typedDatasets) });
				dataset.typed = true;
			} else if (untypedDatasets?.length === 1) return untypedDatasets[0];
			else _addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(untypedDatasets) });
			return dataset;
		}
	};
}
/**
* Parses an unknown input based on a schema.
*
* @param schema The schema to be used.
* @param input The input to be parsed.
* @param config The parse configuration.
*
* @returns The parsed input.
*/
function parse(schema, input, config$1) {
	const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config$1));
	if (dataset.issues) throw new ValiError(dataset.issues);
	return dataset.value;
}
/* @__NO_SIDE_EFFECTS__ */
function partial(schema, keys) {
	const entries$1 = {};
	for (const key in schema.entries) entries$1[key] = !keys || keys.includes(key) ? /* @__PURE__ */ optional(schema.entries[key]) : schema.entries[key];
	return {
		...schema,
		entries: entries$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function pipe(...pipe$1) {
	return {
		...pipe$1[0],
		pipe: pipe$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			for (const item of pipe$1) if (item.kind !== "metadata") {
				if (dataset.issues && (item.kind === "schema" || item.kind === "transformation")) {
					dataset.typed = false;
					break;
				}
				if (!dataset.issues || !config$1.abortEarly && !config$1.abortPipeEarly) dataset = item["~run"](dataset, config$1);
			}
			return dataset;
		}
	};
}
//#endregion
//#region node_modules/bip32/src/esm/types.js
var Uint32Schema = /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer(), /* @__PURE__ */ minValue(0), /* @__PURE__ */ maxValue(4294967295));
var Uint31Schema = /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer(), /* @__PURE__ */ minValue(0), /* @__PURE__ */ maxValue(2147483647));
var Uint8Schema = /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ integer(), /* @__PURE__ */ minValue(0), /* @__PURE__ */ maxValue(255));
var Buffer256Bit = /* @__PURE__ */ pipe(/* @__PURE__ */ instance(Uint8Array), /* @__PURE__ */ length(32));
var Buffer33Bytes = /* @__PURE__ */ pipe(/* @__PURE__ */ instance(Uint8Array), /* @__PURE__ */ length(33));
var NetworkSchema = /* @__PURE__ */ object({
	wif: Uint8Schema,
	bip32: /* @__PURE__ */ object({
		public: Uint32Schema,
		private: Uint32Schema
	})
});
var Bip32PathSchema = /* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ regex(/^(m\/)?(\d+'?\/)*\d+'?$/));
//#endregion
//#region node_modules/bs58check/src/esm/base.js
init_esm();
function base_default(checksumFn) {
	function encode(payload) {
		var payloadU8 = Uint8Array.from(payload);
		var checksum = checksumFn(payloadU8);
		var length = payloadU8.length + 4;
		var both = new Uint8Array(length);
		both.set(payloadU8, 0);
		both.set(checksum.subarray(0, 4), payloadU8.length);
		return esm_default$1.encode(both);
	}
	function decodeRaw(buffer) {
		var payload = buffer.slice(0, -4);
		var checksum = buffer.slice(-4);
		var newChecksum = checksumFn(payload);
		if (checksum[0] ^ newChecksum[0] | checksum[1] ^ newChecksum[1] | checksum[2] ^ newChecksum[2] | checksum[3] ^ newChecksum[3]) return;
		return payload;
	}
	function decodeUnsafe(str) {
		var buffer = esm_default$1.decodeUnsafe(str);
		if (buffer == null) return;
		return decodeRaw(buffer);
	}
	function decode(str) {
		var payload = decodeRaw(esm_default$1.decode(str));
		if (payload == null) throw new Error("Invalid checksum");
		return payload;
	}
	return {
		encode,
		decode,
		decodeUnsafe
	};
}
//#endregion
//#region node_modules/bs58check/src/esm/index.js
init_sha256();
function sha256x2(buffer) {
	return sha256(sha256(buffer));
}
var esm_default = base_default(sha256x2);
//#endregion
//#region node_modules/wif/src/esm/index.js
function encodeRaw(version, privateKey, compressed) {
	if (privateKey.length !== 32) throw new TypeError("Invalid privateKey length");
	var result = new Uint8Array(compressed ? 34 : 33);
	new DataView(result.buffer).setUint8(0, version);
	result.set(privateKey, 1);
	if (compressed) result[33] = 1;
	return result;
}
function encode(wif) {
	return esm_default.encode(encodeRaw(wif.version, wif.privateKey, wif.compressed));
}
//#endregion
//#region node_modules/bip32/src/esm/bip32.js
init_sha256();
var _bs58check = base58check(sha256);
var bs58check = {
	encode: (data) => _bs58check.encode(data),
	decode: (str) => _bs58check.decode(str)
};
function BIP32Factory(ecc) {
	testEcc(ecc);
	const BITCOIN = {
		messagePrefix: "Bitcoin Signed Message:\n",
		bech32: "bc",
		bip32: {
			public: 76067358,
			private: 76066276
		},
		pubKeyHash: 0,
		scriptHash: 5,
		wif: 128
	};
	const HIGHEST_BIT = 2147483648;
	function toXOnly(pubKey) {
		return pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);
	}
	class Bip32Signer {
		__D;
		__Q;
		lowR = false;
		constructor(__D, __Q) {
			this.__D = __D;
			this.__Q = __Q;
		}
		get publicKey() {
			if (this.__Q === void 0) this.__Q = ecc.pointFromScalar(this.__D, true);
			return this.__Q;
		}
		get privateKey() {
			return this.__D;
		}
		sign(hash, lowR) {
			if (!this.privateKey) throw new Error("Missing private key");
			if (lowR === void 0) lowR = this.lowR;
			if (lowR === false) return ecc.sign(hash, this.privateKey);
			else {
				let sig = ecc.sign(hash, this.privateKey);
				const extraData = new Uint8Array(32);
				let counter = 0;
				while (sig[0] > 127) {
					counter++;
					writeUInt32(extraData, 0, counter, "LE");
					sig = ecc.sign(hash, this.privateKey, extraData);
				}
				return sig;
			}
		}
		signSchnorr(hash) {
			if (!this.privateKey) throw new Error("Missing private key");
			if (!ecc.signSchnorr) throw new Error("signSchnorr not supported by ecc library");
			return ecc.signSchnorr(hash, this.privateKey);
		}
		verify(hash, signature) {
			return ecc.verify(hash, this.publicKey, signature);
		}
		verifySchnorr(hash, signature) {
			if (!ecc.verifySchnorr) throw new Error("verifySchnorr not supported by ecc library");
			return ecc.verifySchnorr(hash, this.publicKey.subarray(1, 33), signature);
		}
	}
	class BIP32 extends Bip32Signer {
		chainCode;
		network;
		__DEPTH;
		__INDEX;
		__PARENT_FINGERPRINT;
		constructor(__D, __Q, chainCode, network, __DEPTH = 0, __INDEX = 0, __PARENT_FINGERPRINT = 0) {
			super(__D, __Q);
			this.chainCode = chainCode;
			this.network = network;
			this.__DEPTH = __DEPTH;
			this.__INDEX = __INDEX;
			this.__PARENT_FINGERPRINT = __PARENT_FINGERPRINT;
			parse(NetworkSchema, network);
		}
		get depth() {
			return this.__DEPTH;
		}
		get index() {
			return this.__INDEX;
		}
		get parentFingerprint() {
			return this.__PARENT_FINGERPRINT;
		}
		get identifier() {
			return hash160(this.publicKey);
		}
		get fingerprint() {
			return this.identifier.slice(0, 4);
		}
		get compressed() {
			return true;
		}
		isNeutered() {
			return this.__D === void 0;
		}
		neutered() {
			return fromPublicKeyLocal(this.publicKey, this.chainCode, this.network, this.depth, this.index, this.parentFingerprint);
		}
		toBase58() {
			const network = this.network;
			const version = !this.isNeutered() ? network.bip32.private : network.bip32.public;
			const buffer = new Uint8Array(78);
			writeUInt32(buffer, 0, version, "BE");
			writeUInt8(buffer, 4, this.depth);
			writeUInt32(buffer, 5, this.parentFingerprint, "BE");
			writeUInt32(buffer, 9, this.index, "BE");
			buffer.set(this.chainCode, 13);
			if (!this.isNeutered()) {
				writeUInt8(buffer, 45, 0);
				buffer.set(this.privateKey, 46);
			} else buffer.set(this.publicKey, 45);
			return bs58check.encode(buffer);
		}
		toWIF() {
			if (!this.privateKey) throw new TypeError("Missing private key");
			return encode({
				version: this.network.wif,
				privateKey: this.privateKey,
				compressed: true
			});
		}
		derive(index) {
			parse(Uint32Schema, index);
			const isHardened = index >= HIGHEST_BIT;
			const data = new Uint8Array(37);
			if (isHardened) {
				if (this.isNeutered()) throw new TypeError("Missing private key for hardened child key");
				data[0] = 0;
				data.set(this.privateKey, 1);
				writeUInt32(data, 33, index, "BE");
			} else {
				data.set(this.publicKey, 0);
				writeUInt32(data, 33, index, "BE");
			}
			const I = hmacSHA512(this.chainCode, data);
			const IL = I.slice(0, 32);
			const IR = I.slice(32);
			if (!ecc.isPrivate(IL)) return this.derive(index + 1);
			let hd;
			if (!this.isNeutered()) {
				const ki = ecc.privateAdd(this.privateKey, IL);
				if (ki == null) return this.derive(index + 1);
				hd = fromPrivateKeyLocal(ki, IR, this.network, this.depth + 1, index, readUInt32(this.fingerprint, 0, "BE"));
			} else {
				const Ki = ecc.pointAddScalar(this.publicKey, IL, true);
				if (Ki === null) return this.derive(index + 1);
				hd = fromPublicKeyLocal(Ki, IR, this.network, this.depth + 1, index, readUInt32(this.fingerprint, 0, "BE"));
			}
			return hd;
		}
		deriveHardened(index) {
			if (typeof parse(Uint31Schema, index) === "number") return this.derive(index + HIGHEST_BIT);
			throw new TypeError("Expected UInt31, got " + index);
		}
		derivePath(path) {
			parse(Bip32PathSchema, path);
			let splitPath = path.split("/");
			if (splitPath[0] === "m") {
				if (this.parentFingerprint) throw new TypeError("Expected master, got child");
				splitPath = splitPath.slice(1);
			}
			return splitPath.reduce((prevHd, indexStr) => {
				let index;
				if (indexStr.slice(-1) === `'`) {
					index = parseInt(indexStr.slice(0, -1), 10);
					return prevHd.deriveHardened(index);
				} else {
					index = parseInt(indexStr, 10);
					return prevHd.derive(index);
				}
			}, this);
		}
		tweak(t) {
			if (this.privateKey) return this.tweakFromPrivateKey(t);
			return this.tweakFromPublicKey(t);
		}
		tweakFromPublicKey(t) {
			const xOnlyPubKey = toXOnly(this.publicKey);
			if (!ecc.xOnlyPointAddTweak) throw new Error("xOnlyPointAddTweak not supported by ecc library");
			const tweakedPublicKey = ecc.xOnlyPointAddTweak(xOnlyPubKey, t);
			if (!tweakedPublicKey || tweakedPublicKey.xOnlyPubkey === null) throw new Error("Cannot tweak public key!");
			return new Bip32Signer(void 0, concat([Uint8Array.from([tweakedPublicKey.parity === 0 ? 2 : 3]), tweakedPublicKey.xOnlyPubkey]));
		}
		tweakFromPrivateKey(t) {
			const hasOddY = this.publicKey[0] === 3 || this.publicKey[0] === 4 && (this.publicKey[64] & 1) === 1;
			const privateKey = (() => {
				if (!hasOddY) return this.privateKey;
				else if (!ecc.privateNegate) throw new Error("privateNegate not supported by ecc library");
				else return ecc.privateNegate(this.privateKey);
			})();
			const tweakedPrivateKey = ecc.privateAdd(privateKey, t);
			if (!tweakedPrivateKey) throw new Error("Invalid tweaked private key!");
			return new Bip32Signer(tweakedPrivateKey, void 0);
		}
	}
	function fromBase58(inString, network) {
		const buffer = bs58check.decode(inString);
		if (buffer.length !== 78) throw new TypeError("Invalid buffer length");
		network = network || BITCOIN;
		const version = readUInt32(buffer, 0, "BE");
		if (version !== network.bip32.private && version !== network.bip32.public) throw new TypeError("Invalid network version");
		const depth = buffer[4];
		const parentFingerprint = readUInt32(buffer, 5, "BE");
		if (depth === 0) {
			if (parentFingerprint !== 0) throw new TypeError("Invalid parent fingerprint");
		}
		const index = readUInt32(buffer, 9, "BE");
		if (depth === 0 && index !== 0) throw new TypeError("Invalid index");
		const chainCode = buffer.slice(13, 45);
		let hd;
		if (version === network.bip32.private) {
			if (buffer[45] !== 0) throw new TypeError("Invalid private key");
			hd = fromPrivateKeyLocal(buffer.slice(46, 78), chainCode, network, depth, index, parentFingerprint);
		} else hd = fromPublicKeyLocal(buffer.slice(45, 78), chainCode, network, depth, index, parentFingerprint);
		return hd;
	}
	function fromPrivateKey(privateKey, chainCode, network) {
		return fromPrivateKeyLocal(privateKey, chainCode, network);
	}
	function fromPrivateKeyLocal(privateKey, chainCode, network, depth, index, parentFingerprint) {
		parse(Buffer256Bit, privateKey);
		parse(Buffer256Bit, chainCode);
		network = network || BITCOIN;
		if (!ecc.isPrivate(privateKey)) throw new TypeError("Private key not in range [1, n)");
		return new BIP32(privateKey, void 0, chainCode, network, depth, index, parentFingerprint);
	}
	function fromPublicKey(publicKey, chainCode, network) {
		return fromPublicKeyLocal(publicKey, chainCode, network);
	}
	function fromPublicKeyLocal(publicKey, chainCode, network, depth, index, parentFingerprint) {
		parse(Buffer33Bytes, publicKey);
		parse(Buffer256Bit, chainCode);
		network = network || BITCOIN;
		if (!ecc.isPoint(publicKey)) throw new TypeError("Point is not on the curve");
		return new BIP32(void 0, publicKey, chainCode, network, depth, index, parentFingerprint);
	}
	function fromSeed(seed, network) {
		parse(/* @__PURE__ */ instance(Uint8Array), seed);
		if (seed.length < 16) throw new TypeError("Seed should be at least 128 bits");
		if (seed.length > 64) throw new TypeError("Seed should be at most 512 bits");
		network = network || BITCOIN;
		const I = hmacSHA512(fromUtf8("Bitcoin seed"), seed);
		return fromPrivateKey(I.slice(0, 32), I.slice(32), network);
	}
	return {
		fromSeed,
		fromBase58,
		fromPublicKey,
		fromPrivateKey
	};
}
//#endregion
export { regex as C, union as E, pipe as S, tuple as T, number as _, bigint as a, parse as b, function_ as c, is as d, length as f, nullish as g, nullable as h, array as i, instance as l, minValue as m, esm_default as n, custom as o, maxValue as p, any as r, everyItem as s, BIP32Factory as t, integer as u, object as v, string as w, partial as x, optional as y };
