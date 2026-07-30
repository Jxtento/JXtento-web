import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function CopilotTab() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your JXtento Copilot. What do you want to know about this token or deployer?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
      
      const response = await fetch(`${baseUrl}/v1/copilot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.slice(1), // Exclude welcome message from API
        })
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that right now. Ensure the backend is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const suggestedPrompts = [
    "Scan this coin",
    "Who is this deployer?",
    "Is the volume real?"
  ];

  return (
    <div className="flex flex-col h-full w-full bg-axiom-bg border border-axiom-border rounded-lg shadow-lg font-sans text-sm">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-lg p-3 ${
                m.role === 'user' 
                  ? 'bg-axiom-accent text-white rounded-br-none whitespace-pre-wrap' 
                  : 'bg-axiom-panel text-axiom-text border border-axiom-border rounded-bl-none prose prose-sm prose-invert'
              }`}
            >
              {m.role === 'user' ? (
                m.content
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-axiom-panel text-axiom-muted border border-axiom-border rounded-lg rounded-bl-none p-3 animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-3 pb-2 flex flex-wrap gap-2">
          {suggestedPrompts.map(prompt => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="text-xs bg-axiom-panel hover:bg-axiom-border text-axiom-muted hover:text-axiom-text px-2 py-1 rounded border border-axiom-border transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 bg-axiom-panel rounded-b-lg border-t border-axiom-border flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="flex-1 bg-axiom-bg text-axiom-text placeholder-axiom-muted rounded px-3 py-2 border border-axiom-border focus:outline-none focus:border-axiom-accent resize-none"
          rows={1}
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          className="bg-axiom-accent hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded font-semibold transition-colors h-[40px]"
        >
          Send
        </button>
      </div>
    </div>
  );
}
