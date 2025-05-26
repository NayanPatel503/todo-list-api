import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User, IUser } from '../models/User'
import { config } from '../config/config'

interface AuthRequest extends Request {
  user?: IUser
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      throw new Error()
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { _id: string }
    const user = await User.findOne({ _id: decoded._id })

    if (!user) {
      throw new Error()
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Please authenticate.' })
  }
} 