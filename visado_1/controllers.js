let errors = require('./apiErrors.js')
let AlbumExistError = require('./exports/errors/albumExistError')
let BadRequest = errors.BadRequest

let resourceNotFound = new errors.ResourceNotFound()
let relatedNotFound = new errors.RelatedResourceNotFound()
let duplicateEntitie = new errors.DuplicateEntitie()
let badRequest = new errors.BadRequest()

class ArtistController{

    getArtistsByName(unqfy,name){
        let artists = unqfy.searchArtistsByName(name)
        return artists.map(artist => artist.toJSON())
    }

    getAllArtists(unqfy){
        return unqfy.artists.map(artist=> artist.toJSON())
    }

    updateArtist(unqfy,res,artistId,data){
       try{ 
         let artist = unqfy.updateArtist(artistId,data)
         res.json(artist.toJSON())
       }catch(e){
         res.status(resourceNotFound.status)
         res.json({
            status: resourceNotFound.status,
            errorCode: resourceNotFound.errorCode
         })
       } 
    }

    createArtist(unqfy,req,res){
        try{
            this.chequearBody(req.body)
            let artist = unqfy.addArtist({name:req.body.name,country:req.body.country})
            res.status(201)
            res.json(artist.toJSON())
        } catch(e){
            if(e instanceof BadRequest){
                res.status(badRequest.status)
                res.json({
                    status: badRequest.status,
                    errorCode: badRequest.errorCode
                })
            } else {
             res.status(duplicateEntitie.status)
             res.json({
                status: duplicateEntitie.status,
                errorCode: duplicateEntitie.errorCode  
             })
           }
        }
    }

    getArtistById(unqfy,req,res){
        try{
            let artist = unqfy.getArtistById(req.params.id)
            res.json(artist.toJSON())
        } catch(e) {
            res.status(resourceNotFound.status)
            res.json({
                status: resourceNotFound.status,
                errorCode: resourceNotFound.errorCode
            })
        }
    }

    deleteArtist(unqfy,req,res){
        try{
            let artist = unqfy.getArtistById(req.params.id)
            unqfy.removeArtist(artist)
            res.status(204)
            res.json("Artista eliminado correctamente")
        } catch(e){
            res.status(resourceNotFound.status)
            res.json({
                status: resourceNotFound.status,
                errorCode: resourceNotFound.errorCode
            })
        }
              
    }

    chequearBody(body){
        if(!(body.name && body.country)){
            throw badRequest
        }
    }
}

class AlbumController {
    constructor(artistController){
        this.controller = artistController
    }

    chequearBody(body){
        if(!(body.artistId && body.name && body.year)){
            throw badRequest
        }
    }

    createAlbum(unqfy,req,res){
        try{
            this.chequearBody(req.body)
            let artist = unqfy.getArtistById(req.body.artistId)
            let album = unqfy.addAlbum(artist.name,{artistId:artist.id,name:req.body.name,year:req.body.year})
            res.status(201)
            res.json(album)
        }catch(e){
            if(e instanceof BadRequest){
                res.status(badRequest.status)
                res.json({
                    status: badRequest.status,
                    errorCode: badRequest.errorCode
                })
            } 
            else if(e instanceof AlbumExistError){
                res.status(duplicateEntitie.status)
                res.json({status:duplicateEntitie.status,errorCode:duplicateEntitie.errorCode})
            }else{
                res.status(relatedNotFound.status)
                res.json({
                    status: relatedNotFound.status,
                    errorCode: relatedNotFound.errorCode
                })
            }
        }
    }

    getAlbumById(unqfy,req,res){
        try{
            let album = unqfy.getAlbumById(req.params.id)
            res.status(200)
            res.json(album.toJSON())
        } catch(e){
            res.status(resourceNotFound.status)
            res.json({
                status: resourceNotFound.status,
                errorCode: resourceNotFound.errorCode
            })
        }
    }

    updateAlbum(unqfy,req,res){
        try{
            let album = unqfy.getAlbumById(req.params.id)
            album.year = req.body.year
            res.json(album.toJSON())
        }catch(e){
            res.status(resourceNotFound.status)
            res.json({
                status: resourceNotFound.status,
                errorCode: resourceNotFound.errorCode
            })
        }
    }

    deleteAlbum(unqfy,req,res){
        try{
            let album = unqfy.getAlbumById(req.params.id)
            let artist = unqfy.getArtistById(album.artistID)
            unqfy.removeAlbum(artist,album.name)
            res.status(204)
            res.json("Album eliminado correctamente")
        }catch(e){
            res.status(resourceNotFound.status)
            res.json({
                status: resourceNotFound.status,
                errorCode: resourceNotFound.errorCode
            })
        }
    }
}

module.exports = {
    ArtistController,
    AlbumController
}