import { typeNFA } from './type'

/**
 * 將 Input RegExp 變成 Nondeterministic Finite Automata(NFA)
 */
export const char = (elem: RegExp): typeNFA => [{ action: elem.source, offsets: [1] }, { action: "", offsets: <number[]>[] }]

/**
 * 將多個 RegExp 變成多個 Nondeterministic Finite Automata(NFA)
 */
export const chars = (...elems: RegExp[]): Array<typeNFA> => {
    return elems
        .map(elem => char(elem))
}

/**
 * 將多個 NFA 串聯起來
 */
export const and = (...nfas: Array<typeNFA>): typeNFA => {
    if (nfas.length > 1) return [
        ...nfas[0].slice(0, -1), { ...nfas[0].slice(-1)[0], offsets: [1] },
        ...and(...nfas.slice(1))
    ]
    else return [...nfas[0]]
}

/**
 * 將多個 NFA 並聯起來
 */
export const or = (...nfas: Array<typeNFA>): typeNFA => {
    if (nfas.length > 1) {
        let _or = or(...nfas.slice(1))
        return <typeNFA>[
            { action: null, offsets: [1, nfas[0].length + 1] },
            ...nfas[0].slice(0, -1), { ...nfas[0].slice(-1)[0], offsets: [_or.length + 1] },
            ..._or.slice(0, -1), { ..._or.slice(-1)[0], offsets: [1] },
            { action: null, offsets: [] }
        ]
    } else return [...nfas[0].slice(0, -1), { ...nfas[0].slice(-1)[0], offsets: [] },]
}

/**
 * 將 Input NFA 變成 Kleene Closure
 */
export const kleene = (nfa: typeNFA): typeNFA => {
    return <typeNFA>[
        { action: null, offsets: [1, nfa.length + 1] },
        ...nfa.slice(0, -1), { ...nfa.slice(-1)[0], offsets: [-nfa.length + 1, 1] },
        { action: null, offsets: [] }
    ]
}