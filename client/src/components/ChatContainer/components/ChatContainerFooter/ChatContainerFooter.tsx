import { AudioRecorder } from "../../../../widgets/AudioRecorder/AudioRecorder"
import { useContext, useRef, useState } from "react"
import s from "./chatContainerFooterStyles.module.scss"
import SendIcon from "@mui/icons-material/Send"
import {
  AttachmentIcon,
  CameraIcon,
  CloseIcon,
  DocumentIcon,
  GifIcon,
  MicIcon,
  PictureIcon,
  SmileIcon,
  StickerIcon,
  VideoCallIcon,
} from "./icons/ChatFooterIcons"
import { v4 as uuidv4 } from "uuid"

import { ExpandOptions } from "../../../../widgets/animations/ExpandOptions"
import { ShowAttachmentAnimations } from "../../../../widgets/animations/chatFooterAnimation/ShowAttachmentAnimations"
import { RecorderAnimation } from "../../../../widgets/animations/chatFooterAnimation/RecorderAnimation"
import { Context } from "../../../../contexts/Context"
import { parseAttachmentFiles } from "../../../../utils/parseAttachementFiles"
import { sendMsgStartMiddleware } from "../../../../utils/contextMiddleware/chat"
import { uploadAttachmentsMiddleware } from "../../../../utils/contextMiddleware/uploadAttachment"
import { Activity } from "../Activity/Activity"

