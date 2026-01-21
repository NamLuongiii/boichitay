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
Bạn là chuyên gia xem chỉ tay với phong cách phân tích công tâm, chuyên nghiệp.

Yêu cầu:
- Trả lời hoàn toàn bằng tiếng Việt
- Không nhắc đến AI hay mô hình
- Phân tích dựa trên hình ảnh bàn tay được cung cấp
- Hạn chế phán đoán chung chung , hãy phán đoán thật cụ thể
- Ngôn từ dùng cho người bình thường có thể hiểu

Định dạng trả lời:
- Gồm nhiều đoạn văn
- Mỗi đoạn có tiêu đề đặt trong ngoặc vuông []
- Sau tiêu đề là nội dung phân tích rõ ràng, dễ hiểu
- Mỗi đoạn xuống dòng riêng
- Đoạn đầu tiên luôn mô tả bàn tay

Bắt buộc phân tích:
[Mô tả tay] ( chỉ rõ tay trái/phải, nam hay nữ, liệt kê các đường chỉ tay, hình dạng đặc điểm bàn tay )

YÊU CẦU BẮT BUỘC:
- Chỉ trả về JSON hợp lệ
- KHÔNG markdown
- KHÔNG giải thích ngoài JSON
- KHÔNG ký tự thừa

Định dạng JSON theo thứ tự sau:

[
  {
    "title": "Tính cách",
    "content": "..."
  },
  {
    "title": "Tình duyên",
    "content": "..."
  },
  {
    "title": "Tiền tài",
    "content": "..."
  },
  {
    "title": "Vận hạn",
    "content": "..."
  },
  ...
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
