import mongoose from 'mongoose'
import { config } from '../config/config'

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongodbUri)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    
    // Return a promise that resolves when the connection is ready
    return new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 1) {
        resolve()
      } else {
        mongoose.connection.once('connected', () => {
          resolve()
        })
        mongoose.connection.once('error', (err) => {
          reject(err)
        })
      }
    })
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB')
})

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close()
    console.log('Mongoose connection closed through app termination')
    process.exit(0)
  } catch (err) {
    console.error('Error during mongoose connection closure:', err)
    process.exit(1)
  }
}) 