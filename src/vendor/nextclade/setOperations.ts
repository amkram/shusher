// From nextclade
// https://github.com/nextstrain/nextclade

export function intersection<T>(a: Set<T>, b: Set<T>) {
    return new Set([...a].filter((i) => b.has(i)))
}