import { arrAdd, arrEq, arrMerge } from "./arr"
import { typeInterClosureLink, typeInterClosure, typeClosure } from "./type"
import { typeNFA, typeDFA } from "../type"

const InterClosure = (nfa: typeNFA, state = 0): typeInterClosure => {
    const _InterClosure = (nfa: typeNFA, state = 0): typeInterClosure => {
        if (nfa[state].action === "") {
            return nfa[state]
                .offsets
                .map(offset => _InterClosure(nfa, state + offset))
                .reduce((last, cl) =>
                    ({
                        elems: [...last.elems, ...cl.elems],
                        links: [...last.links, ...cl.links]
                    }),
                    <typeInterClosure>{ elems: [state], links: [] }
                )
        } else {
            return <typeInterClosure>{
                elems: [state],
                links: [{ action: nfa[state].action, toElems: [state + nfa[state].offsets[0]] }]
            }
        }
    }
    let icl = _InterClosure(nfa, state)
    icl = {
        elems: [...icl.elems]
            .sort((a, b) => a - b),
        links: mergeILinks(icl.links),
    }

    return icl
}

const mergeILinks = (ilinks: Array<typeInterClosureLink>) => {
    return [...ilinks]
        .sort((a, b) => a.action > b.action ? 1 : a.action === b.action ? 0 : -1)
        .reduce((prevs, curr) => {
            if (prevs.length != 0) {
                let prev = prevs[prevs.length - 1]
                if (prev.action === curr.action) return [
                    ...prevs.slice(0, -1),
                    { ...prev, toElems: arrMerge(prev.toElems, curr.toElems, (a, b) => a === b) }
                ]
                else return [...prevs, curr]
            }
            else return [curr]
        }, <Array<typeInterClosureLink>>[])
}
const mergeIclosures = (iclosures: typeInterClosure[]): typeInterClosure => {
    return iclosures
        .reduce((prev, curr) => {
            return {
                elems: arrMerge(prev.elems, curr.elems, (a, b) => a === b).sort((a, b) => a - b),
                links: mergeILinks(
                    arrMerge(
                        prev.links,
                        curr.links,
                        (a, b) => a.action === b.action && arrEq(a.toElems, b.toElems, (a, b) => a === b),
                    )
                )
            }
        }, <typeInterClosure>{ elems: [], links: [] })
}
const unfold = (nfa: typeNFA): typeClosure[] => {
    let solved: typeClosure[] = []
    let unsolved: typeInterClosure[] = [InterClosure(nfa)]

    while (unsolved.length !== 0) {
        let { all, now } = unsolved[0]
            .links
            .reduce(({ all, now }, link) => {
                let icls = link.toElems.map(toElem => InterClosure(nfa, toElem))
                let icl = mergeIclosures(icls)
                let idx = all.findIndex((_cl) => arrEq(icl.elems, _cl.elems, (a, b) => a === b))
                if (idx === -1) {
                    now = { ...now, links: [...now.links, { action: link.action, toClosure: all.length }] }
                    return { all: [...all, icl], now }
                }
                else {
                    now = { ...now, links: [...now.links, { action: link.action, toClosure: idx }] }
                    return { all, now }
                }
            }, { all: [...solved, ...unsolved], now: <typeClosure>{ elems: unsolved[0].elems, links: [] } })
        unsolved = <Array<typeInterClosure>>all.slice(solved.length + 1)
        solved = [...solved, now]
    }

    return solved
}

export const toDFA = (nfa: typeNFA): typeDFA => {
    let cls = unfold(nfa)
    return <typeDFA>cls.map(cl => {
        if (cl.elems[cl.elems.length - 1] === nfa.length - 1) {
            return { exit: true, links: cl.links.map(link => ({ action: link.action, next: link.toClosure })) }
        } else {
            return { exit: false, links: cl.links.map(link => ({ action: link.action, next: link.toClosure })) }
        }
    })
}