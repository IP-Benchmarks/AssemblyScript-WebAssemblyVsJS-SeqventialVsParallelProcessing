import { loadWasmModule } from '@ip/benchmark/glue/module-loader';
import { parentPort, workerData } from 'worker_threads';

// needed as web workers have them and webpack assumes it is available to store the chunks to load in it
const self = globalThis;

import type { QuickSortWasm } from '@ip/wasm-generated-js';
loadWasmModule<typeof QuickSortWasm>('./assets/wasm/quicksort/optimized.wasm').then((wasmModule) => {
    const { __pin, __unpin, __newArray, __getArray, __getArrayView } = wasmModule;
    const { array } = workerData;

    let arrayPtr = __pin(__newArray(wasmModule.i32Array_ID, array));

    const sortedArr = __getArray(wasmModule.quickSort(arrayPtr));

    parentPort.postMessage(sortedArr);

    __unpin(arrayPtr);
});
