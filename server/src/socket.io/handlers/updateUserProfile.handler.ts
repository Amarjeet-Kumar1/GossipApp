import { ObjectId } from "bson"
import socket from "socket.io"
import { COLLECTION } from "../../utils/collections.enum"

export const updateUserProfile = async (
  socket: socket.Socket,
  _id: string,
  payload: any,
  db: any
) => {
  await db.collection(COLLECTION.USER).updateOne(
    { _id: new ObjectId(_id) },
    {
      $set: { ...payload },
    }
  )

  return socket.broadcast.emit("onOtherAuthUsersInfoUpdate", {
    objectId: _id,
    ...payload,
  })
}
