var covenantsql = require('../src')
var connection = covenantsql.createConnection({
  host     : 'localhost',
  user     : 'me',
  password : 'secret',
  database : 'my_db'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error
  console.log('The solution is: ', results[0].solution)
})

connection.end()

var covenantsql = require('./dist/node-covenantsql.umd.js')
var connection = covenantsql.createConnection({ host: 'localhost' })
