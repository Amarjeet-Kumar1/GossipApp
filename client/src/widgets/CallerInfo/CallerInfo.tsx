import s from "./callerInfo.module.scss"
import CallEndIcon from "@mui/icons-material/CallEnd"
import VideocamIcon from "@mui/icons-material/Videocam"
import { useContext, useState } from "react"
import { CallerInfoAnimation } from "../animations/CallerInfoAnimation"
import { Context } from "../../contexts/Context"
import { rejectCallMiddleware } from "../../utils/contextMiddleware/callerInfo"

export const CallerInfo = () => {
  const { callerInfo, setRoomModal, rejectCall, callConnected } =
    useContext(Context)

  const [reverseAttachmentModalAnimation, setReverseAttachmentModalAnimation] =
    useState(false)

  const onClose = () => {
    if (reverseAttachmentModalAnimation) {
      rejectCall()
      rejectCallMiddleware()
      setReverseAttachmentModalAnimation(false)
    }
  }

  const acceptCall = () => {
    setRoomModal({
      peerId: callerInfo.peerId,
      callBy: null,
      groupInfo: [],
      acceptedCall: true,
    })
    callConnected()
  }
  //
  return callerInfo?.active ? (
    <CallerInfoAnimation
      onClose={onClose}
      reverse={reverseAttachmentModalAnimation}
      className={s.callerInfo}
    >
      <div className={s.eva}>
        <div
          className={s.img}
          style={{
            background: `linear-gradient(transparent, rgb(21,21,21)), url(${callerInfo?.avatar})`,
            backgroundSize: "cover",
          }}
        />
        <div className={s.foo}>
          <img className={s.avr} src={callerInfo?.avatar} alt="-" />
          <p>{callerInfo?.displayName}</p>
          <div className={s.bee}>
            <span>
              <VideocamIcon onClick={acceptCall} />
            </span>
            <span>
              <CallEndIcon />
            </span>
          </div>
        </div>
      </div>
    </CallerInfoAnimation>
  ) : null
}
