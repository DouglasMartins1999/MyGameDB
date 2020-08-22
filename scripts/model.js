class Game {
    constructor(id, name, description, summary, popularity, date){
        this.id = id;
        this.name = name;
        this.cover = undefined;
        this.launchDate = new Date(date * 1000);
        this.trailers = null;
        this.genres = null;
        this.description = description;
        this.summary = summary;
        this.popularity = popularity;
        this.screenshots = null;
    }
}

module.exports = { Game }