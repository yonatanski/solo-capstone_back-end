import { body } from "express-validator"

const orderValidation = [
  body("userId").exists().withMessage("userId is required").isString().withMessage("userId must be string"),
  body("products").exists().withMessage("products is required"),
  body("amount").exists().withMessage("amount is required"),
  body("address").exists().withMessage("address is required"),
]

export default orderValidation
