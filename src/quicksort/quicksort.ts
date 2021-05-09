import { loadJsModule, loadWasmModule } from '../lib/module-loader';
import { getTime, timer } from '../lib/performance-counter';

import type QuickSort from '../../wasm/quicksort/types';
import type QuickSortJs from '../../wasm/js/quicksort';
export async function quickSortWasm(array: number[]) {
    const wasmModule = await loadWasmModule<typeof QuickSort>('./wasm/quicksort/optimized.wasm');
    const { __pin, __unpin, __newArray, __getArray, __getArrayView } = wasmModule;

    let arrayPtr = __pin(__newArray(wasmModule.i32Array_ID, array));
    // console.log('values:', __getArray(arrayPtr).join(', '));

    let timeNow = getTime();

    wasmModule.quickSort(arrayPtr);

    let delta = timer().now() - timeNow;
    let sortedArr = __getArray(arrayPtr);
    // console.log('sorted values:', __getArray(arrayPtr).join(', '));
    __unpin(arrayPtr);

    console.log('WASM - Time spent:', delta);
    return sortedArr;
}

export async function quickSortJs(array: number[]) {
    const jsModule = await loadJsModule<typeof QuickSortJs>('./wasm/js/quicksort.js');
    // console.log('values:', array.join(', '));
    let timeNow = getTime();
    const sortedArr = jsModule.quickSort(array);
    let delta = timer().now() - timeNow;
    // console.log('sorted values:', sortedArr.join(', '));
    console.log('JS - Time spent:', delta);
    return sortedArr;
}
