import React from 'react'

type Props = {
  tryAgain(): void
}

export const Result = ({ tryAgain }: Props): React.JSX.Element => {
  return (
    <div>
      Result
      <button type="button" onClick={tryAgain}>
        try again
      </button>
    </div>
  )
}
