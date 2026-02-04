export interface Stagione {
  id: number
  nome: string            // "Torneo Mega Galattico"
  anno: number            // 2025
  numeroTappe: number     // es. 6
}


export interface Tappa {
  id: number
  stagioneId: number
  numero: number          // 1..6
  data: string            // "2025-08-30"
}


export interface PartecipazioneTappa {
  id: number
  tappaId: number
  userId: number

  posizione: number | null  // null = assente
  vittorie?: number | null
  sconfitte?: number | null

  punti: number             // es. 12/9/6/3/0 (0 anche per assente se vuoi)
  bonus: number             // es. +1, +3, -2 (default 0)

  setId?: number | null     // opzionale, se vuoi mostrare il set giocato nella tappa
}
