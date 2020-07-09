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
    end: () => { END: boolean },
    addCode: (code: string | (() => { END: boolean })) => string,
    generate: () => 0 | 1 | -1,
    getToken: () => typeToken,
    /**
     * 丟棄
     */
    drop: () => 0 | -1,
} => {
    let regRules = rules.map(r => createRegRule(r))

    let states: Array<number> = new Array(rules.length).fill(0)
    let tokensValue: Array<typeTokenValue> = new Array(rules.length).fill({ symbol: "", temp: "" })

    let sources: Array<string> = [""]
    let line: number = 0
    let col: number = 0
    let token: typeToken = { token: "", symbol: "", line, col }
    // generated = -1 : semifinished
    // generated = 0  : not generated
    // generated = 1  : finished
    let generated: -1 | 0 | 1 = 0

    const end = () => ({ "END": true })
    const addCode = (code: string | (() => { END: boolean })) => {
        if (typeof code === "string") {
            sources = [...sources.slice(0, -1), sources[sources.length - 1] + code]
        } else {
            sources = end().END ? [...sources, ""] : sources
        }
        return sources[sources.length]
    }

    const generate = () => {
        let _line = 0, _col = col
        switch (generated) {
            case -1: {
                if (sources.length < 1) {
                    throw new Error("A")
                } else if (sources[0].length === 0) {
                    throw new Error("B")
                }
            }
            case 0: {
                while (sources[0].length !== 0) {
                    states = regRules
                        .map((regRule, idx) => updateState(regRule, states[idx], sources[0][0]))
                    tokensValue = states
                        .map((state, idx) => {
                            return {
                                state: state,
                                tokenValue: {
                                    symbol: tokensValue[idx].symbol,
                                    temp: state !== -1 ?
                                        tokensValue[idx].temp + sources[0][0] :
                                        tokensValue[idx].temp
                                }
                            }
                        })
                        .map(({ state, tokenValue }, idx) => {
                            if (regRules[idx].dfa[state]?.exit) {
                                return {
                                    symbol: tokenValue.symbol +
                                        tokenValue.temp,
                                    temp: ""
                                }
                            } else {
                                return { ...tokenValue }
                            }
                        })
                    if (states.filter(state => state !== -1).length !== 0) {
                        if (sources[0][0] === "\n") {
                            _line += 1
                            _col = 0
                        } else {
                            _col += 1
                        }
                        sources = [sources[0].slice(1), ...sources.slice(1)]
                    } else break
                }
                let ruleNum = tokensValue
                    .reduce((prev, curr, idx) => {
                        if (tokensValue[prev].symbol < curr.symbol) {
                            return idx
                        } else return prev
                    }, 0)
                sources = [tokensValue[ruleNum].temp + sources[0], ...sources.slice(1)]
                console.log(sources)
                if (sources.length === 0) {
                    if (sources[0].length === 0 &&
                        tokensValue[ruleNum].temp.length !== 0) {
                        console.warn("need add code")
                        generated = -1
                    }
                } else {
                    if (sources[0].length === 0 &&
                        tokensValue[ruleNum].temp.length !== 0) {
                        console.error("source code error")
                        generated = -1
                    }
                }
                token = {
                    token: regRules[ruleNum].token,
                    symbol: tokensValue[ruleNum].symbol,
                    line,
                    col
                }

                line += _line
                col = _col
                generated = 1
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
                token = { token: "", symbol: "", line, col }
                states = new Array(rules.length).fill(0)
                tokensValue = new Array(rules.length).fill({ symbol: "", temp: "" })
                generated = 0
                break
            }
        }
        return generated
    }

    return Object.freeze({ end, addCode, generate, getToken, drop })
}
