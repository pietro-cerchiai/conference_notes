import type { Contact } from "../types"

const SYSTEM_PROMPT = `
Tu es un assistant commercial expert en transport public français.

CONTEXTE MÉTIER :
- Les interlocuteurs travaillent pour des exploitants (Keolis, Transdev, RATP Dev, Flux), des SPL, des Autorités Organisatrices (AOM), des régions, des métropoles, des villes ou des bureaux d'études.
- Les réseaux de mobilité français : TCL (Lyon), RATP (Paris), TBM (Bordeaux), TAM (Montpellier), Tisséo (Toulouse), STAR (Rennes), TAN (Nantes), Ilevia (Lille), STAS (Saint-Étienne), Mistral (Grenoble), Irigo (Angers), Astuce (Rouen).
- Les titres courants : DG (Directeur Général), DAF (Directeur Administratif et Financier), DSI (Directeur des Systèmes d'Information), DGA (Directeur Général Adjoint), VP (Vice-Président), élu (conseiller régional, métropolitain, municipal), chef de projet, responsable billettique, responsable exploitation.

RÈGLES :
- Ne jamais inventer un nom si ce n'est pas clairement mentionné.
- Toujours normaliser les titres : "VP" reste "VP", "DIPI" devient "Directeur de projet innovation", "chargé de mission" reste tel quel.
- Si une ville est mentionnée, infère le réseau associé si tu le connais (ex: "Lyon" → "TCL").
- Les next steps doivent être des actions concrètes avec un verbe à l'infinitif (ex: "Envoyer la démo", "Relancer par email", "Proposer un RDV").
- Le résumé doit être factuel, 4-5 phrases maximum.
`

const PROMPT = (transcript: string) => `
${SYSTEM_PROMPT}

À partir de cette dictée d'un échange lors d'une conférence (MOBCO), extrais les informations suivantes.

Dictée : "${transcript}"

Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après, sans balises markdown.
Format exact :
{
  "firstName": "prénom ou chaîne vide",
  "lastName": "nom ou chaîne vide",
  "company": "société ou réseau de transport ou chaîne vide",
  "orgType": "exploitant|SPL|région|ville|autorité organisatrice|bureau d'études|autre ou chaîne vide",
  "role": "fonction normalisée ou chaîne vide",
  "summary": "résumé factuel de l'échange en 4-5 phrases",
  "nextSteps": ["action concrète 1", "action concrète 2"]
}
`

async function callClaude(transcript: string): Promise<Partial<Contact>> {
  const res = await fetch("http://localhost:3001/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: PROMPT(transcript) }),
  })
  const data = await res.json()
  const raw = data.content?.[0]?.text ?? "{}"
  const clean = raw.replace(/```json|```/g, "").trim()
  return JSON.parse(clean)
}

export async function analyzeTranscript(transcript: string): Promise<Partial<Contact>> {
  try {
    return await callClaude(transcript)
  } catch (err) {
    console.error("Erreur AI:", err)
    return {
      firstName: "",
      lastName: "",
      summary: "Erreur lors de l'analyse — vérifie ta clé API",
      nextSteps: [],
    }
  }
}