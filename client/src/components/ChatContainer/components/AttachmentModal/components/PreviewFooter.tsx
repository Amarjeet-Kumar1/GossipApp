import s from "../attachmentModal.module.scss"
import SendIcon from "@mui/icons-material/Send"
import CloseIcon from "@mui/icons-material/Close"
import { useContext, useEffect, useRef } from "react"
import AddIcon from "@mui/icons-material/Add"
import { FilePreview } from "../AttachmentModal"
import { parseAttachmentFiles } from "../../../../../utils/parseAttachementFiles"
import { Context } from "../../../../../contexts/Context"
import { uploadAttachmentsMiddleware } from "../../../../../utils/contextMiddleware/uploadAttachment"

export const PreviewFooter = ({ closeAttachmentModal }: any) => {
  const {
    addAttachments,
    removeAttachment,
    changeFileInPreview,
    uploadAttachments,
    fileInPreview,
    files,
    activeChat,
    chat,
    auth,
    resetFileAttachmentModal,
    newChatSuccessfullyCreated,
    sendFileInit,
    updateSentFileUrl,
  } = useContext(Context)
  const sliderRef: any = useRef(null)
  const mainRef: any = useRef(null)

  const scrollTo = (index: number) => {
    const px = index * 64
    sliderRef.current.scroll({
      left: px,
      behavior: "smooth",
    })
    changeFileInPreview(index)
  }

  const handleFileAddition = async (e: any) => {
    if (e.target.files) {
      const files = await parseAttachmentFiles(e.target.files)
      addAttachments(files)
    }
  }

  const handleFileRemoval = (index: number) => {
    if (files.length === 1) {
      closeAttachmentModal()
      return
    }
    if (files[index + 1]) {
      changeFileInPreview(index + 1)
    }
    removeAttachment(index)
  }

  const handleSendAttachment = () => {
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
        files: files,
        clientSide: chat[activeChat].chatInfo?.clientSide,
      },
      resetFileAttachmentModal,
      newChatSuccessfullyCreated,
      chat,
      sendFileInit,
      updateSentFileUrl,
    })
  }

  useEffect(() => {
    if (mainRef.current) mainRef.current.focus()
  }, [])

  return (
    <div className={s.previewFooter}>
      <button onClick={handleSendAttachment} className={s.button}>
        <SendIcon />
      </button>
      <div id="attachement-modal-footer" ref={sliderRef} className={s.footer}>
        {files.map((e: any, i: number) => {
          return (
            <div
              key={i}
              className={
                i === fileInPreview ? s.previewActive : s.previewDefault
              }
            >
              <CloseIcon
                className={s.close}
                onClick={() => handleFileRemoval(i)}
              />
              <div className={s.overlay} onClick={() => scrollTo(i)} />

              <FilePreview file={e[0]} iconPreview={true} />
            </div>
          )
        })}
        <div className={s.addAttachmentsButton}>
          <input
            accept=".docx, .doc, .pdf, .zip, .rar, .mp4, .mp3, .png"
            multiple={false}
            onChange={handleFileAddition}
            type="file"
          />
          <p>
            <AddIcon />
          </p>
          <small>ADD FILE</small>
        </div>
      </div>
    </div>
  )
}
