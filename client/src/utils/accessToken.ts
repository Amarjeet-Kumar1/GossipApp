export const setAccessToken = (newAccessToken: string) => {
  if (newAccessToken) localStorage.setItem("GossipApp_token", newAccessToken)
}

export const getAccessToken = () =>
  localStorage.getItem("GossipApp_token") || ""
