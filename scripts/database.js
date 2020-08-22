const Knex = require("knex");
const settings = {};

if(process.env.NODE_ENV === 'production'){
    settings.client = "pg";
    settings.connection = process.env.DATABASE_URL
    
} else {
    settings.useNullAsDefault = true
    settings.client = "sqlite3"
    settings.connection = {
        filename: "./db.sqlite",
    }
}

module.exports = Knex(settings);