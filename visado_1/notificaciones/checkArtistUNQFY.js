const fetch = require('node-fetch');

function verifyArtist(artistId){
    return fetch('http://localhost:8000/api/artists/' + artistId, {
        method: 'GET', //VERIFICAR QUE EL GET SEA ASI EN LA DOCUMENTACION DE FETCH
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    
}

module.exports = verifyArtist;