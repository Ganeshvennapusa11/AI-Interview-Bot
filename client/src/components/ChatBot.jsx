import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hello! How can I assist you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const sendMessage = async () => {
    if (input.trim()) {
      const userMsg = {
        from: 'user',
        text: input,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);

      try {
        const res = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });

        const data = await res.json();
        const botReply = {
          from: 'bot',
          text: data.reply || "⚠️ No response from AI.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botReply]);
      } catch (err) {
        console.error("Chat error:", err);
        setMessages((prev) => [
          ...prev,
          {
            from: 'bot',
            text: '⚠️ Error contacting AI server.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const containerClass = darkMode
    ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white'
    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900';

  const inputClass = darkMode
    ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-400'
    : 'bg-white border-gray-400 text-gray-900 focus:ring-black';

  return (
    <div className={`min-h-screen flex justify-center items-center transition-colors duration-500 ${containerClass}`}>
      <div className={`max-w-md w-full rounded-2xl shadow-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className={`font-semibold text-lg px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-300 text-gray-900'}`}>
            🤖 AI ChatBot Interface
          </h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm px-3 py-1 border rounded-md hover:bg-gray-600 hover:text-white transition"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Chat window */}
        <div className={`mb-4 h-72 overflow-y-auto border p-3 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                  msg.from === 'bot'
                    ? `${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'} self-start`
                    : `${darkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'} self-end ml-auto text-right`
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{msg.time}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && <div className={`italic text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bot is typing...</div>}
        </div>

        {/* Input area */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            className={`flex-grow border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${inputClass}`}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
