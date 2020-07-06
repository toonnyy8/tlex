export type typeNFA = Array<{ action: string, offsets: Array<number> }>

export type typeDFALink = { action: string, next: number }
export type typeDFA = Array<{ exit: boolean, links: Array<typeDFALink> }>

export type typeInterClosureLink = { action: string, toElems: Array<number> }
export type typeInterClosure = { elems: Array<number>, links: Array<typeInterClosureLink> }

export type typeClosureLink = { action: string, toClosure: number }
export type typeClosure = { elems: Array<number>, links: Array<typeClosureLink> }

export type typeRule = { token: string, dfa: typeDFA }

export type typeToken = { token: string, value: string, line: number, col: number }

export type typeTokenValue = { value: string, temp: string }