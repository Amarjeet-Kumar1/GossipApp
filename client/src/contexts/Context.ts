import { createContext } from "react"
import { InitialState } from "./types"

export const initialState: InitialState = {
  //auth
  auth: null,
  authLoading: true,
  authError: null,
  socketStatus: false,
  authUri: "",
  //attachment
  modalFor: null,
  files: [],
  fileInPreview: 0,
  //caller
  onCall: false,
  ringing: false,
  incomingCall: false,
  callerInfo: {
    active: false,
    displayName: "James Veeler",
    avatar:
      "https://images.unsplash.com/photo-1628191140046-8be8856fd011?ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  //chat
  authUsers: {},
  guestUsers: {},
  activeChat: null,
  chatLoading: true,
  chat: {},
  //chat container
  chatContainerModal: null,
  //dropdown
  dropDown: "",
  //global
  globalModal: null,
  msgInFocus: null,
  //movable
  movableModal: null,
  //room
  roomModal: null,
  newConnection: null,
  disconnectCall: false,
  micStatus: true,
  videoStatus: true,
  //sidebar
  sidebarModal: null,
  initiateSignin: function () {},

  initAuthuserInfoUpdate: function () {},

  authuserInfoUpdateSuccessfull: function () {},

  authuserInfoUpdateFailed: function () {},

  setSocketConnectionSuccess: function () {},

  setAuthSuccess: function () {},

  setAuthFailed: function () {},

  initiateLogout: function () {},

  socketDisconnected: function () {},
  logout: function () {},
  setUri: function () {},
  initCall: function () {},
  callingActive: function () {},
  callConnected: function () {},
  othersCalling: function () {},
  rejectCall: function () {},
  // Chat related action creators
  getInitialChats: function () {},

  onChatsLoadComplete: function () {},

  setTotalAuthUsers: function () {},

  updateTotalAuthUsers: function () {},

  updateAuthUsersInfo: function () {},

  updateActiveAuthUser: function () {},

  updateInactiveAuthUser: function () {},

  // Active chat-related actions
  setActiveChat: function () {},

  sendMsgStart: function () {},

  sendMsgSuccessful: function () {},

  sendFileInit: function () {},

  updateSentFileUrl: function () {},

  replaceDownloadedVideoURL: function () {},

  recieveMessage: function () {},

  sendMsgNotSuccessful: function () {},

  createNewChat: function () {},

  createNewGroup: function () {},

  newGroupCreated: function () {},

  updateChats: function () {},

  newChatSuccessfullyCreated: function () {},

  newChatCreationFailed: function () {},

  initGroupInfoUpdate: function () {},

  groupInfoUpdateSuccessfull: function () {},

  groupInfoUpdateFailed: function () {},

  // Attachment modal actions
  setAttachmentModal: function () {},

  addAttachments: function () {},

  removeAttachment: function () {},

  changeFileInPreview: function () {},

  resetFileAttachmentModal: function () {},

  uploadAttachments: function () {},

  uploadAttachmentsSuccessful: function () {},

  uploadAttachmentsFailed: function () {},

  // Modal actions
  setChatContainerModal: function () {},

  setDropDown: function () {},

  setGlobalModal: function () {},

  setGlobalMsgInFocus: function () {},

  setMovableModal: function () {},

  setRoomModal: function () {},

  setNewConnection: function () {},

  disconnectFromCall: function () {},

  // Media status actions
  toggleVideo: function () {},

  toggleAudio: function () {},

  resetRoomModal: function () {},

  // Sidebar actions
  setSidebarModal: function () {},
}

export const Context = createContext(initialState)
