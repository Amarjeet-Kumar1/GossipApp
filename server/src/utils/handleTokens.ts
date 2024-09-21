import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"

export const createAccessToken = (_id: ObjectId, exp: number) => {
  return jwt.sign(
    {
      _id,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: exp / 1000, // time in s
    }
  )
}

export const createRefreshToken = (_id: ObjectId, exp: number) => {
  return jwt.sign(
    {
      _id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: exp / 1000, // time in s
    }
  )
}
