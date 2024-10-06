import * as SecureStore from "expo-secure-store"

export const storeTokens = async (
  accessToken: string,
  refreshToken: string
) => {
  await SecureStore.setItemAsync("accessToken", accessToken)
  await SecureStore.setItemAsync("refreshToken", refreshToken)
}

export const getStoredAccessToken = async () => {
  return await SecureStore.getItemAsync("accessToken")
}

export const getStoredRefreshToken = async () => {
  return await SecureStore.getItemAsync("refreshToken")
}

export const removeStoredTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken")
  await SecureStore.deleteItemAsync("refreshToken")
}
