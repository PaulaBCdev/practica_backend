import Product from '../models/Product.js'

export async function index(req, res, next) {
    try {
        const userId = req.session.userId

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 3
        const startIndex = (page - 1) * limit

        res.locals.products = await Product.find({ owner: userId }).skip(startIndex).limit(limit)


        
        res.render('home')
    } catch (error) {
        next(error)
    }
}

