let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let router = express.Router()
let winston = require('winston')
let {Loggly} = require('winston-loggly-bulk')
let fs = require('fs')
let sendNotify = require('../monitores/observerLogging')

app.use(bodyParser.json())
app.use('/api',router)

logActivo = true

router.get('/activar', (req, res) => {
    logActivo = true
    console.log("El log esta activado")
    res.status(200)
    res.json({status: 200, message: "El log esta activo"})
})

router.get('/desactivar', (req,res) => {
    logActivo = false 
    console.log("El log esta desactivado")
    res.status(200)
    res.json({status: 200, message: "El log esta desactivado"})
})

router.post('/log', (req,res) => {
    if (logActivo) {
        let mensaje = req.body.mensaje
        let tipo = req.body.tipo
        enviarLogALoggly(mensaje,tipo)
        guardarLog(mensaje,tipo)
        res.status(200)
        res.json({status:200})
    }
})


function enviarLogALoggly(mensaje,tipo) { 
    winston.add(new Loggly({
        token: "f50778c4-efb5-444f-bf79-e4f89df95ede",
        subdomain: "nachochelasco",
        tags: ["Logg-Service"],
        json: true
    }));
    
    winston.log(mensaje,tipo);
}


function guardarLog(mensaje,tipo) {
    let data = mensaje + ":" + tipo
    fs.appendFileSync('archivosLocales.txt', data)
}


app.listen(8002, ()=>{
    console.log('Servidor corriendo en el puerto 8002')
    sendNotify()
})