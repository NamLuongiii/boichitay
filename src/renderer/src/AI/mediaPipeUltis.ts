import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision'
import gestureRecognizerModel from './gesture_recognizer.task?url'

export const mediaPipeUltis = {
  createGestureRecognizer: async (runningMode: 'VIDEO' | 'IMAGE'): Promise<GestureRecognizer> => {
    const vision = await FilesetResolver.forVisionTasks('./wasm')
    return GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: gestureRecognizerModel,
        delegate: 'GPU'
      },
      runningMode,
      numHands: 1
    })
  },

  processingImage: async (source: HTMLCanvasElement) => {
    const imageRecognizer = await mediaPipeUltis.createGestureRecognizer('IMAGE')
    const result = imageRecognizer.recognize(source)

    const landmarks = result.landmarks[0]
    if (!landmarks) {
      throw new Error('No hand detected')
    }

    const w = source.width
    const h = source.height

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext('2d')!

    // 1️⃣ tạo path từ landmarks
    ctx.beginPath()

    const wrist = landmarks[0]

    // Thumb
    const thumb_cmc = landmarks[1]
    const thumb_mcp = landmarks[2]
    const thumb_ip = landmarks[3]
    const thumb_tip = landmarks[4]

    // Index finger
    const index_finger_tip = landmarks[8]

    // Middle finger
    const middle_finger_tip = landmarks[12]

    // Ring finger
    const ring_finger_tip = landmarks[16]

    // Pinky finger
    const pinky_tip = landmarks[20]

    const extraPadding = 0.01
    // const bottomLeftPoint = { x: thumb_tip.x + extraPadding, y: wrist.y + extraPadding }
    const bottomRightPoint = { x: pinky_tip.x + extraPadding, y: wrist.y }

    const pathPoints = [
      // Create path
      wrist,
      // bottomLeftPoint,
      thumb_cmc,
      thumb_mcp,
      thumb_ip,
      thumb_tip,
      index_finger_tip,
      middle_finger_tip,
      ring_finger_tip,
      pinky_tip,
      bottomRightPoint
    ]
    pathPoints.forEach((p, i) => {
      const x = p.x * w
      const y = p.y * h
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })

    ctx.closePath()

    // 2️⃣ clip theo path
    ctx.clip()

    // 3️⃣ vẽ ảnh
    ctx.drawImage(source, 0, 0)

    return canvas.toDataURL('image/png')
  }
}
