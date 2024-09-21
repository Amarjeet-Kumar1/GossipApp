import { useContext } from "react"
import s from "../globalModalStyles.module.scss"
import { Context } from "../../../contexts/Context"

export const RemoveAvatar = () => {
  const { globalModal, setGlobalModal } = useContext(Context)
  return (
    <div className={s.removeAvatar}>
      <p>Remove this group's icon?</p>
      <div className={s.controlFooter}>
        <button onClick={() => setGlobalModal(null)} className={s.borderBtn}>
          CANCEL
        </button>
        <button
          onClick={globalModal.params.removeAvatar}
          className={s.coloredBtn}
        >
          REMOVE
        </button>
      </div>
    </div>
  )
}
