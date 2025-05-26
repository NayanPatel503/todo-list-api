import express from 'express'
import cluster from 'cluster'
import os from 'os'
import cors from 'cors'

import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger'
import { config } from './config/config'
import { connectDB } from './databaseConnection/mongoConnection'
import { requestLogger } from './middleware/logger'

import { setupCronJob } from './services/cronService'

import authRoutes from './routes/authRoutes'
import todoRoutes from './routes/todoRoutes'

const numCPUs = os.cpus().length

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`)
  console.log(`Forking for ${numCPUs} CPUs`)

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`)
    console.log('Starting a new worker')
    cluster.fork()
  })
} else {
  const app = express()

  // Middleware
  app.use(cors())
  app.use(express.json())
  app.use(requestLogger)

  // API Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Routes
  app.use('/api/auth', authRoutes)
  app.use('/api/todos', todoRoutes)

  // Start server
  app.listen(config.port, async () => {
    console.log('=================================')
    console.log(`Worker ${process.pid} started`)
    console.log(`Server is running on port ${config.port}`)
    console.log(`Environment: ${config.nodeEnv}`)

    // Connect to MongoDB
    await connectDB()

    // Setup CRON job
    setupCronJob()

    console.log('=================================')
  })
}