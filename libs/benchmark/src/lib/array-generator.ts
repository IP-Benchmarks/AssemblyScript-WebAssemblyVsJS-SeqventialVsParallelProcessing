import { loadJsModule, loadWasmModule } from '@ip/benchmark/glue/module-loader';

import { IMetrics, MetricsTypes } from './interfaces/metrics.interface';

import type { ArrayGenerator } from '@ip/wasm-generated-js';
import type { ArrayGeneratorWasm } from '@ip/wasm-generated-js';
export async function arrayGeneratorWasm(length: number, min: number, max: number, metrics: IMetrics) {
    metrics.start();
    let a: typeof ArrayGeneratorWasm;

    const wasmModule = await loadWasmModule<typeof ArrayGeneratorWasm>('./assets/wasm/array-generator/optimized.wasm');

    metrics.setLoadTime(`${MetricsTypes.ArrayGeneration} - ${MetricsTypes.Wasm}`, metrics.stop());
    metrics.start();

    const { __pin, __unpin, __newArray, __getArray, __getArrayView } = wasmModule;
    let arrayPtr = __pin(wasmModule.createArray(length));
    wasmModule.fillArray(arrayPtr, min, max);
    const array = __getArray(arrayPtr);

    // console.log('Generated values:', jsArray.join(', '));
    metrics.setComputingTime(`${MetricsTypes.ArrayGeneration} - ${MetricsTypes.Wasm}`, metrics.stop());

    __unpin(arrayPtr);
    return array;
}

export async function arrayGeneratorJs(length: number, min: number, max: number, metrics: IMetrics) {
    metrics.start();

    const jsModule = loadJsModule<typeof ArrayGenerator>(await import('@ip/wasm-generated-js-import/array-generator.js'));

    metrics.setLoadTime(`${MetricsTypes.ArrayGeneration} - ${MetricsTypes.Js}`, metrics.stop());
    metrics.start();

    let array = jsModule.createArray(length);
    array = jsModule.fillArray(array, min, max);

    // console.log('Generated values:', array.join(', '));
    metrics.setComputingTime(`${MetricsTypes.ArrayGeneration} - ${MetricsTypes.Js}`, metrics.stop());

    return array;
}
