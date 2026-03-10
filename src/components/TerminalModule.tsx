import { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon } from "lucide-react";

export function TerminalModule() {
  const [logs, setLogs] = useState<string[]>([
    "FAB System Initialized...",
    "Loading modules...",
    "Connecting to secure network...",
    "Connection established.",
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = [
        "[SYSTEM] Scanning network traffic...",
        "[INFO] No anomalies detected.",
        "[WARN] Suspicious packet dropped from 192.168.1.105",
        "[INFO] Updating threat signatures...",
        "[SYSTEM] Threat signatures updated successfully.",
      ];
      setLogs((prev) =>
        [...prev, newLogs[Math.floor(Math.random() * newLogs.length)]].slice(
          -50,
        ),
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[var(--color-fab-surface)] p-6">
      <div className="flex items-center gap-3 mb-4 text-[var(--color-fab-accent)] border-b border-[var(--color-fab-border)] pb-4">
        <TerminalIcon size={24} />
        <h2 className="text-xl font-mono font-bold tracking-widest">
          TERMINAL
        </h2>
      </div>

      <div className="flex-1 bg-black/80 rounded-lg border border-[var(--color-fab-border)] p-4 font-mono text-sm overflow-y-auto">
        {logs.map((log, i) => (
          <div
            key={i}
            className={`mb-1 ${log.includes("[WARN]") ? "text-yellow-500" : log.includes("[ERROR]") ? "text-red-500" : "text-[var(--color-fab-accent)]"}`}
          >
            <span className="opacity-50 mr-2">
              {new Date().toLocaleTimeString()}
            </span>
            {log}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
