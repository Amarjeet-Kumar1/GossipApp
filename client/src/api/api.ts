import axios from "axios"
import { getAccessToken } from "../utils/accessToken"
import { refreshToken } from "../utils/refreshToken"

const SERVER_URL = import.meta.env.VITE_SERVER_URL

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
    Authorization: `Bearer ${getAccessToken()}`,
    "Content-type": "application/json",
  },
  withCredentials: true,
})

authApi.interceptors.request.use(
  async (request) => {
    request.headers!.Authorization = `Bearer ${getAccessToken()}`
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
        authApi.defaults.headers!.common.Authorization = `Bearer ${getAccessToken()}`
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
