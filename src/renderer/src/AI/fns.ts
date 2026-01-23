import { NormalizedLandmark } from '@mediapipe/tasks-vision'

export function getHandBoundingBoxArea(landmarks: NormalizedLandmark[]): {
  area: number
  width: number
  height: number
} {
  if (!landmarks || landmarks.length === 0) {
    return { area: 0, width: 0, height: 0 }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const lm of landmarks) {
    minX = Math.min(minX, lm.x)
    minY = Math.min(minY, lm.y)
    maxX = Math.max(maxX, lm.x)
    maxY = Math.max(maxY, lm.y)
  }

  const width = maxX - minX
  const height = maxY - minY
  const area = width * height // camera area = 1

  return { area, width, height }
}

export function isPalmParallelToCamera(landmarks: NormalizedLandmark[], threshold = 0.05): boolean {
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

export function isPalmFacingCamera(
  handDirection: 'Left' | 'Right',
  landmarks: NormalizedLandmark[]
): boolean {
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

  return handDirection === 'Right' ? normalZ < 0 : normalZ > 0
}

export function isHandCentered(
  landmarks: NormalizedLandmark[],
  tolerance = 0.2 // cho phép lệch 20% khung hình
): boolean {
  if (!landmarks || landmarks.length === 0) return false

  // 1. Tính trọng tâm bàn tay
  const center = landmarks.reduce(
    (acc, lm) => {
      acc.x += lm.x
      acc.y += lm.y
      return acc
    },
    { x: 0, y: 0 }
  )

  center.x /= landmarks.length
  center.y /= landmarks.length

  // 2. Tâm ảnh
  const imageCenter = { x: 0.5, y: 0.5 }

  // 3. Khoảng cách theo trục
  const dx = Math.abs(center.x - imageCenter.x)
  const dy = Math.abs(center.y - imageCenter.y)

  // 4. Check trong vùng cho phép
  return dx <= tolerance && dy <= tolerance
}

export function minAreaAllowed(
  landmarks: NormalizedLandmark[],
  expectedArea: number
): {
  area: number
  isInRange: boolean
} {
  const { area } = getHandBoundingBoxArea(landmarks)

  return {
    area,
    isInRange: area >= expectedArea
  }
}
