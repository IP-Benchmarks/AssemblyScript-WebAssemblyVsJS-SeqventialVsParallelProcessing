function partition(array: i32[], left: i32 = 0, right: i32 = array.length - 1): i32 {
    const pivot = unchecked(array[(right + left) >>> 1]); // compatible with both js and as; same as  same as array[Math.floor((right + left) / 2)]; in js or ame as array[(right + left) / 2] in as
    let i = left;
    let j = right;

    while (i <= j) {
        while (unchecked(array[i]) < pivot) {
            i++;
        }

        while (unchecked(array[j]) > pivot) {
            j--;
        }

        if (i <= j) {
            const temp = unchecked(array[j]);
            array[j] = unchecked(array[i]);
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
