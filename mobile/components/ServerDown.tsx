import { StyleSheet, Text, View } from "react-native"
import React, { useContext } from "react"
import { Context } from "@/contexts/Context"

export default function ServerDown() {
  const { auth, socketStatus } = useContext(Context)
  return (
    auth &&
    (socketStatus ? null : (
      <View style={styles.smoke}>
        <View style={styles.modal}>
          <View style={styles.disconnectedModal}>
            <Text style={styles.text}>
              Sorry, server down. We'll be back back soon.
            </Text>
          </View>
        </View>
      </View>
    ))
  )
}

const styles = StyleSheet.create({
  smoke: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 1000,
    backgroundColor: "rgba(9, 14, 17, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    color: "whitesmoke",
    fontWeight: 400,
  },
  modal: {
    backgroundColor: "#3b4042",
  },
  disconnectedModal: {
    padding: 15,
    width: "80%",
  },
})
