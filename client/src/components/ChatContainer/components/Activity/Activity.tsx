import { forwardRef } from "react"
import s from "./activityStyles.module.scss"
import { EmojiDrawerAnimation } from "../../../../widgets/animations/chatFooterAnimation/EmojiDrawerAnimation"
import { Emojees } from "../../../../widgets/Emojees/Emojees"

export const Activity = forwardRef(
  ({ onClose, reverseActivityAnimation, ...otherProps }: any, ref: any) => {
    return (
      <EmojiDrawerAnimation
        className={s.activity}
        onClose={onClose}
        reverse={reverseActivityAnimation}
      >
        <Emojees ref={ref} {...otherProps} />
      </EmojiDrawerAnimation>
    )
  }
)
