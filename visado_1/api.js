let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let router = express.Router()
let fs = require('fs'); // para cargar/guarfar unqfy
let unqmod = require('./unqfy');
let errors = require('./apiErrors.js')
let controllers = require('./controllers.js')

// MIDDLEWARE PARA ERRORES
let { Validator, ValidationError } = require('express-json-validator-middleware');
let validator = new Validator({allErrors: true});
let validate = validator.validate;

let ArtistSchema = {
    type: 'object',
    required: ['name', 'country'],
    properties: {
        name: {
            type: 'string'
        },
        country: {
            type: 'string'
        },
    }
}

let AlbumSchema = {
    type: 'object',
    required: ['name', 'year', 'artistId'],
    properties: {
        name: {
            type: 'string'
        },
        year: {
            type: 'number'
        },
        artistId: {
            type: 'string'
        }
    }
}

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

//Error Handler
app.use(function(err, req, res, next) {
    if (err instanceof SyntaxError || err instanceof ValidationError) {
        const error = new errors.BadRequest()
        res.status(400)
        res.json({status: 400, errorCode: error.errorCode})
        next();
    }
    else next(err);
})

// ARTISTS

router.route('/artists').get((req,res)=>{
    let unqfy = getUNQfy()
    if(req.query.name){
        let artists = artistController.getArtistsByName(unqfy,req.query.name)
        res.json(artists)
    }else{
        res.json(artistController.getAllArtists(unqfy))
    }  
})

router.route('/artists/:id').put((req,res)=> {
    let unqfy = getUNQfy()
    let artist = artistController.updateArtist(unqfy,res,req.params.id,req.body)
    saveUNQfy(unqfy,'data.json')

})
router.route('/artists',validate({body: ArtistSchema})).post((req,res)=>{
    let unqfy = getUNQfy()
    artistController.createArtist(unqfy,req,res)
    saveUNQfy(unqfy,'data.json')
})

router.route('/artists/:id').get((req,res)=>{
     let unqfy = getUNQfy()
     artistController.getArtistById(unqfy,req,res)
})

router.route('/artist/:id').patch((req,res)=>{
    let unqfy = getUNQfy()
    let artist = artistController.updateArtist(unqfy,res,req.params.id,req.body)
    saveUNQfy(unqfy,'data.json')
})



router.route('/artists/:id').delete((req,res)=>{
    let unqfy = getUNQfy()
    artistController.deleteArtist(unqfy,req,res)
    saveUNQfy(unqfy,'data.json')
})

////Albums///

router.route('/albums',validate({body: AlbumSchema})).post((req,res)=>{  
    let unqfy = getUNQfy()
    albumController.createAlbum(unqfy,req,res)
    saveUNQfy(unqfy,'data.json')
})

router.route('/albums/:id').get((req,res)=>{
    let unqfy = getUNQfy()
    
    albumController.getAlbumById(unqfy,req,res)
})

///Actualizo el año de un album
router.route('/albums/:id').patch((req,res)=>{
    let unqfy = getUNQfy()
    albumController.updateAlbum(unqfy,req,res)
    saveUNQfy(unqfy,'data.json')
})

router.route('/albums/:id').delete((req,res)=>{
    let unqfy = getUNQfy()
    albumController.deleteAlbum(unqfy,req,res)
    saveUNQfy(unqfy,'data.json')
})

router.route('/albums').get((req,res)=>{
    let unqfy = getUNQfy()
    if(req.query.name){
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
         if(!track.hasLyrics()){
           let letra = unqfy.getLyricsForTrackId(idTrack)
           res.status(200)
           letra.then(()=>{
            unqfy.save('data.json')
            res.json({ Name: track.name,lyrics : track.getLyrics() })
         }).catch((e)=>{
            console.log(e.message)
            let error = new errors.ResourceNotFound()
            res.status(error.status)
            res.json({
                status: error.status,
                errorCode: error.errorCode
            })
         })
         } else {
             res.status(200)
             res.json({ Name: track.name, lyrics: track.getLyrics() })
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
        let unqfy = getUNQfy()
        console.log(req.body)
        let playlist = unqfy.createPlaylist(req.body.name,req.body.genres,req.body.maxDuration)
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
        
})


router.route('/playlists/:id').get((req,res) => {
    let id = req.params.id
    let playlist = unqfy.getPlaylistById(id)
    res.status(200)
    res.json(playlist)
    
})


//Me quiero quedar con todas las playlists con ese name y en el postman las filtro por duracion
// PERO NO ME ANDA
/*
router.route('/playlists').get((req,res)=> {
    let unqfy = getUNQfy()
    if(req.query.name) {
        let playlist = unqfy.searchPlaylistByName(req.query.name)
        res.json(playlist)
    } 
})
*/

router.route('/playlists').get((req,res)=> {
    let unqfy = getUNQfy()
    let playlists = unqfy.playlists
    if((req.query.name || req.query.durationLT || req.query.durationGT)) {
       if(req.query.name){ 
        playlists = unqfy.searchPlaylistByName(req.query.name)
       }
       playlists = filterByDurationGT(playlists,req.query.durationGT)
       playlists = filterByDurationLT(playlists,req.query.durationLT)

       res.json(playlists) 
    } else{
        // let error = new errors.BadRequest()
        // res.status(error.status)
        // res.json({status:error.status,errorCode:error.errorCode})
        res.json(unqfy.playlists)
    } 
})

function filterByDurationGT(playlists,durationGT){
    if(durationGT){
        playlists = playlists.filter(playlist => playlist.duration() > durationGT)
    }
    return playlists
}

function filterByDurationLT(playlists,durationLT){
    if(durationLT){
        playlists = playlists.filter(playlist => playlist.duration() < durationLT)
    }
    return playlists
}

router.route('/playlists/:id').delete((req,res)=>{
    try{
        const id = req.params.id
        const playlist = unqfy.getPlaylistById(id)
        console.log(id)
        console.log(unqfy.playlist)
        unqfy.removePlaylist(playlist)
        console.log(unqfy.playlists)
        saveUNQfy(unqfy,'data.json')
        res.status(204)
        res.json(playlist)
    }catch(e){
        let error = new Error()
        console.log("Ocurrio un error", e.message)
        res.status(error.status)
    }
})


app.listen(8000, ()=>{
    console.log('Servidor corriendo en el puerto 8000')
})
