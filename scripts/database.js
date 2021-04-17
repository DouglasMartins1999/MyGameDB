const Knex = require("knex");
const settings = {};

if(process.env.NODE_ENV === 'production'){
    settings.client = "pg";
    settings.connection = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    }
    
} else {
    settings.useNullAsDefault = true
    settings.client = "sqlite3"
    settings.connection = {
        filename: "./db.sqlite",
    }
}

module.exports = Knex(settings);