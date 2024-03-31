import { Router } from "express";
import { addItem, deleteItem, getAllItems } from "../controllers/items.controller.js";
import { itemSchema } from "../utils/validationSchema.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router()

router.route('/').post((req, res, next) => {
    const { error } = itemSchema.validate(req.body)
    if (error) {
      return res.status(400).json(new ApiError(400, error.details[0].message))
    }
    next()
},addItem).get(getAllItems)

router.route('/:id').delete(deleteItem)

export default router;