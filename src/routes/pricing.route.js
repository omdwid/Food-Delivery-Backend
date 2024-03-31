import { Router } from "express";
import { addItem, deleteItem, getAllItems } from "../controllers/items.controller.js";
import { pricingSchema } from "../utils/validationSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { addPricing, deletePricing, getAllPricing } from "../controllers/pricing.controller.js";

const router = Router()

router.route('/').post((req, res, next) => {
    const { error } = pricingSchema.validate(req.body)
    if (error) {
      return res.status(400).json(new ApiError(400, error.details[0].message))
    }
    next()
},addPricing).get(getAllPricing)

router.route('/').delete(deletePricing)

export default router;