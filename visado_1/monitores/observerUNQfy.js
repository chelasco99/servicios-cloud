let fetch = require('node-fetch')

function sendNotify(){
    fetch('http://localhost:8003/api/monitor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({statusUNQfy:200}),
    })
    .then(function(response) {
        console.log('response =', response);
        return response.json();
    })
    .then(function(data) {
        console.log('data = ', data);
    })
    .catch(function(err) {
        console.error(err);
    });
}

module.exports = sendNotify;