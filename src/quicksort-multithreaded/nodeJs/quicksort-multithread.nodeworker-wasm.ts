import { parentPort, workerData } from 'worker_threads';

import { loadWasmModule } from '../../lib/module-loader';

import type QuickSort from '../../../wasm/quicksort/types';

loadWasmModule<typeof QuickSort>('../wasm/quicksort/optimized.wasm').then((wasmModule) => {
    const { __pin, __unpin, __newArray, __getArray, __getArrayView } = wasmModule;
    const { array } = workerData;

    let arrayPtr = __pin(__newArray(wasmModule.i32Array_ID, array));

    const sortedArr = __getArray(wasmModule.quickSort(arrayPtr));

    parentPort?.postMessage(sortedArr);

    __unpin(arrayPtr);
});
