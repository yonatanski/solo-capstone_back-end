import { body } from "express-validator"

const anncouncmentValidation = [body("message").exists().withMessage("Message is required").isString().withMessage("Message must be string")]

export default anncouncmentValidation
