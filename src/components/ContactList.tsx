import { ContactCard } from "./ContactCard"
import { exportToExcel } from "../storage"
import type { Contact } from "../types"

interface Props {
  contacts: Contact[]
  onRefresh: () => void
}

export function ContactList({ contacts, onRefresh }: Props) {
  const handleExport = () => {
    if (contacts.length === 0) return
    exportToExcel(contacts)
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
      }}>
        <h2 style={{ margin: 0, fontSize: "1rem", color: "#374151" }}>
          {contacts.length} contact{contacts.length > 1 ? "s" : ""}
        </h2>
        <button
          onClick={handleExport}
          disabled={contacts.length === 0}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: contacts.length === 0 ? "#e5e7eb" : "#2D2369",
            color: contacts.length === 0 ? "#9ca3af" : "white",
            border: "none",
            borderRadius: "8px",
            cursor: contacts.length === 0 ? "not-allowed" : "pointer",
            fontSize: "0.9rem",
          }}
        >
          📥 Exporter Excel
        </button>
      </div>

      {contacts.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "3rem 1rem",
          color: "#9ca3af",
          fontSize: "0.95rem",
        }}>
          Aucun contact pour l'instant.<br />
          Démarre une dictée pour commencer !
        </div>
      ) : (
        contacts
          .slice()
          .reverse()
          .map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onDelete={onRefresh}
              onUpdate={onRefresh}
            />
          ))
      )}
    </div>
  )
}