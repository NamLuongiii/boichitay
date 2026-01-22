import { JSX, useEffect, useRef, useState } from 'react'
import { FilesetResolver, GestureRecognizer, HandLandmarker } from '@mediapipe/tasks-vision'
import gestureRecognizerModel from './gesture_recognizer.task?url'
import styled from 'styled-components'
import handLine from '@renderer/assets/hand/hand_line.svg'
import {
  estimateHandDepthByArea,
  isHandCentered,
  isPalmFacingCamera,
  isPalmParallelToCamera
} from '@renderer/AI/fns'
import handGif from '@renderer/assets/hand/hand-guide.gif'
// import SubtractHand from '../assets/hand/Subtract.svg'

type Props = {
  setMessage(msg: Messages): void
  onSubmit(picture: string): void
  handDirection?: 'left' | 'right'
}

// eslint-disable-next-line react-refresh/only-export-components
export enum Messages {
  NO_HAND_DETECTED = 'Hand not detected. Please face your palm toward the camera.',
  HAND_NEED_PARALLEL = 'Hand needs to be parallel to camera.',
  HAND_NEED_FACING = 'Hand needs to be facing camera.',
  HAND_NEED_CLOSER = 'Hand needs to be closer to camera.',
  HAND_NEED_DEEP = 'Hand needs to be deeper in the camera.',
  KEEP_HAND_STILL = 'Hold the position for 3 seconds',
  HAND_NEED_OPEN_PALM = 'Hand needs to be open.',
  ONLY_LEFT_HAND_ALLOWED = 'Only left hand is allowed.',
  ONLY_RIGHT_HAND_ALLOWED = 'Only right hand is allowed.',
  HAND_NEED_CENTER = 'Hand needs to be in the center of the camera.'
}

enum GESTURES {
  OPEN_PALM = 'Open_Palm'
}

