import Plant from '../models/plants.js'
import { Comment } from '../models/comments.js'
import User from '../models/users.js'

// METHOD: POST
// Endpoint: /plants/:id/comments
// Description: Add a comment to a plant, runs after secure route
export const addComment = async (req, res) => {
  const { id } = req.params
  try {
    const plantToUpdate = await Plant.findById(id)
    if (!plantToUpdate) throw new Error('Plant not found')
      
    // Create a comment with an owner
    const commentWithOwner = { ...req.body, owner: req.verifiedUser._id, username: req.verifiedUser.username }
   
    //check comment owner username matches username of commenter
    const checkUser = await User.findById(req.verifiedUser._id)
    if (checkUser.username !== req.verifiedUser.username) throw new Error('Username does not match!')

    // Add the comment to the database
    await Comment.create(commentWithOwner)

    // Add commentWithOwner into plantToUpdate.comments
    plantToUpdate.comments.push(commentWithOwner)

    // Save updated plant
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
// Description: Deleting a single comment, runs after secure route
export const deleteComment = async (req, res) => {
  const { id, commentId } = req.params
  
  try {
    
    // Retrieve the specified plant from the database, if it doesn't exist throw an error
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

