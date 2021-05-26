// From nextclade (typescript types removed)
// https://github.com/nextstrain/nextclade

export function intersection(a, b) {
    return new Set([...a].filter((i) => b.has(i)))
}