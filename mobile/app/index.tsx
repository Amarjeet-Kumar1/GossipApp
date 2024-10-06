import {
  ActivityIndicator,
  Button,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native"
import React, { useContext, useEffect } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { Context } from "@/contexts/Context"
import { initiateSigninMiddleware } from "@/utils/contextMiddleware/auth"
import { askNotificationPermission } from "@/utils/notification"
import { refreshToken } from "@/utils/refreshToken"
import { getStoredAccessToken } from "@/utils/token"
import { SocketIO } from "@/utils/socket"
import { SERVER_URL } from "@/constants/env"

export default function index() {
  const context = useContext(Context)
  const {
    socketStatus,
    auth,
    initiateSignin,
    authLoading,
    setAuthFailed,
    setSocketConnectionSuccess,
  } = context

  const loginClickHandler = () => {
    // router.navigate("/sidebar")
    initiateSignin()
    initiateSigninMiddleware({ context })
      .then(() => {
        router.navigate("/sidebar")
      })
      .catch((error) => setAuthFailed(error))
  }

  useEffect(() => {
    // askNotificationPermission()
    ;(async () => {
      try {
        await refreshToken()
        const accessToken = await getStoredAccessToken()

        if (!accessToken) {
          setAuthFailed(null)
          return
        } else {
          const initializedSocket = new SocketIO(
            SERVER_URL as string,
            accessToken,
            context
          )
          const socket = await initializedSocket.getActiveSocket()
          if (socket.connected) {
            setSocketConnectionSuccess()
          }
          return
        }
      } catch (error) {
        setAuthFailed(null)
        return
      }
    })()
  }, [])

  useEffect(() => {
    if (auth) router.navigate("/sidebar")
  }, [auth])

  return (
    <ImageBackground
      source={require("@/assets/images/bgw.webp")}
      resizeMode="cover"
      style={styles.backgroundImage}
      blurRadius={5}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.login}>
          <Image
            source={require("@/assets/images/GossipApp.webp")}
            style={{ height: 150, width: 150, borderRadius: 75 }}
          />
          <Text style={styles.title}>GossipApp</Text>
          {false ? (
            <View style={styles.loading}>
              <ActivityIndicator />
            </View>
          ) : (
            <Button title="Sign in with google" onPress={loginClickHandler} />
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(17, 25, 40, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  login: {
    width: "80%",
    backgroundColor: "rgba(17, 25, 40, 0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.125)",
    padding: 50,
    gap: 20,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 18,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtn: {},
})
