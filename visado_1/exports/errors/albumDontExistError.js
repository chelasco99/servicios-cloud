class AlbumDontExistError extends Error{
    constructor(message){
        super(message)
        this.name = "AlbumDontExistError"
    }
}

module.exports = AlbumDontExistError