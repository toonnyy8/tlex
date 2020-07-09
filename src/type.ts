export type typeNFA = Array<{ action: string, offsets: Array<number> }>

export type typeDFALink = { action: string, next: number }
export type typeDFA = Array<{ exit: boolean, links: Array<typeDFALink> }>

export type typeRule = { token: string, dfa: typeDFA }

export type typeToken = { token: string, symbol: string }