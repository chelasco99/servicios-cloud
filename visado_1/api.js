let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let router = express.Router()
let fs = require('fs'); // para cargar/guarfar unqfy
let unqmod = require('./unqfy');
let errors = require('./apiErrors.js')
let controllers = require('./controllers.js')


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

//INSTANCIA DE UNQFY
let unqfy = getUNQfy();
let artistController = new controllers.ArtistController()
let albumController = new controllers.AlbumController()

app.use(bodyParser.json())
app.use('/api',router)

// INVALID ROUTES

app.post('*', function(req, res) {
    const not_found = new errors.ResourceNotFound()
    res.status(404)
    res.json({status: not_found.status, errorCode: not_found.errorCode})
});

app.get('*', function(req, res) {
    const not_found = new errors.ResourceNotFound()
    res.status(404)
    res.json({status: not_found.status, errorCode: not_found.errorCode})
});

app.delete('*', function(req, res) {
    const not_found = new errors.ResourceNotFound()
    res.status(404)
    res.json({status: not_found.status, errorCode: not_found.errorCode})
});

app.put('*', function(req, res) {
    const not_found = new errors.ResourceNotFound()
    res.status(404)
    res.json({status: not_found.status, errorCode: not_found.errorCode})
});

app.patch('*', function(req, res) {
    const not_found = new errors.ResourceNotFound()
    res.status(404)
    res.json({status: not_found.status, errorCode: not_found.errorCode})
});

//

router.route('/artists').get((req,res)=>{
    // if(req.query.name){ 
    //     let artists = unqfy.searchArtistsByName(req.query.name.toLowerCase())
    //     artists = artists.map(artist=> artist.toJSON())
    //     res.json(artists)
    // }    
    // else{
    //     const artists = unqfy.artists
    //     let jsonArtists = artists.map(artist => artist.toJSON())
    //     res.json(jsonArtists)
    // }  
    let unqfy = getUNQfy()
    if(req.query.name){
        let artists = artistController.getArtistsByName(unqfy,req.query.name)
        res.json(artists)
    }else{
        res.json(artistController.getAllArtists(unqfy))
    }  
})

router.route('/artists/:id').put((req,res)=> {
    // try{
    //     let artist = unqfy.updateArtist(req.params.id,req.body)
    //     res.status(200)
    //     res.json({
    //         id: artist.id,
    //         name: artist.name,
    //         country: artist.country,
    //         albums: artist.albums
    //     })
    //     saveUNQfy(unqfy, 'data.json')
    // }catch(e) {
    //     let error = new errors.ResourceNotFound()
    //     res.status(error.status)
    //     res.json({
    //         status: error.status,
    //         errorCode:error.errorCode  
    //     })
    // } 
    let unqfy = getUNQfy()
    let artist = artistController.updateArtist(unqfy,res,req.params.id,req.body)
    saveUNQfy(unqfy,'data.json')

})
router.route('/artists').post((req,res)=>{
    // try{
    //     console.log(req.body)
    //     let artist = unqfy.addArtist({name:req.body.name,country:req.body.country})
    //     saveUNQfy(unqfy,'data.json')
    //     res.status(201)
    //     res.json({
    //         id: artist.id,
    //         name: artist.name,
    //         country: artist.country,
    //         albums: artist.albums
    //     })
    // }catch(e){
    //     let error = new errors.DuplicateEntitie()
    //     console.log('Ocurrio un error ',e.message)
    //     res.status(error.status)
    //     res.json({
    //         status: error.status,
    //         errorCode:error.errorCode  
    //     })
    // }
    let unqfy = getUNQfy()
    artistController.createArtist(unqfy,req,res)
    saveUNQfy(unqfy,'data.json')
})

router.route('/artists/:id').get((req,res)=>{
//     const id = req.params.id
//    try{
//     const artist = unqfy.getArtistById(id)
//     res.status(200)
//     res.json(artist)
//    }catch(e){
//       let error = new errors.ResourceNotFound()
//       res.status(error.status)
//       res.json({
//           status: error.status,
//           errorCode: error.errorCode
//       })
//    }
     let unqfy = getUNQfy()
     artistController.getArtistById(unqfy,req,res)
})

router.route('/artist/:id').patch((req,res)=>{
//    try{ 
//     const id = req.params.id
//     const body = req.body
//     const artist = unqfy.getArtistById(id)
//     artist.name = body.name
//     artist.country = body.country
//     saveUNQfy(unqfy,'data.json')
//     res.status(200)
//     res.json(artist)
//    }catch(e){
//        let error = new errors.DuplicateEntitie()
//        res.status(error.status)
//        res.json({
//            status: error.status,
//            errorCode: error.errorCode
//        })
//    } 
    let unqfy = getUNQfy()
    let artist = artistController.updateArtist(unqfy,res,req.params.id,req.body)
    saveUNQfy(unqfy,'data.json')
})



router.route('/artists/:id').delete((req,res)=>{
    // console.log(req.params.id)
    // try{
    //   let artist = unqfy.getArtistById(req.params.id)
    //   console.log(artist.name)
    //   unqfy.removeArtist(artist)
    //   saveUNQfy(unqfy,'data.json')
    //   res.status(204)
    // } catch(e){
    //     console.log(e)
    //     let error = new errors.ResourceNotFound()
    //     res.status(error.status)
    //     res.json({
    //         status: error.status,
    //         errorCode: error.errorCode
    //     })
    // }
    let unqfy = getUNQfy()
    artistController.deleteArtist(unqfy,req,res)
    saveUNQfy(unqfy,'data.json')
})

