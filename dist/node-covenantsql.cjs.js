'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var SqlString = _interopDefault(require('sqlstring'));
var rp = _interopDefault(require('request-promise'));
var fs = _interopDefault(require('fs'));

/**
 * Connection class for ConvenantSQL connection
 */
class Connection {
  static format (sql, values) {
    return SqlString.format(sql, values)
  }

  /**
   * @param {ConnectionConfig} a ConnectionConfig instance for current connection
   */
  constructor ({ config }) {
    this._config = config.getConfig();
    this._connectCalled = false;
    this._state = 'disconnected';
  }

  connect () {
    if (!this._connectCalled && this._state === 'disconnected') {
      return this.query('SELECT 1;', [], true)
        .then(datarows => {
          if (datarows !== null) {
            this._state = 'connected';
            this._connectCalled = true;
            return true
          }
        })
    } else {
      throw new Error('COVENANTSQL_ERR: CONNECTION_NOT_ESTABLISHED')
    }
  }

  /**
   * Query
   * @param  {String}  sql                 sql string
   * @param  {Array}   values              sql string params
   * @param  {Boolean} [isEstablish=false] only for connection
   * @return {Promise} query result
   */
  query (sql, values, isEstablish = false) {
    if (!isEstablish && this._state === 'disconnected') throw new Error('COVENANTSQL_ERR: NO_CONNECTION')

    const formattedSql = Connection.format(sql, values);
    return this._requestPromise('query', formattedSql)
      .then(result => {
        const _parsed = this._parseResult(result);
        return _parsed.datarows
      })
  }

  /**
   * Exec
   * @param  {String} sql    sql string
   * @param  {Array}  values sql string params
   * @return {Boolean|String} status
   */
  exec (sql, values) {
    if (this._state === 'disconnected') throw new Error('COVENANTSQL_ERR: NO_CONNECTION')

    const formattedSql = Connection.format(sql, values);
    return this._requestPromise('exec', formattedSql)
      .then(result => {
        const _parsed = this._parseResult(result);
        return _parsed.status === 'ok' || _parsed.status
      })
  }

  /**
   * _requestPromise
   * @param  {String} method ['query', 'exec']
   * @param  {String} sql    sql string
   * @return {Promise}
   */
  _requestPromise (method, sql) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    if (this._connectCalled && this._state === 'disconnected') throw new Error('COVENANTSQL_ERR: NO_CONNECTION')

    const uri = `https://${this._config.host}:${this._config.port}/v1/${method}`;
    const database = this._config.database;
    const cert = this._config.https_pem;
    const key = this._config.key;

    const options = {
      uri,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      form: { assoc: true, database, query: sql },
      agentOptions: { cert, key }
    };

    return rp(options)
      .catch(e => {
        throw new Error(`\nCOVENANTSQL_ERR:\n  STATUS_CODE ${e.statusCode},\n  ERROR ${e.error}`)
      })
  }

  /**
   * _parseResult
   * @param  {Object} result from CovenantSQL
   * @return {Array} datarows
   */
  _parseResult (result = '{}') {
    const _result = JSON.parse(result);
    if (_result.status !== 'ok' || _result.success !== true) throw new Error('COVENANTSQL_ERR: STATUS_NOT_OKAY')

    const datarows = (_result.data && _result.data.rows) || null;
    return { datarows, status: _result.status }
  }
}

/**
 * ConnectionConfig as ConvenantSQL connection configs
 */
class ConnectionConfig {
  constructor ({
    dsn,
    host,
    port,
    database,
    key_dir,
    https_pem_dir,
  }) {
    const key = fs.readFileSync(key_dir);
    const https_pem = fs.readFileSync(https_pem_dir);
    this._config = {
      dsn,
      host,
      port,
      database,
      key,
      https_pem,
    };
  }

  getConfig () { return this._config }
}

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
 * @param  {[type]} sql The SQL for the query
 * @param  {Array} [values] Any values to insert into placeholders in sql
 * @return {String} Formatted SQL string
 */
const format = (sql, values) => {
  return Connection.format(sql, values)
};

/**
 * Create a new connection instance
 * @param  {Object} Config configuration for new ConvenantSQL connection
 * @return {Connection} A new ConvenantSQL connection
 * @public
 */
const createConnection = (config) => {
  return new Connection({ config: new ConnectionConfig(config) })
};

exports.format = format;
exports.createConnection = createConnection;
