/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "a8972a74cf590fe0763a";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};

module.exports.formatError = function(err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function(updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function(err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}

/* WEBPACK VAR INJECTION */}.call(this, "?1000"))

/***/ }),

/***/ "./src/GraphQL/chat/resolver.ts":
/*!**************************************!*\
  !*** ./src/GraphQL/chat/resolver.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __webpack_require__(/*! ../user/helpers */ "./src/GraphQL/user/helpers.ts");
const chats = [];
exports.resolvers = {
    Query: {
        messages: (obj, { token, channel, limit }, context, info) => {
            if (chats[channel]) {
                return limit ? chats[channel].slice(-limit) : chats[channel];
            }
            return [];
        }
    },
    Mutation: {
        sendMessage: (obj, { from, token, message, channel }, { pubsub }) => {
            const user = helpers_1.authenticate(from, token);
            if (!user) {
                throw new Error('You\'re not authorized to send this message.');
            }
            if (!chats[channel]) {
                chats[channel] = [];
            }
            const chatMessage = {
                channel,
                from: user,
                id: chats[channel].length + 1,
                message,
            };
            chats[channel].push(chatMessage);
            pubsub.publish(channel, { messageSent: chatMessage });
            return chatMessage;
        }
    },
    Subscription: {
        messageSent: {
            subscribe: (obj, { channel }, { pubsub }) => {
                return pubsub.asyncIterator(channel);
            }
        }
    }
};


/***/ }),

/***/ "./src/GraphQL/chat/typedefs.ts":
/*!**************************************!*\
  !*** ./src/GraphQL/chat/typedefs.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = __webpack_require__(/*! apollo-server-core */ "apollo-server-core");
exports.typeDefs = apollo_server_core_1.gql `
    type Message {
        id: Int!
        from: User,
        message: String!
        channel: String!
    }

    extend type Query {
        messages(token: String!, channel: String!, limit: Int): [Message]
    }

    extend type Mutation {
        sendMessage(from: String!, token: String!, message: String!, channel: String!): Message
    }

    extend type Subscription {
        messageSent(channel: String!): Message
    }
`;


/***/ }),

/***/ "./src/GraphQL/default/resolver.ts":
/*!*****************************************!*\
  !*** ./src/GraphQL/default/resolver.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = {
    Query: {
        version: () => process.env.APP_VERSION,
    },
    Mutation: {
        _: () => null,
    },
    Subscription: {
        _: () => null,
    }
};


/***/ }),

/***/ "./src/GraphQL/default/typedefs.ts":
/*!*****************************************!*\
  !*** ./src/GraphQL/default/typedefs.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
exports.typeDefs = apollo_server_express_1.gql `
    type Query {
        version: String!,
    }

    type Mutation {
        _: String,
    }

    type Subscription {
        _: String,
    }
`;


/***/ }),

/***/ "./src/GraphQL/list/resolver.ts":
/*!**************************************!*\
  !*** ./src/GraphQL/list/resolver.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = {
    Query: {
        list: (obj, { from, to }, context, info) => {
            if (from > to) {
                const tmp = from;
                from = to;
                to = tmp;
            }
            const output = [];
            for (let i = from; i <= to; ++i) {
                output.push(i);
            }
            return output;
        }
    }
};


/***/ }),

/***/ "./src/GraphQL/list/typedefs.ts":
/*!**************************************!*\
  !*** ./src/GraphQL/list/typedefs.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
exports.typeDefs = apollo_server_express_1.gql `
    extend type Query {
        list(from: Int!, to: Int!): [Int],
    },
`;


/***/ }),

/***/ "./src/GraphQL/randomizr/resolver.ts":
/*!*******************************************!*\
  !*** ./src/GraphQL/randomizr/resolver.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = {
    Query: {
        random: (obj, { min, max, boost }, context, info) => {
            if (!min) {
                min = 0;
            }
            if (!boost) {
                boost = 0;
            }
            if (min > max) {
                const tmp = min;
                min = max;
                max = tmp;
            }
            return (Math.floor(Math.random() * (max + 1 - min)) + min + boost);
        },
    },
};


/***/ }),

/***/ "./src/GraphQL/randomizr/typedefs.ts":
/*!*******************************************!*\
  !*** ./src/GraphQL/randomizr/typedefs.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
exports.typeDefs = apollo_server_express_1.gql `
    extend type Query {
        random(min: Int, max: Int!, boost: Int): Int,
    },
`;


/***/ }),

/***/ "./src/GraphQL/rootResolvers.ts":
/*!**************************************!*\
  !*** ./src/GraphQL/rootResolvers.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __webpack_require__(/*! lodash */ "lodash");
const resolver_1 = __webpack_require__(/*! ./chat/resolver */ "./src/GraphQL/chat/resolver.ts");
const resolver_2 = __webpack_require__(/*! ./default/resolver */ "./src/GraphQL/default/resolver.ts");
const resolver_3 = __webpack_require__(/*! ./list/resolver */ "./src/GraphQL/list/resolver.ts");
const resolver_4 = __webpack_require__(/*! ./randomizr/resolver */ "./src/GraphQL/randomizr/resolver.ts");
const resolver_5 = __webpack_require__(/*! ./user/resolver */ "./src/GraphQL/user/resolver.ts");
exports.rootResolvers = lodash_1.merge(resolver_5.resolvers, resolver_1.resolvers, resolver_2.resolvers, resolver_3.resolvers, resolver_4.resolvers);


/***/ }),

/***/ "./src/GraphQL/rootSchema.ts":
/*!***********************************!*\
  !*** ./src/GraphQL/rootSchema.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const rootResolvers_1 = __webpack_require__(/*! ./rootResolvers */ "./src/GraphQL/rootResolvers.ts");
const rootTypeDefs_1 = __webpack_require__(/*! ./rootTypeDefs */ "./src/GraphQL/rootTypeDefs.ts");
exports.rootSchema = {
    resolvers: rootResolvers_1.rootResolvers,
    typeDefs: rootTypeDefs_1.rootTypeDefs,
};


/***/ }),

/***/ "./src/GraphQL/rootTypeDefs.ts":
/*!*************************************!*\
  !*** ./src/GraphQL/rootTypeDefs.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const typedefs_1 = __webpack_require__(/*! ./chat/typedefs */ "./src/GraphQL/chat/typedefs.ts");
const typedefs_2 = __webpack_require__(/*! ./default/typedefs */ "./src/GraphQL/default/typedefs.ts");
const typedefs_3 = __webpack_require__(/*! ./list/typedefs */ "./src/GraphQL/list/typedefs.ts");
const typedefs_4 = __webpack_require__(/*! ./randomizr/typedefs */ "./src/GraphQL/randomizr/typedefs.ts");
const typedefs_5 = __webpack_require__(/*! ./user/typedefs */ "./src/GraphQL/user/typedefs.ts");
exports.rootTypeDefs = [
    typedefs_5.typeDefs,
    typedefs_1.typeDefs,
    typedefs_2.typeDefs,
    typedefs_3.typeDefs,
    typedefs_4.typeDefs,
];


/***/ }),

/***/ "./src/GraphQL/user/helpers.ts":
/*!*************************************!*\
  !*** ./src/GraphQL/user/helpers.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const resolver_1 = __webpack_require__(/*! ./resolver */ "./src/GraphQL/user/resolver.ts");
let uniquifier = 1;
function uniqIdGenerator() {
    const date = new Date();
    return '' +
        date.getFullYear() +
        date.getMonth() +
        date.getDate() +
        date.getTime() +
        (uniquifier++);
}
exports.uniqIdGenerator = uniqIdGenerator;
function generateToken() {
    const availableCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 32;
    let token = '';
    for (let i = 0; i < length; ++i) {
        token += availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    }
    return token;
}
exports.generateToken = generateToken;
function isValidToken(token) {
    let isValid = false;
    resolver_1.users.forEach((user) => {
        if (user.authToken && user.authToken === token) {
            isValid = true;
        }
    });
    return isValid;
}
exports.isValidToken = isValidToken;
function authenticate(idOrName, token) {
    let authUser = null;
    resolver_1.users.forEach((user) => {
        if (user.id === idOrName || user.displayName === idOrName) {
            authUser = user.authToken && user.authToken === token
                ? { id: user.id, displayName: user.displayName }
                : null;
        }
    });
    return authUser;
}
exports.authenticate = authenticate;


