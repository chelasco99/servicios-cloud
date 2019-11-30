let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let router = express.Router()

let checkStatusUNQfy = require('./checkStatusUNQfy.js')

let errors = require('../apiErrors')
let notFound = new errors.RelatedResourceNotFound()

app.use(bodyParser.json())
app.use('/api',router)
app.use(express.json())

app.post('/monitor', (request,response) => {
    console.log(request.body)
    const data = request.body
    response.json({
        status: data.statusUNQfy
    });
});


router.route('/status').get((req,res)=>{
    checkStatusUNQfy.then(response => {
        if(!response.status){
            res.status(200)
            res.json({status:200})
        }else{
            res.status(notFound.status)
            res.json(error.toJSON())
        }
    }).catch(error=>{
        res.status(notFound.status)
        res.json(notFound.toJSON())
        console.log('error: ',error)
   })
})

app.listen(8003,()=>{
    console.log('Servidor corriendo en el puerto 8003')
})