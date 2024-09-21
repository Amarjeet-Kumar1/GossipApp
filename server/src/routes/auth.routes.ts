import express from "express"

import { auth } from "../middlewares/auth.middlewares"

import {
  getOauthURI,
  googlelogin,
  sendRefreshToken,
  logout,
} from "../controllers/auth.controllers"

const authRouter: express.Router = express.Router()

authRouter.get("/google/uri", getOauthURI)

authRouter.post("/google/authenticate", googlelogin)

authRouter.get("/refresh-token", sendRefreshToken)

authRouter.get("/logout", auth, logout)

export default authRouter
