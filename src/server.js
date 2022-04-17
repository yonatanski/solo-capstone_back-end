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

const server = express()
const port = process.env.PORT || 3002

// ************************************* MIDDLEWARES ***************************************.
server.use(cors())
server.use(express.json())
// ************************************* ROUTES ********************************************
server.use("/api/auth", authRouter)
server.use("/api/users", userRouter)
server.use("/api/products", productRouter)
server.use("/api/orders", orderRouter)
server.use("/api/carts", cartRouter)
server.use("/api/checkout", stripeRouter)

// ************************************* ERROR MIDDLEWARES ***************************************.

server.use(badRequestHandler) //400
server.use(unauthorizedHandler) //401
server.use(forbiddenHandler) //403
server.use(notFoundHandler) //404
server.use(genericErrorHandler) //500

mongoose.connect(process.env.MONGO_CONNECTION)

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
