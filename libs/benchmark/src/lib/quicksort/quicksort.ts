import { loadJsModule, loadWasmModule } from '../glue-code/module-loader';
import { IMetrics, MetricsTypes } from '../interfaces/metrics.interface';

import type * as QuickSort from '../../../../../wasm/js/quicksort.d';
import type QuickSortWasm from '../../../../../wasm/quicksort/types';
export async function quickSortWasm(array: number[], metrics: IMetrics) {
    metrics.start();

    const wasmModule = await loadWasmModule<typeof QuickSortWasm>('./assets/wasm/quicksort/optimized.wasm');

    metrics.loadTime.set(`${MetricsTypes.QuickSort} - ${MetricsTypes.Wasm} - `, metrics.stop());
    metrics.start();

    const { __pin, __unpin, __newArray, __getArray, __getArrayView } = wasmModule;
    let arrayPtr = __pin(__newArray(wasmModule.i32Array_ID, array));
    wasmModule.quickSort(arrayPtr);
    let sortedArr = __getArray(arrayPtr);

    metrics.computingTime.set(`${MetricsTypes.QuickSort} - ${MetricsTypes.Wasm}`, metrics.stop());

    __unpin(arrayPtr);
    return sortedArr;
}

export async function quickSortJs(array: number[], metrics: IMetrics) {
    metrics.start();

    const jsModule = await loadJsModule<typeof QuickSort>('./assets/wasm/js/quicksort.js');

    metrics.loadTime.set(`${MetricsTypes.QuickSort} - ${MetricsTypes.Js}`, metrics.stop());
    metrics.start();

    const sortedArr = jsModule.quickSort(array);

    metrics.computingTime.set(`${MetricsTypes.QuickSort} - ${MetricsTypes.Js}`, metrics.stop());
    return sortedArr;
}
