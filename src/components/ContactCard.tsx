import type { Contact } from "../types"
import { deleteContact } from "../storage"

interface Props {
  contact: Contact
  onDelete: () => void
}

export function ContactCard({ contact, onDelete }: Props) {
  const handleDelete = () => {
    if (confirm("Supprimer ce contact ?")) {
      deleteContact(contact.id)
      onDelete()
    }
  }

  return (
    <div style={{
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "1rem",
      marginBottom: "1rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#111827" }}>
            {contact.firstName} {contact.lastName}
          </h3>
          {contact.role && (
            <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
              {contact.role}
            </p>
          )}
          {contact.company && (
            <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
              {contact.company} {contact.orgType ? `· ${contact.orgType}` : ""}
            </p>
          )}
        </div>
        <button
          onClick={handleDelete}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            color: "#9ca3af",
          }}
        >
          🗑
        </button>
      </div>

      <div style={{
        marginTop: "0.75rem",
        padding: "0.75rem",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        fontSize: "0.9rem",
        color: "#374151",
      }}>
        {contact.summary}
      </div>

      {contact.nextSteps.length > 0 && (
        <div style={{ marginTop: "0.75rem" }}>
          <p style={{ margin: "0 0 0.4rem", fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>
            Next steps
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
            {contact.nextSteps.map((step, i) => (
              <li key={i} style={{ fontSize: "0.85rem", color: "#374151", marginBottom: "2px" }}>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p style={{ margin: "0.75rem 0 0", fontSize: "0.75rem", color: "#9ca3af" }}>
        {contact.createdAt} · {contact.capturedBy}
      </p>
    </div>
  )
}