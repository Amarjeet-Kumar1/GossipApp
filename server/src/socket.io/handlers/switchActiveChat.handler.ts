import socket from "socket.io"
import { getActiveUserByObjectId } from "../../utils/activeUsers"
import { ObjectId } from "bson"
import { COLLECTION } from "../../utils/collections.enum"

export const switchActiveChat = async (
  io: socket.Server,
  socket: socket.Socket,
  _id: string,
  db: any,
  payload: any
) => {
  // Second time switching a chat
  // Update prev chats info
  console.log(payload)
  if (payload?.prevActiveChat.prevActiveChatType) {
    const { prevActiveChatId, prevActiveChatType } = payload.prevActiveChat
    const time = Date.now()

    // Update last chats info
    await db.collection(prevActiveChatType).updateOne(
      {
        "participants.objectId": new ObjectId(_id),
      },
      {
        $set: {
          "participants.$.lastViewed": time,
        },
      }
    )

    const { participants } = await db.collection(prevActiveChatType).findOne({
      _id: new ObjectId(prevActiveChatId),
    })

    for (let i = 0; i < participants.length; i++) {
      if (participants[i].objectId.toString() != _id.toString()) {
        const activeFriends = getActiveUserByObjectId(participants[i].objectId)
        if (activeFriends?.socketId) {
          // Update others about this
          io.to(activeFriends.socketId).emit("activeChatsSwitched", {
            userObjectId: _id,
            prevActiveChat: {
              prevActiveChatId,
              lastViewed: time,
            },
          })
        }
      }
    }
  }

  await db.collection(COLLECTION.USER).updateOne(
    { _id: new ObjectId(_id) },
    {
      $set: { currentlyOn: payload.switchTo },
    }
  )

  // Update others about this
  return socket.broadcast.emit("friendCurrentlyOn", {
    userObjectId: _id,
    currentlyOn: payload.switchTo,
  })
}
