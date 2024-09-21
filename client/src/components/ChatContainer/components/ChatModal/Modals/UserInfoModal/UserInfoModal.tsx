import s from "../../chatModal.module.scss"
import { AvatarSection } from "./Components/AvatarSection/AvatarSection"
import { DescSection } from "./Components/DescSection/DescSection"
import { MediaSection } from "./Components/MediaSection/MediaSection"
import { ParticipantSection } from "./Components/ParticipantSection/ParticipantSection"
import { useContext } from "react"
import { Context } from "../../../../../../contexts/Context"

export const UserInfoModal = ({ setReverseAnimation }: any) => {
  const { chat, activeChat, authUsers, auth } = useContext(Context)
  const otherFriend =
    chat[activeChat].chatInfo.type === "chat"
      ? chat[activeChat].chatInfo.participants.find((e: any) => {
          console.log(e)
          return e.objectId !== auth?.objectId
        })
      : null

  return (
    <div className={s.userInfoModal}>
      <div className={s.modalHead}>
        <svg
          onClick={() => setReverseAnimation(true)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path
            fill="currentColor"
            d="M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z"
          ></path>
        </svg>
        <p>{otherFriend ? "User Info" : "Group info"}</p>
      </div>
      <div className={s.infoModalBody}>
        <AvatarSection name="Notes" otherFriend={otherFriend?.objectId} />
        <DescSection
          userInfo={
            otherFriend?.objectId ? authUsers[otherFriend?.objectId] : ""
          }
          desc={chat[activeChat]?.chatInfo?.desc}
        />
        <MediaSection />
        {otherFriend ? null : (
          <ParticipantSection onClose={() => setReverseAnimation(true)} />
        )}
      </div>
    </div>
  )
}
