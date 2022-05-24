import User from '../models/users.js'
import jwt from 'jsonwebtoken' // jwt is going to provide methods to create a token

// METHOD: GET
// Endpoint: /profile/:userId
// Description: Return current user's profile information with added fields createdPlants
export const getProfile = async (req, res) => {
  const { userId } = req.params
  try {
    // Retrieve profile information
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
// Description: Modifies the current user's bio
export const updateProfile = async (req, res) => {
  const { userId } = req.params
  const { body: userEdits } = req

  try {
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

    const token = jwt.sign({ sub: updatedUser._id, username: updatedUser.username, profilePicture: updatedUser.image }, process.env.SECRET, { expiresIn: '2d' })
    return res.status(200).json({ message: `Update profile successful, ${updatedUser.username}`, token: token })
  } catch (err) {
    console.log('ERRRR ==>', err)
    return res.status(404).json(err)
  }
}

// METHOD: GET
// Endpoint: /profile/user/:username
// Description: Return current user's profile information by username instead of by id
export const getProfileByUsername = async (req, res) => {
  const { username } = req.params
  try {
    // Retrieve profile information
    const profile = await User.find({ username: username }).populate('createdPlants')
    if (!profile) throw new Error('User not found')
    return res.status(200).json(profile)
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Unauthorised' })
  }
}