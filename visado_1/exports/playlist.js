const ID = require('./idGenerator')
class Playlist{
  constructor(name,genresToInclude,maxDuration){
      this.name = name
      this.playlistId = ID()
      this.genresToInclude = genresToInclude
      this.tracks = []
      this.maxDuration = maxDuration
      this.currentDuration = 0
  }

  addTrack(track){
    let duration = this.duration() + track.getDuration()
    if(duration <= this.maxDuration){ 
     this.tracks.push(track)
     this.currentDuration += track.getDuration()
    }
  }

  duration(){
     return this.currentDuration
  }

  hasTrack(aTrack){
     return this.tracks.includes(aTrack)
  }

  addTracks(aTrackList){
     for(let track of aTrackList){
        this.addTrack(track)
     }
  }

  removeTrack(trackName){
     let trackToRemove = this.tracks.find(track => track.name === trackName)
     if(trackToRemove !== undefined){
        this.tracks = this.tracks.filter(track => track.name !== trackName)
        this.currentDuration -= trackToRemove.getDuration()
     }
  }

  removeAllTracksAlbum(album) {
     this.tracks = this.tracks.filter(track => track.albumId !== album.albumId)
  }

  removeArtistAlbums(artist){
     artist.albums.forEach(function(elem){
        this.removeAllTracksAlbum(elem)
      });
   }

}

module.exports = Playlist