const ID = require('./idGenerator')

class Artista{

    constructor(name,country){
      this.artistID = ID()
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
        return this.albums.includes(albumName)
    }

    removeAlbum(album){
        this.albums.pop(album)
    }
}


module.exports = Artista  