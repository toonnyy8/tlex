export let arrEq = <T>(as: Array<T>, bs: Array<T>, eq: (a: T, b: T) => boolean) => {
    if (as.length !== bs.length) return false
    return as.find((a, idx) => !eq(a, bs[idx])) === undefined
}
export let arrAdd = <T>(as: Array<T>, b: T, eq: (a: T, b: T) => boolean) => {
    if (as.find((a) => eq(a, b)) === undefined) return [...as, b]
    else return [...as]
}
export let arrMerge = <T>(as: Array<T>, bs: Array<T>, eq: (a: T, b: T) => boolean) => {
    return bs.reduce((prevs, b) => arrAdd(prevs, b, eq), as)
}