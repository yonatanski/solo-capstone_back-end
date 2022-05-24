import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"
import authRouter from "./services/routes/AuthRouter.js"
import { badRequestHandler, unauthorizedHandler, forbiddenHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers.js"
import userRouter from "./services/routes/UserRouter.js"
import productRouter from "./services/routes/ProductRouter.js"
import orderRouter from "./services/routes/OrderRouter.js"
import cartRouter from "./services/routes/CartRouter.js"
import stripeRouter from "./services/routes/stripeRouter.js"
import anncounceRouter from "./services/routes/AnnounceRouter.js"

const server = express()
const port = process.env.PORT || 3002

// ************************************* MIDDLEWARES ***************************************.

const whiteListOrigins = [process.env.PROD_FE_URL, process.env.DEV_FE_URL]
server.use(
  cors({
    origin: function (origin, next) {
      if (!origin || whiteListOrigins.indexOf(origin) !== -1) next(null, true)
      else next(new Error("cors error"))
    },
  })
)
// server.use(cors())
server.use(express.json())
// ************************************* ROUTES ********************************************
server.use("/api/auth", authRouter)
server.use("/api/users", userRouter)
server.use("/api/products", productRouter)
server.use("/api/orders", orderRouter)
server.use("/api/carts", cartRouter)
server.use("/api/checkout", stripeRouter)
server.use("/api/anncoucment", anncounceRouter)

// ************************************* ERROR MIDDLEWARES ***************************************.

server.use(badRequestHandler) //400
server.use(unauthorizedHandler) //401
server.use(forbiddenHandler) //403
server.use(notFoundHandler) //404
server.use(genericErrorHandler) //500

const uri = process.env.MONGODB_URI

mongoose.connect(uri || process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("Server runnning on port: ", port)
  })
})

server.on("error", (error) => {
  console.log("Server is stopped due to error : " + error)
})
