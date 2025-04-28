'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';

// Định nghĩa kiểu dữ liệu cho tin nhắn
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! Tôi là chatbot AI. Tôi có thể giúp gì cho bạn?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hàm xử lý khi người dùng gửi tin nhắn
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Thêm tin nhắn của người dùng vào danh sách
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Ở đây bạn sẽ gọi API của chatbot
      // Đây là mô phỏng gọi API
      setTimeout(async () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Tôi đã nhận được tin nhắn của bạn: "${userMessage.content}". Đây là phản hồi từ chatbot AI.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);

      // Khi bạn tích hợp API thực, hãy thay đoạn code trên bằng đoạn code dưới đây:
      /*
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          history: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from API');
      }

      const data = await response.json();
      
      const botResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      */
    } catch (error) {
      console.error('Error sending message:', error);
      // Hiển thị tin nhắn lỗi
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn. Vui lòng thử lại sau.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Xử lý khi người dùng nhấn Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Xóa toàn bộ lịch sử chat
  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Xin chào! Tôi là chatbot AI. Tôi có thể giúp gì cho bạn?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden w-full bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
        <Button variant="outline" size="icon" onClick={clearChat} title="Xóa cuộc trò chuyện">
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <Card className="flex-grow overflow-hidden">
        <CardContent className="p-4 h-full flex flex-col">
          <ScrollArea className="flex-grow pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <Avatar className={message.role === 'assistant' ? 'bg-primary' : 'bg-muted'}>
                      {message.role === 'assistant' ? (
                        <Bot className="h-5 w-5" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          message.role === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="bg-primary">
                      <Bot className="h-5 w-5" />
                    </Avatar>
                    <div className="rounded-lg p-3 text-sm bg-muted">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                        <div
                          className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: '0.4s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="mt-4 flex gap-2">
            <Textarea
              placeholder="Nhập tin nhắn của bạn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="resize-none min-h-[50px] max-h-[200px]"
              disabled={isLoading}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
