import { GoogleGenerativeAI } from '@google/generative-ai'
import 'dotenv/config.js'

const geminiKey = process.env.GEMINI_KEY || 'AIzaSyDUNISI-h2EcOQe1EShfQuQQzCw4YB9wy4'
const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-pro'
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

  const isEnglish = false

  const PROMPT_EN = `
You are a professional palm reader providing objective and confident analysis.

Hand: ${handDirection}

Requirements:

RESPONSE RULES:
- Respond ONLY with valid JSON
- No markdown
- No explanation
- No comments
- No trailing commas
- UTF-8 plain text

* Respond 100% in English
* Do NOT mention AI, models, or assumptions
* Analyze directly from the palm image
* Make clear, strong, dramatic judgments (no vague wording)
* Use simple, concise language
* Palm Description describe main palm lines, hand shape, skin texture, calluses, and notable features.

Output rules:

* Return ONLY a valid JSON string as [{ "title": "content" }, ... ]
* No markdown, no explanations outside JSON

Mandatory:

JSON structure (exact order):

[
{ "title": "Palm Description", "content": "..." },
{ "title": "Personality", "content": "..." },
{ "title": "Love", "content": "..." },
{ "title": "Wealth", "content": "..." },
{ "title": "Fate", "content": "..." }
]
`

  const PROMPT_VI = `
Bạn là chuyên gia xem chỉ tay, phân tích khách quan và chuyên nghiệp.

Bàn tay: ${handDirection}

Định dạng:

You must respond with ONLY valid JSON.
No markdown.
No explanation.
No extra text.
Return a single JSON object.

Yêu cầu:

* Trả lời 100% bằng tiếng Việt
* Không nhắc đến AI, mô hình hay suy đoán
* Phân tích trực tiếp từ hình ảnh bàn tay
* Nhận định rõ ràng, dứt khoát, có “drama”, không chung chung
* Ngôn từ dễ hiểu, ngắn gọn
* Mô tả tay: mô tả các đường chỉ tay chính, hình dạng bàn tay, da tay, vết sần, dấu hiệu nổi bật.

Cấu trúc JSON (đúng thứ tự):

[
{ "title": "Mô tả tay", "content": "..." },
{ "title": "Tính cách", "content": "..." },
{ "title": "Tình duyên", "content": "..." },
{ "title": "Tiền tài", "content": "..." },
{ "title": "Vận hạn", "content": "..." }
]
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
