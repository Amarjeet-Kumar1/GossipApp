import s from "./footer.module.scss"
import MicIcon from "@mui/icons-material/Mic"
import MicOffIcon from "@mui/icons-material/MicOff"
import VideocamOffIcon from "@mui/icons-material/VideocamOff"
import VideocamIcon from "@mui/icons-material/Videocam"
import CallEndIcon from "@mui/icons-material/CallEnd"
import { useContext } from "react"
import { Context } from "../../../contexts/Context"

export const RoomFooter = () => {
  const {
    toggleAudio,
    micStatus,
    videoStatus,
    disconnectFromCall,
    toggleVideo,
  } = useContext(Context)
  return (
    <div className={s.roomFooter}>
      {micStatus ? (
        <MicIcon onClick={() => toggleAudio(false)} className={s.Icon} />
      ) : (
        <MicOffIcon
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
          onClick={() => toggleAudio(true)}
          className={s.Icon}
        />
      )}
      {videoStatus ? (
        <VideocamIcon onClick={() => toggleVideo(false)} className={s.Icon} />
      ) : (
        <VideocamOffIcon
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
          onClick={() => toggleVideo(true)}
          className={s.Icon}
        />
      )}
      <CallEndIcon
        onClick={disconnectFromCall}
        className={`${s.Icon} ${s.endCallBtn}`}
      />
    </div>
  )
}
