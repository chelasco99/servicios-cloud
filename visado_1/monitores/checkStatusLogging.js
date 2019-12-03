const fetch = require('node-fetch');
const Monitor = require('ping-monitor')
let sendNotify = require('./observerLogging')

function checkStatusLogging(){
    const myMonitor = new Monitor({
        website:'http://localhost:8002',
        title:'Logging',
        interval: 1
    })

    myMonitor.on('down',function(res,state){
        if(myMonitor.totalRequestPut > 1){
            console.log('Logging funcionando con normalidad')
        }else{
            myMonitor.resetRequestPost()    
            return fetch('http://localhost:8003/api/statusLogging', {
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({StatusLogging: 'ON'})
            }).then(res => res.json())
            .catch(err => console.error(err))
        }    
    });

    myMonitor.on('error', function(res){
        if(myMonitor.totalRequestPost > 1){
            console.log('Logging notificando a slack')
        }else{
            myMonitor.resetRequestPut()
            return fetch('http://localhost:8003/api/statusLogging', {
                method: 'POST', 
                headers:{
                'Content-Type': 'application/json'
                },
                body:JSON.stringify({StatusLogging: 'OFF'})
            }).then(res => res.json())
            .catch(err => console.error(err))
        }
    })    
} 

module.exports = checkStatusLogging;