import { GoogleGenerativeAI } from '@google/generative-ai'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const geminiKey = import.meta.env.MAIN_VITE_GEMINI_KEY
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const geminiModel = import.meta.env.MAIN_VITE_GEMINI_MODEL
const genAI = new GoogleGenerativeAI(geminiKey)

export async function analyzePalmFromCanvas(
  dataUrl: string,
  handDirection: 'Left' | 'Right'
): Promise<string> {
  const base64Image = dataUrl.split(',')[1] // bỏ "data:image/png;base64,"

  // 2. Chọn model MULTIMODAL
  const model = genAI.getGenerativeModel({
    model: geminiModel,
    generationConfig: {
      responseMimeType: 'application/json'
    }
  })

  const isEnglish = true

  const PROMPT_EN = `
You are a professional palm reader providing objective and confident analysis.

Hand: ${handDirection}

Requirements:
- Respond 100% in English
- Do NOT mention AI, models, or technology
- Analyze directly from the palm image
- Use clear, confident, and specific language
- Avoid vague or generic statements

Task: Find palm lines on my picture and analyze the following palm lines

Output format:
- Respond ONLY with valid JSON
- No markdown
- No explanation
- No comments
- No trailing commas
- UTF-8 plain text
- Return a JSON string
- The result must be an array
- Each array item must be an object
- Each object must contain ONLY two fields:
  - title
  - content

Definitions:
- title: the name of the palm line
- content: a single paragraph combining description, meaning, and personal interpretation
`

  const PROMPT_VI = `
Bạn là chuyên gia xem chỉ tay, phân tích công tâm và chuyên nghiệp.

Bàn tay: ${handDirection}

Yêu cầu:
- Trả lời 100% bằng tiếng Việt
- Không nhắc đến AI, mô hình hay công nghệ
- Phân tích trực tiếp từ hình ảnh bàn tay
- Nhận định rõ ràng, dứt khoát, không chung chung
- Văn phong dễ hiểu, có chiều sâu

Nhiệm vụ: tìm các đương chỉ tay trên ảnh tôi gửi và phân tích ý nghĩa của những đường chỉ tay đó

Định dạng trả về:
- Respond ONLY with valid JSON
- No markdown
- No explanation
- No comments
- No trailing commas
- UTF-8 plain text
- JSON string
- Là một array
- Mỗi phần tử trong array là một object
- Mỗi object CHỈ gồm 2 field:
  - title
  - content

Trong đó:
- title: tên đường chỉ tay
- content: mô tả đặc điểm + ý nghĩa + nhận định cá nhân (viết gộp thành một đoạn)

`

  // 3. Gửi ảnh + prompt
  const result = await model.generateContent([
    {
      inlineData: {
        data: base64Image,
        mimeType: 'image/png'
      }
    },
    {
      text: isEnglish ? PROMPT_EN : PROMPT_VI
    }
  ])

  // 5. Lấy text trả về
  return result.response.text()
}

export async function listGeminiModels(): Promise<Response> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`
  )

  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}
