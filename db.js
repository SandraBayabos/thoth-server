const Pool = require("pg").Pool;

const pool = new Pool({
  user: "sandrabayabos",
  password: "",
  host: "localhost",
  port: "5432",
  database: "thoth-server",
});

module.exports = pool;
