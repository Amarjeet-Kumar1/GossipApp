import s from "./room.module.scss"
import { RoomFooter } from "./Footer/RoomFooter"
import { RoomHeader } from "./Header/RoomHeader"
import { RoomMain } from "./Main/RoomMain"
import { useContext } from "react"
import { Context } from "../../contexts/Context"

export const RoomModal = () => {
  const { roomModal } = useContext(Context)
  return roomModal ? (
    <div className={s.smoke}>
      <div className={s.fullModal}>
        <div className={s.room}>
          <div className={s.mainPanel}>
            <RoomHeader />
            <RoomMain />
            <RoomFooter />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div />
  )
}
