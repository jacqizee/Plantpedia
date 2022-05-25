import jwt from 'jsonwebtoken' // provides verify method
import User from '../models/users.js'
import 'dotenv/config'

export const secureRoute = async (req, res, next) => {
  console.log('🚨 HIT THE SECURE ROUTE')
  try {

    // Check to see an Authorization header exists
    if (!req.headers.authorization) throw new Error('Missing header')
    
    // Remove Bearer from the beginning of the token
    const token = req.headers.authorization.replace('Bearer ', '')

    // Verify the token using a method provided by jwt
    const payload = jwt.verify(token, process.env.SECRET)

    // verify that the user still exists by running the findById method
    const userToVerify = await User.findById(payload.sub)

    // If it returns a user, we've successfully verified them
    if (!userToVerify) throw new Error('User not found')

    // update the req object that is going to be passed to the controller
    req.verifiedUser = userToVerify

    // pass the request onto the controller
    next()

  } catch (err) {
    console.log(err)
    return res.status(401).json(err)
  }
}