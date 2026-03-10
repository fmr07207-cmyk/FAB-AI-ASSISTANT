import { useState, useEffect, useRef } from "react";
import { Send, Mic, Square, Loader2 } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { VoiceVisualizer } from "./VoiceVisualizer";
import { generateChatResponse, generateTTS } from "../services/gemini";
import { useLiveAudio } from "../hooks/useLiveAudio";

interface ChatWindowProps {
  voiceBriefingEnabled: boolean;
  liveVoiceEnabled: boolean;
}

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  isStreaming?: boolean;
}

export function ChatWindow({
  voiceBriefingEnabled,
  liveVoiceEnabled,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "model",
      text: "Welcome to FAB (Fahim AI Breachguard). I am your advanced Cybersecurity AI Assistant. How can I assist you with ethical hacking, vulnerability analysis, or defensive security today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    connect,
    disconnect,
    isConnected,
    isRecording,
    toggleRecording,
    liveMessages,
    volume,
  } = useLiveAudio();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveMessages]);

  useEffect(() => {
    if (liveVoiceEnabled) {
      connect();
    } else {
      disconnect();
    }
    return () => disconnect();
  }, [liveVoiceEnabled]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    const newMessages: Message[] = [
      ...messages,
      { id: Date.now().toString(), role: "user", text: userMsg },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const responseText = await generateChatResponse(history, userMsg);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: responseText || "",
        },
      ]);

      if (voiceBriefingEnabled && responseText) {
        playTTS(responseText);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: "**Error:** Unable to process request. Please check your connection or API key.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const playTTS = async (text: string) => {
    try {
      const base64Audio = await generateTTS(text);
      if (base64Audio) {
        const audioUrl = `data:audio/mp3;base64,${base64Audio}`;
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(audioUrl);
        audioRef.current.play();
      }
    } catch (error) {
      console.error("TTS error:", error);
    }
  };

  // Speech-to-Text (Web Speech API for input field)
  const handleSTT = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Could be made dynamic for Bangla 'bn-BD'
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + (prev ? " " : "") + transcript);
    };

    recognition.start();
  };

  if (liveVoiceEnabled) {
    return (
      <div className="flex flex-col h-full bg-[var(--color-fab-surface)]/50 p-6 relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <VoiceVisualizer
            isConnected={isConnected}
            isRecording={isRecording}
            volume={volume}
          />

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-mono text-[var(--color-fab-accent)] glow-text mb-2">
              LIVE AUDIO LINK ESTABLISHED
            </h3>
            <p className="text-gray-400 font-mono text-sm max-w-md">
              Speak naturally. The AI is listening and will respond in
              real-time.
            </p>
          </div>

          <button
            onClick={toggleRecording}
            className={`mt-8 w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              isRecording
                ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse"
                : "bg-[var(--color-fab-accent)]/20 border-[var(--color-fab-accent)] text-[var(--color-fab-accent)]"
            }`}
          >
            {isRecording ? <Square size={24} /> : <Mic size={24} />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 text-[var(--color-fab-accent)] font-mono text-sm">
            <Loader2 size={16} className="animate-spin" />
            <span>ANALYZING...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[var(--color-fab-border)] bg-[var(--color-fab-surface)]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-black/40 border border-[var(--color-fab-border)] rounded-xl p-2 focus-within:border-[var(--color-fab-accent)]/50 transition-colors">
          <button
            onClick={handleSTT}
            className="p-3 text-gray-400 hover:text-[var(--color-fab-accent)] transition-colors rounded-lg hover:bg-white/5"
            title="Speech to Text"
          >
            <Mic size={20} />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Enter command or query..."
            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-[44px] py-3 px-2 text-sm font-mono text-gray-200 placeholder:text-gray-600"
            rows={1}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-[var(--color-fab-accent)] text-black rounded-lg hover:bg-[var(--color-fab-accent)]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
