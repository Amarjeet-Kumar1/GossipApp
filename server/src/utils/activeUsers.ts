// Only saving objectId of activeUsers
let activeUsers: { objectId: any; socketId: any }[] = []

export const addToActiveUsers = (user: any) => {
  activeUsers.push(user)
}

export const getActiveUsers = () => activeUsers

export const getActiveUserBySocketId = (socketId: any) => {
  return activeUsers.find((e: any) => e.socketId == socketId)
}

export const getActiveUserByObjectId = (objectId: any) => {
  return activeUsers.find((e: any) => e.objectId == objectId)
}

export const removeActiveUserBySocketId = (socketId: any) => {
  activeUsers = activeUsers.filter((e) => e.socketId !== socketId)
}

export const removeActiveUserByObjectId = (objectId: any) => {
  activeUsers = activeUsers.filter((e) => e.objectId !== objectId)
}
