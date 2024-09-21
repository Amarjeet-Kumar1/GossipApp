import s from "./chatContainerBodyStyles.module.scss"
import { File } from "./components/Messages/File"
import { Picture } from "./components/Messages/Picture"
import { Text } from "./components/Messages/Text"
import { Video } from "./components/Messages/Video"
import { Voice } from "./components/Messages/Voice"
import { useContext, useEffect, useRef } from "react"
import { Context } from "../../../../contexts/Context"

export const Message = ({ data, _side, extraParam }: any) => {
  switch (data.msgType) {
    case "text":
      return <Text msgPosition={_side} {...data} extraParam={extraParam} />
    case "video":
      return <Video msgPosition={_side} {...data} extraParam={extraParam} />
    case "voice":
      return <Voice msgPosition={_side} {...data} extraParam={extraParam} />
    case "document":
      return <File extraParam={extraParam} msgPosition={_side} {...data} />
    case "image":
      return <Picture msgPosition={_side} {...data} extraParam={extraParam} />
  }
  return <div />
}

export const ChatContainerBody = () => {
  const { chat, activeChat, auth, authUsers } = useContext(Context)
  const parentRef: any = useRef(null)
  useEffect(() => {
    parentRef.current.scrollTop = parentRef.current.scrollHeight
  }, [chat, activeChat])

  return (
    <div ref={parentRef} className={s.chatContainerBody}>
      {chat[activeChat]?.messages.map((chatData: any, i: number) => {
        const owner = chatData.sentBy === auth?.objectId
        const _classname = owner ? s.RightWrap : s.LeftWrap
        const _side = owner ? "right" : "left"
        const getSeenStatus = () => {
          // let seen = 2;
          // // 0-> Single Tick  1-> Double Tick  2-> Blue
          // activeChat.chatInfo.participants.forEach((e: any) => {
          //   if (e.objectId !== auth?.objectId) {
          //     seen = Math.min(
          //       seen,
          //       e.lastViewed > chatData.timestamp
          //         ? 2
          //         : chatData.timestamp > authUsers[e.objectId].lastSeen
          //         ? 0
          //         : 1
          //     );
          //   }
          // });
          // return seen;
          return 0
        }

        return (
          <div key={chatData._id} className={_classname}>
            <Message
              _side={_side}
              data={chatData}
              extraParam={{
                owner,
                byAvatar: owner
                  ? auth?.avatar
                  : authUsers[chatData.sentBy]?.avatar,
                by: chatData.sentBy
                  ? authUsers[chatData.sentBy]?.displayName
                  : "".split(" ").slice(0, 2).join(" "),
                color: authUsers[chatData.sentBy]?.color,
                prevMsgBySameUser:
                  i > 0
                    ? chat[activeChat]?.messages[i - 1].sentBy ===
                      chatData.sentBy
                    : false,
                seenStatus: getSeenStatus(),
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
