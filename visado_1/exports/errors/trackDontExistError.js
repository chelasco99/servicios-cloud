class TrackDontExistError extends Error{
    constructor(){
        super("El track no existe en el sistema")
        this.name = "TrackDontExistError"
    }
}

module.exports = TrackDontExistError