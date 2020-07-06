import { typeNFA } from './type'

export const char = (elem: RegExp): typeNFA => [{ action: elem.source, offsets: [1] }, { action: "", offsets: <number[]>[] }]
export const chars = (...elems: RegExp[]): Array<typeNFA> => {
    return elems
        .map(elem => char(elem))
}

export const and = (...vocs: Array<typeNFA>): typeNFA => {
    if (vocs.length > 1) return [
        ...vocs[0].slice(0, -1), { ...vocs[0].slice(-1)[0], offsets: [1] },
        ...and(...vocs.slice(1))
    ]
    else return [...vocs[0]]
}

export const or = (...vocs: Array<typeNFA>): typeNFA => {
    if (vocs.length > 1) {
        let _or = or(...vocs.slice(1))
        return <typeNFA>[
            { action: null, offsets: [1, vocs[0].length + 1] },
            ...vocs[0].slice(0, -1), { ...vocs[0].slice(-1)[0], offsets: [_or.length + 1] },
            ..._or.slice(0, -1), { ..._or.slice(-1)[0], offsets: [1] },
            { action: null, offsets: [] }
        ]
    } else return [...vocs[0].slice(0, -1), { ...vocs[0].slice(-1)[0], offsets: [] },]
}

export const kleene = (voc: typeNFA): typeNFA => {
    return <typeNFA>[
        { action: null, offsets: [1, voc.length + 1] },
        ...voc.slice(0, -1), { ...voc.slice(-1)[0], offsets: [-voc.length + 1, 1] },
        { action: null, offsets: [] }
    ]
}