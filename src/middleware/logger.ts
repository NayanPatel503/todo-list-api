import { Request, Response, NextFunction } from 'express'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  const { method, originalUrl, ip } = req
  const userAgent = req.get('user-agent') || 'Unknown'
  const pid = process.pid

  // Log request
  console.log(`\n[${new Date().toISOString()}] [Worker ${pid}] ${method} ${originalUrl}`)
  console.log(`IP: ${ip}`)
  console.log(`User-Agent: ${userAgent}`)
  
  if (Object.keys(req?.body || {}).length > 0) {
    console.log('Request Body:', JSON.stringify(req?.body))
  }

  // Capture response
  const originalSend = res.send
  res.send = function (body) {
    const responseTime = Date.now() - start
    const statusCode = res.statusCode
    
    // Log response
    console.log(`[${new Date().toISOString()}] Response Status: ${statusCode}`)
    console.log(`Response Time: ${responseTime}ms`)
    console.log('----------------------------------------')
    
    return originalSend.call(this, body)
  }

  next()
} 