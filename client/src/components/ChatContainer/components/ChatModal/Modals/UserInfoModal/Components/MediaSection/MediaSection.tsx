import { getPreviewIcon } from "./getPreviewIcon"
import s from "./mediaSection.module.scss"
import { useContext } from "react"
import { Context } from "../../../../../../../../contexts/Context"

export const MediaSection = () => {
  const { chat, activeChat } = useContext(Context)
  return (
    <div className={s.mediaScreen}>
      <div className={s.head}>
        <p className="chatModalSectionTitle">Media, Links and Docs</p>
      </div>
      <div className={s.mediaThumbnails}>
        {Object.entries(chat[activeChat]?.messages)
          .filter((e: any) => e[1].msgType !== "text")
          .map((e: any) => {
            console.log(e[1])
            return (
              <div className={s.media} key={e[0]}>
                <img
                  src={
                    e[1].msgType === "document"
                      ? getPreviewIcon(e[1].msgParams.fileName.split(".")[1])
                      : e[1].msgType === "image"
                      ? e[1].msgParams.url
                      : e[1].msgType === "video"
                      ? e[1].msgParams.thumbnail
                      : getPreviewIcon(e[1].msgType)
                  }
                  alt="*_*"
                />
              </div>
            )
          })}
      </div>
    </div>
  )
}
