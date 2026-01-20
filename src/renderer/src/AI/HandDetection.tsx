import { JSX, useEffect } from 'react'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import handExample from '../assets/hand-example.jpg'
import handLandmarkerModel from './hand_landmarker.task?url'

export const HandDetection = (): JSX.Element => {
  useEffect(() => {
    async function handleHandDetection(): Promise<void> {
      const vision = await FilesetResolver.forVisionTasks(
        './wasm' // Đường dẫn tương đối từ file index.html sau khi build
      )

      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: handLandmarkerModel
        },
        numHands: 1
      })

      const image = document.getElementById('image') as HTMLImageElement
      const handLandmarkerResult = handLandmarker.detect(image)
      console.log(handLandmarkerResult)
    }

    handleHandDetection().catch(console.error)
  }, [])

  return (
    <div>
      Hand detection
      <img id="image" src={handExample} alt="Hand Example" width={200} />
    </div>
  )
}
