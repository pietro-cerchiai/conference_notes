import { useState, useEffect } from "react"
import { Recorder } from "./components/Recorder"
import { ContactList } from "./components/ContactList"
import { getAllContacts } from "./storage"
import type { Contact } from "./types"

type Tab = "record" | "list"

export default function App() {
  const [userName, setUserName] = useState("")
  const [nameInput, setNameInput] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [tab, setTab] = useState<Tab>("record")

  useEffect(() => {
    const saved = localStorage.getItem("conf_user_name")
    if (saved) setUserName(saved)
  }, [])

  const handleSetName = () => {
    if (!nameInput.trim()) return
    localStorage.setItem("conf_user_name", nameInput.trim())
    setUserName(nameInput.trim())
  }

  const refreshContacts = () => {
    setContacts(getAllContacts())
  }

  useEffect(() => {
    refreshContacts()
  }, [])

  if (!userName) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        backgroundColor: "#2D2369",
      }}>
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="none" stroke="white" strokeWidth="2" opacity="0.3"/>
            <path d="M14 38 Q20 20 26 32 Q29 38 32 24 Q35 10 38 28 Q41 38 44 26 Q48 16 50 26"
              fill="none" stroke="url(#g1)" strokeWidth="3.5" strokeLinecap="round"/>
            <defs>
              <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7B5EA7"/>
                <stop offset="100%" stopColor="#E91E8C"/>
              </linearGradient>
            </defs>
          </svg>
          <div style={{ color: "white", fontSize: "24px", fontWeight: 700, marginTop: "12px", letterSpacing: "1px" }}>
            matawan
          </div>
          <div style={{ color: "#E91E8C", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" }}>
            Conf Notes
          </div>
        </div>

        <h1 style={{ fontSize: "1.3rem", color: "white", marginBottom: "8px" }}>
          Bienvenue
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
          Entre ton prénom pour identifier tes contacts
        </p>
        <input
          type="text"
          placeholder="Ton prénom"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSetName()}
          style={{
            width: "100%",
            maxWidth: "300px",
            padding: "0.85rem 1rem",
            fontSize: "1rem",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "12px",
            marginBottom: "1rem",
            outline: "none",
            backgroundColor: "rgba(255,255,255,0.08)",
            color: "white",
          }}
        />
        <button
          onClick={handleSetName}
          style={{
            width: "100%",
            maxWidth: "300px",
            padding: "0.85rem",
            backgroundColor: "#E91E8C",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Commencer →
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", backgroundColor: "#f4f6f9", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{
        background: "#2D2369",
        padding: "14px 16px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="26" height="26" viewBox="0 0 26 26">
            <path d="M4 16 Q7 8 10 13 Q11.5 16 13 10 Q14.5 4 16 11 Q17.5 16 19 10 Q21 5 22 10"
              fill="none" stroke="url(#g2)" strokeWidth="2.5" strokeLinecap="round"/>
            <defs>
              <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7B5EA7"/>
                <stop offset="100%" stopColor="#E91E8C"/>
              </linearGradient>
            </defs>
          </svg>
          <div>
            <div style={{ color: "white", fontSize: "15px", fontWeight: 700, letterSpacing: "0.5px" }}>
              matawan
            </div>
            <div style={{ color: "#E91E8C", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase" }}>
              Conf Notes
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("conf_user_name")
            setUserName("")
            setNameInput("")
          }}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "20px",
            padding: "4px 12px",
            color: "rgba(255,255,255,0.85)",
            fontSize: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          👤 {userName} ↔
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        backgroundColor: "#2D2369",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}>
        {(["record", "list"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); if (t === "list") refreshContacts() }}
            style={{
              flex: 1,
              padding: "10px 8px",
              border: "none",
              borderBottom: tab === t ? "2px solid #E91E8C" : "2px solid transparent",
              backgroundColor: "transparent",
              color: tab === t ? "#E91E8C" : "rgba(255,255,255,0.45)",
              fontWeight: tab === t ? 600 : 400,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {t === "record" ? "🎙️ Dicter" : `📋 Contacts (${contacts.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "record" ? (
        <Recorder
          userName={userName}
          onContactSaved={() => {
            refreshContacts()
            setTab("list")
          }}
        />
      ) : (
        <ContactList
          contacts={contacts}
          onRefresh={refreshContacts}
        />
      )}
    </div>
  )
}