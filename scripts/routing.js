const moment = require("moment");
const axios = require("axios").default;
const igdb = require("igdb-api-node");
const router = require("express").Router();
const database = require("./database");
const { Game } = require("./model");
const fs = require("fs");

const ClientID = process.env.SWITCHDB_ACCESS;
const ClientSecret = process.env.SWITCHDB_SECRET;
const TableName = process.env.SWITCHDB_TABLE || "games";

const tokenURL = `https://id.twitch.tv/oauth2/token?client_id=${ClientID}&client_secret=${ClientSecret}&grant_type=client_credentials`;

router.get("/register/:id", async (req, resp, next) => {
    let g = new Game();
    const search = req.params.id

    const AccessToken = await axios.post(tokenURL)
        .then(resp => resp.data)
        .then(data => data?.access_token);

    const client = igdb.default(ClientID, AccessToken);

    const baseGame = await client
        .fields(["name", "artworks", "category", "cover", "franchise", "genres", "rating", "first_release_date", "screenshots", "storyline", "summary", "videos", "involved_companies"])
        .where("id = " + search)
        .request("/games")
        .then(resp => resp.data[0])
        .then(game => {
            g = new Game(game.id, game.name, game.storyline, game.summary, game.rating, game.first_release_date);
            return game;
        })

    try {
        g.screenshots = await client.fields("url")
            .where("id = (" + (baseGame.screenshots || []).toString() + ")")
            .request("/screenshots")
            .then(resp => resp.data.map(d => "https:" + d.url.replace("thumb", "720p")))
            .then(resp => JSON.stringify(resp));
    } catch(e){
        console.error(e);
    }
    
    try {
        g.trailers = await client.fields("video_id")
            .where("id = (" + (baseGame.videos || []).toString() + ")")
            .request("/game_videos")
            .then(resp => resp.data.map(d => d.video_id))
            .then(resp => JSON.stringify(resp));
    } catch(e){
        console.error(e);
    }
    
    try {
        g.genres = await client.fields("name")
            .where("id = (" + (baseGame.genres || []).toString() + ")")
            .request("/genres")
            .then(resp => resp.data.map(d => d.name))
            .then(resp => JSON.stringify(resp));
    } catch(e){
        console.error(e);
    }
        
    try {
        g.cover = await client.fields("url")
            .where("id = (" + (baseGame.cover || []).toString() + ")")
            .request("/covers")
            .then(resp => resp.data.map(d => "https:" + d.url.replace("thumb", "720p"))[0])
    } catch(e){
        console.error(e);
    }

    await database.insert(g).into(TableName)
    resp.json(g);
    return next();
})

router.get("/search", async (req, resp, next) => {
    const base = req.protocol + "://" + req.get("Host") + "/register/";
    const AccessToken = await axios.post(tokenURL)
        .then(resp => resp.data)
        .then(data => data?.access_token);

    const client = igdb.default(ClientID, AccessToken);
    const body = await client.search(req.query.q)
        .fields(["name", "cover.url"])
        .request("/games")
        .then(resp => resp.data)
        .then(resp => resp.map(d => ({ 
            ...d, 
            url: base + d.id,
            cover: "https:" + (d.cover || {}).url || null
        })));

    resp.json(body);
    return next();
})

router.get("/delete/:id", async (req, resp, next) => {
    await database.delete().from(TableName).where("id", req.params.id);
    resp.json({ msg: "Deleted" });
    return next();
})

router.get("/", async (req, resp, next) => {
    const games = await database.select("id", "cover").from(TableName);
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
    const { 0: game } = await database.select("*").from(TableName).where("id", id);
    const template = fs.readFileSync("./templates/page.htm").toString()
        .replace("{{ title }}", game.name)
        .replace("{{ gametitle }}", game.name)
        .replace("{{ cover }}", game.cover)
        .replace("{{ date }}", moment(game.launchDate).format("MM/YYYY"))
        .replace("{{ popularity }}", (parseFloat(game.popularity) || 0).toFixed(2))
        .replace("{{ genres }}", JSON.parse(game.genres || "[]").map(g => `<li>${g}</li>`).join(""))
        .replace("{{ description }}", game.description || "Não Informada")
        .replace("{{ summary }}", game.summary || "Não Informado")
        .replace("{{ videos }}", JSON.parse(game.trailers || "[]").map(v => {
            return `<li class='embed-container'><iframe src="https://www.youtube-nocookie.com/embed/${v}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></li>`
        }).join(""))
        .replace("{{ images }}", JSON.parse(game.screenshots || "[]").map(i => `<a href="${i}" target="_blank"><li><img src="${i}"></li></a>`).join(""))

    resp.setHeader("Content-Type", "text/html")
    resp.send(template);
    return next();
})

module.exports = router;
