import { useContext, useState } from "react"
import s from "./descSection.module.scss"
import { Context } from "../../../../../../../../contexts/Context"
import { initGroupInfoUpdateMiddleware } from "../../../../../../../../utils/contextMiddleware/chat"

export const DescSection = ({ desc, userInfo }: any) => {
  const { chat, activeChat, initGroupInfoUpdate, groupInfoUpdateSuccessfull } =
    useContext(Context)
  const [editDescBool, setEditDesc] = useState(false)
  const [newDesc, setNewDesc] = useState(desc ?? userInfo?.about)

  const handleDescUpdate = () => {
    //TODO
    const payload = {
      groupId: chat[activeChat].chatInfo._id,
      updatedParams: {
        desc: newDesc,
      },
    }
    initGroupInfoUpdate(payload)

    initGroupInfoUpdateMiddleware({
      payload,
      groupInfoUpdateSuccessfull,
    })
    setEditDesc(false)
  }

  return (
    <div className={s.infoModalDesc}>
      <p className="chatModalSectionTitle">
        {userInfo ? "Bio" : "Description"}
      </p>
      <div
        style={
          editDescBool
            ? {
                borderBottom: "2px solid #00af9c",
                marginBottom: 2,
              }
            : {}
        }
        className={s.infoSub}
      >
        <span
          className={s.input}
          onPaste={(e: any) => e.preventDefault()}
          onDrag={(e: any) => e.preventDefault()}
          onDrop={(e: any) => e.preventDefault()}
          contentEditable={userInfo ? false : editDescBool}
          onInput={(e: any) => {
            try {
              setNewDesc(e.target.outerText)
              var selection: any = window.getSelection()
              var range = document.createRange()
              selection.removeAllRanges()
              range.selectNodeContents(e.target)
              range.collapse(false)
              selection.addRange(range)
              e.target.focus()
            } catch (e) {
              console.log(e)
            }
          }}
        >
          {newDesc}
        </span>

        {userInfo ? null : (
          <div className={s.editNameButton}>
            {editDescBool ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                width="20"
                height="20"
              >
                <path
                  fill="currentColor"
                  d="M9.5 1.7C4.8 1.7 1 5.5 1 10.2s3.8 8.5 8.5 8.5 8.5-3.8 8.5-8.5-3.8-8.5-8.5-8.5zm0 15.9c-4.1 0-7.4-3.3-7.4-7.4s3.3-7.4 7.4-7.4 7.4 3.3 7.4 7.4-3.3 7.4-7.4 7.4z"
                ></path>
                <path
                  fill="currentColor"
                  d="M6.8 9.8c.7-.1 1.2-.7 1.1-1.4-.1-.6-.5-1.1-1.1-1.1-.7 0-1.2.7-1.1 1.4 0 .6.5 1 1.1 1.1zM13.9 11.6c-1.4.2-2.9.3-4.4.4-1.5 0-2.9-.1-4.4-.4-.2 0-.4.1-.4.3v.2c.9 1.8 2.7 2.9 4.7 3 2-.1 3.8-1.2 4.8-3 .1-.2 0-.4-.1-.5h-.2zm-4.1 2c-2.3 0-3.5-.8-3.7-1.4 2.3.4 4.6.4 6.9 0 0 .1-.4 1.4-3.2 1.4zM12.2 9.8c.7-.1 1.2-.7 1.1-1.4-.1-.6-.5-1.1-1.1-1.1-.7 0-1.2.7-1.1 1.4.1.6.5 1 1.1 1.1z"
                ></path>
              </svg>
            ) : null}
            {editDescBool ? (
              <svg
                onClick={handleDescUpdate}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  fill="currentColor"
                  d="M9 17.2l-4-4-1.4 1.3L9 19.9 20.4 8.5 19 7.1 9 17.2z"
                ></path>
              </svg>
            ) : (
              <svg
                onClick={() => setEditDesc(true)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  fill="currentColor"
                  d="M3.95 16.7v3.4h3.4l9.8-9.9-3.4-3.4-9.8 9.9zm15.8-9.1c.4-.4.4-.9 0-1.3l-2.1-2.1c-.4-.4-.9-.4-1.3 0l-1.6 1.6 3.4 3.4 1.6-1.6z"
                ></path>
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
