const ID = require('./idGenerator')

class Track{
    constructor(albumId,name,duration,genres){
        this.id = ID()
        this.albumId = albumId
        this.name = name
        this.duration = duration
        this.genres = genres
        this.lyrics = ""
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

    hasAtLeastOne(genresNames){
        return genresNames.some(genre => this.genres.indexOf(genre) >= 0)
    }
    
    getDuration(){
        return this.duration
    }

    getLyrics(){
        if(this.lyrics != ""){
            return this.lyrics
        }
        return "Este track no tiene letra asignada todavía"
    }

    saveLyrics(lyrcis){
        this.lyrics = lyrcis
    }

    hasLyrics(){
        return this.lyrics !== ""
    }
}

module.exports = Track