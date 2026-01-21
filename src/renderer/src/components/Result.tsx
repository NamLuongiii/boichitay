import React from 'react'
import logo from '../assets/vertical_logo.svg'
import styled from 'styled-components'

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
        <Answers>
          <div>
            <h3>Life Line</h3>
            <p>
              The life line appears clear with a gentle curve, interpreted as a sign of steady
              energy, resilient vitality, and an ability to adapt well to change.
            </p>
          </div>
        </Answers>

        <Image src={pictureUrl} alt="assessment picture" />
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
  flex-basis: 65%;
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
  width: 35%;
`
