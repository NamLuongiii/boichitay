import React from 'react'
import logo from '../assets/logo.svg'
import styled from 'styled-components'
import { motion } from 'motion/react'
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

const StyledButton = styled.button`
  font-weight: bold;
  font-size: var(--text-lg);
  padding: 1rem 4rem;
  background-color: var(--yellow-color);
  color: var(--button-text-color);
  box-shadow: 0px 2px 100px 0px rgba(240, 209, 53, 1);
  border-radius: 4rem;
  max-width: 80vw;
`

const BtnMotion = motion(StyledButton)

export const HandDetect = ({ onSubmit }: Props): React.JSX.Element => {
  return (
    <Container>
      {/*Logo */}
      <Logo src={logo} alt="logo" />
      {/*<HandCamera />*/}
      <HandDetection />
      <BtnMotion
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={onSubmit}
      >
        Hand not detected. Please face your palm toward the camera.
      </BtnMotion>
    </Container>
  )
}
