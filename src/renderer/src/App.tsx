import React, { useState } from 'react'
import styled from 'styled-components'
import { Result } from '@renderer/components/Result'
import { HandDetect } from '@renderer/components/HandDetect'
import { Loading } from '@renderer/components/Loading'
// import { Stars } from '@renderer/components/Stars'
// import { Stars } from '@renderer/components/Stars'

const StyledApp = styled.div`
  position: relative;
`

export type TResult = {
  title: string
  content: string
}

declare global {
  interface Window {
    ai: {
      listGeminiModels: () => Promise<string>
      analyzePalmFromCanvas: (dataUrl: string, handDirection: 'Left' | 'Right') => Promise<string>
    }
  }
}

function App(): React.JSX.Element {
  const [showResult, setShowResult] = useState(false)
  const [pictureUrl, setPictureUrl] = useState<string>()
  const [showLoading, setShowLoading] = useState(false)
  const [result, setResult] = useState<TResult[]>([])
  const [componentKey, setComponentKey] = useState(0)

  const onSubmit = (
    picture: string,
    handDirection: 'Left' | 'Right',
    processImageUrl: string
  ): void => {
    setShowLoading(true)

    const showDemo = false

    if (showDemo) {
      // await 3s
      setTimeout(() => {
        setResult([
          {
            title: 'test',
            content: 'test'
          }
        ])

        // window.ai.listGeminiModels().then(console.log).catch(console.error)
        setPictureUrl(picture)
        setShowResult(true)
        setShowLoading(false)
      }, 1000)
    } else
      // Log time need to processing
      console.time('llm handle')
    window.ai
      .analyzePalmFromCanvas(processImageUrl, handDirection)
      .then((result) => {
        // parse result to json
        const parsedResult = JSON.parse(result) as TResult[]
        setResult(parsedResult)

        setPictureUrl(picture)
        setShowResult(true)
        setShowLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setShowLoading(false)
        alert(err.message)

        setComponentKey(componentKey + 1)
      })
      .finally(() => {
        console.timeEnd('llm handle')
      })
  }

  return (
    <StyledApp>
      {showResult && pictureUrl ? (
        <Result tryAgain={() => setShowResult(false)} pictureUrl={pictureUrl} result={result} />
      ) : (
        <HandDetect key={componentKey} onSubmit={onSubmit} />
      )}

      {/*<Stars />*/}
      {showLoading && <Loading />}
    </StyledApp>
  )
}

export default App
