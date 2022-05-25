import Plant from '../models/plants.js'
import User from '../models/users.js'
import { EditorApplication } from '../models/editorApplications.js'

// METHOD: POST
// Endpoint: /editor-application
// Description: Add a user's application to become an editor, runs after secure route
export const addEditorApplication = async (req, res) => {

  try {
      
    // Create submitted application with an owner
    const submittedApplication = { ...req.body, owner: req.verifiedUser._id, username: req.verifiedUser.username }
   
    //check application owner username matches username of applicant
    const checkUser = await User.findById(req.verifiedUser._id)
    if (checkUser.username !== req.verifiedUser.username) throw new Error('Username does not match!')

    // Add the editor application to the database
    await EditorApplication.create(submittedApplication)

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