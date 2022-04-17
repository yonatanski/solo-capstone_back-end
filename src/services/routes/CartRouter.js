import express from "express"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"

import { adminOnlyMiddleware } from "../auth/adminOnlyMiddleware.js"
import { JWTAuthMiddleware } from "../auth/token.js"
import CartModel from "../models/Cart.js"
import ProductModel from "../models/Product.js"
import cartValidation from "../validation/cartValidation.js"

const cartRouter = express.Router()

// *********************************************** CREATE(POST) CART  ***********************************************
cartRouter.post("/admin", cartValidation, JWTAuthMiddleware, async (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const newCart = new CartModel(req.body)
      const createdCart = await newCart.save()
      console.log(createdOrder)

      if (createdCart) {
        res.send(createdCart)
      } else {
        next(createError(401, "Credentials are not ok!"))
      }
    } else {
      next(createHttpError(400, "wrong body!!", { errorsList }))
    }
  } catch (error) {
    next(error)
  }
})

// *********************************************** GET user CART  ***********************************************
cartRouter.get("/find/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const cart = await CartModel.findOne({ userId: req.params.userId })
    if (cart) {
      res.status(200).send(cart)
    } else {
      next(createError(404, "ORDER NOT FOUND!"))
    }
  } catch (error) {
    next(error)
  }
})
// *********************************************** GET all  CART as a ADMIN  ***********************************************
cartRouter.get("/", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const cart = await CartModel.find()
    if (cart) {
      res.status(200).send(cart)
    } else {
      next(createError(404, "ORDER NOT FOUND!"))
    }
  } catch (error) {
    next(error)
  }
})
// *********************************************** EDIT  CART as a USER  ***********************************************
cartRouter.put("/:orderId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedCart = await CartModel.findByIdAndUpdate(
      req.params.orderId,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).send(updatedCart)
  } catch (error) {
    next(error)
  }
})
// *********************************************** DELETE  CART as a USER  ***********************************************
cartRouter.delete("/:orderId", JWTAuthMiddleware, async (req, res) => {
  try {
    await CartModel.findByIdAndDelete(req.params.orderId)
    res.status(204).json("Cart has been deleted...")
  } catch (err) {
    res.status(500).json(err)
  }
})

export default cartRouter
