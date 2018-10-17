import fs from 'fs'

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
    const key = fs.readFileSync(key_dir)
    const https_pem = fs.readFileSync(https_pem_dir)
    this._config = {
      dsn,
      host,
      port,
      database,
      key,
      https_pem,
    }
  }

  getConfig () { return this._config }
}

export default ConnectionConfig
