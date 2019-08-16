const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bd_app_quindio'
});

connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('Database is Connected')
    }
})

module.exports = connection;