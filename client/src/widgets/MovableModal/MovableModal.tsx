import { MinimizedVideo } from "./Components/MinimizedVideo"
import s from "./movableModal.module.scss"
import { MovableModalAnimation } from "../animations/movableModal/MovableModalAnimation"
import { useContext } from "react"
import { Context } from "../../contexts/Context"

const Modal = ({ type, params }: any) => {
  switch (type) {
    case "minimizedVideo":
      return params.orientation === "potrait" ? (
        <div className={s.minVidWrapperPotrait}>
          <MinimizedVideo params={params} />
        </div>
      ) : (
        <div className={s.minVidWrapperLandscape}>
          <MinimizedVideo params={params} />
        </div>
      )
    default:
      return <div />
  }
}

export const MovableModal = () => {
  const { movableModal } = useContext(Context)
  return (
    <MovableModalAnimation
      movableModal={movableModal}
      className={s.movableModal}
    >
      <Modal {...movableModal} />
    </MovableModalAnimation>
  )
}
