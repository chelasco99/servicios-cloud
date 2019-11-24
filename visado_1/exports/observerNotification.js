let fetch = require('node-fetch')

function sendNotify(artistId,albumName){
    return fetch('http://localhost:8001/api/notify',{
        method : 'POST',
        body : JSON.stringify({artistName: artistId,albumName:albumName}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
      .then(json => console.log(json))
}

module.exports = sendNotify;