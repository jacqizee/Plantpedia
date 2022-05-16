import express from 'express'
import mongoose from 'mongoose'
import router from './config/router.js'

import 'dotenv/config'

const logger = (req, res, next) => {
  console.log(`🚨 - Incoming request on ${req.method} - ${req.url}`)
  next()
}

const startSever = async () => {
  const app = express()

  app.use(express.json())
  app.use(logger)

  app.use(router)

  await mongoose.connect(process.env.MONGO_DB)
  console.log('Connected to MongoDB!')
  app.listen(process.env.PORT, () => console.log(`🚀 - Server listening on Port ${process.env.PORT}`))
}

startSever()