import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Volume2, VolumeX, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GeminiVoiceAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check SpeechRecognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition notice:", err.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setIsListening(true);
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Recognition start error:", err);
        setIsListening(false);
      }
    } else {
      setError("Speech recognition is not supported in this browser. You can type your message below.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = query.trim();
    setInputQuery('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/voice-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg })
      });

      if (!res.ok) {
        throw new Error("Failed to contact Groq Voice Assistant server.");
      }

      const data = await res.json();
      const reply = data.text || "I am here to help you navigate MedRoute. How can I assist you further?";

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      speakText(reply);
    } catch (err: any) {
      console.error("Voice Assistant Error:", err);
      const fallbackReply = "Namaste! You can click 'Request Medicine' to upload your prescription or 'Donate Medicine' to contribute unused medicines.";
      setMessages(prev => [...prev, { sender: 'bot', text: fallbackReply }]);
      speakText(fallbackReply);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAssistant = () => {
    if (!isActive) {
      setIsActive(true);
      if (messages.length === 0) {
        const greeting = "Namaste! Welcome to MedRoute. I am your AI Care Assistant. How can I help you today?";
        setMessages([{ sender: 'bot', text: greeting }]);
        speakText(greeting);
      }
    } else {
      setIsActive(false);
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-5 w-80 sm:w-96 mb-2 overflow-hidden relative font-sans flex flex-col h-[460px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img 
                    src="https://api.dicebear.com/7.x/lorelei/svg?seed=nurse&backgroundColor=b6e3f4" 
                    alt="Nurse"
                    className="w-9 h-9 rounded-full border border-emerald-200 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-slate-800 tracking-wide uppercase">MedRoute Care AI</h4>
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-md flex items-center gap-1 border border-emerald-200">
                      <Sparkles size={10} /> AI Assistant
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Voice & Multi-lingual Assistance</p>
                </div>
              </div>
              <button 
                onClick={toggleAssistant} 
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 px-1">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#2c3e2e] text-white rounded-br-none shadow-sm font-medium'
                      : 'bg-emerald-50/80 text-emerald-950 border border-emerald-100 rounded-bl-none font-sans font-medium'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-emerald-600" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Controls & Input */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask in English, Hindi, or Hinglish..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputQuery.trim() || isLoading}
                  className="p-2 bg-[#2c3e2e] text-white rounded-xl hover:bg-[#3d5440] disabled:opacity-50 transition shadow-sm"
                >
                  <Send size={15} />
                </button>
              </div>

              <div className="flex items-center justify-between px-1">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${
                    isListening 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  <span>{isListening ? 'Listening...' : 'Tap to Speak'}</span>
                </button>

                {isSpeaking && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold animate-pulse">
                    <Volume2 size={14} />
                    <span>Speaking...</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAssistant}
        className={`w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center text-white transition-all relative overflow-hidden ${
          isActive ? 'bg-rose-500 hover:bg-rose-600' : 'bg-[#2c3e2e] hover:bg-[#3d5440]'
        }`}
      >
        <div className="relative w-12 h-12 flex items-center justify-center">
          <img 
            src="https://api.dicebear.com/7.x/lorelei/svg?seed=nurse&backgroundColor=b6e3f4" 
            alt="Nurse Assistant"
            className="w-full h-full object-contain rounded-full"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#2c3e2e] rounded-full animate-ping" />
        </div>
      </motion.button>
    </div>
  );
};

export default GeminiVoiceAssistant;
