import { ObjectId } from "bson"
import socket from "socket.io"
import { getActiveUserByObjectId } from "../../utils/activeUsers"
import { COLLECTION } from "../../utils/collections.enum"

export const updateGroupInfo = async (
  io: socket.Server,
  _id: string,
  payload: any,
  db: any
) => {
  await db.collection(COLLECTION.GROUP).updateOne(
    { _id: new ObjectId(payload.groupId) },
    {
      $set: { ...payload.updatedParams },
    }
  )

  const { participants } = await db.collection(COLLECTION.GROUP).findOne({
    _id: new ObjectId(payload.groupId),
  })

  for (let i = 0; i < participants.length; i++) {
    if (participants[i].objectId.toString() != _id.toString()) {
      const activeFriends = getActiveUserByObjectId(participants[i].objectId)
      if (activeFriends?.socketId) {
        console.log("Chats updated for ", activeFriends?.objectId)
        io.to(activeFriends.socketId).emit("onGroupInfoUpdate", payload)
      }
    }
  }
  return
}
