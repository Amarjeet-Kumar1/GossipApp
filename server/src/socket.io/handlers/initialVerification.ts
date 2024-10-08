import socket from "socket.io"
import { ObjectId } from "bson"
import { verify } from "jsonwebtoken"
import { mongoDB } from "../../database/mongoInstance"
import { COLLECTION } from "../../utils/collections.enum"

export const initialSocketConfig = async (
  _: socket.Server,
  socket: socket.Socket
) => {
  const jwtToken: string = socket.handshake.auth.accessToken
  const { _id }: any = verify(jwtToken, process.env.JWT_ACCESS_SECRET)

  // MongoDb instance;
  const db = await mongoDB().db()

  // Auth user's detail
  const userPayload = await db
    .collection(COLLECTION.USER)
    .findOne({ _id: new ObjectId(_id) })

  // All users data
  const users = await db.collection(COLLECTION.USER).find().toArray()

  return {
    _id,
    db,
    userPayload,
    users,
  }
}
