export function createArray(length: i32): i32[] {
    var array = new Array<i32>(length).fill(0);
    return array;
}

export function fillArray(arr: i32[], min: i32, max: i32): i32[] {
    for (let i = 0, k = arr.length; i < k; ++i) {
        let value = i32(Math.floor(Math.random() * (max - min + 1)) + min);
        unchecked((arr[i] = value));
    }
    return arr;
}
