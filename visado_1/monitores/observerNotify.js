let fetch = require('node-fetch')

function sendNotify(){
    return fetch('http://localhost:8003/api/statusNotify', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({StatusNotify: 'ON'})
    }).then(res => res.json())
}

module.exports = sendNotify;