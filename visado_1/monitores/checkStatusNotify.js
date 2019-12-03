const fetch = require('node-fetch');
const Monitor = require('ping-monitor')
let sendNotify = require('./observerNotify')

function checkStatusNotify(){
    const myMonitor = new Monitor({
        website:'http://localhost:8001',
        title:'Notify',
        interval: 1
    })

    myMonitor.on('down',function(res,state){
        if(myMonitor.totalRequestPut > 1){
            console.log('Notify funcionando con normalidad')
        }else{
            myMonitor.resetRequestPost()    
            return fetch('http://localhost:8003/api/statusNotify', {
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({StatusNotify: 'ON'})
            }).then(res => res.json())
            .catch(err => console.error(err))
        }    
    });

    myMonitor.on('error', function(res){
        if(myMonitor.totalRequestPut > 1){
            console.log('Notify notificando a slack')
        }else{
            myMonitor.resetRequestPut()
            return fetch('http://localhost:8003/api/statusNotify', {
                method: 'POST', 
                headers:{
                'Content-Type': 'application/json'
                },
                body:JSON.stringify({StatusNotify: 'OFF'})
            }).then(res => res.json())
            .catch(err => console.error(err))
        }
    })    
} 

module.exports = checkStatusNotify;