let fetch = require('node-fetch')

function sendNotificationToSlack(mensaje){
    let date = new Date()
    return fetch('https://hooks.slack.com/services/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',{
        method: 'POST',
        body: JSON.stringify({text:date + ': ' + mensaje}),
        headers: {
            'Content-type' : 'application/json'
        }
    }).then(response => response.json())
}

module.exports = sendNotificationToSlack;