// import ServerDown from "@/components/ServerDown"
import { ContextProvider } from "@/contexts/Provider"
import { Stack } from "expo-router"

export default function RootLayout() {
  return (
    <ContextProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sidebar" options={{ headerShown: false }} />
        <Stack.Screen
          name="newChat"
          options={{
            headerShown: true,
            headerTitle: "New Chat",
            headerTintColor: "#ffffff",
            headerStyle: { backgroundColor: "#111928" },
          }}
        />
        <Stack.Screen
          name="newGroup"
          options={{
            headerShown: true,
            headerTitle: "New Group",
            headerTintColor: "#ffffff",
            headerStyle: { backgroundColor: "#111928" },
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: true,
            headerTitle: "Profile",
            headerTintColor: "#ffffff",
            headerStyle: { backgroundColor: "#111928" },
          }}
        />
        <Stack.Screen name="chat" options={{ headerShown: true }} />
        <Stack.Screen name="tag" options={{ headerShown: true }} />
      </Stack>
    </ContextProvider>
  )
}
