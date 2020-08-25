'use strict'

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'app_db.sqlite3')

let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error(err.message);
    }

    console.log('Connected to the in-memory SQlite database.');
    createTables();
});

function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS 
    users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE);`, 
    (err) => {
        if (err) {
            return console.log(err.message);
        }

        db.run(`CREATE TABLE IF NOT EXISTS 
        links(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        description TEXT,
        user_id INTEGER,
        create_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) 
                ON DELETE CASCADE ON UPDATE NO ACTION);`);
    });
}

module.exports = db;