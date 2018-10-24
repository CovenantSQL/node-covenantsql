'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var SqlString = require('sqlstring');
var rp = _interopDefault(require('request-promise'));
var fs = _interopDefault(require('fs'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var ObjectUtils = /** @class */ (function () {
    function ObjectUtils() {
    }
    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param sources One or more source objects from which to copy properties
     */
    ObjectUtils.assign = function (target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
            var source = sources_1[_a];
            for (var _b = 0, _c = Object.getOwnPropertyNames(source); _b < _c.length; _b++) {
                var prop = _c[_b];
                target[prop] = source[prop];
            }
        }
    };
    return ObjectUtils;
}());

/**
 * Connection class for ConvenantSQL connection
 */
var Connection = /** @class */ (function () {
    /**
     * @param {ConnectionConfig} a ConnectionConfig instance for current connection
     */
    function Connection(_config) {
        /**
         * Connect() called or not
         */
        this._connectCalled = false;
        this.config = _config;
        this.key = fs.readFileSync(_config.key_dir);
        this.https_pem = fs.readFileSync(_config.https_pem_dir);
        this._connectCalled = false;
        this._state = 'disconnected';
    }
    Connection.format = function (sql, values) {
        return SqlString.format(sql, values);
    };
    /**
     * connect CovenantSQL
     */
    Connection.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var datarows, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._connectCalled || this._state === 'connected')
                            throw new Error('COVENANTSQL_ERR: CONNECTION_HAS_INIT');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.query('SELECT 1', [], true)];
                    case 2:
                        datarows = _a.sent();
                        if (datarows !== null) {
                            ObjectUtils.assign(this, {
                                _state: 'connected',
                                _connectCalled: true
                            });
                            return [2 /*return*/, this];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        throw new Error(e_1);
                    case 4: return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Query a SQL on CovenantSQL
     */
    Connection.prototype.query = function (sql, values, isEstablish) {
        if (isEstablish === void 0) { isEstablish = false; }
        return __awaiter(this, void 0, void 0, function () {
            var formattedSql, result, _parsed, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isEstablish && this._state === 'disconnected')
                            throw new Error('COVENANTSQL_ERR: NO_CONNECTION');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        formattedSql = Connection.format(sql, values);
                        return [4 /*yield*/, this._requestPromise('query', formattedSql)];
                    case 2:
                        result = _a.sent();
                        _parsed = this._parseResult(result);
                        return [2 /*return*/, _parsed.datarows];
                    case 3:
                        e_2 = _a.sent();
                        throw new Error(e_2);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Exec a SQL on CovenantSQL
     */
    Connection.prototype.exec = function (sql, values) {
        return __awaiter(this, void 0, void 0, function () {
            var formattedSql, result, _parsed, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._state === 'disconnected')
                            throw new Error('COVENANTSQL_ERR: NO_CONNECTION');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        formattedSql = Connection.format(sql, values);
                        return [4 /*yield*/, this._requestPromise('exec', formattedSql)];
                    case 2:
                        result = _a.sent();
                        _parsed = this._parseResult(result);
                        return [2 /*return*/, _parsed.status === 'ok' || _parsed.status];
                    case 3:
                        e_3 = _a.sent();
                        throw new Error(e_3);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * _requestPromise: request promise for query and exec
     */
    Connection.prototype._requestPromise = function (method, sql) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, database, key, cert, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
                        if (this._connectCalled && this._state === 'disconnected')
                            throw new Error('COVENANTSQL_ERR: NO_CONNECTION');
                        uri = "https://" + this.config.host + ":" + this.config.port + "/v1/" + method;
                        database = this.config.database;
                        key = this.key;
                        cert = this.https_pem;
                        options = {
                            uri: uri,
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            form: { assoc: true, database: database, query: sql },
                            rejectUnauthorized: false,
                            agentOptions: { cert: cert, key: key }
                        };
                        return [4 /*yield*/, rp(options)
                                .catch(function (e) {
                                throw new Error("\nCOVENANTSQL_ERR:\n  STATUS_CODE " + e.statusCode + ",\n  ERROR " + e.error);
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * _parseResult: parse CovenantSQL response
     */
    Connection.prototype._parseResult = function (result) {
        if (result === void 0) { result = '{}'; }
        var _result = JSON.parse(result);
        if (_result.status !== 'ok' || _result.success !== true)
            throw new Error('COVENANTSQL_ERR: STATUS_NOT_OKAY');
        var datarows = (_result.data && _result.data.rows) || null;
        return { datarows: datarows, status: _result.status };
    };
    return Connection;
}());

/**
 * Copyright 2018 The CovenantSQL Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Format SQL and replacement values into a SQL string.
 */
function format(sql, values) {
    return Connection.format(sql, values);
}
/**
 * Create a new connection instance
 */
function createConnection(config) {
    return (new Connection(config)).connect();
}

exports.format = format;
exports.createConnection = createConnection;
