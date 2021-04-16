import { loadJsModule, loadWasmModule } from './lib/module-loader';
import { getTime, timer } from './lib/performance-counter';

import type ArrayGenerator from '../wasm/array-generator/types.d';
import type ArrayGeneratorJs from '../wasm/js/array-generator.d';
export async function arrayGenerator(length: number) {
    const wasmModule = await loadWasmModule<typeof ArrayGenerator>('./wasm/array-generator/optimized.wasm');
    const { __pin, __unpin, __newArray, __getArray, __getArrayView } = wasmModule;

    let timeNow = getTime();

    let arrayPtr = __pin(wasmModule.createArray(length));
    wasmModule.fillArray(arrayPtr, 0, 10000);

    let delta = timer().now() - timeNow;
    const jsArray = __getArray(arrayPtr);

    // console.log('Generated values:', jsArray.join(', '));
    console.log('ArrayGenerator WASM - Time spent:', delta);

    __unpin(arrayPtr);

    return jsArray;
}

export async function arrayGeneratorJs(length: number) {
    const jsModule = await loadJsModule<typeof ArrayGeneratorJs>('./wasm/js/array-generator.js');
    let timeNow = getTime();

    let array = jsModule.createArray(length);
    array = jsModule.fillArray(array, 0, 10000);

    let delta = timer().now() - timeNow;

    // console.log('Generated values:', array.join(', '));
    console.log('ArrayGeneratorJs - Time spent:', delta);

    return array;
}
