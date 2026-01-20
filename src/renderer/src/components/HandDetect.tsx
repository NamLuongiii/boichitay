import React from 'react'
import logo from '../assets/logo.svg'
import styled from 'styled-components'
import { HandDetection } from '@renderer/AI/HandDetection'

type Props = {
  onSubmit(): void
}

const Container = styled.div`
  position: relative;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Logo = styled.img`
  position: absolute;
  top: 1rem;
  left: 1rem;
`

export const HandDetect = ({ onSubmit }: Props): React.JSX.Element => {
  return (
    <Container>
      {/*Logo */}
      <Logo src={logo} alt="logo" />
      {/*<HandCamera />*/}
      <HandDetection onClosen={onSubmit} />
    </Container>
  )
}
