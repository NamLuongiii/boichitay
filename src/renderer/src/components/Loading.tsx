import LoadingIcon from '../assets/loading-circle.svg'
import styled from 'styled-components'
import { JSX } from 'react'
import { createPortal } from 'react-dom'
export const Loading = (): JSX.Element => {
  return createPortal(
    <FlexContainer>
      <img src={LoadingIcon} alt="Loading" />
      <div>We are analyzing your hand, please wait a moment...</div>
    </FlexContainer>,
    document.getElementById('root') as HTMLElement
  )
}

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;

  position: fixed;
  inset: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;

  img {
    position: absolute;
    width: 100vw;
    height: 100%;
  }

  div {
    position: absolute;
    bottom: 200px;
    z-index: 1;
  }
`
