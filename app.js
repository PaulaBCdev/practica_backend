import path from 'node:path'
import express from 'express'
import createError from 'http-errors'
import logger from 'morgan'
import connectMongoose from './lib/connectMongoose.js'
import * as homeController from './controllers/homeController.js'

// connect with database
await connectMongoose()  
console.log('Connected to MongoDB')

const app = express()

// view engine setup
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use(logger('dev'))

app.use(express.static(path.join(import.meta.dirname, 'public')))

app.get('/', homeController.index)


//error 404
app.use((req, res, next) => {
    next(createError(404))
})

//error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500)

    res.locals.message = err.message
    res.locals.error = process.env.NODEPOP_ENV === 'development' ? err : {}

    res.render('error')
})

export default app
