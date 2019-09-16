class AlbumDontExistError extends Error{
    constructor(){
        super("El Album no existe en el sistema")
        this.name = "AlbumDontExistError"
    }
}

module.exports = AlbumDontExistError