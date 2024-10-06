import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  ImageBackground,
} from "react-native"
import React, { useContext, useState } from "react"
import Header from "@/components/Header"
import Search from "@/components/Search"
import { Context } from "@/contexts/Context"
import { ChatType } from "@/contexts/types"
import ChatList from "@/components/ChatList"
import SideBarSkeletons from "@/components/SideBarSkeletons"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Sidebar() {
  const {
    chatLoading = false,
    chat,
    auth,
    authUsers,
    activeChat,
  } = useContext(Context)
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
    <ImageBackground
      source={require("@/assets/images/bgw.webp")}
      resizeMode="cover"
      style={styles.backgroundImage}
      blurRadius={5}
    >
      <SafeAreaView style={styles.container}>
        <View>
          <Header />
          <Search searchValue={searchValue} setSearchValue={setSearchValue} />
          <View style={styles.list}>
            {chatLoading ? (
              <FlatList
                data={[...new Array(5).keys()]}
                renderItem={(e) => <SideBarSkeletons loading={chatLoading} />}
              />
            ) : (
              <FlatList
                data={Object.entries(chat).filter(([, data]) =>
                  filterChats(data)
                )}
                renderItem={(data) => <ChatList data={data} />}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(17, 25, 40, 0.3)",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  list: {},
})
