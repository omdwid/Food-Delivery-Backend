import { Router } from 'express'
import {
  addOrganization,
  deleteOrganization,
  getAllOrganizations,
} from '../controllers/organizations.controller.js'
import { organizationSchema } from '../utils/validationSchema.js'
import { ApiError } from '../utils/ApiError.js'

const router = Router()

router
  .route('/')
  .post((req, res, next) => {
    const { error } = organizationSchema.validate(req.body)
    if (error) {
      return res.status(400).json(new ApiError(400, error.details[0].message))
    }
    next()
  }, addOrganization)
  .get(getAllOrganizations)

router.route('/:id').delete(deleteOrganization)

export default router
