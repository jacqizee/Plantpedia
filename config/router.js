import express from 'express'

import { getAllPlants, getSinglePlant, addPlant, updatePlant, deletePlant } from '../controllers/plants.js'
import { registerUser, loginUser } from '../controllers/auth.js'
import { secureRoute } from './secureRoute.js'
import { addComment } from '../controllers/comments.js'

const router = express.Router()


//Routes
//Generic

router.route('/plants')
  .get(getAllPlants)
  .post(secureRoute, addPlant)

//specific
router.route('/plants/:id')
  .get(getSinglePlant)
  .put(secureRoute, updatePlant)
  .delete(secureRoute, deletePlant)



//comments
router.route('/plants/:id/comments')
  .post(secureRoute, addComment)



//users
router.route('/register')
  .post(registerUser)

router.route('/login')
  .post(loginUser)  



export default router