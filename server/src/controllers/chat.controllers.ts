import { ObjectId } from "bson"
import { mongoDB } from "../database/mongoInstance"
import logger from "../utils/winston"
import { uploadFile } from "../storage/upload.cloudinary"
import {
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/response"
import { Request, Response } from "express"

import { COLLECTION } from "../utils/collections.enum"

const handleNewGroup = async (req: Request, res: Response) => {
  try {
    const db = await mongoDB().db()
    const {
      _id,
      participants,
      modifiedOn,
      type,
      desc,
      createdOn,
      avatar,
      name,
    } = req.body

    logger.info("new group body", req.body)

    if (!_id) {
      return notFoundResponse(res)
    }

    await db.collection(COLLECTION.GROUP).insertOne({
      _id: new ObjectId(_id),
      participants: participants.map((participant: any) => {
        return {
          objectId: new ObjectId(participant.objectId),
          lastViewed: participant.lastViewed,
        }
      }),
      modifiedOn,
      type,
      desc,
      createdOn,
      avatar,
      name,
    })

    return successResponse(res, "Success: new group")
  } catch (err) {
    logger.error("Error: new chat", err)
    serverErrorResponse(res)
  }
}

const handleNewChat = async (req: Request, res: Response) => {
  try {
    const db = await mongoDB().db()
    const { _id, participants, modifiedOn, type } = req.body

    logger.info("new chat body", req.body)

    if (!_id) {
      return notFoundResponse(res)
    }

    await db.collection(COLLECTION.CHAT).insertOne({
      _id: new ObjectId(_id),
      participants: participants.map((participant: any) => {
        return {
          objectId: new ObjectId(participant.objectId),
          lastViewed: participant.lastViewed,
        }
      }),
      modifiedOn,
      type,
    })

    return successResponse(res, "Success: new chat")
  } catch (err) {
    logger.error("Error: new chat", err)
    serverErrorResponse(res)
  }
}

// Get total chats and groups in database
const getGroupsChats = async (req: Request, res: Response) => {
  try {
    const db = await mongoDB().db()
    const chats = await db
      .collection(COLLECTION.CHAT)
      .find({
        participants: {
          $elemMatch: {
            objectId: new ObjectId(req.payload._id),
          },
        },
      })
      .toArray()
    const groups = await db
      .collection(COLLECTION.GROUP)
      .find({
        participants: {
          $elemMatch: {
            objectId: new ObjectId(req.payload._id),
          },
        },
      })
      .toArray()

    const data = [...chats, ...groups].sort((x, y) => x.timestamp - y.timestamp)

    return successResponse(res, "Success: chats and groups", data)
  } catch (err) {
    logger.error("Error: chats and groups", err)
    notFoundResponse(res)
  }
}

// get messages corresponding to a chat or group
const getMessages = async (req: Request, res: Response) => {
  try {
    const { refId } = req.params
    const db = await mongoDB().db()
    const messages = await db
      .collection(COLLECTION.MESSAGE)
      .find({ refId: new ObjectId(refId) })
      .sort({ timestamp: 1 })
      .toArray()

    return successResponse(res, "Success: Messages", messages)
  } catch (err) {
    logger.error("Error: Messages", err)
    notFoundResponse(res)
  }
}

const handleFileUpload = async (req: Request, res: Response) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64")
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64
    const url = await uploadFile({ file: dataURI })
    successResponse(res, "Success: file upload", { path: url })
  } catch (err) {
    logger.error("Error: file upload", err)
    serverErrorResponse(res)
  }
}

const handleGetResource = async (req: Request, res: Response) => {
  notFoundResponse(res)
}

export {
  handleNewGroup,
  handleNewChat,
  getGroupsChats,
  getMessages,
  handleFileUpload,
  handleGetResource,
}
