import fs from 'node:fs'
import Product from '../models/Product.js'

export function index(req, res, next) {
    res.render('new-product')
}


export async function createProduct(req, res, next) {
    try {
        const { name, price, tags } = req.body
        const { filename } = req.file
        const userId = req.session.userId
        
        const product = new Product({ name, price, image: filename, tags, owner: userId})
        
        await product.save()
        
        res.redirect('/')
        
    } catch (error) {
        next(error)
    }
}


export async function deleteProduct(req, res, next) {
    try {
        const userId = req.session.userId
        const productId = req.params.productId

        // delete product in database and image in server
        const deletedProduct = await Product.findOneAndDelete({ _id: productId, owner: userId })
        fs.unlink(`public/images/${deletedProduct.image}`, (err) => {
            if (err) {
              console.error(`Error removing file: ${err}`);
              return;
            }
        })

        
        res.redirect('/')

    } catch (error) {
        next(error)
    }
}