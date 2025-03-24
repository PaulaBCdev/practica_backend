import Product from '../models/Product.js'

export async function deleteProduct(req, res, next) {
    try {
        const userId = req.session.userId
        const productId = req.params.productId

        await Product.deleteOne({ _id: productId, owner: userId })

        res.redirect('/')
        
    } catch (error) {
        next(error)
    }
}