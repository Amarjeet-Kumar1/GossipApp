import { useContext } from "react"
import s from "../globalModalStyles.module.scss"
import { Context } from "../../../contexts/Context"

export const DeniedCamera = () => {
  const { setGlobalModal } = useContext(Context)
  return (
    <div className={s.accessDenied}>
      <h3>Allow camera</h3>
      <p>
        To take photos, GossipApp needs access to your computer's camera. Click
        in the URL bar and choose “Always allow web.gossipApp.com to access your
        camera.”
      </p>
      <div className={s.controlFooter}>
        <button onClick={() => setGlobalModal(null)} className={s.coloredBtn}>
          OK, GOT IT
        </button>
      </div>
    </div>
  )
}
