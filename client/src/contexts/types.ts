export interface AuthUserType {
  objectId?: string
  displayName?: string
  email?: string
  avatar?: string
  createdOn?: string
  about?: string
  lastSeen?: number
  loading?: boolean
  status?: boolean
  authType?: string
  uid?: string
  _id?: string
  color?: string
}

export interface ParticipantsType {
  objectId: string
  lastViewed: number | null
}

export interface ChatInfoType {
  _id: string
  participants: ParticipantsType[]
  modifiendOn: number
  avatar?: any
  type: string
  clientSide?: boolean
  loading?: boolean
  // For groups
  name?: string
  createdOn?: string
  desc?: string
}

export interface MsgTypes {
  _id?: string
  type: string
  msgType: string
  msgParams?: any
  refId?: string
  timestamp: number
  sentBy: string
  stillSending?: boolean
  tempId?: string
}

export interface ChatType {
  chatInfo: ChatInfoType
  messages: MsgTypes[]
  stillSaving?: boolean
}

export interface ChatStateType {
  authUsers: { [k: string]: AuthUserType }
  guestUsers: { [k: string]: AuthUserType }
  activeChat: null | string
  loading: boolean
  chat: { [k: string]: ChatType }
}

export interface CallerInfo {
  active?: boolean
  displayName?: string
  avatar?: string
  peerId?: string
}

export interface InitialState {
  // Authentication
  auth: AuthUserType | null
  authLoading: boolean
  authError: any | null
  socketStatus: boolean
  authUri: string

  // Attachment
  modalFor: string | null
  files: any[]
  fileInPreview: any

  // Caller
  onCall: boolean
  ringing: boolean
  incomingCall: boolean
  callerInfo: CallerInfo

  // Chat
  authUsers: { [k: string]: AuthUserType }
  guestUsers: { [k: string]: AuthUserType }
  activeChat: any
  chatLoading: boolean
  chat: { [k: string]: ChatType }

  // Chat Container
  chatContainerModal: any

  // Dropdown
  dropDown: any

  // Global
  globalModal: any | null
  msgInFocus: any

  // Movable
  movableModal: any | null

  // Room
  roomModal: any
  newConnection: any | null
  disconnectCall: boolean
  micStatus: boolean
  videoStatus: boolean

  // Sidebar
  sidebarModal: any | null

  initiateSignin: () => void

  initAuthuserInfoUpdate: () => void

  authuserInfoUpdateSuccessfull: (payload: any) => void

  authuserInfoUpdateFailed: () => void

  setSocketConnectionSuccess: () => void

  setAuthSuccess: (payload: any) => void

  setAuthFailed: (payload: any) => void

  initiateLogout: () => void

  socketDisconnected: () => void
  logout: () => void
  setUri: (payload: any) => void
  initCall: () => void
  callingActive: () => void
  callConnected: () => void
  othersCalling: (payload: any) => void
  rejectCall: () => void
  // Chat related action creators
  getInitialChats: () => void

  onChatsLoadComplete: (payload: any) => void

  setTotalAuthUsers: (payload: any) => void

  updateTotalAuthUsers: (payload: any) => void

  updateAuthUsersInfo: (payload: any) => void

  updateActiveAuthUser: (payload: any) => void

  updateInactiveAuthUser: (payload: any) => void

  // Active chat-related actions
  setActiveChat: (payload: any) => void

  sendMsgStart: (payload: any) => void

  sendMsgSuccessful: (payload: any) => void

  sendFileInit: (payload: any) => void

  updateSentFileUrl: (payload: any) => void

  replaceDownloadedVideoURL: (payload: any) => void

  recieveMessage: (payload: any) => void

  sendMsgNotSuccessful: (payload: any) => void

  createNewChat: (payload: any) => void

  createNewGroup: (payload: any) => void

  newGroupCreated: (payload: any) => void

  updateChats: (payload: any) => void

  newChatSuccessfullyCreated: (payload: any) => void

  newChatCreationFailed: (payload: any) => void

  initGroupInfoUpdate: (payload: any) => void

  groupInfoUpdateSuccessfull: (payload: any) => void

  groupInfoUpdateFailed: (payload: any) => void

  // Attachment modal actions
  setAttachmentModal: (payload: any) => void

  addAttachments: (payload: any) => void

  removeAttachment: (payload: any) => void

  changeFileInPreview: (payload: any) => void

  resetFileAttachmentModal: () => void

  uploadAttachments: () => void

  uploadAttachmentsSuccessful: () => void

  uploadAttachmentsFailed: () => void

  // Modal actions
  setChatContainerModal: (payload: any) => void

  setDropDown: (payload: any) => void

  setGlobalModal: (payload: any) => void

  setGlobalMsgInFocus: (payload: any) => void

  setMovableModal: (payload: any) => void

  setRoomModal: (payload: any) => void

  setNewConnection: (payload: any) => void

  disconnectFromCall: (payload: any) => void

  // Media status actions
  toggleVideo: (payload: any) => void

  toggleAudio: (payload: any) => void

  resetRoomModal: () => void

  // Sidebar actions
  setSidebarModal: (payload: any) => void
}

export type ActionType =
  | "initiateSignin"
  | "initAuthuserInfoUpdate"
  | "authuserInfoUpdateSuccessfull"
  | "authuserInfoUpdateFailed"
  | "setSocketConnectionSuccess"
  | "setAuthSuccess"
  | "setAuthFailed"
  | "initiateLogout"
  | "socketDisconnected"
  | "logout"
  | "setUri"
  | "initCall"
  | "callingActive"
  | "callConnected"
  | "othersCalling"
  | "rejectCall"
  | "getInitialChats"
  | "onChatsLoadComplete"
  | "setTotalAuthUsers"
  | "updateTotalAuthUsers"
  | "updateAuthUsersInfo"
  | "updateActiveAuthUser"
  | "updateInactiveAuthUser"
  | "setActiveChat"
  | "sendMsgStart"
  | "sendMsgSuccessful"
  | "sendFileInit"
  | "updateSentFileUrl"
  | "replaceDownloadedVideoURL"
  | "recieveMessage"
  | "sendMsgNotSuccessful"
  | "createNewChat"
  | "createNewGroup"
  | "newGroupCreated"
  | "updateChats"
  | "newChatSuccessfullyCreated"
  | "newChatCreationFailed"
  | "initGroupInfoUpdate"
  | "groupInfoUpdateSuccessfull"
  | "groupInfoUpdateFailed"
  | "setAttachmentModal"
  | "addAttachments"
  | "removeAttachment"
  | "changeFileInPreview"
  | "resetFileAttachmentModal"
  | "uploadAttachments"
  | "uploadAttachmentsSuccessful"
  | "uploadAttachmentsFailed"
  | "setChatContainerModal"
  | "setDropDown"
  | "setGlobalModal"
  | "setGlobalMsgInFocus"
  | "setMovableModal"
  | "setRoomModal"
  | "setNewConnection"
  | "disconnectFromCall"
  | "toggleVideo"
  | "toggleAudio"
  | "resetRoomModal"
  | "setSidebarModal"
