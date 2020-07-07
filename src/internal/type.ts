export type typeInterClosureLink = { action: string, toElems: Array<number> }
export type typeInterClosure = { elems: Array<number>, links: Array<typeInterClosureLink> }

export type typeClosureLink = { action: string, toClosure: number }
export type typeClosure = { elems: Array<number>, links: Array<typeClosureLink> }

export type typeTokenValue = { symbol: string, temp: string }

export type typeRegDFALink = { action: RegExp, next: number }
export type typeRegDFA = Array<{ exit: boolean, links: Array<typeRegDFALink> }>

export type typeRegRule = { token: string, dfa: typeRegDFA }