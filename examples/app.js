var covenantsql = require('../dist/node-covenantsql.cjs.js')

covenantsql
  .createConnection({
    endpoint: 'localhost:11105',
    database:
      '0a10b74439f2376d828c9a70fd538dac4b69e0f4065424feebc0f5dbc8b34872',
    bypassPem: true
  })
  .then(connection => {
    connection.query('select ? + ?', [2.1, 3.2]).then(data => {
      console.log(data)
    })

    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS contacts (\
    contact_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email text NOT NULL UNIQUE,
    phone text NOT NULL UNIQUE
    );
    `
    connection
      .exec(createTableSQL)
      .then(status => {
        console.log(`exec status:`, status)
      })
      .catch(e => {
        console.error(e)
      })

    connection
      .query('show tables;')
      .then(data => {
        console.log(data)
      })
  })
