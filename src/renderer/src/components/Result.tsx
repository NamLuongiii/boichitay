import React from 'react'
import logo from '../assets/vertical_logo.svg'
import styled from 'styled-components'
import { motion } from 'motion/react'

type Props = {
  tryAgain(): void
  pictureUrl: string
}

export const Result = ({ tryAgain, pictureUrl }: Props): React.JSX.Element => {
  return (
    <Container>
      <img src={logo} alt="logo" />
      <h1 style={{ width: '100%' }}>Assessment results</h1>

      <Content>
        <Answers
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
            ease: 'easeOut'
          }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.1,
              type: 'spring',
              stiffness: 220,
              damping: 20,
              mass: 0.9
            }}
          >
            <h3>Life Line</h3>
            <p>
              The life line appears clear with a gentle curve, interpreted as a sign of steady
              energy, resilient vitality, and an ability to adapt well to change.
            </p>
          </motion.div>
        </Answers>
        <MotionImage
          src={pictureUrl}
          alt="assessment picture"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            ease: 'easeOut'
          }}
          style={{ width: '30%' }}
        />
      </Content>
      <button type="button" onClick={tryAgain}>
        try again
      </button>
    </Container>
  )
}

const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`

const Content = styled.div`
  display: flex;
  width: 100%;
  gap: 2rem;
  flex-basis: 70%;
`
const Answers = styled.div`
  flex: 1;
  & > div {
    border: 2px solid var(--yellow-color);
    padding: 1rem;
    font-weight: bold;
  }
`

const Image = styled.img`
  border-radius: 1rem;
  width: 30%;
`
const MotionImage = motion(Image)
