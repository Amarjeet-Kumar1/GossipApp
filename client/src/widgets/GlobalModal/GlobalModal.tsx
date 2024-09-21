import { RemoveAvatar } from "./Components/RemoveAvatar"
import { AllowCamera } from "./Components/AllowCamera"
import { DeniedCamera } from "./Components/DeniedCamera"
import { TakePhoto } from "./Components/TakePhoto"
import { ViewPhoto } from "./Components/ViewPhoto"
import { AllowMicrophone } from "./Components/AllowMicrophone"
import s from "./globalModalStyles.module.scss"
import { DeniedMicrophone } from "./Components/DeniedMicrophone"
import { MessagePreview } from "./Components/MessagePreview"
import { MultipleSession } from "./Components/MultipleSession"
import { useContext } from "react"
import { Context } from "../../contexts/Context"

const Modal = ({ type }: any) => {
  switch (type) {
    case "removeAvatar":
      return <RemoveAvatar />
    case "allowCamera":
      return <AllowCamera />
    case "allowMicrophone":
      return <AllowMicrophone />
    case "cameraDenied":
      return <DeniedCamera />
    case "microphoneDenied":
      return <DeniedMicrophone />
    case "takePhoto":
      return <TakePhoto />
    case "viewPhoto":
      return <ViewPhoto />
    case "viewMsgPreview":
      return <MessagePreview />
    case "multipleSession":
      return <MultipleSession />
    default:
      return <div />
  }
}

const fullModal = ["viewPhoto", "viewMsgPreview"]
const transparentModal = ["allowMicrophone", "allowCamera"]

// connect takes two args (stateToProps, dispatchToProps)
export const GlobalModal = () => {
  const { globalModal } = useContext(Context)
  return (
    globalModal && (
      <div className={s.smoke}>
        {fullModal.includes(globalModal.type) ? (
          <div className={s.fullModal}>
            <Modal type={globalModal.type} />
          </div>
        ) : (
          <div
            className={
              transparentModal.includes(globalModal.type)
                ? s.allowCamera
                : s.modal
            }
          >
            <Modal type={globalModal.type} />
          </div>
        )}
      </div>
    )
  )
}
