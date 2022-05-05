import express from "express"
import createError from "http-errors"
import { adminOnlyMiddleware } from "../auth/adminOnlyMiddleware.js"
import { JWTAuthMiddleware } from "../auth/token.js"
import UserModel from "../models/User.js"

const userRouter = express.Router()

// *********************************************** GET ALL LIKE ADMIN ***********************************************
userRouter.get("/", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  const query = req.query.new
  try {
    const users = query ? await UserModel.find().sort({ _id: -1 }).limit(5) : await UserModel.find()
    res.status(200).send(users)
  } catch (error) {
    next(createError(401, "Credentials are not ok!"))
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
//*********************************************** GET USER STATS LIKE ADMIN  ***********************************************
userRouter.get("/stats", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  const date = new Date()
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1)) // last year today
  console.log(lastYear)

  try {
    const data = await UserModel.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ])
    res.status(200).send(data)
  } catch (err) {
    res.status(500).json(err)
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
