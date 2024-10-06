import express from "express"
import {
  googlelogin,
  sendRefreshToken,
} from "../controllers/mobileAuth.controllers"

const mobileAuthRouter: express.Router = express.Router()

mobileAuthRouter.post("/google/authenticate", googlelogin)

mobileAuthRouter.post("/refresh-token", sendRefreshToken)

export default mobileAuthRouter
