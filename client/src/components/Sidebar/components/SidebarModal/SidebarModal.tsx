import s from "./sidebarModal.module.scss"
import { UserSidebar } from "./Modals/UserSidebar"
import { NewMsgSidebar } from "./Modals/NewMsgSidebar"
import { AddUsersToGroup } from "./Modals/AddUsersToGroup"

import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useContext, useState } from "react"
import { SidebarModalAnimation } from "../../../../widgets/animations/sidebarModal/SidebarModalAnimation"
import { Context } from "../../../../contexts/Context"

const Modal = ({ sidebarModal, closeModal }: any) => {
  switch (sidebarModal?.type) {
    case "newMsgSidebar":
      return <NewMsgSidebar closeModal={closeModal} />
    case "userSidebar":
      return <UserSidebar />
    case "addUsersToGroup":
      return <AddUsersToGroup closeModal={closeModal} />
    default:
      return <div />
  }
}

export const SidebarModal = () => {
  const { sidebarModal, setSidebarModal } = useContext(Context)
  const [reverse, setReverse] = useState(false)
  const closeModal = () => {
    if (reverse) {
      setReverse(false)
      setSidebarModal(null)
    }
  }
  return sidebarModal?.type ? (
    <SidebarModalAnimation
      reverse={reverse}
      closeModal={closeModal}
      className={s.sidebarModal}
    >
      <div className={s.sidebarModalHeader}>
        <span>
          <ArrowBackIcon
            style={{
              cursor: "pointer",
            }}
            onClick={() => setReverse(true)}
          />
        </span>
        <p>{sidebarModal.params.headerTitle}</p>
      </div>
      <Modal closeModal={() => setReverse(true)} sidebarModal={sidebarModal} />
    </SidebarModalAnimation>
  ) : (
    <div />
  )
}
