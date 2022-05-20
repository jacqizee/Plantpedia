import jwt from 'jsonwebtoken' // provides verify method
import User from '../models/users.js'
import 'dotenv/config'

export const secureRoute = async (req, res, next) => {
  console.log('🚨 HIT THE SECURE ROUTE')
  try {
    
    console.log('HEADERS ->', req.headers)
    if (!req.headers.authorization) throw new Error('Missing header')
    
    const token = req.headers.authorization.replace('Bearer ', '')
    // console.log('token ->', token)
    console.log(token)
    
    const payload = jwt.verify(token, process.env.SECRET)
    console.log('payload ->', payload)
    
    const userToVerify = await User.findById(payload.sub)

    
    if (!userToVerify) throw new Error('User not found')

    
    req.verifiedUser = userToVerify

    
    next()

  } catch (err) {
    console.log(err)
    return res.status(401).json(err)
  }
}