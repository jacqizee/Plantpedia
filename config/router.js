import express from 'express'

import { getAllPlants, getSinglePlant, addPlant, updatePlant } from '../controllers/plants.js'

const router = express.Router()


//Routes
//Generic

router.route('/plants')
  .get(getAllPlants)
  .post(addPlant)

//specific
router.route('/plants/:id')
  .get(getSinglePlant)
  .put(updatePlant)



export default router