/***/ }),

/***/ "./src/GraphQL/user/resolver.ts":
/*!**************************************!*\
  !*** ./src/GraphQL/user/resolver.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __webpack_require__(/*! ./helpers */ "./src/GraphQL/user/helpers.ts");
exports.users = [];
exports.resolvers = {
    Query: {
        getUserById: (obj, { id }, context) => {
            exports.users.forEach((user) => {
                if (user.id === id) {
                    return user;
                }
            });
            return null;
        },
        getUserByDisplayName: (obj, { displayName }, context) => {
            exports.users.forEach((user) => {
                if (user.displayName === displayName) {
                    return user;
                }
            });
            return null;
        },
        getUsers: (obj, args, context) => {
            return exports.users;
        },
        login: (obj, { displayName, password }, context) => {
            let authenticated = null;
            exports.users.forEach((user) => {
                if (user.displayName === displayName &&
                    user.password !== password) {
                    throw new Error('Invalid login credentials.');
                }
                else if (user.displayName === displayName &&
                    user.password === password) {
                    authenticated = user;
                }
            });
            if (authenticated !== null) {
                authenticated.authToken = helpers_1.generateToken();
                return authenticated.authToken;
            }
            throw new Error('Could not authenticate: User or password might be wrong.');
        },
    },
    Mutation: {
        register: (obj, { displayName, password }, context) => {
            exports.users.forEach((user) => {
                if (user.displayName === displayName) {
                    throw new Error('User already registered');
                }
            });
            const createdUser = {
                displayName,
                id: helpers_1.uniqIdGenerator(),
                password,
            };
            exports.users.push(createdUser);
            return createdUser;
        },
    },
};


/***/ }),

/***/ "./src/GraphQL/user/typedefs.ts":
/*!**************************************!*\
  !*** ./src/GraphQL/user/typedefs.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = __webpack_require__(/*! apollo-server-core */ "apollo-server-core");
exports.typeDefs = apollo_server_core_1.gql `
    type User {
        id: String!
        displayName: String!
    }

    extend type Query {
        getUserById(id: String!): User
        getUserByDisplayName(displayName: String!): User
        getUsers: [User]!
        login(displayName: String!, password: String!): String!
    }

    extend type Mutation {
        register(displayName: String!, password: String!, key: String): User
    }
`;


/***/ }),

/***/ "./src/core/App.ts":
/*!*************************!*\
  !*** ./src/core/App.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
const cors_1 = __importDefault(__webpack_require__(/*! cors */ "cors"));
const UnsupportedMethodException_1 = __webpack_require__(/*! ../exceptions/core/UnsupportedMethodException */ "./src/exceptions/core/UnsupportedMethodException.ts");
class App {
    constructor(port) {
        this.DEFAULT_PORT = 8020;
        this.app = express_1.default();
        this.router = express_1.default.Router();
        this.app.use('/', this.router);
        this.app.use(cors_1.default());
        this.port = port === undefined ? this.DEFAULT_PORT : port;
    }
    createRoute(type, url, handler) {
        switch (type) {
            case ('GET'):
                this.router.get(url, handler);
                break;
            case ('POST'):
                this.router.post(url, handler);
                break;
            case ('PUT'):
                this.router.put(url, handler);
                break;
            case ('PATCH'):
                this.router.patch(url, handler);
                break;
            case ('DELETE'):
                this.router.delete(url, handler);
                break;
            case ('USE'):
                this.router.use(url, handler);
                break;
            default:
                throw new UnsupportedMethodException_1.UnsupportedMethodException('No such HTTP method.');
        }
    }
    start(callback) {
        return this.app.listen(this.port, callback);
    }
    getPort() {
        return this.port;
    }
    getApplication() {
        return this.app;
    }
    getRouter() {
        return this.router;
    }
}
exports.App = App;


/***/ }),

/***/ "./src/core/Logger.ts":
/*!****************************!*\
  !*** ./src/core/Logger.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(__webpack_require__(/*! chalk */ "chalk"));
const lodash_1 = __webpack_require__(/*! lodash */ "lodash");
const util_1 = __webpack_require__(/*! util */ "util");
class DefaultLogger {
    static getDefaultLogger() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new DefaultLogger();
        return this.instance;
    }
    constructor() {
        this.logger = console.log;
    }
    log(message, ...params) {
        this.internalLog(message, ...params);
    }
    info(message, ...params) {
        this.internalLog(chalk_1.default.blueBright(message), ...params);
    }
    warn(message, ...params) {
        this.internalLog(chalk_1.default.yellow(message), ...params);
    }
    error(message, ...params) {
        this.internalLog(chalk_1.default.red(message), ...params);
    }
    internalLog(message, ...params) {
        util_1.isNull(params) || lodash_1.isEmpty(params) ? this.logger(message) : this.logger(message, params);
    }
}
exports.DefaultLogger = DefaultLogger;


/***/ }),

/***/ "./src/core/helpers/converter.ts":
/*!***************************************!*\
  !*** ./src/core/helpers/converter.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function deepResolveBoolean(value) {
    const asNumeric = +value;
    return !isNaN(asNumeric) && asNumeric !== 0;
}
function resolveBoolean(value) {
    value = value.toLowerCase();
    switch (value) {
        case 'true':
        case 'yes':
        case 'on':
            return true;
        default:
            return deepResolveBoolean(value);
    }
}
exports.resolveBoolean = resolveBoolean;


/***/ }),

/***/ "./src/exceptions/core/UnsupportedMethodException.ts":
/*!***********************************************************!*\
  !*** ./src/exceptions/core/UnsupportedMethodException.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class UnsupportedMethodException extends Error {
    constructor(message) {
        super(message);
    }
}
exports.UnsupportedMethodException = UnsupportedMethodException;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
const dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ "dotenv"));
const http_1 = __webpack_require__(/*! http */ "http");
const App_1 = __webpack_require__(/*! ./core/App */ "./src/core/App.ts");
const converter_1 = __webpack_require__(/*! ./core/helpers/converter */ "./src/core/helpers/converter.ts");
const Logger_1 = __webpack_require__(/*! ./core/Logger */ "./src/core/Logger.ts");
const rootSchema_1 = __webpack_require__(/*! ./GraphQL/rootSchema */ "./src/GraphQL/rootSchema.ts");
dotenv_1.default.config();
const port = process.env.APP_PORT ? +process.env.APP_PORT : undefined;
const path = process.env.GRAPHQL_PATH ? `/${process.env.GRAPHQL_PATH}` : '/graphql';
const app = new App_1.App(port);
const pubsub = new apollo_server_express_1.PubSub();
const enablePlayground = process.env.APOLLO_PLAYGROUND ? converter_1.resolveBoolean(process.env.APOLLO_PLAYGROUND) : true;
const introspection = process.env.APOLLO_INTROSPECTION ? converter_1.resolveBoolean(process.env.APOLLO_INTROSPECTION) : true;
const apolloConfig = {
    context: { pubsub },
    introspection,
    playground: enablePlayground,
    resolvers: rootSchema_1.rootSchema.resolvers,
    typeDefs: rootSchema_1.rootSchema.typeDefs,
};
const apolloServer = new apollo_server_express_1.ApolloServer(apolloConfig);
const httpServer = http_1.createServer(app.getApplication());
const logger = Logger_1.DefaultLogger.getDefaultLogger();
apolloServer.applyMiddleware({ app: app.getApplication(), path });
apolloServer.installSubscriptionHandlers(httpServer);
httpServer.listen({ port }, () => {
    logger.info(`🚀 Server started at http://localhost:${app.getPort()}.`);
    logger.info(`🚀 Subscriptions ready at http://localhost:${app.getPort()}${apolloServer.subscriptionsPath}.`);
});
if (true) {
    module.hot.accept();
    module.hot.dispose(() => {
        httpServer.close();
        apolloServer.stop();
    });
}


/***/ }),

/***/ 0:
/*!*************************************************!*\
  !*** multi webpack/hot/poll?1000 ./src/main.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack/hot/poll?1000 */"./node_modules/webpack/hot/poll.js?1000");
module.exports = __webpack_require__(/*! /Users/samuel.lusandi/Documents/Personal/Projects/NodeTS/CleveChatApollo/src/main.ts */"./src/main.ts");


/***/ }),

/***/ "apollo-server-core":
/*!*************************************!*\
  !*** external "apollo-server-core" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-core");

/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-express");

/***/ }),

