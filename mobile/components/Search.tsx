import { StyleSheet, Text, TextInput, View } from "react-native"
import React from "react"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

export default function Search({
  searchValue,
  setSearchValue,
}: {
  searchValue: string
  setSearchValue: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={15} color="rgb(130, 134, 137)" />
        <View style={styles.searchControl}>
          <TextInput
            style={styles.input}
            placeholderTextColor="rgb(130, 134, 137)"
            onChangeText={(value) => setSearchValue(value)}
            value={searchValue}
            placeholder="Search"
          />
          {searchValue && (
            <MaterialIcons
              name="close"
              size={15}
              color="rgb(130, 134, 137)"
              onPress={() => setSearchValue("")}
            />
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    width: "100%",
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
  },
  searchBar: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "rgba(17, 25, 40, 0.8)",
    borderRadius: 5,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
  },
  searchControl: {
    flexDirection: "row",
    marginLeft: 20,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "rgb(212, 213, 215)",
    fontSize: 11,
  },
})
