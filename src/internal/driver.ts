import { typeRegDFALink, typeRegDFA, typeRegRule } from "./type"
import { typeDFALink, typeDFA, typeRule } from "../type"

const createRegDFALinks = (links: Array<typeDFALink>): Array<typeRegDFALink> => {
    return links
        .map(link => ({
            ...link,
            action: new RegExp(link.action)
        }))
}
const createRegDFA = (dfa: typeDFA): typeRegDFA => {
    return dfa
        .map(dfaElem => ({
            ...dfaElem,
            links: createRegDFALinks(dfaElem.links)
        }))
}
export const createRegRule = (rule: typeRule): typeRegRule => {
    return ({
        ...rule,
        dfa: createRegDFA(rule.dfa)
    })
}

export const updateState = (regRule: typeRegRule, nowState: number, action: string): number => {
    let nextState = regRule
        ?.dfa[nowState]
        ?.links
        ?.find((link) => link
            .action
            .test(action))?.next
    return nextState !== undefined ? nextState : -1
}