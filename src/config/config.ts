import dotenv from 'dotenv'
import path from 'path'
import { SignOptions } from 'jsonwebtoken'

dotenv.config({ path: path.join(__dirname, '../../.env') })

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-list',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
} as const 