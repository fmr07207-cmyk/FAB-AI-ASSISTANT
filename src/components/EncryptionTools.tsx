import { useState } from "react";
import { Key, Lock, Unlock, Copy, Check } from "lucide-react";

export function EncryptionTools() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEncrypt = async () => {
    if (!input) return;
    setIsEncrypting(true);

    try {
      const res = await fetch("/api/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setOutput(data.encrypted);
    } catch (error) {
      console.error(error);
      setOutput("Error encrypting data.");
    } finally {
      setIsEncrypting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-fab-surface)] p-6">
      <div className="flex items-center gap-3 mb-6 text-[var(--color-fab-accent)] border-b border-[var(--color-fab-border)] pb-4">
        <Key size={24} />
        <h2 className="text-xl font-mono font-bold tracking-widest">
          ENCRYPTION TOOLS
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        <div className="flex flex-col gap-4">
          <label className="font-mono text-sm text-gray-400">
            INPUT DATA (PLAINTEXT)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 bg-black/50 border border-[var(--color-fab-border)] rounded-lg p-4 font-mono text-sm focus:border-[var(--color-fab-accent)] outline-none resize-none transition-colors"
            placeholder="Enter text to encrypt..."
          />
          <button
            onClick={handleEncrypt}
            disabled={!input || isEncrypting}
            className="bg-[var(--color-fab-accent)] text-black py-3 rounded-lg font-bold font-mono flex items-center justify-center gap-2 hover:bg-[var(--color-fab-accent)]/80 disabled:opacity-50 transition-colors"
          >
            <Lock size={18} />
            ENCRYPT DATA
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="font-mono text-sm text-gray-400">
              OUTPUT DATA (CIPHERTEXT)
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="text-gray-400 hover:text-[var(--color-fab-accent)] transition-colors flex items-center gap-1 text-xs font-mono"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "COPIED" : "COPY"}
              </button>
            )}
          </div>
          <div className="w-full h-48 bg-black/80 border border-gray-800 rounded-lg p-4 font-mono text-sm text-[var(--color-fab-accent)] overflow-y-auto break-all">
            {output || "Awaiting input..."}
          </div>
          <button
            disabled={true}
            className="bg-gray-800 text-gray-500 py-3 rounded-lg font-bold font-mono flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Unlock size={18} />
            DECRYPT DATA (PRO FEATURE)
          </button>
        </div>
      </div>
    </div>
  );
}
