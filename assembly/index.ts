// // The entry file of your WebAssembly module.

// export function add(a: i32, b: i32): i32 {
//     return a + b;
// }

/** Creates a new array and returns it to JavaScript. */
export function createArray(length: i32): Int32Array {
    return new Int32Array(length);
}

/** Randomizes the specified array's values. */
export function randomizeArray(arr: Int32Array): void {
    for (let i = 0, k = arr.length; i < k; ++i) {
        let value = i32((Math.random() * 2.0 - 1.0) * i32.MAX_VALUE);
        unchecked((arr[i] = value));
    }
}

/** Computes the sum of an array's values and returns the sum to JavaScript. */
export function sumArray(arr: Int32Array): i32 {
    let total = 0;
    for (let i = 0, k = arr.length; i < k; ++i) {
        total += unchecked(arr[i]);
    }
    return total;
}

// We'll need the unique Int32Array id when allocating one in JavaScript
export const Int32Array_ID = idof<Int32Array>();
export const i32Array_ID = idof<i32[]>();

function partition(array: i32[], left: i32, right: i32): i32 {
    const pivot = array[Math.floor((right + left) / 2) as i32];
    let i = left;
    let j = right;

    while (i <= j) {
        while (array[i] < pivot) {
            i++;
        }

        while (array[j] > pivot) {
            j--;
        }

        if (i <= j) {
            const temp = array[j];
            array[j] = array[i];
            array[i] = temp;
            i++;
            j--;
        }
    }

    return i;
}

export function quickSort(array: i32[], left: i32, right: i32): i32[] {
    if (array.length > 1) {
        let index = partition(array, left, right);

        if (left < index - 1) {
            quickSort(array, left, index - 1);
        }

        if (index < right) {
            quickSort(array, index, right);
        }
    }

    return array;
}
