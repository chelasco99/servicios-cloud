let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let router = express.Router()
const {google} = require('googleapis');
const getGmailClient = require('./gmail-tools/gmailClient');
const createMessage = require('./gmail-tools/createMessage')
let sendNotify = require('../monitores/observerNotify')

//MIDDLEWARE PARA ERRORES
let { Validator, ValidationError } = require('express-json-validator-middleware');
let validator = new Validator({allErrors: true});
let validate = validator.validate;

//API ERRORS
let errors = require('../apiErrors')
let notFound = new errors.RelatedResourceNotFound()

//SUBSCRIPTIONS MAP
let subscriptions = new Map()

//Verify
let verifyArtist = require('./checkArtistUNQFY.js')

let SuscripcionSchema = {
    type: 'object',
    required: ['artistId', 'email'],
    properties: {
        artistId: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
    }
}

let DeleteSuscripcionSchema = {
    type: 'object',
    required: ['artistId'],
    properties: {
        artistId: {
            type: 'string'
        }
    }
}

let NotifySchema = {
    type: 'object',
    required:['artistId','subject','message'],
    properties:{
        artistId:{type: 'string'},
        subject:{type:'string'},
        message:{type:'string'}
    }
}

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

router.route('/subscribe',validate({body: SuscripcionSchema})).post((req,res)=>{
    let artistId = req.body.artistId
    verifyArtist(artistId).then(response =>{
            if(!response.status) {
                subscribe(response.id,req.body.email)
                res.status(200)
                res.json({status:200})
            } else{
                res.status(notFound.status)
                res.json(error.toJSON())
            }        
    }).catch(error=>{
         res.status(notFound.status)
         res.json(notFound.toJSON())
         console.log('error: ',error)
    })

})

router.route('/unsubscribe',validate({body: SuscripcionSchema})).post((req,res)=>{
    let artistId = req.body.artistId
    verifyArtist(artistId).then(response =>{
        if(!response.status){
           desubscribe(artistId,req.body.email)
           res.status(200)
           res.json({status:200})
        }else{
            res.status(notFound.status)
            res.json(notFound.toJSON())
        }
    })
    .catch(error=>{
        res.status(notFound.status)
        res.json(notFound.toJSON())
        console.log('error: ',error)
   })
})

router.route('/subscriptions').get((req,res)=>{
    let id = req.query.artistId
    verifyArtist(id)
          .then(response => {
              if(!response.status){
                let subscriptonArtist = subscriptions.get(id) ? subscriptions.get(id) : []
                res.status(200)
                res.json({artistId:id,subscriptors:subscriptonArtist})
              }else{
                  res.status(notFound.status)
                  res.json(notFound.toJSON())
              }
          }).catch(error=>{
              res.status(notFound.status)
              res.json(notFound.toJSON())
              console.log('error: ',error)
          })
})

router.route('/subscriptions',validate({body:DeleteSuscripcionSchema})).delete((req,res)=>{
    let id = req.body.artistId
    verifyArtist(id)
         .then(response =>{
             if(!response.status){
                subscriptions.set(id,[])
                res.status(200)
                res.json()
             }else{
                res.status(notFound.status)
                res.json(notFound.toJSON())
             }
         }).catch(error =>{
            res.status(notFound.status)
            res.json(notFound.toJSON())
            console.log('error: ',error)
         })

})

router.route('/notify',validate({body:NotifySchema})).post((req,res)=>{
    let gmailClient = getGmailClient()
    let id = req.body.artistId
    let subscriptionsArtist = subscriptions.get(id)
    verifyArtist(id)
            .then(response =>{
              if(!response.status && subscriptionsArtist){
                subscriptionsArtist.map((email) =>{
                    gmailClient.users.messages.send({
                        userId:'me',
                        requestBody:{
                            raw: createMessage(req.body.subject,req.body.message,email)
                        }
                    })
                })
                res.status(200)
                res.json('')
             } else{
                 res.status(notFound.status)
                 res.json(notFound.toJSON())
             }
         }).catch(error => console.log('Send notify error: ',error))    
})

function subscribe(artist,email){

    let subscriptionArtist = subscriptions.get(artist)

    if(subscriptionArtist){
        subscriptionArtist.push(email)
        subscriptions = subscriptions.set(artist,subscriptionArtist)
    } else {
        subscriptions = subscriptions.set(artist,[email])
    }

    console.log('Subscriptions : ',subscriptions)
    return subscriptions
}

function desubscribe(artist,email){
    let subscriptonArtist = subscriptions.get(artist)
    if(subscriptonArtist && subscriptonArtist.includes(email)){
        let filterSubscriptions = subscriptonArtist.filter(emails => emails != email)
        subscriptions = subscriptions.set(artist,filterSubscriptions)
    }
}

// verifyArtist('biq5dnb4x').then(response => {
//     if(!response.status){
//         console.log('Funciono',response)
//     }else{
//         console.log('NO FUNCIONO',response)
//     }
// })

app.listen(8001, ()=>{
    console.log('Servidor corriendo en el puerto 8001')
    sendNotify()
})

                     

