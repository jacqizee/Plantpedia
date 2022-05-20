import User from '../models/users.js'

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
  console.log('update profile hit')
}