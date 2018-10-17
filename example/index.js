var path = require('path')
var covenantsql = require('../dist/node-covenantsql.cjs.js')

var connection = covenantsql.createConnection({
  dsn: 'covenant://053d0bb19637ffc7b4a94e3c79cc71b67a768813b09e4b67f1d6159902754a8b',
  host: 'e.morenodes.com',
  port: 11108,
  database: '053d0bb19637ffc7b4a94e3c79cc71b67a768813b09e4b67f1d6159902754a8b',
  key_dir: path.resolve('./ssl/write.test.covenantsql.io.key'),
  https_pem_dir: path.resolve('./ssl/write.test.covenantsql.io.pem')
})

connection.connect().then(status => {
  console.log('connected:', status)

  connection.query('select ? + ?', [2.1, 3.2]).then(data => {
    console.log(data)
  })

  connection.exec('replace into test_python_driver values(?), (?), (?)', ['test11', 'test22', 'test33'])
    .then(status => {
      console.log(`exec status:`, status)
    }).catch(e => {
      console.error(e)
    })

  connection.query("SELECT * FROM test_python_driver")
    .then(data => {
      console.log(data)
    }).catch(e => {
      console.error(e)
    })
})
