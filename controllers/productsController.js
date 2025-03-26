import fs from 'node:fs'
import { body, validationResult } from 'express-validator'
import Product from '../models/Product.js'

export function index(req, res, next) {
    res.locals.errorName = ''
    res.locals.errorPrice = ''
    res.locals.errorImage = ''
    
    res.render('new-product')
}

export const validateNewProduct = [
    body('name')
        .trim()
        .notEmpty()
        .isString()
        .isLength( { min: 3, max: 15}),
        
    
    body('price')
        .trim()
        .notEmpty()
        .isNumeric()
        .custom( value => value >= 0)
]

export async function createProduct(req, res, next) {
    try {
        // validation
        const validation = validationResult(req)

        if (!validation.isEmpty() || req.file === undefined) {
            res.locals.errorName = ''
            res.locals.errorPrice = ''
            res.locals.errorImage = ''
            
            validation.array({ onlyFirstError: true })
                .forEach(validError => {
                    if (validError.path === 'name') {
                        res.locals.errorName = "Invalid name"
                    }else if (validError.path === 'price') {
                        res.locals.errorPrice = "Invalid price"
                    }
                })
            
            if (req.file === undefined) {
                res.locals.errorImage = "Must upload an image"
            }
            
            res.render('new-product')
            return
            
        }

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