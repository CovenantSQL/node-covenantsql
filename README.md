# node-covenantsql

> Proxy version is build for both web and node environment, so now moved to [covenantsql-proxy-js](https://github.com/CovenantSQL/covenantsql-proxy-js).
----------------

<p align="left">
    <a href="https://codecov.io/gh/CovenantSQL/node-covenantsql">
        <img src="https://codecov.io/gh/CovenantSQL/node-covenantsql/branch/master/graph/badge.svg"
            alt="Coverage"></a>
    <a href="https://opensource.org/licenses/Apache-2.0">
        <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg"
            alt="License"></a>
</p>

This repo is nodejs driver for [CovenantSQL](https://github.com/CovenantSQL/CovenantSQL) written by TypeScript.

## Install

Install `node-covenantsql` via npm or yarn:
```bash
npm install --save node-covenantsql
```
or
```bash
yarn add node-covenantsql
```

## Get started
Follow CovenantSQL [Quickstart](https://testnet.covenantsql.io/quickstart) to get you prepared.


### configs for driver

- If the CovenantSQL endpoint comes with `HTTPS` then `.pem` and `.key` files are needed for requests:

```javascript
const config = {
    endpoint: 'e.morenodes.com:11108', // testnet endpoint with https
    database: `${DB_ID}`, // your DB id created by `cql` tools
    key_dir: path.resolve(`${KEY_FILE_RELATIVE_PATH}`), // your key file
    https_pem_dir: path.resolve(`${PEM_FILE_RELATIVE_PATH}`) // your pem file (cert file)
}
```

- If only `HTTP` is needed, then your config could be:

```javascript
const config = {
    endpoint: 'localhost:11105', // local testnet endpoint without https
    database: `${DB_ID}`, // your DB id created by `cql` tools
    bypassPem: true // bypass https config
}
```
### connect and query
```typescript
import cql from 'node-covenantsql'

const config = {...} // see above

cql.createConnection(config).then(async (connection: any) => {
    // read
    const data1 = await connection.query("select ? + ?", [2.1, 3.2]);
    console.log(data1);
        
    // write
    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS contacts (\
    contact_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email text NOT NULL UNIQUE,
    phone text NOT NULL UNIQUE
    );
    `
    const status1 = await connection.exec(createTableSQL)
    console.log(`exec1 status:`, status1);

    const data2 = await connection.query("show tables;");
    console.log(data2);
}).catch((e: any) => console.log(e))
```

## License

[Apache-2.0](LICENSE).
