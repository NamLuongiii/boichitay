import { JSX, useEffect, useRef } from 'react'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import handExample from '../assets/hand-example.jpg'
import handLandmarkerModel from './hand_landmarker.task?url'

export const HandDetection = (): JSX.Element => {
  const landmarkerRef = useRef<HandLandmarker | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const requestRef = useRef<number | null>(null)

  useEffect(() => {
    async function setupHandLandmarker(): Promise<void> {
      const vision = await FilesetResolver.forVisionTasks('./wasm')
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: handLandmarkerModel },
        runningMode: 'VIDEO', // Sang chế độ VIDEO
        numHands: 1
      })
    }

    async function startCamera(): Promise<void> {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 200, height: 200, frameRate: 30 },
        audio: false
      })

      if (videoRef.current) {
        // Stream camera to a video element
        videoRef.current.srcObject = stream

        // Start mediapipe when camera ready
        videoRef.current?.play()

        setTimeout(() => predictWebcam(), 4000)
      }
    }

    const predictWebcam = (): void => {
      console.log('Predicting...')
      if (!videoRef.current || !landmarkerRef.current) return

      const startTimeMs = performance.now()
      const results = landmarkerRef.current.detectForVideo(videoRef.current, startTimeMs)

      if (results.landmarks.length > 0) {
        console.log('Hand detected! 🖐️', results.landmarks)
        // Tại đây bạn có thể vẽ landmarks lên canvas nếu muốn
      }

      requestRef.current = requestAnimationFrame(predictWebcam)
    }

    setupHandLandmarker().then(startCamera).catch(console.error)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      landmarkerRef.current?.close()
    }
  }, [])

  return (
    <div>
      <video ref={videoRef} playsInline autoPlay width={200} height={200} />
      <img id="image" src={handExample} alt="Hand Example" width={200} />
    </div>
  )
}
