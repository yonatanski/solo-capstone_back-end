import { body } from "express-validator"

const productValidation = [
  body("title").exists().withMessage("title is required").isString().withMessage("username must be string"),
  body("desc").exists().withMessage("desc is required").isString().withMessage("desc must be string"),
  body("img").exists().withMessage("img is required").isString().withMessage("img must be string"),
  body("categories").exists().withMessage("img is required"),
  body("size").exists().withMessage("size is required").isLength({ max: 3 }),
  body("color").exists().withMessage("color is required"),
  body("price").exists().withMessage("price is required").isNumeric().withMessage("price must be number"),
]

export default productValidation
