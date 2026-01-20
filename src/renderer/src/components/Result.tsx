import React from 'react'
import logo from '../assets/vertical_logo.svg'
import styled from 'styled-components'
import handGuide from '../assets/hand-guide.gif'

type Props = {
  tryAgain(): void
}

export const Result = ({ tryAgain }: Props): React.JSX.Element => {
  return (
    <Container>
      <img src={logo} alt="logo" />
      <h1 style={{ width: '100%' }}>Assessment results</h1>

      <Content>
        <Answers>
          <p>Thank you for participating in our assessment. Please review your results below:</p>
        </Answers>

        <img src={handGuide} alt="result" />
      </Content>
      <button type="button" onClick={tryAgain}>
        try again
      </button>
    </Container>
  )
}

const Container = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const Content = styled.div`
  display: flex;
  width: 100%;
  gap: 1rem;
`
const Answers = styled.div`
  flex: 1;

  p {
    border: 2px solid var(--yellow-color);
    padding: 1rem;
    font-weight: bold;
  }
`
