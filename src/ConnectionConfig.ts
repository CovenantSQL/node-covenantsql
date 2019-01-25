/**
 * ConnectionConfig as ConvenantSQL connection configs
 */
export interface ConnectionConfig {
  /**
   * Connection host
   */
  readonly host: string

  /**
   * Connection port for the host
   */
  readonly port: number

  /**
   * Database id of current connection
   */
  readonly database: string

  /**
   * Connection key directory
   */
  readonly key_dir: string

  /**
   * Connection HTTPS PEM directory
   */
  readonly https_pem_dir: string
}
