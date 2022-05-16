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