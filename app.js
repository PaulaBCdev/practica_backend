import express from 'express'
import createError from 'http-errors'

const app = express()

app.set('views', 'views')
app.set('view engine', 'ejs')

app.get('/', (req,res) => {
    res.send('juean')
})


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
