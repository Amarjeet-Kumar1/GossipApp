import { View } from "react-native"
import React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

export default function Avatar(props: SvgProps) {
  return (
    <View>
      <Svg viewBox="0 0 24 24" {...props}>
        <Path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          fill="currentColor"
        ></Path>
      </Svg>
    </View>
  )
}
