const ID = require('./idGenerator')
let sendNotify = require('./observerNotification')

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
            sendNotify(this.id,album.name)
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
    
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            albums: this.albums,
            country: this.country,
        }
    }
}


module.exports = Artista