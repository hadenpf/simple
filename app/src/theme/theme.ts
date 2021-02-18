import { DefaultTheme } from 'styled-components'

export const themes: { [key: string]: DefaultTheme } = {
  light: {
    background: '#fff',
    backgroundTransparent: '#fffb',

    link: '#1315ab',
    text: '#000',
  },
  dark: {
    background: '#000',
    backgroundTransparent: '#000b',

    link: '#1315ab',
    text: '#fff',
  },
}
