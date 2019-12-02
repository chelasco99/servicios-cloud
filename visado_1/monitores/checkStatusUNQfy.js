const fetch = require('node-fetch');
const Monitor = require('ping-monitor')
let sendNotify = require('./observerUNQfy')

function checkStatusUNQfy(){
    const myMonitor = new Monitor({
        website:'http://localhost:8000',
        title:'UNQFy',
        interval: 1
    })

    myMonitor.on('up',function(res,state){
        sendNotify()
    })

    myMonitor.on('error', function(res){
        return fetch('http://localhost:8003/api/statusUNQfy', {
            method: 'POST', 
            headers:{
            'Content-Type': 'application/json'
            },
            body:JSON.stringify({StatusUNQfy: 'OFF'})
        }).then(res => res.json())
    })

    myMonitor.on('stop',function(website){
        console.log(website + 'monitor desactivado')
    })
} 

module.exports = checkStatusUNQfy;