# cloud-grupo 5

Instrucciones para el uso de comandos por consola.

 --- ARTISTAS

  --- Agregar artista:
   
    - addArtist  'nombreDelArtista' 'paisDeOrigen'    
      Agrega el artista con el nombre 'nombreDelArtista'.
    
    - Aclaracion: Los nombres de los artistas NO pueden repetirse. No se agregaran artistas cuyo nombre ya exista en el sistema.

  --- Eliminar artista:

    - removeArtist  'nombreDelArtista'
       Elimina el artista cuyo nombre coincida con el parámetro 'nombreDelArtista'.

  --- Mostrar artista: 

    - allArtist
       Muestra todos los artistas del sistema.

 --- ALBUMS

  --- Agregar album:    

    - addAlbum 'nombreDelArtista' 'nombreDelAlbum' 'añoDelAlbum'
        Agrega el album con nombre 'nombreDelAlbum' al artista cuyo nombre coincida con 'nombreDelArtista'.
    - Aclaracion: Un artista NO puede tener dos albumes con el mismo nombre. Para agregarle un album a un artista, el mismo DEBE existir
 
  --- Eliminar un album:

    - removeAlbum 'albumName' 'artistName'
       Elimina el album 'albumName' del artista cuyo nombre coincida con 'artistName'

 --- Listar albums:

   - allAlbums
      Muestra los nombres de todos los albums con su respectivo artista

 --- Ver los albums de un artista

   - albumsByArtistName 'artistName'
      Muestra todos los albums del artista 'artistName'

 --- TRACKS

  --- Agregar un track: 

   - addTrack 'artistName' 'albumName' 'trackName' 'trackDuration' 'trackGenres'
      Agrega un track al album 'albumName' del artista 'artistName'. Se deben indicar el nombre del track, la duracion en minutos y los generos a los que pertenece.

 --- Eliminar un track

   - removeTrack 'trackName' 'artistName'

      Elimina el track 'trackName' del artista 'artistName'. El track se eliminara del correspondiente album y tambien de las playlists que lo incluyan.

 --- Listar track
   
   - allTracks
      Muestra todos los artistas del sistema
 
  --- Ver los tracks de un album
 
   - tracksByAlbumAndArtistName 'albumName' 'artistName'
      Muestra todos los tracks del album 'albumName' del artista 'artistName'
 
 
  --- Ver los tracks de un artista
 
   - tracksByArtistName 'artistName'
      Muestra todos los tracks del artista 'artistName' sin importar a qué album pertenecen.
 
  --- Ver los tracks de un genero
 
   - tracksByGenreName 'genre'
      Muestra todos los tracks que pertenezcan al género 'genre'
 
 --- BUSCAR POR NOMBRE
  
   - searchByName 'name'
      Muestra todos los resultados que coincidan con el nombre 'name' (artistas, albumes, tracks y playlists).
 
 --- PLAYLIST
  --- Crear playlist:

    - createPlaylist 'name' ['genres'] 'duration'
       Crea una playlist con el nombre 'name' que incluye temas que pertenezcan a los géneros de la lista genres
       La playlist tendrá como máximo la duración indicada en el parámetro 'duration'

  --- Mostrar playlist:
    
    - allPlaylist
       Muestra todas las playlist del sistema 