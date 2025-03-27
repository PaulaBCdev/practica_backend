import path from 'node:path'
import express from 'express'
import multer from 'multer'
import createError from 'http-errors'
import logger from 'morgan'
import connectMongoose from './lib/connectMongoose.js'
import * as homeController from './controllers/homeController.js'
import * as loginController from './controllers/loginController.js'
import * as productsController from './controllers/productsController.js'
import * as sessionManager from './lib/sessionManager.js'


// connect with MongoDB database
await connectMongoose()
console.log('Connected to MongoDB')

// use files with express
const storage = multer.diskStorage({
    destination: 'public/images',
    filename: function (req, file, callback) {
        console.log(req.file)
        const str = file.originalname.split(".")
        const extention = str[1]
        const suffix = Date.now()
      callback(null, `${str[0]}_${suffix}.${extention}`);
    },
  });

const upload = multer({ storage })  
const app = express()


// VIEWS CONFIG
app.set('views', 'views') 
app.set('view engine', 'ejs')

app.locals.appName = 'NodePop'


// MIDDLEWARES
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(import.meta.dirname, 'public')))
app.use(express.json())

app.use(sessionManager.middleware)
app.use(sessionManager.useSessionInViews)


// APPLICATION ROUTES
app.get('/', homeController.index)
app.get('/login', loginController.index)
app.post('/login', loginController.login)
app.get('/logout', loginController.logout)
app.get('/products/new', sessionManager.guard, productsController.index)
app.post('/products/new', sessionManager.guard, upload.single('image'), productsController.validateNewProduct, productsController.createProduct)
app.get('/products/delete/:productId', sessionManager.guard, productsController.deleteProduct)


// catch 404 and send error
app.use((req, res, next) => {
    next(createError(404))
})


// error handler
app.use((err, req, res, next) => {

    // manage validation errors
    if (err.array) {
        err.message = 'Invalid request:  ' + err.array()
            .map(e => `${e.location} ${e.type} ${e.path} ${e.msg}`)
            .join(', ')
        
            err.status = 422
    }

    res.status(err.status || 500)
    res.locals.message = err.message
    res.locals.error = process.env.NODEAPP_ENV === 'development' ? err : {}

    res.render('error')
})

export default app