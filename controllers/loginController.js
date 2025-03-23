import User from '../models/User.js'

export async function login(req, res, next) {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email })

        if (!user || !(await user.comparePassword(password))) {
            res.locals.error = 'Invalid credentials'
            res.locals.email = email
            /* res.render('login') */
            return
        }

        res.redirect('/')
        
    } catch (error) {
        next(error)
    }
}