import express from "express"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"
import { authenticateUser } from "../auth/authntication-tools.js"

import UserModel from "../models/User.js"
import userLoginValidation from "../validation/userLogin.js"
import userRegisterValidation from "../validation/userRegister.js"

const authRouter = express.Router()
// *********************************************** REGISTER ***********************************************
authRouter.post("/register", userRegisterValidation, async (req, res, next) => {
  try {
    const errorsList = validationResult(req)

    if (errorsList.isEmpty()) {
      const newUser = new UserModel(req.body)
      const savedUser = await newUser.save()
      console.log(savedUser)
      if (savedUser) {
        const accessToken = await authenticateUser(savedUser)
        res.send({ savedUser, accessToken })
      } else {
        next(createHttpError(401, "Credentials are not ok!"))
      }
    } else {
      next(createHttpError(400, "wrong body!!", { errorsList }))
    }
  } catch (error) {
    next(error)
  }
})
// *********************************************** LOGIN ***********************************************
authRouter.post("/login", userLoginValidation, async (req, res, next) => {
  try {
    const errorsList = validationResult(req)

    if (errorsList.isEmpty()) {
      const { email, password } = req.body
      const User = await UserModel.checkCredentials(email, password)
      if (User) {
        const accessToken = await authenticateUser(User)
        res.send({ User, accessToken })
      } else {
        next(createHttpError(401, "Credentials are not ok!"))
      }
    } else {
      next(createHttpError(400, "wrong body!!", { errorsList }))
    }
  } catch (error) {
    next(error)
  }
})

export default authRouter
