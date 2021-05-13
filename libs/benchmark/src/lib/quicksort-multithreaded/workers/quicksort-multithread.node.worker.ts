import { loadJsModule } from '@ip/benchmark/glue/module-loader';
import { parentPort, workerData } from 'worker_threads';

import type { QuickSort } from '@ip/wasm-generated-js';

import('@ip/wasm-generated-js-import/quicksort.js').then((module) => {
    const jsModule = loadJsModule<typeof QuickSort>(module);
    const { array } = workerData;

    const sortedArr = jsModule.quickSort(array);
    parentPort.postMessage(sortedArr);
});
