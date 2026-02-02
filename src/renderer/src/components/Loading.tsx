import styled from 'styled-components'
import { JSX } from 'react'
import { createPortal } from 'react-dom'
import loadingVideo from '../assets/loading.mp4'

export const Loading = (): JSX.Element => {
  return createPortal(
    <FlexContainer>
      <video src={loadingVideo} playsInline autoPlay muted loop></video>
      <div>
        <p>手相を解析しています。</p>
        <p>しばらくお待ちください。。。</p>
      </div>
    </FlexContainer>,
    document.getElementById('root') as HTMLElement
  )
}

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  justify-items: center;
  background: black;

  position: fixed;
  inset: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;

  div {
    position: absolute;
    bottom: 100px;
    z-index: 1;
    width: fit-content;
    text-align: center;
  }
`
