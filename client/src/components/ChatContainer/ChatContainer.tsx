import s from "./chatContainerStyles.module.scss"
import { ChatModal } from "./components/ChatModal/ChatModal"
import { ChatContainerBody } from "./components/ChatContainerBody/ChatContainerBody"
import { ChatContainerFooter } from "./components/ChatContainerFooter/ChatContainerFooter"
import { ChatContainerHead } from "./components/ChatContainerHead/ChatContainerHead"
import { AttachmentModal } from "./components/AttachmentModal/AttachmentModal"
import idleImage from "./connect.webp"
import { useContext } from "react"
import { Context } from "../../contexts/Context"

export const ChatContainer = () => {
  const { chatContainerModal, activeChat } = useContext(Context)
  return (
    <div className={s.chatContainer}>
      {activeChat ? (
        <div className={s.chatMain}>
          <AttachmentModal />
          <ChatContainerHead />
          <ChatContainerBody />
          <ChatContainerFooter />
        </div>
      ) : (
        <div className={s.idleWrapper}>
          <div className={s.idleDiv}>
            <img className={s.idleImg} src={idleImage} alt="idle-img" />
            <p>Lets Connect</p>
            <small>GossipApp uses your email to connect with world!</small>
          </div>
        </div>
      )}
      {chatContainerModal && <ChatModal />}
    </div>
  )
}
