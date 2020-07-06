import { typeNFA } from './type'

export const char = (elem: RegExp): typeNFA => [{ action: elem.source, offsets: [1] }, { action: "", offsets: <number[]>[] }]
export const chars = (...elems: RegExp[]): Array<typeNFA> => {
    return elems
        .map(elem => char(elem))
}

export const and = (...nfas: Array<typeNFA>): typeNFA => {
    if (nfas.length > 1) return [
        ...nfas[0].slice(0, -1), { ...nfas[0].slice(-1)[0], offsets: [1] },
        ...and(...nfas.slice(1))
    ]
    else return [...nfas[0]]
}

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

export const kleene = (nfa: typeNFA): typeNFA => {
    return <typeNFA>[
        { action: null, offsets: [1, nfa.length + 1] },
        ...nfa.slice(0, -1), { ...nfa.slice(-1)[0], offsets: [-nfa.length + 1, 1] },
        { action: null, offsets: [] }
    ]
}