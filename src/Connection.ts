import * as SqlString from 'sqlstring'
import rp from 'request-promise'
import fs from 'fs'

import { ConnectionConfig } from './ConnectionConfig'
import ObjectUtils from './util/ObjectUtils'

/**
 * Connection class for ConvenantSQL connection
 */
export class Connection {
  static format(sql: string, values: object | Array<any>): any {
    return SqlString.format(sql, values)
  }

  /**
   * Connection config
   */
  readonly config: ConnectionConfig

  /**
   * Connection key buffer
   */
  readonly key?: Buffer

  /**
   * Connection key buffer
   */
  readonly https_pem?: Buffer

  /**
   * Connect() called or not
   */
  readonly _connectCalled: boolean = false

  /**
   * Connect() called or not
   */
  readonly _state: 'disconnected' | 'connected'

  /**
   * @param {ConnectionConfig} a ConnectionConfig instance for current connection
   */
  constructor(_config: ConnectionConfig) {
    this.config = _config
    if (!_config.bypassPem) {
      this.key = Buffer.from(_config.key_dir!)
      this.https_pem = fs.readFileSync(_config.https_pem_dir!)
    }
    this._connectCalled = false
    this._state = 'disconnected'
  }

  /**
   * connect CovenantSQL
   */
  async connect(): Promise<this> {
    if (this._connectCalled || this._state === 'connected') { return this }
    try {
      const datarows = await this.query('SELECT 1', [], true)
      if (datarows !== null) {
        ObjectUtils.assign(this, {
          _state: 'connected',
          _connectCalled: true,
        })
        return this
      }
    } catch (e) {
      throw new Error(e)
    }

    return this
  }

  /**
   * Query a SQL on CovenantSQL
   */
  async query(
    sql: string,
    values?: object | Array<any>,
    isEstablish: boolean = false
  ): Promise<any> {
    try {
      const formattedSql = Connection.format(sql, values || [])
      const result = await this._requestPromise('query', formattedSql)

      const _parsed = this._parseResult(result)
      return _parsed.datarows
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Exec a SQL on CovenantSQL
   */
  async exec(sql: string, values?: object | Array<any>): Promise<any> {
    try {
      const formattedSql = Connection.format(sql, values || [])
      const result = await this._requestPromise('exec', formattedSql)
      const _parsed = this._parseResult(result)
      return _parsed.status === 'ok' || _parsed.status
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * _requestPromise: request promise for query and exec
   */
  protected async _requestPromise(
    method: 'query' | 'exec',
    sql: string
  ): Promise<any> {
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
    const httpPrefix = this.config.bypassPem ? 'http' : 'https'
    const database = this.config.database

    let options = null

    if (this.config.bypassPem) {
      let uri = `http://${this.config.endpoint}/v1/${method}`

      options = {
        uri,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        form: { assoc: true, database, query: sql },
        rejectUnauthorized: false,
      }
    } else {
      let uri = `https://${this.config.endpoint}/v1/${method}`
      let key = this.key
      let cert = this.https_pem

      options = {
        uri,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        form: { assoc: true, database, query: sql },
        rejectUnauthorized: false,
        agentOptions: { cert, key },
      }
    }

    return await rp(options).catch(e => {
      throw new Error(
        `status code: ${e.statusCode},\n${e.error}`
      )
    })
  }

  /**
   * _parseResult: parse CovenantSQL response
   */
  protected _parseResult(result: string = '{}'): any {
    const _result = JSON.parse(result)
    const datarows = (_result.data && _result.data.rows) || null
    return { datarows, status: _result.status }
  }
}
