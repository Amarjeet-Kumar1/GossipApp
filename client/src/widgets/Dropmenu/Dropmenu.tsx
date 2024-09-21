import { AddAvatarDropdown } from "./Components/AddAvatarDropdown"
import { ChangeAvatarDropdown } from "./Components/ChangeAvatarDropdown"
import { useContext } from "react"
import { Context } from "../../contexts/Context"

export const DropMenu = () => {
  const { dropDown } = useContext(Context)
  switch (dropDown.type) {
    case "addAvatar":
      return <AddAvatarDropdown />
    case "changeAvatar":
      return <ChangeAvatarDropdown />
    default:
      return (
        <div
          style={{
            display: "none",
          }}
        />
      )
  }
}
