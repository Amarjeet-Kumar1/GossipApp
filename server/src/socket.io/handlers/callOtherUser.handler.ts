import { ObjectId } from "bson"
import { getActiveUserByObjectId } from "../../utils/activeUsers"
import { Server } from "socket.io"
import { Db } from "mongodb"
import logger from "../../utils/winston"
import { COLLECTION } from "../../utils/collections.enum"

export const callOtherUser = async (
  io: Server,
  _id: string,
  db: Db,
  payload: any
) => {
  if (payload?.extraParam) {
    const to = getActiveUserByObjectId(payload.extraParam.callTo)
    if (to) {
      io.to(to.socketId).emit("incomingCall", {
        peerId: payload.peerId,
        active: true,
        callBy: payload.callby,
        ...payload.extraParam,
      })
    }
  } else {
    const { participants, name, avatar } = await db
      .collection(COLLECTION.GROUP)
      .findOne({
        _id: new ObjectId(payload.refId),
      })

    for (let i = 0; i < participants.length; i++) {
      if (participants[i].objectId.toString() != _id.toString()) {
        const activeFriends = getActiveUserByObjectId(participants[i].objectId)
        if (activeFriends?.socketId) {
          logger.info("Calling ", activeFriends?.objectId)
          io.to(activeFriends.socketId).emit("incomingCall", {
            peerId: payload.peerId,
            active: true,
            callBy: payload.callby,
            displayname: name,
            avatar,
          })
        }
      }
    }
  }
}
