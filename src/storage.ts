import * as XLSX from "xlsx"
import type { Contact } from "./types"

const STORAGE_KEY = "conf_notes_contacts"

export const saveContact = (contact: Contact): void => {
  const existing = getAllContacts()
  const updated = [...existing, contact]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export const getAllContacts = (): Contact[] => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []
  return JSON.parse(data) as Contact[]
}

export const deleteContact = (id: string): void => {
  const existing = getAllContacts()
  const updated = existing.filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export const exportToExcel = (contacts: Contact[]): void => {
  const rows = contacts.map((c) => ({
    "Date": c.createdAt,
    "Capturé par": c.capturedBy,
    "Prénom": c.firstName,
    "Nom": c.lastName,
    "Société": c.company ?? "",
    "Type org.": c.orgType ?? "",
    "Rôle": c.role ?? "",
    "Résumé": c.summary,
    "Next steps": c.nextSteps.join(" | "),
    "Transcript": c.transcript,
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Contacts")

  const date = new Date().toISOString().slice(0, 10)
  XLSX.utils.sheet_add_aoa(ws, [], { origin: "A1" })
  XLSX.writeFile(wb, `conf-notes-${date}.xlsx`)
}