import { useState, useRef, useCallback } from "react";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

export function useLiveAudio() {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveMessages, setLiveMessages] = useState<
    { role: string; text: string }[]
  >([]);
  const [volume, setVolume] = useState(0);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const connect = useCallback(async () => {
    if (isConnected) return;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Fenrir" } },
          },
          systemInstruction:
            "You are FAB, a Cybersecurity AI Assistant. Speak concisely and professionally.",
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            startAudioCapture(sessionPromise);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio =
              message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              playAudio(base64Audio);
            }
          },
          onclose: () => {
            setIsConnected(false);
            stopAudioCapture();
          },
          onerror: (error) => {
            console.error("Live API Error:", error);
            setIsConnected(false);
            stopAudioCapture();
          },
        },
      });

      sessionRef.current = sessionPromise;
    } catch (error) {
      console.error("Failed to connect to Live API:", error);
    }
  }, [isConnected]);

  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => session.close());
      sessionRef.current = null;
    }
    setIsConnected(false);
    stopAudioCapture();
  }, []);

  const startAudioCapture = async (sessionPromise: Promise<any>) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (!isRecording) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(
            -32768,
            Math.min(32767, Math.floor(inputData[i] * 32768)),
          );
        }

        const base64Data = btoa(
          String.fromCharCode(...new Uint8Array(pcm16.buffer)),
        );

        sessionPromise.then((session) => {
          session.sendRealtimeInput({
            media: { data: base64Data, mimeType: "audio/pcm;rate=16000" },
          });
        });

        // Calculate volume for visualizer
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(avg);
      };

      analyser.connect(processor);
      processor.connect(audioContext.destination);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopAudioCapture = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsRecording(false);
    setVolume(0);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const playAudio = async (base64Audio: string) => {
    try {
      if (!audioContextRef.current) return;

      const audioContext = audioContextRef.current;
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert 16-bit PCM to Float32
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }

      const audioBuffer = audioContext.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return {
    connect,
    disconnect,
    isConnected,
    isRecording,
    toggleRecording,
    liveMessages,
    volume,
  };
}
