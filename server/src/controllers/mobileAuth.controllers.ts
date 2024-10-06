import { mongoDB } from "../database/mongoInstance"
import { accessTokenExp, refreshTokenExp } from "../utils/token.constants"
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

const googlelogin = async (req: Request, res: Response) => {
  try {
    const db = await mongoDB().db()

    const { name, picture, email } = req.body

    if (!(name && picture && email)) {
      return unauthorizedResponse(res, "Session Expired!")
    }

    const rs = await db.collection(COLLECTION.USER).findOne({ email })

    if (rs?._id) {
      const refreshToken = createRefreshToken(rs._id, refreshTokenExp)
      const accessToken = createAccessToken(rs._id, accessTokenExp)

      return successResponse(res, "Success: googlelogin", {
        accessToken: accessToken,
        refreshToken: refreshToken,
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

      return successResponse(res, "Success: googlelogin", {
        accessToken: accessToken,
        refreshToken: refreshToken,
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
    const { refreshToken } = req.body

    if (!refreshToken) {
      return unauthorizedResponse(res)
    }

    let payload: any = null
    try {
      payload = verify(refreshToken, process.env.JWT_REFRESH_SECRET)
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

    return successResponse(res, "Success: refresh token", {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  } catch (err) {
    logger.error("Error: refresh token", err)
    serverErrorResponse(res)
  }
}

export { googlelogin, sendRefreshToken }
