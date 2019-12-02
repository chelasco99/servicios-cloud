let fetch = require('node-fetch')

function sendNotify(){
    return fetch('http://localhost:8003/api/statusLogging', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({StatusLogging: 'ON'})
    }).then(res => res.json())
}

module.exports = sendNotify;