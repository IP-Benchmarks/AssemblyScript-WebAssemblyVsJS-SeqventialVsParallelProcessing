import { parentPort, workerData } from 'worker_threads';

import { loadJsModule } from '../../glue-code/module-loader';

import type * as QuickSort from '../../../../../../wasm/js/quicksort.d';
loadJsModule<typeof QuickSort>('./assets/wasm/js/quicksort.js').then((jsModule) => {
    const { array } = workerData;

    const sortedArr = jsModule.quickSort(array);
    parentPort?.postMessage(sortedArr);
});
