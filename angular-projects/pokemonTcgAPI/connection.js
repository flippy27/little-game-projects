const mysql = require('mysql')

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "poketcg"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB!");
});
module.exports = con;