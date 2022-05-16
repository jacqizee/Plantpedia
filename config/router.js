import express from 'express'

import { getAllPlants, getSinglePlant } from '../controllers/plants.js'

const router = express.Router()


//Routes
//Generic

router.route('/plants')
  .get(getAllPlants)

//specific
router.route('/plants/:id')
  .get(getSinglePlant)



export default router