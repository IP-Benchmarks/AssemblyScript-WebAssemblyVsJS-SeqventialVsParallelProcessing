function partition(array: i32[], left: i32 = 0, right: i32 = array.length - 1): i32 {
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

export function quickSort(array: i32[], left: i32 = 0, right: i32 = array.length - 1): i32[] {
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

export const Int32Array_ID = idof<Int32Array>();
export const i32Array_ID = idof<i32[]>();
