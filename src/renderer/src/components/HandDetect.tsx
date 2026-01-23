import React, { JSX, useEffect, useState } from 'react'
import logo from '../assets/logo.svg'
import styled from 'styled-components'
import { motion } from 'motion/react'
import { HandDetection, Messages } from '@renderer/AI/HandDetection'
type Props = {
  onSubmit(picture: string, handDirection: 'Left' | 'Right'): void
}
const Container = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: var(--bg-galaxy);
  background-size: 40%;
  background-position: center;
  background-repeat: no-repeat;
`

const Logo = styled.img`
  position: absolute;
  top: 1rem;
  left: 1rem;
`

export const HandDetect = ({ onSubmit }: Props): React.JSX.Element => {
  const [message, setMessage] = useState(Messages.NO_HAND_DETECTED)

  return (
    <Container>
      {/*Logo */}
      <Logo src={logo} alt="logo" />

      <HandDetection setMessage={setMessage} onSubmit={onSubmit} />

      <Bottom>
        {message === Messages.KEEP_HAND_STILL ? (
          <MessageCountdown />
        ) : (
          <BtnMotion type="button" style={{ backgroundColor: 'var(--yellow-color)' }}>
            {message}
          </BtnMotion>
        )}
      </Bottom>
    </Container>
  )
}

const Bottom = styled.div`
  padding: 0 2rem 2rem 2rem;
  background: var(--footer-gradient);
  width: 100%;
  text-align: center;
  background-color: blur(20px);
`

const StyledButton = styled.button`
  font-weight: bold;
  padding: 1rem 4rem;
  background-color: var(--yellow-color);
  color: var(--button-text-color);
  box-shadow: 0px 2px 100px 0px rgba(240, 209, 53, 1);
  border-radius: 4rem;
  max-width: 80vw;
  font-size: var(--text-lg);
  outline: none;
  border: none;
`

const BtnMotion = motion(StyledButton)

const MessageCountdown = (): JSX.Element => {
  const [seconds, setSeconds] = useState(3)
  const [msg, setMsg] = useState<string>()

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds === 1) {
        clearInterval(timer)
        setMsg('Take a picture')
        return
      }
      setSeconds(seconds - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [seconds])
  return (
    <BtnMotion
      initial={{ scale: 0.8 }}
      whileInView={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 20,
        mass: 0.9
      }}
      type="button"
      style={{ backgroundColor: 'var(--green-color)', boxShadow: 'none' }}
    >
      {msg ? msg : `Hold the position for ${seconds} seconds`}
    </BtnMotion>
  )
}
