import Joi from '@hapi/joi'

const organizationSchema = Joi.object({
  name: Joi.string().required(),
})

const itemSchema = Joi.object({
  type: Joi.string().required(),
  description: Joi.string().required(),
})

const pricingSchema = Joi.object({
  organization_id: Joi.number().integer().required(),
  item_id: Joi.number().integer().required(),
  zone: Joi.string().required(),
  base_distance_in_km: Joi.number().optional().default(5),
  km_price: Joi.number().optional().default(1.5),
  fix_price: Joi.number().optional().default(10),
})


const schema = Joi.object({
  zone: Joi.string().required(),
  organization_id: Joi.number().integer().required(),
  total_distance: Joi.number().required(),
  item_type: Joi.string().required(),
})

export { schema, organizationSchema, itemSchema, pricingSchema }