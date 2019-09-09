class Album {
    constructor(_artistId,_albumName,_albumYear){
        this.id = _albumId
        this.name = _albumName
        this.year = _albumYear
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
        return this.tracks.includes(trackName)
    }
}

module.exports = Album