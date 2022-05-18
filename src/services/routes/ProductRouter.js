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

const productRouter = express.Router()

const cloudinaryProductImageUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // search automatically for process.env.CLOUDINARY_URL
    params: {
      folder: "Gebeya Shop Product",
    },
  }),
}).array("img")

// *********************************************** CREATE(POST) PRODUCT  ***********************************************
productRouter.post("/", productValidation, JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const newProduct = new ProductModel(req.body)
      const createdProduct = await newProduct.save()
      console.log(createdProduct)

      if (createdProduct) {
        res.send(createdProduct)
      } else {
        next(createError(401, "Credentials are not ok!"))
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
productRouter.put("/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const user = await ProductModel.findByIdAndUpdate(req.params.userId, req.body, { new: true })
    res.send(user)
  } catch (error) {
    next(error)
  }
})

// *********************************************** GET ALL  PUBLIC() PRODUCT  ***********************************************
productRouter.get("/", async (req, res, next) => {
  const qNew = req.query.new
  const qCategory = req.query.category
  const qTitle = req.query.title
  //   const qCategory2 = req.query.category?.toUpperCase()
  console.log(qCategory)

  try {
    let products
    if (qNew) {
      products = await ProductModel.find().sort({ createdAt: -1 }).limit(5)
    } else if (qCategory) {
      products = await ProductModel.find({
        categories: {
          $in: [qCategory],
        },
      })
    } else if (qTitle) {
      products = await ProductModel.find({ title: qTitle })
    } else {
      products = await ProductModel.find()
    }
    res.status(200).send(products)
  } catch (error) {
    next(createError(401, "Credentials are not ok!"))
    next(error)
  }
})
//*********************************************** GET with id PUBLIC() PRODUCT ***********************************************
productRouter.get("/:productId", async (req, res, next) => {
  try {
    const Product = await ProductModel.findById(req.params.productId)
    res.send(Product)
  } catch (error) {
    next(error)
  }
})

//*********************************************** PUT with id LIKE ADMIN  ***********************************************
productRouter.delete("/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
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
//*********************************************** POST IMAGE UPLOAD FOR PRODUCTS LIKE ADMIN  ***********************************************
productRouter.post("/uploadProductImg", cloudinaryProductImageUploader, async (req, res, next) => {
  try {
    // const upload = await (e) =>(req.body)
    // const uploadimage = new ImageModel({ img: req.files.map(url => url.path) })
    console.log(req.body)
    const uploadimage = await ImageModel.findByIdAndUpdate(
      "627563f7eae05904c0c18ff2",
      { img: req.files.map((url) => url.path) },
      {
        new: true,
      }
    )
    console.log(req.files.map((url) => url.path))
    console.log(req.files)

    if (uploadimage) {
      res.send(uploadimage)
    } else {
      next(createHttpError(404, `Blog witth id${req.params.imageDbid} not  found!`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})
export default productRouter
