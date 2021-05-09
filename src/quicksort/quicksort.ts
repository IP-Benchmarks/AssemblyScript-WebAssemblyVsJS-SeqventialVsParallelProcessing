import { IMetrics, MetricsTypes } from '../interfaces/metrics.interface';
import { loadJsModule, loadWasmModule } from '../lib/module-loader';

import type QuickSort from '../../wasm/quicksort/types';
import type QuickSortJs from '../../wasm/js/quicksort';
export async function quickSortWasm(array: number[], metrics: IMetrics) {
    metrics.start();

    const wasmModule = await loadWasmModule<typeof QuickSort>('./wasm/quicksort/optimized.wasm');

    metrics.loadTime.set(`${MetricsTypes.Wasm} - ${MetricsTypes.QuickSort} ${MetricsTypes.LoadTime}`, metrics.stop());
    metrics.start();

    const { __pin, __unpin, __newArray, __getArray, __getArrayView } = wasmModule;
    let arrayPtr = __pin(__newArray(wasmModule.i32Array_ID, array));
    wasmModule.quickSort(arrayPtr);
    let sortedArr = __getArray(arrayPtr);

    metrics.loadTime.set(`${MetricsTypes.Wasm} - ${MetricsTypes.QuickSort} ${MetricsTypes.ComputingTime}`, metrics.stop());

    __unpin(arrayPtr);
    return sortedArr;
}

export async function quickSortJs(array: number[], metrics: IMetrics) {
    metrics.start();

    const jsModule = await loadJsModule<typeof QuickSortJs>('./wasm/js/quicksort.js');

    metrics.loadTime.set(`${MetricsTypes.Js} - ${MetricsTypes.QuickSort} ${MetricsTypes.LoadTime}`, metrics.stop());
    metrics.start();

    const sortedArr = jsModule.quickSort(array);

    metrics.loadTime.set(`${MetricsTypes.Js} - ${MetricsTypes.QuickSort} ${MetricsTypes.ComputingTime}`, metrics.stop());
    return sortedArr;
}
