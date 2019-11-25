let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let router = express.Router()

app.use(bodyParser.json())
app.use('/api',router)

estaActivo = true

router.get('/activar', (req, res) => {
    estaActivo = true
    console.log("Esta activado")
    res.status(200)
    res.json({status: 200, message: "El log esta activo"})
})

router.get('/desactivar', (req,res) => {
    estaActivo = false 
    console.log("Esta desactivado")
    res.status(200)
    res.json({status: 200, message: "El log esta desactivado"})
})



app.listen(8002, ()=>{
    console.log('Servidor corriendo en el puerto 8002')
})