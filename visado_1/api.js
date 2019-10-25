let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let router = express.Router()
let fs = require('fs'); // para cargar/guarfar unqfy
let unqmod = require('./unqfy');
let errors = require('./apiErrors.js')

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
app.use(bodyParser.json())
app.use('/api',router)

router.route('/artists').get((req,res)=> {
    let artists = unqfy.artists
    artists.map(artist => artist.toJSON())
    saveUNQfy(unqfy,'data.json')
    res.status(200)
    res.json(artists)
    
})

router.route('/artists/:id').put((req,res)=> {
    try{
        let artist = unqfy.updateArtist(req.params.id,req.body)
        res.status(200)
        res.json({
            id: artist.id,
            name: artist.name,
            country: artist.country,
            albums: artist.albums
        })
        saveUNQfy(unqfy, 'data.json')
    }catch(e) {
        let error = new errors.ResourceNotFound()
        res.status(error.status)
        res.json({
            status: error.status,
            errorCode:error.errorCode  
        })
    }

})
router.route('/artists').post((req,res)=>{
    try{
        console.log(req.body)
        let artist = unqfy.addArtist({name:req.body.name,country:req.body.country})
        saveUNQfy(unqfy,'data.json')
        res.status(201)
        res.json({
            id: artist.id,
            name: artist.name,
            country: artist.country,
            albums: artist.albums
        })
    }catch(e){
        let error = new errors.DuplicateEntitie()
        console.log('Ocurrio un error ',e.message)
        res.status(error.status)
        res.json({
            status: error.status,
            errorCode:error.errorCode  
        })
    }
})

router.route('/artists/:id').get((req,res)=>{
    const id = req.params.id
    const artist = unqfy.getArtistById(id)
    res.status(200)
    res.json(artist)
})

router.route('/artist/:id').patch((req,res)=>{
    // Verificar que el nuevo nombre no exista en el sistema
    const id = req.params.id
    const body = req.body
    const artist = unqfy.getArtistById(id)
    artist.name = body.name
    artist.country = body.country
    saveUNQfy(unqfy,'data.json')
    res.status(200)
    res.json(artist)
    
})

router.route('/artists').get((req,res)=>{
    if(req.query.name != undefined){
        try{
         let artist = (unqfy.getArtistByName(req.query.name))
         res.json(artist)
        } catch(e){
            let error = new errors.ResourceNotFound()
            res.status(error.status)
            res.json(error)
        }  
    }    
    else{
        const artists = unqfy.artists
        let jsonArtists = artists.map(item=> item.name)
        res.json(jsonArtists)
    }    
})

router.route('/tracks/:id/lyrics').get((req,res)=>{
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

app.listen(8000, ()=>{
    console.log('Servidor corriendo en el puerto 8000')
})
