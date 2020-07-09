import { typeTokenValue } from "./internal/type"
import { typeNFA, typeRule, typeToken } from "./type"
import { toDFA } from "./internal/dfa"
import { createRegRule, updateState, addAction2Temp, addTemp2Symbol } from "./internal/driver"

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
    let dataset = rules.map(r =>
        ({
            regRule: createRegRule(r),
            state: 0,
            tokenValue: { symbol: "", temp: "" }
        }))

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
                    let action = sources[0][0]
                    dataset = dataset
                        .map(({ regRule, state, tokenValue, }) => ({
                            regRule,
                            state: updateState(regRule, state, action,),
                            tokenValue,
                        }))
                        .map(({ regRule, state, tokenValue, }) => {
                            return state !== -1 ?
                                { regRule, state, tokenValue: addAction2Temp(tokenValue, action,), } :
                                { regRule, state, tokenValue, }
                        })
                        .map(({ regRule, state, tokenValue, }) => {
                            return regRule.dfa[state]?.exit ?
                                { regRule, state, tokenValue: addTemp2Symbol(tokenValue,), } :
                                { regRule, state, tokenValue, }
                        })

                    if (dataset.filter(({ state }) => state !== -1).length !== 0) {
                        if (action === "\n") {
                            _line += 1
                            _col = 0
                        } else {
                            _col += 1
                        }
                        sources = [sources[0].slice(1), ...sources.slice(1),]
                    } else break
                }
                let data = dataset
                    .slice(1)
                    .reduce((prev, curr) => {
                        if (prev.tokenValue.symbol < curr.tokenValue.symbol) {
                            return curr
                        } else return prev
                    }, dataset[0])
                sources = [data.tokenValue.temp + sources[0], ...sources.slice(1),]
                console.log(sources)
                if (sources.length === 0) {
                    if (sources[0].length === 0 &&
                        data.tokenValue.temp.length !== 0) {
                        console.warn("need add code")
                        generated = -1
                    }
                } else {
                    if (sources[0].length === 0 &&
                        data.tokenValue.temp.length !== 0) {
                        console.error("source code error")
                        generated = -1
                    }
                }

                token = {
                    token: data.regRule.token,
                    symbol: data.tokenValue.symbol,
                    line,
                    col,
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
                dataset = dataset.map(({ regRule }) => ({
                    regRule,
                    state: 0,
                    tokenValue: { symbol: "", temp: "" },
                }))
                generated = 0
                break
            }
        }
        return generated
    }

    return Object.freeze({ end, addCode, generate, getToken, drop })
}
