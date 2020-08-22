const app = require("express")();
const database = require("./scripts/database");
const routes = require("./scripts/routing");
const port = process.env.PORT || 8080;

async function initDB(){
    const hasTable = await database.schema.hasTable("games")
    if(!hasTable){
        await database.schema.createTable("games", (table) => {
            table.integer("id").primary();
            table.string("name");
            table.string("cover");
            table.dateTime("launchDate");
            table.text("trailers");
            table.text("genres");
            table.text("description");
            table.text("summary");
            table.decimal("popularity", 100, 2);
            table.text("screenshots");
        })
    }
}

initDB();
app.use(routes);
app.listen(port, () => {
    console.log("Servidor Iniciado. Porta 8080")
})