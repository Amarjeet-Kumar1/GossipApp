import s from "../../chatModal.module.scss"
import { useContext, useState } from "react"
import { Context } from "../../../../../../contexts/Context"
import { Text } from "../../../ChatContainerBody/components/Messages/Text"
import { Search } from "../../../../../../widgets/search/Search"

export const SearchInMsgModal = ({ setReverseAnimation }: any) => {
  const { chat, activeChat, auth, authUsers } = useContext(Context)

  const [searchValue, setSearchValue] = useState("")

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
        <p>Search Messages</p>
      </div>
      <Search searchValue={searchValue} setSearchValue={setSearchValue} />
      {searchValue ? (
        <div className={s.body}>
          {chat[activeChat]?.messages
            ?.filter((chatData) =>
              chatData.msgParams?.text
                ?.toLowerCase()
                .includes(searchValue.toLowerCase())
            )
            .map((chatData: any, i: number) => {
              const owner = chatData.sentBy === auth?.objectId
              const _classname = s.LeftWrap
              const _side = "left"

              return (
                <div key={chatData._id} className={_classname}>
                  <Text
                    msgPosition={_side}
                    {...chatData}
                    extraParam={{
                      owner,
                      byAvatar: owner
                        ? auth?.avatar
                        : authUsers[chatData.sentBy]?.avatar,
                      by: chatData.sentBy
                        ? authUsers[chatData.sentBy]?.displayName
                        : "".split(" ").slice(0, 2).join(" "),
                      color: authUsers[chatData.sentBy]?.color,
                      prevMsgBySameUser:
                        i > 0
                          ? chat[activeChat]?.messages[i - 1].sentBy ===
                            chatData.sentBy
                          : false,
                      seenStatus: false,
                    }}
                  />
                </div>
              )
            })}
        </div>
      ) : (
        <div className={s.defaultInfo}>
          <small>Search for messages within Notes</small>
        </div>
      )}
    </div>
  )
}
