import cvModule from '@techstark/opencv-js'
import { NormalizedLandmark } from '@mediapipe/tasks-vision'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function getOpenCv() {
  console.log('Loading OpenCV...')
  let cv
  if (cvModule instanceof Promise) {
    cv = await cvModule
  } else {
    await new Promise<void>((resolve) => {
      cvModule.onRuntimeInitialized = () => resolve()
    })
    cv = cvModule
  }
  console.log('OpenCV loaded')
  return { cv }
}

export async function segmentationImage(
  landmarks: NormalizedLandmark[],
  source: HTMLCanvasElement,
  output: HTMLCanvasElement
): Promise<void> {
  const { cv } = await getOpenCv()

  const {
    convexHull,
    CV_32SC2,
    CV_8UC1,
    imread,
    imshow,
    Mat,
    MatVector,
    Scalar,
    Size,
    bitwise_and,
    fillPoly,
    getStructuringElement,
    GaussianBlur,
    dilate,
    matFromArray,
    MORPH_ELLIPSE
  } = cv

  const w = source.width
  const h = source.height

  // 1️⃣ landmark → pixel
  const points = landmarks.map((p) => [Math.round(p.x * w), Math.round(p.y * h)])

  const src = imread(source)
  console.log(points.length, 1, CV_32SC2, points.flat())
  // 2️⃣ convex hull
  const pts = matFromArray(points.length, 1, CV_32SC2, points.flat())
  const hull = new Mat()
  convexHull(pts, hull, false, true)

  // 3️⃣ mask
  const mask = Mat.zeros(src.rows, src.cols, CV_8UC1)

  const hullPoints: number[] = []
  for (let i = 0; i < hull.rows; i++) {
    hullPoints.push(hull.intAt(i, 0), hull.intAt(i, 1))
  }

  const hullMat = matFromArray(hull.rows, 1, CV_32SC2, hullPoints)
  const contours = new MatVector()
  contours.push_back(hullMat)

  fillPoly(mask, contours, new Scalar(255))

  // 4️⃣ làm mượt mask
  const kernel = getStructuringElement(MORPH_ELLIPSE, new Size(9, 9))
  dilate(mask, mask, kernel)
  GaussianBlur(mask, mask, new Size(7, 7), 0)

  // 5️⃣ tách nền
  const result = new Mat()
  bitwise_and(src, src, result, mask)

  // 6️⃣ HIỂN THỊ ẢNH
  imshow(output, result)

  // 7️⃣ cleanup (rất quan trọng)
  src.delete()
  pts.delete()
  hull.delete()
  hullMat.delete()
  contours.delete()
  mask.delete()
  result.delete()
}
