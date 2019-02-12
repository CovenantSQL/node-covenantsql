/**
 * ConnectionConfig as ConvenantSQL connection configs
 */
export interface ConnectionConfig {
    /**
     * Connection endpoint, format should be host:port (e.g. localhost:11105)
     */
    readonly endpoint: string;
    /**
     * Database id of current connection
     */
    readonly database: string;
    /**
     * Use https or not
     */
    readonly bypassPem?: boolean;
    /**
     * Connection key directory
     */
    readonly key_dir?: string;
    /**
     * Connection HTTPS PEM directory
     */
    readonly https_pem_dir?: string;
}
