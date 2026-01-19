import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import handLine from '../assets/hand_line.svg'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function HandCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [photo, setPhoto] = useState<string | null>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 800,
          height: 800,
          frameRate: 30
        },
        audio: false
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    }

    startCamera().catch(console.error)
  }, [])

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const takePicture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const width = video.videoWidth
    const height = video.videoHeight

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, width, height)

    const imageData = canvas.toDataURL('image/png')
    setPhoto(imageData)

    console.log('📸 Picture taken')
  }

  return (
    <div>
      <Container>
        <MaskedVideo ref={videoRef} autoPlay playsInline className="masked-video" />

        {/*display hand line */}
        <HandLine src={handLine} alt="hand line" />
      </Container>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <button
        onClick={takePicture}
        style={{
          marginTop: 12,
          padding: '10px 16px',
          borderRadius: 8,
          border: '1px solid #ddd',
          cursor: 'pointer',
          display: 'none'
        }}
      >
        📸 Take Picture
      </button>

      {photo && (
        <div style={{ marginTop: 12 }}>
          <img
            src={photo}
            alt="Captured"
            style={{
              width: 240,
              borderRadius: 8,
              border: '1px solid #eee'
            }}
          />
        </div>
      )}
    </div>
  )
}

const Container = styled.div`
  position: relative;
`

const MaskedVideo = styled.video`
  position: relative;

  min-width: 400px;
  min-height: 400px;

  max-width: 600px;
  max-height: 600px;

  width: 60vw;
  height: 60vw;
  object-fit: contain;
`

const HandLine = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`
