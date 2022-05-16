import mongoose from 'mongoose'
import Plant from '../models/plants.js'
import User from '../models/users.js'
import plantData from './data/plants.js'
import userData from './data/users.js'

import 'dotenv/config'

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB)
    console.log('🚀 Database connected')

    await mongoose.connection.db.dropDatabase()
    console.log('👍 Database dropped')

    const usersAdded = await User.create(userData)

    const plantsWithOwners = plantData.map(plant => {
      return { ...plant, owner: usersAdded[0]._id, lastEdit: usersAdded[0]._id }
    })

    const plantsAdded = await Plant.create(plantsWithOwners)
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