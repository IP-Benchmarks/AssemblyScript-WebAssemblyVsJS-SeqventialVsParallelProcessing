export function chunkArray(arr: any[], chunkLimit: number) {
    return Array.from(Array(Math.ceil(arr.length / chunkLimit)), (_, i) => arr.slice(i * chunkLimit, i * chunkLimit + chunkLimit));
}
