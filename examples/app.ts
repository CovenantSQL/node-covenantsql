var covenantsql = require('../dist/node-covenantsql.cjs.js')

const config = {
  endpoint: 'localhost:11105',
  database:
    '0a10b74439f2376d828c9a70fd538dac4b69e0f4065424feebc0f5dbc8b34872',
  bypassPem: true
};

covenantsql
  .createConnection(config)
  .then(async (connection: any) => {
    const data1 = await connection.query("select ? + ?", [2.1, 3.2]);
    console.log(data1);

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
  })
  .catch((e: any) => console.log(e));
