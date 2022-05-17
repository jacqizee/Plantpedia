import Plant from '../models/plants.js'
import { Comment } from '../models/comments.js'

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
    await Comment.create(commentWithOwner)
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

// METHOD: DELETE
// Endpoint: /delete/:id/comments/:commentId
// Description: Deleting a single comment
export const deleteComment = async (req, res) => {
  const { id, commentId } = req.params
  try {
    const plant = await Plant.findById(id)
    if (!plant) throw new Error('Plant not found')

    // get comment to delete
    const commentToDelete = plant.comments.id(commentId)
    if (!commentToDelete) throw new Error('Comment not found')
    if (!commentToDelete.owner.equals(req.verifiedUser._id)) throw new Error('Unauthorised')

    // Firstly we'll remove the subdocument from the comments array
    await commentToDelete.remove()

    // Secondly we'll save our document
    await plant.save()

    // Return 204 status to user
    return res.sendStatus(204)
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Unauthorised' })
  }
}

