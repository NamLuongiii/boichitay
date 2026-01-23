import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision'
import gestureRecognizerModel from './gesture_recognizer.task?url'

export const metapipeUlties = {
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

  processingImage: async (canvas: HTMLCanvasElement) => {
    const imageRecognizer = await metapipeUlties.createGestureRecognizer('IMAGE')
    const result = imageRecognizer.recognize(canvas)

    if (!result.landmarks[0]) {
      throw new Error('No hand detected')
    }

    return result.landmarks[0]
  }
}
