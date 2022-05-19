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
    const plant = await Plant.findById(id).populate('comments')
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
    updatedPlant.lastEdit = verifiedUser._id
    if (!verifiedUser.myEdits.includes(id) && !updatedPlant.owner.equals(verifiedUser._id)) {
      verifiedUser.myEdits.push(id)
    }

    // Update the document
    Object.assign(updatedPlant, editPlant)

    // Save the document
    await updatedPlant.save()

    if (!updatedPlant){
      return res.status(404).json({
        message: 'Plant not found',
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

    // if (!plantToDelete.owner.equals(req.verifiedUser._id)){
    //   console.log('🆘 Failed at owner check')
    //   throw new Error('Unauthorised')
    // }
    // 
    // await User.findByIdAndDelete(id)
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