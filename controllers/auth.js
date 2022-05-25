import User from '../models/users.js'
import jwt from 'jsonwebtoken' // using jwt to generate tokens
import 'dotenv/config'

// METHOD: POST
// Endpoint: /register
// Description: req.body that contains username, email, password and passwordConfirmation and submit it to our model for validation
export const registerUser = async (req, res) => {
  try {
    // Submit our req.body to our model
    const newUser = await User.create(req.body)
    return res.status(202).json({ message: `Welcome ${newUser.username}` })
  } catch (err) {
    console.log(err)
    return res.status(422).json(err)
  }
}

// METHOD: POST
// Endpoint: /login
// Description: Log in user by checking password matches email
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // check to see if a user exists with the same email passed in the login request
    const userToLogin = await User.findOne({ email: email })
    
    // make sure the plain text password on req.body.password matches the hashed password on the returned document
    if (!userToLogin || !userToLogin.validatePassword(password)){
      throw new Error()
    }    

    // Generating a token to be sent to the user that contains userId, username, and profile picture so it can be accessed from anywhere on the site
    const token = jwt.sign({ sub: userToLogin._id, username: userToLogin.username, profilePicture: userToLogin.image }, process.env.SECRET, { expiresIn: '2d' })
    
    return res.status(200).json({ message: `Welcome back ${userToLogin.username}`, token: token })
  } catch (err) {
    console.log(err)
    return res.status(422).json({ message: 'Unauthorised' })
  }
}