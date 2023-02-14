import React from 'react'
import ButtonSOVRtheme from './ButtonSOVRtheme'
import { ThemeProvider } from 'styled-components';

// Creation d'un theme pour l'embarquer sur les composants enfants
const theme = {
    brand: '#5352ed',
    neutral100: '#fff'
  }

export default function FrameTheme() {
  return (
    <div>
        <ThemeProvider theme={theme}>
            <ButtonSOVRtheme />
        </ThemeProvider>
    </div>
  )
}
