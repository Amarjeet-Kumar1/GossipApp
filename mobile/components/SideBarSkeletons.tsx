import { StyleSheet, View } from "react-native"
import React from "react"
import { Skeleton } from "moti/skeleton"

export default function SideBarSkeletons({ loading = false }) {
  return (
    <Skeleton.Group show={loading}>
      <View style={styles.main}>
        <Skeleton height={45} width={45} />
        <View style={styles.sn_div}>
          <Skeleton height={14} width="40%" />
          <Skeleton height={10} width="80%" />
        </View>
      </View>
    </Skeleton.Group>
  )
}

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    flex: 1,
    paddingTop: 5,
    paddingRight: 0,
    paddingBottom: 5,
    paddingLeft: 10,
  },
  sn_div: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  sn_avatar: {
    marginRight: 10,
  },
  sn_name: { height: 20 },
  sn_msg: { height: 20 },
})