export const HandDetection = ({ setMessage, onSubmit, handDirection }: Props): JSX.Element => {
  const landmarkerRef = useRef<HandLandmarker | null>(null)
  const gestureRef = useRef<GestureRecognizer>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const requestRef = useRef<number | null>(null)
  const [showPaw, setShowPaw] = useState(true)
  const taskId = useRef<NodeJS.Timeout>(undefined)
  const stopPredict = useRef(false)
  const [picture, setPicture] = useState<string | null>(null)
  const frameCountRef = useRef(3) // frame count for prediction, the first frame is for initialization

  useEffect(() => {
    async function setupGestureRecognizer(): Promise<void> {
      const vision = await FilesetResolver.forVisionTasks('./wasm')
      gestureRef.current = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: gestureRecognizerModel,
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
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

        setTimeout(() => predictGesture(), 1000)
      }
    }

    async function predictGesture(): Promise<void> {
      if (!videoRef.current || !gestureRef.current || stopPredict.current) return

      // Only run prediction each 3 frame
      if (frameCountRef.current % 3 === 0) {
        // mediapipe prediction
        const result = gestureRef.current.recognizeForVideo(videoRef.current, performance.now())

        // handle result prediction
        const landmarks = result.landmarks[0]
        if (landmarks) {
          // Hand detected
          setShowPaw(false)

          const gesture = result.gestures[0]?.[0]?.categoryName
          // check hand direction by config
          const isLeftHand = result.handedness[0][0].categoryName === 'Left'
          const isRightHand = result.handedness[0][0].categoryName === 'Right'
          const deepEstimation = estimateHandDepthByArea(landmarks, 0.8)

          if (!isLeftHand && handDirection === 'left') {
            setMessage(Messages.ONLY_LEFT_HAND_ALLOWED)
            if (taskId.current) {
              clearTimeout(taskId.current)
              taskId.current = undefined
            }
          } else if (!isRightHand && handDirection === 'right') {
            setMessage(Messages.ONLY_RIGHT_HAND_ALLOWED)
            if (taskId.current) {
              clearTimeout(taskId.current)
              taskId.current = undefined
            }
          } else if (gesture !== GESTURES.OPEN_PALM) {
            setMessage(Messages.HAND_NEED_OPEN_PALM)
            // clear task id if hand not correct position
            if (taskId.current) {
              clearTimeout(taskId.current)
              taskId.current = undefined
            }
          } else if (!isPalmParallelToCamera(landmarks)) {
            setMessage(Messages.HAND_NEED_PARALLEL)
            // clear task id if hand not correct position
            if (taskId.current) {
              clearTimeout(taskId.current)
              taskId.current = undefined
            }
          } else if (!isPalmFacingCamera(landmarks)) {
            setMessage(Messages.HAND_NEED_FACING)
            // clear task id if hand not correct position
            if (taskId.current) {
              clearTimeout(taskId.current)
              taskId.current = undefined
            }
          } else if (!isHandCentered(landmarks)) {
            setMessage(Messages.HAND_NEED_CENTER)
            // clear task id if hand not correct position
            if (taskId.current) {
              clearTimeout(taskId.current)
              taskId.current = undefined
            }
          } else if (!deepEstimation.isInRange && deepEstimation.diffPercent < 0) {
            setMessage(Messages.HAND_NEED_CLOSER)
            // clear task id if hand not correct position
            if (taskId.current) {
              clearTimeout(taskId.current)
              taskId.current = undefined
            }
          } else if (!deepEstimation.isInRange && deepEstimation.diffPercent > 0) {
            setMessage(Messages.HAND_NEED_DEEP)
            // clear task id if hand not correct position
            if (taskId.current) {
              clearTimeout(taskId.current)
              taskId.current = undefined
            }
          } else {
            setMessage(Messages.KEEP_HAND_STILL)

            // hand in the correct position, start timer to close hand
            if (!taskId.current) {
              taskId.current = setTimeout(() => {
                takePicture()
                stopPredict.current = true
              }, 3000)
            }
          }
        } else {
          setMessage(Messages.NO_HAND_DETECTED)
          setShowPaw(true)
        }
      }
      frameCountRef.current++

      // Keep predict in the next frame
      requestRef.current = requestAnimationFrame(predictGesture)
    }

    setupGestureRecognizer().then(startCamera).catch(console.error)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      landmarkerRef.current?.close()
    }
  }, [])

  const takePicture = (): void => {
    const video = videoRef.current
    const canvas = document.createElement('canvas')

    if (!video) return

    const width = video.videoWidth
    const height = video.videoHeight

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, width, height)
    const imageData = canvas.toDataURL('image/png')
    setPicture(imageData)

    // wait for 1.5s for user preview picture
    setTimeout(() => {
      onSubmit(imageData)
    }, 1500)

    console.log('📸 Picture taken')
  }

  return (
    <FlexContainer>
      <CameraContainer>
        {/*Camera */}
        <MaskedVideo
          ref={videoRef}
          autoPlay
          playsInline
          className={'masked-video'}
          width={600}
          height={600}
          style={picture ? { display: 'none' } : {}}
        />

        {picture && (
          <img
            className={'masked-video'}
            src={picture}
            alt="camera picture"
            width={600}
            height={600}
          />
        )}
        {/*display hand line */}
        <HandLine src={handLine} alt="hand line" />

        {/*Subtract color*/}
        {/*<HandLine src={SubtractHand} alt="subtract hand" />*/}

        {/*display video when hand not detected */}
        {showPaw && (
          <HandLine
            src={handGif}
            alt="hand gif"
            style={{ display: 'none' }}
            onClick={() => setShowPaw(false)}
          />
        )}
      </CameraContainer>
    </FlexContainer>
  )
}

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`

const CameraContainer = styled.div`
  position: relative;
  min-width: 400px;
  min-height: 400px;

  max-width: 600px;
  max-height: 600px;

  width: 60vw;
  height: 60vw;
  margin: 0 auto;
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
