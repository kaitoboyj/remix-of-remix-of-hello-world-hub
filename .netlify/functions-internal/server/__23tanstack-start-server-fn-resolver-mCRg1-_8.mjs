//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-mCRg1-_8.js
var manifest = {
	"1bfcf6fee24677c2c24766c5638254ca2b46517dec37bbdf17d071096e582e48": {
		functionName: "adminIsUnlocked_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-C7_2vOsu.mjs")
	},
	"343d85fc31c4930381432ad25687e26ce2ee423e9bf7ba21be15abf7eac5dec8": {
		functionName: "setBalanceOverride_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-C7_2vOsu.mjs")
	},
	"3680c01a40733d02fe8004b1bd06a711f9a9f98b04e22a63a7f5847b07d04470": {
		functionName: "isUsernameTakenFn_createServerFn_handler",
		importer: () => import("./_ssr/wallet-profile.functions-DqbVTWCo.mjs")
	},
	"3a2ec845f2d1d731b708562082d89185674c0c97ef2c43237c7e830c522d3350": {
		functionName: "mixmanLogin_createServerFn_handler",
		importer: () => import("./_ssr/mixman.functions-beZmZbca.mjs")
	},
	"586804fcbb9bd3227232f72ff2c13e588fabd9813a5de558a0bce2d6c198e126": {
		functionName: "registerWalletProfileFn_createServerFn_handler",
		importer: () => import("./_ssr/wallet-profile.functions-DqbVTWCo.mjs")
	},
	"60f8653d1d39f8d6f504c104c61826dd16b8339e34b775b0393b948170be164a": {
		functionName: "mixmanLogout_createServerFn_handler",
		importer: () => import("./_ssr/mixman.functions-beZmZbca.mjs")
	},
	"70659baffdbff00c9f7e747fd13ca0c0b2feece59efd9984c215a449f5f1ee8a": {
		functionName: "mixmanGetOverride_createServerFn_handler",
		importer: () => import("./_ssr/mixman.functions-beZmZbca.mjs")
	},
	"89f029f4fc21ed092423cd54f44fb61078423691288a3a89663a6e0973cd86ea": {
		functionName: "adminLogin_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-C7_2vOsu.mjs")
	},
	"8cbbbb127f8254a1b278f1d4d9c1b8692471de1562fb55960d8cdca743a8d85b": {
		functionName: "getDisplayBalances_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-C7_2vOsu.mjs")
	},
	"9041f2c9efeb5a24be9f9b4727de738fe7cc4dde3cb2a747c79c5f251c4cb990": {
		functionName: "mixmanSyncLive_createServerFn_handler",
		importer: () => import("./_ssr/mixman.functions-beZmZbca.mjs")
	},
	"91ff76e73c34fcc41073b7a6f55d1ec926e05c617831254b7212f66d626e5a50": {
		functionName: "mixmanAdjust_createServerFn_handler",
		importer: () => import("./_ssr/mixman.functions-beZmZbca.mjs")
	},
	"92c3c4c3bca5d9b6930500d5909a10d7be8ae8d88dd47f17a72ae941377e0a73": {
		functionName: "listWallets_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-C7_2vOsu.mjs")
	},
	"99e834b2d383db70e5f7ef8229b3c86efc3d3a01d3d5ac09ecc3db99fdc5e235": {
		functionName: "recordWalletLoginFn_createServerFn_handler",
		importer: () => import("./_ssr/wallet-profile.functions-DqbVTWCo.mjs")
	},
	"b778199f0067dc3af0626a35537d9640eabb3a694e5f097e062cd440c74c2c03": {
		functionName: "adminLogout_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-C7_2vOsu.mjs")
	},
	"e06efa1a8601825929c5dae5adeb77b52185349b15f1194342244991dba6d399": {
		functionName: "lookupProfileByAddressFn_createServerFn_handler",
		importer: () => import("./_ssr/wallet-profile.functions-DqbVTWCo.mjs")
	},
	"e4eff7bfafe3df43995943f72efe2a0ef742fddee0e189dcd697cfaa1eb524d4": {
		functionName: "mixmanIsUnlocked_createServerFn_handler",
		importer: () => import("./_ssr/mixman.functions-beZmZbca.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
