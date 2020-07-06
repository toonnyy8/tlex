import { typeTokenValue } from "./internal/type"
import { typeNFA, typeRule, typeToken } from "./type"
import { toDFA } from "./internal/dfa"

export const rule = (token: string, exp: typeNFA): typeRule => ({
    token: token,
    dfa: toDFA(exp),
})

export const Driver = (...rules: typeRule[]): {
    reset: () => void,
    addCode: (code: string) => string,
    genToken: () => 0 | 1 | -1,
    getToken: () => typeToken,
    dropToken: () => 0 | -1,
} => {
    let states: Array<number> = new Array(rules.length).fill(0)
    let tokensValue: Array<typeTokenValue> = new Array(rules.length).fill({ value: "", temp: "" })

    let _rules = rules
        .map(rule => ({
            ...rules,
            dfa: rule
                .dfa
                .map(_dfa => ({
                    ..._dfa,
                    links: _dfa
                        .links
                        .map(link => ({
                            ...link,
                            action: new RegExp(link.action)
                        }))
                }))
        }))
    let source: string
    let line: number = 0
    let col: number = 0
    let token: typeToken = { token: "", symbol: "", line, col }
    // generated = -1 : semifinished
    // generated = 0  : not generated
    // generated = 1  : finished
    let generated: -1 | 0 | 1

    let reset = () => {
        source = ""
        line = 0
        col = 0
    }
    let addCode = (code: string) => {
        source += code
        return source
    }

    let genToken = () => {
        if (source[0] === "\n") {
            line += 1
            col = 0
        }
        switch (generated) {
            case -1: {
                if (source.length !== 0) {
                    states = _rules
                        .map((rule, idx) => {
                            if (states[idx] !== -1) {
                                tokensValue[idx] = {
                                    symbol: tokensValue[idx].symbol,
                                    temp: tokensValue[idx].temp + source[0]
                                }
                                if (rule.dfa[states[idx]].exit) {
                                    tokensValue[idx] = {
                                        symbol: tokensValue[idx].symbol + tokensValue[idx].temp,
                                        temp: ""
                                    }
                                }
                                let link = rule.dfa[states[idx]]
                                    .links
                                    .find(link => link
                                        .action
                                        .test(source[0]))
                                if (link !== undefined) {

                                    return link.next
                                } else return -1
                            } else return -1
                        })
                }
                break
            }
            case 0: {
                if (source.length !== 0) {

                }
                break
            }
            case 1: {
                break
            }
        }
        return generated
    }
    let getToken = () => ({ ...token })
    let dropToken = () => {
        switch (generated) {
            case 0: {
                generated = 0
                break
            }
            case 1: {
                generated = 0
                break
            }
        }
        return generated
    }

    return { reset, addCode, genToken, getToken, dropToken }
}
