import React from 'react'
import logo from '../assets/vertical_logo.svg'
import styled from 'styled-components'

type Props = {
  tryAgain(): void
}

export const Result = ({ tryAgain }: Props): React.JSX.Element => {
  return (
    <Container>
      <img src={logo} alt="logo" />
      <h1>Assessment results</h1>
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
