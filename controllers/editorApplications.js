import Plant from '../models/plants.js'
import User from '../models/users.js'
import { EditorApplication } from '../models/editorApplications.js'

// METHOD: POST
// Endpoint: /editor-application
// Description: Add an editor application
export const addEditorApplication = async (req, res) => {
  console.log('req body is: ', req.body)
  try {
      
    // Create submitted application with an owner
    const submittedApplication = { ...req.body, owner: req.verifiedUser._id, username: req.verifiedUser.username }
   
    //check comment owner username matches username of commenter
    const checkUser = await User.findById(req.verifiedUser._id)
    if (checkUser.username !== req.verifiedUser.username) throw new Error('Username does not match!')

    await EditorApplication.create(submittedApplication)
    console.log('commentWithOwner', submittedApplication)

    // Update application status of checkUser
    checkUser.hasApplied = true

    // Save updated user
    await checkUser.save()

    // Send new document back to user
    return res.status(200).json(submittedApplication)
  } catch (err) {
    console.log(err)
    return res.status(422).json(err)
  }
}