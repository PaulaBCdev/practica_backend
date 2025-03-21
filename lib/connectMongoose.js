import mongoose from 'mongoose'

export default function connectMongoose() {
    return mongoose.connect('mongodb://localhost/nodeapp')
    .then(mongoose => mongoose.connection)
}