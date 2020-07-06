export type typeInterClosureLink = { action: string, toElems: Array<number> }
export type typeInterClosure = { elems: Array<number>, links: Array<typeInterClosureLink> }

export type typeClosureLink = { action: string, toClosure: number }
export type typeClosure = { elems: Array<number>, links: Array<typeClosureLink> }

export type typeTokenValue = { symbol: string, temp: string }