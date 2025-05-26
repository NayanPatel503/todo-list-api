import { Request, Response } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import { User } from '../models/User'
import { config } from '../config/config'

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists',
        data: {}
      })
      return
    }

    // Create new user
    const user = new User({ email, password })
    await user.save()

    // Generate token
    const options: SignOptions = { expiresIn: config.jwtExpiresIn }
    const token = jwt.sign({ _id: user._id.toString() }, config.jwtSecret, options)

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          _id: user._id,
          email: user.email
        },
        token
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: {}
      })
      return
    }

    // Check password
    // const isMatch = await bcrypt.compare(password, user.password)
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: {}
      })
      return
    }

    // Generate token
    const options: SignOptions = { expiresIn: config.jwtExpiresIn }
    const token = jwt.sign({ _id: user._id.toString() }, config.jwtSecret, options)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          email: user.email
        },
        token
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
} 