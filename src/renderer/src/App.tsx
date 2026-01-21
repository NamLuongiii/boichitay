import React, { useState } from 'react'
import styled from 'styled-components'
import { Result } from '@renderer/components/Result'
import { HandDetect } from '@renderer/components/HandDetect'
// import { Stars } from '@renderer/components/Stars'

const StyledApp = styled.div`
  position: relative;
`

function App(): React.JSX.Element {
  const [showResult, setShowResult] = useState(false)
  const [pictureUrl, setPictureUrl] = useState<string>()
  return (
    <StyledApp>
      {showResult && pictureUrl ? (
        <Result tryAgain={() => setShowResult(false)} pictureUrl={pictureUrl} />
      ) : (
        <HandDetect
          onSubmit={(picture) => {
            console.log(picture)
            setPictureUrl(picture)
            setShowResult(true)
          }}
        />
      )}

      {/*<Stars />*/}
    </StyledApp>
  )
}

export default App
