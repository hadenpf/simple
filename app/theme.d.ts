import {} from 'styled-components'

declare type Color = string

declare module 'styled-components' {
  export interface DefaultTheme {
    background: Color
    backgroundTransparent: Color

    text: Color
    link: Color
  }
}
