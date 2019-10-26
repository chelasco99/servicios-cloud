let errors = require('./apiErrors.js')

class AbstractUnqfyController {

    constructor(unqfy){
        this.unqfy = unqfy
    }

}

let resourceNotFound = new errors.ResourceNotFound()
let duplicateEntitie = new errors.DuplicateEntitie()

class ArtistController extends AbstractUnqfyController{
    constructor(unqfy){
        super(unqfy)
    }

    getArtistsByName(name){
        let artists = this.unqfy.searchArtistsByName(name)
        return artists.map(artist => artist.toJSON())
    }

    getAllArtists(){
        return this.unqfy.artists.map(artist=> artist.toJSON())
    }

    updateArtist(res,artistId,data){
       try{ 
         let artist = this.unqfy.updateArtist(artistId,data)
         res.json(artist.toJSON())
       }catch(e){
         res.status(resourceNotFound.status)
         res.json({
            status: resourceNotFound.status,
            errorCode: resourceNotFound.errorCode
         })
       } 
    }

    createArtist(req,res){
        try{
            let artist = this.unqfy.addArtist({name:req.body.name,country:req.body.country})
            res.status(201)
            res.json(artist.toJSON())
        } catch(e){
            res.status(duplicateEntitie.status)
            res.json({
                status: duplicateEntitie.status,
                errorCode: duplicateEntitie.errorCode  
            })
        }
    }

    getArtistById(req,res){
        try{
            let artist = this.unqfy.getArtistById(req.params.id)
            res.json(artist.toJSON())
        } catch(e) {
            res.status(resourceNotFound.status)
            res.json({
                status: resourceNotFound.status,
                errorCode: resourceNotFound.errorCode
            })
        }
    }

    deleteArtist(req,res){
        try{
            let artist = this.unqfy.getArtistById(req.params.id)
            this.unqfy.removeArtist(artist)
            res.status(204)
        } catch(e){
            res.status(resourceNotFound.status)
            res.json({
                status: resourceNotFound.status,
                errorCode: resourceNotFound.errorCode
            })
        }
    }
}

module.exports = {
    ArtistController
}