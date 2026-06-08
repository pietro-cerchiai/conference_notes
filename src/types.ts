export type OrgType =
  | "exploitant"
  | "SPL"
  | "région"
  | "ville"
  | "autorité organisatrice"
  | "bureau d'études"
  | "autre"

export interface Contact {
  id: string
  createdAt: string
  capturedBy: string

  // Obligatoires
  firstName: string
  lastName: string

  // Optionnels — extraits par l'IA si mentionnés
  company?: string
  orgType?: OrgType
  role?: string
  email?: string

  // Résumé
  summary: string
  nextSteps: string[]

  // Brut
  transcript: string
}