import { GoogleGenerativeAI } from '@google/generative-ai'
import 'dotenv/config'

const geminiKey = process.env.GEMINI_API_KEY || ''
const geminiModel = process.env.GEMINI_MODEL || ''
const genAI = new GoogleGenerativeAI(geminiKey)

const PROMPT_EN = `
You are a professional palm reader providing objective and confident analysis.

Requirements:

* Respond 100% in English
* Do NOT mention AI, models, or assumptions
* Analyze directly from the palm image
* Make clear, strong, dramatic judgments (no vague wording)
* Use simple, concise language

Output rules:

* Return ONLY a valid JSON string
* No markdown, no explanations outside JSON
* Multiple sections, each on a new line
* Each section has a title in square brackets []
* The first section MUST be [Palm Description]

Mandatory:
[Palm Description]: describe main palm lines, hand shape, skin texture, calluses, and notable features.

JSON structure (exact order):

[
{ "title": "Personality", "content": "..." },
{ "title": "Love", "content": "..." },
{ "title": "Wealth", "content": "..." },
{ "title": "Fate", "content": "..." }
]

`

const PROMPT_VI = `
Bạn là chuyên gia xem chỉ tay, phân tích khách quan và chuyên nghiệp.

Yêu cầu:

* Trả lời 100% bằng tiếng Việt
* Không nhắc đến AI, mô hình hay suy đoán
* Phân tích trực tiếp từ hình ảnh bàn tay
* Nhận định rõ ràng, dứt khoát, có “drama”, không chung chung
* Ngôn từ dễ hiểu, ngắn gọn

Định dạng:

* Chỉ trả về JSON string hợp lệ
* Không markdown, không giải thích ngoài JSON
* Gồm nhiều đoạn, mỗi đoạn một dòng
* Mỗi đoạn có tiêu đề trong ngoặc vuông []
* Đoạn đầu tiên luôn là [Mô tả tay]

Bắt buộc:
[Mô tả tay]: mô tả các đường chỉ tay chính, hình dạng bàn tay, da tay, vết sần, dấu hiệu nổi bật.

Cấu trúc JSON (đúng thứ tự):

[
{ "title": "Tính cách", "content": "..." },
{ "title": "Tình duyên", "content": "..." },
{ "title": "Tiền tài", "content": "..." },
{ "title": "Vận hạn", "content": "..." }
]
`

export async function analyzePalmFromCanvas(dataUrl: string): Promise<string> {
  const base64Image = dataUrl.split(',')[1] // bỏ "data:image/png;base64,"

  // 2. Chọn model MULTIMODAL
  const model = genAI.getGenerativeModel({
    model: geminiModel
  })

  const isEnglish = true

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
