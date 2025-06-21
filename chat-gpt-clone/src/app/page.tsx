"use client";
import React, { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  async function askAI(query: string) {
    try {
      const response = await fetch('/api/openai/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Failed to fetch AI response:', error);
      return 'Error fetching AI response';
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const aiResponse = await askAI(input);
    console.log("AI Response:", aiResponse); // Debugging
    const newMessages = [
      ...messages,
      { role: "user", content: input },
      { role: "assistant", content: aiResponse },
    ];
    setMessages(newMessages);
    setInput("");
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex flex-col h-screen bg-[#343541] text-white">
      {/* Watermark */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-7xl font-bold text-white opacity-5 select-none pointer-events-none z-0">
          Ask AI
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-6 z-10">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-green-500 text-white font-bold mr-4">
                  AI
                </div>
              )}
              <div
                className={`whitespace-pre-wrap p-4 rounded-lg ${
                  msg.role === "user" ? "bg-[#40414f] text-right" : "bg-[#444654] text-left"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold ml-4">
                  U
                </div>
              )}
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      </div>

      <div className="bg-[#343541] px-4 py-4 border-t border-gray-600 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end">
            <textarea
              className="flex-1 bg-[#40414f] text-white p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
            />
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">
            ChatGPT Clone UI using Next.js + Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
