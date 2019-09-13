class Playlist{
  constructor(name){
      this.name = name
      this.tracks = []
  }

  addTrack(track){
     this.tracks.push(track)
  }

  duration(){
      let res = 0
      this.tracks.forEach(function(elem){
         res+= elem.duration
      },res)
  }

  hasTrack(aTrack){
     return this.tracks.includes(aTrack)
  }
}

module.exports = Playlist