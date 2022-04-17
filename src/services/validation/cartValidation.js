import { body } from "express-validator"

const cartValidation = [body("userId").exists().withMessage("userId is required").isString().withMessage("userId must be string"), body("products").exists().withMessage("products is required")]

export default cartValidation
