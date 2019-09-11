class AlbumExistError extends Error{
    constructor(){
        super("El artista ya tiene ese album")
        this.name = "AlbumExistError"
    }
}

module.exports = AlbumExistError