import User from '../models/users.js'
import jwt from 'jsonwebtoken' // jwt is going to provide methods to create a token

// METHOD: GET
// Endpoint: /profile/:userId
// Description: Return current user's profile by ID, runs after secure route
export const getProfile = async (req, res) => {
  const { userId } = req.params
  try {
    // Retrieve profile information
    // If the user is getting the user's own data, populate the user's comment history in the virtual field
    // If not, don't populate comment history
    if (req.verifiedUser._id.equals(userId)) {
      const profile = await User.findById(req.verifiedUser._id).populate('createdPlants').populate('createdComments')
      if (!profile) throw new Error('User not found')
      return res.status(200).json(profile)
    } else {
      const profile = await User.findById(userId).populate('createdPlants')
      if (!profile) throw new Error('User not found')
      return res.status(200).json(profile)
    }
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Unauthorised' })
  }
}

// METHOD: PUT
// Endpoint: /profile/:userId
// Description: Modifies the current user's bio, runs after secure router
export const updateProfile = async (req, res) => {
  const { userId } = req.params
  const { body: userEdits } = req

  try {
    // Retrieve the user by ID
    const updatedUser = await User.findById(userId)

    // Update the document
    Object.assign(updatedUser, userEdits)

    // Save the document
    await updatedUser.save()

    if (!updatedUser){
      return res.status(404).json({
        message: 'User not found',
      })
    }

    // Update the token with the newly updated ID, username, and profile picture information information
    const token = jwt.sign({ sub: updatedUser._id, username: updatedUser.username, profilePicture: updatedUser.image }, process.env.SECRET, { expiresIn: '2d' })

    // Send back the token
    return res.status(200).json({ message: `Update profile successful, ${updatedUser.username}`, token: token })

  } catch (err) {
    console.log('ERRRR ==>', err)
    return res.status(404).json(err)
  }
}

// METHOD: GET
// Endpoint: /profile/user/:username
// Description: Return current user's profile information by username instead of by id, runs after secure route
export const getProfileByUsername = async (req, res) => {
  const { username } = req.params
  try {
    // Retrieve profile information
    const profile = await User.find({ username: username }).populate('createdPlants')

    // Return an error if user not found
    if (!profile) throw new Error('User not found')

    // Return the profile information if the user is found
    return res.status(200).json(profile)
    
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Unauthorised' })
  }
}