import express from 'express'
import mongoose from 'mongoose'
import router from './config/router.js'

// Deployment
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import 'dotenv/config'

const logger = (req, res, next) => {
  console.log(`🚨 - Incoming request on ${req.method} - ${req.url}`)
  next()
}

const startSever = async () => {
  
  // initializing an express server
  const app = express()


  app.use(express.json()) // Gives access to JSON body of req.body
  app.use(logger) // console.log for all incoming requests
  app.use('/api', router) // Connecting the express listener to the router

  // Router
  app.use('/api', router)

  // ** New lines **
  app.use(express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })

  await mongoose.connect(process.env.MONGO_DB) //Connecting to mongoose
  console.log('Connected to MongoDB!')

  // Set up the express listener on a specified port
  app.listen(process.env.PORT, () => console.log(`🚀 - Server listening on Port ${process.env.PORT}`))
}

startSever()