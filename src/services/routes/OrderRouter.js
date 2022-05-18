import express from "express"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"

import { adminOnlyMiddleware } from "../auth/adminOnlyMiddleware.js"
import { JWTAuthMiddleware } from "../auth/token.js"
import OrderModel from "../models/Order.js"
import ProductModel from "../models/Product.js"
import orderValidation from "../validation/orderValidation.js"

const orderRouter = express.Router()

// *********************************************** CREATE(POST) ORDER  ***********************************************
orderRouter.post("/admin", orderValidation, JWTAuthMiddleware, async (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const newOrder = new OrderModel(req.body)
      const createdOrder = await newOrder.save()
      console.log(createdOrder)

      if (createdOrder) {
        res.send(createdOrder)
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
//GET USER ORDERS
// *********************************************** GET USER ORDERS   ***********************************************
orderRouter.get("/find/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const order = await OrderModel.find({ userId: req.params.userId })
    if (order) {
      res.status(200).send(order)
    } else {
      next(createError(404, "ORDER NOT FOUND!"))
    }
  } catch (error) {
    next(error)
  }
})
orderRouter.get("/:orderId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const order = await OrderModel.find({ _id: req.params.orderId })
    if (order) {
      res.status(200).send(order)
    } else {
      next(createError(404, "ORDER NOT FOUND!"))
    }
  } catch (error) {
    next(error)
  }
})
// *********************************************** GET ALL USER ORDERS as ADMIN  ***********************************************
orderRouter.get("/", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const order = await OrderModel.find()
    if (order) {
      res.status(200).send(order)
    } else {
      next(createError(404, "ORDER NOT FOUND!"))
    }
  } catch (error) {
    next(error)
  }
})
// *********************************************** GET INCOME as ADMIN  ***********************************************
orderRouter.get("/income", JWTAuthMiddleware, async (req, res, next) => {
  const productId = req.query.productId
  const date = new Date()
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

  try {
    const income = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ])
    res.status(200).send(income)
  } catch (error) {
    next(error)
  }
})

orderRouter.put("/:orderId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.orderId,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).send(updatedOrder)
  } catch (error) {
    next(error)
  }
})
export default orderRouter
