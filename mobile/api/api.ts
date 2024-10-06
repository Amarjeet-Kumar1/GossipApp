import axios from "axios"
import { SERVER_URL } from "@/constants/env"
import { getStoredAccessToken } from "@/utils/token"
import { refreshToken } from "@/utils/refreshToken"

const publicApi = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
})

const authApi = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
})

authApi.interceptors.request.use(
  async (request) => {
    const token = await getStoredAccessToken()
    request.headers!.Authorization = `Bearer ${token}`
    return request
  },
  (error) => {
    console.log(error)
  }
)

authApi.interceptors.response.use(
  async (response) => {
    return response
  },
  async (error) => {
    const originalConfig = error.config
    console.log(error)
    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true
      try {
        await refreshToken()
        const token = await getStoredAccessToken()
        authApi.defaults.headers!.common.Authorization = `Bearer ${token}`
        return authApi(originalConfig)
      } catch (_error: any) {
        if (_error.response && _error.response.data) {
          return Promise.reject(_error.response.data)
        }

        return Promise.reject(_error)
      }
    }

    if (error.response.status === 403 && error.response.data) {
      return Promise.reject(error.response.data)
    }
  }
)

export { authApi, publicApi, SERVER_URL }
