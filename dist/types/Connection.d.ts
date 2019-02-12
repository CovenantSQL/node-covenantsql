/// <reference types="node" />
import { ConnectionConfig } from './ConnectionConfig';
/**
 * Connection class for ConvenantSQL connection
 */
export declare class Connection {
    static format(sql: string, values: object | Array<any>): any;
    /**
     * Connection config
     */
    readonly config: ConnectionConfig;
    /**
     * Connection key buffer
     */
    readonly key?: Buffer;
    /**
     * Connection key buffer
     */
    readonly https_pem?: Buffer;
    /**
     * Connect() called or not
     */
    readonly _connectCalled: boolean;
    /**
     * Connect() called or not
     */
    readonly _state: 'disconnected' | 'connected';
    /**
     * @param {ConnectionConfig} a ConnectionConfig instance for current connection
     */
    constructor(_config: ConnectionConfig);
    /**
     * connect CovenantSQL
     */
    connect(): Promise<this>;
    /**
     * Query a SQL on CovenantSQL
     */
    query(sql: string, values?: object | Array<any>, isEstablish?: boolean): Promise<any>;
    /**
     * Exec a SQL on CovenantSQL
     */
    exec(sql: string, values?: object | Array<any>): Promise<any>;
    /**
     * _requestPromise: request promise for query and exec
     */
    protected _requestPromise(method: 'query' | 'exec', sql: string): Promise<any>;
    /**
     * _parseResult: parse CovenantSQL response
     */
    protected _parseResult(result?: string): any;
}
