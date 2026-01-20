import React, { useState } from 'react'
import styled from 'styled-components'
import { Result } from '@renderer/components/Result'
import { HandDetect } from '@renderer/components/HandDetect'
import { Stars } from '@renderer/components/Stars'

const StyledApp = styled.div`
  position: relative;
`

function App(): React.JSX.Element {
  const [showResult, setShowResult] = useState(false)
  return (
    <StyledApp>
      {showResult ? (
        <Result tryAgain={() => setShowResult(false)} />
      ) : (
        <HandDetect onSubmit={() => setShowResult(true)} />
      )}

      <Stars />
    </StyledApp>
  )
}

export default App
