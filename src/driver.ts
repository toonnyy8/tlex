import { typeTokenValue } from "./internal/type"
import { typeNFA, typeRule, typeToken } from "./type"
import { toDFA } from "./internal/dfa"
import { createRegRule, updateState } from "./internal/driver"

/**
 * 輸入 Token Name 與 NFA 後回傳 Token Rule
 */
export const rule = (token: string, exp: typeNFA): typeRule => ({
    token: token,
    dfa: toDFA(exp),
})

/**
 * 輸入多條 Token Rule 後回傳 Lexical Analyzer
 */
export const Driver = (...rules: typeRule[]): {
    reset: () => void,
    addCode: (code: string) => string,
    generate: () => 0 | 1 | -1,
    getToken: () => typeToken,
    /**
     * 丟棄
     */
    drop: () => 0 | -1,
} => {
    let states: Array<number> = new Array(rules.length).fill(0)
    let tokensValue: Array<typeTokenValue> = new Array(rules.length).fill({ value: "", temp: "" })

    let regRules = rules.map(r => createRegRule(r))
    let source: string
    let line: number = 0
    let col: number = 0
    let token: typeToken = { token: "", symbol: "", line, col }
    // generated = -1 : semifinished
    // generated = 0  : not generated
    // generated = 1  : finished
    let generated: -1 | 0 | 1

    const reset = () => {
        source = ""
        line = 0
        col = 0
    }
    const addCode = (code: string) => {
        source += code
        return source
    }

    const generate = () => {
        if (source[0] === "\n") {
            line += 1
            col = 0
        }
        switch (generated) {
            case -1: {
                if (source.length !== 0) {
                    // states = regRules
                    //     .map((regRule, idx) => updateState(regRule, states[idx], source[0]))
                    // tokensValue = states
                    //     .map((state, idx) => {
                    //         return {
                    //             symbol: tokensValue[idx].symbol,
                    //             temp: state !== -1 ?
                    //                 tokensValue[idx].temp + source[0] :
                    //                 tokensValue[idx].temp
                    //         }
                    //     })
                    states = regRules
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
    const getToken = () => ({ ...token })
    const drop = () => {
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

    return Object.freeze({ reset, addCode, generate, getToken, drop })
}
