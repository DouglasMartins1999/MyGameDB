const app = require("express")();
const database = require("./scripts/database");
const routes = require("./scripts/routing");

async function initDB(){
    const hasTable = await database.schema.hasTable("games")
    if(!hasTable){
        await database.schema.createTable("games", (table) => {
            table.integer("id").primary();
            table.string("name");
            table.string("cover");
            table.dateTime("launchDate");
            table.json("trailers");
            table.json("genres");
            table.string("description");
            table.string("summary");
            table.decimal("popularity", 100, 2);
            table.json("screenshots");
        })
    }
}

initDB();
app.use(routes);
app.listen(8080, () => {
    console.log("Servidor Iniciado. Porta 8080")
})