const path = require("path");
const covenantsql = require("../dist/node-covenantsql.cjs.js");

const config = {
  host: "e.morenodes.com",
  port: 11108,
  database: "053d0bb19637ffc7b4a94e3c79cc71b67a768813b09e4b67f1d6159902754a8b",
  key_dir: path.resolve(__dirname, "../test/ssl/write.test.covenantsql.io.key"),
  https_pem_dir: path.resolve(
    __dirname,
    "../test/ssl/write.test.covenantsql.io.pem"
  )
};

covenantsql
  .createConnection(config)
  .then(async (connection: any) => {
    const data1 = await connection.query("select ? + ?", [2.1, 3.2]);
    console.log(data1);

    const data2 = await connection.query("SELECT * FROM test_python_driver");
    console.log(data2);

    const status1 = await connection.exec(
      "replace into test_python_driver values(?), (?), (?)",
      ["test11", "test22", "test33"]
    );
    console.log(`exec1 status:`, status1);

    const status2 = await connection.exec(
      'replace into test_python_driver values("test")'
    );
    console.log(`exec2 status:`, status2);
  })
  .catch((e: any) => console.log(e));
