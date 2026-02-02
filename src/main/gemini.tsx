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

  const isJP = true

  const PROMPT_JP = `
あなたは客観的かつ自信を持って鑑定するプロの手相鑑定士です。

手の向き: ${handDirection}

要件:

回答は 100% 日本語

AI・モデル・技術について 一切言及しない

手のひらの画像のみから直接分析する

明確で断定的、具体的な表現を使う

曖昧・一般論的な表現は避ける

タスク:

画像から手相の線を見つけ、以下の手相線を分析してください

出力形式:

有効な JSON のみで返す

マークダウン禁止

説明文・注釈・コメント禁止

末尾カンマ禁止

UTF-8 プレーンテキスト

JSON文字列を返す

結果は 配列

配列の各要素は オブジェクト

各オブジェクトは 以下2フィールドのみを含む

title

content

定義:

title: 手相線の名称

content: 形状の説明・意味・個人的な解釈を 1段落にまとめた文章

もし

もっとドラマ性を強めたい

断言口調をさらに強くしたい

占いサービス向けに調整したい

とかあれば、用途に合わせて日本語をチューニングするよ
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
      text: isJP ? PROMPT_JP : PROMPT_VI
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
