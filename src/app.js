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

/**
 * @openapi
 * /api/total_price:
 *  post:
 *    summary: Calculate total price based on organization and item
 *    tags: [Pricing]
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              zone:
 *                type: string
 *                default: central
 *              total_distance:
 *                type: integer
 *                default: 12
 *              organization_id:
 *                type: number
 *                default: 1
 *              item_type:
 *                type: string
 *                default: perishable
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                totalPrice:
 *                  type: number
 *                final:
 *                  type: object
 *                  properties:
 *                    organization_id: { type: "integer" }
 *                    item_id: { type: "integer" }
 *                    zone: { type: "string" }
 *                    base_distance_in_km: { type: "number" }
 *                    km_price: { type: "number" }
 *                    fix_price: { type: "number" }
 */
app.post('/api/total_price', validateInput, getTotalPrice)

export { app }
