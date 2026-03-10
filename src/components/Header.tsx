import { Volume2, Mic, Activity } from "lucide-react";

interface HeaderProps {
  voiceBriefingEnabled: boolean;
  setVoiceBriefingEnabled: (enabled: boolean) => void;
  liveVoiceEnabled: boolean;
  setLiveVoiceEnabled: (enabled: boolean) => void;
}

export function Header({
  voiceBriefingEnabled,
  setVoiceBriefingEnabled,
  liveVoiceEnabled,
  setLiveVoiceEnabled,
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-[var(--color-fab-border)] bg-[var(--color-fab-surface)]/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold font-mono text-gray-200">
          <span className="text-[var(--color-fab-accent)] mr-2">&gt;</span>
          SECURE_SESSION
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Voice Briefing Toggle */}
        <div className="flex items-center gap-2">
          <Volume2
            size={16}
            className={
              voiceBriefingEnabled
                ? "text-[var(--color-fab-accent)]"
                : "text-gray-500"
            }
          />
          <span className="text-xs font-mono text-gray-400 mr-2">
            TTS BRIEFING
          </span>
          <button
            onClick={() => setVoiceBriefingEnabled(!voiceBriefingEnabled)}
            className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${voiceBriefingEnabled ? "bg-[var(--color-fab-accent)]/30" : "bg-gray-800"}`}
          >
            <div
              className={`absolute top-1 w-3 h-3 rounded-full transition-all duration-300 ${voiceBriefingEnabled ? "left-6 bg-[var(--color-fab-accent)] glow-text" : "left-1 bg-gray-500"}`}
            ></div>
          </button>
        </div>

        {/* Live Voice Assistant Toggle */}
        <div className="flex items-center gap-2">
          <Mic
            size={16}
            className={
              liveVoiceEnabled
                ? "text-[var(--color-fab-accent)]"
                : "text-gray-500"
            }
          />
          <span className="text-xs font-mono text-gray-400 mr-2">
            LIVE AUDIO
          </span>
          <button
            onClick={() => setLiveVoiceEnabled(!liveVoiceEnabled)}
            className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${liveVoiceEnabled ? "bg-[var(--color-fab-accent)]/30" : "bg-gray-800"}`}
          >
            <div
              className={`absolute top-1 w-3 h-3 rounded-full transition-all duration-300 ${liveVoiceEnabled ? "left-6 bg-[var(--color-fab-accent)] glow-text" : "left-1 bg-gray-500"}`}
            ></div>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/50 border border-[var(--color-fab-border)]">
          <Activity size={14} className="text-[var(--color-fab-accent)]" />
          <span className="text-xs font-mono text-[var(--color-fab-accent)]">
            SECURE
          </span>
        </div>
      </div>
    </header>
  );
}
