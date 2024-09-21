import s from "./chatContainerHeader.module.scss"
import { formatTime } from "../../../../utils/formatTime"
import { useContext } from "react"
import { Context } from "../../../../contexts/Context"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { initCallMiddleware } from "../../../../utils/contextMiddleware/callerInfo"

export const ChatContainerHead = () => {
  const {
    chat,
    activeChat,
    setActiveChat,
    setChatContainerModal,
    auth,
    authUsers,
    initCall,
    callingActive,
    setRoomModal,
  } = useContext(Context)

  const otherFriend =
    chat[activeChat]?.chatInfo.type === "chat"
      ? chat[activeChat]?.chatInfo.participants.find((e: any) => {
          console.log(e)
          return e.objectId !== auth?.objectId
        })
      : null

  const initiateACall = () => {
    const payload = {
      active: true,
      callBy: auth?.objectId,
      refId: chat[activeChat]?.chatInfo._id,
      extraParam: otherFriend
        ? {
            displayName: auth?.displayName,
            avatar: auth?.avatar,
            callTo: otherFriend.objectId,
          }
        : null,
    }
    initCall()

    initCallMiddleware({
      payload,
      callingActive,
      setRoomModal,
      chat,
    })
  }

  const close = () => {
    setActiveChat({ switchTo: null })
  }

  return (
    <div className={s.chatContainerHead}>
      <ArrowBackIcon
        style={{
          cursor: "pointer",
          display: "none",
        }}
        className={s.backIcon}
        onClick={close}
      />
      <div
        onClick={() =>
          setChatContainerModal({
            type: "userinfoModal",
          })
        }
        className={s.roomA}
      >
        <span className={s.avatar}>
          {(otherFriend?.objectId &&
            authUsers[otherFriend?.objectId]?.avatar) ||
          chat[activeChat]?.chatInfo.avatar ? (
            <img
              src={
                otherFriend
                  ? authUsers[otherFriend?.objectId]?.avatar
                  : chat[activeChat]?.chatInfo.avatar
              }
              alt="chat-avatar"
            />
          ) : (
            <div className={s.mainIcon}>
              <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
            </div>
          )}
        </span>
        <div className={s.roomInfo}>
          <p>
            {otherFriend
              ? authUsers[otherFriend.objectId]?.displayName
              : chat[activeChat]?.chatInfo.name}
          </p>
          <small>
            {otherFriend
              ? authUsers[otherFriend.objectId]?.status
                ? "Online"
                : `Last seen at ${formatTime(
                    authUsers[otherFriend.objectId]?.lastSeen ?? 0
                  )}, ${new Date(
                    authUsers[otherFriend.objectId]?.lastSeen ?? ""
                  )
                    .toString()
                    .slice(0, 16)}`
              : "Info"}
          </small>
        </div>
      </div>

      <div className={s.roomControls}>
        {otherFriend ? (
          <button
            style={{
              opacity: !authUsers[otherFriend.objectId]?.status ? 0.4 : 1,
              pointerEvents: !authUsers[otherFriend.objectId]?.status
                ? "none"
                : "auto",
            }}
            disabled={!authUsers[otherFriend.objectId]?.status}
            onClick={initiateACall}
            className={`icons ${s.callButton}`}
          >
            {authUsers[otherFriend.objectId]?.status && (
              <span className={s.activeBullet} />
            )}
            <svg
              fill="#b1b3b5"
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"></path>
            </svg>
          </button>
        ) : null}
        <span
          onClick={() =>
            setChatContainerModal({
              type: "searchMsg",
            })
          }
          className="icons"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              fill="currentColor"
              d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z"
            ></path>
          </svg>
        </span>
      </div>
    </div>
  )
}
