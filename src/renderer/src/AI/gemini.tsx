import { GoogleGenerativeAI } from '@google/generative-ai'

const geminiKey = import.meta.env.VITE_GEMINI_API_KEY
const geminiModel = import.meta.env.VITE_GEMINI_MODEL
const genAI = new GoogleGenerativeAI(geminiKey)

export async function analyzePalmFromCanvas(dataUrl: string): Promise<string> {
  const base64Image = dataUrl.split(',')[1] // bỏ "data:image/png;base64,"

  // 2. Chọn model MULTIMODAL
  const model = genAI.getGenerativeModel({
    model: geminiModel
  })

  // 3. Prompt (đúng format bạn yêu cầu)
  const prompt = `
Bạn là chuyên gia xem chỉ tay, phân tích công tâm và chuyên nghiệp.

Yêu cầu:
- Trả lời 100% bằng tiếng Việt
- Không nhắc đến AI hay mô hình
- Phân tích trực tiếp từ hình ảnh bàn tay
- Nhận định rõ ràng, mạnh mẽ, có tính “drama”, không chung chung
- Ngôn từ dễ hiểu, ngắn gọn

Định dạng nội dung:
- JSON string
- Gồm nhiều đoạn
- Mỗi đoạn có tiêu đề trong ngoặc vuông []
- Mỗi đoạn xuống dòng riêng
- Đoạn đầu tiên luôn là [Mô tả tay]

Bắt buộc:
[Mô tả tay]: đoán giới tính nam/nữ, liệt kê các đường chỉ tay chính và đặc điểm hình dạng bàn tay

YÊU CẦU BẮT BUỘC:
- Chỉ trả về JSON hợp lệ
- KHÔNG markdown
- KHÔNG giải thích ngoài JSON
- KHÔNG ký tự thừa
- Trả về đúng JSON string để parse trực tiếp

Cấu trúc JSON (đúng thứ tự):

[
  { "title": "Tính cách", "content": "..." },
  { "title": "Tình duyên", "content": "..." },
  { "title": "Tiền tài", "content": "..." },
  { "title": "Vận hạn", "content": "..." }
]
`

  // 4. Gửi ảnh + prompt
  const result = await model.generateContent([
    {
      inlineData: {
        data: base64Image,
        mimeType: 'image/png'
      }
    },
    {
      text: prompt
    }
  ])

  // 5. Lấy text trả về
  return result.response.text()
}

export async function listGeminiModels(): Promise<void> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`
  )
  const data = await res.json()
  console.log(data)
}
