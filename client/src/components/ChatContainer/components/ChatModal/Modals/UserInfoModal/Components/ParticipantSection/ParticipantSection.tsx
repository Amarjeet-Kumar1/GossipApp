import s from "./participationSection.module.scss"
import { Avatar } from "@mui/material"
import { useContext } from "react"
import { Context } from "../../../../../../../../contexts/Context"
import { setActiveChatMiddleware } from "../../../../../../../../utils/contextMiddleware/chat"

export const ParticipantSection = ({ onClose }: any) => {
  const { chat, activeChat, authUsers, auth, setActiveChat, createNewChat } =
    useContext(Context)
  const handleOnClick = (data: any) => {
    const doesChatExist: any = Object.entries(chat).find((chat: any) => {
      const refChat = chat[1].chatInfo
      const bool1 = refChat.participants.find(
        (user: any) => user.objectId === data.objectId
      )
      const bool2 = refChat.type === "chat"
      return bool1 && bool2
    })

    onClose(true)

    if (doesChatExist) {
      const payload = {
        prevActiveChat: {
          prevActiveChatId: chat[activeChat]?.chatInfo._id,
          prevActiveChatType: chat[activeChat]?.chatInfo.type,
        },
        switchTo: doesChatExist[1].chatInfo._id,
      }
      setActiveChat(payload)

      setActiveChatMiddleware()
    } else {
      createNewChat({
        participants: [
          {
            lastViewed: null,
            objectId: data[0],
          },
          {
            lastViewed: Date.now(),
            objectId: auth?.objectId,
          },
        ],
        type: "chat",
        modifiedOn: Date.now(),
      })
    }
  }

  return (
    <div className={s.participants}>
      <p className="chatModalSectionTitle">Participants</p>
      <div className={s.chatsContainer}>
        {Object.entries(chat[activeChat].chatInfo.participants)
          .filter((_data: any) => _data[1].objectId != auth?.objectId)
          .map((_data: any) => {
            const data = authUsers[_data[1].objectId]
            console.log(authUsers, _data)
            return (
              <div
                onClick={() => handleOnClick(data)}
                className={s.availableUsers}
                key={data.objectId}
              >
                <div className={s.avatar}>
                  <div
                    className={`
                        ${s.activeStatus} ${
                      data?.status ? s.activeIndicater : s.inactiveIndicater
                    }`}
                  ></div>
                  <Avatar src={data.avatar} alt="sidebar-chat-avatar" />
                </div>
                <span>
                  <p>{data.displayName}</p>
                  <small>{data.about}</small>
                </span>
              </div>
            )
          })}
      </div>
    </div>
  )
}
