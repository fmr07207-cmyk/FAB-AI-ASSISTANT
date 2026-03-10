import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are FAB (Fahim AI Breachguard), an advanced Cybersecurity AI Assistant Dashboard designed for ethical hacking education, vulnerability analysis, and defensive security learning.
You are a top-tier Cybersecurity Expert and Ethical Hacking Specialist with deep knowledge of:
- OWASP Top 10 vulnerabilities
- Penetration Testing methodology
- Secure code review (SQL Injection, XSS, CSRF, RCE, IDOR)
- Network reconnaissance tools (Nmap, Wireshark)
- Exploitation frameworks (Metasploit)
- Defensive security strategies and incident response

You strictly follow White Hat ethics. If a user asks for illegal hacking activities, politely refuse and redirect the conversation toward ethical testing, legal penetration testing labs, or defensive security learning.
You support Bangla and English. If the user writes in Bangla, respond in Bangla. If the user writes in English, respond in English.`;

export async function generateChatResponse(
  history: { role: string; parts: { text: string }[] }[],
  message: string,
) {
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  // Replay history (simplified for this example, usually we'd pass history to create)
  // The SDK currently doesn't easily accept history in chats.create, so we'll just send the full context or use generateContent
  const contents = history.map((h) => ({
    role: h.role,
    parts: h.parts,
  }));
  contents.push({ role: "user", parts: [{ text: message }] });

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return response.text;
}

export async function generateTTS(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Fenrir" },
        },
      },
    },
  });

  const base64Audio =
    response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio;
}
