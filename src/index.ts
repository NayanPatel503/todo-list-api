import express from 'express'
import cors from 'cors'
import { config } from './config/config'
import { connectDB } from './databaseConnection/mongoConnection'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
})

// Start server
app.listen(config.port, async () => {
    console.log('=================================')
    console.log(`Server is running on port ${config.port}`)
    console.log(`Environment: ${config.nodeEnv}`)
  
    // Connect to MongoDB
    await connectDB()
  
    console.log('=================================')
  });