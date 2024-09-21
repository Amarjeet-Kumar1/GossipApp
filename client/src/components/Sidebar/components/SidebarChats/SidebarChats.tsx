import { useContext } from "react"
import s from "./chatStyles.module.scss"
import { Avatar } from "@mui/material"
import { MsgPreview } from "./Components/MsgPreview"
import { Context } from "../../../../contexts/Context"
import { setActiveChatMiddleware } from "../../../../utils/contextMiddleware/chat"

export const SidebarChats = ({ data }: any) => {
  const {
    setDropDown,
    setActiveChat,
    setChatContainerModal,
    activeChat,
    chat,
    authUsers,
    auth,
  } = useContext(Context)

  const handleActiveChat = () => {
    setDropDown(false)
    setChatContainerModal(null)

    const payload = {
      prevActiveChat: {
        prevActiveChatId: chat[activeChat]?.chatInfo._id,
        prevActiveChatType: chat[activeChat]?.chatInfo.type,
      },
      switchTo: data.chatInfo._id,
    }

    setActiveChat(payload)

    setActiveChatMiddleware()
  }

  const otherFriend =
    data.chatInfo.type === "chat"
      ? data.chatInfo.participants.find(
          (e: any) => e.objectId !== auth?.objectId
        )
      : null

  return (
    <div
      onClick={handleActiveChat}
      onContextMenu={(e: any) => {
        e.preventDefault()
        setDropDown({
          type: "chatInfo",
          position: {
            x: e.clientX,
            y: e.clientY,
          },
          params: {},
        })
      }}
      className={`${s.sidebarChats} ${
        data?.chatInfo?._id === chat[activeChat]?.chatInfo?._id ? s.active : ""
      }`}
    >
      <div className={s.avatar}>
        {otherFriend ? (
          <div
            className={`
                        ${s.activeStatus} ${
              authUsers[otherFriend.objectId].status
                ? s.activeIndicater
                : s.inactiveIndicater
            }`}
          ></div>
        ) : null}
        <Avatar
          src={
            otherFriend
              ? authUsers[otherFriend.objectId]?.avatar
              : data.chatInfo?.avatar
          }
          alt="sidebar-chat-avatar"
        />
      </div>

      <span className={s.chatInfo}>
        <div>
          <p>
            {otherFriend
              ? authUsers[otherFriend.objectId]?.displayName
              : data.chatInfo?.name}
          </p>
          {<p className={s.time}>Thursday</p>}
        </div>
        <div>
          <MsgPreview
            {...data.messages[data.messages.length - 1]}
            otherUser={authUsers[otherFriend?.objectId]?.displayName}
          />
        </div>
      </span>
    </div>
  )
}
