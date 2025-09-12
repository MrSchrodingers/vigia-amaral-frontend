import type { LegalProcessDetails, PartyPolo } from "./types"
import type { PartyLite, LegalProcessWithParties } from "./types"

export const toPartyLite = (parts?: LegalProcessDetails["parties"]): PartyLite[] => {
  if (!parts) return []
  return parts
    .map((p: any) => {
      const polo = p?.polo
      const name = p?.name ?? p?.nome
      if (!name) return null

      const normalizedPolo: PartyPolo = polo === "ATIVO" ? "ATIVO" : "PASSIVO"

      return {
        id: p?.id ?? p?.identificador,
        name,
        polo: normalizedPolo,
        ajg: p?.ajg ?? undefined,
        sigilosa: p?.sigilosa ?? undefined,
      }
    })
    .filter(Boolean) as PartyLite[]
}

export const groupData = <T>(data: T[], getKey: (item: T) => string | undefined): Record<string, T[]> => {
  return data.reduce((acc, item) => {
    const key = getKey(item)
    if (key) {
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
    }
    return acc
  }, {} as Record<string, T[]>)
}

export const findAuthorName = (process: LegalProcessWithParties): string => {
  if (process.parties && Array.isArray(process.parties)) {
    const author = process.parties.find((p) => p.polo === "ATIVO")
    if (author?.name) return author.name
  }
  if (process.autor_nome) return process.autor_nome
  return "Autor Desconhecido"
}