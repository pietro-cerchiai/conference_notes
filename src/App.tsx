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
        backgroundColor: "#f9fafb",
      }}>
        <h1 style={{ fontSize: "1.5rem", color: "#111827", marginBottom: "0.5rem" }}>
          👋 Bienvenue
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem", textAlign: "center" }}>
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
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            marginBottom: "1rem",
            outline: "none",
          }}
        />
        <button
          onClick={handleSetName}
          style={{
            width: "100%",
            maxWidth: "300px",
            padding: "0.75rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Commencer
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", backgroundColor: "#f9fafb", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{
        padding: "1rem",
        backgroundColor: "white",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <h1 style={{ margin: 0, fontSize: "1.1rem", color: "#111827" }}>
          🎙️ Conf Notes
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem("conf_user_name")
            setUserName("")
            setNameInput("")
          }}
          style={{
            fontSize: "0.85rem",
            color: "#6b7280",
            background: "none",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "0.3rem 0.75rem",
            cursor: "pointer",
          }}
        >
          👤 {userName} ↔
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        backgroundColor: "white",
        borderBottom: "1px solid #e5e7eb",
      }}>
        {(["record", "list"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); if (t === "list") refreshContacts() }}
            style={{
              flex: 1,
              padding: "0.75rem",
              border: "none",
              borderBottom: tab === t ? "2px solid #2563eb" : "2px solid transparent",
              backgroundColor: "white",
              color: tab === t ? "#2563eb" : "#6b7280",
              fontWeight: tab === t ? 600 : 400,
              cursor: "pointer",
              fontSize: "0.95rem",
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