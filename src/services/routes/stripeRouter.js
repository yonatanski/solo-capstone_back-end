import express from "express"
const stripeRouter = express.Router()

import Stripe from "stripe"

const KEY = process.env.STRIPE_KEY
const stripe = new Stripe(KEY)

//*********************************************** stripe payment  ***********************************************
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
