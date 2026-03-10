import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ChatWindow } from "./components/ChatWindow";
import { TerminalModule } from "./components/TerminalModule";
import { VulnerabilityScanner } from "./components/VulnerabilityScanner";
import { EncryptionTools } from "./components/EncryptionTools";

export default function App() {
  const [activeModule, setActiveModule] = useState("chat");
  const [voiceBriefingEnabled, setVoiceBriefingEnabled] = useState(false);
  const [liveVoiceEnabled, setLiveVoiceEnabled] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-fab-bg)] text-white font-sans">
      <div className="scanlines"></div>

      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />

      <div className="flex flex-col flex-1 relative z-10">
        <Header
          voiceBriefingEnabled={voiceBriefingEnabled}
          setVoiceBriefingEnabled={setVoiceBriefingEnabled}
          liveVoiceEnabled={liveVoiceEnabled}
          setLiveVoiceEnabled={setLiveVoiceEnabled}
        />

        <main className="flex-1 overflow-hidden relative">
          {activeModule === "chat" && (
            <ChatWindow
              voiceBriefingEnabled={voiceBriefingEnabled}
              liveVoiceEnabled={liveVoiceEnabled}
            />
          )}
          {activeModule === "terminal" && <TerminalModule />}
          {activeModule === "scanner" && <VulnerabilityScanner />}
          {activeModule === "encryption" && <EncryptionTools />}
        </main>
      </div>
    </div>
  );
}
