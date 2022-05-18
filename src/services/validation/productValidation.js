import { body } from "express-validator"

const productValidation = [
  body("title").exists().withMessage("title is required").isString().withMessage("username must be string"),
  body("desc").exists().withMessage("desc is required").isString().withMessage("desc must be string"),
  body("img").exists().withMessage("img is required").isArray().withMessage("img must be string"),
  body("categories").exists().withMessage("img is required").isArray().withMessage("img must be string"),
  body("size").exists().withMessage("size is required").isArray().withMessage("img must be string"),
  body("color").exists().withMessage("color is required").isArray().withMessage("img must be string"),
  body("price").exists().withMessage("price is required"),
]

export default productValidation
