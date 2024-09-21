import s from "../movableModal.module.scss"
import { useContext, useRef, useState } from "react"
import CropFreeIcon from "@mui/icons-material/CropFree"
import CloseIcon from "@mui/icons-material/Close"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit"

// Volume
import VolumeUpIcon from "@mui/icons-material/VolumeUp"
import VolumeDownIcon from "@mui/icons-material/VolumeDown"
import VolumeMuteIcon from "@mui/icons-material/VolumeMute"
import VolumeOffIcon from "@mui/icons-material/VolumeOff"
import { landscapeOffset, potraitOffset } from "../../../constants/movableModal"
import { CircularProgress } from "@mui/material"
import { Context } from "../../../contexts/Context"

const VolumeButton = ({ vol }: { vol: number }) => {
  if (vol < 1) return <VolumeOffIcon />
  if (vol <= 30) return <VolumeMuteIcon />
  if (vol <= 70) return <VolumeDownIcon />
  if (vol <= 100) return <VolumeUpIcon />
  return <div />
}

export const MinimizedVideo = ({ params }: any) => {
  const { setGlobalModal, setMovableModal } = useContext(Context)
  const [duration, setDuration] = useState<any>(null)
  const [play, setPlay] = useState(false)
  const [vol, setVol] = useState(100)
  const [volVisible, setVolVisible] = useState(false)

  const videoRef: any = useRef(null)
  const animationRef: any = useRef(null)
  const progressbarRef: any = useRef(null)
  const volProgressRef: any = useRef(null)

  const [vidLoaded, setVidLoaded] = useState(false)

  const offset =
    params.orientation === "potrait" ? potraitOffset : landscapeOffset

  const loadDuration = ({ duration }: any) => {
    if (duration) {
      setDuration(Math.floor(duration))
      progressbarRef.current.max = Math.floor(duration)
    }
  }

  const handleAudioState = () => {
    if (play) {
      videoRef.current.pause()
      setPlay(false)
      cancelAnimationFrame(animationRef.current)
    } else {
      videoRef.current.play()
      setPlay(true)
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
  }

  const whilePlaying = () => {
    try {
      progressbarRef.current.value = videoRef.current?.currentTime
      changePlayerCurrentTime()
      animationRef.current = requestAnimationFrame(whilePlaying)
    } catch {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }

  const changeRange = () => {
    videoRef.current.currentTime = progressbarRef.current.value
    changePlayerCurrentTime()
  }

  const changePlayerCurrentTime = () => {
    progressbarRef.current.style.setProperty(
      "--seek-before-width",
      `${(progressbarRef.current.value / duration) * 100}%`
    )
  }

  const changeVolume = () => {
    const vol = volProgressRef.current.value
    videoRef.current.volume = vol / 100
    volProgressRef.current.style.setProperty("--seek-before-width", `${vol}%`)
    setVol(vol)
  }

  const openMinimizedVideo = () => {
    setMovableModal({
      type: "minimizedVideo",
      params: {
        ...offset,
        url: params.url,
        mode: "mini",
        orientation: params.orientation,
      },
    })
    setGlobalModal(null)
  }

  const fullScreenMode = () => {
    videoRef.current.requestFullscreen()
  }

  return (
    <div className={s.minimizedVideo}>
      {vidLoaded ? null : (
        <span className={s.loader}>
          <CircularProgress className={s.loaderB} />
        </span>
      )}
      <div
        style={{
          opacity: vidLoaded ? 1 : 0,
        }}
        className={s.control}
      >
        <div className={s.header}>
          <CropFreeIcon onClick={fullScreenMode} />
          {params.mode === "mini" ? (
            <CloseIcon onClick={() => setMovableModal(null)} />
          ) : (
            <FullscreenExitIcon onClick={openMinimizedVideo} />
          )}
        </div>
        <div className={s.footer}>
          <div className={s.controlBtn}>
            <button onClick={handleAudioState}>
              {play ? <PauseIcon /> : <PlayArrowIcon />}
            </button>
          </div>
          <input
            onChange={changeRange}
            defaultValue="0"
            ref={progressbarRef}
            type="range"
          />
          <div
            onMouseLeave={() => setVolVisible(false)}
            onMouseEnter={() => setVolVisible(true)}
            className={s.volController}
          >
            {volVisible ? (
              <div
                className={`${s.volTrack} ${
                  params.mode === "mini" ? s.volTrackMinimized : s.volTrackModal
                }`}
              >
                <input
                  onChange={changeVolume}
                  defaultValue={100}
                  ref={volProgressRef}
                  type="range"
                  max={100}
                  min={0}
                  className={s.progressBar}
                />
              </div>
            ) : null}
            <button>{<VolumeButton vol={vol} />}</button>
          </div>
        </div>
      </div>
      <video
        style={{
          opacity: vidLoaded ? 1 : 0,
        }}
        ref={videoRef}
        src={params.url}
        onEnded={() => setPlay(false)}
        onDurationChange={(e) => loadDuration(e.target)}
        onLoadedData={(e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
          setVidLoaded(true)
          //@ts-ignore
          e.target.play()
          setPlay(true)
        }}
      />
    </div>
  )
}
