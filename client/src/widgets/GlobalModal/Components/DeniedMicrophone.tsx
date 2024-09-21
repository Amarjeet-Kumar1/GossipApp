import s from "../globalModalStyles.module.scss"
import { useContext } from "react"
import { Context } from "../../../contexts/Context"

export const DeniedMicrophone = () => {
  const { setGlobalModal } = useContext(Context)
  return (
    <div className={s.accessDenied}>
      <h3>Allow microphone</h3>
      <p>
        To record audio, GossipApp needs access to your computer's microphone.
        Click in the URL bar and choose “Always allow web.gossipApp.com to
        access your microphone.”
      </p>
      <div className={s.controlFooter}>
        <button onClick={() => setGlobalModal(null)} className={s.coloredBtn}>
          OK, GOT IT
        </button>
      </div>
    </div>
  )
}
