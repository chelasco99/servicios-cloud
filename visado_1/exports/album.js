const ID = require('./idGenerator')

class Album {
    constructor(artistID,name,year){
        this.id = ID()
        this.artistID = artistID
        this.name = name
        this.year = year
        this.tracks = []
    }

    addTrack(trackName){
        if(!this.tracks.includes(trackName)){
          this.tracks.push(trackName)
        } else{
            throw Error("El album ya tiene ese track")
        }
    }

    hasTrack(trackName){
        return this.tracks.find(track => track.name === trackName) !== undefined
    }

    hasTrackByName(trackName){
        return this.tracks.filter(track => track.name.includes(trackName))
    }
}

let album = new Album("q54gueter","Dasd", 1990)
console.log(album)

module.exports = Album