import express from "express"
import authRouter from "./auth.routes"
import chatRouter from "./chat.routes"

const router: express.Router = express.Router()

// check if server is active
router.get("/", (_: any, res: any) => {
  res.json({
    active: true,
  })
})

router.use("/auth", authRouter)
router.use("/chats", chatRouter)

export default router
