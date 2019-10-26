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

router.route('/artist').post((req,res)=>{
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

router.route('/artist/:id').get((req,res)=>{
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

////Albums///

router.route('/album').post((req,res)=>{    
    const artist = unqfy.getArtistById(req.body.artistId)
    try{
        let album = unqfy.addAlbum(artist.name,{artistId:req.body.id,name:req.body.name,year:req.body.year})
        saveUNQfy(unqfy,'data.json')
        res.status(201)
        res.json({
            id:album.id,
            name:album.name,
            year:album.year,
            tracks:album.tracks
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

router.route('/album/:id').get((req,res)=>{
    const id = req.params.id
    const album = unqfy.getAlbumById(id)
    res.status(200)
    res.json(album)
})

///Actualizo el año de un album
router.route('/album/:id').patch((req,res)=>{
    const id = req.params.id
    const body = req.body
    const album = unqfy.getAlbumById(id)
    album.year = body.year
    saveUNQfy(unqfy,'data.json')
    res.status(200)
    res.json(album)

})

router.route('/album/:id').delete((req,res)=>{
    try{ 
        const id = req.params.id
        const album = unqfy.getAlbumById(id)
        console.log(album)
        const artist = unqfy.getArtistById(album.artistID)
        console.log(artist)  
        unqfy.removeAlbum(artist,album.name)
        console.log(artist)
        saveUNQfy(unqfy,'data.json')
        res.status(204)
        res.json(artist)
    }catch(e){
        let error = new errors.ResourceNotFound()
        console.log('Ocurrio un error',e.message)
        res.status(error.status)    
    }
})

router.route('/albums').get((req,res)=>{
    if(req.query.name != undefined){
        try{
            let album = unqfy.getAlbumByName(req.query.name)
            res.json(album)
        }catch(e){
            let error = new errors.ResourceNotFound()
            res.status(error.status)
            res.json(error)
        }
    }else{
        const albums = unqfy.albums
        let jsonAlbums = albums.map(album=> album.name)
        res.json(jsonAlbums)
    }    
})

app.listen(8000, ()=>{
    console.log('Servidor corriendo en el puerto 8000')
})
