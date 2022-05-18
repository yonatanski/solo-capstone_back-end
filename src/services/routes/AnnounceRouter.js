import express from "express"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { adminOnlyMiddleware } from "../auth/adminOnlyMiddleware.js"
import { JWTAuthMiddleware } from "../auth/token.js"
import UserModel from "../models/User.js"
import ProductModel from "../models/Product.js"
import AnccounceModel from "../models/Annoncemnt.js"
import ImageModel from "../models/Image.js"
import productValidation from "../validation/productValidation.js"
import anncouncmentValidation from "../validation/anncouncmentValidation.js"

const anncounceRouter = express.Router()

// *********************************************** CREATE(POST) Anncouncment  ***********************************************
anncounceRouter.post("/", anncouncmentValidation, JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const newAnncoucment = new AnccounceModel(req.body)
      const createdMessage = await newAnncoucment.save()
      console.log(createdMessage)

      if (createdMessage) {
        res.send(createdMessage)
      } else {
        next(createHttpError(401, "Credentials are not ok!"))
      }
    } else {
      next(createHttpError(404, "wrong body!!", { errorsList }))
    }
  } catch (error) {
    next(error)
    console.log(error)
  }
})

// *********************************************** PUT PRODUCT  with id LIKE ADMIN ***********************************************
anncounceRouter.put("/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const user = await AnccounceModel.findByIdAndUpdate(req.params.userId, req.body, { new: true })
    res.send(user)
  } catch (error) {
    next(error)
  }
})

// *********************************************** GET ALL  PUBLIC() PRODUCT  ***********************************************
anncounceRouter.get("/", async (req, res, next) => {
  try {
    const products = await AnccounceModel.find().sort({ createdAt: -1 }).limit(1)

    res.status(200).send(products)
  } catch (error) {
    next(createError(401, "Credentials are not ok!"))
    next(error)
  }
})
//*********************************************** GET with id PUBLIC() PRODUCT ***********************************************
anncounceRouter.get("/:productId", async (req, res, next) => {
  try {
    const Product = await ProductModel.findById(req.params.productId)
    res.send(Product)
  } catch (error) {
    next(error)
  }
})

//*********************************************** PUT with id LIKE ADMIN  ***********************************************
anncounceRouter.delete("/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const user = await ProductModel.findByIdAndDelete(req.params.userId)
    if (user) {
      res.send({ message: `USER WITH ID ${req.params.userId} DELTED SUCCESSFULLY!` })
    } else {
      next(createHttpError(404, `USER witth id${req.params.userId} found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default anncounceRouter
