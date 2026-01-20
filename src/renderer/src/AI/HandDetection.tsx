import { JSX, useEffect, useRef, useState } from 'react'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import handLandmarkerModel from './hand_landmarker.task?url'
import styled from 'styled-components'
import handLine from '@renderer/assets/hand_line.svg'
import handGif from '@renderer/assets/hand-guide.gif'
import { motion } from 'motion/react'

type Props = {
  onClosen: () => void
}

enum Messages {
  NO_HAND_DETECTED = 'No hand detected.',
  HAND_DETECTED = 'Hand detected!'
}

export const HandDetection = ({ onClosen }: Props): JSX.Element => {
  const landmarkerRef = useRef<HandLandmarker | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const requestRef = useRef<number | null>(null)
  const [showPaw, setShowPaw] = useState(true)
  const [message, setMessage] = useState<string>(Messages.NO_HAND_DETECTED)

  useEffect(() => {
    async function setupHandLandmarker(): Promise<void> {
      const vision = await FilesetResolver.forVisionTasks('./wasm')
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: handLandmarkerModel, delegate: 'GPU' },
        runningMode: 'VIDEO', // Sang chế độ VIDEO
        numHands: 1
      })
    }

    async function startCamera(): Promise<void> {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 600, height: 600, frameRate: 30 },
        audio: false
      })

      if (videoRef.current) {
        // Stream camera to a video element
        videoRef.current.srcObject = stream

        // Start mediapipe when camera ready
        videoRef.current?.play()

        setTimeout(() => predictWebcam(), 1000)
      }
    }

    const predictWebcam = (): void => {
      console.log('Predicting...')
      if (!videoRef.current || !landmarkerRef.current) return

      const startTimeMs = performance.now()
      const results = landmarkerRef.current.detectForVideo(videoRef.current, startTimeMs)

      if (results.landmarks.length > 0) {
        console.log('Hand detected! 🖐️', results.landmarks)
        setShowPaw(false)
        setMessage(Messages.HAND_DETECTED)
        // Tại đây bạn có thể vẽ landmarks lên canvas nếu muốn
      } else {
        console.log('No hand detected.')
        setShowPaw(true)
        setMessage(Messages.NO_HAND_DETECTED)
      }

      setTimeout(() => {
        requestRef.current = requestAnimationFrame(predictWebcam)
      }, 500)
    }

    setupHandLandmarker().then(startCamera).catch(console.error)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      landmarkerRef.current?.close()
    }
  }, [])

  return (
    <div>
      <Container>
        {/*Camera */}
        <MaskedVideo
          ref={videoRef}
          autoPlay
          playsInline
          className="masked-video"
          width={600}
          height={600}
        />

        {/*display hand line */}
        <HandLine src={handLine} alt="hand line" />

        {/*display video when hand not detected */}
        {showPaw && <HandLine src={handGif} alt="hand gif" onClick={() => setShowPaw(false)} />}
      </Container>

      <BtnMotion
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={onClosen}
        style={
          message === Messages.NO_HAND_DETECTED
            ? { backgroundColor: 'var(--yellow-color)' }
            : { backgroundColor: 'var(--green-color)' }
        }
      >
        {message}
      </BtnMotion>
    </div>
  )
}

const Container = styled.div`
  position: relative;
  min-width: 400px;
  min-height: 400px;

  max-width: 600px;
  max-height: 600px;

  width: 60vw;
  height: 60vw;
`

const MaskedVideo = styled.video`
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
`

const HandLine = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`

const StyledButton = styled.button`
  font-weight: bold;
  font-size: var(--text-lg);
  padding: 1rem 4rem;
  background-color: var(--yellow-color);
  color: var(--button-text-color);
  box-shadow: 0px 2px 100px 0px rgba(240, 209, 53, 1);
  border-radius: 4rem;
  max-width: 80vw;
`

const BtnMotion = motion(StyledButton)
