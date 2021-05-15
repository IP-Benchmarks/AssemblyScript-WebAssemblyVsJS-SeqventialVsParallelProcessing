import { loadJsModule } from '@ip/benchmark/glue/module-loader';
import { parentPort, workerData } from 'worker_threads';

// needed as web workers have them and webpack assumes it is available to store the chunks to load in it
const self = globalThis;

import type { QuickSort } from '@ip/wasm-generated-js';
let jsModule: typeof QuickSort;
parentPort.on('message', async (workerData) => {
    if (!jsModule) jsModule = loadJsModule<typeof QuickSort>(await import('@ip/wasm-generated-js-import/quicksort.js'));
    const { array } = workerData;

    const sortedArr = jsModule.quickSort(array);
    parentPort.postMessage(sortedArr);
});
