let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let router = express.Router()

let checkStatusUNQfy= require('./checkStatusUNQfy.js')
let checkStatusNotify = require('./checkStatusNotify')
let checkStatusLogging = require('./checkStatusLogging')
let stopMonitor = require('./checkStatusUNQfy.js')
let sendNotificationToSlack = require('./sendNotificacionToSlack')

let errors = require('../apiErrors')

let { Validator, ValidationError } = require('express-json-validator-middleware');
let validator = new Validator({allErrors: true});
let validate = validator.validate;

app.use(bodyParser.json())
app.use('/api',router)

app.use(function(err, req, res, next) {
    if (err instanceof SyntaxError || err instanceof ValidationError) {
        const error = new errors.BadRequest()
        res.status(400)
        res.json(error.toJSON())
        next();
    }
    else next(err);
});

const status = {
    StatusUNQfy: 'OFF',
    StatusNotify: 'OFF',
    StatusLogging: 'OFF'
}

let upMonitor = false
let sendToSlackUNQfy = false
let sendToSlackNotify = false
let sendToSlackLogging = false

checkMonitors()

router.route('/status').get((req,res) =>{
    res.json(status)
})

router.route('/statusUNQfy').post((req,res)=>{
    if(upMonitor){
        console.log(req.body)
        //sendNotificationToSlack('El servicio UNQfy ha dejado de funcionar')
        res.json(status.StatusUNQfy = req.body.StatusUNQfy)
    }   
})

router.route('/statusUNQfy').put((req,res) =>{
    if(upMonitor){
        console.log(req.body)
        //sendNotificationToSlack('El servicio UNQfy ha vuelto a la normalidad')
        res.json(status.StatusUNQfy=req.body.StatusUNQfy)
    }
})

router.route('/statusNotify').post((req,res)=>{
    if(upMonitor){
        console.log(req.body)
        //sendNotificationToSlack('El servicio Notify ha dejado de funcionar')
        res.json(status.StatusNotify = req.body.StatusNotify)
    }     
})

router.route('/statusNotify').put((req,res) =>{
    if(upMonitor){
        console.log(req.body)
        //sendNotificationToSlack('El servicio Notify ha vuelto a la normalidad')
        res.json(status.StatusNotify=req.body.StatusNotify)
    }    
})

router.route('/statusLogging').post((req,res)=>{
    if(upMonitor){
        console.log(req.body)
        //sendNotificationToSlack('El servicio Logging ha dejado de funcionar')
        res.json(status.StatusLogging = req.body.StatusLogging)
    }     
})

router.route('/statusLogging').put((req,res) =>{
    if(upMonitor){
        console.log(req.body)
        //sendNotificationToSlack('El servicio Logging ha vuelto a la normalidad')
        res.json(status.StatusLogging=req.body.StatusLogging)
    }    
})

router.get('/upMonitor', (req, res) => {
    upMonitor = true
    checkMonitors()
    console.log("El monitor esta activado")
    res.status(200)
    res.json({status: 200, message: "El monitor esta activo"})
})

router.get('/downMonitor', (req,res) => {
    upMonitor = false
    stopMonitor()
    console.log("El monitor esta desactivado")
    res.status(200)
    res.json({status: 200, message: "El monitor esta desactivado"})
})

function checkMonitors(){
    if(upMonitor){
        checkStatusUNQfy()
        checkStatusNotify()
        checkStatusLogging()
    }
}

app.listen(8003,()=>{
    console.log('Servidor corriendo en el puerto 8003')
})
