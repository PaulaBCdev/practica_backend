import User from '../models/User.js'

export function index(req, res, next) {
    res.locals.error = ''
    res.locals.email = ''
    res.render('login')
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email })

        if (!user || !(await user.comparePassword(password))) {
            res.locals.error = 'Invalid credentials'
            res.locals.email = email
            res.render('login')
            return
        }

        req.session.userId = user.id

        res.redirect('/')
        
    } catch (error) {
        next(error)
    }
}

export function logout(req, res, next) {
    req.session.regenerate(err => {
        if (err) {
            next(err)
            return
        } 

        res.redirect('/')
    })
}