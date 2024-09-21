import s from "./dropmenu.module.scss"
import { DropdownAnimation } from "../../animations/dropdown/DropdownAnimation"
import { useContext } from "react"
import { Context } from "../../../contexts/Context"

export const AddAvatarDropdown = () => {
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

  const sizeParam = {
    height: 68,
    width: 140,
    yOffset: 73,
    xOffset: 142,
  }
  return (
    <DropdownAnimation
      sizeParam={sizeParam}
      locationParams={dropDown.position}
      className={s.dropDown}
    >
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
    </DropdownAnimation>
  )
}
