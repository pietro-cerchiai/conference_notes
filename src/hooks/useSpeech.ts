import { useState, useRef, useCallback } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionType = any

interface UseSpeechReturn {
  transcript: string
  isListening: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  isSupported: boolean
}

export function useSpeech(): UseSpeechReturn {
  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionType>(null)

  const isSupported =
    typeof window !== "undefined" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in (window as any))

  const startListening = useCallback(() => {
    if (!isSupported) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition: SpeechRecognitionType = new SR()

    recognition.lang = "fr-FR"
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: SpeechRecognitionType) => {
      let full = ""
      for (let i = 0; i < event.results.length; i++) {
        full += event.results[i][0].transcript
      }
      setTranscript(full)
    }

    recognition.onend = () => setIsListening(false)
    recognition.onerror = (event: SpeechRecognitionType) => {
      console.error("Speech error:", event.error)
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isSupported])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript("")
  }, [])

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  }
}