export interface Torneo {
  id: number
  prog: number
  nome: string
  data: string // ISO: "2026-01-03"
}

export interface PartecipazioneTorneo {
  id: number
  torneoId: number
  userId: number

  // “Set Top 1” (o set usato in quel torneo)
  setId: number | null // null = assente / non ha giocato

  // Risultato
  posizione: number | null // null = assente
  vittorie?: number | null
  sconfitte?: number | null

  // Punti presi in quel torneo (es. +12)
  puntiOttenuti: number
}
