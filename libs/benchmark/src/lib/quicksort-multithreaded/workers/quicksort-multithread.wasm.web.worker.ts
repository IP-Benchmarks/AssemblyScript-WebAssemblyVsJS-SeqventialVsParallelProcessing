import { ASUtil } from '@assemblyscript/loader';
import { loadWasmModule } from '@ip/benchmark/glue/module-loader';

import type { QuickSortWasm } from '@ip/wasm-generated-js';

let wasmModule: typeof QuickSortWasm  & ASUtil;
globalThis.onmessage = async ({ data }) => {
    if (!wasmModule) wasmModule = await loadWasmModule<typeof QuickSortWasm>('./assets/wasm/quicksort/optimized.wasm');
    const { __pin, __unpin, __newArray, __getArray, __getArrayView } = wasmModule;
    const { array } = data;

    let arrayPtr = __pin(__newArray(wasmModule.i32Array_ID, array));

    const sortedArr = __getArray(wasmModule.quickSort(arrayPtr));

    globalThis.postMessage(sortedArr);
    __unpin(arrayPtr);
};
