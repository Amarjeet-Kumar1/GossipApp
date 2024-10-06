import { Button, Image, StyleSheet, Text, View } from "react-native"
import React, { useContext } from "react"
import { Context } from "@/contexts/Context"

export default function profile() {
  const { auth } = useContext(Context)

  return (
    <View style={styles.container}>
      <Image source={{ uri: auth?.avatar }} />
      <View style={styles.section}>
        <Text style={styles.small}>Your Name</Text>
        <Text>{auth?.displayName}</Text>
      </View>
      <Text>
        This is not your username or pin. This name will be visible to your
        GossipApp contacts.
      </Text>
      <View style={styles.section}>
        <Text style={styles.small}>About</Text>
        <Text style={styles.input}>{auth?.about}</Text>
      </View>
      <Button title="Logout" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(17, 25, 40, 0.8)",
  },
  section: {},
  small: {},
  infoSub: {},
  input: {},
})
