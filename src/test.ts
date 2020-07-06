export const test = <T>(a: T, b: T, message: string) => {
    try {
        if (JSON.stringify(a) !== JSON.stringify(b)) {
            throw new Error(`${message} did not pass`)
        }
    } catch (err) {
        console.error(err)
        return false
    }
    console.log(`${message} passed`)
    return true
}