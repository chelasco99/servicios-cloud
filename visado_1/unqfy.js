const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artista = require('./exports/artist.js')
const Album = require('./exports/album.js')
const Track = require('./exports/track.js')
const ID = require('./exports/idGenerator')
const ArtistExistError = require('./exports/errors/artistError')
const AlbumExistError = require('./exports/errors/albumExistError')
const Playlist = require('./exports/playlist.js')
const AlbumDontExistError = require('./exports/errors/albumDontExistError')
const ArtistDontExistError = require('./exports/errors/artistDontExistError')
const TrackExistError = require('./exports/errors/trackExistError')

class UNQfy {
  
    constructor () {
      this.artists = [] ; //Todos los artistas del sistema
      this.playlists = [] ; // Todas las playlist del sistema
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
  addAlbum(artistName, albumData) {
  /* Crea un album y lo agrega al artista con id artistId.
    El objeto album creado debe tener (al menos):
     - una propiedad name (string)
     - una propiedad year (number)
  */
    let artist = this.getArtistByName(artistName)
    if(!artist.hasAlbumName(albumData.name)){
      let album = new Album(artist.id,albumData.name, albumData.year)
      artist.albums.push(album)
      console.log('Se ha agregado el album con nombre ' + album.name + ' al artista ' + artistName)
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
  addTrack(artistName,albumName, trackData) {
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
    if(!this.existArtist(artistName)){
      throw new ArtistDontExistError()
    }
    let album = this.getAlbumByNameAndArtistID(albumName,this.getArtistByName(artistName).id)
    if(album !== undefined){
     if(!album.hasTrack(trackData.name)){
      let track = new Track(album.id,trackData.name,trackData.duration,trackData.genres)
      album.addTrack(track)
      console.log("Se ha agregado el track con nombre " + trackData.name+ " al album con nombre " + album.name + " del artista " + artistName)
      return track
     } else{
       throw new TrackExistError()
       }
    } else{
       throw new AlbumDontExistError("El Album no existe en el sistema")
      } 
  }

  addPlaylist(playList){
    this.playlists.push(playList)
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
      let allTracks = this.getAllTracks()
      let tracksToPlay = allTracks.filter(track => track.hasAtLeastOne(genresToInclude))
      let playlist = new Playlist(name,genresToInclude,maxDuration)
      playlist.addTracks(tracksToPlay)
      this.playlists.push(playlist)
      console.log("Se creo la playlist " + playlist.name + " correctamente")
      return playlist
    }

  getArtistById(id) {
      // Retorna al artista con id indicando si es que existe
      let artist = this.artists.find(artist => artist.id === id)
      if(artist !== undefined){
        return artist
      }
      else{
        throw Error("No se encontro un artista con el id " + id)
      }
  }

  getAlbumById(id) {
    // Retorna al album con el id indicado, si es que existe
    let albumes = this.getAllAlbums()
    let album = albumes.find(album => album.id === id)
    if(album !== undefined){
      return album
    }else{
      throw Error("No existe un album con ese id ")
    }

  }

  getTrackById(id) {
    // retorna al track con el id indicado si es que existe
    let allTracks = this.getAllTracks()
    let track = allTracks.find(track => track.id === id)
    if (track !== undefined) {
      return track
    }else{
      throw Error("No existe el track con ese id " + id)
    }
  }

  getPlaylistById(id) {
    // retorna la playlist con el id indicado, si es que existe
    let playList = this.playlists.find(playlist => playlist.playlistId == id)
    if ( playList !== undefined) {
      return playList
    }else {
      throw Error("No existe la playList con ese id " + id)
    }
  }

  // getPlaylistByNameDuration(name,durationLT,durationGT) {
  //   let playlistsName = this.playlists.filter(playlist => playlist.name == name)
  //   if (playlistsName !== undefined ) {
  //     let playlist = playlistsName.filter(playlist => playlist.maxDuration < durationLT && playlist.maxDuration > durationGT )
  //       if ( playlist !== undefined) {
  //         return playlist
  //     }else{
  //       throw Error("No existe las playlists con esas duraciones")
  //     }
  //   } 
  // }

  getArtistByName(artistName){
    // Retorna al artista con el nombre indicado, si es que existe
    let artist = this.artists.find(artist => artist.name.toLowerCase() === artistName.toLowerCase())
    if(artist !== undefined){
      return artist
    } else{
      throw new ArtistDontExistError()
    }
  }

  getTracksByAlbumAndArtistName(artistName,albumName){
    let artist = this.getArtistByName(artistName)
    if (artist !== undefined) {
      let album = this.getAlbumByNameAndArtistID(albumName,artist.id)
      if (album !== undefined) {
          let tracks = album.getTracks()
          return tracks
      } else {
          throw new AlbumDontExistError()
        }
    } else {
      throw new ArtistDontExistError()
    }
  }

  populateAlbumsForArtist(artistName){
    const rp = require('request-promise')
    const options = {
      url : 'https://api.spotify.com/v1/search/',
      headers: {Authorization: 'Bearer ' + 'BQCXXBSlSr1SaoCokcsD-YiAh9XaCNxi35RlpLSPOzAgfMJs9M_94X5bSFTh_QnNL1VsyqaVp8FQYJjGqwJVq72pYf03SNom2ta92fakua5CJs1yfgSyzsjkDuasp9wXuMeG8zy4oZch9SboGFt3mJRblO8yPK8Udpz2CgGi2hmrOPuoBVCT' },
      json:true,
      qs: {
        type: 'artist',
        q: artistName,
        limit: 1
      }
    }
    rp.get(options).then((response) =>{
      console.log(response.artists.items)
      console.log('ID del artista consultado :',response.artists.items[0].id)
      this.reqGetAlbumsByArtistID(artistName,response.artists.items[0].id)
    })
  }

  reqGetAlbumsByArtistID(artistName,id){
    const rp = require('request-promise')
    const options = {
      url : 'https://api.spotify.com/v1/artists/' + id + '/albums',
      headers: {Authorization: 'Bearer ' + 'BQCXXBSlSr1SaoCokcsD-YiAh9XaCNxi35RlpLSPOzAgfMJs9M_94X5bSFTh_QnNL1VsyqaVp8FQYJjGqwJVq72pYf03SNom2ta92fakua5CJs1yfgSyzsjkDuasp9wXuMeG8zy4oZch9SboGFt3mJRblO8yPK8Udpz2CgGi2hmrOPuoBVCT' },
      json:true
    }
    rp.get(options).then((response)=>{
      let albumsToAdd = [...new Set(response.items)] // Spread
      this.createAndAddAlbumsToArtist(artistName,albumsToAdd)
    })
  }

  createAndAddAlbumsToArtist(artistName,albumsToAdd){
    try {
      let artist = this.getArtistByName(artistName)
      console.log()
      albumsToAdd.map(item=> artist.addAlbum(new Album(artist.id,item.name,item.release_date.slice(0,4))))
      console.log(artist)
    }catch(e){
      if(e.name == 'ArtistDontExistError'){
        console.log(e)
      }else{
        throw e
      }
    }
  }
  getAlbumByNameAndArtistID(name, artistID) {
    return this.getAllAlbums().find(album => (album.name === name) && album.artistID === artistID)
}

  getAlbumsByArtistName(artistName){
    let artist = this.getArtistByName(artistName)
        if (artist !== undefined) {
            let albums = artist.albums
            return albums
        } else {
            throw new ArtistDontExistError()
        }
  }

  getAlbumByName(albumName){
    let albums = this.getAllAlbums()
    let album = albums.find(album => album.name === albumName)
    if(album !== undefined){
      return album
    }else{
      throw new AlbumDontExistError
    }
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    // retorna todos los tracks que tengan por lo menos uno de los generos indicados
    let allTracks = this.getAllTracks()
    let tracks = allTracks.filter(track => track.hasAtLeastOne(genres))
    return tracks 
  }

  // artistName: nombre de artista(objeto)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {
    let artist = this.artists.find(artist => artist.name === artistName.name)
    if(artist !== undefined){
      let artistTracks = artist.getTracks()
      return artistTracks
    }else{
      throw Error("No existe el artista con nombre " + artistName.name);
      
    }

  }

  getLyricsForTrackId(trackId){
    let track = this.getTrackById(trackId)
    return track.getLyrics()
  }

  getAllAlbums(){
    // retorna todos los albums del sistema
    if(this.artists.length === 0){
      return [] // Si no hay artistas simplemente muestra una lista vacia
    }
    return this.artists.map(artist => artist.albums).reduce((a,b) => {
      return a.concat(b)
    })
  }

  getAllTracks(){
    // retorna todos los tracks del sistema
    let allTracks = this.getAllAlbums().map(album => album.tracks).reduce(function (a,b) {
      return a.concat(b)
    },[])
    return allTracks
  }

  allArtist(){
    return this.names(this.artists)
  }

  allPlaylist(){
     let res = []
     this.playlists.forEach(playlist => res.push(playlist.name,playlist.duration(),this.names(playlist.tracks)))
     return res
    
  }

  searchByName(name){
    /* retorna todos los tracks, albums, artistas 
       y playlists que tengan incluido el nombre indicado e imprime sus nombres en pantalla
    */
    let tracks = this.searchTracksByName(name)
    let albums =this.searchAlbumsByName(name)
    let artists = this.searchArtistsByName(name)
    let playlists = this.searchPlaylistByName(name)
    console.log('Artistas:' + this.names(artists),
            'Albums:' + this.names(albums),
            'Tracks:' + this.names(tracks),
            'Playlists:' + this.names(playlists));
    return {artists,albums,tracks,playlists}
  }

  searchTracksByName(name){
    // retorna todos los tracks que tengan incluido el nombre indicado
    let tracks = this.getAllTracks()
    return tracks.filter(track => track.name.includes(name))
  }

  searchAlbumsByName(name){
    // retorna todos los albums que tengan incluido el nombre indicado
    let albums = this.getAllAlbums()
    return albums.filter(album => album.name.toLowerCase().includes(name.toLowerCase()))
  }
  
  searchPlaylistByName(name){
    // retorna todas los playlists que tengan incluido el nombre indicado
    return this.playlists.filter(playlist => playlist.name.includes(name))
  }

  searchArtistsByName(name){
    // retorna todos los artistas que tengan incluido el nombre indicado
    return this.artists.filter(artist => artist.name.toLowerCase().includes(name.toLowerCase()))
  }

  updateArtist(idArtist,data){
    let artista = this.getArtistById(idArtist)
    let artistName = artista.name 
    if(this.artists.every(artist=> artist.name !== data.name)){
     artista.name = data.name
     artista.country = data.country
     console.log('El artista con nombre ' + artistName + ' cambio a ' + data.name)
     return artista
    }else{
      throw new Error('El nombre ' + data.name + ' ya esta ocupado.')
    } 
  }

  removeTrack(artistName,trackName){
    /* remueve el track con el nombre indicado del artista indicado del sistema
       dejandolo consistente
    */
    let artist = this.getArtistByName(artistName.name)
    if(artist !== undefined){
      let album = artist.albums.find(album => album.hasTrack(trackName))
      if(album !== undefined){
        album.removeTrack(trackName)
        this.playlists.map(playlist => playlist.removeTrack(trackName))
        console.log("Se ha eliminado el track " + trackName + " del artista " + artistName.name + " correctamente")
      }else{
        throw Error("No se pudo eliminar el track " + trackName + " ya que no existe en ningun album")
      } 
    }else{
      throw Error("No se pudo eliminar el track " + trackName + " ya que no existe ningun el artista " + artistName)
    }
  }

  removeAlbum(artistName,albumName) {
   /* remueve el album con el nombre indicado del artista indicado del sistema
       dejandolo consistente
    */
    let artista = this.getArtistByName(artistName.name)
    if ( artista !== undefined) {
      let album = artista.albums.find(album => album.name === albumName)
      if ( album !== undefined) {
        artista.albums = artista.albums.filter(album => album.name !== albumName)
        this.playlists.map(playlist => playlist.removeAllTracksAlbum(album))
        console.log("Se ha eliminado el album " + albumName + " del artista" + artistName.name + " correctamente")
      }else {
        throw new AlbumDontExistError("No se pudo eliminar el album " + albumName + " ya que no existe")
      }
    }else {
      throw new ArtistDontExistError("No se pudo eliminar el album " + albumName +" ya que no existe el artista " + artistName.name)
    }
  }

  removeArtist(artistName){
    /* remueve el artista con el nombre indicado del sistema
       dejandolo consistente
    */
    let artist = this.getArtistByName(artistName.name)
    if(artist !== undefined){
      this.artists = this.artists.filter(art => art.name !== artist.name)
      this.playlists.map(playlist => playlist.removeArtistAlbums(artist))
      console.log("Se ha eliminado el artista " + artist.name + " correctamente")
    }else{
      throw Error("No se pudo eliminar el artista " + artistName.name +" ya que no existe")
    }
  }

  removePlaylist(playlistObject){
    let playlist = this.getPlaylistById(playlistObject.playlistId)
    if(playlist !== undefined){
      this.playlists = this.playlists.filter(p => p.name !== playlist.name)
      console.log("Se ha eliminado la playlist " + playlist.name + " correctamente")
    }else{
      throw Error("No se pudo eliminar la playlist" + playlist.name + "ya que no existe")
    }
  }

  existArtist(artistName){ // retorna si existe el artista con el nombre indicado
    return this.artists.find(artist => artist.name === artistName) !== undefined
  }

  names(items){
    return items.map(item => item.name)
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
    const classes = [UNQfy,Artista,ID,Album,Track,Playlist];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};