/***/ "chalk":
/*!************************!*\
  !*** external "chalk" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvR3JhcGhRTC9jaGF0L3Jlc29sdmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9HcmFwaFFML2NoYXQvdHlwZWRlZnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dyYXBoUUwvZGVmYXVsdC9yZXNvbHZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR3JhcGhRTC9kZWZhdWx0L3R5cGVkZWZzLnRzIiwid2VicGFjazovLy8uL3NyYy9HcmFwaFFML2xpc3QvcmVzb2x2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dyYXBoUUwvbGlzdC90eXBlZGVmcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR3JhcGhRTC9yYW5kb21penIvcmVzb2x2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dyYXBoUUwvcmFuZG9taXpyL3R5cGVkZWZzLnRzIiwid2VicGFjazovLy8uL3NyYy9HcmFwaFFML3Jvb3RSZXNvbHZlcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dyYXBoUUwvcm9vdFNjaGVtYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR3JhcGhRTC9yb290VHlwZURlZnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dyYXBoUUwvdXNlci9oZWxwZXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9HcmFwaFFML3VzZXIvcmVzb2x2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dyYXBoUUwvdXNlci90eXBlZGVmcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS9BcHAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvcmUvTG9nZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb3JlL2hlbHBlcnMvY29udmVydGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9leGNlcHRpb25zL2NvcmUvVW5zdXBwb3J0ZWRNZXRob2RFeGNlcHRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYXBvbGxvLXNlcnZlci1jb3JlXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2hhbGtcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjb3JzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZG90ZW52XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLOztRQUVMO1FB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O0FDQUEsaUMiLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0dmFyIGNodW5rID0gcmVxdWlyZShcIi4vXCIgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCIpO1xuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVuay5pZCwgY2h1bmsubW9kdWxlcyk7XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdCgpIHtcbiBcdFx0dHJ5IHtcbiBcdFx0XHR2YXIgdXBkYXRlID0gcmVxdWlyZShcIi4vXCIgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIik7XG4gXHRcdH0gY2F0Y2ggKGUpIHtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gXHRcdH1cbiBcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh1cGRhdGUpO1xuIFx0fVxuXG4gXHQvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cblxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcImE4OTcyYTc0Y2Y1OTBmZTA3NjNhXCI7XG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTtcblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRpZiAoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xuIFx0XHRcdGlmIChtZS5ob3QuYWN0aXZlKSB7XG4gXHRcdFx0XHRpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xuIFx0XHRcdFx0XHRpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpID09PSAtMSkge1xuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPT09IC0xKSB7XG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgK1xuIFx0XHRcdFx0XHRcdHJlcXVlc3QgK1xuIFx0XHRcdFx0XHRcdFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWRcbiBcdFx0XHRcdCk7XG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0XHRcdH1cbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcbiBcdFx0fTtcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcbiBcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xuIFx0XHRcdFx0fSxcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH07XG4gXHRcdH07XG4gXHRcdGZvciAodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJlxuIFx0XHRcdFx0bmFtZSAhPT0gXCJlXCIgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwidFwiXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicmVhZHlcIikgaG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcbiBcdFx0XHRcdHRocm93IGVycjtcbiBcdFx0XHR9KTtcblxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcbiBcdFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XG4gXHRcdFx0XHRcdGlmICghaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9O1xuIFx0XHRmbi50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0XHRpZiAobW9kZSAmIDEpIHZhbHVlID0gZm4odmFsdWUpO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLnQodmFsdWUsIG1vZGUgJiB+MSk7XG4gXHRcdH07XG4gXHRcdHJldHVybiBmbjtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIGhvdCA9IHtcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxuXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcbiBcdFx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKSBob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0XHRlbHNlIGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0fSxcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcbiBcdFx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGlmICghbCkgcmV0dXJuIGhvdFN0YXR1cztcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cbiBcdFx0fTtcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xuIFx0XHRyZXR1cm4gaG90O1xuIFx0fVxuXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcblxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XG4gXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xuIFx0fVxuXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdERlZmVycmVkO1xuXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XG5cbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcbiBcdFx0dmFyIGlzTnVtYmVyID0gK2lkICsgXCJcIiA9PT0gaWQ7XG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcImlkbGVcIikge1xuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xuIFx0XHR9XG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xuIFx0XHRcdGlmICghdXBkYXRlKSB7XG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRcdFx0cmV0dXJuIG51bGw7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XG5cbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0aG90VXBkYXRlID0ge307XG4gXHRcdFx0dmFyIGNodW5rSWQgPSBcIm1haW5cIjtcbiBcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9uZS1ibG9ja3NcbiBcdFx0XHR7XG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHRcdGlmIChcbiBcdFx0XHRcdGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiZcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiZcbiBcdFx0XHRcdGhvdFdhaXRpbmdGaWxlcyA9PT0gMFxuIFx0XHRcdCkge1xuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdH1cbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXG4gXHRcdFx0cmV0dXJuO1xuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xuIFx0XHRmb3IgKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0aWYgKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcbiBcdFx0aWYgKCFkZWZlcnJlZCkgcmV0dXJuO1xuIFx0XHRpZiAoaG90QXBwbHlPblVwZGF0ZSkge1xuIFx0XHRcdC8vIFdyYXAgZGVmZXJyZWQgb2JqZWN0IGluIFByb21pc2UgdG8gbWFyayBpdCBhcyBhIHdlbGwtaGFuZGxlZCBQcm9taXNlIHRvXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxuIFx0XHRcdFByb21pc2UucmVzb2x2ZSgpXG4gXHRcdFx0XHQudGhlbihmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xuIFx0XHRcdFx0fSlcbiBcdFx0XHRcdC50aGVuKFxuIFx0XHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gXHRcdFx0XHRcdH0sXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHQpO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpXG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuIFx0XHR2YXIgY2I7XG4gXHRcdHZhciBpO1xuIFx0XHR2YXIgajtcbiBcdFx0dmFyIG1vZHVsZTtcbiBcdFx0dmFyIG1vZHVsZUlkO1xuXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcblxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5tYXAoZnVuY3Rpb24oaWQpIHtcbiBcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxuIFx0XHRcdFx0XHRpZDogaWRcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fbWFpbikge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0aWYgKCFwYXJlbnQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cblxuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xuIFx0XHRcdH07XG4gXHRcdH1cblxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG4gXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XG4gXHRcdFx0XHRpZiAoYS5pbmRleE9mKGl0ZW0pID09PSAtMSkgYS5wdXNoKGl0ZW0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcblxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xuIFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiXG4gXHRcdFx0KTtcbiBcdFx0fTtcblxuIFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xuIFx0XHRcdFx0LyoqIEB0eXBlIHtUT0RPfSAqL1xuIFx0XHRcdFx0dmFyIHJlc3VsdDtcbiBcdFx0XHRcdGlmIChob3RVcGRhdGVbaWRdKSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdC8qKiBAdHlwZSB7RXJyb3J8ZmFsc2V9ICovXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xuIFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFpbikge1xuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRzd2l0Y2ggKHJlc3VsdC50eXBlKSB7XG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdFwiIGluIFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQucGFyZW50SWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vblVuYWNjZXB0ZWQpIG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uQWNjZXB0ZWQpIG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRpc3Bvc2VkKSBvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRkZWZhdWx0OlxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoYWJvcnRFcnJvcikge1xuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvQXBwbHkpIHtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHRcdFx0XHRmb3IgKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdFx0XHRcdGlmIChcbiBcdFx0XHRcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0XHRcdFx0KVxuIFx0XHRcdFx0XHRcdCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQoXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSxcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXVxuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0Rpc3Bvc2UpIHtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiZcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkICYmXG4gXHRcdFx0XHQvLyByZW1vdmVkIHNlbGYtYWNjZXB0ZWQgbW9kdWxlcyBzaG91bGQgbm90IGJlIHJlcXVpcmVkXG4gXHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSAhPT0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcbiBcdFx0XHRcdH0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0fSk7XG5cbiBcdFx0dmFyIGlkeDtcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XG4gXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRpZiAoIW1vZHVsZSkgY29udGludWU7XG5cbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xuXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcbiBcdFx0XHRcdGNiKGRhdGEpO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xuXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcbiBcdFx0XHRcdGlmICghY2hpbGQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkge1xuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XG4gXHRcdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3cgaW4gXCJhcHBseVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xuXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XG4gXHRcdFx0XHRcdFx0aWYgKGNiKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmluZGV4T2YoY2IpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcbiBcdFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xuIFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHR0cnkge1xuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXG4gXHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjI7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcbiBcdFx0aWYgKGVycm9yKSB7XG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuIFx0XHR9XG5cbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiBcdFx0XHRyZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDApKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXBkYXRlZE1vZHVsZXMsIHJlbmV3ZWRNb2R1bGVzKSB7XG5cdHZhciB1bmFjY2VwdGVkTW9kdWxlcyA9IHVwZGF0ZWRNb2R1bGVzLmZpbHRlcihmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdHJldHVybiByZW5ld2VkTW9kdWxlcyAmJiByZW5ld2VkTW9kdWxlcy5pbmRleE9mKG1vZHVsZUlkKSA8IDA7XG5cdH0pO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdGlmICh1bmFjY2VwdGVkTW9kdWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0bG9nKFxuXHRcdFx0XCJ3YXJuaW5nXCIsXG5cdFx0XHRcIltITVJdIFRoZSBmb2xsb3dpbmcgbW9kdWxlcyBjb3VsZG4ndCBiZSBob3QgdXBkYXRlZDogKFRoZXkgd291bGQgbmVlZCBhIGZ1bGwgcmVsb2FkISlcIlxuXHRcdCk7XG5cdFx0dW5hY2NlcHRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKCFyZW5ld2VkTW9kdWxlcyB8fCByZW5ld2VkTW9kdWxlcy5sZW5ndGggPT09IDApIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gTm90aGluZyBob3QgdXBkYXRlZC5cIik7XG5cdH0gZWxzZSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZWQgbW9kdWxlczpcIik7XG5cdFx0cmVuZXdlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0aWYgKHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJzdHJpbmdcIiAmJiBtb2R1bGVJZC5pbmRleE9mKFwiIVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gbW9kdWxlSWQuc3BsaXQoXCIhXCIpO1xuXHRcdFx0XHRsb2cuZ3JvdXBDb2xsYXBzZWQoXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBwYXJ0cy5wb3AoKSk7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdFx0bG9nLmdyb3VwRW5kKFwiaW5mb1wiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR2YXIgbnVtYmVySWRzID0gcmVuZXdlZE1vZHVsZXMuZXZlcnkoZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdHJldHVybiB0eXBlb2YgbW9kdWxlSWQgPT09IFwibnVtYmVyXCI7XG5cdFx0fSk7XG5cdFx0aWYgKG51bWJlcklkcylcblx0XHRcdGxvZyhcblx0XHRcdFx0XCJpbmZvXCIsXG5cdFx0XHRcdFwiW0hNUl0gQ29uc2lkZXIgdXNpbmcgdGhlIE5hbWVkTW9kdWxlc1BsdWdpbiBmb3IgbW9kdWxlIG5hbWVzLlwiXG5cdFx0XHQpO1xuXHR9XG59O1xuIiwidmFyIGxvZ0xldmVsID0gXCJpbmZvXCI7XG5cbmZ1bmN0aW9uIGR1bW15KCkge31cblxuZnVuY3Rpb24gc2hvdWxkTG9nKGxldmVsKSB7XG5cdHZhciBzaG91bGRMb2cgPVxuXHRcdChsb2dMZXZlbCA9PT0gXCJpbmZvXCIgJiYgbGV2ZWwgPT09IFwiaW5mb1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcIndhcm5pbmdcIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIiwgXCJlcnJvclwiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcImVycm9yXCIpO1xuXHRyZXR1cm4gc2hvdWxkTG9nO1xufVxuXG5mdW5jdGlvbiBsb2dHcm91cChsb2dGbikge1xuXHRyZXR1cm4gZnVuY3Rpb24obGV2ZWwsIG1zZykge1xuXHRcdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0XHRsb2dGbihtc2cpO1xuXHRcdH1cblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsZXZlbCwgbXNnKSB7XG5cdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0aWYgKGxldmVsID09PSBcImluZm9cIikge1xuXHRcdFx0Y29uc29sZS5sb2cobXNnKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID09PSBcIndhcm5pbmdcIikge1xuXHRcdFx0Y29uc29sZS53YXJuKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJlcnJvclwiKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKG1zZyk7XG5cdFx0fVxuXHR9XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnMgKi9cbnZhciBncm91cCA9IGNvbnNvbGUuZ3JvdXAgfHwgZHVtbXk7XG52YXIgZ3JvdXBDb2xsYXBzZWQgPSBjb25zb2xlLmdyb3VwQ29sbGFwc2VkIHx8IGR1bW15O1xudmFyIGdyb3VwRW5kID0gY29uc29sZS5ncm91cEVuZCB8fCBkdW1teTtcbi8qIGVzbGludC1lbmFibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwID0gbG9nR3JvdXAoZ3JvdXApO1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cENvbGxhcHNlZCA9IGxvZ0dyb3VwKGdyb3VwQ29sbGFwc2VkKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBFbmQgPSBsb2dHcm91cChncm91cEVuZCk7XG5cbm1vZHVsZS5leHBvcnRzLnNldExvZ0xldmVsID0gZnVuY3Rpb24obGV2ZWwpIHtcblx0bG9nTGV2ZWwgPSBsZXZlbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmZvcm1hdEVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG5cdHZhciBtZXNzYWdlID0gZXJyLm1lc3NhZ2U7XG5cdHZhciBzdGFjayA9IGVyci5zdGFjaztcblx0aWYgKCFzdGFjaykge1xuXHRcdHJldHVybiBtZXNzYWdlO1xuXHR9IGVsc2UgaWYgKHN0YWNrLmluZGV4T2YobWVzc2FnZSkgPCAwKSB7XG5cdFx0cmV0dXJuIG1lc3NhZ2UgKyBcIlxcblwiICsgc3RhY2s7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHN0YWNrO1xuXHR9XG59O1xuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8qZ2xvYmFscyBfX3Jlc291cmNlUXVlcnkgKi9cbmlmIChtb2R1bGUuaG90KSB7XG5cdHZhciBob3RQb2xsSW50ZXJ2YWwgPSArX19yZXNvdXJjZVF1ZXJ5LnN1YnN0cigxKSB8fCAxMCAqIDYwICogMTAwMDtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHR2YXIgY2hlY2tGb3JVcGRhdGUgPSBmdW5jdGlvbiBjaGVja0ZvclVwZGF0ZShmcm9tVXBkYXRlKSB7XG5cdFx0aWYgKG1vZHVsZS5ob3Quc3RhdHVzKCkgPT09IFwiaWRsZVwiKSB7XG5cdFx0XHRtb2R1bGUuaG90XG5cdFx0XHRcdC5jaGVjayh0cnVlKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbih1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRcdGlmICghdXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRcdGlmIChmcm9tVXBkYXRlKSBsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlIGFwcGxpZWQuXCIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXF1aXJlKFwiLi9sb2ctYXBwbHktcmVzdWx0XCIpKHVwZGF0ZWRNb2R1bGVzLCB1cGRhdGVkTW9kdWxlcyk7XG5cdFx0XHRcdFx0Y2hlY2tGb3JVcGRhdGUodHJ1ZSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnIpIHtcblx0XHRcdFx0XHR2YXIgc3RhdHVzID0gbW9kdWxlLmhvdC5zdGF0dXMoKTtcblx0XHRcdFx0XHRpZiAoW1wiYWJvcnRcIiwgXCJmYWlsXCJdLmluZGV4T2Yoc3RhdHVzKSA+PSAwKSB7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gQ2Fubm90IGFwcGx5IHVwZGF0ZS5cIik7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gXCIgKyBsb2cuZm9ybWF0RXJyb3IoZXJyKSk7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gWW91IG5lZWQgdG8gcmVzdGFydCB0aGUgYXBwbGljYXRpb24hXCIpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gVXBkYXRlIGZhaWxlZDogXCIgKyBsb2cuZm9ybWF0RXJyb3IoZXJyKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cdHNldEludGVydmFsKGNoZWNrRm9yVXBkYXRlLCBob3RQb2xsSW50ZXJ2YWwpO1xufSBlbHNlIHtcblx0dGhyb3cgbmV3IEVycm9yKFwiW0hNUl0gSG90IE1vZHVsZSBSZXBsYWNlbWVudCBpcyBkaXNhYmxlZC5cIik7XG59XG4iLCJpbXBvcnQgeyBQdWJTdWIgfSBmcm9tICdncmFwaHFsLXN1YnNjcmlwdGlvbnMnO1xuaW1wb3J0IHsgYXV0aGVudGljYXRlIH0gZnJvbSAnLi4vdXNlci9oZWxwZXJzJztcblxuY29uc3QgY2hhdHM6IGFueVtdID0gW107XG5cbmV4cG9ydCBjb25zdCByZXNvbHZlcnMgPSB7XG4gICAgUXVlcnk6IHtcbiAgICAgICAgbWVzc2FnZXM6IChcbiAgICAgICAgICAgIG9iajogYW55LFxuICAgICAgICAgICAgeyB0b2tlbiwgY2hhbm5lbCwgbGltaXQgfTogeyB0b2tlbjogc3RyaW5nLCBjaGFubmVsOiBzdHJpbmcsIGxpbWl0PzogbnVtYmVyIH0sXG4gICAgICAgICAgICBjb250ZXh0OiBhbnksXG4gICAgICAgICAgICBpbmZvOiBhbnlcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2hhdHNbY2hhbm5lbF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGltaXQgPyBjaGF0c1tjaGFubmVsXS5zbGljZSgtbGltaXQpIDogY2hhdHNbY2hhbm5lbF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgTXV0YXRpb246IHtcbiAgICAgICAgc2VuZE1lc3NhZ2U6IChcbiAgICAgICAgICAgIG9iajogYW55LFxuICAgICAgICAgICAgeyBmcm9tLCB0b2tlbiwgbWVzc2FnZSwgY2hhbm5lbCB9OiB7IGZyb206IHN0cmluZywgdG9rZW46IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCBjaGFubmVsOiBzdHJpbmcgfSxcbiAgICAgICAgICAgIHsgcHVic3ViIH06IHsgcHVic3ViOiBQdWJTdWIgfSxcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1c2VyID0gYXV0aGVudGljYXRlKGZyb20sIHRva2VuKTtcbiAgICAgICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91XFwncmUgbm90IGF1dGhvcml6ZWQgdG8gc2VuZCB0aGlzIG1lc3NhZ2UuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWNoYXRzW2NoYW5uZWxdKSB7XG4gICAgICAgICAgICAgICAgY2hhdHNbY2hhbm5lbF0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNoYXRNZXNzYWdlID0ge1xuICAgICAgICAgICAgICAgIGNoYW5uZWwsXG4gICAgICAgICAgICAgICAgZnJvbTogdXNlcixcbiAgICAgICAgICAgICAgICBpZDogY2hhdHNbY2hhbm5lbF0ubGVuZ3RoICsgMSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNoYXRzW2NoYW5uZWxdLnB1c2goY2hhdE1lc3NhZ2UpO1xuICAgICAgICAgICAgcHVic3ViLnB1Ymxpc2goY2hhbm5lbCwgeyBtZXNzYWdlU2VudDogY2hhdE1lc3NhZ2UgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjaGF0TWVzc2FnZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBTdWJzY3JpcHRpb246IHtcbiAgICAgICAgbWVzc2FnZVNlbnQ6IHtcbiAgICAgICAgICAgIHN1YnNjcmliZTogKG9iajogYW55LCB7IGNoYW5uZWwgfTogeyBjaGFubmVsOiBzdHJpbmcgfSwgeyBwdWJzdWIgfTogeyBwdWJzdWI6IFB1YlN1YiB9KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHB1YnN1Yi5hc3luY0l0ZXJhdG9yKGNoYW5uZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbiIsImltcG9ydCB7IGdxbCB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItY29yZSc7XG5cbmV4cG9ydCBjb25zdCB0eXBlRGVmcyA9IGdxbGBcbiAgICB0eXBlIE1lc3NhZ2Uge1xuICAgICAgICBpZDogSW50IVxuICAgICAgICBmcm9tOiBVc2VyLFxuICAgICAgICBtZXNzYWdlOiBTdHJpbmchXG4gICAgICAgIGNoYW5uZWw6IFN0cmluZyFcbiAgICB9XG5cbiAgICBleHRlbmQgdHlwZSBRdWVyeSB7XG4gICAgICAgIG1lc3NhZ2VzKHRva2VuOiBTdHJpbmchLCBjaGFubmVsOiBTdHJpbmchLCBsaW1pdDogSW50KTogW01lc3NhZ2VdXG4gICAgfVxuXG4gICAgZXh0ZW5kIHR5cGUgTXV0YXRpb24ge1xuICAgICAgICBzZW5kTWVzc2FnZShmcm9tOiBTdHJpbmchLCB0b2tlbjogU3RyaW5nISwgbWVzc2FnZTogU3RyaW5nISwgY2hhbm5lbDogU3RyaW5nISk6IE1lc3NhZ2VcbiAgICB9XG5cbiAgICBleHRlbmQgdHlwZSBTdWJzY3JpcHRpb24ge1xuICAgICAgICBtZXNzYWdlU2VudChjaGFubmVsOiBTdHJpbmchKTogTWVzc2FnZVxuICAgIH1cbmA7XG4iLCJleHBvcnQgY29uc3QgcmVzb2x2ZXJzID0ge1xuICAgIFF1ZXJ5OiB7XG4gICAgICAgIHZlcnNpb246ICgpID0+IHByb2Nlc3MuZW52LkFQUF9WRVJTSU9OLFxuICAgIH0sXG5cbiAgICBNdXRhdGlvbjoge1xuICAgICAgICBfOiAoKSA9PiBudWxsLFxuICAgIH0sXG5cbiAgICBTdWJzY3JpcHRpb246IHtcbiAgICAgICAgXzogKCkgPT4gbnVsbCxcbiAgICB9XG59O1xuIiwiaW1wb3J0IHsgZ3FsIH0gZnJvbSAnYXBvbGxvLXNlcnZlci1leHByZXNzJztcblxuZXhwb3J0IGNvbnN0IHR5cGVEZWZzID0gZ3FsYFxuICAgIHR5cGUgUXVlcnkge1xuICAgICAgICB2ZXJzaW9uOiBTdHJpbmchLFxuICAgIH1cblxuICAgIHR5cGUgTXV0YXRpb24ge1xuICAgICAgICBfOiBTdHJpbmcsXG4gICAgfVxuXG4gICAgdHlwZSBTdWJzY3JpcHRpb24ge1xuICAgICAgICBfOiBTdHJpbmcsXG4gICAgfVxuYDtcbiIsImV4cG9ydCBjb25zdCByZXNvbHZlcnMgPSB7XG4gICAgUXVlcnk6IHtcbiAgICAgICAgbGlzdDogKFxuICAgICAgICAgICAgb2JqOiBhbnksXG4gICAgICAgICAgICB7IGZyb20sIHRvIH06IHsgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyIH0sXG4gICAgICAgICAgICBjb250ZXh0OiBhbnksXG4gICAgICAgICAgICBpbmZvOiBhbnlcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICBpZiAoZnJvbSA+IHRvKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG1wID0gZnJvbTtcbiAgICAgICAgICAgICAgICBmcm9tID0gdG87XG4gICAgICAgICAgICAgICAgdG8gPSB0bXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBvdXRwdXQ6IG51bWJlcltdID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA8PSB0bzsgKytpKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsImltcG9ydCB7IGdxbCB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItZXhwcmVzcyc7XG5cbmV4cG9ydCBjb25zdCB0eXBlRGVmcyA9IGdxbGBcbiAgICBleHRlbmQgdHlwZSBRdWVyeSB7XG4gICAgICAgIGxpc3QoZnJvbTogSW50ISwgdG86IEludCEpOiBbSW50XSxcbiAgICB9LFxuYDtcbiIsImV4cG9ydCBjb25zdCByZXNvbHZlcnMgPSB7XG4gICAgUXVlcnk6IHtcbiAgICAgICAgcmFuZG9tOiAoXG4gICAgICAgICAgICBvYmo6IGFueSxcbiAgICAgICAgICAgIHsgbWluLCBtYXgsIGJvb3N0IH06IHsgbWluPzogbnVtYmVyLCBtYXg6IG51bWJlciwgYm9vc3Q/OiBudW1iZXJ9LFxuICAgICAgICAgICAgY29udGV4dDogYW55LFxuICAgICAgICAgICAgaW5mbzogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoIW1pbikge1xuICAgICAgICAgICAgICAgIG1pbiA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWJvb3N0KSB7XG4gICAgICAgICAgICAgICAgYm9vc3QgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1pbiA+IG1heCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRtcCA9IG1pbjtcbiAgICAgICAgICAgICAgICBtaW4gPSBtYXg7XG4gICAgICAgICAgICAgICAgbWF4ID0gdG1wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4ICsgMSAtIG1pbikpICsgbWluICsgYm9vc3QpO1xuICAgICAgICB9LFxuICAgIH0sXG59O1xuIiwiaW1wb3J0IHsgZ3FsIH0gZnJvbSAnYXBvbGxvLXNlcnZlci1leHByZXNzJztcblxuZXhwb3J0IGNvbnN0IHR5cGVEZWZzID0gZ3FsYFxuICAgIGV4dGVuZCB0eXBlIFF1ZXJ5IHtcbiAgICAgICAgcmFuZG9tKG1pbjogSW50LCBtYXg6IEludCEsIGJvb3N0OiBJbnQpOiBJbnQsXG4gICAgfSxcbmA7XG4iLCJpbXBvcnQgeyBtZXJnZSB9IGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7IHJlc29sdmVycyBhcyBjaGF0UmVzb2x2ZXIgfSBmcm9tICcuL2NoYXQvcmVzb2x2ZXInO1xuaW1wb3J0IHsgcmVzb2x2ZXJzIGFzIGRlZmF1bHRSZXNvbHZlciB9IGZyb20gJy4vZGVmYXVsdC9yZXNvbHZlcic7XG5pbXBvcnQgeyByZXNvbHZlcnMgYXMgbGlzdCB9IGZyb20gJy4vbGlzdC9yZXNvbHZlcic7XG5pbXBvcnQgeyByZXNvbHZlcnMgYXMgcmFuZG9taXpyIH0gZnJvbSAnLi9yYW5kb21penIvcmVzb2x2ZXInO1xuaW1wb3J0IHsgcmVzb2x2ZXJzIGFzIHVzZXIgfSBmcm9tICcuL3VzZXIvcmVzb2x2ZXInO1xuXG5leHBvcnQgY29uc3Qgcm9vdFJlc29sdmVycyA9IG1lcmdlKFxuICAgIHVzZXIsXG4gICAgY2hhdFJlc29sdmVyLFxuICAgIGRlZmF1bHRSZXNvbHZlcixcbiAgICBsaXN0LFxuICAgIHJhbmRvbWl6cixcbik7XG4iLCJpbXBvcnQgeyByb290UmVzb2x2ZXJzIH0gZnJvbSAnLi9yb290UmVzb2x2ZXJzJztcbmltcG9ydCB7IHJvb3RUeXBlRGVmcyB9IGZyb20gJy4vcm9vdFR5cGVEZWZzJztcblxuZXhwb3J0IGNvbnN0IHJvb3RTY2hlbWEgPSB7XG4gICAgcmVzb2x2ZXJzOiByb290UmVzb2x2ZXJzLFxuICAgIHR5cGVEZWZzOiByb290VHlwZURlZnMsXG59O1xuIiwiaW1wb3J0IHsgdHlwZURlZnMgYXMgY2hhdCB9IGZyb20gJy4vY2hhdC90eXBlZGVmcyc7XG5pbXBvcnQgeyB0eXBlRGVmcyBhcyBkZWZhdWx0VHlwZURlZnMgfSBmcm9tICcuL2RlZmF1bHQvdHlwZWRlZnMnO1xuaW1wb3J0IHsgdHlwZURlZnMgYXMgbGlzdCB9IGZyb20gJy4vbGlzdC90eXBlZGVmcyc7XG5pbXBvcnQgeyB0eXBlRGVmcyBhcyByYW5kb21penIgfSBmcm9tICcuL3JhbmRvbWl6ci90eXBlZGVmcyc7XG5pbXBvcnQgeyB0eXBlRGVmcyBhcyB1c2VyIH0gZnJvbSAnLi91c2VyL3R5cGVkZWZzJztcblxuZXhwb3J0IGNvbnN0IHJvb3RUeXBlRGVmcyA9IFtcbiAgICB1c2VyLFxuICAgIGNoYXQsXG4gICAgZGVmYXVsdFR5cGVEZWZzLFxuICAgIGxpc3QsXG4gICAgcmFuZG9taXpyLFxuXTtcbiIsImltcG9ydCB7IFVzZXIsIHVzZXJzIH0gZnJvbSAnLi9yZXNvbHZlcic7XG5cbmxldCB1bmlxdWlmaWVyOiBudW1iZXIgPSAxO1xuXG5leHBvcnQgZnVuY3Rpb24gdW5pcUlkR2VuZXJhdG9yKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuICcnICtcbiAgICAgICAgZGF0ZS5nZXRGdWxsWWVhcigpICtcbiAgICAgICAgZGF0ZS5nZXRNb250aCgpICtcbiAgICAgICAgZGF0ZS5nZXREYXRlKCkgK1xuICAgICAgICBkYXRlLmdldFRpbWUoKSArXG4gICAgICAgICh1bmlxdWlmaWVyKyspO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVUb2tlbigpOiBzdHJpbmcge1xuICAgIGNvbnN0IGF2YWlsYWJsZUNoYXJhY3RlcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknO1xuICAgIGNvbnN0IGxlbmd0aCA9IDMyO1xuICAgIGxldCB0b2tlbiA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdG9rZW4gKz0gYXZhaWxhYmxlQ2hhcmFjdGVyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhdmFpbGFibGVDaGFyYWN0ZXJzLmxlbmd0aCldO1xuICAgIH1cbiAgICByZXR1cm4gdG9rZW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkVG9rZW4odG9rZW46IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XG4gICAgdXNlcnMuZm9yRWFjaCgodXNlcjogVXNlcikgPT4ge1xuICAgICAgICBpZiAodXNlci5hdXRoVG9rZW4gJiYgdXNlci5hdXRoVG9rZW4gPT09IHRva2VuKSB7XG4gICAgICAgICAgICBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpc1ZhbGlkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXV0aGVudGljYXRlKGlkT3JOYW1lOiBzdHJpbmcsIHRva2VuOiBzdHJpbmcpOiBVc2VyIHwgbnVsbCB7XG4gICAgbGV0IGF1dGhVc2VyID0gbnVsbDtcbiAgICB1c2Vycy5mb3JFYWNoKCh1c2VyOiBVc2VyKSA9PiB7XG4gICAgICAgIGlmICh1c2VyLmlkID09PSBpZE9yTmFtZSB8fCB1c2VyLmRpc3BsYXlOYW1lID09PSBpZE9yTmFtZSkge1xuICAgICAgICAgICAgYXV0aFVzZXIgPSB1c2VyLmF1dGhUb2tlbiAmJiB1c2VyLmF1dGhUb2tlbiA9PT0gdG9rZW5cbiAgICAgICAgICAgICAgICA/IHsgaWQ6IHVzZXIuaWQsIGRpc3BsYXlOYW1lOiB1c2VyLmRpc3BsYXlOYW1lIH1cbiAgICAgICAgICAgICAgICA6IG51bGw7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYXV0aFVzZXI7XG59XG4iLCJpbXBvcnQgeyBnZW5lcmF0ZVRva2VuLCB1bmlxSWRHZW5lcmF0b3IgfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXIge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgZGlzcGxheU5hbWU6IHN0cmluZztcbiAgICBwYXNzd29yZDogc3RyaW5nO1xuICAgIGF1dGhUb2tlbj86IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IHVzZXJzOiBVc2VyW10gPSBbXTtcblxuZXhwb3J0IGNvbnN0IHJlc29sdmVycyA9IHtcbiAgICBRdWVyeToge1xuICAgICAgICBnZXRVc2VyQnlJZDogKFxuICAgICAgICAgICAgb2JqOiBhbnksXG4gICAgICAgICAgICB7IGlkIH06IHsgaWQ6IHN0cmluZyB9LFxuICAgICAgICAgICAgY29udGV4dDogYW55LFxuICAgICAgICApID0+IHtcbiAgICAgICAgICAgIHVzZXJzLmZvckVhY2goKHVzZXI6IFVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodXNlci5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVc2VyQnlEaXNwbGF5TmFtZTogKFxuICAgICAgICAgICAgb2JqOiBhbnksXG4gICAgICAgICAgICB7IGRpc3BsYXlOYW1lIH06IHsgZGlzcGxheU5hbWU6IHN0cmluZyB9LFxuICAgICAgICAgICAgY29udGV4dDogYW55LFxuICAgICAgICApID0+IHtcbiAgICAgICAgICAgIHVzZXJzLmZvckVhY2goKHVzZXI6IFVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodXNlci5kaXNwbGF5TmFtZSA9PT0gZGlzcGxheU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVc2VyczogKG9iajogYW55LCBhcmdzOiBhbnksIGNvbnRleHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHVzZXJzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGxvZ2luOiAoXG4gICAgICAgICAgICBvYmo6IGFueSxcbiAgICAgICAgICAgIHsgZGlzcGxheU5hbWUsIHBhc3N3b3JkIH06IHsgZGlzcGxheU5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyB9LFxuICAgICAgICAgICAgY29udGV4dDogYW55XG4gICAgICAgICkgPT4ge1xuICAgICAgICAgICAgbGV0IGF1dGhlbnRpY2F0ZWQ6IFVzZXIgfCBudWxsID0gbnVsbDtcbiAgICAgICAgICAgIHVzZXJzLmZvckVhY2goKHVzZXI6IFVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodXNlci5kaXNwbGF5TmFtZSA9PT0gZGlzcGxheU5hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgdXNlci5wYXNzd29yZCAhPT0gcGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHVzZXIuZGlzcGxheU5hbWUgPT09IGRpc3BsYXlOYW1lICYmXG4gICAgICAgICAgICAgICAgICAgIHVzZXIucGFzc3dvcmQgPT09IHBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIGF1dGhlbnRpY2F0ZWQgPSB1c2VyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGF1dGhlbnRpY2F0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhdXRoZW50aWNhdGVkLmF1dGhUb2tlbiA9IGdlbmVyYXRlVG9rZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXV0aGVudGljYXRlZC5hdXRoVG9rZW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBhdXRoZW50aWNhdGU6IFVzZXIgb3IgcGFzc3dvcmQgbWlnaHQgYmUgd3JvbmcuJyk7XG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIE11dGF0aW9uOiB7XG4gICAgICAgIHJlZ2lzdGVyOiAoXG4gICAgICAgICAgICBvYmo6IGFueSxcbiAgICAgICAgICAgIHsgZGlzcGxheU5hbWUsIHBhc3N3b3JkIH06IHsgZGlzcGxheU5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyB9LFxuICAgICAgICAgICAgY29udGV4dDogYW55XG4gICAgICAgICkgPT4ge1xuICAgICAgICAgICAgdXNlcnMuZm9yRWFjaCgodXNlcjogVXNlcikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh1c2VyLmRpc3BsYXlOYW1lID09PSBkaXNwbGF5TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VzZXIgYWxyZWFkeSByZWdpc3RlcmVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBjcmVhdGVkVXNlciA9IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZSxcbiAgICAgICAgICAgICAgICBpZDogdW5pcUlkR2VuZXJhdG9yKCksXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdXNlcnMucHVzaChjcmVhdGVkVXNlcik7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlZFVzZXI7XG4gICAgICAgIH0sXG4gICAgfSxcbn07XG4iLCJpbXBvcnQgeyBncWwgfSBmcm9tICdhcG9sbG8tc2VydmVyLWNvcmUnO1xuXG5leHBvcnQgY29uc3QgdHlwZURlZnMgPSBncWxgXG4gICAgdHlwZSBVc2VyIHtcbiAgICAgICAgaWQ6IFN0cmluZyFcbiAgICAgICAgZGlzcGxheU5hbWU6IFN0cmluZyFcbiAgICB9XG5cbiAgICBleHRlbmQgdHlwZSBRdWVyeSB7XG4gICAgICAgIGdldFVzZXJCeUlkKGlkOiBTdHJpbmchKTogVXNlclxuICAgICAgICBnZXRVc2VyQnlEaXNwbGF5TmFtZShkaXNwbGF5TmFtZTogU3RyaW5nISk6IFVzZXJcbiAgICAgICAgZ2V0VXNlcnM6IFtVc2VyXSFcbiAgICAgICAgbG9naW4oZGlzcGxheU5hbWU6IFN0cmluZyEsIHBhc3N3b3JkOiBTdHJpbmchKTogU3RyaW5nIVxuICAgIH1cblxuICAgIGV4dGVuZCB0eXBlIE11dGF0aW9uIHtcbiAgICAgICAgcmVnaXN0ZXIoZGlzcGxheU5hbWU6IFN0cmluZyEsIHBhc3N3b3JkOiBTdHJpbmchLCBrZXk6IFN0cmluZyk6IFVzZXJcbiAgICB9XG5gO1xuIiwiaW1wb3J0IGV4cHJlc3MsIHsgQXBwbGljYXRpb24sIE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UsIFJvdXRlciB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgUGF0aFBhcmFtcyB9IGZyb20gJ2V4cHJlc3Mtc2VydmUtc3RhdGljLWNvcmUnO1xuXG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuXG5pbXBvcnQgeyBVbnN1cHBvcnRlZE1ldGhvZEV4Y2VwdGlvbiB9IGZyb20gJy4uL2V4Y2VwdGlvbnMvY29yZS9VbnN1cHBvcnRlZE1ldGhvZEV4Y2VwdGlvbic7XG5cbmV4cG9ydCBkZWNsYXJlIHR5cGUgQUNUSU9OX1RZUEVTID0gJ0dFVCcgfCAnUFVUJyB8ICdQT1NUJyB8ICdQQVRDSCcgfCAnREVMRVRFJyB8ICdVU0UnO1xuXG5leHBvcnQgY2xhc3MgQXBwIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgREVGQVVMVF9QT1JUID0gODAyMDtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXBwOiBBcHBsaWNhdGlvbjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlcjogUm91dGVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcG9ydDogbnVtYmVyO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHBvcnQ/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5hcHAgPSBleHByZXNzKCk7XG4gICAgICAgIHRoaXMucm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbiAgICAgICAgdGhpcy5hcHAudXNlKCcvJywgdGhpcy5yb3V0ZXIpO1xuICAgICAgICB0aGlzLmFwcC51c2UoY29ycygpKTtcbiAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCA9PT0gdW5kZWZpbmVkID8gdGhpcy5ERUZBVUxUX1BPUlQgOiBwb3J0O1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVSb3V0ZShcbiAgICAgICAgdHlwZTogQUNUSU9OX1RZUEVTLFxuICAgICAgICB1cmw6IFBhdGhQYXJhbXMsXG4gICAgICAgIGhhbmRsZXI6IChyZXF1ZXN0OiBSZXF1ZXN0LCByZXNwb25zZTogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4gdm9pZFxuICAgICk6IHZvaWQge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgKCdHRVQnKTpcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5nZXQodXJsLCBoYW5kbGVyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgKCdQT1NUJyk6XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIucG9zdCh1cmwsIGhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAoJ1BVVCcpOlxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLnB1dCh1cmwsIGhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAoJ1BBVENIJyk6XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIucGF0Y2godXJsLCBoYW5kbGVyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgKCdERUxFVEUnKTpcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5kZWxldGUodXJsLCBoYW5kbGVyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgKCdVU0UnKTpcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci51c2UodXJsLCBoYW5kbGVyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFVuc3VwcG9ydGVkTWV0aG9kRXhjZXB0aW9uKCdObyBzdWNoIEhUVFAgbWV0aG9kLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0KGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogaHR0cC5TZXJ2ZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHAubGlzdGVuKHRoaXMucG9ydCwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRQb3J0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcnQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEFwcGxpY2F0aW9uKCk6IEFwcGxpY2F0aW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRSb3V0ZXIoKTogUm91dGVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm91dGVyO1xuICAgIH1cbn1cbiIsImltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQgeyBpc0VtcHR5IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGlzTnVsbCB9IGZyb20gJ3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIExvZ2dlciB7XG4gICAgbG9nOiAobWVzc2FnZT86IGFueSwgLi4ucGFyYW1zOiBhbnlbXSkgPT4gdm9pZDtcbiAgICBpbmZvOiAobWVzc2FnZT86IGFueSwgLi4ucGFyYW1zOiBhbnlbXSkgPT4gdm9pZDtcbiAgICB3YXJuOiAobWVzc2FnZT86IGFueSwgLi4ucGFyYW1zOiBhbnlbXSkgPT4gdm9pZDtcbiAgICBlcnJvcjogKG1lc3NhZ2U/OiBhbnksIC4uLnBhcmFtczogYW55W10pID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBEZWZhdWx0TG9nZ2VyIGltcGxlbWVudHMgTG9nZ2VyIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRGVmYXVsdExvZ2dlcjtcblxuICAgIHByb3RlY3RlZCBsb2dnZXI6IChtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pID0+IHZvaWQ7XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldERlZmF1bHRMb2dnZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluc3RhbmNlID0gbmV3IERlZmF1bHRMb2dnZXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBjb25zb2xlLmxvZztcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9nKG1lc3NhZ2U/OiBhbnksIC4uLnBhcmFtczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbExvZyhtZXNzYWdlLCAuLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmZvKG1lc3NhZ2U/OiBhbnksIC4uLnBhcmFtczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbExvZyhjaGFsay5ibHVlQnJpZ2h0KG1lc3NhZ2UpLCAuLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB3YXJuKG1lc3NhZ2U/OiBhbnksIC4uLnBhcmFtczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbExvZyhjaGFsay55ZWxsb3cobWVzc2FnZSksIC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGVycm9yKG1lc3NhZ2U/OiBhbnksIC4uLnBhcmFtczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbExvZyhjaGFsay5yZWQobWVzc2FnZSksIC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbnRlcm5hbExvZyhtZXNzYWdlPzogYW55LCAuLi5wYXJhbXM6IGFueVtdKTogdm9pZCB7XG4gICAgICAgIGlzTnVsbChwYXJhbXMpIHx8IGlzRW1wdHkocGFyYW1zKSA/IHRoaXMubG9nZ2VyKG1lc3NhZ2UpIDogdGhpcy5sb2dnZXIobWVzc2FnZSwgcGFyYW1zKTtcbiAgICB9XG59XG4iLCJmdW5jdGlvbiBkZWVwUmVzb2x2ZUJvb2xlYW4odmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGFzTnVtZXJpYyA9ICt2YWx1ZTtcbiAgICByZXR1cm4gIWlzTmFOKGFzTnVtZXJpYykgJiYgYXNOdW1lcmljICE9PSAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUJvb2xlYW4odmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICAgIGNhc2UgJ3RydWUnOlxuICAgICAgICBjYXNlICd5ZXMnOlxuICAgICAgICBjYXNlICdvbic6XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBkZWVwUmVzb2x2ZUJvb2xlYW4odmFsdWUpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBVbnN1cHBvcnRlZE1ldGhvZEV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcbiAgICBwdWJsaWMgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwb2xsb1NlcnZlciwgQXBvbGxvU2VydmVyRXhwcmVzc0NvbmZpZywgUHViU3ViIH0gZnJvbSAnYXBvbGxvLXNlcnZlci1leHByZXNzJztcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcbmltcG9ydCB7IGNyZWF0ZVNlcnZlciwgU2VydmVyIH0gZnJvbSAnaHR0cCc7XG5cbmltcG9ydCB7IEFwcCB9IGZyb20gJy4vY29yZS9BcHAnO1xuaW1wb3J0IHsgcmVzb2x2ZUJvb2xlYW4gfSBmcm9tICcuL2NvcmUvaGVscGVycy9jb252ZXJ0ZXInO1xuaW1wb3J0IHsgRGVmYXVsdExvZ2dlciB9IGZyb20gJy4vY29yZS9Mb2dnZXInO1xuaW1wb3J0IHsgcm9vdFNjaGVtYSB9IGZyb20gJy4vR3JhcGhRTC9yb290U2NoZW1hJztcblxuZG90ZW52LmNvbmZpZygpO1xuXG5jb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuQVBQX1BPUlQgPyArcHJvY2Vzcy5lbnYuQVBQX1BPUlQgOiB1bmRlZmluZWQ7XG5jb25zdCBwYXRoID0gcHJvY2Vzcy5lbnYuR1JBUEhRTF9QQVRIID8gYC8ke3Byb2Nlc3MuZW52LkdSQVBIUUxfUEFUSH1gIDogJy9ncmFwaHFsJztcbmNvbnN0IGFwcDogQXBwID0gbmV3IEFwcChwb3J0KTtcblxuY29uc3QgcHVic3ViOiBQdWJTdWIgPSBuZXcgUHViU3ViKCk7XG5jb25zdCBlbmFibGVQbGF5Z3JvdW5kID0gcHJvY2Vzcy5lbnYuQVBPTExPX1BMQVlHUk9VTkQgPyByZXNvbHZlQm9vbGVhbihwcm9jZXNzLmVudi5BUE9MTE9fUExBWUdST1VORCkgOiB0cnVlO1xuY29uc3QgaW50cm9zcGVjdGlvbiA9IHByb2Nlc3MuZW52LkFQT0xMT19JTlRST1NQRUNUSU9OID8gcmVzb2x2ZUJvb2xlYW4ocHJvY2Vzcy5lbnYuQVBPTExPX0lOVFJPU1BFQ1RJT04pIDogdHJ1ZTtcbmNvbnN0IGFwb2xsb0NvbmZpZzogQXBvbGxvU2VydmVyRXhwcmVzc0NvbmZpZyA9IHtcbiAgICBjb250ZXh0OiB7IHB1YnN1YiB9LFxuICAgIGludHJvc3BlY3Rpb24sXG4gICAgcGxheWdyb3VuZDogZW5hYmxlUGxheWdyb3VuZCxcbiAgICByZXNvbHZlcnM6IHJvb3RTY2hlbWEucmVzb2x2ZXJzLFxuICAgIHR5cGVEZWZzOiByb290U2NoZW1hLnR5cGVEZWZzLFxufTtcbmNvbnN0IGFwb2xsb1NlcnZlcjogQXBvbGxvU2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcihhcG9sbG9Db25maWcpO1xuY29uc3QgaHR0cFNlcnZlcjogU2VydmVyID0gY3JlYXRlU2VydmVyKGFwcC5nZXRBcHBsaWNhdGlvbigpKTtcbmNvbnN0IGxvZ2dlcjogRGVmYXVsdExvZ2dlciA9IERlZmF1bHRMb2dnZXIuZ2V0RGVmYXVsdExvZ2dlcigpO1xuXG5hcG9sbG9TZXJ2ZXIuYXBwbHlNaWRkbGV3YXJlKHsgYXBwOiBhcHAuZ2V0QXBwbGljYXRpb24oKSwgcGF0aCB9KTtcbmFwb2xsb1NlcnZlci5pbnN0YWxsU3Vic2NyaXB0aW9uSGFuZGxlcnMoaHR0cFNlcnZlcik7XG4vLyBjcmVhdGVSb3V0ZXMoYXBwKTtcbi8qXG5jb25zdCBhcHBTZXJ2ZXIgPSBhcHAuc3RhcnQoKCkgPT4ge1xuICAgIGxvZ2dlci5pbmZvKGBTZXJ2ZXIgc3RhcnRlZCBhdCBodHRwOi8vbG9jYWxob3N0OiR7YXBwLmdldFBvcnQoKX0uYCk7XG59KTtcbiovXG5odHRwU2VydmVyLmxpc3Rlbih7IHBvcnQgfSwgKCkgPT4ge1xuICAgbG9nZ2VyLmluZm8oYPCfmoAgU2VydmVyIHN0YXJ0ZWQgYXQgaHR0cDovL2xvY2FsaG9zdDoke2FwcC5nZXRQb3J0KCl9LmApO1xuICAgbG9nZ2VyLmluZm8oYPCfmoAgU3Vic2NyaXB0aW9ucyByZWFkeSBhdCBodHRwOi8vbG9jYWxob3N0OiR7YXBwLmdldFBvcnQoKX0ke2Fwb2xsb1NlcnZlci5zdWJzY3JpcHRpb25zUGF0aH0uYCk7XG59KTtcblxuaWYgKG1vZHVsZS5ob3QpIHtcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgpO1xuICAgIG1vZHVsZS5ob3QuZGlzcG9zZSgoKSA9PiB7XG4gICAgICAgIGh0dHBTZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgYXBvbGxvU2VydmVyLnN0b3AoKTtcbiAgICB9KTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItY29yZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2hhbGtcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImxvZGFzaFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=