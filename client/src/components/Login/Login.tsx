import { CircularProgress } from "@mui/material"
import s from "./login.module.scss"
import gossipAppLogo from "./GossipApp.webp"
import { useContext, useEffect } from "react"
import { Context } from "../../contexts/Context"
import { getGoogleOauthURI } from "../../api/login"
import { initiateSigninMiddleware } from "../../utils/contextMiddleware/auth"

export const Login = () => {
  const context = useContext(Context)
  const { initiateSignin, authLoading, authUri, setUri } = context

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const auth_code = params.get("code")

    if (auth_code) {
      console.log("code", auth_code)
      initiateSignin()
      initiateSigninMiddleware({
        payload: { code: auth_code },
        context,
      }).finally(() => {
        window.location.href = import.meta.env.VITE_FRONTEND_URL
      })
    } else {
      getGoogleOauthURI().then((uri) => setUri(uri))
    }
  }, [])

  return (
    <div className={s.login}>
      <img src={gossipAppLogo} alt="app-icon" />
      <p>GossipApp</p>
      {authLoading ? (
        <div className={s.loading}>
          <CircularProgress size="19px" color="inherit" />
        </div>
      ) : (
        <div className={s.loginControls}>
          <button onClick={() => (window.location.href = authUri)}>
            Sign in with google
          </button>
        </div>
      )}
    </div>
  )
}
