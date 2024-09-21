import s from "../globalModalStyles.module.scss"
import { useContext, useEffect, useRef, useState } from "react"

// Icons
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined"
import StarIcon from "@mui/icons-material/Star"
import ReplyIcon from "@mui/icons-material/Reply"
import GetAppIcon from "@mui/icons-material/GetApp"
import CloseIcon from "@mui/icons-material/Close"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { MinimizedVideo } from "../../MovableModal/Components/MinimizedVideo"
import { Context } from "../../../contexts/Context"

export const MessagePreview = () => {
  const { msgInFocus, chat, activeChat, setGlobalModal, setGlobalMsgInFocus } =
    useContext(Context)
  const [activeMsg, setActiveMsg] = useState(0)
  const sliderRef: any = useRef(null)
  const mainRef: any = useRef(null)

  const scrollTo = (index: number, msgId?: string, spawn: boolean = false) => {
    const px = index * 64
    sliderRef.current.scroll({
      left: px,
      behavior: spawn ? "auto" : "smooth",
    })
    setGlobalMsgInFocus(msgId)
  }

  const downloadedMedia = () => {
    return chat[activeChat].messages?.filter(({ msgType }: any) => {
      return msgType === "image" || msgType === "video"
    })
  }

  const mediaInFocus = () => {
    return downloadedMedia()?.filter(({ _id }: any) => _id === msgInFocus)[0]
  }

  const totalAvailableMedia = downloadedMedia()
  const mediaInPreview = mediaInFocus()

  const handleLeft = () => {
    const px = (activeMsg - 1) * 64
    sliderRef.current.scroll({
      left: px,
      behavior: "smooth",
    })
    setActiveMsg((prev) => prev - 1)
    setGlobalMsgInFocus(totalAvailableMedia[activeMsg - 1]._id)
  }

  const handleRight = () => {
    setActiveMsg((prev) => prev + 1)
    setGlobalMsgInFocus(totalAvailableMedia[activeMsg + 1]._id)
    const px = (activeMsg + 1) * 64
    sliderRef.current.scroll({
      left: px,
      behavior: "smooth",
    })
  }

  const handleKeyPress = (e: any) => {
    switch (e.keyCode) {
      case 37:
        handleLeft()
        break
      case 39:
        handleRight()
        break
    }
    return
  }

  const first = totalAvailableMedia[0]?._id === msgInFocus
  const last =
    totalAvailableMedia[totalAvailableMedia?.length - 1]?._id === msgInFocus

  useEffect(() => {
    mainRef.current.focus()
  }, [])

  useEffect(() => {
    ;(async () => {
      const newIndex = totalAvailableMedia.findIndex((e: any) => {
        return e._id === msgInFocus
      })
      setActiveMsg(newIndex)
      scrollTo(newIndex, msgInFocus, true)
    })()
  }, [])

  return (
    <div
      ref={mainRef}
      tabIndex={0}
      onKeyDown={handleKeyPress}
      className={s.msgFullPreview}
    >
      <div className={s.header}>
        <div className={s.info}>
          <img src={chat[activeChat].chatInfo.avatar} alt="avatar" />
          <div>
            <strong>
              You @{" "}
              {chat[activeChat].chatInfo.type === "group"
                ? chat[activeChat].chatInfo.name
                : ""}
            </strong>
            <br />
            <small>today at 9:55 AM</small>
          </div>
        </div>
        <div className={s.control}>
          <ChatBubbleOutlineOutlinedIcon />
          <StarIcon />
          <ReplyIcon />
          <GetAppIcon />
          <CloseIcon onClick={() => setGlobalModal(null)} />
        </div>
      </div>
      <div className={s.main}>
        <button
          disabled={first}
          style={{
            backgroundColor: first ? "#26292b" : "#3b4042",
            cursor: first ? "default" : "pointer",
          }}
          onClick={handleLeft}
        >
          <ChevronLeftIcon />
        </button>
        <div className={s.preview}>
          {mediaInPreview?.msgType === "image" ? (
            <img src={mediaInPreview?.msgParams?.url} alt="msg preview" />
          ) : (
            <MinimizedVideo params={mediaInPreview?.msgParams} />
          )}
        </div>
        <button
          disabled={last}
          style={{
            backgroundColor: last ? "#26292b" : "#3b4042",
            cursor: last ? "default" : "pointer",
          }}
          onClick={handleRight}
        >
          <ChevronRightIcon />
        </button>
      </div>
      <div ref={sliderRef} className={s.footer}>
        {totalAvailableMedia.map((media: any, i: number) => {
          return (
            <div key={media._id} className={s.mediaPreview}>
              {media.msgType === "video" ? (
                <video
                  draggable={false}
                  onClick={() => scrollTo(i, media._id)}
                  className={
                    media._id === msgInFocus
                      ? s.previewActive
                      : s.previewDefault
                  }
                  src={media.msgParams.url}
                />
              ) : (
                <img
                  onClick={() => scrollTo(i, media._id)}
                  draggable={false}
                  className={
                    media._id === msgInFocus
                      ? s.previewActive
                      : s.previewDefault
                  }
                  src={media.msgParams.url}
                  alt="smallPreview"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
