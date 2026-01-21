import { NormalizedLandmark } from '@mediapipe/tasks-vision'

export function isPalmParallelToCamera(landmarks: NormalizedLandmark[], threshold = 0.1): boolean {
  const wrist = landmarks[0]
  const index = landmarks[5]
  const pinky = landmarks[17]

  const v1 = {
    x: index.x - wrist.x,
    y: index.y - wrist.y,
    z: index.z - wrist.z
  }

  const v2 = {
    x: pinky.x - wrist.x,
    y: pinky.y - wrist.y,
    z: pinky.z - wrist.z
  }

  const normal = {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x
  }

  const length = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2)

  const zRatio = Math.abs(normal.z) / length
  return zRatio > threshold
}

export function isPalmCloseToCamera(landmarks: NormalizedLandmark[], minDistance = 0.18): boolean {
  const a = landmarks[5]
  const b = landmarks[17]

  const dx = a.x - b.x
  const dy = a.y - b.y

  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance > minDistance
}

export function isPalmFacingCamera(landmarks: NormalizedLandmark[]): boolean {
  const wrist = landmarks[0]
  const index = landmarks[5]
  const pinky = landmarks[17]

  const v1 = {
    x: index.x - wrist.x,
    y: index.y - wrist.y,
    z: index.z - wrist.z
  }

  const v2 = {
    x: pinky.x - wrist.x,
    y: pinky.y - wrist.y,
    z: pinky.z - wrist.z
  }

  const normalZ = v1.x * v2.y - v1.y * v2.x

  // check base on a hand direction
  const handDirection = import.meta.env.VITE_HAND_DIRECTION

  return handDirection === 'right' ? normalZ < 0 : normalZ > 0
}
