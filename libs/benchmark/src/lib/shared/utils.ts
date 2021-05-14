export function chunkArray(arr: any[], chunkLimit: number) {
    return Array.from(Array(Math.ceil(arr.length / chunkLimit)), (_, i) => arr.slice(i * chunkLimit, i * chunkLimit + chunkLimit));
}

export function testArray(sorted: number[], checkArray: number[], message: string, callback?: () => void) {
    if (JSON.stringify(sorted) !== JSON.stringify(checkArray)) {
        if (callback) callback();
        console.error(message);
    }
}
