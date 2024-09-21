import { mongoDB } from "../database/mongoInstance"
import { accessTokenExp, refreshTokenExp } from "../utils/token.constants"
import { OAuth2Client } from "google-auth-library"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { createAccessToken, createRefreshToken } from "../utils/handleTokens"
import { Request, Response } from "express"
import { verify } from "jsonwebtoken"
import { ObjectId } from "bson"
import {
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "../utils/response"
import logger from "../utils/winston"
import { COLLECTION } from "../utils/collections.enum"

const client = new OAuth2Client(
  process.env.GAUTH_CLIENT_ID,
  process.env.GAUTH_CLIENT_SECRET,
  process.env.FRONTEND_URL
)

const getOauthURI = async (req: Request, res: Response) => {
  try {
    const data = {
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/plus.me", "profile", "email"],
      prompt: "consent",
    }

    const url = client.generateAuthUrl(data)

    return successResponse(res, "Success: google oauth uri", url)
  } catch (err) {
    logger.error("Error: google oauth url", err)
    serverErrorResponse(res)
  }
}

const googlelogin = async (req: Request, res: Response) => {
  try {
    const db = await mongoDB().db()

    const { code } = req.body

    const dCode = decodeURIComponent(code)

    logger.info(`de code: ${dCode}`)

    const { tokens } = await client.getToken(dCode)

    logger.info(`id token fetched from google : ${Object.keys(tokens)}`)

    const ticket = await client.verifyIdToken({
      idToken: tokens?.id_token,
    })

    const payload = ticket.getPayload()

    if (!payload) {
      return unauthorizedResponse(res, "Session Expired!")
    }

    const { name, picture, email } = payload
    const rs = await db.collection(COLLECTION.USER).findOne({ email })

    if (rs?._id) {
      const refreshToken = createRefreshToken(rs._id, refreshTokenExp)
      const accessToken = createAccessToken(rs._id, accessTokenExp)

      res.cookie("GossipApp_RTN", refreshToken, {
        maxAge: refreshTokenExp,
        httpOnly: true,
      })

      return successResponse(res, "Success: googlelogin", {
        accessToken: accessToken,
      })
    } else {
      const image = await axios.get(picture, {
        responseType: "arraybuffer",
      })
      const raw = Buffer.from(image.data).toString("base64")
      const base64Image =
        "data:" + image.headers["content-type"] + ";base64," + raw

      const userUid = uuidv4()
      const { insertedId } = await db.collection(COLLECTION.USER).insertOne({
        uid: userUid,
        displayName: name,
        authType: "google",
        email: email,
        avatar: base64Image,
        about: "New on GossipApp",
        createdOn: Date.now(),
      })

      const refreshToken: any = createRefreshToken(insertedId, refreshTokenExp)
      const accessToken: any = createAccessToken(insertedId, accessTokenExp)

      res.cookie("GossipApp_RTN", refreshToken, {
        maxAge: refreshTokenExp,
        httpOnly: true,
      })

      return successResponse(res, "Success: googlelogin", {
        accessToken: accessToken,
      })
    }
  } catch (err) {
    logger.error("Error: googlelogin", err)
    serverErrorResponse(res)
  }
}

const sendRefreshToken = async (req: Request, res: Response) => {
  try {
    const db = await mongoDB().db()
    const token = req.cookies.GossipApp_RTN

    if (!token) {
      return unauthorizedResponse(res)
    }

    let payload: any = null
    try {
      payload = verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (err) {
      return unauthorizedResponse(res)
    }

    const { _id } = await db
      .collection(COLLECTION.USER)
      .findOne({ _id: new ObjectId(payload._id) })

    if (!_id) {
      return unauthorizedResponse(res)
    }

    const newAccessToken = createAccessToken(payload._id, accessTokenExp)
    const newRefreshToken = createRefreshToken(payload._id, refreshTokenExp)

    res.cookie("GossipApp_RTN", newRefreshToken, {
      maxAge: refreshTokenExp,
      httpOnly: true,
    })

    return successResponse(res, "Success: refresh token", {
      accessToken: newAccessToken,
    })
  } catch (err) {
    logger.error("Error: refresh token", err)
    serverErrorResponse(res)
  }
}

const logout = async (_: Request, res: Response) => {
  try {
    res.clearCookie("GossipApp_RTN")
    successResponse(res, "Success: logout")
  } catch (err) {
    logger.error("Error: logout", err)
    serverErrorResponse(res)
  }
}

export { getOauthURI, googlelogin, logout, sendRefreshToken }
