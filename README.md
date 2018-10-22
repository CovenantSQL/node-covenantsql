# node-covenantsql

<p align="left">
    <a href="https://github.com/prettier/prettier">
        <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg"
            alt=""></a>
    <a href="https://codecov.io/gh/CovenantSQL/node-covenantsql">
        <img src="https://codecov.io/gh/CovenantSQL/node-covenantsql/branch/master/graph/badge.svg"
            alt="Coverage"></a>
    <a href="https://opensource.org/licenses/Apache-2.0">
        <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg"
            alt="License"></a>
</p>

This repo is nodejs driver for [CovenantSQL](https://github.com/CovenantSQL/CovenantSQL)

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

```javascript
var path = require('path')
var covenantsql = require('node-covenantsql')

var connection = covenantsql.createConnection({
  dsn: `covenant://${DB_ID}`,
  host: 'e.morenodes.com',
  port: 11108,
  database: `${DB_ID}`
  key_dir: path.resolve(`${KEY_FILE_RELATIVE_PATH}`),
  https_pem_dir: path.resolve(`${PEM_FILE_RELATIVE_PATH}`)
}).then(connection => {
  // read
  connection.query('SELECT ? + ?', [1, 2]).then(data => {
    console.log(data) // [{ '1+2': 3 }]
  })

  // write
  connection.exec('REPLACE into ?? values(?)', ['test_python_driver', 1]).then(status => {
    console.log(status) // true
  })
})
```

## License

[Apache-2.0](LICENSE).
