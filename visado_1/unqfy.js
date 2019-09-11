
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artista = require('./exports/artist.js')
const Album = require('./exports/album.js')
const Track = require('./exports/track.js')
const ID = require('./exports/idGenerator')
const ArtistExistError = require('./exports/errors/artistError')
const AlbumExistError = require('./exports/errors/albumExistError')


class UNQfy {
  
    constructor () {
      this.artists = [] ;
      this.playLists = [] ;
    }

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  
  addArtist(artistData) {
   if(!this.existArtist(artistData.name)){ 
    let artist = new Artista(artistData.name,artistData.country)
    this.artists.push(artist)
    console.log('Se ha agregado el artista ' + artistData.name + ' con el id ' + artist.id)
    return artist
   } else{
      throw new ArtistExistError()
   } 
  
    
  /* Crea un artista y lo agrega a unqfy.
  El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */
  }


  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
  /* Crea un album y lo agrega al artista con id artistId.
    El objeto album creado debe tener (al menos):
     - una propiedad name (string)
     - una propiedad year (number)
  */
    let artist = this.getArtistById(artistId)
    if(!artist.hasAlbumName(albumData.name)){
      let album = new Album(artistId,albumData.name, albumData.year)
      artist.albums.push(album)
      console.log('Se ha agregado el album con nombre' + album.name)
      return album
    }else{
      throw new AlbumExistError()
    }
  }


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
  }

  getArtistById(id) {
      let artist = this.artists.find(artist => artist.id === id)
      if(artist !== undefined){
        return artist
      }
      else{
        throw Error("No se encontro un artista con el id" + id)
      }
  }

  getAlbumById(id) {

  }

  getTrackById(id) {

  }

  getPlaylistById(id) {

  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {

  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

  }


  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */

  }

  existArtist(artistName){
    return this.artists.find(artist => artist.name === artistName) !== undefined
  }

  existAlbum(albumName){
    return this.artists.albums.find(album => album.name === albumName) !== undefined
  }

  save(filename) {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy,Artista,ID,Album];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

