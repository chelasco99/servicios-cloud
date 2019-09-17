const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  unqfy.save(filename);
}

/*
 En esta funcion deberán interpretar los argumentos pasado por linea de comandos
 e implementar los diferentes comandos.

  Se deberán implementar los comandos:
    - Alta y baja de Artista
    - Alta y Baja de Albums
    - Alta y Baja de tracks

    - Listar todos los Artistas
    - Listar todos los albumes de un artista
    - Listar todos los tracks de un album

    - Busqueda de canciones intepretadas por un determinado artista
    - Busqueda de canciones por genero

    - Dado un string, imprimmir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado.

    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro.

  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)

*/

function handleError(e){
  console.log(e.message)
}

function addArtist(name, country) {
  const unqfy = getUNQfy()
  try {
      unqfy.addArtist({name,country});
  }
  catch(e) {
    if(e.name === 'ArtistExistError'){
      handleError(e)
    }else{
      throw e
    }
  }
  saveUNQfy(unqfy)
}

function addAlbum(artistName,albumName,albumYear){
  const unqfy = getUNQfy()
  try{
    unqfy.addAlbum(artistName,{name:albumName,year:albumYear})
  }
  catch(e){
   if(e.name === "AlbumExistError"){
      handleError(e)
   }else{
     throw e
   } 
  }
  saveUNQfy(unqfy)
}

function addTrack(artistName,albumName,trackName,trackDuration,trackGenre){
  const unqfy = getUNQfy()
  try{
    unqfy.addTrack(artistName,albumName,{name:trackName,duration:trackDuration,genres:trackGenre})
  }
  catch(e){
    if(e.name === "TrackExistError"){
      handleError(e)
    }else{
      throw e
    }
  }
  saveUNQfy(unqfy)
}

function createPlaylist(name,maxDuration,genresToInclude){
  const unqfy = getUNQfy()
  unqfy.createPlaylist(name,genresToInclude,maxDuration)
  saveUNQfy(unqfy)
}

function allArtist(){
  const unqfy = getUNQfy()
  console.log(unqfy.artists)
}

function allAlbums(){
  const unqfy = getUNQfy()
  console.log(unqfy.getAllAlbums())
}

function allTracks(){
  const unqfy = getUNQfy()
  console.log(unqfy.getAllTracks())
}

function allPlaylist(){
  const unqfy = getUNQfy()
  console.log(unqfy.playlists)
}

function albumsByArtistName(artistName){
  const unqfy = getUNQfy()
  console.log(unqfy.getAlbumsByArtistName(artistName))
}

function tracksByArtistName(artistName){
  const unqfy = getUNQfy()
  try{
    console.log(unqfy.getTracksMatchingArtist({name : artistName}))
  }catch(e) {
    if(e.name === 'ArtistExistError'){
      handleError(e)
    }else{
      throw e
    }
  }
}

function tracksByGenreName(genreName){
  const unqfy = getUNQfy()
  console.log(unqfy.getTracksMatchingGenres([genreName]))
}

function searchByName(name){
  const unqfy = getUNQfy()
  console.log(unqfy.searchByName(name))
}

function removeTrack(artistName,trackName){
  const unqfy = getUNQfy()
  try{
    unqfy.removeTrack({name:artistName},trackName)
  }catch(e){
    if(e.name === "TrackDontExistError"){
      handleError(e)
    }else{
      throw e
    }
  }
  saveUNQfy(unqfy)
}

function removeAlbum(artistName,trackName){
  const unqfy = getUNQfy()
  try{
    unqfy.removeAlbum({name:artistName},trackName)
  }catch(e){
    if(e.name === "AlbumDontExistError"){
      handleError(e)
    }else{
      throw e
    }
  }
  saveUNQfy(unqfy)
}

function removeArtist(artistName){
  const unqfy = getUNQfy()
  try{
    unqfy.removeArtist({name:artistName})
  }catch(e){
    if(e.name === "ArtistDontExistError"){
      handleError(e)
    }else{
      throw e
    }
  }
  saveUNQfy(unqfy)
}

function main() {
  console.log('arguments: ');
  process.argv.forEach(argument => console.log(argument));

  const params = process.argv.slice(2)
  const nombreComando = params[0]

  if(nombreComando == 'addArtist'){
    return addArtist(params[1],params[2])
  }
  if(nombreComando == 'addAlbum'){
    return addAlbum(params[1],params[2],params[3])
  }
  if(nombreComando == 'addTrack'){
    return addTrack(params[1],params[2],params[3],params[4],params[5])
  }
  if(nombreComando == 'allArtist'){
    return allArtist()
  }
  if(nombreComando == 'allAlbums'){
    return allAlbums()
  }
  if(nombreComando == 'allTracks'){
    return allTracks()
  }
  if(nombreComando == 'tracksByArtistName'){
    return tracksByArtistName(params[1])
  }
  if(nombreComando == 'tracksByGenreName'){
    return tracksByGenreName(params[1])
  }
  if(nombreComando == 'removeTrack'){
    return removeTrack(params[1],params[2])
  }
  if(nombreComando == 'removeAlbum'){
    return removeAlbum(params[1],params[2])
  }
  if(nombreComando == 'removeArtist'){
    return removeArtist(params[1])
  }
  if(nombreComando == 'searchByName'){
    return searchByName(params[1])
  }
  if(nombreComando == 'albumsByArtistName'){
    return albumsByArtistName(params[1])
  }
  if(nombreComando == 'createPlaylist'){
    return createPlaylist(params[1],params[2],params.slice(2))
  }
  if(nombreComando == 'allPlaylist'){
    return allPlaylist()
  }
}

main();
const unqfy = getUNQfy()
