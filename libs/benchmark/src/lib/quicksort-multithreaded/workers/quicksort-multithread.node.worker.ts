import { loadJsModule } from '@ip/benchmark/glue/module-loader';
import { parentPort, workerData } from 'worker_threads';

// needed as web workers have them and webpack assumes it is available to store the chunks to load in it
const self = globalThis;

import type { QuickSort } from '@ip/wasm-generated-js';

import('@ip/wasm-generated-js-import/quicksort.js').then((module) => {
    const jsModule = loadJsModule<typeof QuickSort>(module);
    const { array } = workerData;

    const sortedArr = jsModule.quickSort(array);
    parentPort.postMessage(sortedArr);
});
