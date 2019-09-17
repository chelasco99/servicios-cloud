class TrackExistError extends Error{
    constructor(){
        super("El album ya tiene ese track")
        this.name = "TrackExistError"
    }
}

module.exports = TrackExistError