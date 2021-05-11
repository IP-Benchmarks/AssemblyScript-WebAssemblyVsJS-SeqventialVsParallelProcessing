import { loadWasmModule } from '../../glue-code/module-loader';

import type QuickSort from '../../../../../../wasm/quicksort/types';

onmessage = async ({ data }) => {
    const wasmModule = await loadWasmModule<typeof QuickSort>('./assets/wasm/quicksort/optimized.wasm');
    const { __pin, __unpin, __newArray, __getArray, __getArrayView } = wasmModule;
    const { array } = data;

    let arrayPtr = __pin(__newArray(wasmModule.i32Array_ID, array));

    const sortedArr = __getArray(wasmModule.quickSort(arrayPtr));

    postMessage(sortedArr);
    __unpin(arrayPtr);
};
