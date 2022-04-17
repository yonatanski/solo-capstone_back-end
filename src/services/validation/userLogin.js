import { body } from "express-validator"

const userLoginValidation = [
  body("email")
    .exists()
    .isEmail()
    .withMessage("Email is required and must be a valid email")
    .custom((value, { req }) => {
      if (value.includes("hotmail.com")) {
        throw new Error("Email address is not valid")
      }
      return true
    })
    .withMessage("You cant use invalid provider."),

  body("password").exists().isString().isLength({ min: 6 }).withMessage("Password Required").withMessage("Password should be Minmum 6 charachter"),
]
export default userLoginValidation
