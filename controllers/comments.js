import Plant from '../models/plants.js'

// METHOD: POST
// Endpoint: /plants/:id/comments
// Description: Add a comment to a plant
export const addComment = async (req, res) => {
  const { id } = req.params
  try {
    const plantToUpdate = await Plant.findById(id)
    if (!plantToUpdate) throw new Error('Plant not found')

    // Create a comment with an owner
    const commentWithOwner = { ...req.body, owner: req.verifiedUser._id }
    console.log('commentWithOwner', commentWithOwner)

    // Add commentWithOwner into plantToUpdate.comments
    plantToUpdate.comments.push(commentWithOwner)
    

    // Save updated tapa
    await plantToUpdate.save()

    // Send new document back to user
    return res.status(200).json(commentWithOwner)
  } catch (err) {
    console.log(err)
    return res.status(422).json(err)
  }
}