import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native"
import React, { useContext, useState } from "react"
import Search from "@/components/Search"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { Context } from "@/contexts/Context"
import { router } from "expo-router"

export default function newChat() {
  const {
    authUsers,
    auth,
    chat,
    setActiveChat,
    activeChat,
    createNewChat,
    setSidebarModal,
  } = useContext(Context)
  const [searchValue, setSearchValue] = useState("")

  const closeModal = () => {}

  const handleOnClick = (data: any) => {
    const doesChatExist: any = Object.entries(chat).find((chat: any) => {
      const refChat = chat[1].chatInfo
      const bool1 = refChat.participants.find(
        (user: any) => user.objectId === data[0]
      )
      const bool2 = refChat.type === "chat"
      return bool1 && bool2
    })

    if (doesChatExist) {
      const payload = {
        prevActiveChat: {
          prevActiveChatId: chat[activeChat]?.chatInfo._id,
          prevActiveChatType: chat[activeChat]?.chatInfo.type,
        },
        switchTo: doesChatExist[1].chatInfo._id,
      }
      setActiveChat(payload)

      // setActiveChatMiddleware()
      closeModal()
    } else {
      createNewChat({
        participants: [
          {
            lastViewed: null,
            objectId: data[0],
          },
          {
            lastViewed: Date.now(),
            objectId: auth?.objectId,
          },
        ],
        type: "chat",
        modifiedOn: Date.now(),
      })
      closeModal()
    }
  }

  return (
    <View style={styles.container}>
      <Search searchValue={searchValue} setSearchValue={setSearchValue} />
      <View>
        <TouchableHighlight onPress={() => router.push("/newGroup")}>
          <View>
            <MaterialIcons name="group-add" size={24} color="black" />
            <Text>New group</Text>
          </View>
        </TouchableHighlight>
      </View>
      <Text>All users</Text>
      <View>
        {Object.entries(authUsers)
          .filter((data) =>
            data[1].displayName
              ?.toLowerCase()
              .includes(searchValue.toLowerCase())
          )
          .map((data: any) => {
            return (
              <View>
                <View>
                  <View></View>
                  <Image source={{ uri: data[1].avatar }} />
                </View>
                <View>
                  <Text>{data[1].displayName}</Text>
                  <Text>{data[1].about}</Text>
                </View>
              </View>
            )
          })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(17, 25, 40, 0.8)",
  },
})
