let fetch = require('node-fetch')

function sendNotify(){
    return fetch('http://localhost:8003/api/statusUNQfy', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({StatusUNQfy: 'ON'})
    }).then(res => res.json())
}

module.exports = sendNotify;