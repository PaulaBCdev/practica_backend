import express from 'express'
import connectMongoose from './lib/connectMongoose.js'

// connect with MongoDB database
await connectMongoose()
console.log('Connected to MongoDB')

const app = express()

export default app