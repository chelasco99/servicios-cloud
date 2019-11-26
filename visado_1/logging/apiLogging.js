let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let router = express.Router()
let winston = require('winston')
let {Loggly} = require('winston-loggly-bulk')

app.use(bodyParser.json())
app.use('/api',router)

logActivo = true

router.get('/activar', (req, res) => {
    logActivo = true
    console.log("Esta activado")
    res.status(200)
    res.json({status: 200, message: "El log esta activo"})
})

router.get('/desactivar', (req,res) => {
    logActivo = false 
    console.log("Esta desactivado")
    res.status(200)
    res.json({status: 200, message: "El log esta desactivado"})
})



//Envia log a loggly
winston.add(new Loggly({
    token: "f50778c4-efb5-444f-bf79-e4f89df95ede",
    subdomain: "nachochelasco",
    tags: ["Winston-NodeJS"],
    json: true
}));

winston.log('info', "Hola Mundo desde Node.js");


app.listen(8002, ()=>{
    console.log('Servidor corriendo en el puerto 8002')
})