export const ChatContainerFooter = () => {
  const {
    chat,
    activeChat,
    auth,
    files: attachments,
    setAttachmentModal,
    addAttachments,
    resetFileAttachmentModal,
    sendMsgStart,
    setGlobalModal,
    uploadAttachments,
    newChatSuccessfullyCreated,
    sendFileInit,
    updateSentFileUrl,
  } = useContext(Context)
  const [height, setHeight] = useState(0)
  const [activity, setActivity] = useState<boolean | string>(false)
  const [recording, setRecording] = useState(false)
  const [attachmentMenu, setAttachmentMenu] = useState(false)
  const [reverseRecordingAnimation, setReverseRecording] = useState(false)
  const [reverseAnimationAttachmentMenu, setReverseAnimationAttachmentMenu] =
    useState(false)
  const [reverseActivityAnimation, setReverseActivityAnimation] =
    useState(false)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState("")
  const inputRef = useRef(null)

  const closeAttachmentMenu = () => {
    if (reverseAnimationAttachmentMenu) {
      setReverseAnimationAttachmentMenu(false)
      setAttachmentMenu(false)
    }
  }

  const closeActivityContainer = () => {
    if (reverseActivityAnimation) {
      setReverseActivityAnimation(false)
      setActivity(false)
    }
  }

  const stopRecording = () => {
    if (reverseRecordingAnimation) {
      setReverseRecording(false)
      setRecording(false)
    }
  }

  const sendMsg = async () => {
    // @ts-ignore
    const msg = inputRef.current.innerText.trim().replaceAll("\n", "<br/>")
    const payload = {
      tempId: uuidv4(),
      type: chat[activeChat].chatInfo.type,
      msgType: "text",
      sentBy: auth?.objectId,
      msgParams: {
        text: msg,
      },
      refId: chat[activeChat].chatInfo._id,
      timestamp: Date.now(),
      clientSide: chat[activeChat].chatInfo.clientSide,
    }
    sendMsgStart(payload)

    sendMsgStartMiddleware({
      payload,
      newChatSuccessfullyCreated,
      chat,
    })

    // @ts-ignore
    inputRef.current.innerText = ""
  }

  const handleAttachments = async (e: any) => {
    if (attachments[0]) {
      resetFileAttachmentModal()
    }
    setReverseAnimationAttachmentMenu(true)
    const files = await parseAttachmentFiles(e.target.files)
    addAttachments(files)
    setAttachmentModal(chat[activeChat]?.chatInfo._id)
  }

  const sendClickedImage = async (e: Blob) => {
    closeAttachmentMenu()
    const file = new File([e], `${uuidv4().replaceAll("-", "")}.png`, {
      type: "image/png",
    })
    const parsedFile = await parseAttachmentFiles([file])
    uploadAttachments()
    uploadAttachmentsMiddleware({
      payload: {
        msgInfo: {
          type: chat[activeChat].chatInfo.type,
          // msgType:"",
          refId: chat[activeChat].chatInfo._id,
          timestamp: Date.now(),
          sentBy: auth?.objectId,
        },
        files: parsedFile,
        clientSide: chat[activeChat].chatInfo?.clientSide,
      },
      resetFileAttachmentModal,
      newChatSuccessfullyCreated,
      chat,
      sendFileInit,
      updateSentFileUrl,
    })
  }

  const takePhoto = () => {
    if (localStorage.getItem("_streamPermission")) {
      setGlobalModal({
        type: "takePhoto",
        params: {
          viaFooter: true,
          send: sendClickedImage,
        },
      })
    } else {
      setGlobalModal({
        type: "allowCamera",
        params: {},
      })
    }
  }

  const attachmentsArray = [
    <PictureIcon className={s.pictureIcon}>
      <input
        onChange={handleAttachments}
        multiple={true}
        type="file"
        accept="image/png"
      />
    </PictureIcon>,
    <CameraIcon onClick={takePhoto} className={s.cameraIcon} />,
    <DocumentIcon className={s.docIcon}>
      <input
        onChange={handleAttachments}
        type="file"
        multiple={false}
        accept=".docx, .doc, .pdf, .zip, .rar"
      />
    </DocumentIcon>,
    <VideoCallIcon className={s.videoIcon}>
      <input
        onChange={handleAttachments}
        type="file"
        multiple={false}
        accept="video/mp4"
      />
    </VideoCallIcon>,
  ]

  return (
    <>
      {activity ? (
        <Activity
          ref={inputRef}
          typing={typing}
          setTyping={setTyping}
          setInput={setInput}
          onClose={closeActivityContainer}
          reverseActivityAnimation={reverseActivityAnimation}
        />
      ) : null}
      <div
        style={{
          height: height === 0 ? 45 : 29 + height,
        }}
        className={s.footer}
      >
        <div className={s.footerControls}>
          {activity ? (
            <ExpandOptions reverse={reverseActivityAnimation}>
              <CloseIcon
                onClick={() => setReverseActivityAnimation(true)}
                className="icons"
              />
            </ExpandOptions>
          ) : null}
          <SmileIcon
            onClick={() => setActivity("emojiDrawer")}
            className={`icons ${
              activity === "emojiDrawer" ? "active-icon" : ""
            }`}
          />

          {activity ? (
            <ExpandOptions reverse={reverseActivityAnimation}>
              <div
                style={{
                  display: "flex",
                }}
              >
                <GifIcon
                  onClick={() => setActivity("gifDrawer")}
                  className={`icons ${
                    activity === "gifDrawer" ? "active-icon" : ""
                  }`}
                />
                <StickerIcon
                  onClick={() => setActivity("stickerDrawer")}
                  className={`icons ${
                    activity === "stickerDrawer" ? "active-icon" : ""
                  }`}
                />
              </div>
            </ExpandOptions>
          ) : null}

          <div className={s.attachmentButton}>
            {attachmentMenu ? (
              <ShowAttachmentAnimations
                items={attachmentsArray}
                className={s.attachments}
                reverse={reverseAnimationAttachmentMenu}
                onClose={closeAttachmentMenu}
              />
            ) : null}
            <AttachmentIcon
              onClick={() => {
                if (attachmentMenu) {
                  setReverseAnimationAttachmentMenu(true)
                } else {
                  setAttachmentMenu(true)
                }
              }}
              className="icons"
            />
          </div>
        </div>
        <div
          style={{
            height: height === 0 ? 30 : 14 + height,
          }}
          className={s.input}
        >
          {typing ? null : (
            <span className={s.spanPlaceholder}>Type a message</span>
          )}
          <div className={s.spanInput}>
            <span
              ref={inputRef}
              contentEditable="true"
              data-tab="6"
              id="custom-input"
              onDrop={(e) => e.preventDefault()}
              onInput={(e: any) => {
                if (e.target.innerText.length > 0) {
                  setTyping(true)
                } else {
                  setTyping(false)
                }
                //@ts-ignore
                if (!(height === e.target?.offsetHeight)) {
                  //@ts-ignore
                  setHeight(e.target?.offsetHeight)
                }
              }}
              onKeyDown={(e) => {
                if (!e.shiftKey && e.key === "Enter") {
                  e.preventDefault()
                  sendMsg()
                }
              }}
              dir="ltr"
              spellCheck="true"
              dangerouslySetInnerHTML={{ __html: input }}
            />
          </div>
        </div>
        {typing ? (
          <div className={`icons ${s.sendButton}`}>
            <SendIcon onClick={sendMsg} />
          </div>
        ) : recording ? (
          <RecorderAnimation
            onClose={stopRecording}
            reverse={reverseRecordingAnimation}
          >
            <AudioRecorder closeOption={setReverseRecording} />
          </RecorderAnimation>
        ) : (
          <div className={s.recorder}>
            <MicIcon onClick={() => setRecording(true)} className="icons" />
          </div>
        )}
      </div>
    </>
  )
}
