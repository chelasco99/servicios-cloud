const fetch = require('node-fetch');

function checkStatusUNQfy(){
    return fetch('http://localhost:8000/api/',{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    
}

module.exports = checkStatusUNQfy;