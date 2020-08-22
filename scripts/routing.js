const database = require("./database");
const Game = require("./model").Game;
const moment = require("moment");
const router = require("express").Router();
const igdb = require("igdb-api-node");
const fs = require("fs");

const client = igdb.default("***REMOVED***");

router.get("/", async (req, resp, next) => {
    const games = await database.select("id", "cover").from("games");
    games.sort((a, b) => {
        return 0.5 - Math.random()
    })

    const template = fs.readFileSync("./templates/index.htm").toString()
        .replace("{{ replace }}", games.map(i => `<a href="/${i.id}"><li><img src='${i.cover}'></li></a>`).join(""));

    resp.setHeader("Content-Type", "text/html")
    resp.send(template);
    return next();
})

router.get("/:id", async (req, resp, next) => {
    const id = req.params.id;
    const { 0: game } = await database.select("*").from("games").where("id", id);

    const template = fs.readFileSync("./templates/page.htm").toString()
        .replace("{{ title }}", game.name)
        .replace("{{ cover }}", game.cover)
        .replace("{{ date }}", moment(game.launchDate).format("MM/YYYY"))
        .replace("{{ popularity }}", game.popularity.toFixed(2))
        .replace("{{ genres }}", game.genres.split(",").map(g => `<li>${g}</li>`))
        .replace("{{ description }}", game.description || "Não Informada")
        .replace("{{ summary }}", game.summary || "Não Informado")
        .replace("{{ videos }}", game.trailers.split(",").map(v => {
            return `<li class='embed-container'><iframe src="https://www.youtube-nocookie.com/embed/${v}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></li>`
        }).join(""))
        .replace("{{ images }}", game.screenshots.split(",").map(i => `<a href="${i}" target="_blank"><li><img src="${i}"></li></a>`).join(""))

    resp.setHeader("Content-Type", "text/html")
    resp.send(template);
    return next();
})

router.get("/register/:id", async (req, resp, next) => {
    let g = new Game();
    const search = req.params.id

    const baseGame = await client.search(search)
        .fields(["name", "artworks", "category", "cover", "franchise", "genres", "rating", "first_release_date", "screenshots", "storyline", "summary", "time_to_beat", "videos", "involved_companies"])
        .request("/games")
        .then(resp => resp.data[0])
        .then(game => {
            g = new Game(game.id, game.name, game.storyline, game.summary, game.rating, game.first_release_date);
            return game;
        })

    g.screenshots = await client.fields("url")
        .where("id = (" + baseGame.screenshots.toString() + ")")
        .request("/screenshots")
        .then(resp => resp.data.map(d => "https:" + d.url.replace("thumb", "720p")));

    g.trailers = await client.fields("video_id")
        .where("id = (" + baseGame.videos.toString() + ")")
        .request("/game_videos")
        .then(resp => resp.data.map(d => d.video_id));

    g.genres = await client.fields("name")
        .where("id = (" + baseGame.genres.toString() + ")")
        .request("/genres")
        .then(resp => resp.data.map(d => d.name)[0])

    g.cover = await client.fields("url")
        .where("id = (" + baseGame.cover.toString() + ")")
        .request("/covers")
        .then(resp => resp.data.map(d => "https:" + d.url.replace("thumb", "720p"))[0])

    await database.insert(g).into("games")
    resp.json(g);
    return next();
})

module.exports = router;