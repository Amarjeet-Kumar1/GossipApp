import { useContext } from "react"
import { DropdownAnimation } from "../../animations/dropdown/DropdownAnimation"
import s from "./dropmenu.module.scss"
import { Context } from "../../../contexts/Context"

export const ChangeAvatarDropdown = () => {
  const { dropDown, setDropDown, setGlobalModal } = useContext(Context)
  const takePhoto = () => {
    if (localStorage.getItem("_streamPermission")) {
      setGlobalModal({
        type: "takePhoto",
        params: dropDown.params,
      })
    } else {
      setGlobalModal({
        type: "allowCamera",
        params: dropDown.params,
      })
    }
    setDropDown("")
  }

  const viewPhoto = () => {
    setGlobalModal({
      type: "viewPhoto",
      params: dropDown.params,
    })
    setDropDown("")
  }

  const sizeParam = {
    height: 136,
    width: 140,
    yOffset: 0,
    xOffset: 142,
  }
  return (
    <DropdownAnimation
      sizeParam={sizeParam}
      locationParams={dropDown.position}
      className={s.dropDown}
    >
      <div onClick={viewPhoto} className={s.list}>
        <p>View photo</p>
      </div>
      <div onClick={takePhoto} className={s.list}>
        <p>Take photo</p>
      </div>
      <div className={s.list}>
        <input
          type="file"
          accept="image/png"
          onChange={(e: any) =>
            dropDown.params.handleAvatarChange(e.target.files[0])
          }
        />
        <p>Upload photo</p>
      </div>
      <div onClick={dropDown.params.handleRemoveImage} className={s.list}>
        <p>Remove photo</p>
      </div>
    </DropdownAnimation>
  )
}
