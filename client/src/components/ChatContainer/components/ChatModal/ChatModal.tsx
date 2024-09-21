import s from "./chatModal.module.scss"
import { SearchInMsgModal } from "./Modals/SearchInMsgModal/SearchInMsgModal"
import { UserInfoModal } from "./Modals/UserInfoModal/UserInfoModal"
import { useContext, useState } from "react"
import { ChatContainerModalAnimation } from "../../../../widgets/animations/chatContainerModal/ChatContainerModalAnimation"
import { Context } from "../../../../contexts/Context"

export const ChatModal = () => {
  const { chatContainerModal, setChatContainerModal: setChatModal } =
    useContext(Context)
  const [reverse, setReverse] = useState(false)
  const onClose = () => {
    if (reverse) {
      setReverse(false)
      setChatModal(null)
    }
  }

  const _modal = () => {
    switch (chatContainerModal.type) {
      case "searchMsg":
        return <SearchInMsgModal setReverseAnimation={setReverse} />
      case "userinfoModal":
        return <UserInfoModal setReverseAnimation={setReverse} />
    }
  }

  return (
    <ChatContainerModalAnimation
      onClose={onClose}
      reverse={reverse}
      className={s.chatModal}
    >
      {_modal()}
    </ChatContainerModalAnimation>
  )
}
