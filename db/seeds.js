import mongoose from 'mongoose'
import Plant from '../models/plants.js'
import User from '../models/users.js'
import { Comment } from '../models/comments.js'
import plantData from './data/plants.js'
import userData from './data/users.js'
import commentData from './data/comments.js'

import 'dotenv/config'
import comments from './data/comments.js'

const seedDatabase = async () => {
  try {

    // Connect to the database
    await mongoose.connect(process.env.MONGO_DB)
    console.log('🚀 Database connected')

    // Remove all the data from the database
    await mongoose.connection.db.dropDatabase()
    console.log('👍 Database dropped')

    // Add Users
    const usersAdded = await User.create(userData)

    // Add seed comments with randomized owners
    const commentsWithOwners = commentData.map(comment => {
      const randUser = Math.floor(Math.random() * (usersAdded.length))
      return { ...comment, owner: usersAdded[randUser]._id, username: usersAdded[randUser].username }
    })

    // Add comments with randomized owners to the database
    const commentsAdded = await Comment.create(commentsWithOwners)

    // Adding a random owner to each plant
    const plantsWithOwners = plantData.map(plant => {
      const randUser = Math.floor(Math.random() * (usersAdded.length))
      return { ...plant, owner: usersAdded[randUser]._id, lastEdit: usersAdded[randUser]._id }
    })

    // Adding comments to the plantsWithOwners
    let i = 0
    const plantsWithComments = plantsWithOwners.map(plant => {
      let commentArray = []
      commentArray = [commentsAdded[i], commentsAdded[i + 1], commentsAdded[i + 2]]
      i += 3
      return { ...plant, comments: commentArray }
    })

    // Adding the plant to the database
    const plantsAdded = await Plant.create(plantsWithComments)
    console.log(`🌱 Database seeded with ${plantsAdded.length} plants`)

    // Close the connection to the database
    await mongoose.connection.close()
    console.log('👋 Bye')

  } catch (err) {
    console.log(err)

    await mongoose.connection.close()
    console.log('🚨 Connection closed due to failure')
  }
}
seedDatabase()