import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';
import { get } from 'http';
import { getHealthMetrics } from '@/services';

// Initialize GoogleGenAI instance
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    const healthInstruction = {
      role: 'user',
      parts: [
        {
          text: 'Bạn là một trợ lý chatbot chuyên về sức khỏe. Chỉ trả lời các câu hỏi liên quan đến sức khỏe, y tế, lối sống lành mạnh, bệnh tật (với mục đích cung cấp thông tin chung, không chẩn đoán hay thay thế lời khuyên bác sĩ). Tuyệt đối không trả lời bất kỳ câu hỏi nào khác ngoài chủ đề sức khỏe. Nếu người dùng hỏi về chủ đề không liên quan đến sức khỏe, hãy lịch sự thông báo rằng bạn chỉ có thể hỗ trợ các câu hỏi về sức khỏe và mời họ đặt câu hỏi khác liên quan.',
        },
      ],
    };

    // Prepare conversation context
    const conversationContext = history
      .map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }))
      .slice(-10);

    const regex = /tình trạng sức khỏe/i;
    let currentMessage = null;
    if (regex.test(message)) {
      const response = await getHealthMetrics();
      //   console.log('Health metrics response:', response.heart);
      const newMessage = `heart: ${response.heart} spo2:${response.spo2} tmp: ${response.temp} phân tích tình trạng sức khỏe của bạn dựa trên các chỉ số này.`;
      currentMessage = {
        role: 'user',
        parts: [{ text: newMessage }],
      };
    } else {
      currentMessage = {
        role: 'user',
        parts: [{ text: message }],
      };
    }

    console.log('Current message:', currentMessage);
    const contentsToSend = [healthInstruction, ...conversationContext, currentMessage];

    // Call GoogleGenAI to generate content
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: contentsToSend,

      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      },
    });

    const reply = response.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có phản hồi từ AI';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Lỗi xử lý:', error);
    return NextResponse.json({ error: 'Lỗi xử lý yêu cầu: ' + error.message }, { status: 500 });
  }
}
