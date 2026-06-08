import { useState } from "react"
import type { Contact } from "../types"
import { deleteContact, getAllContacts } from "../storage"

interface Props {
  contact: Contact
  onDelete: () => void
  onUpdate: () => void
}

export function ContactCard({ contact, onDelete, onUpdate }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDelete = () => {
    if (confirm("Supprimer ce contact ?")) {
      deleteContact(contact.id)
      onDelete()
    }
  }

  const updateContact = (updated: Partial<Contact>) => {
    const all = getAllContacts()
    const index = all.findIndex((c) => c.id === contact.id)
    if (index === -1) return
    all[index] = { ...all[index], ...updated }
    localStorage.setItem("conf_notes_contacts", JSON.stringify(all))
    onUpdate()
  }

  const handleBlur = (field: keyof Contact) => (e: React.FocusEvent<HTMLDivElement>) => {
    updateContact({ [field]: e.currentTarget.innerText.trim() } as Partial<Contact>)
  }

  const handleStepBlur = (e: React.FocusEvent<HTMLDivElement>, index: number) => {
    const newSteps = [...contact.nextSteps]
    newSteps[index] = e.currentTarget.innerText.trim()
    updateContact({ nextSteps: newSteps.filter((s) => s !== "") })
  }

  const handleAddStep = () => {
    updateContact({ nextSteps: [...contact.nextSteps, "Nouvelle action"] })
  }

  const initials = `${contact.firstName?.[0] ?? ""}${contact.lastName?.[0] ?? ""}`.toUpperCase()

  const editableStyle = (pink = false): React.CSSProperties => ({
    outline: "none",
    borderBottom: "1px solid transparent",
    paddingBottom: "1px",
    cursor: "text",
    transition: "border 0.15s",
    display: "inline-block",
    minWidth: "40px",
  })

  const focusStyle = (e: React.FocusEvent<HTMLDivElement>) => {
    e.currentTarget.style.borderBottom = "1px solid #E91E8C"
  }
  const blurStyle = (e: React.FocusEvent<HTMLDivElement>) => {
    e.currentTarget.style.borderBottom = "1px solid transparent"
  }

  return (
    <div style={{
      backgroundColor: "white",
      border: "1px solid #dde2ea",
      borderRadius: "14px",
      padding: "1rem",
      marginBottom: "1rem",
    }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: "#2D2369", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "13px", fontWeight: 600,
            color: "white", flexShrink: 0,
          }}>
            {initials || "?"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur("firstName")}
                onFocus={focusStyle}
                style={{ ...editableStyle(), fontSize: "1rem", fontWeight: 500, color: "#1a1a2e" }}
              >
                {contact.firstName}
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur("lastName")}
                onFocus={focusStyle}
                style={{ ...editableStyle(), fontSize: "1rem", fontWeight: 500, color: "#1a1a2e" }}
              >
                {contact.lastName}
              </div>
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur("role")}
              onFocus={focusStyle}
              style={{ ...editableStyle(), fontSize: "0.82rem", color: "#6b7a91", marginTop: "2px" }}
            >
              {contact.role || "Poste non renseigné"}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur("company")}
              onFocus={focusStyle}
              style={{ ...editableStyle(), fontSize: "0.82rem", color: "#6b7a91", marginTop: "2px" }}
            >
              {contact.company || "Société non renseignée"}
            </div>
          </div>
        </div>
        <button onClick={handleDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "1.1rem", paddingLeft: "8px" }}>
          🗑
        </button>
      </div>

      {/* Email */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", padding: "8px 10px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
        <span style={{ fontSize: "0.8rem", color: "#6b7a91", flexShrink: 0 }}>✉️</span>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur("email" as keyof Contact)}
          onFocus={focusStyle}
          style={{
            flex: 1, fontSize: "0.82rem", color: (contact as any).email ? "#1a1a2e" : "#9ca3af",
            outline: "none", cursor: "text",
          }}
        >
          {(contact as any).email || "Ajouter un email..."}
        </div>
      </div>

      {/* Toggle détails */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: "100%", background: "none", border: "none",
          color: "#2D2369", fontSize: "0.8rem", fontWeight: 500,
          cursor: "pointer", textAlign: "left", padding: "10px 0 2px",
          display: "flex", alignItems: "center", gap: "4px",
        }}
      >
        {isExpanded ? "▲" : "▼"} {isExpanded ? "Masquer" : "Voir résumé et next steps"}
      </button>

      {isExpanded && (
        <>
          {/* Résumé */}
          <div style={{ marginTop: "10px" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#2D2369", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "4px" }}>
              Résumé
            </p>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur("summary")}
              onFocus={(e) => { focusStyle(e); e.currentTarget.style.border = "1px solid #E91E8C" }}
              onBlurCapture={(e) => { blurStyle(e); e.currentTarget.style.border = "1px solid transparent" }}
              style={{
                padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "8px",
                fontSize: "0.88rem", color: "#1a1a2e", lineHeight: "1.55",
                outline: "none", border: "1px solid transparent",
                cursor: "text", transition: "border 0.15s",
              }}
            >
              {contact.summary}
            </div>
          </div>

          {/* Next steps */}
          <div style={{ marginTop: "10px" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#2D2369", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "6px" }}>
              Next steps
            </p>
            {contact.nextSteps.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#E91E8C", marginTop: "7px", flexShrink: 0 }} />
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleStepBlur(e, i)}
                  onFocus={focusStyle}
                  onBlurCapture={blurStyle}
                  style={{ flex: 1, fontSize: "0.85rem", color: "#1a1a2e", outline: "none", borderBottom: "1px solid transparent", paddingBottom: "2px", cursor: "text", transition: "border 0.15s" }}
                >
                  {step}
                </div>
              </div>
            ))}
            <button
              onClick={handleAddStep}
              style={{ background: "none", border: "1px dashed #dde2ea", borderRadius: "8px", padding: "4px 10px", fontSize: "0.8rem", color: "#6b7a91", cursor: "pointer", marginTop: "4px" }}
            >
              + Ajouter un next step
            </button>
          </div>
        </>
      )}

      <p style={{ margin: "0.75rem 0 0", fontSize: "0.72rem", color: "#9ca3af" }}>
        {contact.createdAt} · {contact.capturedBy}
      </p>
    </div>
  )
}