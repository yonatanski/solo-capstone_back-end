import express from "express"
import createError from "http-errors"
import { adminOnlyMiddleware } from "../auth/adminOnlyMiddleware.js"
import { JWTAuthMiddleware } from "../auth/token.js"
import UserModel from "../models/User.js"

const userRouter = express.Router()

// *********************************************** GET ALL LIKE ADMIN ***********************************************
userRouter.get("/", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const allUser = await UserModel.find()

    if (allUser) {
      res.send(allUser)
    } else {
      next(createError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})
// *********************************************** GET me currently loggedUSer  ***********************************************
userRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const loggedUSer = await UserModel.findById(req.user._id)

    if (loggedUSer) {
      res.send(loggedUSer)
    } else {
      next(createError(404, "User Not Found 404!!"))
    }
  } catch (error) {
    next(error)
  }
})
//*********************************************** GET with id LIKE ADMIN  ***********************************************
userRouter.get("/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId)
    res.send(user)
  } catch (error) {
    next(error)
  }
})

// *********************************************** PUT ME (LOGGED USER)  ***********************************************
userRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.user._id, req.body, { new: true })
    res.send(user)
  } catch (error) {
    next(error)
  }
})
//*********************************************** PUT with id LIKE ADMIN  ***********************************************
userRouter.put("/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.userId, req.body, { new: true })
    res.send(user)
  } catch (error) {
    next(error)
  }
})

//*********************************************** DELETE ALL || DANGEROUS  LIKE ADMIN  ***********************************************
userRouter.delete("/all", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.collection.deleteMany({})
    if (user) {
      res.send({ message: `ALL USER  DELTED SUCCESSFULLY!` })
    } else {
      next(createHttpError(404, `Operation can't be performe!!`))
    }
  } catch (error) {
    next(error)
  }
})
//*********************************************** DELETE with id  LIKE ADMIN  ***********************************************
userRouter.delete("/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.userId)
    if (user) {
      res.send({ message: `USER WITH ID ${req.params.userId} DELTED SUCCESSFULLY!` })
    } else {
      next(createHttpError(404, `USER witth id${req.params.userId} found!`))
    }
  } catch (error) {
    next(error)
  }
})
export default userRouter
