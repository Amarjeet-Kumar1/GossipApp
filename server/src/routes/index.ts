import express from "express"
import authRouter from "./auth.routes"
import chatRouter from "./chat.routes"
import mobileAuthRouter from "./mobileAuth.routes"

const router: express.Router = express.Router()

// check if server is active
router.get("/", (_: any, res: any) => {
  res.json({
    active: true,
  })
})

router.use("/auth", authRouter)
router.use("/auth/mobile", mobileAuthRouter)
router.use("/chats", chatRouter)

export default router
