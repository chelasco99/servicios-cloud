const fetch = require('node-fetch');
const Monitor = require('ping-monitor')

function checkStatusUNQfy(){
    
    const myMonitor = new Monitor({
        website:'http://localhost:8000',
        title:'UNQFy',
        interval: 1
    });
    
    
    myMonitor.on('down',function(res,state){
        if(myMonitor.totalRequestPut > 1){
            console.log('UNQfy funcionando con normalidad')
            console.log('put' + myMonitor.totalRequestPut)
        }else{
            myMonitor.totalRequestPost = myMonitor.resetValPost
            return fetch('http://localhost:8003/api/statusUNQfy', {
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({StatusUNQfy: 'ON'})
            }).then(res => res.json())
            .catch(err => console.error(err))
        }    
    });   


    myMonitor.on('error', function(res){
        if(myMonitor.totalRequestPost > 1){
            console.log('UNQfy notificando a slack')
            console.log('post' + myMonitor.totalRequestPost)
        }else{
            myMonitor.totalRequestPut = myMonitor.resetValPut
            return fetch('http://localhost:8003/api/statusUNQfy', {
                method: 'POST', 
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({StatusUNQfy: 'OFF'})
            }).then(res => res.json())
            .catch(err => console.error(err))
        }
    });
}   
function stopMonitor(){
    this.myMonitor.stop()
    delete this.myMonitor
    
    }    

module.exports = checkStatusUNQfy, stopMonitor;