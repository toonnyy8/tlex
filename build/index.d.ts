type typeNFA = Array<{ action: string, offsets: Array<number> }>

type typeDFALink = { action: string, next: number }
type typeDFA = Array<{ exit: boolean, links: Array<typeDFALink> }>

type typeRule = { token: string, dfa: typeDFA }

type typeToken = { token: string, value: string, line: number, col: number }

export declare const char: (elem: RegExp) => typeNFA
export declare const chars: (...elems: RegExp[]) => Array<typeNFA>
export declare const and: (...vocs: Array<typeNFA>) => typeNFA
export declare const or: (...vocs: Array<typeNFA>) => typeNFA
export declare const kleene: (voc: typeNFA) => typeNFA
export declare const rule: (token: string, exp: typeNFA) => typeRule
export declare const Driver: (...rules: typeRule[]) => {
    reset: () => void,
    addCode: (code: string) => string,
    genToken: () => 0 | 1 | -1,
    getToken: () => typeToken,
    dropToken: () => 0 | -1,
}