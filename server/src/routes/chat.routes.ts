import express from "express"
import multer from "multer"

import { auth } from "../middlewares/auth.middlewares"

import {
  handleNewGroup,
  handleNewChat,
  getGroupsChats,
  getMessages,
  handleFileUpload,
  handleGetResource,
} from "../controllers/chat.controllers"

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const chatRouter: express.Router = express.Router()

// get messages of a particular chat, group
chatRouter.get("/:refId", auth, getMessages)

// get chats, groups for a particular user
chatRouter.get("/", auth, getGroupsChats)

// upload files
chatRouter.post("/file-upload", auth, upload.single("file"), handleFileUpload)

// chat message files
chatRouter.get("/resources/:fileType/:key", handleGetResource)

chatRouter.post("/create-new-group", auth, handleNewGroup)

chatRouter.post("/create-new-chat", auth, handleNewChat)

export default chatRouter
