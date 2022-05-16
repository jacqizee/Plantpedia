import express from 'express'

import { getAllPlants, getSinglePlant, addPlant, updatePlant, deletePlant } from '../controllers/plants.js'
import { registerUser, loginUser } from '../controllers/auth.js'
import { secureRoute } from './secureRoute.js'
import { addComment, deleteComment } from '../controllers/comments.js'
import { getProfile } from '../controllers/users.js'

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

router.route('/plants/:id/comments/:commentId')
  .delete(secureRoute, deleteComment)



//users
router.route('/register')
  .post(registerUser)

router.route('/login')
  .post(loginUser)  

router.route('/profile/:userId')
  .get(secureRoute, getProfile)


export default router