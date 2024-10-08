import s from "./sidebarHeadStyles.module.scss"
import { useContext } from "react"
import { Context } from "../../../../contexts/Context"

export const SidebarHead = () => {
  const { setSidebarModal, auth } = useContext(Context)

  return (
    <div className={s.sidebarHead}>
      <span
        onClick={() => {
          setSidebarModal({
            type: "userSidebar",
            params: {
              headerTitle: "Profile",
            },
          })
        }}
        className={s.avatar}
      >
        {auth?.avatar ? (
          <img src={auth?.avatar} alt="" />
        ) : (
          <div className={s.mainIcon}>
            <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
            </svg>
          </div>
        )}
      </span>
      <div className={s.headControls}>
        <span
          onClick={() => {
            setSidebarModal({
              type: "newMsgSidebar",
              params: {
                headerTitle: "New Chat",
              },
            })
          }}
          className="icons"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              fill="currentColor"
              d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"
            ></path>
          </svg>
        </span>
      </div>
    </div>
  )
}
