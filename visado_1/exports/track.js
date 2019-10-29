const ID = require('./idGenerator')

class Track{
    constructor(albumId,name,duration,genres){
        this.id = ID()
        this.albumId = albumId
        this.name = name
        this.duration = duration
        this.genres = genres
        this.lyrics = ""
    }
    
    addGenre(genreName){
        if(!this.genres.includes(genreName)){
            this.genres.push(genreName)
        } else{
            throw Error("El track ya tiene ese genero")
        }
    }

    hasGenre(genreName){
        return this.genres.includes(genreName)
    }

    hasAtLeastOne(genresNames){
        return genresNames.some(genre => this.genres.indexOf(genre) >= 0)
    }
    
    getDuration(){
        return this.duration
    }

    getLyrics(){
        if(this.lyrics != ""){
            return this.lyrics
        }else{
            return this.getLyricsFromMusixMatch(this.name)
        }
    }

    getLyricsFromMusixMatch(trackName){
        const rp = require('request-promise')
        const BASE_URL = 'http://api.musixmatch.com/ws/1.1';
    
        let options = {
          uri: BASE_URL + '/track.search',
          qs:{
              apikey : '9ed805815bd8bedfb3d60b615672e8c2',
              q_track : trackName
          },
          json:true
        }

        return rp.get(options).then((response)=>{  
          let body = response.message.body
          if(body.track_list.length != 0){
           let trackId = body.track_list[0].track.track_id
           return this.getLyricsFromId(trackId)
          } 
        }).catch((e)=>{
           throw new Error('No existe un track con nombre ' + this.name + ' en MusixMatch')
        })
      }
    
      getLyricsFromId(trackId){
        const rp = require('request-promise');
            const BASE_URL = 'http://api.musixmatch.com/ws/1.1';
            let options = {
                uri: BASE_URL + '/track.lyrics.get',
                qs: {
                    apikey: '9ed805815bd8bedfb3d60b615672e8c2',
                    track_id: trackId
                },
                json:true
            }
           return rp.get(options).then((response)=>{
                let body = response.message.body
                let lyrics = body.lyrics.lyrics_body
                this.saveLyrics(lyrics)
                return lyrics
            }).catch(()=>{
                throw new Error('No existe un track con nombre ' + this.name + ' en MusixMatch')
            })
      }

    saveLyrics(lyrcis){
        this.lyrics = lyrcis
    }

    hasLyrics(){
        return this.lyrics !== ""
    }
}

module.exports = Track