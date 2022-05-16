import express from 'express'

import { getAllPlants } from '../controllers/plants.js'

const router = express.Router()


//Routes
//Generic

router.route('/plants')
  .get(getAllPlants)



export default router