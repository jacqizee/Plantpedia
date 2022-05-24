import Plant from '../models/plants.js'
import User from '../models/users.js'

//METHOD: GET
//Endpoint: /plants
//get all plants
export const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find()
    return res.status(200).json(plants)
  } catch (err) {
    console.log(err)
    return res.status(404).json(err)
  }
}

//METHOD GET
// plants/:id
// get single plant
export const getSinglePlant = async (req, res) => {
  const { id } = req.params
  try {
    const plant = await Plant.findById(id)
      .populate('ownerUsername', 'username')
      .populate('lastEditUsername', 'username')
      .populate({
        path: 'comments',
        populate: {
          path: 'image',
          select: 'image'
        }
      })
      // .populate('comments')
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" })
    }
    return res.status(200).json(plant)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Something went wrong." })
  }
}

// METHOD: POST
// Endpoint: /plants
// Description: POST request that adds a new plant to the db
export const addPlant = async (req, res) => {
  const { body: newPlant } = req
  try {
    console.log('req.body ->', newPlant)
    const addedPlant = await Plant.create({ ...newPlant, owner: req.verifiedUser._id, lastEdit: req.verifiedUser._id })

    return res.status(200).json(addedPlant)
  } catch (err) {
    console.log("Can't add this plant!")
    console.log(err)
    return res.status(400).json(err)
  }
}

//METHOD PUT
// plants/:id
// update single plant
export const updatePlant = async (req, res) => {
  const { id } = req.params
  const { body: editPlant, verifiedUser } = req
  try {
    const updatedPlant = await Plant.findById(id)

    // if (!updatedPlant.owner.equals(verifiedUser._id)) throw new Error('Unauthorised')

    // Update myEdits and lastEdit
    editPlant.lastEdit = verifiedUser._id
    if (!editPlant.editors.includes(verifiedUser._id) && !updatedPlant.owner.equals(verifiedUser._id)) {
      editPlant.editors.push(verifiedUser._id)
    } 
    if (!verifiedUser.myEdits.includes(id) && !updatedPlant.owner.equals(verifiedUser._id)) {
      console.log('The if statement runs 🏃🏻‍♂️')
      verifiedUser.myEdits.push(id)
    }
    
    console.log('updated plant is: ', updatedPlant)
    console.log('verified user is: ', verifiedUser)

    // Update the document
    Object.assign(updatedPlant, editPlant)

    // Save the document
    await updatedPlant.save()
    await verifiedUser.save()

    if (!updatedPlant){
      return res.status(404).json({
        message: 'Plant not found',
      })
    }

    if (!verifiedUser){
      return res.status(404).json({
        message: 'User not found',
      })
    }
    return res.status(200).json(updatedPlant)
  } catch (err) {
    console.log('ERRRR ==>', err)
    return res.status(404).json(err)
  }
}

// METHOD: DELETE
// Endpoint: /plants/:id
// Description: Delete specified plants
export const deletePlant = async (req, res) => {
  const { id } = req.params
  try {
    // We can't send a body back due to the status code, so no need to save the response to a variable
    const plantToDelete = await Plant.findById(id)

    // Removing references to the plant among people who favorited it
    if (plantToDelete.favorites.length > 0) {
      for (let i = 0; i < plantToDelete.favorites.length; i++) {
        const userToModify = await User.findById(plantToDelete.favorites[i])
        if (userToModify.favorites.includes(id)) {
          userToModify.favorites.splice(userToModify.favorites.indexOf(id), 1)
        }
        await userToModify.save()
      }
    }

    // Removing references to the plant among people who edited it
    if (plantToDelete.editors.length > 0) {
      for (let i = 0; i < plantToDelete.editors.length; i++) {
        const userToModify = await User.findById(plantToDelete.editors[i])
        if (userToModify.myEdits.includes(id)) {
          userToModify.myEdits.splice(userToModify.myEdits.indexOf(id), 1)
        }
        await userToModify.save()
      }
    }

    await plantToDelete.remove()
    // 204 status doesn't accept a body in the response, so sendStatus ends the request as well as allowing us to still define the status
    return res.sendStatus(204)
  } catch (err) {
    return res.status(404).json(err)
  }
}

// METHOD: PUT
// Endpoint: /plants/:id/favorite
// Description: adds/removes user from favorites array
export const clickFavorite = async (req, res) => {
  const { id } = req.params
  const { _id: userId } = req.verifiedUser
  try {
    // update favorites on plant
    const plantToUpdate = await Plant.findById(id)
    const { favorites: plantFavorites } = plantToUpdate
    plantFavorites.includes(userId) ? plantFavorites.splice(plantFavorites.indexOf(userId), 1) : plantFavorites.push(userId)

    // update favorites on user
    const userToUpdate = await User.findById(userId)
    const { favorites: userFavorites } = userToUpdate
    userFavorites.includes(id) ? userFavorites.splice(userFavorites.indexOf(id), 1) : userFavorites.push(id)

    await plantToUpdate.save()
    await userToUpdate.save()
    return res.sendStatus(202)
  } catch (error) {
    console.log(error)
    return res.status(404).json(error)
  }
}