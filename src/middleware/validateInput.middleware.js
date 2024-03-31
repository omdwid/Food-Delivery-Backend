import { schema } from "../utils/validationSchema.js";

export const validateInput = (req, res, next) => {

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  next();
};