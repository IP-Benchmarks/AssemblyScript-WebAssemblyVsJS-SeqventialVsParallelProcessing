import { IMetrics, MetricsTypes } from './interfaces/metrics.interface';
import { loadJsModule, loadWasmModule } from './lib/module-loader';

import type ArrayGenerator from '../wasm/array-generator/types.d';
import type ArrayGeneratorJs from '../wasm/js/array-generator.d';
export async function arrayGeneratorWasm(length: number, min: number, max: number, metrics: IMetrics) {
    metrics.start();

    const wasmModule = await loadWasmModule<typeof ArrayGenerator>('./wasm/array-generator/optimized.wasm');

    metrics.loadTime.set(`${MetricsTypes.ArrayGeneration} - ${MetricsTypes.Wasm}`, metrics.stop());
    metrics.start();

    const { __pin, __unpin, __newArray, __getArray, __getArrayView } = wasmModule;
    let arrayPtr = __pin(wasmModule.createArray(length));
    wasmModule.fillArray(arrayPtr, min, max);
    const array = __getArray(arrayPtr);

    // console.log('Generated values:', jsArray.join(', '));
    metrics.computingTime.set(`${MetricsTypes.ArrayGeneration} - ${MetricsTypes.Wasm}`, metrics.stop());

    __unpin(arrayPtr);
    return array;
}

export async function arrayGeneratorJs(length: number, min: number, max: number, metrics: IMetrics) {
    metrics.start();

    const jsModule = await loadJsModule<typeof ArrayGeneratorJs>('./wasm/js/array-generator.js');

    metrics.loadTime.set(`${MetricsTypes.ArrayGeneration} - ${MetricsTypes.Js}`, metrics.stop());
    metrics.start();

    let array = jsModule.createArray(length);
    array = jsModule.fillArray(array, min, max);

    // console.log('Generated values:', array.join(', '));
    metrics.computingTime.set(`${MetricsTypes.ArrayGeneration} - ${MetricsTypes.Js}`, metrics.stop());

    return array;
}
