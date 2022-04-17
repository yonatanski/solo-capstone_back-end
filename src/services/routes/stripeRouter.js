import express from "express"
import stripe from "stripe"
const stripeRouter = express.Router()
const stripe = process.env.STRIPE_KEY
// *********************************************** stripe payment  ***********************************************
stripeRouter.post("/payment", async (req, res, next) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr)
      } else {
        res.status(200).json(stripeRes)
      }
    }
  )
})
export default stripeRouter
