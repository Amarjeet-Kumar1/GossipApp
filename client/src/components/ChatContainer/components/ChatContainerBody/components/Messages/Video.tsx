import s from "./messages.module.scss"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import { useContext, useState } from "react"
import VideocamIcon from "@mui/icons-material/Videocam"
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit"
import CircularProgress from "@mui/material/CircularProgress"
import CloseIcon from "@mui/icons-material/Close"
import ForwardIcon from "@mui/icons-material/Forward"
import {
  landscapeOffset,
  potraitOffset,
} from "../../../../../../constants/movableModal"
import { getDuration } from "../../../../../../utils/parseDuration"
import { formatTime } from "../../../../../../utils/formatTime"
import { SeenStats } from "../../../../../../widgets/SeenStats/SeenStats"
import { Context } from "../../../../../../contexts/Context"

export const Video = ({
  _id,
  msgPosition,
  refId,
  msgParams,
  timestamp,
  extraParam,
  stillSending,
}: any) => {
  const {
    movableModal,
    setMovableModal,
    setGlobalModal,
    setGlobalMsgInFocus,
    replaceDownloadedVideoURL: updateVideoUrl,
  } = useContext(Context)
  const { thumbnail, url, size, duration, orientation } = msgParams
  const [loading, setLoading] = useState<boolean>(false)
  const [downloaded, setDownloaded] = useState<boolean>(false)
  const offset = orientation === "potrait" ? potraitOffset : landscapeOffset

  const openMinimizedVideo = () => {
    setMovableModal({
      type: "minimizedVideo",
      params: {
        url: url,
        mode: "mini",
        orientation: orientation,
        ...offset,
      },
    })
  }

  const openVideoPreview = () => {
    setGlobalModal({
      type: "viewMsgPreview",
      params: {},
    })
    setGlobalMsgInFocus(_id)
  }

  const downloadVideo = async () => {
    setLoading(true)
    const data = await fetch(url).then((r) => r.blob())
    const blob = new Blob([data])
    const newURL = window.URL.createObjectURL(blob)
    console.log(newURL)
    updateVideoUrl({
      messageId: _id,
      chatId: refId,
      updatedUrl: newURL,
    })
    setDownloaded(true)
    setLoading(false)
  }

  const cancelDownload = () => {
    setLoading(false)
  }

  return (
    <span className={msgPosition === "right" ? s.voiceRight : s.voiceLeft}>
      <div className={s.video}>
        <div
          className={orientation === "potrait" ? s.imgPotrait : s.imgLandscape}
        >
          <div className={s.smoke}>
            <FullscreenExitIcon onClick={openMinimizedVideo} />
            <ExpandMoreIcon />
            <div
              className={s.clickable}
              onClick={
                downloaded
                  ? openVideoPreview
                  : loading
                  ? cancelDownload
                  : downloadVideo
              }
            />
          </div>
          <div className={s.thumbnailView}>
            <div className={s.thumbnailControl}>
              <div />
              {!downloaded ? (
                <div
                  onClick={loading ? cancelDownload : downloadVideo}
                  className={s.downloadWrapper}
                >
                  {loading || stillSending ? (
                    <button onClick={cancelDownload} className={s.loader}>
                      <CloseIcon className={s.closeIcon} />
                      <CircularProgress className={s.icon} />
                    </button>
                  ) : (
                    <button onClick={downloadVideo} className={s.download}>
                      <ForwardIcon className={s.downloadIcon} />
                      <small>{size}</small>
                    </button>
                  )}
                </div>
              ) : (
                <PlayArrowIcon />
              )}
              <div className={s.thumbnailFooter}>
                <div className={s._A}>
                  <VideocamIcon />
                  <small>{getDuration(duration)}</small>
                </div>
                {extraParam.owner ? (
                  <div className={s._A}>
                    <small>{formatTime(timestamp)}</small>
                    <SeenStats
                      type={stillSending ? -1 : extraParam.seenStatus}
                    />{" "}
                  </div>
                ) : (
                  <div className={s._A}>
                    <small
                      style={{
                        marginRight: "5px",
                      }}
                    >
                      {formatTime(timestamp)}
                    </small>
                  </div>
                )}
              </div>
            </div>
            <img
              draggable={false}
              className={downloaded ? s.releasedImg : s.thumbnail}
              src={thumbnail}
              alt="file-thumbnail"
            />
          </div>
        </div>
      </div>
    </span>
  )
}
