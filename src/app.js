import express, { urlencoded } from 'express'
import cors from 'cors'
import { getTotalPrice } from './controllers/pricing.controller.js'
import { validateInput } from './middleware/validateInput.middleware.js'
import itemsRouter from './routes/items.route.js'
import organizationsRouter from './routes/organizations.route.js'
import pricingRouter from './routes/pricing.route.js'

const app = express()

app.use(cors({ origin: process.env.CORS_URL, credentials: true }))
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/items/', itemsRouter)
app.use('/api/organizations/', organizationsRouter)
app.use('/api/pricings/', pricingRouter)

app.post('/api/total_price', validateInput ,getTotalPrice)

export { app }
