const QueryBuilder = require('../model/query-builder');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbfile = path.resolve(__dirname, 'database.db');

class DatabaseService {

    static async init() {
        const db = new sqlite3.Database(dbfile, (err) => {
            if (err) throw new Error(`Error connecting to db: ${err.message}`);
        });

        db.serialize(async () => {
            db.run(`CREATE TABLE IF NOT EXISTS Collegiate
                (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    phrase VARCHAR(255) NOT NULL,
                    response BLOB NOT NULL
                )`)
                .run(`CREATE TABLE IF NOT EXISTS Thesaurus
                (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    phrase VARCHAR(255) NOT NULL,
                    response BLOB NOT NULL
                )`)
                .run(`CREATE TABLE IF NOT EXISTS Config
                (
                    id INTEGER PRIMARY KEY,
                    apiKey VARCHAR(100)
                )`).close();
        });

        return Promise.resolve();
    }

    static instance(readonly = true) {
        const opType = readonly ? sqlite3.OPEN_READONLY : sqlite3.OPEN_READWRITE;

        return new sqlite3.Database(dbfile, opType, err => {
            if (err) throw err;
        })
    }

    static insertDefinition(phrase, api_response) {
        return new Promise((resolve, reject) => {
            const conn = DatabaseService.instance(false);

            conn.run(
                ...QueryBuilder.insert('Collegiate').column('phrase', 'response')
                    .row(phrase, Buffer.from(JSON.stringify(api_response), 'utf-8'))
                    .build(),
                (err) => {
                    conn.close();
                    if (err) reject(err);
                    resolve();
                }
            )
        });
    }

    static insertThesaurus(phrase, api_response) {
        return new Promise((resolve, reject) => {
            const conn = DatabaseService.instance(false);

            conn.run(
                ...QueryBuilder.insert('Thesaurus').column('phrase', 'response')
                    .row(phrase, Buffer.from(JSON.stringify(api_response), 'utf-8'))
                    .build(),
                (err) => {
                    conn.close();
                    if (err) reject(err);
                    resolve();
                }
            )
        });
    }

    static updateApiKey(target, key) {
        return new Promise((resolve, reject) => {
            const conn = DatabaseService.instance(false);

            conn.run(
                `INSERT INTO Config (id, apiKey) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET apiKey = excluded.apiKey`,
                [
                    target === 'collegiate' ? 1 : 2,
                    key
                ],
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            )
        });
    }

    static getOne(selectBuilder) {
        return new Promise((resolve, reject) => {
            const conn = DatabaseService.instance();

            const built = selectBuilder.build();
            conn.get(...built, (err, row) => {
                conn.close();
                if (err) {
                    console.log('DB Error', err);
                    reject(err);
                }

                resolve(row);
            });
        });
    }
}

DatabaseService.init();
module.exports = DatabaseService;