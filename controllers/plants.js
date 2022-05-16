import Plant from '../models/plants.js'



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
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" })
    }
    return res.status(200).json(plant)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Something went wrong." })
  }
}

//METHOD PUT
// plants/:id
// update single plant
export const updatePlant = async (req, res) => {
  const { id } = req.params
  const { body: editPlant } = req
  try {
    const updatedPlant = await Plant.findById(id)
    
    // Check user making request is owner of tapa document
    // if (!updatedPlant.owner.equals(verifiedUser._id)) throw new Error('Unauthorised')

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
