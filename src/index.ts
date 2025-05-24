import express from 'express'
import cors from 'cors'
import { config } from './config/config'
import { connectDB } from './databaseConnection/mongoConnection'
import { requestLogger } from './middleware/logger'

import { setupCronJob } from './services/cronService'

import authRoutes from './routes/authRoutes'
import todoRoutes from './routes/todoRoutes'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)

// Start server
app.listen(config.port, async () => {
    console.log('=================================')
    console.log(`Server is running on port ${config.port}`)
    console.log(`Environment: ${config.nodeEnv}`)

    // Connect to MongoDB
    await connectDB()

    // Setup CRON job
    setupCronJob()

    console.log('=================================')
})