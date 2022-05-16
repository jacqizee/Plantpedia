import mongoose from 'mongoose'
import Plant from '../models/plants.js'
import plantData from './data/plants.js'

import 'dotenv/config'

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB)
    console.log('🚀 Database connected')

    await mongoose.connection.db.dropDatabase()
    console.log('👍 Database dropped')


    const plantsAdded = await Plant.create(plantData)
    console.log(`🌱 Database seeded with ${plantsAdded.length} plants`)

    await mongoose.connection.close()
    console.log('👋 Bye')

  } catch (err) {
    console.log(err)

    await mongoose.connection.close()
    console.log('🚨 Connection closed due to failure')
  }
}
seedDatabase()