import { Image, StyleSheet, Text, View } from "react-native"
import React, { useContext } from "react"
import { Context } from "@/contexts/Context"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

export default function ChatList({ data }: any) {
  const {
    setDropDown,
    setActiveChat,
    setChatContainerModal,
    activeChat,
    chat,
    authUsers,
    auth,
  } = useContext(Context)

  const handleActiveChat = () => {
    setDropDown(false)
    setChatContainerModal(null)

    const payload = {
      prevActiveChat: {
        prevActiveChatId: chat[activeChat]?.chatInfo._id,
        prevActiveChatType: chat[activeChat]?.chatInfo.type,
      },
      switchTo: data.chatInfo._id,
    }

    setActiveChat(payload)

    // setActiveChatMiddleware()
  }

  const otherFriend =
    data.chatInfo.type === "chat"
      ? data.chatInfo.participants.find(
          (e: any) => e.objectId !== auth?.objectId
        )
      : null

  return (
    <View
      style={[
        styles.chatList,
        data?.chatInfo?._id === chat[activeChat]?.chatInfo?._id
          ? styles.active
          : null,
      ]}
    >
      <View style={styles.avatar}>
        {otherFriend && (
          <View
            style={[
              styles.activeStatus,
              authUsers[otherFriend.objectId].status
                ? styles.activeStatus_true
                : styles.activeStatus_false,
            ]}
          ></View>
        )}
        <Image
          source={{
            uri: otherFriend
              ? authUsers[otherFriend.objectId]?.avatar
              : data.chatInfo?.avatar,
          }}
        />
      </View>
      <View style={styles.chatinfo}>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.text}>
            {otherFriend
              ? authUsers[otherFriend.objectId]?.displayName
              : data.chatInfo?.name}
          </Text>
          <Text style={styles.time}>Thursday</Text>
        </View>
        <View>
          <MsgPreview
            {...data.messages[data.messages.length - 1]}
            otherUser={authUsers[otherFriend?.objectId]?.displayName}
          />
        </View>
      </View>
    </View>
  )
}

function MsgPreview(props: any) {
  switch (props.msgType) {
    case "text":
      return <Tex_t {...props} />
    case "document":
      return <Doc_s {...props} />
    case "image":
      return <Pictur_e {...props} />
    case "voice":
      return <Voic_e {...props} />
    case "video":
      return <Vide_o {...props} />
    default:
      return <div />
  }
}

function Tex_t({ otherUser, msgParams, type }: any) {
  return type === "group" ? (
    <View>
      <Text style={[styles.small, { fontWeight: 600 }]}>
        {otherUser?.split(" ").slice(0, 2).join(" ") ?? "You"}
      </Text>
      <Text style={styles.small}>{msgParams.text?.replaceAll("<br/>")}</Text>
    </View>
  ) : (
    <View>
      <Text style={styles.small}>{msgParams.text?.replaceAll("<br/>")}</Text>
    </View>
  )
}

function Doc_s({ msgParams }: any) {
  return (
    <View style={styles.preview}>
      <MaterialIcons
        name="attachment"
        size={15}
        color="rgb(130, 134, 137)"
        style={styles.svg}
      />
      <Text style={styles.small}>{msgParams.fileName}</Text>
    </View>
  )
}

function Pictur_e() {
  return (
    <View style={styles.preview}>
      <MaterialIcons
        name="insert-photo"
        size={15}
        color="rgb(130, 134, 137)"
        style={styles.svg}
      />
      <Text style={styles.small}>Photo</Text>
    </View>
  )
}

function Voic_e() {
  return (
    <View style={styles.preview}>
      <MaterialIcons
        name="music-note"
        size={15}
        color="rgb(130, 134, 137)"
        style={styles.svg}
      />
      <Text style={styles.small}>Audio</Text>
    </View>
  )
}

function Vide_o() {
  return (
    <View style={styles.preview}>
      <MaterialIcons
        name="videocam"
        size={15}
        color="rgb(130, 134, 137)"
        style={styles.svg}
      />
      <Text style={styles.small}>Video</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  chatList: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 5,
    paddingRight: 0,
    paddingBottom: 5,
    paddingLeft: 10,
  },
  active: {
    backgroundColor: "rgba(17, 25, 40, 0.9)",
  },
  avatar: {
    position: "relative",
  },
  activeStatus: {
    position: "absolute",
    right: 0,
    bottom: 0,
    zIndex: 1,
    padding: 5,
    borderRadius: 5,
  },
  activeStatus_true: {
    backgroundColor: "#00c0ad",
  },
  activeStatus_false: {
    backgroundColor: "#003a34",
  },
  chatinfo: {
    paddingRight: 10,
    marginLeft: 8,
    display: "flex",
    flexDirection: "column",
    height: 55,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgb(51, 51, 51)",
  },
  text: {
    borderBottomWidth: 0,
    fontSize: 13.5,
    margin: 0,
    lineHeight: 14,
    marginTop: 6,
  },
  time: {
    borderBottomWidth: 0,
    margin: 0,
    lineHeight: 14,
    marginTop: 6,
    color: "rgb(130, 134, 137)",
    fontSize: 10,
  },
  small: {
    fontSize: 12,
    color: "rgb(130, 134, 137)",
    overflow: "hidden",
    lineHeight: 20,
  },
  svg: {
    marginLeft: -3,
  },
  preview: {
    margin: 0,
    height: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
})
