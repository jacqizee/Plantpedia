import User from '../models/users.js'
import jwt from 'jsonwebtoken' // jwt is going to provide methods to create a token

// METHOD: GET
// Endpoint: /profile/:userId
// Description: Return current user's profile information with added fields createdPlants
export const getProfile = async (req, res) => {
  const { userId } = req.params
  console.log(userId, req.verifiedUser._id, req.verifiedUser._id.equals(userId))
  try {
    // Retrieve profile information
    if (req.verifiedUser._id.equals(userId)) {
      console.log('top')
      const profile = await User.findById(req.verifiedUser._id).populate('createdPlants').populate('createdComments')
      if (!profile) throw new Error('User not found')
      return res.status(200).json(profile)
    } else {
      console.log('bottom')
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
  console.log('params id is: ', userId)
    
  const { body: userEdits } = req
  console.log('user edits is: ', userEdits)

  try {
    const updatedUser = await User.findById(userId)
    
    console.log('updated user is: ', updatedUser)

    // Update the document
    Object.assign(updatedUser, userEdits)

    // Save the document
    await updatedUser.save()

    if (!updatedUser){
      return res.status(404).json({
        message: 'User not found',
      })
    }

    // return res.status(200).json(updatedUser)
    
    const token = jwt.sign({ sub: updatedUser._id, username: updatedUser.username, profilePicture: updatedUser.image, bio: updatedUser.bio }, process.env.SECRET, { expiresIn: '2d' })
    
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
  console.log('username from params is: ', username)
  try {
    // Retrieve profile information
    console.log('bottom')
    const profile = await User.find({ username: username }).populate('createdPlants')
    if (!profile) throw new Error('User not found')
    return res.status(200).json(profile)
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Unauthorised' })
  }
}