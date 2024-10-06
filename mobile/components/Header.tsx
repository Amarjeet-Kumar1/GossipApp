import { Image, TouchableHighlight, StyleSheet, Text, View } from "react-native"
import React, { useContext } from "react"
import { Context } from "@/contexts/Context"
import Chat from "@/svg/chat"
import Avatar from "@/svg/avatar"
import { router } from "expo-router"

export default function Header() {
  const { auth, setSidebarModal } = useContext(Context)
  return (
    <View style={styles.header}>
      <TouchableHighlight
        style={styles.avatar}
        onPress={() => router.push("/profile")}
      >
        {auth?.avatar ? (
          <Image source={{ uri: auth?.avatar }} style={styles.image} />
        ) : (
          <Avatar color="#fafafa" />
        )}
      </TouchableHighlight>
      <TouchableHighlight onPress={() => router.push("/newChat")}>
        <Chat color="#fafafa" />
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 20,
    paddingRight: 20,
    height: 45,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.125)",
  },
  avatar: {
    height: 30,
    width: 30,
  },
  image: {
    height: 30,
    width: 30,
    borderRadius: 30,
    objectFit: "cover",
  },
})
