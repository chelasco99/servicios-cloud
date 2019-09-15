const ID = require('./idGenerator')

class Artista{

    constructor(name,country){
      this.id = ID()
      this.name = name
      this.country = country
      this.albums = []
    }

    addAlbum(album){
        if(!this.albums.includes(album)){
            this.albums.push(album)
        } else{
            throw Error("El album ya existe")
        }
    }

    hasAlbumName(albumName){
        return this.albums.find(album => album.name === albumName) !== undefined
    }

    removeAlbum(album){
        this.albums.pop(album)
    }

    getTracks(){
        let artistTracks = []
        this.albums.forEach(function(elem){
            let tracks = elem.getTracks()
            artistTracks = artistTracks.concat(tracks)
        });
        return artistTracks
    }

    searchAlbumsByName(name){
        return this.albums.filter(alb => alb.name.includes(name))
    }
    
}


module.exports = Artista