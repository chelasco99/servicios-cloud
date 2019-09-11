class ArtistExistError extends Error{
    constructor(){
        super("El artista ya se encuentra en el sistema")
        this.name = "ArtistExistError"
    }
}

module.exports = ArtistExistError