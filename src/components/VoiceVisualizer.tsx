import { motion } from "motion/react";

interface VoiceVisualizerProps {
  isConnected: boolean;
  isRecording: boolean;
  volume: number;
}

export function VoiceVisualizer({
  isConnected,
  isRecording,
  volume,
}: VoiceVisualizerProps) {
  const bars = Array.from({ length: 32 });

  return (
    <div className="flex items-center justify-center gap-1 h-32">
      {bars.map((_, i) => {
        // Create a symmetric wave pattern
        const centerDist = Math.abs(i - 16);
        const maxH = Math.max(10, 100 - centerDist * 5);

        // Calculate dynamic height based on volume and position
        const dynamicHeight =
          isRecording && volume > 0
            ? Math.max(10, (volume / 255) * maxH * (Math.random() * 0.5 + 0.5))
            : 10;

        return (
          <motion.div
            key={i}
            className={`w-2 rounded-full ${
              isConnected
                ? "bg-[var(--color-fab-accent)] shadow-[0_0_8px_rgba(0,255,65,0.6)]"
                : "bg-gray-700"
            }`}
            animate={{
              height: isConnected ? dynamicHeight : 10,
              opacity: isConnected ? 0.8 : 0.3,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          />
        );
      })}
    </div>
  );
}
