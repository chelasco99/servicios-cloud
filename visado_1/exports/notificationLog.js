let fetch = require('node-fetch')

function notificationLog(mensaje,tipo) {
    return fetch('http://localhost:8002/api/log',{
        method : 'post',
        body: JSON.stringify({mensaje : mensaje, tipo: tipo}),
        headers: {
            'Content-Type' : 'application/json'
        } 
    }).then(res => res.json())   
}

module.exports = notificationLog ;