////Albums///

router.route('/albums').post((req,res)=>{  
    // try{
    //     let artist = artistController.unqfy.getArtistById(req.body.artistId)
    //     let album = artistController.unqfy.addAlbum(artist.name,{artistId:artist.id,name:req.body.name,year:req.body.year})
    //     console.log(album)
    //     saveUNQfy(artistController.unqfy,'data.json')
    //     res.status(201)
    //     res.json(album)
    // }catch(e){
    //     let error = new errors.DuplicateEntitie()
    //     console.log('Ocurrio un error ',e.message)
    //     res.status(error.status)
    //     res.json({
    //         status: error.status,
    //         errorCode:error.errorCode  
    //     })
    // }
    let unqfy = getUNQfy()
    albumController.createAlbum(unqfy,req,res)
    console.log(unqfy.artists)
    saveUNQfy(unqfy,'data.json')
})

router.route('/albums/:id').get((req,res)=>{
    let unqfy = getUNQfy()
    
    albumController.getAlbumById(unqfy,req,res)
})

///Actualizo el año de un album
router.route('/album/:id').patch((req,res)=>{
    let unqfy = getUNQfy()
    // const id = req.params.id
    // const body = req.body
    // const album = unqfy.getAlbumById(id)
    // album.year = body.year
    // saveUNQfy(unqfy,'data.json')
    // res.status(200)
    // res.json(album)
    albumController.updateAlbum(unqfy,req,res)
    saveUNQfy(unqfy,'data.json')
})

router.route('/albums/:id').delete((req,res)=>{
    let unqfy = getUNQfy()
    // try{ 
    //     const id = req.params.id
    //     const album = unqfy.getAlbumById(id)
    //     const artist = unqfy.getArtistById(album.artistID)
    //     unqfy.removeAlbum(artist,album.name)
    //     saveUNQfy(unqfy,'data.json')
    //     res.status(204)
    //     res.json(artist)
    // }catch(e){
    //     let error = new errors.ResourceNotFound()
    //     console.log('Ocurrio un error',e)
    //     res.status(error.status)    
    // }
    albumController.deleteAlbum(unqfy,req,res)
})

router.route('/albums').get((req,res)=>{
    let unqfy = getUNQfy()
    if(req.query.name){
        // try{
        //     let albums = unqfy.searchAlbumsByName(req.query.name)
        //     res.json(albums)
        // }catch(e){
        //     let error = new errors.ResourceNotFound()
        //     res.status(error.status)
        //     res.json(error)
        // }
        let albums = unqfy.searchAlbumsByName(req.query.name)
        res.json(albums)
    }else{
        let albums = unqfy.getAllAlbums()
        res.json(albums.map(album => album.toJSON()))
    }    
})

/// Track ///

router.route('/tracks/:id/lyrics').get((req,res)=>{
    let unqfy = getUNQfy()
    let idTrack = req.params.id
    try{
        let track = unqfy.getTrackById(idTrack)
         if(track.lyrics === ""){
           let letra = unqfy.getLyricsForTrackId(idTrack)
           res.status(200)
           letra.then(()=>{
            unqfy.save('data.json')
            res.json({
            Name: track.name,
            lyrics : track.getLyrics()
            })
           })
         }else{
             res.status(200)
             res.json({
                 Name: track.name,
                 lyrics: track.getLyrics()
             })
         }
    }catch(e){
        let error = new errors.ResourceNotFound()
        res.status(error.status)
        res.json({
            status: error.status,
            errorCode: error.errorCode
        })
    }
})

/// PLAYLISTS ///

router.route('/playlists').post((req,res) => {
    try{
        console.log(req.body)
        let playlist = unqfy.createPlaylist({name:req.body.name,genre:req.body.genresToInclude,max:req.body.maxDuration})
        res.status(201)
        res.json({
            playlistId: playlist.playlistId,
            name: playlist.name,
            genres: playlist.genres,
            tracks: playlist.tracks,
            maxDuration: playlist.max,
            currentDuration: playlist.currentDuration
        })
        saveUNQfy(unqfy,'data.json')
        }
        catch(e){
             let error = new errors.DuplicateEntitie()
             console.log('Ocurrio un error ',e.message)
             res.status(error.status)
             res.json({
                 status: error.status,
                 errorCode:error.errorCode  
             })
         }
})


router.route('/playlists/:id').get((req,res) => {
    let id = req.params.id
    let playlist = unqfy.getPlaylistById(id)
    res.status(200)
    res.json(playlist)
    
})


//No anda 
router.route('playlists').get((req,res)=> {
    if(req.query.name != undefined & req.body.durationLT < 300 & req.body.durationGT > 100){
        try{
            let playlist = unqfy.getPlaylistByNameDuration(req.query.name,req.body.durationLT,req.body.durationGT)
            res.json(playlist)
        }catch(e){
            let error = new errors.ResourceNotFound()
            res.status(error.status)
            res.json(error)
        }
    } 
})



app.listen(8000, ()=>{
    console.log('Servidor corriendo en el puerto 8000')
})
