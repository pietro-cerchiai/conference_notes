import { useState } from "react"
import { useSpeech } from "../hooks/useSpeech"
import { analyzeTranscript } from "../services/ai"
import { saveContact } from "../storage"
import type { Contact } from "../types"

interface Props {
  userName: string
  onContactSaved: () => void
}

export function Recorder({ userName, onContactSaved }: Props) {
  const { transcript, isListening, startListening, stopListening, resetTranscript } = useSpeech()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const handleStop = async () => {
    stopListening()
    if (!transcript.trim()) return

    setIsAnalyzing(true)
    setError("")

    try {
      const result = await analyzeTranscript(transcript)

      const contact: Contact = {
        id: crypto.randomUUID(),
        createdAt: new Date().toLocaleString("fr-FR"),
        capturedBy: userName,
        firstName: result.firstName ?? "",
        lastName: result.lastName ?? "",
        company: result.company,
        orgType: result.orgType,
        role: result.role,
        summary: result.summary ?? "",
        nextSteps: result.nextSteps ?? [],
        transcript,
      }

      saveContact(contact)
      resetTranscript()
      onContactSaved()
    } catch {
      setError("Erreur lors de l'analyse. Réessaie.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      {!isListening && !isAnalyzing && (
        <button
          onClick={startListening}
          style={{
            width: "100%",
            padding: "1.5rem",
            fontSize: "1.2rem",
            backgroundColor: "#2D2369",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          🎙️ Démarrer la dictée
        </button>
      )}

      {isListening && (
        <>
          <div style={{
            padding: "1rem",
            backgroundColor: "#fef2f2",
            borderRadius: "12px",
            marginBottom: "1rem",
            minHeight: "120px",
            fontSize: "0.95rem",
            color: "#374151",
          }}>
            <div style={{ color: "#E91E8C", marginBottom: "0.5rem", fontWeight: 500 }}>
              ● Enregistrement en cours...
            </div>
            {transcript || <span style={{ color: "#9ca3af" }}>Parle maintenant...</span>}
          </div>

          <button
            onClick={handleStop}
            style={{
              width: "100%",
              padding: "1.5rem",
              fontSize: "1.2rem",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            ⏹ Arrêter et analyser
          </button>
        </>
      )}

      {isAnalyzing && (
        <div style={{
          textAlign: "center",
          padding: "2rem",
          color: "#6b7280",
          fontSize: "1rem",
        }}>
          ⏳ Analyse en cours...
        </div>
      )}

      {error && (
        <div style={{
          marginTop: "1rem",
          padding: "1rem",
          backgroundColor: "#fef2f2",
          color: "#E91E8C",
          borderRadius: "8px",
        }}>
          {error}
        </div>
      )}
    </div>
  )
}