import mongoose, { Schema } from "mongoose"

const productSchema = new Schema({
    name: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    price: Number,
    image: String,
    tags: [String]
})

const Product = mongoose.model('Product', productSchema)

export default Product