export const minifyStr = (str : string = '' ) => {
    let temporary = str
    if (str) {
        temporary = `${str.slice(0, 6)}...${str.slice(-4)}`
        temporary = temporary.toLowerCase()
    }
    return temporary
}