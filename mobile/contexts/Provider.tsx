import { ReactNode, useReducer } from "react"
import { Context, initialState } from "./Context"
import { ActionType, AuthUserType, InitialState } from "./types"
import "react-native-get-random-values"
import { ObjectId } from "bson"
import { RandomColors } from "@/constants/RandomColors"

type Action = {
  type: ActionType
  payload: any
}

const reducer = (state: InitialState, action: Action): InitialState => {
  let _authUsers = state.authUsers
  let _chat = state.chat
  switch (action.type) {
    case "initiateSignin":
      return {
        ...state,
        authLoading: true,
      }
    case "initAuthuserInfoUpdate":
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: true,
        },
      }
    case "authuserInfoUpdateSuccessfull":
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: false,
          ...action.payload,
        },
      }
    case "authuserInfoUpdateFailed":
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: false,
        },
      }
    case "setSocketConnectionSuccess":
      return {
        ...state,
        socketStatus: true,
      }
    case "setAuthSuccess":
      return {
        ...state,
        auth: action.payload,
        authLoading: false,
        authError: null,
      }
    case "setAuthFailed":
      return {
        ...state,
        auth: null,
        authLoading: false,
        authError: action.payload,
        socketStatus: false,
      }
    case "initiateLogout":
      return {
        ...state,
        auth: null,
        authLoading: true,
        authError: "Logging Out...",
      }
    case "socketDisconnected":
      return {
        ...state,
        socketStatus: false,
      }
    case "logout":
      return {
        ...state,
        authLoading: false,
      }
    case "setUri":
      return {
        ...state,
        authUri: action.payload,
      }
    case "initCall":
      return state
    case "callingActive":
      return {
        ...state,
        onCall: true,
      }
    case "callConnected":
      return {
        ...state,
        ringing: true,
        callerInfo: {},
      }
    case "othersCalling":
      return {
        ...state,
        incomingCall: true,
        callerInfo: action.payload,
      }
    case "rejectCall":
      return {
        ...state,
        onCall: false,
        ringing: false,
        incomingCall: false,
        callerInfo: {},
      }
    case "getInitialChats":
      return {
        ...state,
        chatLoading: true,
      }
    case "onChatsLoadComplete":
      return {
        ...state,
        chatLoading: false,
        chat: action.payload,
      }
    case "setTotalAuthUsers":
      action.payload.forEach((user: AuthUserType) => {
        _authUsers[user._id as string] = {
          objectId: user._id as string,
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          avatar: user.avatar,
          createdOn: user.createdOn,
          about: user.about,
          status: user.status,
          lastSeen: user.lastSeen,
          color:
            RandomColors[Math.floor(Math.random() * RandomColors.length - 1)],
        }
      })
      return {
        ...state,
        authUsers: { ..._authUsers },
      }
    case "updateTotalAuthUsers":
      _authUsers[action.payload.objectId] = {
        ...action.payload,
        color:
          RandomColors[Math.floor(Math.random() * RandomColors.length - 1)],
      }
      return {
        ...state,
        authUsers: { ..._authUsers },
      }
    case "updateAuthUsersInfo":
      _authUsers[action.payload.objectId] = {
        ..._authUsers[action.payload.objectId],
        ...action.payload,
      }
      return {
        ...state,
        authUsers: { ..._authUsers },
      }
    case "updateActiveAuthUser":
      _authUsers[action.payload].status = true
      return {
        ...state,
        authUsers: { ..._authUsers },
      }
    case "updateInactiveAuthUser":
      if (_authUsers[action.payload._id]) {
        _authUsers[action.payload._id].status = false
        _authUsers[action.payload._id].lastSeen = action.payload.lastSeen
      }
      return {
        ...state,
        authUsers: { ..._authUsers },
      }
    case "setActiveChat":
      return {
        ...state,
        activeChat: action.payload.switchTo,
      }
    case "sendMsgStart":
      _chat[action.payload.refId].messages.push({
        ...action.payload,
        stillSending: true,
      })
      return {
        ...state,
        chat: { ..._chat },
      }
    case "sendMsgSuccessful":
      const refArrIndex = _chat[action.payload.refId].messages.findIndex(
        (e: any) => {
          return e.tempId === action.payload.tempId
        }
      )
      _chat[action.payload.refId].messages[refArrIndex]._id = action.payload._id
      _chat[action.payload.refId].messages[refArrIndex].stillSending = false
      delete _chat[action.payload.refId].messages[refArrIndex].tempId

      return {
        ...state,
        chat: { ..._chat },
      }
    case "sendFileInit":
      _chat[action.payload.refId].messages.push({
        ...action.payload,
        stillSending: true,
      })

      return {
        ...state,
        chat: { ..._chat },
      }
    case "updateSentFileUrl":
      const refArrIndex1 = _chat[action.payload.refId].messages.findIndex(
        (e: any) => {
          return e.tempId === action.payload.tempId
        }
      )

      _chat[action.payload.refId].messages[refArrIndex1].msgParams.url =
        action.payload.updatedUrl
      return {
        ...state,
        chat: { ..._chat },
      }
    case "replaceDownloadedVideoURL":
      const refArrIndex2 = _chat[action.payload.chatId].messages.findIndex(
        (e: any) => {
          return e._id === action.payload.messageId
        }
      )

      _chat[action.payload.chatId].messages[refArrIndex2].msgParams.url =
        action.payload.updatedUrl
      return {
        ...state,
        chat: { ..._chat },
      }
    case "recieveMessage":
      _chat[action.payload.refId].messages.push({
        ...action.payload,
      })
      return {
        ...state,
        chat: { ..._chat },
      }
    case "sendMsgNotSuccessful":
      return {
        ...state,
        activeChat: action.payload,
      }
    case "createNewChat":
      const assignedId = new ObjectId().toString()
      _chat[assignedId] = {
        chatInfo: {
          _id: assignedId,
          ...action.payload,
          clientSide: true,
        },
        messages: [],
      }

      return {
        ...state,
        chat: { ..._chat },
        activeChat: assignedId,
      }
    case "createNewGroup":
      _chat[action.payload._id] = {
        chatInfo: action.payload,
        messages: [],
        stillSaving: true,
      }
      return {
        ...state,
        chat: { ..._chat },
        activeChat: action.payload._id,
      }
    case "newGroupCreated":
      _chat[action.payload._id].stillSaving = false

      return {
        ...state,
        chat: { ..._chat },
      }
    case "updateChats":
      _chat[action.payload.chatInfo._id] = action.payload
      return {
        ...state,
        chat: { ..._chat },
      }
    case "newChatSuccessfullyCreated":
      delete _chat[action.payload].chatInfo.clientSide
      return {
        ...state,
        chat: { ..._chat },
      }
    case "newChatCreationFailed":
      return {
        ...state,
        activeChat: action.payload,
      }
    case "initGroupInfoUpdate":
      _chat[action.payload.groupId].chatInfo.loading = true
      return {
        ...state,
        chat: { ..._chat },
      }
    case "groupInfoUpdateSuccessfull":
      _chat[action.payload.groupId].chatInfo = {
        ..._chat[action.payload.groupId].chatInfo,
        ...action.payload.updatedParams,
      }
      return {
        ...state,
        chat: { ..._chat },
      }
    case "groupInfoUpdateFailed":
      _chat[action.payload.groupId].chatInfo.loading = false
      return {
        ...state,
        chat: { ..._chat },
      }
    case "setAttachmentModal":
      return {
        ...state,
        modalFor: action.payload,
      }
    case "addAttachments":
      return {
        ...state,
        files: [...state.files, ...action.payload],
      }
    case "removeAttachment":
      return {
        ...state,
        files: state.files.splice(action.payload, 1),
      }
    case "changeFileInPreview":
      return {
        ...state,
        fileInPreview: action.payload,
      }
    case "resetFileAttachmentModal":
      return {
        ...state,
        modalFor: null,
        files: [],
        fileInPreview: 0,
      }
    case "uploadAttachments":
      return state
    case "uploadAttachmentsSuccessful":
      return state
    case "uploadAttachmentsFailed":
      return state
    case "setChatContainerModal":
      return {
        ...state,
        chatContainerModal: action.payload,
      }
    case "setDropDown":
      return {
        ...state,
        dropDown: action.payload,
      }
    case "setGlobalModal":
      return {
        ...state,
        globalModal: action.payload,
      }
    case "setGlobalMsgInFocus":
      return {
        ...state,
        msgInFocus: action.payload,
      }
    case "setMovableModal":
      return {
        ...state,
        movableModal: action.payload,
      }
    case "setRoomModal":
      return {
        ...state,
        roomModal: action.payload,
        disconnectCall: false,
      }
    case "setNewConnection":
      return {
        ...state,
        newConnection: action.payload,
      }
    case "disconnectFromCall":
      return {
        ...state,
        disconnectCall: action.payload,
      }
    case "toggleVideo":
      return {
        ...state,
        videoStatus: action.payload,
      }
    case "toggleAudio":
      return {
        ...state,
        micStatus: action.payload,
      }
    case "resetRoomModal":
      return {
        ...state,
        roomModal: null,
        newConnection: null,
        disconnectCall: false,
        micStatus: false,
        videoStatus: false,
      }
    case "setSidebarModal":
      return { ...state, sidebarModal: action.payload }
    default:
      return state
  }
}

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = {
    ...state,
    itiateSignin: function () {
      dispatch({ type: "initiateSignin", payload: "" })
    },

    initAuthuserInfoUpdate: function () {
      dispatch({ type: "initAuthuserInfoUpdate", payload: "" })
    },

    authuserInfoUpdateSuccessfull: function (payload: any) {
      dispatch({ type: "authuserInfoUpdateSuccessfull", payload })
    },

    authuserInfoUpdateFailed: function () {
      dispatch({ type: "authuserInfoUpdateFailed", payload: "" })
    },

    setSocketConnectionSuccess: function () {
      dispatch({ type: "setSocketConnectionSuccess", payload: "" })
    },

    setAuthSuccess: function (payload: any) {
      dispatch({ type: "setAuthSuccess", payload })
    },

    setAuthFailed: function (payload: any) {
      dispatch({ type: "setAuthFailed", payload })
    },

    initiateLogout: function () {
      dispatch({ type: "initiateLogout", payload: "" })
    },

    socketDisconnected: function () {
      dispatch({ type: "socketDisconnected", payload: "" })
    },
    logout: function () {
      dispatch({ type: "logout", payload: "" })
    },
    setUri: function (payload: any) {
      dispatch({ type: "setUri", payload })
    },
    initCall: function () {
      dispatch({ type: "initCall", payload: "" })
    },
    callingActive: function () {
      dispatch({ type: "callingActive", payload: "" })
    },
    callConnected: function () {
      dispatch({ type: "callConnected", payload: "" })
    },
    othersCalling: function (payload: any) {
      dispatch({ type: "othersCalling", payload })
    },
    rejectCall: function () {
      dispatch({ type: "rejectCall", payload: "" })
    },
    // Chat related action creators
    getInitialChats: function () {
      dispatch({ type: "getInitialChats", payload: "" })
    },

    onChatsLoadComplete: function (payload: any) {
      dispatch({ type: "onChatsLoadComplete", payload })
    },

    setTotalAuthUsers: function (payload: any) {
      dispatch({ type: "setTotalAuthUsers", payload })
    },

    updateTotalAuthUsers: function (payload: any) {
      dispatch({ type: "updateTotalAuthUsers", payload })
    },

    updateAuthUsersInfo: function (payload: any) {
      dispatch({ type: "updateAuthUsersInfo", payload })
    },

    updateActiveAuthUser: function (payload: any) {
      dispatch({ type: "updateActiveAuthUser", payload })
    },

    updateInactiveAuthUser: function (payload: any) {
      dispatch({ type: "updateInactiveAuthUser", payload })
    },

    // Active chat-related actions
    setActiveChat: function (payload: any) {
      dispatch({ type: "setActiveChat", payload })
    },

    sendMsgStart: function (payload: any) {
      dispatch({ type: "sendMsgStart", payload })
    },

    sendMsgSuccessful: function (payload: any) {
      dispatch({ type: "sendMsgSuccessful", payload })
    },

    sendFileInit: function (payload: any) {
      dispatch({ type: "sendFileInit", payload })
    },

    updateSentFileUrl: function (payload: any) {
      dispatch({ type: "updateSentFileUrl", payload })
    },

    replaceDownloadedVideoURL: function (payload: any) {
      dispatch({ type: "replaceDownloadedVideoURL", payload })
    },

    recieveMessage: function (payload: any) {
      dispatch({ type: "recieveMessage", payload })
    },

    sendMsgNotSuccessful: function (payload: any) {
      dispatch({ type: "sendMsgNotSuccessful", payload })
    },

    createNewChat: function (payload: any) {
      dispatch({ type: "createNewChat", payload })
    },

    createNewGroup: function (payload: any) {
      dispatch({ type: "createNewGroup", payload })
    },

    newGroupCreated: function (payload: any) {
      dispatch({ type: "newGroupCreated", payload })
    },

    updateChats: function (payload: any) {
      dispatch({ type: "updateChats", payload })
    },

    newChatSuccessfullyCreated: function (payload: any) {
      dispatch({ type: "newChatSuccessfullyCreated", payload })
    },

    newChatCreationFailed: function (payload: any) {
      dispatch({ type: "newChatCreationFailed", payload })
    },

    initGroupInfoUpdate: function (payload: any) {
      dispatch({ type: "initGroupInfoUpdate", payload })
    },

    groupInfoUpdateSuccessfull: function (payload: any) {
      dispatch({ type: "groupInfoUpdateSuccessfull", payload })
    },

    groupInfoUpdateFailed: function (payload: any) {
      dispatch({ type: "groupInfoUpdateFailed", payload })
    },

    // Attachment modal actions
    setAttachmentModal: function (payload: any) {
      dispatch({ type: "setAttachmentModal", payload })
    },

    addAttachments: function (payload: any) {
      dispatch({ type: "addAttachments", payload })
    },

    removeAttachment: function (payload: any) {
      dispatch({ type: "removeAttachment", payload })
    },

    changeFileInPreview: function (payload: any) {
      dispatch({ type: "changeFileInPreview", payload })
    },

    resetFileAttachmentModal: function () {
      dispatch({ type: "resetFileAttachmentModal", payload: "" })
    },

    uploadAttachments: function () {},

    uploadAttachmentsSuccessful: function () {},

    uploadAttachmentsFailed: function () {},

    // Modal actions
    setChatContainerModal: function (payload: any) {
      dispatch({ type: "setChatContainerModal", payload })
    },

    setDropDown: function (payload: any) {
      dispatch({ type: "setDropDown", payload })
    },

    setGlobalModal: function (payload: any) {
      dispatch({ type: "setGlobalModal", payload })
    },

    setGlobalMsgInFocus: function (payload: any) {
      dispatch({ type: "setGlobalMsgInFocus", payload })
    },

    setMovableModal: function (payload: any) {
      dispatch({ type: "setMovableModal", payload })
    },

    setRoomModal: function (payload: any) {
      dispatch({ type: "setRoomModal", payload })
    },

    setNewConnection: function (payload: any) {
      dispatch({ type: "setNewConnection", payload })
    },

    disconnectFromCall: function (payload: any) {
      dispatch({ type: "disconnectFromCall", payload })
    },

    // Media status actions
    toggleVideo: function (payload: any) {
      dispatch({ type: "toggleVideo", payload })
    },

    toggleAudio: function (payload: any) {
      dispatch({ type: "toggleAudio", payload })
    },

    resetRoomModal: function () {
      dispatch({ type: "resetRoomModal", payload: "" })
    },

    // Sidebar actions
    setSidebarModal: function (payload: any) {
      dispatch({ type: "setSidebarModal", payload })
    },
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}
