import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native"
import React, { useContext, useState } from "react"
import { Context } from "@/contexts/Context"
import { ObjectId } from "bson"
import { newGroupIcon } from "@/components/newGroupIcon"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import AntDesign from "@expo/vector-icons/AntDesign"

export default function newGroup({ closeModal }: any) {
  const { authUsers, createNewGroup, auth, newGroupCreated } =
    useContext(Context)
  const [userList, setUserList] = useState(authUsers)
  const [grpName, setGrpName] = useState("")
  const selectUser = (add: string) => {
    setUserList((prev: any) => ({
      ...prev,
      [add]: {
        ...prev[add],
        selected: true,
      },
    }))
  }

  const unselectUser = (remove: string) => {
    setUserList((prev: any) => ({
      ...prev,
      [remove]: {
        ...prev[remove],
        selected: false,
      },
    }))
  }

  const handleCreateNewGroup = ({}: any) => {
    if (grpName.length <= 1) return
    const participants: any = []
    participants.push({
      objectId: auth?.objectId,
      lastViewed: Date.now(),
    })
    Object.entries(userList).forEach((e: any) => {
      if (e[1].selected) {
        participants.push({
          objectId: e[0],
          lastViewed: Date.now(),
        })
      }
    })
    const payload = {
      _id: new ObjectId().toString(),
      name: grpName,
      avatar: newGroupIcon,
      createdOn: Date.now(),
      modifiedOn: Date.now(),
      participants,
      type: "group",
      desc: `Group created by ${auth?.displayName}`,
    }
    createNewGroup(payload)
    // createNewGroupMiddleware({ payload: payload, newGroupCreated })
    closeModal()
  }
  return (
    <View style={styles.sidebarModalBody}>
      <View style={styles.allChats}>
        <View style={styles.newGroupInfo}>
          <View style={styles.addedUserInfo}>
            <View style={styles.selectedUserDiv}>
              {Object.entries(userList)
                .filter((e: any) => (!e[1]?.selected ? false : true))
                .map((data: any) => {
                  return (
                    <View key={data[0]} style={styles.selectedUserChip}>
                      <Image source={{ uri: data[1].avatar }} />
                      <Text>{data[1].displayName}</Text>
                      <AntDesign
                        name="closecircle"
                        size={24}
                        color="white"
                        style={styles.unseletIcon}
                        onPress={() => unselectUser(data[0])}
                      />
                    </View>
                  )
                })}
            </View>
          </View>
          <TextInput
            value={grpName}
            onChange={(e: any) => setGrpName(e.target.value)}
            maxLength={30}
            placeholder="Type a group name..."
          />
        </View>
        <Text style={styles.text}>ADD USERS</Text>
        <View style={styles.chatsContainer}>
          {Object.entries(userList)
            .filter((e: any) => (e[1]?.selected ? false : true))
            .map((data: any) => {
              return (
                <TouchableHighlight
                  onPress={() => selectUser(data[0])}
                  key={data[0]}
                >
                  <View style={styles.availableUsers}>
                    <View style={styles.avatar}>
                      <View
                        style={[
                          styles.activeStatus,
                          data[1]?.status
                            ? styles.activeIndicater
                            : styles.inactiveIndicater,
                        ]}
                      ></View>
                      <Image source={{ uri: data[1].avatar }} />
                    </View>
                    <View>
                      <Text>{data[1].displayName}</Text>
                      <Text>{data[1].about}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )
            })}
        </View>
        <TouchableHighlight
          onPress={handleCreateNewGroup}
          style={styles.createGrpButton}
        >
          <View>
            <MaterialIcons name="arrow-forward" size={24} color="black" />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sidebarModalBody: {},
  allChats: {},
  newGroupInfo: {},
  addedUserInfo: {},
  selectedUserDiv: {},
  selectedUserChip: {},
  unseletIcon: {},
  text: {},
  chatsContainer: {},
  availableUsers: {},
  avatar: {},
  activeStatus: {},
  activeIndicater: {},
  inactiveIndicater: {},
  createGrpButton: {},
})
