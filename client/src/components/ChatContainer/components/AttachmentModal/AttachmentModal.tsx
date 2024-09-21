import s from "./attachmentModal.module.scss"
import CloseIcon from "@mui/icons-material/Close"
import { Image } from "./components/Image"
import { Video } from "./components/Video"
import { File } from "./components/File"
import { PreviewFooter } from "./components/PreviewFooter"
import { useContext, useState } from "react"
import { VideoPlayer } from "../../../../widgets/VideoPlayer/VideoPlayer"
import { BlendFromBottomAnimation } from "../../../../widgets/animations/BlendFromBottomAnimation"
import { Context } from "../../../../contexts/Context"

export const FilePreview = ({ file, iconPreview }: any) => {
  if (!file) {
    return <div />
  }
  const { type }: any = file

  switch (type.split("/")[0]) {
    case "image":
      return <Image file={file} />
    case "video":
      return iconPreview ? (
        <Video file={file} />
      ) : (
        <div className={s.videoPlayerWrapper}>
          <VideoPlayer src={URL.createObjectURL(file)} />
        </div>
      )
    default:
      return <File file={file} />
  }
}

export const AttachmentModal = () => {
  const {
    modalFor,
    fileInPreview,
    resetFileAttachmentModal,
    activeChat,
    chat,
  } = useContext(Context)
  const [reverseAttachmentModalAnimation, setReverseAttachmentModalAnimation] =
    useState(false)

  const onClose = () => {
    if (reverseAttachmentModalAnimation) {
      resetFileAttachmentModal()
      setReverseAttachmentModalAnimation(false)
    }
  }

  const closeAttachmentModal = () => {
    setReverseAttachmentModalAnimation(true)
  }

  return modalFor === chat[activeChat]?.chatInfo?._id ? (
    <BlendFromBottomAnimation
      onClose={onClose}
      reverse={reverseAttachmentModalAnimation}
      className={s.attachmentModal}
    >
      <header>
        <CloseIcon onClick={closeAttachmentModal} />
        <strong>Preview</strong>
      </header>
      <div className={s.previewInFocus}>
        <FilePreview file={fileInPreview[0]} />
        {!["image", "video"].includes(fileInPreview[0]?.type?.split("/")[0]) ? (
          <small>{fileInPreview[0]?.name}</small>
        ) : null}
      </div>
      <PreviewFooter closeAttachmentModal={closeAttachmentModal} />
    </BlendFromBottomAnimation>
  ) : (
    <div />
  )
}
