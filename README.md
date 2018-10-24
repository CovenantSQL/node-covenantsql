# node-covenantsql

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

```typescript
const path = require('path')
const covenantsql = require('../dist/node-covenantsql.cjs.js')

const config = {
  host: 'e.morenodes.com',
  port: 11108,
  database: `${DB_ID}`
  key_dir: path.resolve(`${KEY_FILE_RELATIVE_PATH}`),
  https_pem_dir: path.resolve(`${PEM_FILE_RELATIVE_PATH}`)
}

covenantsql.createConnection(config).then(async (connection: any) => {
  // read
  const data1 = await connection.query('select ? + ?', [2.1, 3.2])
  console.log(data1)

  const data2 = await connection.query('SELECT * FROM test_python_driver')
  console.log(data2)

  // write
  const status1 = await connection.exec('replace into test_python_driver values(?), (?), (?)', ['test11', 'test22', 'test33'])
  console.log(`exec1 status:`, status1)

  const status2 = await connection.exec('replace into test_python_driver values("test")')
  console.log(`exec2 status:`, status2)
}).catch((e: any) => console.log(e))

```

## License

[Apache-2.0](LICENSE).
