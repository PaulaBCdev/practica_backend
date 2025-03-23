import path from 'node:path'
import express from 'express'
import logger from 'morgan'
import connectMongoose from './lib/connectMongoose.js'
import * as loginController from './controllers/loginController.js'

// connect with MongoDB database
await connectMongoose()
console.log('Connected to MongoDB')

const app = express()

app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(import.meta.dirname, 'public')))

// APPLICATION ROUTES
// auth endpoints
app.post('/login', loginController.login)

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