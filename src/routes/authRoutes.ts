import express from 'express'
import { signup, login } from '../controllers/authController'
import { signupValidation, loginValidation } from '../middleware/validators/authValidators'
import { validateRequest } from '../middleware/validators/validateRequest'

const router = express.Router()

router.post('/signup', signupValidation, validateRequest, signup)
router.post('/login', loginValidation, validateRequest, login)

export default router 