class Artista{
    constructor(_artistName,_artistCountry){
      this.id = "nuevo id <----- codigo para nuevo id? algo que genere nuevos ids"
      this.name = _artistName
      this.country = _artistCountry
      this.albums = []
    }
    addAlbum(albumName){
        if(!this.albums.includes(albumName)){
            this.albums.push(albumName)
        } else{
            throw Error("El nombre del album ya existe")
        }
    }

    hasAlbum(albumName){
        return this.albums.includes(albumName)
    }
}


module.exports = Artista  