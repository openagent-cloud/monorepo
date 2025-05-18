import axios from 'axios'
import { createLogger } from './logger'

const logger = createLogger('API')

// Get the API URL from env variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5851/api'

// Log the API URL for debugging
logger.info(`Using API URL: ${API_URL}`)

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add longer timeout for slow connections
  timeout: 10000,
})

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    logger.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    logger.info(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    if (error.response) {
      logger.error(`API Error ${error.response.status}:`, error.response.data)
    } else if (error.request) {
      logger.error('API Error: No response received', error.request)
    } else {
      logger.error('API Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
