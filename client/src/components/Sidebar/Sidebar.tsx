import s from "./sidebarStyles.module.scss"
import { SidebarChats } from "./components/SidebarChats/SidebarChats"
import { SidebarHead } from "./components/SidebarHead/SidebarHead"
import { SidebarModal } from "./components/SidebarModal/SidebarModal"
import { SidebarChatSkeletons } from "../../widgets/skeletons/SidebarChatSkeletons"
import { useContext, useState } from "react"
import { Context } from "../../contexts/Context"
import { ChatType } from "../../contexts/types"
import { Search } from "../../widgets/search/Search"

export const Sidebar = () => {
  const { chatLoading, chat, auth, authUsers } = useContext(Context)
  const [searchValue, setSearchValue] = useState("")

  const filterChats = (data: ChatType) => {
    const otherFriend =
      data.chatInfo.type === "chat"
        ? data.chatInfo.participants.find(
            (e: any) => e.objectId !== auth?.objectId
          )
        : null

    const name = otherFriend
      ? authUsers[otherFriend.objectId]?.displayName
      : data.chatInfo?.name

    return searchValue
      ? name?.toLowerCase().includes(searchValue.toLowerCase())
      : true
  }
  return (
    <div className={s.sidebar}>
      <SidebarModal />
      <SidebarHead />
      <Search searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className={s.chatsContainer}>
        {chatLoading
          ? [1, 2, 3].map((e) => {
              return <SidebarChatSkeletons key={e} />
            })
          : Object.entries(chat)
              .filter(([id, data]) => filterChats(data))
              .map(([id, data]: any) => {
                return <SidebarChats key={id} data={data} />
              })}
      </div>
    </div>
  )
}
