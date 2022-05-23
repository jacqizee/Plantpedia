import express from 'express'

import { getAllPlants, getSinglePlant, addPlant, updatePlant, deletePlant, clickFavorite } from '../controllers/plants.js'
import { registerUser, loginUser } from '../controllers/auth.js'
import { secureRoute } from './secureRoute.js'
import { addComment, deleteComment } from '../controllers/comments.js'
import { getProfile, updateProfile, getProfileByUsername } from '../controllers/users.js'

const router = express.Router()
// Routes

// Generic
router.route('/plants')
  .get(getAllPlants)
  .post(secureRoute, addPlant)

// Specific
router.route('/plants/:id')
  .get(getSinglePlant)
  .put(secureRoute, updatePlant)
  .delete(secureRoute, deletePlant)

// Comments
router.route('/plants/:id/comments')
  .post(secureRoute, addComment)

router.route('/plants/:id/comments/:commentId')
  .delete(secureRoute, deleteComment)

// Favorites
router.route('/plants/:id/favorite')
  .put(secureRoute, clickFavorite)

// Users
router.route('/register')
  .post(registerUser)

router.route('/login')
  .post(loginUser)  

router.route('/profile/:userId')
  .get(secureRoute, getProfile)
  .put(secureRoute, updateProfile)

router.route('/profile/user/:username')
  .get(secureRoute, getProfileByUsername)


export default router