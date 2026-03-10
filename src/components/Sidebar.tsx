import { Terminal, MessageSquare, ShieldAlert, Key } from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const modules = [
    { id: "chat", icon: MessageSquare, label: "Live Assistant" },
    { id: "terminal", icon: Terminal, label: "Terminal" },
    { id: "scanner", icon: ShieldAlert, label: "Vulnerability Scan" },
    { id: "encryption", icon: Key, label: "Encryption Tools" },
  ];

  return (
    <div className="w-64 bg-[var(--color-fab-surface)] border-r border-[var(--color-fab-border)] h-full flex flex-col z-20">
      <div className="p-6 border-b border-[var(--color-fab-border)]">
        <h1 className="text-2xl font-bold text-[var(--color-fab-accent)] glow-text font-mono tracking-tighter">
          FAB
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-mono uppercase tracking-widest">
          Breachguard
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {modules.map((mod) => {
          const isActive = activeModule === mod.id;
          const Icon = mod.icon;

          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[var(--color-fab-accent)]/10 text-[var(--color-fab-accent)] border border-[var(--color-fab-accent)]/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} className={isActive ? "glow-text" : ""} />
              <span className="font-medium text-sm">{mod.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-8 bg-[var(--color-fab-accent)] rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--color-fab-border)]">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <div className="w-2 h-2 rounded-full bg-[var(--color-fab-accent)] animate-pulse"></div>
          SYSTEM ONLINE
        </div>
      </div>
    </div>
  );
}
