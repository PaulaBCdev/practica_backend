import readline from 'node:readline/promises'
import connectMongoose from "./lib/connectMongoose.js"
import User from './models/User.js'
import Product from './models/Product.js'

const connection = await connectMongoose()
console.log('Connected to MongoDB:', connection.name)

const answer = await ask('Are you sure you want to delete database collections? (n)')
if(answer.toLowerCase() !== 'y') {
    console.log('Operation aborted.')
    process.exit()
}

await initUsers()
await initProducts()

await connection.close()

async function initUsers() {
    // delete all users
    const result = await User.deleteMany()
    console.log(`Deleted ${result.deletedCount} users.`)

    // create users
    const insertResult = await User.insertMany([
        { email: 'admin@example.com', password: await User.hashPassword('1234') },
        { email: 'user@example.com', password: await User.hashPassword('1234') }
    ])
    console.log(`Inserted ${insertResult.length} users.`)
}

async function initProducts() {
    // delete all products
    const result = await Product.deleteMany()
    console.log(`Deleted ${result.deletedCount} products.`)

    // search users to know which one posted which product
    const [admin, user] = await Promise.all([
        User.findOne({ email: 'admin@example.com' }),
        User.findOne({ email: 'user@example.com' }),
    ])

    // create products
    const insertResult = await Product.insertMany([
        {
            name: 'Mando de PlayStation',
            owner: admin._id,
            price: 12,
            image: 's-l1200.jpg',
            tags: ['videojuegos', 'gaming']
        },
        {
            name: 'Taza Shrek',
            owner: user._id,
            price: 12,
            image: '600x0_aeuxlqkfeqsrgnay_jpg_20e5.jpg',
            tags: ['taza', 'shrek', 'animacion']
        },
        {
            name: 'Peluche de Dragón',
            owner: user._id,
            price: 12,
            image: 'jellycat-peluche-sage-dragon.webp',
            tags: ['peluche', 'dragon', 'juguete']
        }
    ])
    console.log(`Inserted ${insertResult.length} products.`)
}

async function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    const result = await rl.question(question)
    rl.close()
    return result
}