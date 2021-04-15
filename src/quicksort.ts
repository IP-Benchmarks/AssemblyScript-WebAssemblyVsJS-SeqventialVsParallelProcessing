import { loadWasmModule } from './lib/module-loader';
import { getTime, timer } from './lib/performance-counter';

import type QuickSort from '../wasm/quicksort/types';
export async function quickSort(array: number[]) {
    const wasmModule = await loadWasmModule<typeof QuickSort>('./wasm/quicksort/optimized.wasm');
    const { __pin, __unpin, __newArray, __getArray, __getArrayView } = wasmModule;

    let arrayPtr = __pin(__newArray(wasmModule.i32Array_ID, array));
    console.log('values:', __getArray(arrayPtr).join(', '));

    let timeNow = getTime();

    wasmModule.quickSort(arrayPtr);

    let delta = timer().now() - timeNow;

    console.log('sorted values:', __getArray(arrayPtr).join(', '));
    __unpin(arrayPtr);

    console.log('Time spent:', delta);
}

export async function quickSortJs(array: number[]) {
    // const jsModule = await loadJsModule('./wasm/quicksort/optimized.js');
    // const { __new, __pin, __unpin, __collect, memory, __setArgumentsLength, quickSort } = jsModule;
    // let arrayPtr = __pin(__new(jsModule.i32Array_ID, array));
    // console.log('values:', __getArray(arrayPtr).join(', '));
    // let timeNow = getTime();
    // quickSort(arrayPtr);
    // let delta = timer().now() - timeNow;
    // console.log('sorted values:', __getArray(arrayPtr).join(', '));
    // __unpin(arrayPtr);
    // console.log('Time spent:', delta);
}
