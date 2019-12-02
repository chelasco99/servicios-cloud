const fetch = require('node-fetch');
const Monitor = require('ping-monitor')
let sendNotify = require('./observerNotify')

function checkStatusNotify(){
    const myMonitor = new Monitor({
        website:'http://localhost:8001',
        title:'Notify',
        interval: 1
    })

    myMonitor.on('up',function(res,state){
        sendNotify()
    })

    myMonitor.on('error', function(res){
        return fetch('http://localhost:8003/api/statusNotify', {
            method: 'POST', 
            headers:{
            'Content-Type': 'application/json'
            },
            body:JSON.stringify({StatusNotify: 'OFF'})
        }).then(res => res.json())
    })
} 

module.exports = checkStatusNotify;