class Track{
    constructor(albumId,name,duration,genre){
        this.id = albumId
        this.name = name
        this.duration = duration
        this.genres = genre
    }
    addGenre(genreName){
        if(!this.genres.includes(genreName)){
            this.genres.push(genreName)
        } else{
            throw Error("El track ya tiene ese genero")
        }
    }

    hasGenre(genreName){
        return this.genres.includes(genreName)
    }

    hasAtLeatsOne(genresNames){
        return genresNames.some(genre => this.genres.indexOf(genre) >= 0)
    }
}

module.exports = Track