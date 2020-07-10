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
    closeBuffer: () => void,
    openBuffer: () => void
    addCode: (code: string) => string,
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

    let source: string = ""
    let OPEN: boolean = true
    let token: typeToken = { token: "", symbol: "" }
    // generated = -1 : semifinished
    // generated = 0  : not generated
    // generated = 1  : finished
    let generated: -1 | 0 | 1 = 0

    const closeBuffer = () => { OPEN = false }
    const openBuffer = () => { OPEN = true }
    const addCode = (code: string) => {
        if (OPEN) source += code
        else console.error("Can't add code when closing")
        return source
    }

    const generate = () => {
        if (!OPEN &&
            source.length === 0) {
            console.warn("生成完畢")
            return generated
        }
        switch (generated) {
            case -1: {
                // if (sources.length < 1) {
                //     throw new Error("A")
                // } else if (sources[0].length === 0) {
                //     throw new Error("B")
                // }
            }
            case 0: {
                while (source.length !== 0) {
                    let action = source[0]
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
                        source = source.slice(1)
                    } else break
                }
                let data = dataset
                    .slice(1)
                    .reduce((prev, curr) => {
                        if (prev.tokenValue.symbol < curr.tokenValue.symbol) {
                            return curr
                        } else return prev
                    }, dataset[0])

                if (OPEN &&
                    source.length === 0) {
                    console.warn("Please add code or close the buffer")

                    generated = -1
                    return generated
                } else if
                    (!OPEN &&
                    data.tokenValue.symbol === ""

                ) {
                    console.error("source code error")

                    generated = -1
                    return generated
                }
                source = data.tokenValue.temp + source

                token = {
                    token: data.regRule.token,
                    symbol: data.tokenValue.symbol,
                }

                generated = 1
                break
            }
            case 1: {
                console.warn("Please drop the token")
                break
            }
        }
        return generated
    }
    const getToken = () => ({ ...token })
    const drop = () => {
        switch (generated) {
            case 0: {
                console.warn("No token needs to be dropped")
                break
            }
            case 1: {
                token = { token: "", symbol: "" }
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

    return Object.freeze({ closeBuffer, openBuffer, addCode, generate, getToken, drop })
}
